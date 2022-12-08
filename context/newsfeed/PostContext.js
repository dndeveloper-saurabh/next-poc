import React, { useState, createContext } from "react";

export const PostContext = createContext();

export const PostContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [visibleCommentsCount, setVisibleCommentsCount] = useState(2);
  const [comments, setComments] = useState([]);
  const [commentAdded, setCommentAdded] = useState(0);
  const [commentDeleted, setCommentDeleted] = useState(0);

  return (
    <PostContext.Provider
      value={{
        visibleCommentsCount: [visibleCommentsCount, setVisibleCommentsCount],
        comments: [comments, setComments],
        commentAdded: [commentAdded, setCommentAdded],
        commentDeleted: [commentDeleted, setCommentDeleted],
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
