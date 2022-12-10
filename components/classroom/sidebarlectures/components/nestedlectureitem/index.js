import React, { useContext } from "react";
// import Lottie from "lottie-react-web";
const List = dynamic(() => import('@material-ui/core/List'));
const Icon = dynamic(() => import('@material-ui/core/Icon'));
const ListItem = dynamic(() => import('@material-ui/core/ListItem'));
const Collapse = dynamic(() => import('@material-ui/core/Collapse'));
const ExpandLess = dynamic(() => import('@material-ui/icons/ExpandLess'));
const ExpandMore = dynamic(() => import('@material-ui/icons/ExpandMore'));
const ListItemIcon = dynamic(() => import('@material-ui/core/ListItemIcon'));
const ListItemText = dynamic(() => import('@material-ui/core/ListItemText'));


import {
  ClassroomContext,
  PustackProContext,
  UserContext,
} from "../../../../../context";

import {
  NotesSVG,
  videoPlaying,
  CheckIcon as CheckIconImage,
  CheckIconGreen as CheckIconGreenImage,
  LockIcon as LockedIconImage,
} from "../../../../../public/assets";
import Image from "next/image";
import dynamic from "next/dynamic";

const CheckIcon = () => (
  <Icon>
    <Image
      src={CheckIconImage}
      alt="Check Icon"
      style={{ width: "100%" }}
      draggable={false}
    />
  </Icon>
);

const CheckGreenIcon = () => (
  <Icon>
    <img
      src={CheckIconGreenImage}
      alt="Green"
      style={{ width: "100%" }}
      draggable={false}
    />
  </Icon>
);

const LockedIcon = () => (
  <Icon>
    <img
      src={LockedIconImage}
      alt="PuStack Icon"
      style={{ width: "100%" }}
      draggable={false}
    />
  </Icon>
);

export default function ClassroomNestedLectureItem({
  title,
  data,
  parent_id,
  tier,
  isExpanded,
  onClick,
  index,
  tabIndex,
  setVideoSeeking,
  videoSeeking,
}) {
  const [activeLecture, setActiveLecture] =
    useContext(ClassroomContext).activeItem;
  const [, setTabIndex] = useContext(ClassroomContext).tabIndex;
  const [playing, setPlaying] = useContext(ClassroomContext).playing;
  const [classroomNotes] = useContext(ClassroomContext).notesLink;
  const [chapterEngagementMap] =
    useContext(ClassroomContext).chapterEngagementMap;
  const [, setLastEngagement] = useContext(ClassroomContext).lastEngagement;
  const [, setIsSliderOpen] = useContext(PustackProContext).value;
  const [isUserProTier] = useContext(UserContext).tier;
  const [, setLectureTier] = useContext(ClassroomContext).lectureTier;
  const [, setIsNotes] = useContext(ClassroomContext).isNotes;

  const isHeaderCompleted = (lectureId) => {
    const statusData = chapterEngagementMap?.lecture_engagement_status;

    if (statusData !== undefined) {
      return statusData[lectureId]?.is_completed;
    } else return false;
  };

  const isHeaderItemCompleted = (lectureId, subLectureId) => {
    const statusData = chapterEngagementMap?.lecture_engagement_status;
    if (statusData !== undefined) {
      return statusData[lectureId]?.header_item_status[subLectureId]
        ?.is_completed;
    } else return false;
  };

  return (
    <>
      <ListItem
        button
        key={index}
        onClick={onClick}
        style={{
          background:
            parent_id === activeLecture?.parent ? "rgb(50, 50, 50)" : "none",
        }}
      >
        <ListItemIcon className="list__item__icon">
          {isUserProTier ? (
            isHeaderCompleted(parent_id) ? (
              <CheckGreenIcon />
            ) : (
              <CheckIcon />
            )
          ) : tier === "basic" ? (
            isHeaderCompleted(parent_id) ? (
              <CheckGreenIcon />
            ) : (
              <CheckIcon />
            )
          ) : (
            <LockedIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={title} />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {data?.map((item, idx) => (
            <ListItem
              key={idx}
              button
              onClick={() => {
                if (item?.lecture_header_item_id !== activeLecture?.item) {
                  if (isUserProTier || item?.tier === "basic") {
                    setPlaying(false);

                    item?.lecture_header_item_id !== activeLecture?.item &&
                      setVideoSeeking(true);

                    setActiveLecture({
                      parent: parent_id,
                      item: item?.lecture_header_item_id,
                    });

                    if (item?.tier === "pro") {
                      setLectureTier(true);
                    } else {
                      setLectureTier(false);
                    }
                    setLastEngagement({
                      lecture_type: `header_${item?.lecture_header_item_type}`,
                      lecture_header_item_index: idx,
                      lecture_item_index: index,
                      tab_index: tabIndex,
                    });
                    setTabIndex(tabIndex);
                  } else {
                    setIsSliderOpen(true);
                  }
                }
              }}
              disabled={item?.lecture_header_item_id === activeLecture?.item}
              className="nested_list_items"
            >
              <ListItemIcon className="list__item__icon">
                {isUserProTier ? (
                  isHeaderItemCompleted(
                    parent_id,
                    item?.lecture_header_item_id
                  ) ? (
                    <CheckGreenIcon />
                  ) : (
                    <CheckIcon />
                  )
                ) : item?.tier === "basic" ? (
                  isHeaderItemCompleted(
                    parent_id,
                    item?.lecture_header_item_id
                  ) ? (
                    <CheckGreenIcon />
                  ) : (
                    <CheckIcon />
                  )
                ) : (
                  <LockedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={item?.lecture_header_item_name} />
              {item?.lecture_header_item_id === activeLecture?.item ? (
                classroomNotes || "" ? (
                  <button
                    onClick={() =>
                      isUserProTier || item?.tier === "basic"
                        ? setIsNotes(true)
                        : setIsSliderOpen(true)
                    }
                  >
                    <img
                      className="notes__svg"
                      alt="PuStack Notes"
                      src={NotesSVG}
                    />
                  </button>
                ) : (
                  <h5 className="video__seeking__lottie">
                    {/*<Lottie*/}
                    {/*  options={{ animationData: videoPlaying, loop: true }}*/}
                    {/*  isPaused={!playing || videoSeeking}*/}
                    {/*/>*/}
                  </h5>
                )
              ) : (
                ""
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}
