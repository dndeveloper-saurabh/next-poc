
const dateTimeToDate = (date, timeslot) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeslot,
    0,
    0,
    0
  );
};

export const createBlazeOrder = async ({
  userId,
  userGrade,
  category,
  subject,
  chapter,
  date,
  timeslot,
}) => {
  let _dateObject = dateTimeToDate(date, timeslot);

  let createBlazeOrderFunction = (await import('../../firebase-config')).functions.httpsCallable("createBlazeOrder");

  /* Handles '' empty string case for subjects */
  let _subject;
  if (subject === "" || subject === null) _subject = null;
  else _subject = subject;

  let _response = await createBlazeOrderFunction({
    user_id: userId,
    user_grade: userGrade,
    category: category,
    subject: _subject,
    chapter: chapter,
    session_start_time: {
      year: _dateObject.getFullYear(),
      month: _dateObject.getMonth() + 1,
      day: _dateObject.getDate(),
      hour: _dateObject.getHours(),
    },
    session_start_ts: _dateObject.getTime(),
    session_create_ts: new Date().getTime(),
    session_create_time: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
  });

  return _response.data;
};

export const rescheduleBlazeReservationByUser = async ({
  orderId,
  amount,
  userId,
  grade,
  reservationId,
  category,
  subject,
  chapter,
  date,
  timeslot,
}) => {
  let _dateObject = dateTimeToDate(date, timeslot);

  let rescheduleBlazeReservationByUserFunction = (await import('../../firebase-config')).functions.httpsCallable(
    "rescheduleBlazeReservationByUser"
  );

  let _response = await rescheduleBlazeReservationByUserFunction({
    order_id: orderId,
    payment_amount: amount,
    user_id: userId,
    user_grade: grade,
    reservation_id: reservationId,
    category: category,
    subject: subject,
    chapter: chapter,
    session_start_ts: _dateObject.getTime(),
    session_start_time: {
      year: _dateObject.getFullYear(),
      month: _dateObject.getMonth() + 1,
      day: _dateObject.getDate(),
      hour: _dateObject.getHours(),
    },
  });

  return _response.data;
};
