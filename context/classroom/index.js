import React, { useState, createContext, useEffect, useContext } from "react";

// import {
//   fetchLectureItem,
//   fetchLectureHeaderItem,
//   getChapterLastEngagementData,
//   getUserLatestEngagement,
// } from "../../database";
import { UserContext } from "../global/user-context";
import { PustackProContext } from "../global/PustackProContext";
import useQuery from "../../hooks/query/useQuery";

function youTubeGetID(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

export const ClassroomContext = createContext();

const getUserLatestEngagement = async ({ grade, userId }) => {
  return await require('../../firebase-config').db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc("latest_engagement")
    .get()
    .then((doc) => doc.data()?.chapter_list);
};

const fetchLectureItem = async ({
                                  grade,
                                  lecture_id,
                                  chapter,
                                  tab_id,
                                }) => {
  const _category = chapter.split("_")[3];
  const _subject = chapter.split("_")[4];

  let subjectPath = `${grade}_learn_${_category}`;

  if (_category !== "maths" && _category !== "mathematics") {
    subjectPath = `${grade}_learn_${_category}_${_subject}`;
  }

  if (lecture_id && chapter && tab_id) {
    return await require('../../firebase-config').db
      .collection("cms_data")
      .doc(grade)
      .collection("scope")
      .doc(`${grade}_learn`)
      .collection("category")
      .doc(`${grade}_learn_${_category}`)
      .collection("subject")
      .doc(subjectPath)
      .collection("chapter")
      .doc(chapter)
      .collection("tab")
      .doc(tab_id)
      .collection("lecture_item")
      .doc(lecture_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let _data = doc.data();

          if (_data?.lecture_item_type === "video") {
            return {
              type: "video",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              youtube: youTubeGetID(_data?.youtube_url),
              notes: _data?.notes_link,
              item: _data
            };
          } else if (_data?.lecture_item_type === "note") {
            return {
              type: "note",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              notes: _data?.notes_link,
              youtube: null,
              item: _data
            };
          }
        }

        return null;
      })
      .catch((err) => console.log(err));
  } else return null;
};

const fetchLectureHeaderItem = async ({
                                        grade,
                                        lecture_id,
                                        parent_id,
                                        chapter,
                                        tab_id,
                                      }) => {
  const _category = chapter.split("_")[3];
  const _subject = chapter.split("_")[4];
  let subjectPath = `${grade}_learn_${_category}`;

  if (_category !== "maths" && _category !== "mathematics") {
    subjectPath = `${grade}_learn_${_category}_${_subject}`;
  }

  if (lecture_id && parent_id && chapter && tab_id) {
    return await require('../../firebase-config').db
      .collection("cms_data")
      .doc(grade)
      .collection("scope")
      .doc(`${grade}_learn`)
      .collection("category")
      .doc(`${grade}_learn_${_category}`)
      .collection("subject")
      .doc(subjectPath)
      .collection("chapter")
      .doc(chapter)
      .collection("tab")
      .doc(tab_id)
      .collection("lecture_item")
      .doc(parent_id)
      .collection("lecture_header_item")
      .doc(lecture_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let _data = doc.data();

          if (_data?.lecture_header_item_type === "video") {
            return {
              type: "video",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              youtube: youTubeGetID(_data?.youtube_url),
              notes: _data?.notes_link,
              item: _data
            };
          } else if (_data?.lecture_header_item_type === "note") {
            return {
              type: "note",
              category: _data?.category_name,
              chapter: _data?.chapter_name,
              notes: _data?.notes_link,
              youtube: null,
              item: _data
            };
          }
        }

        return null;
      });
  } else return null;
};

const getChapterLastEngagementData = async ({
                                              userId,
                                              grade,
                                              chapter_id,
                                            }) => {
  if (chapter_id) {
    const category = chapter_id.split("_")[3];
    const subject = chapter_id.split("_")[4];

    let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

    if (category === "maths") {
      chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
    }

    return await require('../../firebase-config').db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .collection(chapter_id)
      .doc("engagement_map")
      .get()
      .then((doc) => doc.data())
      .catch((error) => console.error(error));
  } else return null;
};

export const ClassroomContextProvider = (props) => {
  const [videoID, setVideoID] = useState(null);
  const [tabsData, setTabsData] = useState(null);
  const [notesLink, setNotesLink] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [lecturesData, setLecturesData] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [nextItem, setNextItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [lectureItem, setLectureItem] = useState("");
  const [activeTabId, setActiveTabId] = useState(null);
  const [lectureItems, setLectureItems] = useState(null);
  const [classroomSubject, setClassroomSubject] = useState(null);
  const [classroomChapter, setClassroomChapter] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [videoSeeking, setVideoSeeking] = useState(true);
  const [chapterEngagement, setChapterEngagement] = useState(null);
  const [chapterEngagementMap, setChapterEngagementMap] = useState(null);
  const [lastEngagement, setLastEngagement] = useState(null);
  const [lastActivityMap, setLastActivityMap] = useState(null);
  const [showOnlyLogo, setShowOnlyLogo] = useState(true);
  const [isNotes, setIsNotes] = useState(false);
  const [completionStatusByChapter, setCompletionStatusByChapter] =
    useState(null);
  const [allChaptersCompletionStatus, setAllChaptersCompletionStatus] =
    useState(null);
  const [userLatestEngagement, setUserLatestEngagement] = useState(null);
  // const [subjectMeta, setSubjectMeta] = useState(null);
  const [user] = useContext(UserContext).user;

  const [tabIndex, setTabIndex] = useState(0);
  const [lectureTier, setLectureTier] = useState(false);
  const [beaconBody, setBeaconBody] = useState(null);
  const [lastEngagementFound, setLastEngagementFound] = useState(true);
  const [isUserProTier] = useContext(UserContext).tier;
  const [, setIsSliderOpen] = useContext(PustackProContext).value;
  const query = useQuery();

  useEffect(() => {
    if(query.get('no_default') === 'true') return;
    chapterLastEngagementData();
  }, [classroomChapter, tabsData, query,]);

  useEffect(() => {
    if(query.get('no_default') === 'true') return;

    if (tabsData !== null && !lastEngagementFound) {
      const data = tabsData[0];
      setLecturesData(data);

      setLastEngagement({
        lecture_type: data?.lecture_items[0]?.lecture_item_type,
        lecture_header_item_index:
          data?.lecture_items[0]?.lecture_item_type === "header" ? 0 : -1,
        lecture_item_index: 0,
        tab_index: 0,
      });
      setActiveItem({
        parent:
          data?.lecture_items[0]?.lecture_item_type === "header"
            ? data?.lecture_items[0]?.lecture_item_id
            : null,
        item:
          data?.lecture_items[0]?.lecture_item_type === "header"
            ? data?.lecture_items[0]?.lecture_header_items[0]
                ?.lecture_header_item_id
            : data?.lecture_items[0]?.lecture_item_id,
      });

      if (data?.lecture_items[0]?.tier === "pro") {
        setLectureTier(true);
      } else {
        setLectureTier(false);
      }

      setTabIndex(0);
    }
    getUserLatestEngagementFn();
  }, [tabsData, lastEngagementFound, query]);

  useEffect(() => {
    if (lectureItems !== null && typeof lectureItems !== "undefined") {
      if (
        lastEngagement?.lecture_type === "video" &&
        nextItem?.lectureType === "header_video"
      ) {
        populateNextLecture(lectureItems, 1, false);
      } else {
        populateNextLecture(lectureItems);
      }
    }
  }, [lectureItems, lastEngagement]);

  useEffect(() => {
    if (tabsData !== null) {
      setLecturesData(tabsData[tabIndex]);
    }
  }, [tabIndex]);

  useEffect(() => {
    if (lecturesData !== null) {
      setLectureItems(lecturesData?.lecture_items);
      setActiveTabId(lecturesData?.tab_id);
    }
  }, [lecturesData]);

  useEffect(() => {
    if (!isUserProTier && lectureTier) {
      setShowOnlyLogo(true);
      setIsSliderOpen(true);
    }
    if(!user) {
      setShowOnlyLogo(false);
    }
  }, [user, isUserProTier, lectureTier]);

  const populateActiveItem = async (id) => {
    console.log('classroomChapter - ', classroomChapter);
    let lecture_item_data = await fetchLectureItem({
      grade: user?.grade,
      lecture_id: id,
      chapter: classroomChapter,
      tab_id: activeTabId,
    });

    if(lecture_item_data) {
      setLectureItem(lecture_item_data.item);
    }

    if (videoID === lecture_item_data?.youtube) {
      setVideoSeeking(false);
      return setPlaying(true);
    }

    if (lecture_item_data?.type === "video") {
      setVideoID(lecture_item_data?.youtube);
      setChapterName(lecture_item_data?.chapter);
    }

    if (lecture_item_data?.notes !== null) {
      setNotesLink(lecture_item_data?.notes);
    } else {
      setNotesLink(null);
    }
  };

  const populateActiveHeaderItem = async (child_id, parent_id) => {

    console.log('populateActiveHeaderItem - ', child_id, classroomChapter, parent_id);

    let lecture_item_header_data = await fetchLectureHeaderItem({
      grade: user?.grade,
      lecture_id: child_id,
      chapter: classroomChapter,
      parent_id: parent_id,
      tab_id: activeTabId,
    });

    if(lecture_item_header_data) {
      setLectureItem(lecture_item_header_data.item);
    }

    if (
      videoID === lecture_item_header_data?.youtube &&
      lecture_item_header_data?.type !== "note"
    ) {
      setVideoSeeking(false);
      return setPlaying(true);
    }

    if (lecture_item_header_data?.type === "video") {
      setVideoID(lecture_item_header_data?.youtube);
      setChapterName(lecture_item_header_data?.chapter);
      setNotesLink(lecture_item_header_data?.notes);
    }

    if (lecture_item_header_data?.type === "note") {
      setVideoID(null);
      setChapterName(lecture_item_header_data?.chapter);
      setNotesLink(lecture_item_header_data?.notes);
      setVideoSeeking(false);
      setPlaying(false);
    }
  };

  const populateNextLecture = async (
    lectures,
    offset = 0,
    newHeaderIndex = false
  ) => {
    let next_lecture_id = getNextLectureID({
      lectureItems: lectures,
      item_counter: lastEngagement?.lecture_item_index + offset,
      newHeaderIndex,
    });
    console.log('popuateNextLecture - ', lectures, offset, newHeaderIndex, next_lecture_id);

    if (
      typeof next_lecture_id !== "undefined" &&
      next_lecture_id.type === "main"
    ) {
      setNextItem({
        parent: null,
        item: next_lecture_id?.child,
        childName: next_lecture_id?.childName,
        parentName: next_lecture_id?.parentName,
        lectureType: next_lecture_id?.lectureType,
        itemIndex: next_lecture_id?.itemIndex,
        headerItemIndex: -1,
        tabIndex: tabIndex,
        tier: next_lecture_id?.tier,
      });
    } else if (
      typeof next_lecture_id !== "undefined" &&
      next_lecture_id.type === "header"
    ) {
      setNextItem({
        parent: next_lecture_id?.parent,
        item: next_lecture_id?.child,
        childName: next_lecture_id?.childName,
        parentName: next_lecture_id?.parentName,
        lectureType: next_lecture_id?.lectureType,
        itemIndex: next_lecture_id?.itemIndex,
        headerItemIndex: next_lecture_id?.headerItemIndex,
        tabIndex: tabIndex,
        tier: next_lecture_id?.tier,
      });
    } else if (typeof next_lecture_id === "undefined") {
      populateNextLecture(lectures, 1, true);
    }
  };

  const getNextLectureID = ({
    lectureItems,
    item_counter = 0,
    newHeaderIndex,
  }) => {
    // In case it's a note, skip it
    console.log('lectureItems[item_counter]?.lecture_item_type = ', lectureItems[item_counter],
      lectureItems[item_counter + 1], item_counter);

    if (lectureItems[item_counter + 1]?.lecture_item_type === "note") {
      return getNextLectureID({
        lectureItems: lectureItems,
        item_counter: item_counter + 1,
        newHeaderIndex,
      });
    }

    // In case it's a header item
    else if (
      lectureItems[item_counter]?.lecture_item_type === "video" &&
      lectureItems[item_counter + 1]?.lecture_item_type === "header"
    ) {
      return getNextHeaderLectureID({
        lectureItems: lectureItems[item_counter + 1]?.lecture_header_items,
        parent_id: lectureItems[item_counter + 1]?.lecture_item_id,
        item_counter: 0,
        offset: 0,
        parent_name: lectureItems[item_counter + 1]?.lecture_item_name,
        itemIndex: 0,
        tier: lectureItems[item_counter + 1]?.tier,
      });
    } else if (lectureItems[item_counter]?.lecture_item_type === "header") {
      // if (
      //   lastEngagement?.lecture_header_item_index !==
      //   lectureItems[item_counter]?.lecture_header_items?.length - 1
      // ) {
        return getNextHeaderLectureID({
          lectureItems: lectureItems[item_counter]?.lecture_header_items,
          parent_id: lectureItems[item_counter]?.lecture_item_id,
          item_counter: newHeaderIndex
            ? 0
            : lastEngagement?.lecture_header_item_index,
          offset: newHeaderIndex ? 0 : 1,
          parent_name: lectureItems[item_counter]?.lecture_item_name,
          itemIndex: item_counter,
          tier: lectureItems[item_counter]?.tier,
        });
      // }

      // return {
      //   type: "main",
      //   parent: null,
      //   child: lectureItems[item_counter + 1]?.lecture_item_id,
      //   childName: lectureItems[item_counter + 1]?.lecture_item_name,
      //   parentName: null,
      //   itemIndex: item_counter + 1,
      //   headerItemIndex: -1,
      //   lectureType: "video",
      //   tier: lectureItems[item_counter + 1]?.tier,
      // };
    }

    // In case it's a video
    else {
      return {
        type: "main",
        parent: null,
        child: lectureItems[item_counter + 1]?.lecture_item_id,
        childName: lectureItems[item_counter + 1]?.lecture_item_name,
        parentName: null,
        itemIndex: item_counter + 1,
        headerItemIndex: -1,
        lectureType: "video",
        tier: lectureItems[item_counter + 1]?.tier,
      };
    }
  };

  const getNextHeaderLectureID = ({
    lectureItems,
    item_counter = 0,
    parent_id,
    parent_name,
    offset,
    itemIndex,
    tier,
  }) => {
    // In case it's a note, skip it
    if (
      lectureItems[item_counter + offset]?.lecture_header_item_type === "note"
    ) {
      return getNextHeaderLectureID({
        lectureItems,
        item_counter: item_counter + 1,
        parent_id,
        parent_name,
        offset,
        itemIndex,
        tier,
      });
    }

    // In case it's a video
    else if (
      lectureItems[item_counter + offset]?.lecture_header_item_type === "video"
    ) {
      return {
        type: "header",
        parent: parent_id,
        child: lectureItems[item_counter + offset]?.lecture_header_item_id,
        childName:
          lectureItems[item_counter + offset]?.lecture_header_item_name,
        parentName: parent_name,
        lectureType: "header_video",
        headerItemIndex: item_counter + offset,
        itemIndex: itemIndex,
        tier: lectureItems[item_counter + offset]?.tier,
      };
    }
  };


  const chapterLastEngagementData = async () => {
    const data = await getChapterLastEngagementData({
      userId: user?.uid,
      chapter_id: classroomChapter,
      grade: user?.grade,
    });

    if ((data || "") && typeof data?.last_activity_map !== "undefined") {
      const newActiveItem = {
        parent:
          data?.last_activity_map?.header_item_id === null
            ? null
            : data?.last_activity_map?.item_id,
        item:
          data?.last_activity_map?.header_item_id === null
            ? data?.last_activity_map?.item_id
            : data?.last_activity_map?.header_item_id,
      };

      setActiveItem(newActiveItem);

      if (tabsData !== null && typeof data?.last_activity_map !== "undefined") {
        const tab_index = data?.last_activity_map?.tab_index;
        const header_item_index =
          data?.last_activity_map?.lecture_header_item_index;
        const lecture_item_index = data?.last_activity_map?.lecture_item_index;

        const tier =
          header_item_index === -1
            ? tabsData[tab_index]?.lecture_items[lecture_item_index]?.tier
            : tabsData[tab_index]?.lecture_items[lecture_item_index]
                ?.lecture_header_items[header_item_index]?.tier;

        if (tier === "pro") {
          setLectureTier(true);
        } else {
          setLectureTier(false);
        }

        setLastEngagement({
          lecture_type:
            tabsData[tab_index]?.lecture_items[lecture_item_index]
              ?.lecture_item_type,
          lecture_header_item_index:
            tabsData[tab_index]?.lecture_items[lecture_item_index]
              ?.lecture_item_type === "header"
              ? header_item_index
              : -1,
          lecture_item_index: lecture_item_index,
          tab_index: tab_index,
        });

        setTabIndex(tab_index);

        setLecturesData(tabsData[tab_index]);
      }
      setActiveTabIndex(data?.last_activity_map?.tab_index);
      setLastEngagementFound(true);
    } else if (!(data || "") && tabsData) {
      if (lectureItems !== null && lectureItems?.length > 0) {
        populateNextLecture(lectureItems);
      }
      setActiveTabIndex(0);
      setLastEngagementFound(false);
    }
  };

  const getUserLatestEngagementFn = async () => {
    if(!user || !user?.uid || !user?.grade) return;
    const res = await getUserLatestEngagement({
      userId: user?.uid,
      grade: user?.grade,
    });

    setUserLatestEngagement(res);
  };

  useEffect(() => {
    console.log('activeItem - ', activeItem);
    if(!user) return;
    if (isUserProTier && activeTabId) {
      if (activeItem !== null && activeItem?.parent === null)
        populateActiveItem(activeItem?.item);
      else if (activeItem !== null && activeItem?.parent !== null)
        populateActiveHeaderItem(activeItem?.item, activeItem?.parent);

      setShowOnlyLogo(false);
    } else if (!isUserProTier && !lectureTier && activeTabId) {
      if (activeItem !== null && activeItem?.parent === null)
        populateActiveItem(activeItem?.item);
      else if (activeItem !== null && activeItem?.parent !== null)
        populateActiveHeaderItem(activeItem?.item, activeItem?.parent);

      setShowOnlyLogo(false);
    }
  }, [user, activeItem, classroomChapter, activeTabId, lectureTier, isUserProTier]);

  return (
    <ClassroomContext.Provider
      value={{
        videoID: [videoID, setVideoID],
        tabsData: [tabsData, setTabsData],
        tabId: [activeTabId, setActiveTabId],
        activeTabIndex: [activeTabIndex, setActiveTabIndex],
        lectures: [lecturesData, setLecturesData],
        lectureItems: [lectureItems, setLectureItems],
        lectureTier: [lectureTier, setLectureTier],
        activeItem: [activeItem, setActiveItem],
        nextItem: [nextItem, setNextItem],
        lectureItem: [lectureItem, setLectureItem],
        classroomData: [classroomData, setClassroomData],
        classroomSubject: [classroomSubject, setClassroomSubject],
        classroomChapter: [classroomChapter, setClassroomChapter],
        chapterName: [chapterName, setChapterName],
        notesLink: [notesLink, setNotesLink],
        isNotes: [isNotes, setIsNotes],
        playing: [playing, setPlaying],
        videoSeeking: [videoSeeking, setVideoSeeking],
        chapterEngagement: [chapterEngagement, setChapterEngagement],
        chapterEngagementMap: [chapterEngagementMap, setChapterEngagementMap],
        lastEngagement: [lastEngagement, setLastEngagement],
        lastActivityMap: [lastActivityMap, setLastActivityMap],
        completionStatusByChapter: [
          completionStatusByChapter,
          setCompletionStatusByChapter,
        ],
        userLatestEngagement: [userLatestEngagement, setUserLatestEngagement],
        allChaptersCompletionStatus: [
          allChaptersCompletionStatus,
          setAllChaptersCompletionStatus,
        ],
        tabIndex: [tabIndex, setTabIndex],
        beaconBody: [beaconBody, setBeaconBody],
        showOnlyLogo: [showOnlyLogo, setShowOnlyLogo],
      }}
    >
      {props.children}
    </ClassroomContext.Provider>
  );
};

export default ClassroomContextProvider;
