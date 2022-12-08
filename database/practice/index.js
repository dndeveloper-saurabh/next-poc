import "firebase/firestore";

export const getSubjectPracticeData = async ({
  grade,
  subjectId,
  practiceId,
}) => {
  return await require('../../firebase-config').db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_practice`)
    .collection("category")
    .doc(subjectId)
    .collection("exam")
    .doc(practiceId)
    .get()
    .then((doc) => doc.data())
    .catch((_) => null);
};

export const getItemDetails = async ({
  grade,
  subjectId,
  practiceId,
  itemId,
}) => {
  return await require('../../firebase-config').db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_practice`)
    .collection("category")
    .doc(subjectId)
    .collection("exam")
    .doc(practiceId)
    .collection("exam_item")
    .doc(itemId)
    .get()
    .then((doc) => doc.data())
    .catch((_) => null);
};

export const getHeaderItemDetails = async ({
  grade,
  subjectId,
  practiceId,
  parentId,
  itemId,
}) => {
  return await require('../../firebase-config').db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_practice`)
    .collection("category")
    .doc(subjectId)
    .collection("exam")
    .doc(practiceId)
    .collection("exam_item")
    .doc(parentId)
    .collection("exam_header_item")
    .doc(itemId)
    .get()
    .then((doc) => doc.data())
    .catch((_) => null);
};

export const getExamUserEngagement = async ({ grade, userId, practiceId }) => {
  return await require('../../firebase-config').db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc(practiceId)
    .get()
    .then((doc) => doc.data())
    .catch((_) => null);
};
