// console.log('serviceWorker');

const storageName = 'hideYtTimes';

// set initial value to true
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ [storageName]: true });
});

// TODO: remove on uninstall?
