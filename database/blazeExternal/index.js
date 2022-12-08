import {fetchIndianTime, formatCallDuration} from "../../helpers";

export const getBlazeExternalRequests = async ({ instructorSkills, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .where("session_status", "==", "outstanding")
    .where(
      "skill",
      "in",
      instructorSkills?.map((skill) => skill?.id)
    )
    .orderBy("requested_ts", "desc")
    .limit(20)
    .onSnapshot((snapshot) => {
      const requests = [];
      let docs = snapshot.docs.sort(
        (a, b) => b.data().requested_ts - a.data().requested_ts
      );
      docs.map((item) => requests.push({ ref: item.ref, ...item.data() }));
      callback(requests);
    });
};

export const getBlazeExternalCompleted = async ({ instructorId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .where("session_status", "==", "completed")
    .where("instructor_id", "==", instructorId)
    .orderBy("completed_ts", "desc")
    .limit(20)
    .get()
    .then((snapshot) => {
      const requests = [];
      snapshot.docs.map((item) =>
        requests.push({ ref: item.ref, ...item.data() })
      );
      return requests;
    })
    .catch((err) => console.log(err));
};

export const getBlazeExternalAccepted = async ({ instructorId, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .where("session_status", "==", "accepted")
    .where("instructor_id", "==", instructorId)
    .orderBy("accepted_ts", "desc")
    .onSnapshot((snapshot) => {
      const requests = [];
      snapshot.docs.map((item) =>
        requests.push({ ref: item.ref, ...item.data() })
      );
      callback(requests);
    });
};

export const getOverallSkills = async () => {
  return (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("overall_skills")
    .get()
    .then((snapshot) => {
      let skills = {};
      snapshot.docs.map(
        (item) => (skills = { ...skills, [item.id]: item.data() })
      );
      return skills;
    })
    .catch((err) => console.log(err));
};

export const addInstructorSkill = async ({ instructorId, skillId, skill }) => {
  return (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .collection("instructor_skills")
    .doc(skillId)
    .set({ ...skill })
    .then(() => true)
    .catch(() => false);
};

export const getInstructorSkills = async ({ instructorId, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .collection("instructor_skills")
    .onSnapshot((snapshot) => {
      let skills = [];

      if (snapshot.docs.length > 0) {
        snapshot.docs.map((item) => skills.push(item.data()));
      }
      callback(skills);
    });
};

export const deleteInstructorSkills = async ({
  instructorId,
  skillsToDelete,
}) => {
  try {
    skillsToDelete.map(
      async (skillId) =>
        await (await import('../../firebase-config')).db
          .collection("blaze_dev")
          .doc("collections")
          .collection("instructors")
          .doc(instructorId)
          .collection("instructor_skills")
          .doc(skillId)
          .delete()
    );
    return true;
  } catch (err) {
    return false;
  }
};

export const handleAcceptSession = async ({
  studentId,
  instructorId,
  instructorName,
  instructorPhoto,
  reference,
}) => {
  if (studentId === instructorId) {
    return "You cannot accept your own session";
  }

  const flag = await reference
    .get()
    .then((doc) => doc.data().session_status === "accepted");

  if (flag) {
    return "Session Already Accepted";
  }

  const instructorRating = await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .collection("stats")
    .doc("skill_wise_rating")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().average_rating;
      } else return 5;
    })
    .catch(() => 5);

  await reference.update({
    session_status: "accepted",
    accepted_ts: +new Date(),
    instructor_id: instructorId,
    instructor_name: instructorName,
    instructor_profile_pic: instructorPhoto,
    instructor_rating: instructorRating,
  });

  return "updated";
};

export const getDeviceTokens = async ({ studentId }) => {
  let webToken = "";
  let androidToken = "";

  await (await import('../../firebase-config')).db
    .collection("user_tokens")
    .doc(studentId)
    .get()
    .then((result) => {
      if (result.exists) {
        const tokens = result.data()?.tokens;

        tokens.map((item) => {
          if (item.platform === "web") webToken = item.token;
          if (item.platform === "android") androidToken = item.pushy_token;
        });
      }
    })
    .catch(() => ["", ""]);

  return [webToken, androidToken];
};

export const createCallDocument = async ({
  sessionId,
  meetingId,
  studentBalance,
  platform,
  aggregatedDuration,
  aggregatedEarnings,
}) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set({
      active_call_duration: 0,
      billed_amount: 0,
      instructor_platform: platform,
      meeting_id: meetingId,
      status: "initial",
      student_platform: "",
      session_aggregated_duration: aggregatedDuration ? aggregatedDuration : 0,
      session_aggregated_earnings: aggregatedEarnings ? aggregatedEarnings : 0,
      initial_student_balance: studentBalance,
    })
    .then(() => true)
    .catch(() => false);
};

export const getStudentBalance = async ({ studentId }) => {
  return await (await import('../../firebase-config')).db
    .collection("users")
    .doc(studentId)
    .collection("meta")
    .doc(studentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().balance;
      } else return 0;
    })
    .catch(() => 0);
};

export const listenToCallDoc = async ({ sessionId, meetingId, callback }) => {
  return (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .onSnapshot((snapshot) => {
      let data = snapshot?.data();

      callback(data, () => {});
    });
};

export const getCallDocument = async ({ sessionId, meetingId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      }
      return null;
    })
    .catch(() => null);
};

export const startHandoverInstructor = async ({
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
        status: "handover_instructor",
        instructor_platform: isSmallScreen ? "mweb" : "web",
      },
      { merge: true }
    )
    .then(() => true)
    .catch(() => false);
};

export const completeHandoverStudent = async ({ sessionId, meetingId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set({ status: "engaged" }, { merge: true })
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const updateCallDocumentInstructor = async ({
  sessionId,
  meetingId,
  status,
  duration,
  reason = null,
}) => {
  const indianTime = await fetchIndianTime();
  await (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("chats")
    .doc(meetingId)
    .set(
      {
        message_type: "call_event",
        event_description:
          status === "completed"
            ? `Call Duration • ${formatCallDuration(duration)}`
            : `Missed Call`,
        event_type: status === "completed" ? status : "missed",
        sent_on: +indianTime,
      },
      { merge: true }
    )
    .then(() => true)
    .catch(() => false);

  await (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set(
      {
        active_call_duration: duration,
        billed_amount: duration * 10,
        status: status,
        sent_on: +indianTime,
        reason_for_call_end: reason,
      },
      { merge: true }
    );
};

export const updateStudentEngagementByInstructor = async ({
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

export const updateRtmTokenInSession = async ({ sessionId, token }) => {
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .set({ rtm_token: token }, { merge: true });
};

export const completeHandoverInstructor = async ({ sessionId, meetingId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("calls")
    .doc(meetingId)
    .set({ status: "engaged" }, { merge: true })
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const getInstructorActivity = async ({ instructorId, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .onSnapshot((response) => {
      if (response.exists) {
        callback(response.data());
      } else {
        callback(null);
      }
    });
};

export const updateInstructorStatus = async ({
  isEngaged,
  instructorId,
  activeCallId,
  activeSessionId,
}) => {
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .set(
      {
        is_engaged: isEngaged,
        active_call_id: activeCallId,
        active_call_session_id: activeSessionId,
      },
      { merge: true }
    );
};
