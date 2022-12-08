import React, { useState, createContext } from "react";

export const SubjectModalContext = createContext();

export const SubjectModalContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [subjectCode, setSubjectCode] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeFlag, setActiveFlag] = useState(true);

  return (
    <SubjectModalContext.Provider
      value={{
        data: [data, setData],
        isOpen: [isOpen, setIsOpen],
        subjectCode: [subjectCode, setSubjectCode],
        subjectName: [subjectName, setSubjectName],
        tabData: [tabData, setTabData],
        activeTab: [activeTab, setActiveTab],
        activeFlag: [activeFlag, setActiveFlag],
      }}
    >
      {props.children}
    </SubjectModalContext.Provider>
  );
};

export default SubjectModalContextProvider;
