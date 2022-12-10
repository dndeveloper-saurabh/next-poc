import React, { useContext, useEffect, useState, Suspense } from "react";
// import { Link } from "react-router-dom";
import Link from 'next/link';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
// import Tooltip from "@material-ui/core/Tooltip";
// import { makeStyles } from "@material-ui/core/styles";

import {UserContext, ClassroomContext} from "../../../context";
import { logoDark, proLogoDark } from "../../../public/assets";
import {useMediaQuery} from "react-responsive";
import Image from "next/image";
import {useRouter} from "next/router";
// import OnBoarding from "../../../containers/landing/onboarding";

// const useStylesBootstrap = makeStyles((theme) => ({
//   arrow: {
//     color: theme.palette.common.black,
//   },
//   tooltip: {
//     backgroundColor: "rgba(0,0,0,0.65)",
//     color: "rgba(255,255,255,1)",
//     fontWeight: 400,
//     fontSize: theme.typography.pxToRem(12.5),
//     padding: ".35rem .75rem",
//     borderRadius: "8px",
//   },
// }));

export default function ClassroomNavbar({ title, chapterID }) {
  const [chapterEngagement] = useContext(ClassroomContext).chapterEngagement;
  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
  const router = useRouter();
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isUserProTier] = useContext(UserContext).tier;
  const [progressValue, setProgressValue] = useState(0);
  const [pathColor, setPathColor] = useState("white");
  const [trailColor, setTrailColor] = useState("rgba(255,255,255,0.25)");
  const [user] = useContext(UserContext).user;

  // const tooltipClasses = useStylesBootstrap();

  useEffect(() => {
    const totalLectures =
      chapterEngagement?.completion_status_by_chapter[chapterID]
        ?.total_lecture_count;

    const completedLectures =
      chapterEngagement?.completion_status_by_chapter[chapterID]
        ?.completed_lecture_count;

    const value =
      completedLectures && totalLectures
        ? (completedLectures / totalLectures) * 100
        : 0;

    setProgressValue(value);

    if (value === 0) {
      setPathColor("white");
      setTrailColor("rgba(255, 255, 255, 0.25)");
    }
    if (value > 0 && value <= 90) {
      setPathColor("rgba(0, 255, 0, 1)");
      setTrailColor("rgba(0, 255, 0, 0.25)");
    }
    if (value > 90) {
      setPathColor("rgba(255, 215, 0, 1)");
      setTrailColor("rgba(255, 215, 0, 0.25)");
    }
  }, [chapterID, chapterEngagement]);

  const progressBarStyles = buildStyles({
    rotation: 0,
    strokeLinecap: "round",
    textSize: "16px",
    pathTransitionDuration: 1.5,
    pathColor: pathColor,
    trailColor: trailColor,
    backgroundColor: "#3e98c7",
  });

  return (
    <div className="classroom__navbar">
      {/*<Suspense fallback={<></>}>*/}
      {/*  <OnBoarding*/}
      {/*    isOpen={isSliderOpen}*/}
      {/*    handleClose={() => setIsSliderOpen(!isSliderOpen)}*/}
      {/*  />*/}
      {/*</Suspense>*/}
      <Link href="/">
        <div className="classroom__logo">
          {isUserProTier ? (
            <Image
              className="header__leftImage"
              src={proLogoDark}
              alt="PuStack Pro"
              draggable={false}
            />
          ) : (
            <Image className="header__leftImage" src={logoDark} alt="PuStack" draggable={false} />
          )}
        </div>
      </Link>

      {title && (
        <>
          <div className="separator">|</div>
          <div className="classroom__chapter__name">{title}</div>{" "}
        </>
      )}

      {!user ? <div className={"classroom__progress no_user"}>
          <span className="nav__links">
            {/*<a href="https://tutor.pustack.com">Tutor Login</a>*/}
            <span
              className="nav__link signup__btn"
              onClick={() => {
                // router.query.step = "login"
                // router.push(router);
                // setIsSliderOpen(true);
                // navigator && navigator.vibrate && navigator.vibrate(5);
              }}
            >
              Sign In
            </span>
          </span>
        </div> :

        <div className="classroom__progress">
            <CircularProgressbarWithChildren
              value={progressValue}
              styles={progressBarStyles}
              strokeWidth={7}
            >
              <i
                className={
                  progressValue > 90
                    ? "fas fa-trophy cup__golden"
                    : "fas fa-trophy"
                }
                style={{color: pathColor}}
              ></i>
            </CircularProgressbarWithChildren>
          </div>}
    </div>
  );
}


// <Tooltip
//   title={`${Math.round(progressValue)}% completed`}
//   classes={tooltipClasses}
//   placement={"bottom"}
//   enterTouchDelay={0}
// >
//   <div className="classroom__progress">
//     <CircularProgressbarWithChildren
//       value={progressValue}
//       styles={progressBarStyles}
//       strokeWidth={7}
//     >
//       <i
//         className={
//           progressValue > 90
//             ? "fas fa-trophy cup__golden"
//             : "fas fa-trophy"
//         }
//         style={{color: pathColor}}
//       ></i>
//     </CircularProgressbarWithChildren>
//   </div>
// </Tooltip>
