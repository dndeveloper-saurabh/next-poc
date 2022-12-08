import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [pushyData, setPushyData] = useState(null);
  const [isExternal, setIsExternal] = useState(false);
  const [hasSessions, setHasSessions] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [closeCarePage, setCloseCarePage] = useState(true);
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [showBlazeMain, setShowBlazeMain] = useState(false);
  const [isUserProTier, setIsUserProTier] = useState(false);
  const [blazeCallAlert, setBlazeCallAlert] = useState(false);
  const [openPustackCare, setOpenPuStackCare] = useState(false);
  const [unreadAnswerCount, setUnreadAnswerCount] = useState(0);
  const [closeInstallApp, setCloseInstallApp] = useState(false);
  const [openMenuSettings, setOpenMenuSettings] = useState(false);
  const [unreadCareMsgCount, setUnreadCareMsgCount] = useState(0);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);
  const [sectionHighlighted, setSectionHighlighted] = useState(0);
  const [openBlazeCallModal, setOpenBlazeCallModal] = useState(false);
  const [referrerId, setReferrerId] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [hasRatedBlazeSession, setHasRatedBlazeSession] = useState(false);
  const [bounceBlazeIcon, setBounceBlazeIcon] = useState(false);
  const [userHasNoGrade, setUserHasNoGrade] = useState(false);
  return (
    <UserContext.Provider
      value={{
        user: [user, setUser],
        openMenu: [openMenu, setOpenMenu],
        openChat: [openChat, setOpenChat],
        pushyData: [pushyData, setPushyData],
        tier: [isUserProTier, setIsUserProTier],
        isExternal: [isExternal, setIsExternal],
        referrerId: [referrerId, setReferrerId],
        hasSessions: [hasSessions, setHasSessions],
        totalSeconds: [totalSeconds, setTotalSeconds],
        isInstructor: [isInstructor, setIsInstructor],
        openSearchBox: [openSearchBox, setOpenSearchBox],
        closeCarePage: [closeCarePage, setCloseCarePage],
        showBlazeMain: [showBlazeMain, setShowBlazeMain],
        blazeCallAlert: [blazeCallAlert, setBlazeCallAlert],
        closeInstallApp: [closeInstallApp, setCloseInstallApp],
        openPustackCare: [openPustackCare, setOpenPuStackCare],
        openMobileSearch: [openMobileSearch, setOpenMobileSearch],
        openMenuSettings: [openMenuSettings, setOpenMenuSettings],
        unreadAnswerCount: [unreadAnswerCount, setUnreadAnswerCount],
        unreadCareMsgCount: [unreadCareMsgCount, setUnreadCareMsgCount],
        userHasNoGrade: [userHasNoGrade, setUserHasNoGrade],
        sectionHighlighted: [sectionHighlighted, setSectionHighlighted],
        openBlazeCallModal: [openBlazeCallModal, setOpenBlazeCallModal],
        hasRatedBlazeSession: [hasRatedBlazeSession, setHasRatedBlazeSession],
        bounceBlazeIcon: [bounceBlazeIcon, setBounceBlazeIcon],
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
