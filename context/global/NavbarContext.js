import React, { useState, createContext } from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [selectedMenuItem, setSelectedMenuItem] = useState("home");
  return (
    <NavbarContext.Provider
      value={{
        selectedMenuItem: [selectedMenuItem, setSelectedMenuItem],
      }}
    >
      {props.children}
    </NavbarContext.Provider>
  );
};

export default NavbarContextProvider;
