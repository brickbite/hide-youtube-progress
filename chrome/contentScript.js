/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */
console.log('contentScript start');

function toggleHideWindowVar() {
  if (window.__hideYtTimes === undefined) {
    window.__hideYtTimes = true;
  } else {
    window.__hideYtTimes = !window.__hideYtTimes;
  }
}

// run this at beginning to set to true by default
toggleHideWindowVar();

function updateElementVisibility(element) {
  if (!element.style) {
    return;
  }

  if (window.__hideYtTimes === true) {
    element.style.visibility = 'hidden';
  } else if (window.__hideYtTimes === false) {
    element.style.visibility = 'visible';
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
  updateVisual();
}

function appendToggleButton() {
  const toggleButton = document.createElement('button');
  toggleButton.className = 'ytp-button'; // apply youtube styles
  toggleButton.style = 'vertical-align: top; margin-right: 1rem;'; // need this to align with existing svg buttons
  toggleButton.textContent = 'Toggle';
  toggleButton.onclick = toggleHideShow;

  const rightControlsSelector =
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls';
  const ytRightControls = document.querySelector(rightControlsSelector);
  ytRightControls.prepend(toggleButton);
}

// stop observing and add manual controls after page has loaded
window.onload = (event) => {
  console.log('page is fully loaded');

  // Note: when disconnecting here, user can scroll down and be spoiled by newly loaded video thumbnails? or comments (not hidden by this extension)?
  observer.disconnect();

  // TODO: append toggle button as soon as player loads (instead of when page is done loading)
  appendToggleButton();

  // hotkey `s` for same behavior as button
  document.onkeyup = (event) => {
    if (event.code === 'KeyS') {
      toggleHideShow();
    }
  };
};
