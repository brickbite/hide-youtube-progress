let input = document.getElementById('toggleInput');

const storageName = 'hideYtTimes';

// on opening popup, set state of toggle to match storage
chrome.storage.local.get(storageName, (result) => {
  input.checked = result[storageName];
});

function handleChange() {
  chrome.storage.local.get(storageName, (result) => {
    chrome.storage.local.set({
      [storageName]: !result[storageName],
    });
  });
}
input.onchange = handleChange;
