import firebase from "firebase";
import {fetchIndianTime} from "../../helpers";

export const fetchLiveComments = (
  reference,
  isDesktop,
  doc,
  callback
) => {
  return doc && doc.timestamp
    ? reference
      .collection("suggestions")
      .orderBy("timestamp", isDesktop ? "desc" : "asc")
      .where("timestamp", ">", doc?.timestamp)
      .onSnapshot(async (e) => {
        let _data = [];
        e.docs.forEach((comment) => {
          _data.push({ ...comment.data(), id: comment.id });
        });
        callback(_data);
      })
    : reference
      .collection("suggestions")
      .orderBy("timestamp", isDesktop ? "desc" : "asc")
      .onSnapshot(async (e) => {
        let _data = [];
        e.docs.forEach((comment) => {
          _data.push({ ...comment.data(), id: comment.id });
        });
        callback(_data);
      });
};

export const fetchComments = (reference, isLive, callback) => {
  return reference
    .collection("suggestions")
    .orderBy("timestamp", "desc")
    .limit(isLive ? 15 : 8)
    .onSnapshot((snapshot) => {
      let _data = [];
      if (snapshot.docs.length !== 0) {
        snapshot.forEach((doc) => {
          _data.push({ ...doc.data(), id: doc.id, hasPendingWrites: snapshot.metadata.hasPendingWrites});
        });
      }

      callback(_data.reverse());
    });
};

export const fetchMoreComments = (reference, doc, callback) => {
  return reference
    .collection("suggestions")
    .orderBy("timestamp", "desc")
    .where("timestamp", "<", doc?.timestamp)
    .limit(10)
    .onSnapshot((snapshot) => {
      let _data = [];
      if (snapshot.docs.length !== 0) {
        snapshot.forEach((doc) => {
          _data.push({ ...doc.data(), id: doc.id });
        });
      }

      callback(_data.reverse());
    });
};

export const postLiveComment = async ({
  reference,
  session_id,
  user_id,
  user_content,
  user_email,
  user_name,
  is_instructor,
  user_profile_pic,
}) => {
  reference.collection("suggestions").add({
    content: user_content,
    posted_by: user_id,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    replied_by: null,
    replied_on: null,
    reply: null,
    session_id,
    user_email,
    user_name,
    user_profile_pic,
    is_instructor,
  });
};

export const replyingToComment = async ({
  reference,
  comment_id,
  user_content,
  user_id,
}) => {
  const indianTime = await fetchIndianTime();
  reference.collection("suggestions").doc(comment_id).set(
    {
      replied_by: user_id,
      replied_on: indianTime,
      reply: user_content,
    },
    { merge: true }
  );
};

export const deleteLiveSessionComment = async ({ reference, comment_id }) => {
  reference
    .collection("suggestions")
    .doc(comment_id)
    .delete()
    .then(() => {
      console.log("Comment successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing Comment: ", error);
    });
};
