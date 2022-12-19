import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context";
import Link from 'next/link'
import CarouselCard from "./card";

const getContinueWatchingList = ({ grade, userId }) => {
  const doc = require('../../../firebase-config').db
    .collection("user_engagement")
    .doc(grade)
    .collection(userId)
    .doc("latest_engagement");

  return doc;
};

const ContinueWatchingCarousel = ({ setisContinueWatching }) => {
  const [lastEngagement, setLastEngagement] = useState(null);
  const [user] = useContext(UserContext).user;

  useEffect(() => {
    if (user?.grade || "") {
      const unsubscribe = getUserLatestEngagementFn();
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
        setisContinueWatching(true);
        getScrollValue();
      } else {
        setLastEngagement(null);
        setisContinueWatching(false);
      }
    });
  };

  const scrollLeft = () => {
    let x = document.getElementsByClassName("cwc__carousel__wrapper")[0];
    let step = window.outerWidth / 1.98;
    x.scrollLeft -= step;
  };

  const scrollRight = () => {
    let x = document.getElementsByClassName("cwc__carousel__wrapper")[0];
    let step = window.outerWidth / 1.98;
    x.scrollLeft += step;
  };
  const getScrollValue = () => {
    setTimeout(() => {
      let x = document.getElementsByClassName("cwc__carousel__wrapper")[0];
      let el = document.getElementsByClassName("left_arrow_cwc")[0];
      if(!el) return;
      if (x?.scrollLeft === 0) {
        el.style.display = "none";
      } else {
        el.style.display = "flex";
      }
      let el2 = document.getElementsByClassName("right_arrow_cwc")[0];
      let right = x?.scrollWidth - (x?.scrollLeft + x?.clientWidth) + 1;
      if (right <= 2) {
        el2.style.display = "none";
      } else {
        el2.style.display = "flex";
      }
    }, 500);
  };

  const getSubjectName = (subjectId) => {
    return typeof subjectId.split("_")[4] === "undefined"
      ? subjectId.split("_")[3]
      : subjectId.split("_")[4];
  };

  return lastEngagement ? (
    <div className="cwc__carousel fadeIn">
      <div className="home__section__header">Continue Watching</div>

      <div className="cwc__carousel__wrapper" onScroll={getScrollValue}>
        <div className="dummy-carousel-placeholder"></div>
        {lastEngagement.map((data, i) => (
          <Link
            href={`/classroom?subject=${getSubjectName(
              data?.subject_id
            )}&chapter=${data?.chapter_id}`}
            key={data?.chapter_id}
          >
            <CarouselCard data={data} getSubjectName={getSubjectName} />
          </Link>
        ))}

        <div className="dummy-carousel-placeholder"></div>

        {/* Arrows */}
        <div className="space"></div>
        <div className="left_arrow_cwc scroll_button" onClick={scrollLeft}>
          <i className="arrow left">
            <svg className="arrow__svg" viewBox="137.718 -1.001 366.563 644">
              <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" />
            </svg>
          </i>
        </div>
        <div className="right_arrow_cwc scroll_button" onClick={scrollRight}>
          <i className="arrow right">
            <svg className="arrow__svg" viewBox="0 0 238.003 238.003">
              <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" />
            </svg>
          </i>
        </div>
      </div>
    </div>
  ) : null;
};

export default ContinueWatchingCarousel;
