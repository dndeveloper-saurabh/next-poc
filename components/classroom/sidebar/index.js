import React, {useState, useContext, useEffect, useMemo} from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";

import { ClassroomSidebarLectures } from "../../index";
import { ClassroomContext } from "../../../context";

const classroomData = [
  {
    "lecture_items": [
      {
        "tier": "basic",
        "lecture_item_name": "Introduction",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_introduction",
        "lecture_item_type": "video",
        "serial_order": 1,
        "lecture_header_items": []
      },
      {
        "serial_order": 2,
        "lecture_header_items": [
          {
            "serial_order": 1,
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_reflectionoflight_whatmakesthingsvisible",
            "lecture_header_item_name": "What Makes Things Visible",
            "tier": "basic"
          },
          {
            "serial_order": 2,
            "lecture_header_item_name": "Laws of Reflection",
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_reflectionoflight_lawsofreflection"
          },
          {
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_reflectionoflight_planemirrors",
            "lecture_header_item_type": "video",
            "serial_order": 3,
            "lecture_header_item_name": "Plane Mirrors"
          }
        ],
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_reflectionoflight",
        "tier": "basic",
        "lecture_item_type": "header",
        "lecture_item_name": "Reflection of Light"
      },
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors",
        "lecture_item_type": "header",
        "lecture_item_name": "Spherical Mirrors",
        "serial_order": 3,
        "lecture_header_items": [
          {
            "tier": "basic",
            "serial_order": 1,
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_sphericalmirrors",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Overview"
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_propertiesofsphericalmirrors",
            "tier": "basic",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Properties of Spherical Mirrors",
            "serial_order": 2
          },
          {
            "serial_order": 3,
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_concavemirrorimageformation",
            "tier": "basic",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Concave Mirror : Image Formation"
          },
          {
            "serial_order": 4,
            "tier": "basic",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Concave Mirror : Uses",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_concavemirroruses"
          },
          {
            "serial_order": 5,
            "lecture_header_item_name": "Convex Mirror : Image Formation",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_convexmirrorimageformation",
            "tier": "basic",
            "lecture_header_item_type": "video"
          },
          {
            "serial_order": 6,
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_convexmirroruses",
            "lecture_header_item_name": "Convex Mirror : Uses",
            "lecture_header_item_type": "video",
            "tier": "basic"
          },
          {
            "lecture_header_item_type": "video",
            "serial_order": 7,
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_sphericalmirrorssignconvention",
            "tier": "basic",
            "lecture_header_item_name": "Spherical Mirrors : Sign Convention "
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_mirrorformula",
            "lecture_header_item_type": "video",
            "serial_order": 8,
            "lecture_header_item_name": "Mirror Formula",
            "tier": "basic"
          },
          {
            "lecture_header_item_name": "Magnification",
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_magnification",
            "tier": "basic",
            "serial_order": 9
          },
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_example101",
            "serial_order": 10,
            "tier": "basic",
            "lecture_header_item_name": "Example 10.1"
          },
          {
            "lecture_header_item_type": "video",
            "serial_order": 11,
            "lecture_header_item_name": "Example 10.2",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_sphericalmirrors_example102",
            "tier": "basic"
          }
        ],
        "tier": "basic"
      },
      {
        "lecture_item_type": "header",
        "serial_order": 4,
        "lecture_header_items": [
          {
            "tier": "basic",
            "lecture_header_item_type": "video",
            "serial_order": 1,
            "lecture_header_item_name": "Overview",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_refractionoflight"
          },
          {
            "tier": "basic",
            "lecture_header_item_type": "video",
            "serial_order": 2,
            "lecture_header_item_name": "Refraction Through Glass Slab",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_refractionthroughglassslab"
          },
          {
            "serial_order": 3,
            "lecture_header_item_name": "Laws of Refraction",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_lawsofrefraction",
            "tier": "basic",
            "lecture_header_item_type": "video"
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_therefractiveindex",
            "lecture_header_item_type": "video",
            "serial_order": 4,
            "lecture_header_item_name": "The Refractive Index",
            "tier": "basic"
          },
          {
            "serial_order": 5,
            "lecture_header_item_name": "Refraction by Spherical Lenses",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_refractionbysphericallenses",
            "lecture_header_item_type": "video",
            "tier": "basic"
          },
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_propertiesofsphericallenses",
            "lecture_header_item_name": "Properties of Spherical Lenses",
            "tier": "basic",
            "serial_order": 6
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_convexlensimageformation",
            "tier": "basic",
            "lecture_header_item_type": "video",
            "serial_order": 7,
            "lecture_header_item_name": "Convex Lens : Image Formation"
          },
          {
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_convexlensuses",
            "lecture_header_item_name": "Convex Lens : Uses",
            "serial_order": 8
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_concavelensimageformationuses",
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_name": "Concave Lens : Image Formation & Uses",
            "serial_order": 9
          },
          {
            "tier": "basic",
            "lecture_header_item_name": "Sign Convention for Spherical Lenses",
            "serial_order": 10,
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_signconventionforsphericallenses"
          },
          {
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_name": "Lens Formula",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_lensformula",
            "serial_order": 11
          },
          {
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_magnification",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Magnification",
            "serial_order": 12
          },
          {
            "lecture_header_item_name": "Example 10.3",
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_example103",
            "serial_order": 13
          },
          {
            "lecture_header_item_type": "video",
            "tier": "basic",
            "lecture_header_item_name": "Example 10.4",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_example104",
            "serial_order": 14
          },
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Power of Lens",
            "tier": "basic",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_poweroflens",
            "serial_order": 15
          }
        ],
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight",
        "tier": "basic",
        "lecture_item_name": "Refraction of Light"
      },
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter_revision",
        "lecture_header_items": [],
        "lecture_item_type": "video",
        "lecture_item_name": "Revision",
        "serial_order": 5,
        "tier": "pro"
      }
    ],
    "serial_order": 1,
    "tab_image_url": null,
    "tab_name": "Chapter",
    "tab_id": "class_10_learn_science_physics_lightreflectionrefraction_chapter",
    "generic_name": "chapter"
  },
  {
    "generic_name": "in-chapter exercises",
    "serial_order": 2,
    "tab_name": "In-Chapter Exercises",
    "tab_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises",
    "tab_image_url": null,
    "lecture_items": [
      {
        "serial_order": 1,
        "lecture_item_name": "Exercise 1",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise1",
        "tier": "pro",
        "lecture_header_items": [
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise1_question1",
            "serial_order": 1,
            "tier": "pro",
            "lecture_header_item_name": "Question 1",
            "lecture_header_item_type": "video"
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise1_question2",
            "serial_order": 2,
            "lecture_header_item_name": "Question 2",
            "lecture_header_item_type": "video",
            "tier": "pro"
          },
          {
            "lecture_header_item_type": "video",
            "serial_order": 3,
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise1_question3",
            "lecture_header_item_name": "Question 3",
            "tier": "pro"
          },
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise1_question4",
            "tier": "pro",
            "serial_order": 4,
            "lecture_header_item_name": "Question 4"
          }
        ],
        "lecture_item_type": "header"
      },
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise2",
        "lecture_item_name": "Exercise 2",
        "lecture_header_items": [
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise2_question1",
            "lecture_header_item_name": "Question 1",
            "tier": "pro",
            "lecture_header_item_type": "video",
            "serial_order": 1
          },
          {
            "lecture_header_item_name": "Question 2",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise2_question2",
            "tier": "pro",
            "serial_order": 2,
            "lecture_header_item_type": "video"
          }
        ],
        "lecture_item_type": "header",
        "serial_order": 2,
        "tier": "pro"
      },
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3",
        "lecture_header_items": [
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3_question1",
            "lecture_header_item_name": "Question 1",
            "tier": "pro",
            "serial_order": 1
          },
          {
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Question 2 ",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3_question2",
            "tier": "pro",
            "serial_order": 2
          },
          {
            "lecture_header_item_name": "Question 3",
            "serial_order": 3,
            "tier": "pro",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3_question3",
            "lecture_header_item_type": "video"
          },
          {
            "serial_order": 4,
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3_question4",
            "tier": "pro",
            "lecture_header_item_name": "Question 4"
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise3_question5",
            "serial_order": 5,
            "tier": "pro",
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Question 5"
          }
        ],
        "serial_order": 3,
        "lecture_item_type": "header",
        "tier": "basic",
        "lecture_item_name": "Exercise 3"
      },
      {
        "lecture_header_items": [
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise4_question1",
            "serial_order": 1,
            "lecture_header_item_name": "Question 1",
            "lecture_header_item_type": "video",
            "tier": "pro"
          },
          {
            "lecture_header_item_name": "Question 2",
            "tier": "pro",
            "lecture_header_item_type": "video",
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise4_question2",
            "serial_order": 2
          },
          {
            "lecture_header_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise4_question3",
            "serial_order": 3,
            "lecture_header_item_type": "video",
            "lecture_header_item_name": "Question 3",
            "tier": "pro"
          }
        ],
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_inchapterexercises_exercise4",
        "serial_order": 4,
        "lecture_item_type": "header",
        "tier": "pro",
        "lecture_item_name": "Exercise 4"
      }
    ]
  },
  {
    "tab_image_url": null,
    "lecture_items": [
      {
        "serial_order": 1,
        "lecture_item_type": "video",
        "tier": "pro",
        "lecture_item_name": "Question 1",
        "lecture_header_items": [],
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question1"
      },
      {
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question2",
        "lecture_header_items": [],
        "serial_order": 2,
        "tier": "pro",
        "lecture_item_name": "Question 2"
      },
      {
        "lecture_item_type": "video",
        "tier": "pro",
        "lecture_item_name": "Question 3",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question3",
        "lecture_header_items": [],
        "serial_order": 3
      },
      {
        "serial_order": 4,
        "lecture_item_name": "Question 4",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question4",
        "lecture_item_type": "video",
        "tier": "pro",
        "lecture_header_items": []
      },
      {
        "lecture_item_name": "Question 5",
        "tier": "pro",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question5",
        "lecture_header_items": [],
        "serial_order": 5,
        "lecture_item_type": "video"
      },
      {
        "tier": "pro",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question6",
        "lecture_header_items": [],
        "serial_order": 6,
        "lecture_item_type": "video",
        "lecture_item_name": "Question 6"
      },
      {
        "tier": "pro",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question7",
        "lecture_item_name": "Question 7",
        "lecture_header_items": [],
        "lecture_item_type": "video",
        "serial_order": 7
      },
      {
        "tier": "pro",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question8",
        "serial_order": 8,
        "lecture_header_items": [],
        "lecture_item_type": "video",
        "lecture_item_name": "Question 8"
      },
      {
        "lecture_item_type": "video",
        "lecture_header_items": [],
        "lecture_item_name": "Question 9",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question9",
        "serial_order": 9,
        "tier": "pro"
      },
      {
        "tier": "pro",
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question10",
        "serial_order": 10,
        "lecture_header_items": [],
        "lecture_item_name": "Question 10"
      },
      {
        "tier": "pro",
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question11",
        "lecture_header_items": [],
        "serial_order": 11,
        "lecture_item_name": "Question 11"
      },
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question12",
        "tier": "pro",
        "lecture_item_name": "Question 12",
        "lecture_item_type": "video",
        "lecture_header_items": [],
        "serial_order": 12
      },
      {
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question13",
        "lecture_header_items": [],
        "tier": "pro",
        "serial_order": 13,
        "lecture_item_name": "Question 13"
      },
      {
        "lecture_item_name": "Question 14",
        "tier": "pro",
        "lecture_item_type": "video",
        "lecture_header_items": [],
        "serial_order": 14,
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question14"
      },
      {
        "lecture_item_name": "Question 15",
        "lecture_item_type": "video",
        "serial_order": 15,
        "tier": "pro",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question15",
        "lecture_header_items": []
      },
      {
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question16",
        "lecture_header_items": [],
        "tier": "pro",
        "serial_order": 16,
        "lecture_item_name": "Question 16"
      },
      {
        "lecture_item_name": "Question 17",
        "tier": "pro",
        "serial_order": 17,
        "lecture_header_items": [],
        "lecture_item_type": "video",
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise_question17"
      }
    ],
    "serial_order": 3,
    "tab_name": "Back Exercise",
    "generic_name": "back exercise",
    "tab_id": "class_10_learn_science_physics_lightreflectionrefraction_backexercise"
  },
  {
    "generic_name": "quick review",
    "tab_id": "class_10_learn_science_physics_lightreflectionrefraction_quickreview",
    "lecture_items": [
      {
        "lecture_item_id": "class_10_learn_science_physics_lightreflectionrefraction_quickreview_revision",
        "lecture_item_name": "Revision",
        "serial_order": 1,
        "lecture_item_type": "video",
        "tier": "pro",
        "lecture_header_items": []
      }
    ],
    "tab_image_url": null,
    "serial_order": 4,
    "tab_name": "Quick Review"
  },
  {
    "tab_image_url": "",
    "tab_id": "live-sessions",
    "lecture_items": [],
    "serial_order": 5,
    "tab_name": "Live-Sessions"
  }
]

export default function ClassroomSidebar({
  chapterID,
  isLoggedOutUser,
  videoSeeking,
  setVideoSeeking,
  updateUserLastAndLatestEngagement,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabId, setActiveTabId] = useContext(ClassroomContext).tabId;
  const [classroomTabsData] = useContext(ClassroomContext).tabsData;
  const [activeTabIndex] = useContext(ClassroomContext).activeTabIndex;

  const handleTabChange = (_, value) => setActiveTab(value);

  const data = useMemo(() => {
    if(classroomTabsData) return classroomTabsData;
    return classroomData;
  }, [classroomTabsData]);

  useEffect(() => {
    const index = data.findIndex(c => c.tab_id === activeTabId);
    setActiveTab(index < 0 ? 0 : index);
  }, [data, activeTabId]);

  return (
    <div className="classroom__sidebar" data-nosnippet="">
      <div className="classroom__tabs dark" style={{filter: !isLoggedOutUser ? 'blur(0px)' : 'blur(4px)', pointerEvents: !isLoggedOutUser ? 'all' : 'none'}}>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          scrollButtons={"auto"}
          variant="scrollable"
        >
          {data !== null &&
            data?.map((tab, index) => (
              <Tab
                key={index}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                style={{ minWidth: 42 }}
                label={tab?.tab_name}
                onClick={() => {
                  setActiveTabId(tab?.tab_id);
                }}
              />
            ))}
        </Tabs>
      </div>

      <div className="classroom__tabs__wrapper" style={{filter: !isLoggedOutUser ? 'blur(0px)' : 'blur(4px)', pointerEvents: !isLoggedOutUser ? 'all' : 'none'}}>
        {data !== null && (
          <SwipeableViews
            axis={"x"}
            index={activeTab}
            onChangeIndex={(e) => setActiveTab(e)}
            scrolling={"false"}
            containerStyle={{ background: "#161616" }}
            style={{ background: "#161616" }}
            className="swipeable-container"
            slideStyle={{ background: "#161616" }}
          >
            {data?.map((tab, index) => {
              if (tab?.lecture_items !== null)
                return (
                  <div className="classroom__sidebar__tab" key={index}>
                    <ClassroomSidebarLectures
                      data={tab?.lecture_items.sort(
                        (a, b) => a.serial_order > b.serial_order
                      )}
                      chapterID={chapterID}
                      tabIndex={index}
                      updateUserLastAndLatestEngagement={
                        updateUserLastAndLatestEngagement
                      }
                      setVideoSeeking={setVideoSeeking}
                      videoSeeking={videoSeeking}
                    />
                  </div>
                );
              return null;
            })}
          </SwipeableViews>
        )}
      </div>
    </div>
  );
}
