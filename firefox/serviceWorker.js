// console.log('serviceWorker');

const storageName = 'hideYtTimes';

// set initial value to true
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ [storageName]: true });
});

// TODO: remove on uninstall?
