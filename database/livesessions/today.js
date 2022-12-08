import {castIndianTime, fetchIndianTime} from "../../helpers";

const getDateFromHash = (data) => {
  return new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
};

export const listenForLiveSessions = async ({grade, callback, isUserPro}) => {
  let today = await castIndianTime();

  let month = `${today.getFullYear()}_${today.getMonth() + 1}`; // 2021_6

  await require('../../firebase-config').db
    .collection("live_session")
    .doc(grade)
    .collection("calendar_events")
    .doc("calendar_events")
    .collection(month)
    .doc(`${month}_${today.getDate()}`) // 2021_6_5
    .onSnapshot(async (snapshot) => {
      // If any sessions exist for today
      if (snapshot.exists) {
        let _data = snapshot.data();

        // If any sessions exist for today in this document
        if (_data["session_event_list"]?.length > 0) {
          // Get a reference to list
          let _list = _data["session_event_list"].reduce((acc, cur) => {
            let itHas = acc.some(c => c.live_session_id === cur.live_session_id);
            if (itHas) {
              acc = acc.filter(c => c.live_session_id !== cur.live_session_id);
            }
            acc = [...acc, cur];
            return acc;
          }, []);

          for (let iterator = 0; iterator < _list?.length; iterator++) {
            let _session = _list[iterator];

            if (
              _session?.session_status === "live" &&
              (_session?.access_tier === "Free" || isUserPro)
            ) {

              console.log('live session floating player - ', _session);
              let _sessionID = _session?.live_session_id;

              let _current = await require('../../firebase-config').db
                .collection("live_session")
                .doc(grade)
                .collection("sessions")
                .doc(_sessionID)
                .get()
                .then((e) => {
                  let _data = e.data();

                  return _data;
                });

              callback(
                _sessionID,
                _current.video_key,
                _current.video_host?.toLowerCase() ?? 'vimeo',
                getDateFromHash(_session.air_time),
                _current.session_status
              );
              return;
            }
          }
          callback(null, null, null);
        } else {
          callback(null, null, null);
        }
      } else {
        callback(null, null, null);
      }
    });
};

export const listenForTodayLiveSessions = async ({ grade, isUserPro, callback }) => {
  let today = await fetchIndianTime();
  let month = `${today.getFullYear()}_${today.getMonth() + 1}`;

  return require('../../firebase-config').db.collection("live_session")
    .doc(grade)
    .collection("calendar_events")
    .doc("calendar_events")
    .collection(month)
    .doc(`${month}_${today.getDate()}`)
    .onSnapshot(async (snapshot) => {
      // If any sessions exist for today
      if (snapshot.exists) {
        let _data = snapshot.data();

        // If any sessions exist for today in this document
        if (_data["session_event_list"]?.length > 0) {
          // Get a reference to list
          let _list = _data["session_event_list"];

          for (let iterator = 0; iterator < _list?.length; iterator++) {
            let _session = _list[iterator];

            if (
              _session?.session_status === "live" &&
              today.getTime() >
                getDateFromHash(_session?.air_time).getTime() &&
              (_session?.access_tier === "Free" || isUserPro)
            ) {
              return callback(true);
            }
          }
          callback(false);
        }
      }
    });
};
