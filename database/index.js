export {
  uploadUserInfo,
  updateUserName,
  updateCareChat,
  updateAppRating,
  updateProfileImage,
  getPustackCareChat,
  getDailyEngagement,
  uploadFinalUserInfo,
  getCareMessageCount,
  rewardProMembership,
  getReferredUserList,
  getPustackCareNewChat,
  deleteUserFromDatabase,
  updateCareMessageCount,
  updateUserBlazeAvailability,
  cancelOnDisconnect,
  markUserBlazeOffline,
  getMorePustackCareChat,
  generateInvitationLink,
  refillPayment,
} from "./global/database";
//
// export {
//   askDoubt,
//   getDoubtInfoByURL,
//   updateDoubt,
//   deleteDoubt,
//   getIsUpVoted,
// } from "./doubts_forum/doubt-functions";
//
// export {
//   uploadImage,
//   uploadBase64urlImage,
//   generateNewUrl,
//   checkIfUrlExists,
//   getUserInfoById,
//   getUserMetaInfoById,
//   changeUserGrade,
// } from "./doubts_forum/doubt-utils-functions";
//
// export {
//   addComment,
//   updateComment,
//   deleteComment,
//   getMoreComments,
// } from "./doubts_forum/comment-functions";
//
// export {
//   fetchMoreDoubts,
//   getMyDoubts,
//   getDoubts,
//   getFilterData,
//   getClassChapters,
//   fetchMoreMyDoubts,
//   getInstructorMyDoubts,
//   fetchMoreInstructorMyDoubts,
// } from "./doubts_forum/feed-functions";
//
// export {
//   upvoteDoubt,
//   postAnswer,
//   unreadAnswerNotification,
//   resetUnreadMsgCount,
// } from "./doubts_forum/interaction-functions";
//
// export { deleteImageByUrl } from "./doubts_forum/storage";

export {
  fetchSessions,
  getCurrentSessionDetails,
  sessionJoinedByUser as userJoinedSession,
} from "./livesessions/sessions";
export {
  fetchLiveComments,
  postLiveComment,
  replyingToComment,
  fetchComments,
  fetchMoreComments,
  deleteLiveSessionComment,
} from "./livesessions/comments";

export {
  listenForLiveSessions,
  listenForTodayLiveSessions,
} from "./livesessions/today";

export {
  fetchInsessionCards as getInSessionCards,
  fetchPreSessionCards as getPreSessionCards,
  registerStudentVote as putStudentChoice,
} from "./livesessions/quizcards";

export {
  requestSession,
  getFilterData as getBlazeFilterData,
  fetchTimeSlots as getBlazeTimeSlots,
  getClassChapters as getBlazeClassChapters,
  checkPriorBookings as checkPriorBookingSlots,
  fetchAvailableDates as getBlazeDatesAvailability,
} from "./blaze/booking-functions";

export {
  getBlazeSessions as getBlazeBookings,
  getMoreBlazeReservationChats,
  getLatestBlazeReservationChats,
  blazeUnreadMesagesNotification,
  getStudentActiveSessionDetails,
  blazeInstructorMetaDetails,
  listenToOutstandingSession,
  blazeDecreaseMessageCount,
  getBlazeReservationChats,
  updatePendingRatingList,
  getReceiverUnreadCount,
  listenToUnreadMessages,
  updateInstructorRating,
  blazeReservationMeta,
  getInstructorRatings,
  getBlazeCallHistory,
  pendingSessionList,
  subjectColorsMeta,
  isStudentEngaged,
  sendBlazeChat,
  getRtmToken,
  endSession,
} from "./blaze/fetch-data";

export {
  updateCallDocument,
  rejectCallStatus,
  updateStudentEngagement,
  startHandoverStudent,
} from "./blaze/call-functions";

export {
  getSubjectMeta,
  getSubjectMeta2,
  getTipsMeta,
  getPracticeMeta,
} from "./home/fetcher";

export {
  getPlans,
  setDeviceToken,
  createProOrder,
  fetchLectureItem,
  userImportantData,
  getCurrentVersion,
  userEngagementMapData,
  getUserDailyEngagement,
  fetchLectureHeaderItem,
  getContinueWatchingList,
  getUserLatestEngagement,
  getLectureItemsForChapter,
  userEngagementChapterData,
  getCompletionStatusByChapter,
  getChapterLastEngagementData,
} from "./classroom";

export { getSubjectTips, getVideoId, getTipsEngaggementStatus } from "./tips";

export {
  getSubjectPracticeData,
  getItemDetails,
  getHeaderItemDetails,
  getExamUserEngagement,
} from "./practice";

export {
  getBlazeExternalRequests,
  getBlazeExternalAccepted,
  getBlazeExternalCompleted,
  getOverallSkills,
  addInstructorSkill,
  deleteInstructorSkills,
  getInstructorSkills,
  handleAcceptSession,
  getDeviceTokens,
  getCallDocument,
  createCallDocument,
  listenToCallDoc,
  getInstructorActivity,
  updateInstructorStatus,
  getStudentBalance,
  completeHandoverStudent,
  startHandoverInstructor,
  updateRtmTokenInSession,
  completeHandoverInstructor,
  updateCallDocumentInstructor,
  updateStudentEngagementByInstructor,
} from "./blazeExternal";

export const getUserInfoById = async (getUserId) => {
  let name,
    profile_url,
    role,
    email,
    isInstructor,
    sign_up_ts,
    phone_number,
    has_rated_app,
    app_rating,
    pro_expiration_date,
    tier,
    grade,
    phone_country_code;

  await require('../firebase-config').db
    .collection("users")
    .doc(getUserId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        name = doc.data().name;
        grade = doc.data().grade;
        profile_url = doc.data().profile_url;
        role = doc.data().role;
        email = doc.data().email;
        isInstructor = doc.data().is_instructor;
        sign_up_ts = doc.data().sign_up_ts;
        phone_number = doc.data().phone_number;
        phone_country_code = doc.data().phone_country_code;
        has_rated_app = doc.data().has_rated_app;
        app_rating = doc.data().app_rating;
        pro_expiration_date = doc.data().pro_expiration_date;
        tier = doc.data().tier;
      } else {
        console.log("No user found");
      }
    })
    .catch((er) => {
      // console.log(er);
      name = null;
      grade = null;
      profile_url = null;
      role = null;
      email = null;
      isInstructor = null;
      sign_up_ts = null;
      phone_number = null;
      phone_country_code = null;
      has_rated_app = null;
      app_rating = null;
      pro_expiration_date = null;
      tier = null;
    });

  return [
    name,
    profile_url,
    role,
    email,
    isInstructor,
    sign_up_ts,
    phone_number,
    has_rated_app,
    app_rating,
    pro_expiration_date,
    tier,
    grade,
    phone_country_code,
  ];
};
