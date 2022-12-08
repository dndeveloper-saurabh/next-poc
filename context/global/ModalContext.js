import React, { useState, createContext } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [modalData, setModalData] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        state: [modalData, setModalData]
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
