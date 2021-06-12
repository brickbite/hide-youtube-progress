# hide-youtube-progress
Browser Extension to Hide Youtube Progress

Note: This extension is currently in developer mode, and is not yet published.

## Background

When watching vods of matches, the video's duration is usually shown. This can be telling of the result, since video length can correlate to how close or one-sided the match was. By hiding the progress bar and video duration, it brings the watching experience closer to that of a live stream.

# Installing the extension

## Chrome:
1. navigate to `chrome://extensions` - turn on developer mode at the top right
2. `Load Unpacked`, select the /chrome directory

## Mozilla Firefox:
1. navigate to `about:debugging#/runtime/this-firefox`
2. `Load Temporary Add-on`, select the `manifest.json` file in the /firefox directory

# Using the extension

## extension icon
- in your browser's extension toolbar, click the extension to open a popup. there is a checkbox that controls the initial state of newly opened / refreshed youtube pages.
- Note: changing the checkbox here does not affect any youtube pages that are already open

## on the youtube player
- on a page with a youtube video, the timestamp in the controls becomes clickable after the page loads. clicking this will toggle the visibility of relevant page elements: progress bar, total time, timestamps on thumbnails, timestamps on endscreen thumbnails
- hotkey `s` anywhere on the page does the same thing as above

## on the youtube homepage
- when set to hide video times, video times on the youtube homepage are also hidden
- there is no video player here, but the hotkey `s` also works here

## other areas
- not yet tested

# Version History

## v0.2 - 2021-06-11
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

## v0.1 - 2021-05-24
- initial proof of concept
