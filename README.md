# YouTube Observer
Browser extension to hide YouTube video duration and progress

Note: This extension is currently in developer mode, and is not yet published.

## Background

When watching vods of matches, the video's duration is usually shown. This can be telling of the result, since video length can correlate to how close or one-sided the match was. By hiding info such as the progress bar and video duration, this extension brings the watching experience closer to that of a live stream.

## Building and Loading the extension in the browser

Node is required to build the extension.
Note: The minimum supported Node.js version to run webpack 5 is 10.13.0 (LTS)

Running `yarn build:all` builds the extension into a dist directory, where it can then be loaded to the browser.

### Chrome:
1. navigate to `chrome://extensions` - turn on developer mode at the top right
2. `Load Unpacked`, select the `dist/chrome` directory

### Mozilla Firefox:
1. navigate to `about:debugging#/runtime/this-firefox`
2. `Load Temporary Add-on`, select the `manifest.json` file in the `dist/firefox` directory

## Using the extension

### extension icon
- in your browser's extension toolbar, click the extension to open a popup. there is a checkbox that controls the initial state of newly opened / refreshed YouTube pages.
- Note: changing the checkbox here does not affect any YouTube pages that are already open

### on the YouTube player
- on a page with a YouTube video, the timestamp in the controls becomes clickable after the page loads. clicking this will toggle the visibility of relevant page elements
- hotkey `alt` + `s` anywhere on the page does the same thing as above
- controlling the youtube player: `left` / `right` arrow keys (or `j` / `l` keys) to seek. full list of keyboard shortcuts can be found [here](https://support.google.com/youtube/answer/7631406).

### on the YouTube homepage
- when set to hide video times, video times on the YouTube homepage are also hidden
- there is no video player here, but the hotkey `alt` + `s` also works here

### other areas
- not yet tested

## Version History

### v0.3 - 2021-06-24
- updates icon
- improves developer process: adds usage of webpack and fs script to minimize duplication (but also require a build process)

### v0.2 - 2021-06-11
- adds usage of window.__hideYtTimes to determine whether to hide or show
- adds functionality to toggle per page
- updates function naming for toggle usage
- adds directory for firefox usage
- adds serviceworker to set initial variable in browser storage
- updates contentScript to check against browser storage on page load / refresh
- adds html / css / js / images for popup - controls initial variable in browser storage
- handles promises when getting from browser storage in contentScript
- adds checks to MutationObserver for performance
- hides video lengths on player endscreen
- cleans up selectors
- keeps MutationObserver active for the lifecycle of the page
- changes extension name to YouTube Observer

### v0.1 - 2021-05-24
- initial proof of concept
