// TODO: use module and import this const from constants instead?
const storageName = 'hideYtTimes';

function handleChange() {
  chrome.storage.local.get(storageName, (result) => {
    chrome.storage.local.set({
      [storageName]: !result[storageName],
    });
  });
}

// on opening popup, set state of toggle to match storage
chrome.storage.local.get(storageName, (result) => {
  const container = document.getElementById('toggleContainer');
  const input = document.getElementById('toggleInput');

  if (!container || !input || !container.style) {
    return;
  }

  input.checked = result[storageName];
  input.onchange = handleChange;
  container.style.visibility = 'visible';
});
