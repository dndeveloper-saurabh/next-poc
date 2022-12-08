import React, {useState, createContext, useEffect} from "react";

export const IntroContext = createContext();

export const IntroContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [master, setMaster] = useState("home");
  const [anchor, setAnchor] = useState(null);
  const [openWelcome, setOpenWelcome] = useState(true);
  const [openFreeTrial, setOpenFreeTrial] = useState(false);
  const [trialType, setTrialType] = useState(null);
  const [availableGrades, setAvailableGrades] = useState([]);

  return (
    <IntroContext.Provider
      value={{
        master: [master, setMaster],
        anchor: [anchor, setAnchor],
        openWelcome: [openWelcome, setOpenWelcome],
        openFreeTrial: [openFreeTrial, setOpenFreeTrial],
        availableGrades: [availableGrades, setAvailableGrades],
        trialType: [trialType, setTrialType],
      }}
    >
      {props.children}
    </IntroContext.Provider>
  );
};

export default IntroContextProvider;
