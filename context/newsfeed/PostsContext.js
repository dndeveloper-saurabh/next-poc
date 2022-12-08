import React, { useState, createContext } from "react";

export const NewsFeedContext = createContext();

export const NewsFeedContextProvider = (props) => {
  const [posts, setPosts] = useState([]);
  const [selectedFilterOption, setSelectedFilterOption] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastDocument, setlastDocument] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <NewsFeedContext.Provider
      value={{
        posts: [posts, setPosts],
        selectedFilterOption: [selectedFilterOption, setSelectedFilterOption],
        mobileOpen: [mobileOpen, setMobileOpen],
        lastDocument: [lastDocument, setlastDocument],
        isNewPostModalOpen: [isNewPostModalOpen, setIsNewPostModalOpen],
        isLoading: [isLoading, setIsLoading],
      }}
    >
      {props.children}
    </NewsFeedContext.Provider>
  );
};

export default NewsFeedContextProvider;
