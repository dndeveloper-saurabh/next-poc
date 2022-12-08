import React, { useState, createContext } from "react";

export const PracticeContext = createContext();

export const PracticeContextProvider = (props) => {
  const [videoID, setVideoID] = useState(null);
  const [practiceData, setPracticeData] = useState(null);
  const [practiceTabs, setPracticeTabs] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [nextItem, setNextItem] = useState(null);
  const [notesLink, setNotesLink] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [videoSeeking, setVideoSeeking] = useState(true);
  const [lastEngagement, setLastEngagement] = useState(null);
  const [practiceEngagement, setPracticeEngagement] = useState(null);
  const [practiceTier, setPracticeTier] = useState(null);
  const [showOnlyLogo, setShowOnlyLogo] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [beaconBody, setBeaconBody] = useState(null);


  return (
    <PracticeContext.Provider
      value={{
        videoID: [videoID, setVideoID],
        practiceData: [practiceData, setPracticeData],
        practiceTabs: [practiceTabs, setPracticeTabs],
        activeItem: [activeItem, setActiveItem],
        nextItem: [nextItem, setNextItem],
        activeTabIndex: [activeTabIndex, setActiveTabIndex],
        notesLink: [notesLink, setNotesLink],
        isNotes: [isNotes, setIsNotes],
        playing: [playing, setPlaying],
        videoSeeking: [videoSeeking, setVideoSeeking],
        practiceEngagement: [practiceEngagement, setPracticeEngagement],
        practiceTier: [practiceTier, setPracticeTier],
        showOnlyLogo: [showOnlyLogo, setShowOnlyLogo],
        lastEngagement: [lastEngagement, setLastEngagement],
        beaconBody: [beaconBody, setBeaconBody]
      }}
    >
      {props.children}
    </PracticeContext.Provider>
  );
};

export default PracticeContextProvider;
