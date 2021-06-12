console.log('running contentScript');
// TODO: add toggle functionality to show/hide instead of being "always on"

function hideElement(element) {
  if (!element.style) { return; }
  element.style.display = 'none';
}

function selectAndHideElement(selector) {
  const element = document.querySelector(selector);
  if (!element) { return; }
  // console.log(element);
  hideElement(element);
}

/*****************
 * remove timestamps while browsing lists (thumbnails)
 *****************/
function hideThumbnailTimestamps() {
  const timestampId = '#overlays';
  
  const timestamps = [...document.querySelectorAll(timestampId)];
  timestamps.forEach(hideElement);
}

/*****************
 * remove relevant things on video player page
 *****************/
function hideVideoPlayerProgress() {
  // TODO: simplify selectors in this function

  // const parentSelector = '#movie_player > div.ytp-chrome-bottom >'
  const progressBarSelector = 'div.ytp-progress-bar-container';
  
  const separatorSelector = 'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-separator';
  
  const totalTimeSelector = 'div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-duration';
  
  const thing = '#overlays > ytd-thumbnail-overlay-time-status-renderer'
  
  const playerSelectors = [
    progressBarSelector,
    separatorSelector,
    totalTimeSelector,
    thing
  ];
  
  playerSelectors.forEach(selectAndHideElement);
}


// hide things before they have a chance to render to DOM
// set in manifest.json: `"run_at": "document_start"`

// this implementation uses MutationObserver API
// reference: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for(const mutation of mutationsList) {
    if (mutation.type === 'childList') {
        // console.log('A child node has been added or removed.');
        // console.log('hiding things...');
        hideThumbnailTimestamps();
        hideVideoPlayerProgress();
    }
    else if (mutation.type === 'attributes') {
        // console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();