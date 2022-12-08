export { showSnackbar } from "./functions/show-snackbar";
export { quillToReact } from "./functions/quill";
export { reactToQuill } from "./functions/quill";
export { quillToPlainText } from "./functions/quill";
export { isValidYouTubeUrl } from "./functions/youtube";
export {youTubeGetID} from "./functions/youtube";
export {getIndianTime, fetchIndianTime, castIndianTime} from "./functions/getIndianTime";
export {monthToStrFormat} from "./functions/monthToStringFormatter";
export { hourToStrFormat } from "./functions/hourToStringConverter";
export { shadeColor } from "./functions/shadeColor";
export { careFormattedDate } from "./functions/careFormattedDate";
export { formatCallDuration } from "./functions/formatCallDuration";
export { groupCareMessages } from "./functions/groupCareMessages";
export { makeUniqueId } from "./functions/makeUniqueId";
export { makeUniqueNumericId } from "./functions/makeUniqueNumericId";
export { rtmTokenBuilder } from "./functions/rtmTokenBuilder";
export { formatBillDuration } from "./functions/formatBillDuration";
export {Validate as AppValidate} from './global/Validate';
// -------------------- doubt forum

export {
  getDateStringServ,
  formatTime,
  generateUrlFromString,
  generateRandomString,
  splitLongString,
  numReaderFriendlyFormat,
  futureformatTime,
} from "./doubts_forum/utils";

// -------------------- newsfeed

export {
  getVideoCover,
  debounce,
  linkParser,
  getYoutubeID,
  removeAtIndex,
} from "./newsfeed/utils";

export { getDateInYYYYMMDDFormat, loadingWrapper } from "./functions/utils";

// =================> Blaze
export {
  createBlazeOrder,
  rescheduleBlazeReservationByUser,
} from "./blaze/cloud-functions";

//
export { loadScript } from "./loadScript";

// links

export { privacyPolicy, termsOfService, refundAndCancellationPolicy } from "./links";

export { groupBlazeMessages, getGrade } from "./blaze/groupBlazeMessages";
export {
  pickAgentCloudFunction,
  updateChatImage,
  updateStudentCareMeta,
} from "./pustack-care";

export {
  starPath,
  VAPIDKEY,
  agoraAppID,
  PUSHY_SECRET_API_KEY,
  FCM_AUTH_HEADER,
  firebaseAPiKey,
  firebaseDbURL,
  appGooglePlayLink,
  googlePlayBadge,
  ALREADY_EXIST_PHONE_LOGIN_CODE
} from "./constants";

export { subjectColors } from "./global";
