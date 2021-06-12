/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */
console.log('contentScript start');

const windowVarName = '__hideYtTimes';
const storageName = 'hideYtTimes';
const toggleButtonId = 'time-display-show';

// relevant youtube selectors. ytp is youtube player
const ytpTimeDisplaySelector = 'div.ytp-time-display';
const ytpTotalTimeSelector = 'span.ytp-time-duration';
const ytpProgressBarSelector = 'div.ytp-progress-bar-container';
const ytpEndscreenTimeSelector = 'span.ytp-videowall-still-info-duration';
const thumbnailTimeSelector = 'ytd-thumbnail-overlay-time-status-renderer';

function logError(error) {
  console.error(error);
}

function getStorageVar() {
  // Note: returns a promise
  return browser.storage.local.get([storageName]);
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

  // youtube page script edits visibility on hovering a video list thumbnail, and edits display on hovering endscreen thumbnail

  // to cover the various cases, we apply display, visibility, and opacity redundantly
  if (window[windowVarName] === true) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
  } else if (window[windowVarName] === false) {
    element.style.display = 'inline';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
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
 * remove times from thumbnails while browsing lists and player endscreen
 *****************/
function updateThumbnailTimestamps() {
  const thumbnailTimes = [...document.querySelectorAll(thumbnailTimeSelector)];
  thumbnailTimes.forEach(updateElementVisibility);

  const endscreenTimes = [
    ...document.querySelectorAll(ytpEndscreenTimeSelector),
  ];
  endscreenTimes.forEach(updateElementVisibility);
}

/*****************
 * remove singular elements on video player
 *****************/
function updateVideoPlayerProgress() {
  const playerSelectors = [ytpProgressBarSelector, ytpTotalTimeSelector];

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
  const ytTimeDisplay = document.querySelector(ytpTimeDisplaySelector);

  if (!ytTimeDisplay) {
    return;
  }

  ytTimeDisplay.onclick = toggleHideShow;
  ytTimeDisplay.style.cursor = 'pointer';

  // toggle button that shows progress when it's hidden
  const toggleButton = document.createElement('span');
  toggleButton.setAttribute('id', toggleButtonId);
  toggleButton.textContent = 'Show';

  // set initial display style before appending
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
    if (mutation.type !== 'childList') {
      return;
    }

    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      // TODO: add further exit conditions if node contains no relevant selectors
    }

    updateVisual();
  }
});

// run this at beginning to set the default variable
setInitialWindowVar().then(() => {
  // this continues to observe while we're on the page, so any new content (added by actions such as scrolling) will be correctly shown / hidden
  observer.observe(targetNode, config);
}, logError);

// add manual controls after page has loaded
window.onload = (event) => {
  console.log('page is loaded');

  // TODO: append toggle button on player load (instead of after page load)
  addTimeControlHandler();

  // hotkey `s` for same behavior as button
  document.onkeyup = (event) => {
    if (event.code === 'KeyS') {
      toggleHideShow();
    }
  };
};

window.onbeforeunload = (event) => {
  observer.disconnect();
};
