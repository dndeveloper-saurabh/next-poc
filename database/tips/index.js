
import { youTubeGetID } from "../../helpers";

export const getSubjectTips = async ({ grade, subjectId }) => {
  return await require('../../firebase-config').db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_tips`)
    .collection("category")
    .doc(subjectId)
    .get()
    .then((doc) => doc.data())
    .catch((_) => null);
};

export const getVideoId = async ({ grade, subjectId, tipId }) => {
  return await require('../../firebase-config').db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_tips`)
    .collection("category")
    .doc(subjectId)
    .collection("tip")
    .doc(tipId)
    .get()
    .then((doc) => youTubeGetID(doc.data().youtube_url))
    .catch((_) => null);
};

export const getTipsEngaggementStatus = async ({
  grade,
  userId,
  subjectId,
}) => {
  return await require('../../firebase-config').db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc(subjectId)
    .get()
    .then((doc) => (doc.data() || "" ? doc.data().tip_engagement_status : null))
    .catch((_) => null);
};
