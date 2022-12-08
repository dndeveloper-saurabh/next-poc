import React, { useState, createContext } from "react";

export const CreatePostContext = createContext();

export const CreatePostContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [postId, setpostId] = useState(null);
  const [richText, setRichText] = useState("");
  const [updatedRichText, setUpdatedRichText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [tempGroups, settempGroups] = useState([]);
  const [type, setType] = useState(1);
  const [youtubeUrl, setyoutubeUrl] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [addYoutubeUrl, setaddYoutubeUrl] = useState(false);
  const [youtubeID, setYoutubeID] = useState(null);

  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState([
    { option: "" },
    { option: "" },
  ]);
  const [pollDays, setPollDays] = useState(1);
  const [plainText, setPlainText] = useState("");

  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [linkMetadata, setLinkMetadata] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [video, setVideo] = useState("");
  const [currentLink, setCurrentLink] = useState(null);
  const [postInfo, setPostInfo] = useState([]);

  const [endTs, setendTs] = useState();

  return (
    <CreatePostContext.Provider
      value={{
        endTs: [endTs, setendTs],
        postId: [postId, setpostId],
        postInfo: [postInfo, setPostInfo],
        richText: [richText, setRichText],
        updatedRichText: [updatedRichText, setUpdatedRichText],
        isUpdating: [isUpdating, setIsUpdating],
        selectedGroups: [selectedGroups, setSelectedGroups],
        tempGroups: [tempGroups, settempGroups],
        type: [type, setType],
        youtubeUrl: [youtubeUrl, setyoutubeUrl],
        isUpdated: [isUpdated, setIsUpdated],
        addYoutubeUrl: [addYoutubeUrl, setaddYoutubeUrl],
        youtubeID: [youtubeID, setYoutubeID],
        isPoll: [isPoll, setIsPoll],
        pollOptions: [pollOptions, setPollOptions],
        plainText: [plainText, setPlainText],
        pollDays: [pollDays, setPollDays],
        isGeneratingMetadata: [isGeneratingMetadata, setIsGeneratingMetadata],
        linkMetadata: [linkMetadata, setLinkMetadata],
        images: [images, setImages],
        newImages: [newImages, setNewImages],
        video: [video, setVideo],
        currentLink: [currentLink, setCurrentLink],
      }}
    >
      {props.children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostContextProvider;
