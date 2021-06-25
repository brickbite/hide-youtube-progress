/**
 * to hide things before they have a chance to render to DOM,
 * this configuration is set in manifest.json: `"run_at": "document_start"`
 */

import { storageName } from '../../constants';

import {
  logError,
  updateWindowVar,
  setDocumentObserver,
} from '../../functions';

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

function setInitialWindowVar() {
  return getStorageVar().then((result) => {
    // new windows will initially show/hide based on the value in storage
    updateWindowVar(result[storageName]);
  }, logError);
}

// run this at beginning to set the default variable
setInitialWindowVar().then(setDocumentObserver, logError);
