import "firebase/firestore";
import {fetchIndianTime, formatCallDuration} from "../../helpers";

export const updateCallDocument = async ({
  sessionId,
  meetingId,
  status,
  duration,
  reason = null,
  platform,
}) => {
  const indianTime = await fetchIndianTime();
  if (status === "completed")
    await (await import('../../firebase-config')).db
      .collection("blaze_dev")
      .doc("collections")
      .collection("blaze_sessions")
      .doc(sessionId)
      .collection("chats")
      .doc(meetingId)
      .set(
        {
          message_type: "call_event",
          event_description: `Call Duration • ${formatCallDuration(duration)}`,
          event_type: status,
          sent_on: +indianTime,
        },
        { merge: true }
      )
      .then(() => true)
      .catch(() => false);

  let dataToSet = {
    // active_call_duration: duration,
    // billed_amount: duration * 10,
    status: status,
    student_platform: platform,
    sent_on: +indianTime,
    reason_for_call_end: reason,
    call_start_ts: +indianTime,
  };

  if (status === "completed") {
    dataToSet = {
      // active_call_duration: duration,
      // billed_amount: duration * 10,
      status: status,
      student_platform: platform,
      reason_for_call_end: reason,
    };
  }

  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set(dataToSet, { merge: true })
    .then(() => true)
    .catch(() => false);
};

export const rejectCallStatus = async ({ sessionId, meetingId }) => {
  const indianTime = await fetchIndianTime();
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set(
      {
        status: "rejected_by_student",
        student_platform: "web",
        sent_on: +indianTime,
      },
      { merge: true }
    )
    .catch((err) => err);
};

export const updateStudentEngagement = async ({
  studentId,
  activeCallId,
  activeSessionId,
  isEngaged,
}) => {
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(studentId)
    .set(
      {
        is_engaged: isEngaged,
        active_call_id: activeCallId,
        active_call_session_id: activeSessionId,
      },
      { merge: true }
    );
};

export const startHandoverStudent = async ({
  sessionId,
  meetingId,
  isSmallScreen,
}) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set(
      {
        status: "handover_student",
        student_platform: isSmallScreen ? "mweb" : "web",
      },
      { merge: true }
    )
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
};
