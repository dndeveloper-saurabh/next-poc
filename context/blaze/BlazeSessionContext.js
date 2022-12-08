import React, { useState, createContext } from "react";

export const BlazeSessionContext = createContext();

const BlazeContextProvider = (props) => {
  const [tabIdx, setTabIdx] = useState(0);
  const [openPage, setOpenPage] = useState(0);
  const [openChat, setOpenChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [openPages, setOpenPages] = useState(false);
  const [callStartTs, setCallStartTs] = useState(null);
  const [subjectColors, setSubjectColors] = useState(null);
  const [instructorRating, setInstructorRating] = useState(0);
  const [studentActivity, setStudentActivity] = useState(null);
  const [sessionSelected, setSessionSelected] = useState(null);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [ratingModalDetails, setRatingModalDetails] = useState(null);
  const [requestedSessions, setRequestedSessions] = useState(null);
  const [ongoingSessions, setOngoingSessions] = useState(null);
  const [completedSessions, setCompletedSessions] = useState(null);
  const [currentSessionUnreadCount, setCurrentSessionUnreadCount] = useState(0);
  const [openBookingPopup, setOpenBookingPopup] = useState(false);

  return (
    <BlazeSessionContext.Provider
      value={{
        tabIdx: [tabIdx, setTabIdx],
        openChat: [openChat, setOpenChat],
        openPage: [openPage, setOpenPage],
        sessionId: [sessionId, setSessionId],
        openPages: [openPages, setOpenPages],
        callStartTs: [callStartTs, setCallStartTs],
        subjectColors: [subjectColors, setSubjectColors],
        sessionSelected: [sessionSelected, setSessionSelected],
        studentActivity: [studentActivity, setStudentActivity],
        openRatingModal: [openRatingModal, setOpenRatingModal],
        instructorRating: [instructorRating, setInstructorRating],
        requestedSessions: [requestedSessions, setRequestedSessions],
        ongoingSessions: [ongoingSessions, setOngoingSessions],
        completedSessions: [completedSessions, setCompletedSessions],
        ratingModalDetails: [ratingModalDetails, setRatingModalDetails],
        openBookingPopup: [openBookingPopup, setOpenBookingPopup],
        currentSessionUnreadCount: [
          currentSessionUnreadCount,
          setCurrentSessionUnreadCount,
        ],
      }}
    >
      {props.children}
    </BlazeSessionContext.Provider>
  );
};

export default BlazeContextProvider;
