import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import Link from 'next/link';
import CarouselCard from "../continuewatchingcarousel/card";
import {
  UserContext,
  ThemeContext,
  SubjectModalContext,
} from "../../../context";

const getContinueWatchingList = ({ grade, userId }) => {
  const doc = require('../../../firebase-config').db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc("latest_engagement");

  return doc;
};

const getDummyArray = (length = 5, fill = '') => {
  return Array(length).fill('').map((c, ind) => ({id: ind, label: 'dummy_array_value-' + ind}))
}

const ContinueWatchingSidebar = () => {
  const [lastEngagement, setLastEngagement] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isVisible2, setIsVisible2] = useState(false);
  const [trendingVideos, setTrendingVideos] = useState([
    {
      category_id: "class_9_learn_science",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_science_physics_motion",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_science%2Fsubject%2Fclass_9_learn_science_physics%2Fchapter%2Fclass_9_learn_science_physics_motion%2Fmain_image.jpg?alt=media&token=e494252f-448d-45c6-8e54-7e6898d7f109",
      chapter_name: "Motion",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_science_physics",
      total_lecture_count: 53,
    },

    {
      category_id: "class_9_learn_science",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_science_physics_sound",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_science%2Fsubject%2Fclass_9_learn_science_physics%2Fchapter%2Fclass_9_learn_science_physics_sound%2Fmain_image.jpg?alt=media&token=6844dd61-8409-4560-8314-b34dbf5e1b6f",
      chapter_name: "Sound",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_science_physics",
      total_lecture_count: 63,
    },
    {
      category_id: "class_9_learn_socialscience",
      chapter_hex_color: "#bbd2e9",
      chapter_id:
        "class_9_learn_socialscience_history_socialismineuropetherussianrevolution",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_socialscience%2Fsubject%2Fclass_9_learn_socialscience_history%2Fchapter%2Fclass_9_learn_socialscience_history_socialismineuropetherussianrevolution%2Fmain_image.jpg?alt=media&token=c1ad84dc-185f-4da1-aa0e-3734d64406ba",
      chapter_name: "Socialism in Europe & the Russian Revolution",

      completed_lecture_count: 0,
      subject_id: "class_9_learn_socialscience_history",
      total_lecture_count: 14,
    },
    {
      category_id: "class_9_learn_maths",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_maths_areasofparallelogramtriangles",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_maths%2Fsubject%2Fclass_9_learn_maths%2Fchapter%2Fclass_9_learn_maths_areasofparallelogramtriangles%2Fmain_image.jpg?alt=media&token=f27ca96e-26e4-4e14-b19c-e2aa051eabaf",
      chapter_name: "Areas of Parallelograms & Triangles",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_maths",
      total_lecture_count: 44,
    },

    {
      category_id: "class_9_learn_socialscience",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_socialscience_geography_indiasizelocation",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_socialscience%2Fsubject%2Fclass_9_learn_socialscience_geography%2Fchapter%2Fclass_9_learn_socialscience_geography_indiasizelocation%2Fmain_image.jpg?alt=media&token=43ec6d1a-058b-4110-985f-90db64ea15cb",
      chapter_name: "India - Size & Location",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_socialscience_geography",
      total_lecture_count: 11,
    },

    {
      category_id: "class_9_learn_socialscience",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_socialscience_economics_peopleasresource",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_socialscience%2Fsubject%2Fclass_9_learn_socialscience_economics%2Fchapter%2Fclass_9_learn_socialscience_economics_peopleasresource%2Fmain_image.jpg?alt=media&token=7440dfd1-e0ae-4f6b-9006-28adf5d46f8c",
      chapter_name: "People as Resource",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_socialscience_economics",
      total_lecture_count: 22,
    },

    {
      category_id: "class_9_learn_maths",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_maths_linearequationsintwovariables",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_maths%2Fsubject%2Fclass_9_learn_maths%2Fchapter%2Fclass_9_learn_maths_linearequationsintwovariables%2Fmain_image.jpg?alt=media&token=4aa3f9aa-55bd-439a-8b9f-a51a33598fc0",
      chapter_name: "Linear Equations in Two Variables",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_maths",
      total_lecture_count: 34,
    },

    {
      category_id: "class_9_learn_englishgrammar",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_englishgrammar_functionalgrammar_sentences",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_englishgrammar%2Fsubject%2Fclass_9_learn_englishgrammar_functionalgrammar%2Fchapter%2Fclass_9_learn_englishgrammar_functionalgrammar_sentences%2Fmain_image.jpg?alt=media&token=53ab5dad-2bcd-474e-a5dc-2344f49ac937",
      chapter_name: "Sentences",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_englishgrammar_functionalgrammar",
      total_lecture_count: 11,
    },

    {
      category_id: "class_9_learn_maths",
      chapter_hex_color: "#bbd2e9",
      chapter_id: "class_9_learn_maths_linesandangles",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_9%2Fscope%2Fclass_9_learn%2Fcategory%2Fclass_9_learn_maths%2Fsubject%2Fclass_9_learn_maths%2Fchapter%2Fclass_9_learn_maths_linesandangles%2Fmain_image.jpg?alt=media&token=e498160a-7e93-41b6-8616-f3583487f493",
      chapter_name: "Lines and Angles",
      completed_lecture_count: 0,
      subject_id: "class_9_learn_maths",
      total_lecture_count: 47,
    },
  ]);

  const [trendingVideos2, setTrendingVideos2] = useState([
    {
      category_id: "class_10_learn_science",
      chapter_hex_color: "#BBEFAC",
      chapter_id:
        "class_10_learn_science_chemistry_periodicclassificationofelements",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_10%2Fscope%2Fclass_10_learn%2Fcategory%2Fclass_10_learn_science%2Fsubject%2Fclass_10_learn_science_chemistry%2Fchapter%2Fclass_10_learn_science_chemistry_periodicclassificationofelements%2Fmain_image.jpg?alt=media&token=fad0a991-75e6-4131-81ff-e390192b4415",
      chapter_name: "Periodic Classification of Elements",
      completed_lecture_count: 0,
      subject_id: "class_10_learn_science_chemistry",
      total_lecture_count: 36,
    },
    {
      category_id: "class_10_learn_science",
      chapter_hex_color: "#FFBFA7",
      chapter_id: "class_10_learn_science_physics_electricity",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_10%2Fscope%2Fclass_10_learn%2Fcategory%2Fclass_10_learn_science%2Fsubject%2Fclass_10_learn_science_physics%2Fchapter%2Fclass_10_learn_science_physics_electricity%2Fmain_image.jpg?alt=media&token=d499f414-6530-48fc-adc7-0292b4ee3daf",
      chapter_name: "Electricity",
      completed_lecture_count: 0,
      subject_id: "class_10_learn_science_physics",
      total_lecture_count: 71,
    },
    {
      category_id: "class_10_learn_englishgrammar",
      chapter_hex_color: "#FFDCE4",
      chapter_id:
        "class_10_learn_englishgrammar_basicgrammar_subjectverbagreement",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_10%2Fscope%2Fclass_10_learn%2Fcategory%2Fclass_10_learn_englishgrammar%2Fsubject%2Fclass_10_learn_englishgrammar_basicgrammar%2Fchapter%2Fclass_10_learn_englishgrammar_basicgrammar_subjectverbagreement%2Fmain_image.jpg?alt=media&token=b95a813b-d1bb-4ce4-8643-e1642aa78256",
      chapter_name: "Subject Verb Agreement",
      completed_lecture_count: 0,
      subject_id: "class_10_learn_englishgrammar_basicgrammar",
      total_lecture_count: 15,
    },
    {
      category_id: "class_10_learn_mathematics",
      chapter_hex_color: "#f7c483",
      chapter_id: "class_10_learn_mathematics_realnumbers",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_10%2Fscope%2Fclass_10_learn%2Fcategory%2Fclass_10_learn_mathematics%2Fsubject%2Fclass_10_learn_mathematics%2Fchapter%2Fclass_10_learn_mathematics_realnumbers%2Fmain_image.jpg?alt=media&token=01941963-174f-4ae4-87dd-1e92425d19dc",
      chapter_name: "Real Numbers",
      completed_lecture_count: 0,
      subject_id: "class_10_learn_mathematics_realnumbers",
      total_lecture_count: 46,
    },
    {
      category_id: "class_10_learn_science",
      chapter_hex_color: "#C7E1F9",
      chapter_id: "class_10_learn_science_physics_lightreflectionrefraction",
      chapter_illustration_art:
        "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/cms_data%2Fclass_10%2Fscope%2Fclass_10_learn%2Fcategory%2Fclass_10_learn_science%2Fsubject%2Fclass_10_learn_science_physics%2Fchapter%2Fclass_10_learn_science_physics_lightreflectionrefraction%2Fmain_image.jpg?alt=media&token=52cdfb8e-869c-468a-86ad-da3eca9cecbd",
      chapter_name: "Light - Reflection & Refraction",
      completed_lecture_count: 0,
      subject_id: "class_10_learn_science_physics",
      total_lecture_count: 63,
    },
  ]);

  const [user] = useContext(UserContext).user;
  const [isDark] = useContext(ThemeContext).theme;
  const [isSubjectModalOpen] = useContext(SubjectModalContext).isOpen;

  let topRef = useRef();
  let bottomRef = useRef();

  const topVisibilityRef = useCallback(
    function (node) {
      if (node !== null && lastEngagement) {
        if (topRef.current) topRef.current.disconnect();

        topRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
        if (node) topRef.current.observe(node);
      }
    },
    [lastEngagement]
  );

  const bottomVisibilityRef = useCallback(
    function (node) {
      if (node !== null && lastEngagement) {
        if (bottomRef.current) bottomRef.current.disconnect();

        bottomRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible2(true);
          } else {
            setIsVisible2(false);
          }
        });
        if (node) bottomRef.current.observe(node);
      }
    },
    [lastEngagement]
  );

  useEffect(() => {
    if (user?.grade || "") {
      let unsubscribe = getUserLatestEngagementFn();
      return () => unsubscribe();
    }
  }, [user?.grade]);

  const getUserLatestEngagementFn = () => {
    const res = getContinueWatchingList({
      grade: user?.grade,
      userId: user?.uid,
    });

    return res.onSnapshot((snapshot) => {
      if (snapshot.data() || "") {
        setLastEngagement(snapshot.data()?.chapter_list);
      } else {
        setLastEngagement([]);
      }
    });
  };

  useEffect(() => {
    if (lastEngagement) {
      const chapters = [];
      lastEngagement.map((item) => chapters.push(item?.chapter_id));

      const _data =
        user?.grade === "class_9"
          ? trendingVideos.filter((item) => !chapters.includes(item.chapter_id))
          : trendingVideos2.filter(
              (item) => !chapters.includes(item.chapter_id)
            );

      user?.grade === "class_9"
        ? setTrendingVideos(_data)
        : setTrendingVideos2(_data);
    }
  }, [lastEngagement, user?.grade]);

  const getSubjectName = (subjectId) => {
    return typeof subjectId.split("_")[4] === "undefined"
      ? subjectId.split("_")[3]
      : subjectId.split("_")[4];
  };

  const loadingData = {
    chapter_id: Math.random() * 100,
    chapter_hex_color: "#bbd2e9",
    category_id: "learn",
    subject_id: "maths_science_english",
    chapter_illustration_art: "",
    chapter_name: "Loading",
    total_lecture_count: 0,
  };

  return (
    <div className={isDark ? "cwc-sidebar dark" : "cwc-sidebar"}>
      {<div ref={topVisibilityRef}></div>}
      <div className="cwc-head-wrapper">
        <h4
          className="cwc-head"
          style={{
            animationPlayState: isSubjectModalOpen ? "paused" : "running",
          }}
        >
          Continue Watching
        </h4>
      </div>
      <div className="cwc-sidebar-inner">
        {!isVisible && <div className="top-gradient"></div>}
        {!isVisible2 && <div className="bottom-gradient"></div>}

        {lastEngagement
          ? lastEngagement?.map((data) => (
              <Link
                href={`/auth_classroom?subject=${getSubjectName(
                  data?.subject_id
                )}&chapter=${data?.chapter_id}`}
                key={data?.chapter_id}
              >
                <div className="cwc-card-wrapper">
                  <CarouselCard data={data} getSubjectName={getSubjectName} />
                </div>
              </Link>
            ))
          : getDummyArray(5)
              .map((data) => (
                <Link href="#" key={data.id}>
                  <div className="cwc-card-wrapper">
                    <CarouselCard
                      data={loadingData}
                      getSubjectName={getSubjectName}
                    />
                  </div>
                </Link>
              ))}
        {(lastEngagement === null || lastEngagement?.length < 5) &&
          (user?.grade === "class_9"
            ? trendingVideos
                .slice(lastEngagement?.length, trendingVideos.length)
                .map((data) => (
                  <Link
                    href={`/auth_classroom?subject=${getSubjectName(
                      data?.subject_id
                    )}&chapter=${data?.chapter_id}`}
                    key={data?.chapter_id}
                  >
                    <div className="cwc-card-wrapper">
                      <CarouselCard
                        data={data}
                        getSubjectName={getSubjectName}
                        trending={true}
                      />
                    </div>
                  </Link>
                ))
            : trendingVideos2
                .slice(lastEngagement?.length, trendingVideos.length)
                .map((data) => (
                  <Link
                    href={`/auth_classroom?subject=${getSubjectName(
                      data?.subject_id
                    )}&chapter=${data?.chapter_id}`}
                    key={data?.chapter_id}
                  >
                    <div className="cwc-card-wrapper">
                      <CarouselCard
                        data={data}
                        getSubjectName={getSubjectName}
                        trending={true}
                      />
                    </div>
                  </Link>
                )))}
        <div ref={bottomVisibilityRef}></div>
      </div>
    </div>
  );
};

export default ContinueWatchingSidebar;
