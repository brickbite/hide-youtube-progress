// collection of shared functions

import {
  windowVarName,
  extTimeDurationId,
  timeDisplayLabel,
  ytPlayerSelector,
  ytpTimeDisplaySelector,
  ytpTotalTimeSelector,
  ytpProgressBarSelector,
  ytpEndscreenTimeSelector,
  thumbnailTimeSelector,
  commentsSectionSelector,
  relevantYtSelectors,
} from './constants';

export function logError(error) {
  console.error(error);
}

export function updateWindowVar(initial) {
  if (window[windowVarName] === undefined) {
    window[windowVarName] = initial;
  } else {
    window[windowVarName] = !window[windowVarName];
  }
}

export function updateElementVisibility(element) {
  if (!element || !element.style) {
    // logError('updateElementVisibility: No element or no element.style');
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

export function updateYtpDurationToggle(durationToggle) {
  if (!durationToggle) {
    // logError('updateYtpDurationToggle: No durationToggle');
    return;
  }

  // durationToggle follows the opposite logic from youtube's elements
  if (window[windowVarName] === true) {
    durationToggle.style.display = 'inline';
  } else if (window[windowVarName] === false) {
    durationToggle.style.display = 'none';
  }
}

export function selectAndUpdateElement(selector, node = document) {
  const element = node.querySelector(selector);
  if (!element) {
    // logError('selectAndUpdateElement: No element');
    return;
  }
  // console.log(element);
  updateElementVisibility(element);
}

/*****************
 * remove times from thumbnails while browsing lists and player endscreen
 *****************/
export function updateThumbnailTimestamps() {
  const thumbnailTimes = [...document.querySelectorAll(thumbnailTimeSelector)];
  thumbnailTimes.forEach(updateElementVisibility);

  const endscreenTimes = [
    ...document.querySelectorAll(ytpEndscreenTimeSelector),
  ];
  endscreenTimes.forEach(updateElementVisibility);
}

/*****************
 * updates visibility of comments section
 *****************/
export function updateCommentsSection() {
  selectAndUpdateElement(commentsSectionSelector);
}

/*****************
 * update relevant elements on video player
 *****************/
export function updateVideoPlayer(node) {
  if (!node || !(node instanceof Element) || !node.matches(ytPlayerSelector)) {
    // logError('updateVideoPlayer: node is not a YouTube player node');
    return;
  }

  const playerSelectors = [ytpProgressBarSelector, ytpTotalTimeSelector];

  playerSelectors.forEach((selector) => {
    selectAndUpdateElement(selector, node);
  });

  // there should only durationToggle per player. check if any existing before adding.
  let durationToggle = node.querySelector(`#${extTimeDurationId}`);
  if (!durationToggle) {
    const ytpTimeDisplay = node.querySelector(ytpTimeDisplaySelector);

    if (!ytpTimeDisplay) {
      // logError('updateVideoPlayer: No ytpTimeDisplay');
      return;
    }

    ytpTimeDisplay.onclick = toggleHideShow;
    ytpTimeDisplay.style.cursor = 'pointer';
    ytpTimeDisplay.setAttribute('aria-label', timeDisplayLabel);
    ytpTimeDisplay.setAttribute('title', timeDisplayLabel);

    durationToggle = createShowDurationDisplay();

    // TODO: element ordering when the live indicator is showing?
    ytpTimeDisplay.append(durationToggle);
  }

  updateYtpDurationToggle(durationToggle);
}

/*****************
 * hide or show relevant elements on current page
 *****************/
export function updateVisual() {
  updateThumbnailTimestamps();
  updateCommentsSection();

  /**
   * there may be multiple players on a page so we use querySelectorAll().
   * we search by totalTime, since that is one of the last relevant elements
   * to be rendered, and we can be more sure the other elements exist
   */
  const totalTimes = document.querySelectorAll(ytpTotalTimeSelector);
  totalTimes.forEach((durationNode) => {
    const ytPlayer = durationNode.closest(ytPlayerSelector);
    updateVideoPlayer(ytPlayer);
  });
}

/*****************
 * function to toggle per page, used after page has loaded
 *****************/
export function toggleHideShow() {
  // console.log('toggleHideShow')
  updateWindowVar();
  updateVisual();
}

/*****************
 * indicator that shows when video player's duration is being hidden
 *****************/
export function createShowDurationDisplay() {
  const durationToggle = document.createElement('span');
  durationToggle.setAttribute('id', extTimeDurationId);
  durationToggle.textContent = 'Show';

  // set initial display style
  updateYtpDurationToggle(durationToggle);

  return durationToggle;
}

function observerCallback(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type !== 'childList') {
      return;
    }

    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const selected = node.querySelector(ytpTotalTimeSelector);
      if (selected) {
        // hide this immediately (if applicable) so no time is shown
        updateElementVisibility(selected);

        const totalTimes = node.querySelectorAll(ytpTotalTimeSelector);
        totalTimes.forEach((durationNode) => {
          const ytPlayer = durationNode.closest(ytPlayerSelector);
          updateVideoPlayer(ytPlayer);
        });
      }

      const selectorMatches = relevantYtSelectors.some((selector) => {
        return !!node.querySelector(selector);
      });

      if (selectorMatches) {
        updateVisual();
      }
    }
  }
}

export function setDocumentObserver() {
  // this implementation uses MutationObserver API
  // reference: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

  // Select the node that will be observed for mutations
  const targetNode = document;

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Create an observer instance
  const observer = new MutationObserver(observerCallback);

  // this continues to observe while we're on the page, so any new content (added by actions such as scrolling) will be correctly shown / hidden
  observer.observe(targetNode, config);

  if (window) {
    // add keyboard shortcut after page has loaded
    window.onload = () => {
      console.log('page is loaded');

      // hotkey `alt` + `s` for same behavior as button
      document.onkeydown = (event) => {
        if (event.altKey && event.code === 'KeyS') {
          toggleHideShow();
        }
      };
    };

    window.onbeforeunload = () => {
      observer.disconnect();
    };
  }
}
