import firebase from "firebase/app";
import "firebase/firestore";

import {fetchIndianTime, youTubeGetID} from "../../helpers";

export const getLectureItemsForChapter = async ({ grade, chapter_id }) => {
  const _category = chapter_id.split("_")[3];
  const _subject = chapter_id.split("_")[4];

  let subjectPath = `${grade}_learn_${_category}`;

  if (_category !== "maths" && _category !== "mathematics") {
    subjectPath = `${grade}_learn_${_category}_${_subject}`;
  }

  return await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_learn`)
    .collection("category")
    .doc(`${grade}_learn_${_category}`)
    .collection("subject")
    .doc(subjectPath)
    .collection("chapter")
    .doc(chapter_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let tabs = [];

        let _tabs_map = doc.data()._meta;

        _tabs_map.sort((a, b) => (a.serial_order > b.serial_order ? 1 : -1));

        for (var i = 0; i < _tabs_map?.length; i++) {
          tabs.push(_tabs_map[i]);
        }

        return [doc.data(), tabs];
      }

      return null;
    });
};

export const fetchLectureItem = async ({
  grade,
  lecture_id,
  chapter,
  tab_id,
}) => {
  const _category = chapter.split("_")[3];
  const _subject = chapter.split("_")[4];

  let subjectPath = `${grade}_learn_${_category}`;

  if (_category !== "maths" && _category !== "mathematics") {
    subjectPath = `${grade}_learn_${_category}_${_subject}`;
  }

  if (lecture_id && chapter && tab_id) {
    return await (await import('../../firebase-config')).db
      .collection("cms_data")
      .doc(grade)
      .collection("scope")
      .doc(`${grade}_learn`)
      .collection("category")
      .doc(`${grade}_learn_${_category}`)
      .collection("subject")
      .doc(subjectPath)
      .collection("chapter")
      .doc(chapter)
      .collection("tab")
      .doc(tab_id)
      .collection("lecture_item")
      .doc(lecture_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let _data = doc.data();

          if (_data?.lecture_item_type === "video") {
            return {
              type: "video",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              youtube: youTubeGetID(_data?.youtube_url),
              notes: _data?.notes_link,
              item: _data
            };
          } else if (_data?.lecture_item_type === "note") {
            return {
              type: "note",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              notes: _data?.notes_link,
              youtube: null,
              item: _data
            };
          }
        }

        return null;
      })
      .catch((err) => console.log(err));
  } else return null;
};

export const fetchLectureHeaderItem = async ({
  grade,
  lecture_id,
  parent_id,
  chapter,
  tab_id,
}) => {

  console.log('comeing - - here');

  const _category = chapter.split("_")[3];
  const _subject = chapter.split("_")[4];
  let subjectPath = `${grade}_learn_${_category}`;

  if (_category !== "maths" && _category !== "mathematics") {
    subjectPath = `${grade}_learn_${_category}_${_subject}`;
  }

  if (lecture_id && parent_id && chapter && tab_id) {
    const docRef = (await import('../../firebase-config')).db
      .collection("cms_data")
      .doc(grade)
      .collection("scope")
      .doc(`${grade}_learn`)
      .collection("category")
      .doc(`${grade}_learn_${_category}`)
      .collection("subject")
      .doc(subjectPath)
      .collection("chapter")
      .doc(chapter)
      .collection("tab")
      .doc(tab_id)
      .collection("lecture_item")
      .doc(parent_id)
      .collection("lecture_header_item")
      .doc(lecture_id);

    console.log('docRef - path - ', docRef.path);

    return await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let _data = doc.data();

          if (_data?.lecture_header_item_type === "video") {
            return {
              type: "video",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              youtube: youTubeGetID(_data?.youtube_url),
              notes: _data?.notes_link,
              item: _data
            };
          } else if (_data?.lecture_header_item_type === "note") {
            return {
              type: "note",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              notes: _data?.notes_link,
              youtube: null,
              item: _data
            };
          }
        }

        return null;
      });
  } else return null;
};

// analytics

export const userEngagementChapterData = async ({
  userId,
  grade,
  chapter_id,
}) => {
  if (chapter_id) {
    const category = chapter_id.split("_")[3];
    const subject = chapter_id.split("_")[4];

    let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

    if (category === "maths") {
      chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
    }

    return await (await import('../../firebase-config')).db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .get()
      .then((doc) => doc.data())
      .catch((error) => console.log(error));
  } else return null;
};

export const userEngagementMapData = async ({ userId, grade, chapter_id }) => {
  if (chapter_id) {
    const category = chapter_id.split("_")[3];
    const subject = chapter_id.split("_")[4];

    let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

    if (category === "maths") {
      chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
    }

    return await (await import('../../firebase-config')).db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .collection(chapter_id)
      .doc("engagement_map")
      .get()
      .then((doc) => doc.data())
      .catch((error) => console.log(error));
  } else return null;
};

export const getContinueWatchingList = async ({ grade, userId }) => {
  const doc = (await import('../../firebase-config')).db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc("latest_engagement");

  return doc;
};

export const getUserLatestEngagement = async ({ grade, userId }) => {
  return await (await import('../../firebase-config')).db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc("latest_engagement")
    .get()
    .then((doc) => doc.data()?.chapter_list);
};

export const getUserDailyEngagement = async ({ grade, userId, yearMonth }) => {
  return await (await import('../../firebase-config')).db
    .collection("user_engagement")
    .doc("daily_engagement")
    .collection(userId)
    .doc(yearMonth)
    .get()
    .then((doc) => {
      if (doc.exists) return doc.data();
      else return null;
    });
};

export const getChapterLastEngagementData = async ({
  userId,
  grade,
  chapter_id,
}) => {
  if (chapter_id) {
    const category = chapter_id.split("_")[3];
    const subject = chapter_id.split("_")[4];

    let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

    if (category === "maths") {
      chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
    }

    return await (await import('../../firebase-config')).db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .collection(chapter_id)
      .doc("engagement_map")
      .get()
      .then((doc) => doc.data())
      .catch((error) => console.error(error));
  } else return null;
};

export const getCompletionStatusByChapter = async ({
  userId,
  grade,
  chapter_id,
}) => {
  if (chapter_id) {
    const category = chapter_id.split("_")[3];
    const subject = chapter_id.split("_")[4];

    let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

    if (category === "maths") {
      chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
    }

    const res = await (await import('../../firebase-config')).db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .get()
      .then((doc) => doc.data()?.completion_status_by_chapter);

    if (typeof res === "undefined") return null;
    return [res[chapter_id], res];
  }

  return null;
};

export const userImportantData = async (userId) => {
  const doc = (await import('../../firebase-config')).db.collection("users").doc(userId);
  // .then((doc) => doc.data().tier === "pro");

  return doc;
};

export const setDeviceToken = async (token, userId) => {
  const indianTime = await fetchIndianTime();
  (await import('../../firebase-config')).db.collection("user_tokens")
    .doc(userId)
    .set(
      {
        tokens: firebase.firestore.FieldValue.arrayUnion({
          created_ts: +indianTime,
          platform: "web",
          token: token,
        }),
      },
      { merge: true }
    )
    .catch((err) => console.log(err));
};

export const getCurrentVersion = async () => {
  return await (await import('../../firebase-config')).db
    .collection("web_version")
    .doc("latest_version")
    .get()
    .then((doc) => doc.data())
    .catch((err) => console.log(err));
};

export const createProOrder = async ({ planId, userId, userGrade }) => {
  const createProOrderFunction = (await import('../../firebase-config')).functions.httpsCallable("createProOrder");

  const response = await createProOrderFunction({
    plan_id: planId,
    user_id: userId,
    user_grade: userGrade,
  });

  return response?.data;
};

export const getPlans = async () => {
  return await (await import('../../firebase-config')).db
    .collection("products")
    .doc("pro")
    .get()
    .then((doc) => doc.data().plans)
    .catch((_) => null);
};
