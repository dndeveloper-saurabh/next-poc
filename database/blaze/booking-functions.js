import {fetchIndianTime, makeUniqueId} from "../../helpers";

/// BookingPopup.js
export async function getFilterData(grade) {
  let filter_info_doc;
  var docRef = (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc('collections')
    .collection("hierarchy")
    .doc(grade);

  await docRef
    .get()
    .then(async function (doc) {
      if (doc.exists) {
        filter_info_doc = doc;
      } else {
        // doc.data() will be undefined in this case
        filter_info_doc = null;
      }
    })
    .catch(function (error) {
      console.error(`Error ${error} while getFilterData for grade: ${grade}`);
    });

  return filter_info_doc;
}

export const getClassChapters = async (grade) => {
  let chapters;
  var docRef2 = (await import('../../firebase-config')).db
    .collection("blaze")
    .doc(grade)
    .collection("hierarchy")
    .doc(grade);

  await docRef2
    .get()
    .then(function (doc) {
      if (doc.exists) {
        chapters = doc.data().subject_chapter_map;
      } else {
        // doc.data() will be undefined in this case
        chapters = null;
      }
    })
    .catch(function (error) {
      console.error(
        `Error ${error} while get Class Chapters for grade: ${grade}`
      );
    });

  return chapters;
};

const queryFormatter = ({ category, subject }) => {
  let query = null;

  if (category === "Maths" || category === "maths") {
    query = `${new Date().getFullYear()}_${category.toLowerCase()}_availability`;
  } else if (
    category !== null &&
    subject !== null &&
    typeof subject !== "undefined" &&
    subject !== "" &&
    subject !== ""
  ) {
    query = `${new Date().getFullYear()}_${category.toLowerCase()}_${subject
      .toLowerCase()
      .replace(" ", "_")}_availability`;
  }

  return query;
};

export const fetchAvailableDates = async ({ category, subject, grade }) => {
  if (queryFormatter({ category, subject }) !== null) {
    let _queryData = [];

    await (await import('../../firebase-config')).db
      .collection("blaze")
      .doc(grade)
      .collection("blaze_availability")
      .doc(queryFormatter({ category, subject }))
      .collection(`${new Date().getFullYear()}_${new Date().getMonth() + 1}`)
      .doc("monthly_summary")
      .get()
      .then((e) => {
        if (e.exists) {
          _queryData.push(e.data()?.monthly_availability_count);
        } else {
          _queryData.push(null);
        }
      });

    await (await import('../../firebase-config')).db
      .collection("blaze")
      .doc(grade)
      .collection("blaze_availability")
      .doc(queryFormatter({ category, subject }))
      .collection(`${new Date().getFullYear()}_${new Date().getMonth() + 2}`)
      .doc("monthly_summary")
      .get()
      .then((e) => {
        if (e.exists) {
          _queryData.push(e.data()?.monthly_availability_count);
        } else {
          let _dates = [];
          for (let i = 0; i < 31; i++) {
            _dates.push(0);
          }
          _queryData.push(_dates);
        }
      });

    return _queryData;
  }
};

export const fetchTimeSlots = async ({ date, grade, category, subject }) => {
  return await (await import('../../firebase-config')).db
    .collection("blaze")
    .doc(grade)
    .collection("blaze_availability")
    .doc(queryFormatter({ category, subject }))
    .collection(`${date.getFullYear()}_${date.getMonth() + 1}`)
    .doc(`${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`)
    .collection("ts_availability_count")
    .doc("mapping")
    .get()
    .then((e) => {
      let _results = [];

      if (e.exists) {
        for (const [key, value] of Object.entries(e?.data()?.map)) {
          if (value > 0) {
            _results.push(key);
          }
        }
      }

      return _results;
    });
};

export const checkPriorBookings = async ({
  date,
  timeslots,
  grade,
  userid,
}) => {
  let _tempslots = timeslots;

  const userBookings = await (await import('../../firebase-config')).db
    .collection("blaze")
    .doc(grade)
    .collection("blaze_reservations")
    .doc(userid)
    .collection("reservations")
    .where("reservation_status", "==", "payment_captured")
    .get();

  try {
    userBookings.forEach((booking) => {
      const { day, hour, month, year } = booking?.data()?.session_start_time;

      if (
        year === new Date().getFullYear() &&
        month === date.getMonth() &&
        day === date.getDate() &&
        _tempslots.includes(hour)
      ) {
        _tempslots.splice(_tempslots.indexOf(hour), 1);
      }
    });
  } catch (e) {
    return _tempslots;
  }

  return _tempslots;
};

const uploadImage = async (file, sessionId, userId) => {
  const path = `blaze_sessions/${sessionId}/from-${userId}/${file.name}`;
  return await (await import('../../firebase-config')).storage
    .ref()
    .child(path)
    .put(await fetch(file.url).then((r) => r.blob()))
    .then(async (snapshot) => {
      return snapshot.ref.getDownloadURL().then((url) => url);
    });
};

export const requestSession = async ({
  skillId,
  studentId,
  studentName,
  profilePic,
  topic,
  doubtDetails,
  images,
  subject_color_gradient,
  refundCount,
  sessionCount,
}) => {
  // TODO: Replace this with firestore doc id
  const requestId = makeUniqueId(28);
  const indianTime = await fetchIndianTime();

  await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("students")
    .doc(studentId)
    .get()
    .then(async (result) => {
      if (!result.exists) {
        (await import('../../firebase-config')).db.collection("blaze_dev")
          .doc("collections")
          .collection("students")
          .doc(studentId)
          .set({
            active_call_id: null,
            active_call_session_id: null,
            is_engaged: false,
            pending_rating_list: [],
            refund_count: 0,
            session_count: 0,
          });
      }
    })
    .catch((err) => console.log(err));

  await (await import('../../firebase-config')).db
    .collection("blaze_dev")
    .doc("collections")
    .collection("blaze_sessions")
    .doc(requestId)
    .set({
      accepted_ts: null,
      aggregated_duration: 0,
      aggregated_earnings: 0,
      completed_ts: null,
      id: requestId,
      instructor_id: null,
      instructor_name: null,
      instructor_profile_pic: null,
      requested_ts: +indianTime,
      rtm_token: null,
      session_status: "outstanding",
      skill: skillId,
      subject_color_gradient: subject_color_gradient,
      student_id: studentId,
      student_name: studentName,
      student_profile_pic: profilePic,
      rating: null,
      student_refund_count: refundCount ? refundCount : 0,
      student_session_count: sessionCount ? sessionCount : 0,
      topic: topic,
    })
    .then(async () => {
      if (images?.length > 0) {
        let _imageUrl = await uploadImage(images[0], requestId, studentId);

        let attachment = {
          attachment_name: images[0].name,
          attachment_type: "image",
          attachment_url: _imageUrl,
        };

        await (await import('../../firebase-config')).db
          .collection("blaze_dev")
          .doc("collections")
          .collection("blaze_sessions")
          .doc(requestId)
          .collection("chats")
          .add({
            message: "",
            sender_id: studentId,
            sender_name: studentName,
            sender_profile_picture: profilePic,
            sent_on: +indianTime,
            attachment: attachment,
            receiver_id: null,
            message_type: "attachment",
          });
      }
      if (doubtDetails?.trim().length > 0) {
        await (await import('../../firebase-config')).db
          .collection("blaze_dev")
          .doc("collections")
          .collection("blaze_sessions")
          .doc(requestId)
          .collection("chats")
          .add({
            message: doubtDetails,
            sender_id: studentId,
            sender_name: studentName,
            sender_profile_picture: profilePic,
            sent_on: +indianTime,
            attachment: null,
            receiver_id: null,
            message_type: "text",
          });
      }
    })
    .then(() => true)
    .catch(() => false);

  return requestId;
};
