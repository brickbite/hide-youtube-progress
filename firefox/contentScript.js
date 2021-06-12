/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */
console.log('contentScript start');

const windowVarName = '__hideYtTimes';
const storageName = 'hideYtTimes';

function toggleHideWindowVar() {
  browser.storage.local.get([storageName]).then(
    function (result) {
      // new windows will initially show/hide based on the value in storage
      if (window[windowVarName] === undefined) {
        window[windowVarName] = result[storageName];
      } else {
        window[windowVarName] = !window[windowVarName];
      }
    },
    (error) => {
      console.error(error);
    }
  );
}

// run this at beginning to set to true by default
toggleHideWindowVar();

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

  const separatorSelector =
    'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-separator';

  const totalTimeSelector =
    'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-duration';

  const thumbnailTimeSelector =
    '#overlays > ytd-thumbnail-overlay-time-status-renderer';

  // TODO: add selector for thumbnails at video end?

  const playerSelectors = [
    progressBarSelector,
    separatorSelector,
    totalTimeSelector,
    thumbnailTimeSelector,
  ];

  playerSelectors.forEach(selectAndUpdateElement);
}

// this implementation uses MutationObserver API
// reference: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
function updateVisual(mutationsList, observer) {
  // TODO: add early exit conditions to optimize this function. it shouldn't run the update functions on every observed mutation

  updateThumbnailTimestamps();
  updateVideoPlayerProgress();
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(updateVisual);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

/**
 * function to toggle per page, used after page has loaded
 */
function toggleHideShow() {
  // console.log('toggleHideShow')
  toggleHideWindowVar();

  // TODO: promisify and await toggleHideWindowVar, seems to be async?
  updateVisual();
}

function appendToggleButton() {
  const rightControlsSelector =
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls';
  const ytRightControls = document.querySelector(rightControlsSelector);
  if (!ytRightControls) {
    return;
  }

  const toggleButton = document.createElement('button');
  toggleButton.className = 'ytp-button'; // apply youtube styles
  toggleButton.style = 'vertical-align: top; margin-right: 1rem;'; // need this to align with existing svg buttons
  // TODO: replace this with something better, maybe an overlay over total time or an svg
  toggleButton.textContent = 'Toggle';
  toggleButton.onclick = toggleHideShow;

  ytRightControls.prepend(toggleButton);
}

// stop observing and add manual controls after page has loaded
window.onload = (event) => {
  console.log('page is fully loaded');

  // disconnect observer for toggling performance after page has loaded
  // Note: when disconnecting here, user can scroll down and be spoiled by newly loaded video thumbnails? or comments (not hidden by this extension)?
  // TODO: investigate: .disconnect() seems to run before times are rendered on youtube homepage. find a event listener better than window.onload
  setTimeout(() => {
    observer.disconnect();
  }, 2000);

  // TODO: append toggle button as soon as player loads (instead of when page is done loading)
  appendToggleButton();

  // hotkey `s` for same behavior as button
  document.onkeyup = (event) => {
    if (event.code === 'KeyS') {
      toggleHideShow();
    }
  };
};
