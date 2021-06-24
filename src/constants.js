export const windowVarName = '__hideYtTimes';
export const storageName = 'hideYtTimes';
export const extTimeDurationId = 'ext-time-duration-show';
export const timeDisplayLabel = 'Hide/show duration and progress (ALT + s)';

/*****************************
 * relevant youtube selectors. ytp is youtube player
 *****************************/
export const ytPlayerSelector = 'ytd-player';
export const ytpTimeDisplaySelector = 'div.ytp-time-display';
export const ytpTotalTimeSelector = 'span.ytp-time-duration';
export const ytpProgressBarSelector = 'div.ytp-progress-bar-container';
export const ytpEndscreenTimeSelector =
  'span.ytp-videowall-still-info-duration';
export const thumbnailTimeSelector =
  'ytd-thumbnail-overlay-time-status-renderer';
export const commentsSectionSelector = 'ytd-comments';

export const relevantYtSelectors = [
  ytPlayerSelector,
  ytpTimeDisplaySelector,
  ytpTotalTimeSelector,
  ytpProgressBarSelector,
  ytpEndscreenTimeSelector,
  thumbnailTimeSelector,
  commentsSectionSelector,
];
