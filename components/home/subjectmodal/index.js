import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
// import { Link, useLocation } from "react-router-dom";
import Link from 'next/link';
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Drawer from "@material-ui/core/Drawer";
import { useMediaQuery } from "react-responsive";
import { ArrowBackIos } from "@material-ui/icons";
import ChapterListCard from "../chapterlistcard";
import { logoDark, logo } from "../../../public/assets";
import {
  UserContext,
  SubjectModalContext,
  ThemeContext,
} from "../../../context";

const getCompletionStatusByChapter = async ({
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

    const res = await require('../../../firebase-config').db
      .collection("user_engagement")
      .doc(grade)
      .collection(userId)
      .doc(chapterPath)
      .get()
      .then((doc) => doc.data()?.completion_status_by_chapter);

    if (typeof res === "undefined") return null;
    return [res[chapter_id], res];
  }

  return null;
};

export default function SubjectModal({ tabSelected }) {
  const subNames = ["literature", "grammar"];

  const [user] = useContext(UserContext).user;
  const [isDark] = useContext(ThemeContext).theme;
  const [isOpen, setIsOpen] = useContext(SubjectModalContext).isOpen;
  const [inBrowser, setInBrowser] = useState(false);

  const [subjectCode, setSubjectCode] =
    useContext(SubjectModalContext).subjectCode;
  const [tabData] = useContext(SubjectModalContext).tabData;
  const [subjectName] = useContext(SubjectModalContext).subjectName;
  const [activeTab, setActiveTab] = useContext(SubjectModalContext).activeTab;
  const [chaptersData, setChaptersData] = useContext(SubjectModalContext).data;
  const [activeFlag, setActiveFlag] = useContext(SubjectModalContext).activeFlag;

  const [isVisible, setIsVisible] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [visibilityWrapper, setVisibilityWrapper] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(false);

  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
  const visibility = useRef();

  const subject = chaptersData?.code.replace(/ /g, "");
  const chapter_id = `${user?.grade}_learn_${subjectCode}_${subject}_chapter`;

  const englishCodes = ["englishliterature", "englishbasics", "englishgrammar"];

  const tipsPath = (code, tip_id) => {
    if (englishCodes.includes(code)) {
      return `/tips?subject=${user?.grade}_tips_english&tip=${tip_id}`;
    }
    return `/tips?subject=${user?.grade}_tips_${code}&tip=${tip_id}`;
  };

  const practicePath = (code, exam_id) => {
    if (englishCodes.includes(code)) {
      return `/practice?subject=${user?.grade}_practice_english&practice=${exam_id}`;
    }

    return `/practice?subject=${user?.grade}_practice_${code}&practice=${exam_id}`;
  };

  const handleTabChange = (_, value) => {
    setActiveTab(value);
  };

  const getCompletionStatusByChapterFn = async () => {
    setCompletionStatus(
      await getCompletionStatusByChapter({
        userId: user?.uid,
        grade: user?.grade,
        chapter_id,
      })
    );
  };

  useEffect(() => {
    if (chaptersData) getCompletionStatusByChapterFn();
  }, [chaptersData]);

  useEffect(() => {
    if (activeFlag) {
      if (subNames.includes(subjectName)) {
        if (tabSelected === 0) {
          setActiveTab(0);
        } else {
          setActiveTab(chaptersData?.subjects.length - 1 + tabSelected);
        }
      } else {
        setActiveTab(tabSelected);
      }
    }
  }, [tabSelected, subjectName, chaptersData, activeFlag]);

  useEffect(() => {
    if (chaptersData !== null) setIsOpen(true);
    else setIsOpen(false);
  }, [chaptersData]);

  useEffect(() => {
    setInBrowser(true);
  }, [])

  const visibilityRef = useCallback(function (node) {
    if (node !== null) {
      if (visibility.current) visibility.current.disconnect();

      visibility.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
      if (node) visibility.current.observe(node);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisibilityWrapper(true), 400);
    } else setTimeout(() => setVisibilityWrapper(false), 400);
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);

    setTimeout(() => {
      setVisibilityWrapper(false);

      setChaptersData(null);
      setSubjectCode(null);
      setIsVisible(true);
      setActiveTab(tabSelected);
      setActiveFlag(true);
    }, 400);
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={closeModal}
      ModalProps={{ keepMounted: true }}
      anchor={"bottom"}
      className={
        isDark ? "subject__modal__drawer dark" : "subject__modal__drawer"
      }
      transitionDuration={400}
      onBackdropClick={closeModal}
    >
      <div className="subject__modal__wrapper">
        {isSmallScreen && visibilityWrapper && (
          <Link to="/">
            <ArrowBackIos
              className={`dismiss-modal-2 ${!isVisible && subjectName}`}
              onClick={closeModal}
            />
          </Link>
        )}
        {!isVisible && visibilityWrapper && isSmallScreen && (
          <div
            id="chapterHeader"
            className="subject__head"
            style={{ opacity: !isVisible && isSmallScreen ? 1 : 0 }}
            key={isVisible}
          >
            <p className={subjectName}>{chaptersData?.name}</p>
          </div>
        )}

        <div className="close__subject__modal" onClick={closeModal} />
        {inBrowser && navigator && navigator.userAgent.includes("Chrome") && (
          <div className="subject__modal__back" />
        )}
        <div className="subject__modal">
          <div className="subject__modal__content">
            <div className="subject__thumbnail">
              <div className={`hero__image__wrapper ${subjectName}`}>
                <img
                  src={chaptersData?.mainThumb}
                  className="hero__image"
                  draggable={false}
                  alt="hero"
                />
              </div>
              <div ref={visibilityRef} className="header__visibility"></div>

              <div className="subject__overlay">
                <div className="subject__slantbox"></div>
                <div className="subject__information">
                  <div className="subject__title">
                    <h2 className={subjectName}>{chaptersData?.name}</h2>
                    <div
                      className={
                        descriptionLength
                          ? "subject__description"
                          : "subject__description hide"
                      }
                      onClick={() => setDescriptionLength(!descriptionLength)}
                    >
                      <p>
                        {chaptersData?.description?.slice(
                          0,
                          descriptionLength
                            ? chaptersData?.description?.length
                            : 120
                        )}
                      </p>
                      {chaptersData?.description?.length > 120 &&
                        !descriptionLength && <span>[+ More]</span>}
                    </div>
                  </div>
                </div>
              </div>

              {!isSmallScreen && (
                <i className="fas fa-times icon-dismiss" onClick={closeModal} />
              )}
            </div>

            {subNames.includes(subjectName) ? (
              <div className="subject__content__main">
                <div className={`subject__content__header ${subjectName} lit`}>
                  <Tabs
                    value={activeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                    scrollButtons={"auto"}
                    variant="scrollable"
                  >
                    {tabData?.map((tab, index) => (
                      <Tab
                        key={index}
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                        style={{ minWidth: 42 }}
                        label={tab}
                        onClick={() => {
                          setActiveTab(index);
                          setActiveFlag(false);
                        }}
                      />
                    ))}
                  </Tabs>
                </div>

                <div className="subject__chapters__list__wrap">
                  <SwipeableViews
                    axis={"x"}
                    index={activeTab}
                    onChangeIndex={(e) => setActiveTab(e)}
                    scrolling={"false"}
                  >
                    {chaptersData?.subjects?.map((subject, index) => (
                      <div>
                        {activeTab === index &&
                          subject?.chapters
                            ?.sort((a, b) => a.serial_order - b.serial_order)
                            ?.map((data, index) => (
                              <ChapterListCard
                                serial={index}
                                key={index}
                                chapter_id={data?.chapter_id}
                                illustration_art={data?.illustration_art}
                                chapter_name={data?.chapter_name}
                                hex_color={data?.hex_color}
                                lecture_item_count={data?.lecture_item_count}
                                description={data?.description}
                                code={chaptersData?.code}
                                completionStatus={completionStatus}
                                type={
                                  data?.lecture_item_count > 1
                                    ? "lectures"
                                    : "lecture"
                                }
                              />
                            ))}
                        {subject?.chapters?.length > 5 && (
                          <div className="powered__by">
                            <img
                              src={isDark ? logoDark : logo}
                              className="pustack__powered__logo"
                              alt="logo"
                            />
                            <h3>Powered by PuStack Education</h3>
                          </div>
                        )}
                      </div>
                    ))}
                    <div>
                      {activeTab === chaptersData?.subjects.length &&
                        chaptersData?.tips?.map((data, index) => (
                          <ChapterListCard
                            serial={index}
                            key={index}
                            chapter_id={data?.tip_id}
                            illustration_art={data?.banner_image}
                            chapter_name={data?.name}
                            hex_color={"#d3d3d333"}
                            lecture_item_count={null}
                            description={data?.description}
                            code={chaptersData?.code}
                            completionStatus={null}
                            type={"tips"}
                            path={() =>
                              tipsPath(chaptersData?.subjectCode, data?.tip_id)
                            }
                          />
                        ))}
                      {activeTab === chaptersData?.subjects.length &&
                        chaptersData?.tips?.length > 5 && (
                          <div className="powered__by">
                            <img
                              src={isDark ? logoDark : logo}
                              className="pustack__powered__logo"
                              alt="logo"
                            />
                            <h3>Powered by PuStack Education</h3>
                          </div>
                        )}
                    </div>
                    <div>
                      {activeTab === chaptersData?.subjects.length + 1 &&
                        chaptersData?.practice?.map((data, index) => (
                          <ChapterListCard
                            serial={index}
                            key={index}
                            chapter_id={data?.exam_id}
                            illustration_art={data?.main_thumbnail_url}
                            chapter_name={data?.name}
                            hex_color={"#d3d3d333"}
                            lecture_item_count={data?.exam_item_count}
                            description={data?.description}
                            code={chaptersData?.code}
                            completionStatus={null}
                            type={
                              data?.exam_item_count > 1
                                ? "questions"
                                : "question"
                            }
                            path={() =>
                              practicePath(
                                chaptersData?.subjectCode,
                                data?.exam_id
                              )
                            }
                          />
                        ))}
                      {chaptersData?.practice?.length > 5 && (
                        <div className="powered__by">
                          <img
                            src={isDark ? logoDark : logo}
                            className="pustack__powered__logo"
                            alt="logo"
                          />
                          <h3>Powered by PuStack Education</h3>
                        </div>
                      )}
                    </div>
                  </SwipeableViews>
                </div>
              </div>
            ) : (
              <div className="subject__content__main">
                <div className={`subject__content__header ${subjectName}`}>
                  <Tabs
                    value={activeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                    scrollButtons={"auto"}
                    variant="scrollable"
                  >
                    {["Learn", "Tips", "Practice"]?.map((tab, index) => (
                      <Tab
                        key={index}
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                        style={{ minWidth: 42 }}
                        label={tab}
                        onClick={() => {
                          setActiveTab(index);
                          setActiveFlag(false);
                        }}
                      />
                    ))}
                  </Tabs>
                </div>

                <div className="subject__chapters__list__wrap">
                  <SwipeableViews
                    axis={"x"}
                    index={activeTab}
                    onChangeIndex={(e) => setActiveTab(e)}
                    scrolling={"false"}
                  >
                    <div>
                      {activeTab === 0 &&
                        chaptersData?.chapters
                          ?.sort((a, b) => a.serial_order - b.serial_order)
                          ?.map((data, index) => (
                            <ChapterListCard
                              serial={index}
                              key={index}
                              chapter_id={data?.chapter_id}
                              illustration_art={data?.illustration_art}
                              chapter_name={data?.chapter_name}
                              hex_color={data?.hex_color}
                              lecture_item_count={data?.lecture_item_count}
                              description={data?.description}
                              code={chaptersData?.code}
                              completionStatus={completionStatus}
                              type={
                                data?.lecture_item_count > 1
                                  ? "lectures"
                                  : "lecture"
                              }
                            />
                          ))}
                      {chaptersData?.chapters?.length > 5 && (
                        <div className="powered__by">
                          <img
                            src={isDark ? logoDark : logo}
                            className="pustack__powered__logo"
                            alt="logo"
                          />
                          <h3>Powered by PuStack Education</h3>
                        </div>
                      )}
                    </div>
                    <div>
                      {activeTab === 1 &&
                        chaptersData?.tips?.map((data, index) => (
                          <ChapterListCard
                            serial={index}
                            key={index}
                            chapter_id={data?.tip_id}
                            illustration_art={data?.banner_image}
                            chapter_name={data?.name}
                            hex_color={"#d3d3d333"}
                            lecture_item_count={null}
                            description={data?.description}
                            code={chaptersData?.code}
                            completionStatus={null}
                            type={"tips"}
                            path={() =>
                              tipsPath(chaptersData?.subjectCode, data?.tip_id)
                            }
                          />
                        ))}
                      {chaptersData?.tips?.length > 5 && (
                        <div className="powered__by">
                          <img
                            src={isDark ? logoDark : logo}
                            className="pustack__powered__logo"
                            alt="logo"
                          />
                          <h3>Powered by PuStack Education</h3>
                        </div>
                      )}
                    </div>
                    <div>
                      {activeTab === 2 &&
                        chaptersData?.practice?.map((data, index) => (
                          <ChapterListCard
                            serial={index}
                            key={index}
                            chapter_id={data?.exam_id}
                            illustration_art={data?.main_thumbnail_url}
                            chapter_name={data?.name}
                            hex_color={"#d3d3d333"}
                            lecture_item_count={data?.exam_item_count}
                            description={data?.description}
                            code={chaptersData?.code}
                            completionStatus={null}
                            type={
                              data?.exam_item_count > 1
                                ? "questions"
                                : "question"
                            }
                            path={() =>
                              practicePath(
                                chaptersData?.subjectCode,
                                data?.exam_id
                              )
                            }
                          />
                        ))}
                      {chaptersData?.practice?.length > 5 && (
                        <div className="powered__by">
                          <img
                            src={isDark ? logoDark : logo}
                            className="pustack__powered__logo"
                            alt="logo"
                          />
                          <h3>Powered by PuStack Education</h3>
                        </div>
                      )}
                    </div>
                  </SwipeableViews>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
