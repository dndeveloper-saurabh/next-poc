import React, { useState, createContext } from "react";

export const PustackProContext = createContext();

export const PustackProContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  return (
    <PustackProContext.Provider
      value={{
        value: [isOpen, setIsOpen],
        warning: [showWarning, setShowWarning]
      }}
    >
      {props.children}
    </PustackProContext.Provider>
  );
};

export default PustackProContextProvider;
