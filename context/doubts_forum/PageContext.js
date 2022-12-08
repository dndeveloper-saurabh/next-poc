import React, { useState, createContext } from "react";

export const PageContext = createContext();

export const PageContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [pageName, setpageName] = useState("homePage");

  return (
    <PageContext.Provider value={{ pageName: [pageName, setpageName] }}>
      {props.children}
    </PageContext.Provider>
  );
};

export default PageContextProvider;
