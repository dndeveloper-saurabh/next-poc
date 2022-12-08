import firebase from "firebase";
import "firebase/firestore";
import {v4 as uuid} from "uuid";
import {fetchIndianTime} from "../../helpers";
import Axios from "axios";
import {formatDateDoc} from "../livesessions/sessions";

export async function getBlazeSessions({
  user_id,
  type,
  timestamp,
  limit,
  callback,
}) {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .where("student_id", "==", user_id)
    .where("session_status", "==", type)
    .orderBy(timestamp, "desc")
    .limit(limit)
    .onSnapshot((snapshot) => {
      let sessions = [];

      if (snapshot.docs.length === 0) {
      } else {
        for (let i = 0; i < snapshot.docs.length; i++) {
          let _currentDocument = snapshot.docs[i].data();

          sessions.push({
            ..._currentDocument,
            reference: snapshot.docs[i].ref,
          });
        }
      }

      callback(sessions);
    });
}

export const getBlazeCallHistory = ({ reference, callback }) => {
  if (!reference) return;

  return reference
    .collection("calls")
    .orderBy("sent_on", "asc")
    .onSnapshot((e) => {
      let _data = [];

      for (let i = 0; i < e.docs.length; i++) {
        let _current = e.docs[i].data();

        let _currentCall = null;

        _currentCall = {
          type: "call_detail",
          status: _current?.status,
          timestamp: _current?.sent_on,
          duration: _current?.active_call_duration,
          student_platform: _current?.student_platform,
          instructor_platform: _current?.instructor_platform,
        };

        _data.push(_currentCall);
      }
      callback(_data);
    });
};

export function getLatestBlazeReservationChats({
  reference,
  user_id,
  doc,
  callback,
}) {
  if (typeof reference !== "undefined" && doc) {
    return reference
      .collection("chats")
      .orderBy("sent_on", "asc")
      .where("sent_on", ">", doc?.timestamp)
      .onSnapshot((e) => {
        console.log('e - ', e);
        let _data = [];

        for (let i = 0; i < e.docs.length; i++) {
          let _current = e.docs[i].data();

          let _currentChat = null;

          if (_current?.message_type === "text") {
            _currentChat = {
              type: _current?.message_type,
              attachment: _current?.attachment,
              timestamp: _current?.sent_on,
              message: _current?.message,
              isByUser: user_id === _current?.sender_id,
              sender_pic: _current?.sender_profile_picture,
              receiver_id: _current?.receiver_id,
            };
          }
          if (_current?.message_type === "call_event") {
            _currentChat = {
              type: _current?.message_type,
              event_type: _current?.event_type,
              timestamp: _current?.sent_on,
              message: _current?.event_description,
            };
          }
          if (_current?.message_type === "attachment") {
            if (_current?.attachment?.attachment_type === "image") {
              _currentChat = {
                type: "image",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
                receiver_id: _current?.receiver_id,
              };
            } else if (_current?.attachment?.attachment_type === "pdf") {
              _currentChat = {
                type: "document",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
                receiver_id: _current?.receiver_id,
              };
            }
          }

          _data.push(_currentChat);
        }
        callback(_data);
      });
  } else callback([]);
  return () => {};
}

export async function getBlazeReservationChats({ reference, user_id }) {
  if (typeof reference !== "undefined") {
    return await reference
      .collection("chats")
      .orderBy("sent_on", "desc")
      .limit(25)
      .get()
      .then((e) => {
        let _data = [];

        for (let i = 0; i < e.docs.length; i++) {
          let _current = e.docs[i].data();

          let _currentChat = null;

          if (_current?.message_type === "text") {
            _currentChat = {
              type: _current?.message_type,
              attachment: _current?.attachment,
              timestamp: _current?.sent_on,
              message: _current?.message,
              isByUser: user_id === _current?.sender_id,
              sender_pic: _current?.sender_profile_picture,
            };
          }
          if (_current?.message_type === "call_event") {
            _currentChat = {
              type: _current?.message_type,
              event_type: _current?.event_type,
              timestamp: _current?.sent_on,
              message: _current?.event_description,
            };
          }
          if (_current?.message_type === "attachment") {
            if (_current?.attachment?.attachment_type === "image") {
              _currentChat = {
                type: "image",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
              };
            } else if (_current?.attachment?.attachment_type === "pdf") {
              _currentChat = {
                type: "document",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
              };
            }
          }

          _data.push(_currentChat);
        }
        return _data.reverse();
      })
      .catch((err) => console.log(err));
  } else return [];
}

export async function getMoreBlazeReservationChats({
  reference,
  user_id,
  doc,
}) {
  if (typeof reference !== "undefined") {
    return await reference
      .collection("chats")
      .orderBy("sent_on", "desc")
      .where("sent_on", "<", doc?.timestamp)
      .limit(10)
      .get()
      .then((e) => {
        let _data = [];

        for (let i = 0; i < e.docs.length; i++) {
          let _current = e.docs[i].data();

          let _currentChat = null;

          if (_current?.message_type === "text") {
            _currentChat = {
              type: _current?.message_type,
              attachment: _current?.attachment,
              timestamp: _current?.sent_on,
              message: _current?.message,
              isByUser: user_id === _current?.sender_id,
              sender_pic: _current?.sender_profile_picture,
            };
          }
          if (_current?.message_type === "call_event") {
            _currentChat = {
              type: _current?.message_type,
              event_type: _current?.event_type,
              timestamp: _current?.sent_on,
              message: _current?.event_description,
            };
          }
          if (_current?.message_type === "attachment") {
            if (_current?.attachment?.attachment_type === "image") {
              _currentChat = {
                type: "image",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
              };
            } else if (_current?.attachment?.attachment_type === "pdf") {
              _currentChat = {
                type: "document",
                attachment: {
                  url: _current?.attachment?.attachment_url,
                  name: _current?.attachment?.attachment_name,
                },
                timestamp: _current?.sent_on,
                isByUser: user_id === _current?.sender_id,
                message: _current?.message,
                sender_pic: _current?.sender_profile_picture,
              };
            }
          }

          _data.push(_currentChat);
        }
        return _data.reverse();
      })
      .catch((err) => console.log(err));
  } else return null;
}

const uploadImage = async (file, sessionId, userId) => {
  var path = `blaze_sessions/${sessionId}/from-${userId}/${uuid()}.png`;
  var _url = await (await import('../../firebase-config')).storage
    .ref()
    .child(path)
    .put(await fetch(file.url).then((r) => r.blob()))
    .then(async (snapshot) => {
      return snapshot.ref.getDownloadURL().then((url) => url);
    });

  return _url;
};

const uploadPdf = async (file, sessionId, userId) => {
  var path = `blaze_sessions/${sessionId}/from-${userId}/${uuid()}.png`;
  var _url = await (await import('../../firebase-config')).storage
    .ref()
    .child(path)
    .put(await fetch(file.url).then((r) => r.blob()))
    .then(async (snapshot) => {
      return snapshot.ref.getDownloadURL().then((url) => url);
    });

  return _url;
};

export async function sendBlazeChat({
  user,
  text,
  reference,
  images = [],
  pdfs = [],
  session_id,
  receiver_id,
  student_grade,
  type,
}) {
  let _imageUrl, _pdfUrl;

  let attachment;

  if (images.length > 0) {
    _imageUrl = await uploadImage(images[0], session_id, user?.uid).then(
      (url) => url
    );

    attachment = {
      attachment_name: images[0].name,
      attachment_type: "image",
      attachment_url: _imageUrl,
    };
  }
  if (pdfs.length > 0) {
    _pdfUrl = await uploadPdf(pdfs[0], session_id, user?.uid).then(
      (url) => url
    );

    attachment = {
      attachment_name: pdfs[0].name,
      attachment_type: "pdf",
      attachment_url: _pdfUrl,
    };
  }

  let indianTime = await fetchIndianTime();

  const chatObject = {
    message: text,
    message_type: type,
    attachment: images.length > 0 || pdfs.length > 0 ? attachment : null,
    sender_id: user?.uid,
    sender_name: user?.name,
    sender_profile_picture: user?.profile_url,
    receiver_id: receiver_id,
    sent_on: +indianTime,
  };

  const deliverBlazeMessageNotification = (await import('../../firebase-config')).functions.httpsCallable(
    "deliverBlazeMessageNotification"
  );

  await reference.collection("chats").add(chatObject);
  await reference
    .set({ last_message_ts: +indianTime }, { merge: true })
    .catch((err) => console.log(err));

  if (user?.is_external_instructor) {
    if (receiver_id) {
      deliverBlazeMessageNotification({
        receiver_id: receiver_id,
        message: chatObject,
        session_id: session_id,
      }).catch((err) => console.log(err));

      reference
        .collection("chat_meta")
        .doc(receiver_id)
        .set(
          {
            unread_count: firebase.firestore.FieldValue.increment(1),
            last_message: chatObject,
          },
          { merge: true }
        );

      (await import('../../firebase-config')).db.collection("user_notifications")
        .doc(student_grade)
        .collection("user_notifications")
        .doc(receiver_id)
        .set(
          {
            unread_blaze_message_count:
              firebase.firestore.FieldValue.increment(1),
          },
          { merge: true }
        );
    }
  } else {
    if (receiver_id) {
      deliverBlazeMessageNotification({
        receiver_id: receiver_id,
        message: chatObject,
        session_id: session_id,
      }).catch((err) => console.log(err));

      reference
        .collection("chat_meta")
        .doc(receiver_id)
        .set(
          {
            unread_count: firebase.firestore.FieldValue.increment(1),
            last_message: chatObject,
          },
          { merge: true }
        );

      (await import('../../firebase-config')).db.collection("user_notifications")
        .doc("instructor")
        .collection("user_notifications")
        .doc(receiver_id)
        .set(
          {
            unread_blaze_message_count:
              firebase.firestore.FieldValue.increment(1),
          },
          { merge: true }
        );
    }
  }
}

export const blazeDecreaseMessageCount = async (
  reference,
  count,
  grade,
  userId,
  isExternalInstructor
) => {
  const decrement = firebase.firestore.FieldValue.increment(-1 * count);

  let totalMessagesUnreadCountRef = (await import('../../firebase-config')).db
    .collection("user_notifications")
    .doc(isExternalInstructor ? "instructor" : grade)
    .collection("user_notifications")
    .doc(userId);

  if (reference !== null) {
    reference.collection("chat_meta").doc(userId).set(
      {
        unread_count: 0,
      },
      { merge: true }
    );

    totalMessagesUnreadCountRef
      .update({
        unread_blaze_message_count: decrement,
      })
      .catch((err) => console.log(err));
  }
};

export const blazeInstructorMetaDetails = async (instructorId) => {
  if (typeof instructorId !== "undefined") {
    const metaRef = (await import('../../firebase-config')).db
      .collection("users")
      .doc(instructorId)
      .collection("meta")
      .doc(instructorId);

    return await metaRef.get().then((data) => data.data());
  }

  return null;
};

export const blazeUnreadMesagesNotification = async ({
  userId,
  grade,
  isExternal,
  callback,
}) => {
  return (await import('../../firebase-config')).db.collection("user_notifications")
    .doc(isExternal ? "instructor" : grade)
    .collection("user_notifications")
    .doc(userId)
    .onSnapshot((snapshot) => {
      if (snapshot.exists) {
        let _data = snapshot.data();
        if (_data["unread_blaze_message_count"] > 0) {
          return callback(true);
        }

        callback(false);
      }
    });
};

export const blazeReservationMeta = async ({ grade }) => {
  return await (await import('../../firebase-config')).db
    .collection(`blaze/${grade}/hierarchy`)
    .doc(grade)
    .get()
    .then((doc) => {
      const _data = doc.data();

      return _data["subject_chapter_map"];
    })
    .catch((_) => {});
};

export const subjectColorsMeta = async ({ grade }) => {
  return await (await import('../../firebase-config')).db
    .collection(`blaze_dev/collections/hierarchy`)
    .doc(grade)
    .get()
    .then((doc) => {
      const _data = doc.data();

      return _data["subject_color_map"];
    })
    .catch((_) => {});
};

export const getStudentActiveSessionDetails = async ({ studentId, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(studentId)
    .onSnapshot((response) => {
      if (response.exists) {
        callback(response.data());
      } else {
        callback(null);
      }
    });
};

export const getRtmToken = async ({ sessionId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .get()
    .then((response) => {
      if (response.exists) {
        return response.data()?.rtm_token;
      } else return null;
    })
    .catch(() => null);
};

export const endSession = async ({
  sessionId,
  completedTs,
  studentId,
  instructorId,
  instructorName,
  instructorProfilePic,
  topic,
  skill,
  ratingTs,
  rating = null,
}) => {
  if (completedTs) {
    if (instructorId && !ratingTs) {
      await (await import('../../firebase-config')).db
        .collection("blaze_dev")
        .doc("collections")
        .collection("students")
        .doc(studentId)
        .set(
          {
            pending_rating_list: firebase.firestore.FieldValue.arrayUnion({
              instructor_id: instructorId,
              instructor_name: instructorName,
              instructor_profile_pic: instructorProfilePic,
              session_id: sessionId,
              topic: topic,
              skill: skill,
              rating_ts: null,
            }),
          },
          { merge: true }
        );
    }

    if (rating) {
      Axios.post(
        "https://us-central1-avian-display-193502.cloudfunctions.net/updateSkillRating",
        {
          rating: rating,
          skill: skill,
          instructorId: instructorId,
          sessionId: sessionId,
          studentId: studentId,
          context: {
            auth: studentId,
          },
        }
      )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }

    return await (await import('../../firebase-config')).db
      .collection("blaze_dev")
      .doc("collections")
      .collection("blaze_sessions")
      .doc(sessionId)
      .set(
        {
          session_status: "completed",
          completed_ts: completedTs,
          rating: rating,
          rating_ts: ratingTs,
        },
        { merge: true }
      )
      .then(() => true)
      .catch(() => false);
  } else {
    if (rating) {
      Axios.post(
        "https://us-central1-avian-display-193502.cloudfunctions.net/updateSkillRating",
        {
          rating: rating,
          skill: skill,
          instructorId: instructorId,
          sessionId: sessionId,
          studentId: studentId,
          context: {
            auth: studentId,
          },
        }
      )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    return await (await import('../../firebase-config')).db
      .collection("blaze_dev")
      .doc("collections")
      .collection("blaze_sessions")
      .doc(sessionId)
      .set(
        {
          rating: rating,
          rating_ts: ratingTs,
        },
        { merge: true }
      )
      .then(() => true)
      .catch(() => false);
  }
};

export const pendingSessionList = async ({ studentId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(studentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().pending_rating_list || [];
      }
    })
    .catch(() => []);
};

export const updatePendingRatingList = async ({ session, completedTs }) => {
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(session?.student_id)
    .set(
      {
        pending_rating_list: firebase.firestore.FieldValue.arrayUnion({
          completed_ts: completedTs,
          instructor_id: session?.instructor_id,
          instructor_name: session?.instructor_name,
          session_id: session?.id,
          topic: session?.topic,
        }),
        session_count: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );
};

export const updateInstructorRating = async ({ instructorId, topic, rating }) => {
  (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("instructors")
    .doc(instructorId)
    .collection("stats")
    .doc("topic_wise_rating")
    .get()
    .then(async (doc) => {
      let topicArray = [rating];
      if (doc.exists) {
        let ratingMap = doc.data().rating_map;
        if (ratingMap) {
          topicArray = ratingMap[topic];

          if (topicArray) topicArray.push(rating);
          else topicArray = [rating];
        }
      }

      (await import('../../firebase-config')).db.collection("blaze_dev")
        .doc("collections")
        .collection("instructors")
        .doc(instructorId)
        .collection("stats")
        .doc("topic_wise_rating")
        .set(
          {
            rating_map: {
              [topic]: topicArray,
            },
          },
          { merge: true }
        );
    })
    .catch((err) => console.log(err));
};

export const getInstructorRatings = async ({ instructorId }) => {
  if (instructorId) {
    return await (await import('../../firebase-config')).db
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
        }
      });
  }
};

export const listenToUnreadMessages = async ({ sessionId, userId, callback }) => {
  if (sessionId) {
    return (await import('../../firebase-config')).db.collection("blaze_dev")
      .doc("collections")
      .collection("blaze_sessions")
      .doc(sessionId)
      .collection("chat_meta")
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data().unread_count);
        }
      });
  }
  return () => {};
};

export const listenToOutstandingSession = async ({ sessionId, callback }) => {
  if (sessionId) {
    return (await import('../../firebase-config')).db
      .collection("blaze_dev")
      .doc("collections")
      .collection("blaze_sessions")
      .doc(sessionId)

      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data(), () => {});
        }
      });
  }
  return () => {};
};

export const isStudentEngaged = async ({ studentId }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(studentId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const isEngaged = doc.data().is_engaged;
        const sessionId = doc.data().active_call_session_id;
        const meetingId = doc.data().active_call_id;

        if (isEngaged) {
          return await (await import('../../firebase-config')).db
            .collection("blaze_dev")
            .doc("collections")
            .collection("blaze_sessions")
            .doc(sessionId)
            .collection("calls")
            .doc(meetingId)
            .get()
            .then((doc1) => {
              if (doc1.exists) {
                let status = doc1.data().status;

                if (status === "initial" || status === "accepted") {
                  return true;
                } else return false;
              } else return false;
            })
            .catch(() => true);
        }
      } else return false;
    })
    .catch(() => true);
};

export const getReceiverUnreadCount = async ({ sessionId, receiverId, callback }) => {
  return (await import('../../firebase-config')).db.collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(sessionId)
    .collection("chat_meta")
    .doc(receiverId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data().unread_count);
      } else {
        callback(0);
      }
    });
};

/**
 *
 * @param studentId
 * @returns {Promise<*[]>}
 */
export const getActiveStudentSessions = async (studentId) => {
  return (await import('../../firebase-config')).db.collection('/blaze_dev/collections/blaze_sessions')
    .where('student_id', '==', studentId)
    .where('session_status', '!=', 'completed')
    .get()
    .then(querySnapshot => {
      let a = [];
      querySnapshot.forEach(c => a.push(c.data()))
      return a;
    })
}

/**
 * @param studentId
 * @description Will return the remaining minutes of particular student for today.
 */
export const usedMinutesForToday = async (studentId) => {
  const ist = await fetchIndianTime();
  return (await import('../../firebase-config')).db.collection('/blaze_dev/collections/students/' + studentId + '/engagement')
    .doc(formatDateDoc(ist, false, true))
    .get()
    .then(c => {
      if(c.exists) {
        const d = c.data();
        if(!d.daily_engagement[formatDateDoc(ist)]) return 0;
        return Object.keys(d.daily_engagement[formatDateDoc(ist)]).reduce((acc, cur) => {
          acc += d.daily_engagement[formatDateDoc(ist)][cur].call_duration;
          return acc;
        }, 0);
      }
      console.log('Document not found in used Minutes.')
      return null;
    })
}
