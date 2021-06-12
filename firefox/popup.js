const storageName = 'hideYtTimes';

function onError(error) {
  console.error(error);
}

function handleChange() {
  browser.storage.local.get(storageName).then((result) => {
    browser.storage.local.set({
      [storageName]: !result[storageName],
    });
  }, onError);
}

// on opening popup, set state of toggle to match storage
browser.storage.local.get(storageName).then((result) => {
  const container = document.getElementById('toggleContainer');
  const input = document.getElementById('toggleInput');

  if (!container || !input) {
    return;
  }

  input.checked = result[storageName];
  input.onchange = handleChange;
  container.prepend(input);
}, onError);
