/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */
console.log('contentScript start');

const windowVarName = '__hideYtTimes';
const storageName = 'hideYtTimes';
const toggleButtonId = 'time-display-show';

function logError(error) {
  console.error(error);
}

function getStorageVar() {
  // Note: Once the Storage API gains promise support, this function can be greatly simplified.
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(storageName, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}

function updateWindowVar(initial) {
  if (window[windowVarName] === undefined) {
    window[windowVarName] = initial;
  } else {
    window[windowVarName] = !window[windowVarName];
  }
}

function setInitialWindowVar() {
  return getStorageVar().then((result) => {
    // new windows will initially show/hide based on the value in storage
    updateWindowVar(result[storageName]);
  }, logError);
}

function updateElementVisibility(element) {
  if (!element || !element.style) {
    return;
  }

  // youtube scripts edit visibility on actions like hover, but they don't use display, so we use display here to show / hide elements
  if (window[windowVarName] === true) {
    element.style.display = 'none';
  } else if (window[windowVarName] === false) {
    element.style.display = 'inline';
  }
}

function updateToggleButtonVisibility(toggleButton) {
  if (!toggleButton) {
    return;
  }

  // toggleButton follows the opposite logic from youtube's elements
  if (window[windowVarName] === true) {
    toggleButton.style.display = 'inline';
  } else if (window[windowVarName] === false) {
    toggleButton.style.display = 'none';
  }
}

function selectAndUpdateElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }
  // console.log(element);
  updateElementVisibility(element);
}

/*****************
 * remove timestamps while browsing lists (thumbnails)
 *****************/
function updateThumbnailTimestamps() {
  const timestampId = '#overlays';

  const timestamps = [...document.querySelectorAll(timestampId)];
  timestamps.forEach(updateElementVisibility);
}

/*****************
 * remove relevant things on video player page
 *****************/
function updateVideoPlayerProgress() {
  // TODO: simplify selectors in this function

  // const parentSelector = '#movie_player > div.ytp-chrome-bottom >'
  const progressBarSelector = 'div.ytp-progress-bar-container';

  const totalTimeSelector =
    'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-duration';

  const thumbnailTimeSelector =
    '#overlays > ytd-thumbnail-overlay-time-status-renderer';

  // TODO: add selector for thumbnails at video end?

  const playerSelectors = [
    progressBarSelector,
    totalTimeSelector,
    thumbnailTimeSelector,
  ];

  playerSelectors.forEach(selectAndUpdateElement);

  // toggleButton follows the opposite logic from youtube's elements
  const toggleButton = document.getElementById(toggleButtonId);
  if (!toggleButton) {
    return;
  }

  updateToggleButtonVisibility(toggleButton);
}

/*****************
 * hide or show relevant elements on current page
 *****************/
function updateVisual() {
  updateThumbnailTimestamps();
  updateVideoPlayerProgress();
}

/*****************
 * function to toggle per page, used after page has loaded
 *****************/
function toggleHideShow() {
  // console.log('toggleHideShow')
  updateWindowVar();
  updateVisual();
}

/*****************
 * adds toggle control to the youtube player's time display
 *****************/
function addTimeControlHandler() {
  const timeDisplaySelector =
    'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display';

  const ytTimeDisplay = document.querySelector(timeDisplaySelector);

  if (!ytTimeDisplay) {
    return;
  }

  ytTimeDisplay.onclick = toggleHideShow;
  ytTimeDisplay.style.cursor = 'pointer';

  // toggle button that shows progress when it's hidden
  const toggleButton = document.createElement('span');
  toggleButton.setAttribute('id', toggleButtonId);
  toggleButton.textContent = 'Show';

  // set initial display style
  updateToggleButtonVisibility(toggleButton);

  // TODO: element ordering when the live indicator is showing?
  ytTimeDisplay.append(toggleButton);
}

// this implementation uses MutationObserver API
// reference: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Create an observer instance
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    // TODO: add more exit conditions if the element is not relevant
    if (mutation.type !== 'childList') {
      return;
    }

    updateVisual();
  }
});

// run this at beginning to set the default variable
setInitialWindowVar().then(() => {
  observer.observe(targetNode, config);
}, logError);

// stop observing and add manual controls after page has loaded
window.onload = (event) => {
  console.log('page is fully loaded');

  // disconnect observer for toggling performance after page has loaded
  // Note: when disconnecting here, user can scroll down and be spoiled by newly loaded video thumbnails? or comments (not hidden by this extension)?
  // TODO: investigate: .disconnect() seems to run before times are rendered on youtube homepage. find a event listener better than window.onload
  setTimeout(() => {
    observer.disconnect();
  }, 3000);

  // TODO: append toggle button as soon as player loads (instead of when page is done loading)
  addTimeControlHandler();

  // hotkey `s` for same behavior as button
  document.onkeyup = (event) => {
    if (event.code === 'KeyS') {
      toggleHideShow();
    }
  };
};
