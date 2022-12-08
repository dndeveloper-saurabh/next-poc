import React, { useState, createContext } from "react";

export const CmsContext = createContext();

export const CmsContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [infoData, setInfoData] = useState(null);
  const [unsubscribes, setUnsubscribes] = useState({});
  const [editFormData, setEditFormData] = useState(null);
  const [activeItemInColumn, setActiveItemInColumn] = useState(null);
  const [activeDirRef, setActiveDirRef] = useState(null);

  return (
    <CmsContext.Provider value={{
      infoData: [infoData, setInfoData],
      unsubscribes: [unsubscribes, setUnsubscribes],
      editFormData: [editFormData, setEditFormData],
      activeItemInColumn: [activeItemInColumn, setActiveItemInColumn],
      activeDirRef: [activeDirRef, setActiveDirRef]
    }}>
      {props.children}
    </CmsContext.Provider>
  );
};

export default CmsContextProvider;
