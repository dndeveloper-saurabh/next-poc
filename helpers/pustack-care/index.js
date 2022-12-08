import Axios from "axios";
import "firebase/storage";

export const pickAgentCloudFunction = async () => {
  return await Axios.post(
    "https://us-central1-avian-display-193502.cloudfunctions.net/pickAgentLogic"
  )
    .then((result) => result.data)
    .catch((err) => {
      return null;
    });
};

export const updateChatImage = async (file, userId) => {
  let path = `pustack_care/${userId}/${file?.name}`;
  let _url = null;

  await (await import('../../firebase-config')).storage
    .ref()
    .child(path)
    .put(await fetch(file?.url).then((r) => r.blob()))
    .then(async (snapshot) => {
      return snapshot.ref.getDownloadURL().then((url) => (_url = url));
    });

  return _url;
};

export const updateStudentCareMeta = async (
  userId,
  activeSessionId,
  agentId,
  pastSessionList
) => {

  await (await import('../../firebase-config')).db
    .collection("care_internal")
    .doc("collections")
    .collection("student")
    .doc(userId)
    .set(
      {
        active_session_id: activeSessionId,
        agent_id: agentId,
        past_session_list: pastSessionList,
      },
      { merge: true }
    )
    .catch((err) => console.log(err));
};
