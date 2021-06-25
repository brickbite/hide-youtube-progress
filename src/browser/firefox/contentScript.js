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
  // Note: returns a promise
  return browser.storage.local.get([storageName]);
}

function setInitialWindowVar() {
  return getStorageVar().then((result) => {
    // new windows will initially show/hide based on the value in storage
    updateWindowVar(result[storageName]);
  }, logError);
}

// run this at beginning to set the default variable
setInitialWindowVar().then(setDocumentObserver, logError);
