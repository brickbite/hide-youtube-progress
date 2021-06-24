// console.log('serviceWorker');

// TODO: use module and import this const from constants instead?
const storageName = 'hideYtTimes';

// set initial value to true
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ [storageName]: true });
});

// TODO: remove on uninstall?
