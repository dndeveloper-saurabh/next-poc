import React, { useEffect, useState, useContext } from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ContentLoader from "react-content-loader";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { logoDark, logoDark2, logoLight2 } from "../../../public/assets";
import { ThemeContext } from "../../../context";

const CarouselCard = ({ data, getSubjectName, trending = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDark] = useContext(ThemeContext).theme;

  useEffect(() => {
    const objImg = new Image();
    objImg.src = data?.chapter_illustration_art;

    objImg.onload = () => setImageLoaded(true);
  }, [data]);

  return (
    <div className="cwc__card" key={data?.chapter_id}>
      <div className="pustack__mark__overlay">
        <h6 className="pustack__mark">
          <img src={logoDark} alt="p" draggable={false} />
        </h6>
        <h6 className="pustack__mark__bg">PuStack</h6>
      </div>

      <div
        className="subject__thumbnail"
        style={{ backgroundColor: data?.chapter_hex_color }}
      >
        {imageLoaded ? (
          <img
            src={data?.chapter_illustration_art}
            alt={data?.chapter_name + " Subject"}
            className={
              data?.category_id?.includes("maths") ? "maths__thumbnail" : ""
            }
          />
        ) : (
          <img
            src={isDark ? logoDark2 : logoLight2}
            alt={data?.chapter_name + " Subject"}
          />
        )}
        {data?.total_lecture_count > 0 &&
          (data?.completed_lecture_count / data?.total_lecture_count) * 100 >
            10 && (
            <div className="chapter__progress">
              <div
                className="progress__percent"
                style={{
                  width:
                    data?.total_lecture_count > 0
                      ? (data?.completed_lecture_count /
                          data?.total_lecture_count) *
                        100
                      : 0,
                }}
              />
            </div>
          )}
        <div className="subject__radial__overlay"></div>
        <div className="subject__overlay"></div>
      </div>
      <div className="subject__details">
        <div className="top__bar">
          <h4>
            <span>
              <PlayArrowIcon />
            </span>
            <h5>
              Play
              <p className="chapter__progress">
                <p
                  style={{
                    width:
                      data?.total_lecture_count > 0
                        ? (data?.completed_lecture_count /
                            data?.total_lecture_count) *
                            100 +
                          "%"
                        : 0,
                  }}
                ></p>
              </p>
            </h5>
          </h4>
        </div>
        <div className="main__content">
          <h1>
            {trending && <TrendingUpIcon />}
            {data?.chapter_name}
          </h1>
          <h4>{data?.total_lecture_count} lectures</h4>
          <h6>
            <span>
              {getSubjectName(data?.subject_id) === "naturalresources"
                ? "Natural Resources"
                : getSubjectName(data?.subject_id)}
            </span>
          </h6>
        </div>
      </div>
      <div className="subject__title">
        {data?.chapter_name === "Loading" ? (
          <ContentLoader
            speed={2}
            width={270}
            height={15}
            viewBox="0 0 270 30"
            backgroundColor={isDark ? "#282828" : "#ecebeb"}
            foregroundColor={isDark ? "#343434" : "#ddd"}
          >
            <rect x="0" y="12" rx="10" ry="10" width="100%" height="15" />
          </ContentLoader>
        ) : (
          <>
            {trending && <TrendingUpIcon />}
            {data?.chapter_name}
          </>
        )}
      </div>
    </div>
  );
};

export default CarouselCard;
