export const windowVarName = '__hideYtTimes';
export const storageName = 'hideYtTimes';
export const extTimeDurationId = 'ext-time-duration-show';
export const timeDisplayLabel = 'Hide/show duration and progress (ALT + s)';

/*****************************
 * relevant youtube selectors. ytp is youtube player
 *****************************/
export const ytPlayerSelector = 'ytd-player';
export const ytpTimeDisplaySelector = '.ytp-time-display';
export const ytpTotalTimeSelector = '.ytp-time-duration';
export const ytpProgressBarSelector = '.ytp-progress-bar-container';
export const ytpCeDurationSelector = '.ytp-ce-video-duration';
export const ytpEndscreenTimeSelector = '.ytp-videowall-still-info-duration';
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

/*****************************
 * relevant youtube selectors (updated format) - WIP
 *****************************/

// const youtubeSelectors = {
//   player: ytPlayerSelector,
//   playerTimeDisplay: ytpTimeDisplaySelector,
//   playerDuration: ytpTotalTimeSelector,
//   playerProgress: ytpProgressBarSelector,
//   playerCeDuration: ytpCeDurationSelector,
//   playerEndscreenDuration: ytpEndscreenTimeSelector,
//   thumbnailDuration: thumbnailTimeSelector,
//   commentsSection: commentsSectionSelector,
// };

/*****************************
 * relevant twitch selectors - WIP
 *****************************/
// const twitchSelectors = {
//   player: '[data-test-selector="video-player__video-container"]',
//   playerTimeDisplay: '.vod-seekbar-time-labels',
//   playerDuration: `[data-a-target="player-seekbar-duration"]`,
//   playerProgress: `[data-a-target="player-seekbar"]`,
//   playerCeDuration: undefined,
//   playerEndscreenDuration: undefined,
//   thumbnailDuration: '.tw-media-card-image__corners', // first child of this selector
//   commentsSection: undefined,
// };

/*****************************
 * relevant afreecatv selectors - WIP
 *****************************/
// const atvSelectors = {
//   player: '#player_area > .htmlplayer_wrap',
//   playerTimeDisplay: '.ctrl > .time_display',
//   playerDuration: '.ctrl > .time_display > .time-duration',
//   playerProgress: '.ctrl > .progress',
//   playerCeDuration: '.thum > a > .time', // actually list_area's thumbnail durations on player page
//   playerEndscreenDuration: '.running_time',
//   thumbnailDuration: '.thum > .time', // user page / home page
//   commentsSection: '#player_area > .comment_wrap',
//   // chatSection: '#chatting_area
//   // listSection: '#list_area
// };
