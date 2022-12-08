import React, { useState, createContext } from "react";

export const TipsContext = createContext();

export const TipsContextProvider = (props) => {
  const [videoID, setVideoID] = useState(null);
  const [tipsData, setTipsData] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [nextItem, setNextItem] = useState(null);
  const [notesLink, setNotesLink] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [videoSeeking, setVideoSeeking] = useState(true);
  const [tipsEngagement, setTipsEngagement] = useState(null);
  const [tipTier, setTipTier] = useState(null);
  const [showOnlyLogo, setShowOnlyLogo] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [beaconBody, setBeaconBody] = useState(null);

  return (
    <TipsContext.Provider
      value={{
        videoID: [videoID, setVideoID],
        tipsData: [tipsData, setTipsData],
        activeItem: [activeItem, setActiveItem],
        nextItem: [nextItem, setNextItem],
        notesLink: [notesLink, setNotesLink],
        isNotes: [isNotes, setIsNotes],
        playing: [playing, setPlaying],
        videoSeeking: [videoSeeking, setVideoSeeking],
        tipsEngagement: [tipsEngagement, setTipsEngagement],
        tipTier: [tipTier, setTipTier],
        showOnlyLogo: [showOnlyLogo, setShowOnlyLogo],
        beaconBody: [beaconBody, setBeaconBody]
      }}
    >
      {props.children}
    </TipsContext.Provider>
  );
};

export default TipsContextProvider;
