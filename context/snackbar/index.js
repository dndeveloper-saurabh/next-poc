import React, { useState, createContext } from "react";

export const SnackbarContext = createContext();

export const SnackbarContextProvider = (props) => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);

  return (
    <SnackbarContext.Provider
      value={{
        title: [title, setTitle],
        description: [description, setDescription],
        type: [type, setType],
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarContextProvider;
