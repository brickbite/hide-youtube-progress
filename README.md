# hide-youtube-progress
Browser Extension to Hide Youtube Progress

Note: This extension is currently in developer mode only, and is not yet published.

# Using this extension

## Chrome:
1. navigate to `chrome://extensions` - turn on developer mode at the top right
2. `Load Unpacked`, select the /chrome directory

## Mozilla Firefox:
1. navigate to `about:debugging#/runtime/this-firefox`
2. `Load Temporary Add-on`, select the `manifest.json` file in the /firefox directory

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
- adds check for mutation.type back to MutationObserver
- changes global toggle slider to a simpler checkbox
- removes toggle button on player with a click handler on time display

## v0.1 - 2021-05-24
- initial proof of concept
