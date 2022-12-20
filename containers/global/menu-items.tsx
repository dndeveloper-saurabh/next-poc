import React, { useContext, useEffect } from "react";
import Icon from "@material-ui/core/Icon";
import Link from 'next/link';
import {useRouter} from 'next/router';
import { makeStyles } from "@material-ui/core/styles";
import Image from 'next/image';
import blazeIcon from "../../public/assets/images/icons/flash.svg";
import {
	SidebarContext,
	UserContext,
	ThemeContext,
	IntroContext,
} from "../../context";

export const useStylesBootstrap = makeStyles((theme) => ({
	arrow: {
		color: theme.palette.common.black,
	},
	tooltip: {
		backgroundColor: "rgba(0,0,0,0.75)",
		color: "rgba(255,255,255,1)",
		maxWidth: 260,
		fontWeight: 400,
		fontSize: theme.typography.pxToRem(13.5),
		padding: ".5rem .75rem",
	},
}));

export default function MenuItems({
	                                  setMenuItem,
	                                  selectedMenuItem,
	                                  blazeNewMsg,
                                  }) {
	const [isDarkMode] = useContext(ThemeContext).theme;

	const [, setAnchor] = useContext(IntroContext).anchor;

	const router = useRouter();

	useEffect(() => {
		const currentPath = router.pathname;

		if (currentPath.includes("/blaze")) {
			setMenuItem("blaze");
		} else if (currentPath.includes("/classes")) {
			setMenuItem("videos");
		} else if (currentPath.includes("/doubt")) {
			setMenuItem("doubts");
		} else if (currentPath === "/newsfeed") {
			setMenuItem("news");
		} else if (currentPath === "/") {
			setMenuItem("homepage");
		}
	}, [router.pathname]);

	const getClassName = (name) =>
		selectedMenuItem === name
			? isDarkMode
				? `navbar-item active ${name} navbar-item-dark`
				: `navbar-item ${name} active`
			: isDarkMode
				? "navbar-item navbar-item-dark"
				: "navbar-item";

	const handleClick = (event) => {
		setAnchor(event.currentTarget);
	};

	return (
		<div className="header__middle-md">
			<svg
				width={121}
				height={77}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g filter="url(#a)">
					<path
						d="M12.256 65.512 10.5 62 61 10l49.5 49.5-1.507 4.218a2 2 0 0 1-3.207.827L61.325 25.277a4 4 0 0 0-5.483.177l-40.38 40.574a2 2 0 0 1-3.206-.516Z"
						fill="#232323"
						fillOpacity={0.07}
					/>
				</g>
				<path
					d="M9 59.397V5h103v54.397c0 1.781-2.154 2.674-3.414 1.414L67.571 19.796c-3.905-3.905-10.237-3.905-14.142 0L12.414 60.811C11.154 62.07 9 61.178 9 59.397Z"
					fill="#fff"
				/>
				<defs>
					<filter
						id="a"
						x={0.5}
						y={0}
						width={120}
						height={76.618}
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity={0} result="BackgroundImageFix" />
						<feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feGaussianBlur
							stdDeviation={5}
							result="effect1_foregroundBlur_126_19"
						/>
					</filter>
				</defs>
			</svg>
			{/*<svg*/}
			{/*  width={121}*/}
			{/*  height={77}*/}
			{/*  fill="none"*/}
			{/*  xmlns="http://www.w3.org/2000/svg"*/}
			{/*>*/}
			{/*  <g filter="url(#a)">*/}
			{/*    <path*/}
			{/*      d="M12.256 65.512 10.5 62 61 10l49.5 49.5-1.507 4.218a2 2 0 0 1-3.207.827L61.325 25.277a4 4 0 0 0-5.483.177l-40.38 40.574a2 2 0 0 1-3.206-.516Z"*/}
			{/*      fill="#232323"*/}
			{/*      fillOpacity={0.07}*/}
			{/*    />*/}
			{/*  </g>*/}
			{/*  <path*/}
			{/*    d="M9 59.397V5h103v54.397c0 1.781-2.154 2.674-3.414 1.414L63.328 15.553a4 4 0 0 0-5.656 0L12.414 60.811C11.154 62.07 9 61.178 9 59.397Z"*/}
			{/*    fill="#fff"*/}
			{/*  />*/}
			{/*  <defs>*/}
			{/*    <filter*/}
			{/*      id="a"*/}
			{/*      x={0.5}*/}
			{/*      y={0}*/}
			{/*      width={120}*/}
			{/*      height={76.618}*/}
			{/*      filterUnits="userSpaceOnUse"*/}
			{/*      colorInterpolationFilters="sRGB"*/}
			{/*    >*/}
			{/*      <feFlood floodOpacity={0} result="BackgroundImageFix" />*/}
			{/*      <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />*/}
			{/*      <feGaussianBlur*/}
			{/*        stdDeviation={5}*/}
			{/*        result="effect1_foregroundBlur_126_19"*/}
			{/*      />*/}
			{/*    </filter>*/}
			{/*  </defs>*/}
			{/*</svg>*/}
			{/*<div className="middle__menu">*/}
			{/*  <div className="left__fall"/>*/}
			<Link
				href="/blaze"
				onClick={(e) => {
					setMenuItem("blaze");
					handleClick(e);
					navigator && navigator.vibrate && navigator.vibrate(5);
					// setBounce(true);
					// setTimeout(() => setBounce(false), 150);
				}}
				className={"diamond"
					// isDark
					//   ? "navbar-item navbar-item-dark diamond"
					//   : "navbar-item diamond"
				}
				style={{
					textDecoration: "inherit",
					// animation:
					// location.pathname.includes("/blaze") &&
					// bounce &&
					// "bounce 0.15s ease both",
				}}
				id="blazeIntro"
			>
				<div className="nav__box__wrapper diamond__blaze">
					<Icon className="nav__icon">
						{/*{blazeNewMsg && (*/}
						{/*  <div className="has__sessions">*/}
						{/*    <div className="red__wrapper">*/}
						{/*      <div className="dot__red count blaze"/>*/}
						{/*    </div>*/}
						{/*  </div>*/}
						{/*)}*/}
						<Image height={100} width={100}
							className="nav__icon__img"
							src={blazeIcon}
							alt="Blaze Icon"
						/>
					</Icon>
				</div>
			</Link>
			{/*  <div className="blaze__waterfall"/>*/}
			{/*  <div className="blaze__waterfall border"/>*/}
			{/*  <div className="blaze__bg__blur"/>*/}
			{/*  <div className="right__fall"/>*/}
			{/*</div>*/}
			{/*<Tooltip title={"Live Classes"} style={{ fontSize: "20px" }} id="video__tooltip" classes={tooltipClasses}>*/}
			{/*<Link*/}
			{/*  to="/classes"*/}
			{/*  style={{ textDecoration: "inherit" }}*/}
			{/*  className={getClassName("videos")}*/}
			{/*  onClick={(e) => {*/}
			{/*    setMenuItem("videos");*/}
			{/*    handleClick(e);*/}
			{/*  }}*/}
			{/*  id="classesIntro"*/}
			{/*>*/}
			{/*  <div className="nav__box__wrapper">*/}
			{/*    <Icon className="nav__icon">*/}
			{/*      {hasSessions && (*/}
			{/*        <div className="has__sessions">*/}
			{/*          <div class="red__wrapper">*/}
			{/*            <div className="dot__red" />*/}
			{/*            <div className="red__bg">*/}
			{/*              <Lottie*/}
			{/*                options={{ animationData: glowIndicator, loop: true }}*/}
			{/*                speed={1.5}*/}
			{/*              />*/}
			{/*            </div>*/}
			{/*          </div>*/}
			{/*        </div>*/}
			{/*      )}*/}
			{/*      <Image height={100} width={100}*/}
			{/*        className="nav__icon__img"*/}
			{/*        src={*/}
			{/*          selectedMenuItem === "videos"*/}
			{/*            ? isDarkMode*/}
			{/*              ? liveIconSelected2*/}
			{/*              : liveIconSelected*/}
			{/*            : liveIcon*/}
			{/*        }*/}
			{/*        alt="Live Icon"*/}
			{/*      />*/}
			{/*    </Icon>*/}
			{/*  </div>*/}
			{/*</Link>*/}
			{/*</Tooltip>*/}
			{/*<Tooltip*/}
			{/*  title={"Doubt Forum"}*/}
			{/*  style={{ fontSize: "20px" }}*/}
			{/*  classes={tooltipClasses}*/}
			{/*>*/}
			{/*  <Link*/}
			{/*    to="/doubts"*/}
			{/*    onClick={(e) => {*/}
			{/*      setMenuItem("doubts");*/}
			{/*      handleClick(e);*/}
			{/*      setSortBy("Recommended");*/}
			{/*      setSortByDBString("recommendation_score"); //used for firebase database query*/}
			{/*      setTopLevel("General");*/}
			{/*      setSelectedSubject("General");*/}
			{/*      setSelectedChapter(null);*/}
			{/*      setIsAnswered(isInstructor ? false : true);*/}
			{/*    }}*/}
			{/*    className={getClassName("doubts")}*/}
			{/*    style={{ textDecoration: "inherit" }}*/}
			{/*    id="doubtIntro"*/}
			{/*  >*/}
			{/*    <div className="nav__box__wrapper">*/}
			{/*      <Icon className="nav__icon">*/}
			{/*        {unreadAnswerCount > 0 && (*/}
			{/*          <div className="has__sessions">*/}
			{/*            <div class="red__wrapper">*/}
			{/*              <div className="dot__red count" />*/}
			{/*            </div>*/}
			{/*          </div>*/}
			{/*        )}*/}
			{/*        <Image height={100} width={100}*/}
			{/*          className="nav__icon__img"*/}
			{/*          src={*/}
			{/*            selectedMenuItem === "doubts"*/}
			{/*              ? isDarkMode*/}
			{/*                ? doubtIconSelected2*/}
			{/*                : doubtIconSelected*/}
			{/*              : doubtIcon*/}
			{/*          }*/}
			{/*          alt="Doubt Icon"*/}
			{/*        />*/}
			{/*      </Icon>*/}
			{/*    </div>*/}
			{/*  </Link>*/}
			{/*</Tooltip>*/}
			{/*<Tooltip*/}
			{/*  title={"News Feed"}*/}
			{/*  style={{ fontSize: "20px" }}*/}
			{/*  classes={tooltipClasses}*/}
			{/*>*/}
			{/*  <Link*/}
			{/*    to="/newsfeed"*/}
			{/*    onClick={(e) => {*/}
			{/*      setMenuItem("news");*/}
			{/*      handleClick(e);*/}
			{/*    }}*/}
			{/*    className={getClassName("news")}*/}
			{/*    style={{ textDecoration: "inherit" }}*/}
			{/*    id="newsIntro"*/}
			{/*  >*/}
			{/*    <div className="nav__box__wrapper">*/}
			{/*      <Icon className="nav__icon">*/}
			{/*        <Image height={100} width={100}*/}
			{/*          className="nav__icon__img"*/}
			{/*          src={*/}
			{/*            selectedMenuItem === "news"*/}
			{/*              ? isDarkMode*/}
			{/*                ? newsfeedIconSelected2*/}
			{/*                : newsfeedIconSelected*/}
			{/*              : newsfeedIcon*/}
			{/*          }*/}
			{/*          alt="News Feed Icon"*/}
			{/*        />*/}
			{/*      </Icon>*/}
			{/*    </div>*/}
			{/*  </Link>*/}
			{/*</Tooltip>*/}
			{/*<Tooltip*/}
			{/*  title={"Blaze"}*/}
			{/*  style={{ fontSize: "20px" }}*/}
			{/*  classes={tooltipClasses}*/}
			{/*>*/}
			{/*  <Link*/}
			{/*    to="/blaze"*/}
			{/*    onClick={(e) => {*/}
			{/*      setMenuItem("blaze");*/}
			{/*      handleClick(e);*/}
			{/*    }}*/}
			{/*    className={getClassName("blaze")}*/}
			{/*    style={{ textDecoration: "inherit" }}*/}
			{/*    id="blazeIntro"*/}
			{/*  >*/}
			{/*    <div className="nav__box__wrapper">*/}
			{/*      <Icon className="nav__icon">*/}
			{/*        {blazeNewMsg && (*/}
			{/*          <div className="has__sessions">*/}
			{/*            <div class="red__wrapper">*/}
			{/*              <div className="dot__red count blaze" />*/}
			{/*            </div>*/}
			{/*          </div>*/}
			{/*        )}*/}
			{/*        <Image height={100} width={100}*/}
			{/*          className="nav__icon__img"*/}
			{/*          src={*/}
			{/*            selectedMenuItem === "blaze"*/}
			{/*              ? isDarkMode*/}
			{/*                ? blazeIconSelected2*/}
			{/*                : blazeIconSelected*/}
			{/*              : blazeIcon*/}
			{/*          }*/}
			{/*          alt="Blaze Icon"*/}
			{/*        />*/}
			{/*      </Icon>*/}
			{/*    </div>*/}
			{/*  </Link>*/}
			{/*</Tooltip>*/}
		</div>
	);
}


// {/*<Tooltip title={"Homepage"} classes={tooltipClasses}>*/}
// {/*  <Link*/}
// //     to="/"
// //     onClick={(e) => {
// //       setMenuItem("homepage");
// //       handleClick(e);
// {/*    }}*/}
// {/*    className={getClassName("homepage")}*/}
// {/*    style={{ textDecoration: "inherit" }}*/}
// {/*    id="homeIntro"*/}
// {/*  >*/}
// <div className="nav__box__wrapper">
//   <Icon className="nav__icon">
//     <Image height={100} width={100}
//       {/*          className="nav__icon__img"*/}
//       {/*          src={*/}
//       {/*            selectedMenuItem === "homepage"*/}
//       {/*              ? isDarkMode*/}
//       {/*                ? homeIconSelected2*/}
//       //                 : homeIconSelected
//       //               : homeIcon
//       //           }
//       {/*          alt="Home Icon"*/}
//       {/*        />*/}
//       {/*      </Icon>*/}
//       {/*    </div>*/}
//       {/*  </Link>*/}
//       {/*</Tooltip>*/}

// <svg
//   width={100}
//   height={70}
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <g filter="url(#a)">
//     <path
//       d="M10.719 56.71V10.624h79.11v46.084c0 2.68-3.246 4.015-5.132 2.112L54.536 28.376a6 6 0 0 0-8.525 0L15.85 58.821c-1.886 1.903-5.131.568-5.131-2.112Z"
//       fill="#232323"
//       fillOpacity={0.07}
//     />
//   </g>
//   <path
//     d="M5 56.28V3h90.547v53.28c0 2.673-3.231 4.012-5.121 2.122l-35.91-35.91a6 6 0 0 0-8.485 0l-35.91 35.91C8.231 60.292 5 58.953 5 56.281Z"
//     fill="#fff"
//   />
//   <defs>
//     <filter
//       id="a"
//       x={0.719}
//       y={0.625}
//       width={99.109}
//       height={69.09}
//       filterUnits="userSpaceOnUse"
//       colorInterpolationFilters="sRGB"
//     >
//       <feFlood floodOpacity={0} result="BackgroundImageFix" />
//       <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//       <feGaussianBlur
//         stdDeviation={5}
//         result="effect1_foregroundBlur_124_13"
//       />
//     </filter>
//   </defs>
// </svg>
