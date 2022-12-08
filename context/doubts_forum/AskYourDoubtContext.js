import React, { useState, createContext } from "react";

export const AskYourDoubtContext = createContext();

export const AskYourDoubtContextProvider = (props) => {
  //------------------------------------ constants hooks
  const [categorySelected, setCategorySelected] = useState();
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [chapterSelected, setChapterSelected] = useState("");
  const [doubtQuestion, setDoubtQuestion] = useState("");
  const [updatedDoubtQuestion, setUpdatedDoubtQuestion] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [skipSubjects, setSkipSubjects] = useState([]);
  const [chaptersSelected, setChaptersSelected] = useState([]);
  const [subjectsSelected, setSubjectsSelected] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [open, setOpen] = useState(false);
  const [showCategoriePicker, setShowCategoriePicker] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [onBack, setOnBack] = useState(false);
  const [doubtId, setDoubtId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [allowNext, setAllowNext] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDoubtAnswered, setIsDoubtAnswered] = useState(false);

  return (
    <AskYourDoubtContext.Provider
      value={{
        categorySelected: [categorySelected, setCategorySelected],
        subjectSelected: [subjectSelected, setSubjectSelected],
        chapterSelected: [chapterSelected, setChapterSelected],
        doubtQuestion: [doubtQuestion, setDoubtQuestion],
        images: [images, setImages],
        newImages: [newImages, setNewImages],
        skipSubjects: [skipSubjects, setSkipSubjects],
        chaptersSelected: [chaptersSelected, setChaptersSelected],
        subjectsSelected: [subjectsSelected, setSubjectsSelected],
        categories: [categories, setCategories],
        subjects: [subjects, setSubjects],
        chapters: [chapters, setChapters],
        open: [open, setOpen],
        showCategoriePicker: [showCategoriePicker, setShowCategoriePicker],
        updating: [updating, setUpdating],
        doubtId: [doubtId, setDoubtId],
        onBack: [onBack, setOnBack],
        isLoading: [isLoading, setIsLoading],
        updatedDoubtQuestion: [updatedDoubtQuestion, setUpdatedDoubtQuestion],
        slug: [slug, setSlug],
        allowNext: [allowNext, setAllowNext],
        isDoubtAnswered: [isDoubtAnswered, setIsDoubtAnswered],
      }}
    >
      {props.children}
    </AskYourDoubtContext.Provider>
  );
};

export default AskYourDoubtContextProvider;
