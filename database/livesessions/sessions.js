
import firebase, {firestore} from "firebase";
import {fetchIndianTime} from "../../helpers";
import axios from "axios";
import {getAvailableGrades} from "../home/fetcher";
import {createRoom} from "../agora/agora-functions";
import {v4} from "uuid";


const CLOUD_REGION = 'us-central1';
const CLOUD_PROJECT_ID = 'avian-display-193502';

const getFunctionName = functionName => `https://${CLOUD_REGION}-${CLOUD_PROJECT_ID}.cloudfunctions.net/${functionName}`;

const addToTime = (date, milliseconds) => {
  const d = new Date(date);
  d.setMilliseconds(d.getMilliseconds() + milliseconds);
  return d;
}

export async function orchestrateLiveSession({
                                               session,
                                               isUpdate,
                                               isDelete,
                                             }) {
  const startTime = getDateFromHash(session.air_time);
  const notifyTs = +addToTime(startTime, -15000);

  const payLoad = {
    "session_id": session.live_session_id,
    "grade": session.grade.id,
    "display_name": session.display_name,
    "tier": session.access_tier.toLowerCase(),
    "notify_ts": notifyTs / 1000,
    "start_ts": +startTime / 1000,
    "end_ts": +addToTime(startTime, session.session_length * 60 * 1000) / 1000,
    "is_update": isUpdate,
    "is_delete": isDelete,
  };

  try {
    const response = await axios.post(
      getFunctionName('orchestrateLiveSession'),
      payLoad
    )
    console.log('response to orchestrate live session - ', response);
  } catch (e) {
    console.log('error in orchestrate live session - ', e)
  }
}


/**
 *
 * @param updatedSessionData
 * @param notes
 * @param oldObj
 * @param curSessionDetails
 * @param uploadProgress
 * @param completeProgress
 * @returns {string|{editSession(): Promise<string>, cloneSession(*, *): Promise<string>, createSession(): Promise<string>}}
 * @constructor
 */
export function Session(updatedSessionData, notes, oldObj, curSessionDetails, uploadProgress, completeProgress) {
  async function getDocRef(getNewDocId) {
    if(!updatedSessionData.grade.id) throw new Error('Grade id is not present');
    if(getNewDocId) {
      return (await import('../../firebase-config')).db
        .collection("live_session")
        .doc(updatedSessionData.grade.id)
        .collection("sessions").doc();
    }
    return (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(updatedSessionData.grade.id)
      .collection("sessions").doc(curSessionDetails.session_id);
  }

  async function deleteSessionByIdAndGrade(gradeId, sessionId) {
    return (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(gradeId)
      .collection("sessions")
      .doc(sessionId)
      .delete()
  }

  async function deleteSessionFromCalendarEventList(gradeId, {year, month, date}, objToDelete) {
    if (!gradeId || isNotValidDateHash({year, month, date})) throw new Error('Grade Id and Date Hash is not valid, It should be in proper format')
    if(!objToDelete) throw new Error('Object must be provided to delete.');
    return (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(gradeId)
      .collection("calendar_events")
      .doc("calendar_events")
      .collection(`${year}_${month}`)
      .doc(`${year}_${month}_${date}`)
      .set({
        session_event_list: firestore.FieldValue.arrayRemove(objToDelete)
      }, {merge: true})
  }

  async function addSessionToCalendarEventList(toUpdateObj, sessionId) {
    let monthStr = formatDateDoc({...updatedSessionData.air_time, date: updatedSessionData.air_time.day}, true, true);
    return (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(updatedSessionData.grade.id)
      .collection("calendar_events")
      .doc("calendar_events")
      .collection(monthStr)
      .doc(monthStr + `_${updatedSessionData.air_time.day}`)
      .set({
        event_date: updatedSessionData.air_time,
        session_event_list: firestore.FieldValue.arrayUnion({
          ...toUpdateObj,
          live_session_id: sessionId, //
        })
      }, {merge: true})
  }

  function getShiftedQuizList() {
    if(!curSessionDetails?.quiz_list) return null;
    let oldStartTime = getDateFromHash(curSessionDetails.air_time);
    let newStartTime = getDateFromHash(updatedSessionData.air_time);
    let diff = newStartTime - oldStartTime;
    if(oldStartTime !== newStartTime) {
      function addTime(date, toAdd) {
        return new Date(date.valueOf() + toAdd);
      }
      return curSessionDetails?.quiz_list?.map(quizItem => ({
        ...quizItem,
        deploy_at: addTime(quizItem.deploy_at, diff).valueOf(),
        dispose_at: addTime(quizItem.dispose_at, diff).valueOf()
      }));
    }
    return curSessionDetails?.quiz_list;
  }

  async function getNotesFileFromString(uploadProgress, completeProgress) {
    const url = await (await import('../../firebase-config')).storage
      .ref()
      .child(`session/${curSessionDetails.session_id}/pdf`)
      .getDownloadURL();

    let data = await fetch(url);

    const reader = data.body.getReader();
    const contentLength = +data.headers.get('Content-Length');

    let receivedLength = 0; // received that many bytes at the moment
    let chunks = [];
    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        completeProgress();
        break;
      }
      chunks.push(value);
      receivedLength += value.length;

      let progress = (receivedLength / contentLength) * 100;

      uploadProgress({progress, bytesTransferred: receivedLength, totalBytes: contentLength});
    }

    return new Blob(chunks, {type: 'application/pdf'});
  }

  async function getStatusForSession() {
    const date = getDateFromHash(updatedSessionData.air_time);
    const duration = updatedSessionData.session_length;
    return getStatus(date, duration);
  }

  async function uploadNotes(file, sessionId) {
    if(!file || !(file instanceof File || file instanceof Blob)) throw new Error('File is required and must be a File object');
    return uploadSessionNotes(file, sessionId, updatedSessionData.grade.id, uploadProgress, completeProgress);
  }

  return {
    async editSession() {
      // if(updatedSessionData.grade.id !== 'class_2') throw new Error('Only class 2 is allowed');
      // if(oldObj.grade.id !== 'class_2') throw new Error('Only class 2 is allowed');

      if(!oldObj) throw new Error('Previous object to delete is required.');
      // console.log(updatedSessionData, notes, oldObj, curSessionDetails);
      // return;
      try {
        // Reference to the document
        const docRef = await getDocRef();

        // If notes is a File object
        // means replace the notes with new attachment
        // else Assuming the notes is a String which the link to the attachment
        // means don't do anything just keep the string as it is
        let notesUrl = notes;
        if(notes instanceof File) {
          notesUrl = await uploadNotes(notes, docRef.id);
        }

        // Quiz list
        let quizList = getShiftedQuizList();

        // Get the status of the session, session time might get changed so recompute the status
        const status = await getStatus(getDateFromHash(updatedSessionData.air_time), updatedSessionData.session_length);

        // Prepare object to update
        const obj = {
          access_tier: updatedSessionData.access_tier,
          air_time: updatedSessionData.air_time,
          category: updatedSessionData.category,
          chapter: updatedSessionData.chapter,
          display_name: updatedSessionData.display_name,
          grade: updatedSessionData.grade,
          // instructor_name: updatedSessionData.instructor_name,
          session_status: status || 'initial',
          // live_session_id
          session_length: updatedSessionData.session_length,
          is_whiteboard_class: updatedSessionData.is_whiteboard_class ?? null,
          // show_linked_chapter: sessionData.show_linked_chapter || false,
          // show_suggestions: sessionData.show_suggestions || true,
          subject: updatedSessionData.subject,
          video_host: updatedSessionData.video_host ?? 'youtube',
          video_key: updatedSessionData.video_key ?? null,
          video_length: updatedSessionData.video_length ?? null,
          notes_link: notesUrl || null,
          instructor_info: updatedSessionData.instructor_info,
          end_color_list: updatedSessionData.end_color_list,
          start_color_list: updatedSessionData.start_color_list
        }

        // Check if the grade is changed
        // 1. If so
        // Delete the session from live_session/<grade_id>/sessions/<session_id>
        if(oldObj.grade.id !== updatedSessionData.grade.id) {
          await deleteSessionByIdAndGrade(oldObj.grade.id, oldObj.live_session_id);
        } // 2. else, skip this process.

        // Update the session in sessions collection
        await docRef.set({
          ...obj,
          video_key: updatedSessionData.video_key ?? null,
          quiz_list: quizList,
        }, {merge: true});

        // First, Delete the session_events_list arrays in calendar_events collection
        await deleteSessionFromCalendarEventList(oldObj.grade.id, {...oldObj.air_time, date: oldObj.air_time.day}, oldObj);

        // Then, Update the session_events_list arrays in calendar_events collection
        await addSessionToCalendarEventList(obj, docRef.id);

        await orchestrateLiveSession({session: {...obj, live_session_id: docRef.id}, isDelete: false, isUpdate: true});

        return docRef.id;
      } catch (e) {
        console.log(e);
      }
    },
    async createSession() {
      // Reference to the document
      const docRef = await getDocRef(true);

      // If notes is a File object
      // means replace the notes with new attachment
      // else Assuming the notes is a String which the link to the attachment
      // means don't do anything just keep the string as it is
      let notesUrl;
      if (notes instanceof File) {
        notesUrl = await uploadNotes(notes, docRef.id);
      }

      let status = await getStatusForSession();

      const obj = {
        access_tier: updatedSessionData.access_tier,
        air_time: updatedSessionData.air_time,
        category: updatedSessionData.category,
        chapter: updatedSessionData.chapter,
        display_name: updatedSessionData.display_name,
        grade: updatedSessionData.grade,
        // instructor_name: updatedSessionData.instructor_name,
        session_status: status || 'initial',
        // live_session_id
        session_length: updatedSessionData.session_length,
        // show_linked_chapter: updatedSessionData.show_linked_chapter || false,
        // show_suggestions: updatedSessionData.show_suggestions || true,
        subject: updatedSessionData.subject,
        videso_host: updatedSessionData.video_host ?? 'youtube',
        // video_key: updatedSessionData.video_key,
        video_length: updatedSessionData.video_length ?? null,
        notes_link: notesUrl || null,
        created_at: updatedSessionData.created_at, //
        instructor_info: updatedSessionData.instructor_info,
        is_whiteboard_class: updatedSessionData.is_whiteboard_class ?? null,
        created_by_employee_id: updatedSessionData.created_by_employee_id || 'sample-employee-id', //
        moderator_employee_id: updatedSessionData.moderator_employee_id || 'sample-moderator-id', //
        end_color_list: updatedSessionData.end_color_list, //
        start_color_list: updatedSessionData.start_color_list, //
      }

      let extraNewObj = {
        show_linked_chapter: updatedSessionData.show_linked_chapter || false, //
        show_suggestions: updatedSessionData.show_suggestions || true, //
        live_session_id: docRef.id, //
        video_key: updatedSessionData.video_key ?? null //
      }

      if(updatedSessionData.is_whiteboard_class) {
        const { data } = await createRoom(true);
        const room_id = data.uuid;
        const rtc_channel = v4();
        const rtm_channel = v4();
        extraNewObj = {...extraNewObj, room_id, rtc_channel, rtm_channel};
      }

      // Attach if the video has the

      await docRef
        .set({
          ...obj,
          ...extraNewObj
        });

      console.log('obj, docRef.id - ', obj, docRef.id);

      await addSessionToCalendarEventList(obj, docRef.id);
      await orchestrateLiveSession({session: {...obj, live_session_id: docRef.id}, isDelete: false, isUpdate: false});
      return docRef.id;
    },
    async cloneSession(uploadProgressCB, completeProgressCB) {
      const docRef = await getDocRef(true);

      let notesUrl;
      let file = notes ;
      if(typeof notes === 'string') {
        file = await getNotesFileFromString(uploadProgressCB, completeProgressCB);
      }
      if(file) {
        notesUrl = await uploadNotes(file, docRef.id);
      }

      // Quiz list
      let quizList = getShiftedQuizList();

      let status = await getStatusForSession();

      const obj = {
        access_tier: updatedSessionData.access_tier,
        air_time: updatedSessionData.air_time,
        category: updatedSessionData.category,
        chapter: updatedSessionData.chapter,
        display_name: updatedSessionData.display_name,
        grade: updatedSessionData.grade,
        // instructor_name: updatedSessionData.instructor_name,
        session_status: status || 'initial',
        // live_session_id
        session_length: updatedSessionData.session_length,
        instructor_info: updatedSessionData.instructor_info,
        // show_linked_chapter: updatedSessionData.show_linked_chapter || false,
        // show_suggestions: updatedSessionData.show_suggestions || true,
        subject: updatedSessionData.subject,
        video_host: updatedSessionData.video_host ?? 'youtube',
        // video_key: updatedSessionData.video_key,
        is_whiteboard_class: updatedSessionData.is_whiteboard_class ?? null,
        class_type: updatedSessionData.class_type ?? 'prerecorded_session',
        video_length: updatedSessionData.video_length ?? null,
        notes_link: notesUrl || null,
        created_at: updatedSessionData.created_at, //
        created_by_employee_id: updatedSessionData.created_by_employee_id || 'sample-employee-id', //
        moderator_employee_id: updatedSessionData.moderator_employee_id || 'sample-moderator-id', //
        end_color_list: updatedSessionData.end_color_list, //
        start_color_list: updatedSessionData.start_color_list, //
      }

      let extraNewObj = {
        show_linked_chapter: updatedSessionData.show_linked_chapter || false, //
        show_suggestions: updatedSessionData.show_suggestions || true, //
        live_session_id: docRef.id, //
        video_key: updatedSessionData.video_key ?? null, //
        quiz_list: quizList, //
      }

      await docRef
        .set({
          ...obj,
          ...extraNewObj
        });

      await addSessionToCalendarEventList(obj, docRef.id);
      await orchestrateLiveSession({session: {...obj, live_session_id: docRef.id}, isDelete: false, isUpdate: false});
      return docRef.id;
    }
  }
}

export const getDateFromHash = (data) => {
  return new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
};

export const isNotValidDateHash = (dateHash) => {
  function isNotValidHashValue(val) {
    return isNaN(val);
  }
  return !dateHash || isNotValidHashValue(dateHash.year) || isNotValidHashValue(dateHash.month) || isNotValidHashValue(dateHash.date);
}

export const convertDateToHash = (date, {both = false, onlyTime = false} = {}) => {
  if(!(date instanceof Date)) throw new Error('Argument needs to be a Date object');
  const dateObj =  {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }
  const timeObj = {
    minute: date.getMinutes(),
    hour: date.getHours()
  }
  return (
    both ? {...dateObj, ...timeObj} : onlyTime ? timeObj : dateObj
  )
};

const getColorFromArray = (data) => {
  try {
    let color = `rgba(${data[0]},${data[1]},${data[2]},${data[3]})`;
    return color;
  } catch (e) {
    return "rgba(0,0,0,0)";
  }
};

const getReferenceFromSessionID = (session, grade = "class_10") => {
  return (require('../../firebase-config')).db
    .collection("live_session")
    .doc(grade)
    .collection("sessions")
    .doc(session.live_session_id);
};

export const formatDateDoc = (date, dontIncMonth, withoutDate) => {
  if(isNotValidDateHash(date)) date = convertDateToHash(date);
  if(withoutDate) return `${date.year}_${date.month + (dontIncMonth ? 0 : 1)}`;
  return `${date.year}_${date.month + (dontIncMonth ? 0 : 1)}_${date.date}`;
}

export function getDateObj(date, incMonth) {
  if(date instanceof Date) {
    return {date: date.getDate(), month: date.getMonth() + (incMonth ? 1 : 0), year: date.getFullYear()};
  }
  return date;
}

export const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  date1 = getDateObj(date1);
  date2 = getDateObj(date2);
  return date1.date === date2.date && date1.month === date2.month && date1.year === date2.year;
}

export const getCurrentWeek = async (date) => {
  let curr = date;
  const dates = [];
  if(!curr || !(curr instanceof Date)) {
    let indianTime = await fetchIndianTime();
    curr = new Date(indianTime);
  } else {
    curr = new Date(date);
  }
  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i;

    if (i === 1 && curr.getDay() === 0) {
      first = curr.getDate() - 6;
    }
    let day = new Date(curr.setDate(first));
    dates.push(day);
  }
  return dates;
}

export const fetchSessions = async (grade, isInstructor) => {
  let grades = [grade];
  if(isInstructor) {
    grades = ['class_2', 'class_9', 'class_10'];
    // TODO: getAvailableGrades for production
    // grades = getAvailableGrades(true);
  }
  let _posts = [];
  let _postMap = {};
  let _shortest = null;

  let indianTime = await fetchIndianTime();
  const today = new Date(indianTime);

  let curr = new Date(indianTime);

  /**
   * Setting up for the instructor to load only today's session for all the available grades whereas
   * for student it should load sessions for the current week depending upon the grade
   */
  const dates = getCurrentWeek(indianTime);

  // let countOfSessions = isInstructor ? 1 : 7;
  let countOfSessions = 1;
  for (let i = 0; i < countOfSessions; i++) {
    // First Get All The Sessions For The Whole Week
    // const dateClass = isInstructor ? today : dates[i];
    const dateClass = today;
    const date = {
      date: dateClass.getDate(),
      month: dateClass.getMonth(),
      year: dateClass.getFullYear()
    }

    const _sessions = [];

    let sessionResult = [];
    for (let i = 0; i < grades.length; i++) {
      const grade = grades[i];
      // sessionResult will contain two elements in the array
      // First is sessions list and the second is shortest
      sessionResult = await fetchSessionsForDateByGrade(grade, date);
      _sessions.push(...sessionResult[0]);
    }
    // Preventing if the single grade needs to fetched
    // Then there is no need to sort as we have already sorted list
    if(grades.length > 1) {
      _sessions.sort(
        (a, b) => {
          if (a?.air_time.hour - b?.air_time.hour === 0) {
            return a?.air_time.minute - b?.air_time.minute
          }
          return a?.air_time.hour - b?.air_time.hour;
        }
      )
    }
    const list = getDirectionFullSessions(_sessions);

    if(isSameDate(indianTime, curr)) {
      _shortest = list.filter(a => a.session_id === sessionResult[1])[0];
    }

    _postMap[formatDateDoc(date)] = {
      ...date,
      session_event_list: list,
    }
  }

  return [_postMap];
}

export const fetchSessionsForDateByGrade = async (grade, dateSelected, filters) => {
  let _sessions = [];
  let _shortest = null;
  let _flag = true;
  if(!grade || !dateSelected) throw new Error('Grade and dateSelected is required to fetch the session for the date by grade.')
  let indianTime = await fetchIndianTime();
  await (await import('../../firebase-config')).db.collection('live_session')
    .doc(grade)
    .collection('calendar_events')
    .doc('calendar_events')
    .collection(`${dateSelected.year}_${dateSelected.month + 1}`)
    .doc(`${dateSelected.year}_${dateSelected.month + 1}_${dateSelected.date}`)
    .get()
    .then(querySnapshot => {
      if(!querySnapshot.exists) return;
      if (querySnapshot.data()?.session_event_list?.length === 0) return;

      let sessionsData = querySnapshot
        .data()
        .session_event_list.reduce((acc, cur) => {
          let itHas = acc.some(c => c.live_session_id === cur.live_session_id);
          if (itHas) {
            acc = acc.filter(c => c.live_session_id !== cur.live_session_id);
          }
          acc = [...acc, cur];
          return acc;
        }, []).sort(
          (a, b) => {
            if (a?.air_time.hour - b?.air_time.hour === 0) {
              return a?.air_time.minute - b?.air_time.minute
            }
            return a?.air_time.hour - b?.air_time.hour;
          }
        );

      for (let j = 0; j < sessionsData.length; j++) {
        let _session = sessionsData[j];

        let _currentSession = transformDocumentToLocalSessionObject(_session);

        if (
          (_currentSession.start_ts >=
            +indianTime - _currentSession.duration * 60 * 1000 ||
            j === sessionsData.length - 1) &&
          _flag &&
          isSameDate(indianTime, _currentSession.start_ts)
        ) {
          _shortest = _currentSession.session_id;
          _flag = false;
        }

        let filterMatch = true;

        if(filters) {
          for(let key in filters) {
            if(key === '$query') {
              if(typeof filters[key]?.match === 'function') {
                filterMatch = filters[key].match(_currentSession, dateSelected);
                if(!filterMatch) break;
              }
              if(filters[key].maxLength) {
                filterMatch = _sessions.length <= filters[key].maxLength;
                if(!filterMatch) break;
              }
            } else if(_currentSession[key] !== filters[key].value || (!filters[key]?.caseSensitive && (_currentSession[key]?.toString()?.toLowerCase() !== filters[key]?.value?.toString()?.toLowerCase()))) {
              filterMatch = false;
              break;
            }
          }
        }

        if(filterMatch) _sessions.push(_currentSession);
      }
    })

  return [_sessions, _shortest];
}

export const transformDocumentToLocalSessionObject = (document) => {
  const _session = document;
  return {
    sessionObj: _session,
    categoryId: _session.category.id,
    subjectId: _session.subject.id,
    chapterId: _session.chapter.id,
    category: _session?.subject["subject_name"],
    name: _session?.display_name,
    start_ts: getDateFromHash(_session?.air_time),
    air_time: _session?.air_time,
    grade: _session?.grade,
    duration: _session.session_length,
    videokey: _session?.video_key || null,
    session_length: _session?.session_length,
    is_whiteboard_class: _session?.is_whiteboard_class,
    session_id: _session?.live_session_id,
    status: _session?.session_status,
    instructor_id: _session?.instructor_info?.uid,
    gradient_start: getColorFromArray(_session.start_color_list),
    gradient_end: getColorFromArray(_session.end_color_list),
    tier: _session?.access_tier,
    reference: getReferenceFromSessionID(_session, _session?.grade.id),
  }
}

export const fetchSessionByIdAndGrade = (sessionId, grade, transformToLocalCurSessionObject = false) => {
  const ref = getReferenceFromSessionID({live_session_id: sessionId}, grade);
  return ref.get().then(snapshot => {
    console.log('snapshot - ', snapshot, sessionId, grade);
    if(snapshot.exists) {
      if(!transformToLocalCurSessionObject) return {obj: snapshot.data()};
      return {
        obj: snapshot.data(),
        transformedObj: transformDocumentToLocalSessionObject(snapshot.data())
      };
    }
    return null;
  })
}

export async function fetchTodayUpcomingSessions(grade, isUserPro) {
  if(!grade) return null;

  let filterObj = {
    $query: {
      match: function(obj, curDate) {
        return obj['start_ts'] >= +curDate - (obj.duration * 60 * 1000)
      },
      maxLength: 6
    }
  }
  return await fetchTodaySessions(grade, isUserPro, filterObj);
}

export async function fetchTodaySessions(grade, isUserPro, filterObj = {}) {
  let filterObject = {
    tier: {
      value: 'free',
      caseSensitive: false
    },
    ...filterObj
  }
  let today = await fetchIndianTime();
  if(isUserPro) delete filterObject.tier;
  let [_sessions] = await fetchSessionsForDateByGrade(grade, today, filterObject);
  return _sessions;
}

export const getCurrentSessionDetails = (reference, callback) => {
  return reference.onSnapshot(async (e) => {
    if(!e.exists) return;
    callback({
      category: e.data().subject["subject_name"],
      name: e.data().display_name,
      start_ts: getDateFromHash(e.data().air_time),
      status: e.data().session_status,
      duration: e.data().session_length,
      quiz_list: e.data()?.quiz_list || null,
      videokey: e.data().video_key,
      notes: e.data().notes_link,
      session_id: e.data().live_session_id || e.id, // Fallback to the current document id if live_session_id is not present [very rare]
      video_length: e.data().video_length,
      reference: reference,
    });
  });
};

export const getDirectionFullSessions = (list) => {

  let AVAILABLE_WIDTH_FOR_SESSION = 256;
  const MARGIN_BTW_SESSION = 4;

  if(window.innerWidth <= 500) {
    // AVAILABLE_WIDTH_FOR_SESSION
    let d = document.querySelector('hr.timeline__line');
    if(d) AVAILABLE_WIDTH_FOR_SESSION = d.getBoundingClientRect().width;
  }

  function addDurationToTime(date, duration) {
    const hour = date.getHours();
    const minute = date.getMinutes();

    return {
      hour: hour + Math.floor((minute + duration) / 60),
      minute: (minute + duration) % 60
    };
  }

  function isTimeLessThan(time1, time2) {
    if (time1.getHours() < time2?.hour) return true;
    if (time1.getHours() > time2?.hour) return false;
    return time1.getMinutes() < time2?.minute;
  }

  let threshold = null;
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (threshold && isTimeLessThan(list[i].start_ts, threshold)) {
      arr[arr.length - 1].push(i);
    } else {
      arr.push([i]);
    }
    threshold = addDurationToTime(list[i].start_ts, list[i].duration);
  }
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      let index = arr[i][j];
      list[index].groupSize = arr[i].length;
      list[index].width = (AVAILABLE_WIDTH_FOR_SESSION - (arr[i].length - 1) * MARGIN_BTW_SESSION) / arr[i].length;
      list[index].left = j * list[index].width + (j === 0 ? 0 : MARGIN_BTW_SESSION * j)
    }
  }

  return list;
}

export const uploadSessionNotes = async (file, sessionId, grade, progressCB = function() {}, completeProgressCB = function() {}) => {
  try {
    return new Promise(async (res, rej) => {
      const path = `session/${sessionId}/pdf`;
      const uploadTask = (await import('../../firebase-config')).storage
        .ref()
        .child(path)
        .put(file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          progressCB({progress, bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes});
          // switch (snapshot.state) {
          //   case firebase.storage.TaskState.PAUSED: // or 'paused'
          //     console.log('Upload is paused');
          //     break;
          //   case firebase.storage.TaskState.RUNNING: // or 'running'
          //     console.log('Upload is running');
          //     break;
          // }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          rej(error);
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            completeProgressCB(downloadURL);
            res(downloadURL);
          });
        })
    })
  } catch(e) {
    console.log(e);
    return null;
  }
};

async function getStatus(date, duration) {
  if(!(date instanceof Date) || !duration || isNaN(duration)) return null;
  let last = new Date(date);
  last.setMinutes(last.getMinutes() + +duration);
  let now = await fetchIndianTime();
  if(now <= last && now >= date) {
    return 'live'
  }
  if(now < date) {
    return 'initial';
  }
  return 'disposed';
}

/**
 *
 * @deprecated
 * @param sessionData
 * @param notesFile
 * @param docId {string|null} If it presents then the session will be updated instead of created
 * @param toDeleteObj
 * @param curSessionDetails
 * @param uploadProgressCB
 * @param completeProgressCB
 * @param cloneOptions
 * @returns {Promise<string|null>}
 */
export const createSession = async (sessionData, notesFile, docId, toDeleteObj, curSessionDetails, uploadProgressCB, completeProgressCB, cloneOptions) => {
  try {

    let docRef = await (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(sessionData.grade.id)
      .collection("sessions").doc();

    if (docId) {
      docRef = await (await import('../../firebase-config')).db
        .collection("live_session")
        .doc(sessionData.grade.id)
        .collection("sessions").doc(docId);
    }

    console.log('updateObj, live_session_id - ', sessionId);

    // console.log('docRef - ', docRef);
    // return;

    // Upload session Notes;
    let notesUrl;
    if (notesFile instanceof File) {
      notesUrl = await uploadSessionNotes(notesFile, docRef.id, sessionData.grade.id, uploadProgressCB, completeProgressCB)
    } else if (cloneOptions?.id) {
      await (await import('../../firebase-config')).storage
        .ref()
        .child(`session/${cloneOptions.id}/pdf`)
        .getDownloadURL()
        .then(async (url) => {
          let data = await fetch(url);

          const reader = data.body.getReader();
          const contentLength = +data.headers.get('Content-Length');

          let receivedLength = 0; // received that many bytes at the moment
          let chunks = [];
          while (true) {
            const {done, value} = await reader.read();

            if (done) {
              cloneOptions.completeCB();
              break;
            }
            chunks.push(value);
            receivedLength += value.length;

            let progress = (receivedLength / contentLength) * 100;

            cloneOptions.progressCB({progress, bytesTransferred: receivedLength, totalBytes: contentLength});
          }


          let blob = new Blob(chunks, {type: 'application/pdf'});

          notesUrl = await uploadSessionNotes(blob, docRef.id, sessionData.grade.id, uploadProgressCB, completeProgressCB)
        })
        .catch(e => {
          console.log(e);
        })
    } else if(typeof notesFile === 'string') {
      notesUrl = notesFile;
    }

    let status = await getStatus(getDateFromHash(sessionData.air_time), sessionData.session_length);

    let newQuizList = curSessionDetails?.quiz_list || null;

    if(docId || cloneOptions?.id) {
      let oldStartTime = getDateFromHash(curSessionDetails.air_time);
      let newStartTime = getDateFromHash(sessionData.air_time);
      let diff = newStartTime - oldStartTime;
      if(oldStartTime !== newStartTime) {
        function addTime(date, toAdd) {
          return new Date(date.valueOf() + toAdd);
        }
        newQuizList = curSessionDetails?.quiz_list?.map(quizItem => ({
          ...quizItem,
          deploy_at: addTime(quizItem.deploy_at, diff).valueOf(),
          dispose_at: addTime(quizItem.dispose_at, diff).valueOf()
        }));
      }
    }

    const obj = {
      access_tier: sessionData.access_tier,
      air_time: sessionData.air_time,
      category: sessionData.category,
      chapter: sessionData.chapter,
      display_name: sessionData.display_name,
      grade: sessionData.grade,
      // instructor_name: sessionData.instructor_name,
      session_status: status || 'initial',
      // live_session_id
      session_length: sessionData.session_length,
      // show_linked_chapter: sessionData.show_linked_chapter || false,
      // show_suggestions: sessionData.show_suggestions || true,
      subject: sessionData.subject,
      // video_host: sessionData.video_host,
      // video_key: sessionData.video_key,
      video_length: sessionData.video_length,
      notes_link: notesUrl || null,
    }

    let newObj = {
      created_at: sessionData.created_at, //
      created_by_employee_id: sessionData.created_by_employee_id || 'sample-employee-id', //
      moderator_employee_id: sessionData.moderator_employee_id || 'sample-moderator-id', //
      end_color_list: sessionData.end_color_list, //
      start_color_list: sessionData.start_color_list, //
    }


    let extraNewObj = {
      show_linked_chapter: sessionData.show_linked_chapter || false, //
      show_suggestions: sessionData.show_suggestions || true, //
      video_host: sessionData.video_host, //
      live_session_id: docRef.id, //
    }

    let toUpdateObj = {...obj, ...newObj};

    if(docId) {
      newObj = {};
      extraNewObj = {};
    }

    await docRef
      .set({
        ...obj,
        ...newObj,
        ...extraNewObj,
        quiz_list: newQuizList || null,
        video_key: sessionData.video_key,
      }, {merge: Boolean(docId)});

    const sessionId = docRef.id;
    let monthStr = `${sessionData.air_time.year}_${sessionData.air_time.month}`;

    if(docId) {
      await (await import('../../firebase-config')).db
        .collection("live_session")
        .doc(toDeleteObj.grade.id)
        .collection("calendar_events")
        .doc("calendar_events")
        .collection(`${toDeleteObj.air_time.year}_${toDeleteObj.air_time.month}`)
        .doc(`${toDeleteObj.air_time.year}_${toDeleteObj.air_time.month}_${toDeleteObj.air_time.day}`)
        .set({
          session_event_list: firestore.FieldValue.arrayRemove(toDeleteObj)
        }, {merge: true})

      if(sessionData.grade.id !== toDeleteObj.grade.id) {
        await (await import('../../firebase-config')).db
          .collection("live_session")
          .doc(toDeleteObj.grade.id)
          .collection("sessions")
          .doc(toDeleteObj.live_session_id)
          .delete()
      }
    }


    await (await import('../../firebase-config')).db
      .collection("live_session")
      .doc(sessionData.grade.id)
      .collection("calendar_events")
      .doc("calendar_events")
      .collection(monthStr)
      .doc(monthStr + `_${sessionData.air_time.day}`)
      .set({
        event_date: sessionData.air_time,
        session_event_list: firestore.FieldValue.arrayUnion({
          ...toUpdateObj,
          live_session_id: sessionId, //
        })
      }, {merge: true})

    return sessionId;
  } catch(e) {
    console.log(e);
    return null;
  }
}

export const deleteSession = async (sessionData) => {
  try {
    // Delete from sessions collection
    const gradeRef = (await import('../../firebase-config')).db
      .collection('live_session')
      .doc(sessionData.grade.id);
    const monthStr = `${sessionData.air_time.year}_${sessionData.air_time.month}`

    await gradeRef
      .collection('sessions')
      .doc(sessionData.live_session_id)
      .delete();

    // Delete from calendar_events
    await gradeRef
      .collection('calendar_events')
      .doc('calendar_events')
      .collection(monthStr)
      .doc(monthStr + '_' + sessionData.air_time.day)
      .set({
        session_event_list: firestore.FieldValue.arrayRemove(sessionData)
      }, {merge: true})

    // Delete notes from storage
    const path = `session/${sessionData.live_session_id}/pdf`;
    let ref = (await import('../../firebase-config')).storage
      .ref()
      .child(path);
    await ref.delete();

    // Returning true upon successful deletion
    return true;
  } catch (e) {
    // Returning true upon successful deletion
    // But here we don't care if the object is not found to delete
    return e.code === "storage/object-not-found";
  }

}

export const sessionJoinedByUser = async (reference, { uid }) => {
  await reference
    .collection("user_interactions")
    .doc(uid)
    .get()
    .then((e) => {
      if (!e.exists) {
        reference.collection("user_interactions").doc(uid).set({
          in_session_interactions: [],
          pre_session_interactions: [],
        });
      }
    });
};

const log = {
  id: 'string',
  requested_by: {
    id: 'user_id',
    name: 'user_name',
    image: 'user_image'
  },
  level: 'success',
  action: 'UPDATE' | 'CREATE' | 'DELETE',
  status: 'Tip Item is updated!',
  affected_keys: {
    'key_name': {prev_value: '', new_value: ''}
  },
  item_id: '',
  timestamp: 'Epoc'
}
