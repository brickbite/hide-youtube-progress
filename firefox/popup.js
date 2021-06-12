let input = document.getElementById('toggleInput');

const storageName = 'hideYtTimes';

function onError(error) {
  console.error(error);
}

// on opening popup, set state of toggle to match storage
browser.storage.local.get(storageName).then((result) => {
  input.checked = result[storageName];
}, onError);

function handleChange() {
  browser.storage.local.get(storageName).then((result) => {
    browser.storage.local.set({
      [storageName]: !result[storageName],
    });
  }, onError);
}
input.onchange = handleChange;
