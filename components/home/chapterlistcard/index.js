import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
import Link from 'next/link';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { SubjectModalContext, ThemeContext } from "../../../context";
import { logoDark2, logoLight2 } from "../../../public/assets";

export default function ChapterListCard({
  serial,
  chapter_id,
  illustration_art,
  chapter_name,
  hex_color,
  lecture_item_count,
  description,
  code,
  completionStatus,
  type,
  path = null,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [completedPercent, setCompletedPercent] = useState(0);

  const [isDark] = useContext(ThemeContext).theme;
  const [, setIsOpen] = useContext(SubjectModalContext).isOpen;

  useEffect(() => {
    if (completionStatus || "") {
      const totalLecturesWatched =
        completionStatus[1][chapter_id]?.completed_lecture_count;

      const totalLectures =
        completionStatus[1][chapter_id]?.total_lecture_count;

      if (completionStatus[1][chapter_id] || "") {
        let res = 0;
        if (totalLectures > 0)
          res = (totalLecturesWatched / totalLectures) * 100;
        setCompletedPercent(res);
      }
    }
  }, [completionStatus]);

  useEffect(() => {
    const objImg = new Image();
    objImg.src = illustration_art;

    objImg.onload = () => setImageLoaded(true);
  }, [illustration_art]);

  return (
    <Link
      href={path ? path : `/classroom?subject=${code}&chapter=${chapter_id}`}
      onClick={() => setIsOpen(false)}
    >
      <div className="chapter__card">
        <div className="chapter__serial">{serial + 1}</div>
        <Link
          href={path ? path : `/classroom?subject=${code}&chapter=${chapter_id}`}
          className="chapter__thumbnail"
        >
          <div className="chapter__thumbnail__wrapper">
            <img
              src={
                imageLoaded ? illustration_art : isDark ? logoDark2 : logoLight2
              }
              alt={`${chapter_name}`}
              style={{ backgroundColor: hex_color }}
              loading="lazy"
            />
            {completedPercent > 0 && (
              <div className="chapter__progress">
                <div
                  className="progress__percent"
                  style={{ width: completedPercent }}
                />
              </div>
            )}

            <div className="chapter__thumb__overlay">
              <PlayArrowIcon />
            </div>
          </div>
        </Link>

        <div className="chapter__content">
          <div className="chapter__content__header">
            <div className="chapter__title">
              <h1>{chapter_name}</h1>
            </div>
            {lecture_item_count && (
              <div className="chapter__lectures">
                {type?.includes("question")
                  ? lecture_item_count - 2
                  : lecture_item_count}{" "}
                {type}
              </div>
            )}
          </div>
          <h6>{description}</h6>
        </div>
      </div>
    </Link>
  );
}
