/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */

import { storageName, ytpTimeDisplaySelector } from '../../constants';

import {
  logError,
  updateWindowVar,
  setDocumentObserver,
  setWindowEvents,
  updateVideoPlayer,
  updateVisual,
} from '../../functions';

function getStorageVar() {
  // Note: returns a promise
  return browser.storage.local.get([storageName]);
}

function setInitialWindowVar() {
  return getStorageVar().then((result) => {
    // new windows will initially show/hide based on the value in storage
    updateWindowVar(result[storageName]);
  }, logError);
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

      const selected = node.querySelector(ytpTimeDisplaySelector);
      if (selected) {
        updateVideoPlayer();
      }

      // const selectorMatches = relevantSelectors.some((selector) => {
      //   return !!node.querySelector(selector);
      // });

      // if (selectorMatches) {
      // updateVisual();
      // }
    }
    updateVisual();
  }
}

// run this at beginning to set the default variable
setInitialWindowVar().then(setDocumentObserver(observerCallback), logError);

setWindowEvents();
