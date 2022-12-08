import React from "react";

import { useState, createContext } from "react";

export const LiveSessionContext = createContext();

export const LiveSessionContextProvider = (props) => {
  const [currentSession, setcurrentSession] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentSessionDetails, setcurrentSessionDetails] = useState(null);
  const [showMenuItem, setShowMenuItem] = useState(true);
  const [isFloatingMute, setIsFloatingMute] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hasSessionEnded, setHasSessionEnded] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [redirectState, setRedirectState] = useState(null);
  const [curDateSessions, setCurDateSessions] = useState([]);
  const [hideLiveSessionNavbar, setHideLiveSessionNavbar] = useState(false);
  const [floatVideoId, setFloatVideoId] = useState(null);
  const [floatProvider, setFloatProvider] = useState('youtube');
  const [floatStartTime, setFloatStartTime] = useState(0);
  const [room, setRoom] = useState(null);

  return (
    <LiveSessionContext.Provider
      value={{
        current: [currentSession, setcurrentSession],
        currentCard: [currentCard, setCurrentCard],
        currentSessionDetails: [currentSessionDetails, setcurrentSessionDetails],
        curDateSessions: [curDateSessions, setCurDateSessions],
        showMenuItem: [showMenuItem, setShowMenuItem],
        isFloatingMute: [isFloatingMute, setIsFloatingMute],
        playing: [playing, setPlaying],
        live: [isLive, setIsLive],
        ended: [hasSessionEnded, setHasSessionEnded],
        room: [room, setRoom],
        hideLiveSessionNavbar: [hideLiveSessionNavbar, setHideLiveSessionNavbar],
        replyingTo: [replyingTo, setReplyingTo],
        redirectState: [redirectState, setRedirectState],
        floatVideoId: [floatVideoId, setFloatVideoId],
        floatProvider: [floatProvider, setFloatProvider],
        floatStartTime: [floatStartTime, setFloatStartTime]
      }}
    >
      {props.children}
    </LiveSessionContext.Provider>
  );
};

export default LiveSessionContextProvider;
