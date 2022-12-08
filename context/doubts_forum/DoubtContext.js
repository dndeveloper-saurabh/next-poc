import React, { useState, createContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const DoubtContext = createContext();

export const DoubtContextProvider = (props) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 720px)" });

  const [doubtAnswerUserId, setDoubtAnswerUserId] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(2);
  const [answering, setAnswering] = useState(false);
  const [comments, setComments] = useState([]);

  const [commentAdded, setCommentAdded] = useState(0);
  const [commentDeleted, setCommentDeleted] = useState(0);
  const [youtubeUrl, setyoutubeUrl] = useState("");
  const [richText, setRichText] = useState("");
  const [answerUpdated, setAnswerUpdated] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (props?.searchTile) {
      setIsExpanded(false);
    } else {
      setIsExpanded(!isSmallScreen);
    }
  }, [isSmallScreen]);

  return (
    <DoubtContext.Provider
      value={{
        visibleCommentsCount: [visibleCommentsCount, setVisibleCommentsCount],
        answering: [answering, setAnswering],
        comments: [comments, setComments],
        commentAdded: [commentAdded, setCommentAdded],
        commentDeleted: [commentDeleted, setCommentDeleted],
        youtubeUrl: [youtubeUrl, setyoutubeUrl],
        richText: [richText, setRichText],
        answerUpdated: [answerUpdated, setAnswerUpdated],
        isExpanded: [isExpanded, setIsExpanded],
        isAnswered: [isAnswered, setIsAnswered],
        doubtAnswerUserId: [doubtAnswerUserId, setDoubtAnswerUserId],
      }}
    >
      {props.children}
    </DoubtContext.Provider>
  );
};

export default DoubtContextProvider;
