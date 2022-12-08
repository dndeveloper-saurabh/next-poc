import { firestore } from "firebase";

export const fetchInsessionCards = (reference, uid, callback) => {
  return reference
    .collection("in_session_cards")
    .orderBy("timestamp", "asc")
    .onSnapshot(async (card) => {
      let snapshotData = null;

      for (let i = 0; i < card.docs.length; i++) {
        let _cardData;
        let _votes = [];

        if (card.docs[i].data().question_card_status !== "disposed") {
          await reference
            .collection("user_interactions")
            .doc(uid)
            .get()
            .then((a) => {
              if (a.exists) {
                for (let key in a.data().in_session_interactions) {
                  if (key === card.docs[i].data().id) {
                    _votes.push(uid);
                  } else _votes.push(card.docs[i].data().id);
                }

                _cardData = { ...card.docs[i].data(), votes: _votes };
              } else {
                _cardData = { ...card.docs[i].data(), votes: null };
              }
            });

          snapshotData = _cardData;
          break;
        } else snapshotData = null;
      }
      callback(snapshotData);
    });
};

export const fetchPreSessionCards = async (reference, uid) => {
  return await reference
    .collection("pre_session_cards")
    .orderBy("timestamp", "asc")
    .get()
    .then(async (e) => {
      let _data = [];

      for (let i = 0; i < e.docs.length; i++) {
        let _votes = [];

        await reference
          .collection("user_interactions")
          .doc(uid)
          .get()
          .then((a) => {
            if (a.exists) {
              for (let key in a.data().pre_session_interactions) {
                if (key === e.docs[i].data().id) {
                  _votes.push(uid);
                } else _votes.push(e.docs[i].data().id);
              }
            }
          });

        _data.push({
          ...e.docs[i].data(),
          votes: _votes,
        });
      }

      return _data;
    });
};

export const registerStudentVote = ({
  reference,
  quiz_id,
  user_id,
  user_choice,
}) => {
  if (user_choice !== null) {
    reference
      .collection("user_interactions")
      .doc(user_id)
      .set(
        {
          in_session_interactions: {
            [quiz_id]: user_choice,
          },
        },
        { merge: true }
      );

    reference
      .collection("in_session_cards")
      .doc(quiz_id)
      .collection("votes")
      .doc("array")
      .set(
        {
          uid_option_map_array: firestore.FieldValue.arrayUnion({
            [user_id]: user_choice,
          }),
        },
        { merge: true }
      );
  }
};
