import React, { useState, useEffect, createContext } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("pustack-dark-theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme: [isDarkMode, setIsDarkMode] }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
