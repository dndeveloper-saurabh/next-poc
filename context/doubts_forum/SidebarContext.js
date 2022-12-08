import React, {useState, createContext, useEffect} from "react";

export const SidebarContext = createContext();

export const SidebarContextProvider = (props) => {
  //------------------------------------ constants hooks

  const [sortBy, setSortBy] = useState("Recommended");
  const [isAnswered, setIsAnswered] = useState(
    false
  );
  const [showMyDoubts, setShowMyDoubts] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [selectedChapter, setSelectedChapter] = useState("General");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topLevel, setTopLevel] = useState("General");

  //these four variables will manage categorie selection
  const [mathSelected, setMathSelected] = useState(false);
  const [scienceSelected, setScienceSelected] = useState(false);
  const [sstSelected, setSstSelected] = useState(false);
  const [englishSelected, setEnglishSelected] = useState(false);

  const [generalSelected, setGeneralSelected] = useState(true);

  const [isLoadingFeed, setIsLoadingFeed] = useState();
  const [limitSubjectChips, setLimitSubjectChips] = useState(true);
  const [lastDocument, setLastDocument] = useState(null);
  const [noDataFound, setnoDataFound] = useState(false);

  const [updateCategoriesList, setUpdateCategoriesList] = useState(false);
  const [wrongGrade, setWrongGrade] = useState(false);

  // sort
  const [sortByDBString, setSortByDBString] = useState("recommendation_score");

  // -> small screen hooks for just to show update not act on it.
  const [smallScreenTopLevel, setSmallScreenTopLevel] = useState("General");
  const [smallScreenSelectedSubject, setSmallScreenSelectedSubject] =
    useState("General");
  const [smallScreenSelectedChapter, setSmallScreenSelectedChapter] =
    useState("General");
  const [smallScreenSelectedTopic, setSmallScreenSelectedTopic] = useState("");
  const [smallScreenIsAnswered, setsmallScreenIsAnswered] = useState(
    false
  );
  const [smallScreenSortBy, setsmallScreenSortBy] = useState("Recent first");

  const [queryParameters, setQueryParameters] = useState("");

  useEffect(() => {
    setIsAnswered(!JSON.parse(localStorage.getItem("isInstructor")))
    setsmallScreenIsAnswered(!JSON.parse(localStorage.getItem("isInstructor")))
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        sortBy: [sortBy, setSortBy],
        isAnswered: [isAnswered, setIsAnswered],
        showMyDoubts: [showMyDoubts, setShowMyDoubts],
        selectedSubject: [selectedSubject, setSelectedSubject],
        selectedTopic: [selectedTopic, setSelectedTopic],
        mathSelected: [mathSelected, setMathSelected],
        scienceSelected: [scienceSelected, setScienceSelected],
        sstSelected: [sstSelected, setSstSelected],
        englishSelected: [englishSelected, setEnglishSelected],
        generalSelected: [generalSelected, setGeneralSelected],
        isLoadingFeed: [isLoadingFeed, setIsLoadingFeed],
        limitSubjectChips: [limitSubjectChips, setLimitSubjectChips],
        sortByDBString: [sortByDBString, setSortByDBString],
        lastDocument: [lastDocument, setLastDocument],
        selectedChapter: [selectedChapter, setSelectedChapter],
        topLevel: [topLevel, setTopLevel],
        noDataFound: [noDataFound, setnoDataFound],
        updateCategoriesList: [updateCategoriesList, setUpdateCategoriesList],
        smallScreenTopLevel: [smallScreenTopLevel, setSmallScreenTopLevel],
        smallScreenSelectedTopic: [
          smallScreenSelectedTopic,
          setSmallScreenSelectedTopic,
        ],
        smallScreenSelectedSubject: [
          smallScreenSelectedSubject,
          setSmallScreenSelectedSubject,
        ],
        smallScreenSelectedChapter: [
          smallScreenSelectedChapter,
          setSmallScreenSelectedChapter,
        ],
        smallScreenIsAnswered: [
          smallScreenIsAnswered,
          setsmallScreenIsAnswered,
        ],
        smallScreenSortBy: [smallScreenSortBy, setsmallScreenSortBy],
        queryParameters: [queryParameters, setQueryParameters],
        wrongGrade: [wrongGrade, setWrongGrade],
      }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
