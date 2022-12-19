import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Lottie from "lottie-react-web";
import dynamic from 'next/dynamic';
const Steps = dynamic(() => import("intro.js-react").then(mod => mod.Steps), {
	ssr: false
});
// import {Helmet} from "react-helmet";
import Dialog from "@material-ui/core/Dialog";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
// import WelcomeBg from "../../assets/onboarding/welcome.jpeg";
import {useMediaQuery} from "react-responsive";
import CancelIcon from "@material-ui/icons/Cancel";
import {circularProgress, HUD, HUD1, logoDark2, proLogoDark, SpaceCraft} from "../public/assets";
// import {useLastLocation} from "react-router-last-location";
import EmptyBox from '../public/assets/lottie/empty-box.json';
import {IntroContext, NavbarContextProvider, ThemeContext, UserContext,} from "../context";
import Navbar from "../containers/global/navbar";
import astronautLottie from "../public/assets/onboarding/astronaut.json";
import flashSvg from '../public/assets/images/icons/flash_white.svg';

import ContinueWatchingCarousel from '../components/home/continuewatchingcarousel';
import HomePageCarouselSlider from '../components/home/carousel';
import HomePageSubjectModal from '../components/home/subjectmodal';

import HomeSidebar from "../components/home/sidebar";
import PuStackCare from "../containers/global/pustack-care";
import PuStackCareChatPopup from "../containers/global/pustack-care-chat-popup";
// import "intro.js/introjs.css";
import {fetchTodayUpcomingSessions, formatDateDoc} from "../database/livesessions/sessions";
import {castIndianTime} from '../helpers/getIndianTime';
import {ArrowLeft, ArrowRight, EventAvailable, Timer3Rounded, TimerRounded, WatchLater} from "@material-ui/icons";
import NumberMeter from "../components/global/NumberMeter";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
// import {require('../firebase-config.js').db} from "../../firebase_config";
import {format} from "date-fns";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import DurationDropdown from "../components/home/DurationDropdown";
import DateRangeIcon from "@material-ui/icons/DateRangeRounded";
import BlazeOnGoingCard from "../containers/blaze/BlazeOnGoingCard";
import {useRouter} from 'next/router';
import VideoPlayer from "../components/global/VideoPlayer";
import BlazeCardLoader from "../components/blaze/CardLoader";
import useStandardGrade from "../hooks/isStandardGrade";
import LearnSection from "../components/home/LearnSection";
import ContinueWatchingSidebar from "../components/home/continue-watching-sidebar";
import InfiniteScroll from "../components/global/InfiniteScroll";
import BlazeStudentCard from "../containers/blaze/sidebar/components/StudentCard";
import BookSession from "../containers/blaze/sidebar/components/BookSession";
import PustackShimmer from "../components/global/Shimmer";
import {useIsMounted} from "../hooks/isMounted";
import VideoShimmer from "../components/home/VideoShimmer";
//TODO: Replace axios with fetch API
import axios from 'axios';

const getVimeoVideos = async () => {
	const vimeoVideos = [];
	const snapshot = await require('../firebase-config').db
		.collection('/admin_videos')
		.doc('pustack_app')
		.get();

	if(!snapshot.exists) return;

	const videos = snapshot.data().videos?.home_video_list;

	if(!videos) return;

	for(let i = 0; i < videos.length; i++) {
		let videoData = videos[i];
		try {
			const {data} = await axios.get('https://api.vimeo.com/videos/' + videoData.video_id, {
				headers: {
					'Authorization': 'Bearer eb3aa30f683094b5e51d077a9b8bbff5'
				}
			});
			const thumbnailItem = data.pictures.sizes.find(c => (c.width === 1280 && c.height === 720));
			const linkItem = data.files.find(c => c.quality === 'hls');
			const thumbnail = thumbnailItem?.link_with_play_button;
			const link = linkItem?.link;
			if(data.error || !thumbnail || !link) continue;
			vimeoVideos.push({
				id: +new Date() + '_' + videoData.video_id,
				link,
				thumbnail,
				description: videoData.description,
				title: videoData.title
			})
		} catch(e) {
			console.log('error in vimeo video response - ', e);
		}
	}

	return vimeoVideos;
}

export class AppValidate {

	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	static isNotNull(value) {
		return value !== null;
	}

	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	static isNotUndefined(value) {
		return value !== undefined;
	}

	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	static isDefined(value) {
		return AppValidate.isNotNull(value) && AppValidate.isNotUndefined(value)
	}

	/**
	 * @description It checks for the corresponding keys in the provided object that these are not null/undefined.
	 * @param obj {Object<keys>}
	 * @param keys {Array<string>}
	 * @returns {boolean}
	 */
	static requiredAll(obj, keys) {
		if(!obj) return false;
		let isValid = true;
		for(let key of keys) {
			if(!AppValidate.isDefined(obj[key])) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}
}


// export const formatDateDoc = (date, dontIncMonth, withoutDate) => {
// 	if(isNotValidDateHash(date)) date = convertDateToHash(date);
// 	if(withoutDate) return `${date.year}_${date.month + (dontIncMonth ? 0 : 1)}`;
// 	return `${date.year}_${date.month + (dontIncMonth ? 0 : 1)}_${date.date}`;
// }
//
// export async function fetchTodayUpcomingSessions(grade, isUserPro) {
// 	if(!grade) return null;
//
// 	let filterObj = {
// 		$query: {
// 			match: function(obj, curDate) {
// 				return obj['start_ts'] >= +curDate - (obj.duration * 60 * 1000)
// 			},
// 			maxLength: 6
// 		}
// 	}
// 	return await fetchTodaySessions(grade, isUserPro, filterObj);
// }

// const videos = [
//   {
//     id: 1,
//     link: 'https://player.vimeo.com/external/686155431.m3u8?s=c434cc27f299b9537891aa9255a8dc5bbe7ddfb7&oauth2_token_id=1574768840',
//     thumbnail: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1390379872-4f01a263978ae26bdd9bea67b27b1304fe950894341fce64513b60b51fec2cdf-d_1280x720&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png'
//   },
//   {
//     id: 2,
//     link: 'https://player.vimeo.com/external/686155431.m3u8?s=c434cc27f299b9537891aa9255a8dc5bbe7ddfb7&oauth2_token_id=1574768840',
//     thumbnail: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1390379872-4f01a263978ae26bdd9bea67b27b1304fe950894341fce64513b60b51fec2cdf-d_1280x720&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png'
//   },
//   {
//     id: 3,
//     link: 'https://player.vimeo.com/external/686155431.m3u8?s=c434cc27f299b9537891aa9255a8dc5bbe7ddfb7&oauth2_token_id=1574768840',
//     thumbnail: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1390379872-4f01a263978ae26bdd9bea67b27b1304fe950894341fce64513b60b51fec2cdf-d_1280x720&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png'
//   },
// ]


export const getInstructorLifetimeEngagement = async ({instructorId, year, setLoadingStatus}) => {
	// setLoadingStatus("lifetime")
	if (year === 'all') {
		return await require('../firebase-config.js').db
			.collection("blaze_dev")
			.doc("collections")
			.collection("students")
			.doc(instructorId)
			.collection("engagement_stats")
			.get()
			.then((data) => {
				let arr = {};
				const len = data.docs.length;

				if (len) {
					for (let i = 0; i < len; i++) {
						arr = {...arr, ...data.docs[i].data()};
					}
				}
				setLoadingStatus(false)
				return arr;
			})
			.catch(() => []);
	}

	let ist = {year};
	if (!year) {
		ist = await castIndianTime()
	}
	return await require('../firebase-config.js').db
		.collection("blaze_dev")
		.doc("collections")
		.collection("students")
		.doc(instructorId)
		.collection("engagement_stats")
		.doc(ist.year.toString())
		.collection('monthly_engagement')
		.get()
		.then((data) => {
			let arr = {};
			const len = data.docs.length;

			if (len) {
				for (let i = 0; i < len; i++) {
					arr = {...arr, ...data.docs[i].data()};
				}
			}
			return arr;
		})
		.catch(() => []);
};

interface DurationObject {
	name: string,
	index: number,
	month: string | null,
	year: string | null,
}

interface Props {
	className?: string,
	dataKey: string,
	miniChartData: [],
	durationObj: DurationObject,
	noHeading: boolean,
	setDurationObj: (DurationObject) => null,
}

const DetailedChart = ({
	                       className,
	                       dataKey,
	                       miniChartData,
	                       durationObj,
	                       noHeading,
	                       setDurationObj,
                       }: Props) => {
	const strokes = {
		hours: "#8884d8",
		sessions: "#11993f",
		earnings: "#ffc658",
	};
	const [inBrowser, setInBrowser] = useState(false);
	const isLargeScreen = useMediaQuery({query: "(min-width: 500px)"});

	useEffect(() => {
		setInBrowser(true);
	}, [])

	const CustomTooltip = ({active, payload, label}) => {
		if (active && payload && payload.length) {
			let count = payload[0].payload[dataKey];
			if (dataKey === "hours") {
				count = Math.round(count * 10) / 10 + " minutes";
			} else if (dataKey === "sessions") {
				count = count + " sessions";
			} else {
				count = "₹ " + count;
			}
			return (
				<div className="custom-tooltip">
					<p className="label">{label}</p>
					<p className="intro">{count}</p>
				</div>
			);
		}

		return null;
	};

	return (
		<div className={"tutor-chart-main " + className} key={dataKey}>
			<div className="tutor-chart-main-inner">
				<div className="tutor-chart">
					{!noHeading && <h1>{dataKey === "hours" ? "Call Duration" : "Doubts Cleared"}</h1>}
					<div className="tutor-chart-timeline">
						<DateRangeIcon className="date-range-icon"/>{" "}
						<DurationDropdown
							durationObj={durationObj}
							setDurationObj={setDurationObj}
						/>
					</div>

					<ResponsiveContainer
						width="100%"
						height={isLargeScreen && inBrowser ? "85%" : "100%"}
						className="tutor-chart-container"
					>
						<AreaChart
							width={500}
							height={400}
							data={miniChartData}
							margin={{
								top: 25,
								right: 10,
								left: 10,
								bottom: 10,
							}}
						>
							<defs>
								<linearGradient id={dataKey} x1="0" y1="0" x2="0" y2="0">
									<stop
										offset="5%"
										stopColor={strokes[dataKey]}
										stopOpacity={0.15}
									/>
									<stop
										offset="95%"
										stopColor={strokes[dataKey]}
										stopOpacity={0.15}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDashArray="3 3"
								vertical={false}
								style={{stroke: "rgba(128, 128, 128, 0.2"}}
							/>
							<XAxis
								dataKey="date"
								tickLine={false}
								style={{stroke: "rgba(128, 128, 128, 0.5"}}
								hide
							/>
							<YAxis axisLine={false} tickLine={false} mirror/>
							<Tooltip
								content={<CustomTooltip active={undefined} payload={undefined} label={undefined}/>}
								cursor={true}
								position={{x: "auto", y: 0}}
							/>
							<Area
								type={"monotone"}
								dataKey={dataKey}
								stackId="1"
								stroke={strokes[dataKey]}
								strokeWidth={4}
								fill={`url(#${dataKey})`}
								activeDot={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

function formatInTwoDigits(num) {
	return +num > 9 ? num : "0" + num;
}

const lastLocation = {pathname: '/classroom'}

export default function Home() {
	const [sessionsToday, setSessionsToday] = useState([]);
	const [sectionHighlighted, setSectionHighlighted] =
		useContext(UserContext).sectionHighlighted;
	const [, setisContinueWatching] = useState(false);
	const router = useRouter();
	const isStandardGrade = useStandardGrade();

	const [user] = useContext(UserContext).user;
	const [isDark] = useContext(ThemeContext).theme;
	const [isUserPro] = useContext(UserContext).tier;
	const isMounted = useIsMounted();
	const [openPustackCare] = useContext(UserContext).openPustackCare;
	const [unreadCareMsgCount] = useContext(UserContext).unreadCareMsgCount;
	const [openWelcome, setOpenWelcome] = useContext(IntroContext).openWelcome;
	const [callDuration, setCallDuration] = useState(0);
	const [sessionCount, setSessionCount] = useState(0);

	const [openFreeTrial, setOpenFreeTrial] =
		useContext(IntroContext).openFreeTrial;
	const [trialType, setTrialType] = useContext(IntroContext).trialType;

	const [stepsEnabled, setStepsEnabled] = useState(false);

	const [chartData, setChartData] = useState(null);
	const [chartData1, setChartData1] = useState(null);
	const [ongoingSessions, setOngoingSessions] = useState(null);
	const [requestedSessions, setRequestedSessions1] = useState([]);
	const [requestedSessions1, setRequestedSessions] = useState(null);
	const [completedSessions, setCompletedSessions1] = useState([]);
	const [completedSessions1, setCompletedSessions] = useState(null);
	const [noMoreCompletedSessions, setNoMoreCompletedSessions] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const isTabletScreen = useMediaQuery({query: "(max-width: 1024px)"});
	const [mobileOpen, setMobileOpen] = useState(false);
	const [sessionSelected, setSessionSelected] = useState(null);
	const [inBrowser, setInBrowser] = useState(false);

	const [activeSessions, setActiveSessions] = useState(null);
	const [pastSessions, setPastSessions] = useState(null);
	const [last30DaysSessions, setLast30DaysSessions] = useState(null);
	const [loadingStatus, setLoadingStatus] = useState(null);
	const [activeGraph, setActiveGraph] = useState(0);
	const [videos, setVideos] = useState(null);

	useEffect(() => {
		setInBrowser(true);
	}, []);

	const [durationObj, setDurationObj] = useState({
		name: "Last 30 days",
		index: 0,
		month: null,
		year: null,
	});

	const [durationObj1, setDurationObj1] = useState({
		name: "Last 30 days",
		index: 0,
		month: null,
		year: null,
	});

	const moveForward = () => activeTab < videos.length - 1 && setActiveTab(activeTab + 1);
	const moveBackward = () => activeTab > 0 && setActiveTab(activeTab - 1);

	function formDateFromStr(str) {
		const splitted = str.split("_");
		const year = splitted[0];
		const month = splitted[1] - 1;
		const d = splitted[2] ?? 1;
		return new Date(year, month, d);
	}

	const formatDate = (dateStr: string, formatStr?: string) => {
		if (dateStr) {
			return format(formDateFromStr(dateStr), formatStr ?? "MMM, do yyyy");
		} else return format(new Date(), formatStr ?? "MMM, do yyyy");
	};

	const getDaysInMonth = (month, year) => {
		let date = new Date(year, month - 1, 1);
		let days = [];
		while (date.getMonth() === month - 1) {
			days.push(`${year}_${month}_${new Date(date).getDate()}`);
			date.setDate(date.getDate() + 1);
		}
		return days;
	};

	const last30Days = async () => {
		const today = await castIndianTime();

		let dates = [];
		for (let i = 0; i < 30; i++) {
			const priorDate = new Date().setDate(today.getDate() - i);
			const date = new Date(priorDate).getDate();
			const month = new Date(priorDate).getMonth() + 1;
			const year = new Date(priorDate).getFullYear();
			dates.push(year + "_" + month + "_" + date);
		}

		return dates.reverse();
	};

	useEffect(() => {
		setLoadingStatus('videos')
		getVimeoVideos()
			.then(videosList =>  {
				if(isMounted) {
					setVideos(videosList)
					setLoadingStatus(false);
				}
			})
	}, [isMounted])

	const introSteps = [
		{
			element: ".home-sidebar-menu",
			intro:
				"At PuStack you can learn, practice and get tips to excel in your favorite subjects",
			position: "right",
		},
		{
			element: ".home-main-inner",
			intro:
				"You can learn with the video classes by top teachers from all over India",
			position: "left",
		},
		{
			element: "#doubtIntro",
			intro: "Lets move onto doubt forum.",
			position: "bottom",
		},
	];

	const isLargeScreen = useMediaQuery({query: "(min-width: 500px)"});

	const elementsArray = ["learn", "tips", "practice"];

	// useEffect(() => {
	//   setTimeout(() => setOpenFreeTrial(true), 4000);
	// }, []);

	useEffect(() => {
		getTodaySessions();

		window.scrollTo(0, 0);
	}, [user?.grade]);

	useEffect(() => {
		setLoadingStatus('ongoing+request');
		if (!user || !user.uid) return () => {};
		let unsubscribe1 = require('../firebase-config.js').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.where("session_status", "==", "accepted")
			.where("student_id", "==", user.uid)
			.orderBy("last_message_ts", "desc")
			.limit(3)
			.onSnapshot((snapshot) => {
				const requests = [];
				snapshot.docs.map((item) =>
					requests.push({ref: item.ref, ...item.data()})
				)
				setLoadingStatus(false);
				setOngoingSessions(requests);
			});
		let unsubscribe2 = require('../firebase-config.js').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.where("session_status", "==", "outstanding")
			.where("student_id", "==", user.uid)
			.orderBy("requested_ts", "desc")
			.limit(10)
			.onSnapshot((snapshot) => {
				const requests = [];
				snapshot.docs.map((item) =>
					requests.push({ref: item.ref, ...item.data()})
				);
				setLoadingStatus(false);
				setRequestedSessions(requests);
			});

		return () => {
			unsubscribe1();
			unsubscribe2();
		}
	}, [user?.uid])

	const fetchMoreRequestedSessions = useCallback(async () => {
		if (!requestedSessions || !requestedSessions.length > 0 || !user?.uid) return;
		return require('../firebase-config.js').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.orderBy("requested_ts", "desc")
			.where("session_status", "==", "outstanding")
			.where("student_id", "==", user.uid)
			.where("requested_ts", "<", requestedSessions.at(-1).requested_ts)
			.limit(10)
			.get()
			.then((snapshot) => {
				const requests = [];
				snapshot.docs.map((item) =>
					requests.push({ref: item.ref, ...item.data()})
				);
				setRequestedSessions(c => [...c, ...requests]);
				return requests.length > 0;
			});
	}, [requestedSessions, user?.uid])

	const fetchMoreCompletedSessions = useCallback(async () => {
		if (!completedSessions || !(completedSessions.length > 0) || !user?.uid) return;
		return require('../firebase-config.js').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.where("session_status", "==", "completed")
			.where('instructor_id', '!=', null)
			.where("student_id", "==", user?.uid)
			// .where("completed_ts", "<", completedSessions.at(-1).completed_ts)
			.orderBy("instructor_id")
			.orderBy("completed_ts", "desc")
			.startAfter(completedSessions.at(-1).item)
			.limit(10)
			.get()
			.then((snapshot) => {
				const requests = [];
				snapshot.docs.map((item) =>
					requests.push({item, ...item.data()})
				);
				setCompletedSessions(c => [...c, ...requests]);
				setNoMoreCompletedSessions(!(requests.length > 0 && requests.length >= 10));
			});
	}, [completedSessions, user?.uid])

	useEffect(() => {
		if (!ongoingSessions || !requestedSessions) {
			setActiveSessions(null);
			return () => {};
		}
		setActiveSessions(ongoingSessions.length + requestedSessions.length);
	}, [ongoingSessions, requestedSessions]);

	useEffect(() => {
		if (!user || !user.uid) return () => {};
		setLoadingStatus('past');
		let unsubscribe = require('../firebase-config.js').db
			.collection('/blaze_dev/collections/students')
			.doc(user.uid)
			.onSnapshot(snapshot => {
				if (snapshot.exists) {
					setPastSessions(snapshot.data().session_count);
				}
				setLoadingStatus(false);
			})

		return () => unsubscribe();
	}, [user?.uid])

	useEffect(() => {
		if (!user || !user.uid) return () => {};
		setLoadingStatus('completed');
		let unsubscribe = require('../firebase-config.js').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.where("session_status", "==", "completed")
			.where('instructor_id', '!=', null)
			.where("student_id", "==", user?.uid)
			.orderBy("instructor_id")
			.orderBy("completed_ts", "desc")
			.limit(10)
			.onSnapshot((snapshot) => {
				const requests = [];
				snapshot.docs.map((item) =>
					requests.push({item, ...item.data()})
				);
				setLoadingStatus(false);
				setCompletedSessions(requests);
				setNoMoreCompletedSessions(!(requests.length >= 10));
			});

		return () => unsubscribe();
	}, [user?.uid])

	const getTodaySessions = async () => {
		let _sessions = await fetchTodayUpcomingSessions(user?.grade, isUserPro)

		setSessionsToday(_sessions);

	};

	const handleDrawerToggle = (event) => {
		if (event.key === "Tab" || event.key === "Shift") return;

		setMobileOpen(false);
	};

	// const lastLocation = useLastLocation();

	useEffect(() => {
		if (lastLocation?.pathname === "/classroom") {
			let beaconBody = null;

			if (localStorage.getItem("beaconBody")) {
				beaconBody = JSON.parse(localStorage.getItem("beaconBody"));
			}

			if (beaconBody) {

				// Keys must present and are not null/undefined
				if (beaconBody.latestEngagement) {
					const requiredKeys = ['category_id', 'chapter_description', 'chapter_hex_color', 'chapter_id', 'chapter_illustration_art', 'chapter_name', 'completed_lecture_count', 'subject_id', 'total_lecture_count']
					const isValidObj = AppValidate.requiredAll(beaconBody.latestEngagement, requiredKeys);

					if (!isValidObj) {
						beaconBody.latestEngagement = null;
					}
				}

				navigator.sendBeacon(
					"https://us-central1-avian-display-193502.cloudfunctions.net/updateUserEngementData",
					JSON.stringify(beaconBody)
				);

				localStorage.setItem("beaconBody", null);
			}
		}

		if (lastLocation?.pathname === "/tips") {
			let beaconBody = null;

			if (localStorage.getItem("tipsBeaconBody")) {
				beaconBody = JSON.parse(localStorage.getItem("tipsBeaconBody"));
			}

			if (beaconBody) {
				navigator.sendBeacon(
					"https://us-central1-avian-display-193502.cloudfunctions.net/updateUserTipsEngagement",
					JSON.stringify(beaconBody)
				);

				localStorage.setItem("tipsBeaconBody", null);
			}
		}

		if (lastLocation?.pathname === "/practice") {
			let beaconBody = null;

			if (localStorage.getItem("practiceBeaconBody")) {
				beaconBody = JSON.parse(localStorage.getItem("practiceBeaconBody"));
			}

			if (beaconBody) {
				navigator.sendBeacon(
					"https://us-central1-avian-display-193502.cloudfunctions.net/updateUserPracticeEngagement",
					JSON.stringify(beaconBody)
				);

				localStorage.setItem("practiceBeaconBody", null);
			}
		}

		if (lastLocation?.pathname.includes("/classes")) {
			let beaconBody = null;

			if (localStorage.getItem("liveSessionsBeaconBody")) {
				beaconBody = JSON.parse(localStorage.getItem("liveSessionsBeaconBody"));
			}

			if (beaconBody) {
				navigator.sendBeacon(
					"https://us-central1-avian-display-193502.cloudfunctions.net/updateUserLiveSessionsEngagement",
					JSON.stringify(beaconBody)
				);

				localStorage.setItem("liveSessionsBeaconBody", null);
			}
		}
	}, [lastLocation]);

	const onExit = () => {
		setStepsEnabled(false);
		setOpenWelcome(false);
	};

	const getLast30Days = async (isCallDuration?) => {
		const lifetimeData = await getInstructorLifetimeEngagement({
			instructorId: user?.uid,
			setLoadingStatus
		});

		const _30days = await last30Days();

		let callDuration = 0, sessions = 0;

		const _chartData1 = _30days.reduce((acc, cur) => {
			callDuration += lifetimeData && lifetimeData[cur]?.call_duration ? lifetimeData[cur].call_duration : 0;
			sessions += lifetimeData && lifetimeData[cur]?.session_count ? lifetimeData[cur].session_count : 0;
			acc.push({
				date: formatDate(cur),
				hours: lifetimeData && lifetimeData[cur]?.call_duration ? lifetimeData[cur].call_duration / 60 : 0,
				sessions: lifetimeData && lifetimeData[cur]?.session_count ? lifetimeData[cur].session_count : 0
			});
			return acc;
		}, []);

		setLast30DaysSessions(sessions);

		!isCallDuration ? setCallDuration(callDuration / 60) : setSessionCount(sessions);

		isCallDuration ? setChartData(_chartData1) : setChartData1(_chartData1);
	}

	const getEngagement = async (isCallDuration?) => {
		let obj = isCallDuration ? durationObj1 : durationObj;

		const lifetimeData = await getInstructorLifetimeEngagement({
			instructorId: user?.uid,
			year: obj.year,
			setLoadingStatus
		});

		const _daysInMonth = getDaysInMonth(obj.month, obj.year);

		let callDuration = 0, sessions = 0;

		const _chartData1 = _daysInMonth.reduce((acc, cur) => {
			callDuration += lifetimeData && lifetimeData[cur]?.call_duration ? lifetimeData[cur].call_duration : 0;
			sessions += lifetimeData && lifetimeData[cur]?.session_count ? lifetimeData[cur].session_count : 0;
			acc.push({
				date: formatDate(cur),
				hours: lifetimeData && lifetimeData[cur]?.call_duration ? lifetimeData[cur].call_duration / 60 : 0,
				sessions: lifetimeData && lifetimeData[cur]?.session_count ? lifetimeData[cur].session_count : 0
			});
			return acc;
		}, []);

		!isCallDuration ? setCallDuration(callDuration / 60) : setSessionCount(sessions);
		isCallDuration ? setChartData(_chartData1) : setChartData1(_chartData1);
	};

	const getLifeTimeEngagement = async (isCallDuration?) => {

		const ist = await castIndianTime();

		const lifetimeData = await getInstructorLifetimeEngagement({
			instructorId: user?.uid,
			year: 'all',
			setLoadingStatus
		});

		const sortedKeys = Object.keys(lifetimeData).sort((a, b) => {
			let [y1, m1] = a.split('_');
			let [y2, m2] = b.split('_');

			if (y1 < y2) return -1;
			if (y1 > y2) return 1;
			return +m1 - +m2
		});

		const firstDate = formDateFromStr(sortedKeys.at(0));
		firstDate.setMonth(firstDate.getMonth() - 1);
		sortedKeys.splice(0, 0, formatDateDoc(firstDate, true, true));
		firstDate.setMonth(firstDate.getMonth() - 1);
		sortedKeys.splice(0, 0, formatDateDoc(firstDate, true, true));
		firstDate.setMonth(firstDate.getMonth() - 1);
		sortedKeys.splice(0, 0, formatDateDoc(firstDate, true, true));

		const lastDate = formDateFromStr(sortedKeys.at(-1));
		if (lastDate.getFullYear() !== ist.getFullYear() || lastDate.getMonth() !== ist.getMonth()) {
			sortedKeys.push(formatDateDoc(ist, true, true));
		}

		let callDuration = 0, sessions = 0;

		const _chartData1 = sortedKeys.reduce((acc, key) => {
			callDuration += lifetimeData && lifetimeData[key]?.call_duration ? lifetimeData[key].call_duration : 0;
			sessions += lifetimeData && lifetimeData[key]?.session_count ? lifetimeData[key].session_count : 0;
			acc.push({
				date: formatDate(key, 'MMMM, yyyy'),
				hours: lifetimeData && lifetimeData[key]?.call_duration ? lifetimeData[key].call_duration / 60 : 0,
				sessions: lifetimeData && lifetimeData[key]?.session_count ? lifetimeData[key].session_count : 0
			});
			return acc;
		}, [])

		!isCallDuration ? setCallDuration(callDuration / 60) : setSessionCount(sessions);
		isCallDuration ? setChartData(_chartData1) : setChartData1(_chartData1);
	}

	useEffect(() => {
		// if (durationObj.index === 6) {
		if (durationObj.index === 6) {
			getLifeTimeEngagement();
			return;
		}
		if (durationObj.index === 0) {
			getLast30Days();
		} else {
			getEngagement();
		}
		// }
	}, [durationObj]);

	useEffect(() => {
		if (durationObj1.index === 6) {
			getLifeTimeEngagement(true);
			return;
		}
		if (durationObj1.index === 0) {
			getLast30Days(true);
		} else {
			getEngagement(true);
		}
		// }
	}, [durationObj1]);

	const sessionsCountLabel = useMemo(() => {
		if (ongoingSessions && ongoingSessions.length > 0) {
			return [formatInTwoDigits(ongoingSessions.length), 'Session' + (formatInTwoDigits(ongoingSessions.length) > 1 ? 's' : ''), 'In Progress']
		}
		if (requestedSessions && requestedSessions.length > 0) {
			return [formatInTwoDigits(requestedSessions.length), 'Session' + (formatInTwoDigits(requestedSessions.length) > 1 ? 's' : ''), 'Searching']
		}
		if (pastSessions && pastSessions > 0) {
			return [formatInTwoDigits(pastSessions), 'Session' + (formatInTwoDigits(pastSessions) > 1 ? 's' : ''), 'Completed']
		}
		return ["00", "Sessions", "Completed"]
	}, [activeSessions, pastSessions])

	return (
		<>
			{/*<Helmet>*/}
			{/*	<meta charSet="utf-8"/>*/}
			{/*	<title>PuStack</title>*/}
			{/*</Helmet>*/}
			{/*<NavbarContextProvider>*/}
			{/*	<Navbar setMobileOpen={setMobileOpen}/>*/}
			{/*</NavbarContextProvider>*/}
			<Steps
				enabled={stepsEnabled}
				steps={introSteps}
				initialStep={0}
				onExit={onExit}
				options={{hideNext: false, disableInteraction: true}}
			/>
			{/*<Hidden xlUp implementation="js">*/}
			{/*	<Drawer*/}
			{/*		variant="temporary"*/}
			{/*		open={mobileOpen}*/}
			{/*		onClose={handleDrawerToggle}*/}
			{/*		ModalProps={{keepMounted: true}}*/}
			{/*		className="drawer-wrapper"*/}
			{/*	>*/}
			{/*		<HomeSidebar*/}
			{/*			sectionSelected={sectionHighlighted}*/}
			{/*			setSectionSelected={setSectionHighlighted}*/}
			{/*			sessionsToday={sessionsToday}*/}
			{/*		/>*/}
			{/*	</Drawer>*/}
			{/*</Hidden>*/}

			<div className={"home" + (isStandardGrade ? '' : ' new-classes')} style={{overflow: stepsEnabled && "hidden"}}>
				{!isTabletScreen && inBrowser && (
					<div className="home-sidebar">
						<HomeSidebar
							sectionSelected={sectionHighlighted}
							setSectionSelected={setSectionHighlighted}
							sessionsToday={sessionsToday}
						/>
					</div>
				)}
				<div className={"home-main" + (isStandardGrade ? '' : ' new-classes')}>
					<div className="home-main-wrapper">

						<div className={"home-main-inner" + (isStandardGrade ? '' : ' grid-display') + (loadingStatus || !videos ? ' shimmer-effect' : '')}>
							{
								isStandardGrade !== null && (isStandardGrade ? (
									<>
										<HomePageCarouselSlider/>
										<LearnSection
											title={elementsArray[sectionHighlighted]}
											sectionId={sectionHighlighted}
										/>
									</>
								) : <>
									<div className="grid-card grid-card-1 counter upcoming-sessions-board">
										{loadingStatus ? <div style={{display: 'flex', alignItems: 'center'}}>
												<PustackShimmer
													style={{width: '50px', height: '50px', borderRadius: '50px', marginRight: '15px'}}/>
												<PustackShimmer
													style={{width: '50px', height: '50px', borderRadius: '6px', marginRight: '15px'}}/>
												<div>
													<PustackShimmer
														style={{width: '100px', height: '21px', borderRadius: '6px', marginBottom: '8px'}}/>
													<PustackShimmer style={{width: '100px', height: '21px', borderRadius: '6px'}}/>
												</div>
											</div> :
											<>
												<div className="upcoming-sessions">
													<div className="upcoming-calendar">
														<EventAvailable/>
													</div>
													<div className="ongoing-session-number">
														<h2>{sessionsCountLabel[0]}</h2>
														<div className="upcoming-calendar-label">
															<h1>
																{sessionsCountLabel[1]}
															</h1>
															<h5>{sessionsCountLabel[2]}</h5>
														</div>
													</div>
												</div>
												<div
													className="ongoing-sessions-list fadeIn"
													style={{
														marginRight: ongoingSessions?.length === 3 ? "-60px" : 0,
													}}
												>
													{
														((!ongoingSessions || !(ongoingSessions?.length > 0)) && isLargeScreen && inBrowser) && (
															<BookSession onBeforeClickStuff={() => router.push('/blaze')}
															             className="ongoing-sessions-list-request-btn">
																<img src={flashSvg} width={20} height={20} alt="Blaze Icon"/>
																<span>Request</span>
															</BookSession>
														)
													}
													{isLargeScreen && inBrowser && ongoingSessions?.map((item) =>
														<BlazeOnGoingCard
															onClick={() => router.push(`/blaze/chat/${item.id}`)}
															skill={item.skill}
															title={item.topic}
															sessionId={item.id}
															studentId={user?.uid}
															instructorId={item.instructor_id}
															instructorName={item.instructor_name}
															gradient={item.subject_color_gradient}
															instrcutorImage={item.instructor_profile_pic}
														/>
													)}
													{((!isLargeScreen && inBrowser && (activeSessions > 0 || pastSessions > 0 || last30DaysSessions > 0)) || ongoingSessions?.length === 3) && (
														<div className="show-all-btn">
															<div
																className="show-all-content"
																onClick={() => router.push("/blaze")}
															>
																<h1>See all</h1>
															</div>
														</div>
													)}
												</div>
											</>}
									</div>
									{(!isLargeScreen && inBrowser && ongoingSessions?.length > 0) &&
                    <div className="grid-card grid-card-1 upcoming-sessions-board sm" style={{overflow: 'auto hidden'}}>
                      <div className="ongoing-sessions-list">
												{loadingStatus ? <div style={{display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
														<PustackShimmer
															style={{width: '160px', height: '62px', borderRadius: '6px', marginRight: '8px'}}/>
														<PustackShimmer
															style={{width: '160px', height: '62px', borderRadius: '6px', marginRight: '8px'}}/>
														<PustackShimmer style={{width: '160px', height: '62px', borderRadius: '6px'}}/>
													</div> :
													ongoingSessions?.map((item) => {
														return (
															<BlazeOnGoingCard
																key={item.id}
																skill={item.skill}
																title={item.topic}
																onClick={() => router.push(`/blaze/chat/${item.id}`)}
																sessionId={item.id}
																studentId={user?.uid}
																instructorId={item.instructor_id}
																instructorName={item.instructor_name}
																gradient={item.subject_color_gradient}
																instrcutorImage={item.instructor_profile_pic}
															/>
														)
													})}
                      </div>
                    </div>}
									{loadingStatus ?
										<div className="grid-card grid-card-2" style={{gridColumn: '1 / 7'}}>
											<div>
												<div className="grid-card-header">
													<PustackShimmer
														style={{width: '30px', height: '30px', borderRadius: '200px', marginRight: '8px'}}/>
													<PustackShimmer style={{width: '120px', height: '25px', borderRadius: '4px'}}/>
												</div>
												<div className="number-meter">
													<PustackShimmer
														style={{width: '50px', height: '24px', borderRadius: '4px', marginRight: '8px'}}/>
													<PustackShimmer style={{width: '30px', height: '24px', borderRadius: '4px'}}/>
												</div>
												<PustackShimmer style={{width: '60px', height: '15px', borderRadius: '4px', marginTop: '5px'}}/>
											</div>
											<PustackShimmer style={{width: '100%', height: '200px', borderRadius: '4px', marginTop: '10px'}}/>
										</div> : (last30DaysSessions > 0) &&
                    <>
                      <div className="grid-card grid-card-2" onClick={!isLargeScreen ? () => setActiveGraph(0) : () => null} style={{
												backgroundColor: activeGraph === 0 && !isLargeScreen && inBrowser ? 'rgba(103,97,211,0.16)' : "var(--color-primary)"
											}}>
                        <div>
                          <div className="grid-card-header">
                            <WatchLater style={{fill: "#6761d3"}} />
                            <span>Call Duration</span>
                          </div>
                          <div className="number-meter">
                            <NumberMeter value={callDuration} useDecimal />
                            <span className="number-meter-unit">mins.</span>
                          </div>
                          <span className="grid-card-span">{durationObj.name}</span>
                        </div>
												{/*{!isLargeScreen && <DetailedChart*/}
												{/*  className={"sm"}*/}
												{/*  dataKey={"hours"}*/}
												{/*  miniChartData={chartData1 || []}*/}
												{/*  durationObj={durationObj}*/}
												{/*  setDurationObj={setDurationObj}*/}
												{/*/>}*/}
                      </div>
                      <div className="grid-card grid-card-3" onClick={!isLargeScreen ? () => setActiveGraph(1) : () => null} style={{
												backgroundColor: activeGraph === 1 && !isLargeScreen && inBrowser ? 'rgba(17,153,63,0.16)' : "var(--color-primary)"
											}}>
                        <div>
                          <div className="grid-card-header">
                            <svg
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch"
                              focusable="false"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              data-testid="VideoCameraFrontRoundedIcon"
                              style={{fill: "#11993f"}}
                            >
                              <path
                                d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l3.15 3.13c.31.32.85.09.85-.35V7.7c0-.44-.54-.67-.85-.35L18 10.48zM10 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8H6v-.57c0-.81.48-1.53 1.22-1.85.85-.37 1.79-.58 2.78-.58.99 0 1.93.21 2.78.58.74.32 1.22 1.04 1.22 1.85V16z"/>
                            </svg>
                            <span>Doubts Cleared</span>
                          </div>
                          <div className="number-meter">
                            <NumberMeter value={sessionCount} useDecimal={false}/>
                          </div>
                          <span className="grid-card-span">{durationObj1.name}</span>
                        </div>
												{/*{!isLargeScreen && <DetailedChart*/}
												{/*  className={"sm"}*/}
												{/*  dataKey={"sessions"}*/}
												{/*  miniChartData={chartData || []}*/}
												{/*  durationObj={durationObj1}*/}
												{/*  setDurationObj={setDurationObj1}*/}
												{/*/>}*/}
                      </div>
											{!isLargeScreen && inBrowser && <div className="grid-card grid-card-4">
                        <SwipeableViews
                          axis={"x"}
                          scrolling={"true"}
                          index={activeGraph}
                          containerStyle={{
														transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
													}}
                          onChangeIndex={(e) => setActiveGraph(e)}
                          style={{padding: activeGraph !== 0 ? '0 0 0 40px' : '0 40px 0 0'}}
                          slideStyle={{padding: 0}}
                        >
                          <div className="sm-analytics">
                            <DetailedChart
                              className={"sm"}
                              dataKey={"hours"}
                              miniChartData={chartData1 || []}
                              durationObj={durationObj}
                              setDurationObj={setDurationObj}
                              noHeading
                            />
                          </div>
                          <div className="sm-analytics">
                            <DetailedChart
                              className={"sm"}
                              dataKey={"sessions"}
                              miniChartData={chartData || []}
                              durationObj={durationObj1}
                              setDurationObj={setDurationObj1}
                              noHeading
                            />
                          </div>
                        </SwipeableViews>
                      </div>}
                      <div className="analytics-home grid-card-4">
                        <DetailedChart
                          dataKey={"hours"}
                          miniChartData={chartData1 || []}
                          durationObj={durationObj}
                          setDurationObj={setDurationObj}
                        />
                      </div>
                      <div className="analytics-home grid-card-5">
                        <DetailedChart
                          dataKey={"sessions"}
                          miniChartData={chartData || []}
                          durationObj={durationObj1}
                          setDurationObj={setDurationObj1}
                        />
                      </div>
                    </>
									}
									{!videos ? <VideoShimmer /> : <div className="tutor-tips grid-card grid-card-6">
										<div className="tutor-tips-head">
											<h3>Tips &amp; Tricks</h3>
											<div className="toggle-btn">
												<button
													onClick={moveBackward}
													className={activeTab === 0 ? "fadeOut" : ""}
												>
													<ArrowLeft/>
												</button>
												<div className="slide-number">
													<h6>{activeTab + 1}</h6>
													<h5> /{" " + videos.length}</h5>
												</div>
												<button
													onClick={moveForward}
													className={activeTab === videos.length - 1 ? "fadeOut" : ""}
												>
													<ArrowRight/>
												</button>
											</div>
										</div>
										<SwipeableViews
											axis={"x"}
											scrolling={"true"}
											index={activeTab}
											containerStyle={{
												transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
											}}
											onChangeIndex={(e) => setActiveTab(e)}
										>
											{videos.map((videoItem, ind) => {
												return (
													<div className="recommended-video" key={videoItem.id}>
														<VideoPlayer
															src={videoItem.link}
															thumbnail={videoItem.thumbnail}
															shouldPause={activeTab !== videoItem.id - 1}
														/>
														<div className="video-detail">
															<h1>{videoItem.title}</h1>
															<p>
																{videoItem.description}
															</p>
														</div>
													</div>
												)
											})}
										</SwipeableViews>
									</div>}
								</>)
							}
						</div>
						{isStandardGrade !== null && (isStandardGrade ? <ContinueWatchingSidebar/> : (isLargeScreen && inBrowser &&
              <div className="home-main-sidebar">
                <div className="home-main-sidebar-item requested">
                  <div className="home-main-sidebar-header">
                    <h2>Requested Sessions</h2>
                  </div>
                  <div className="outstanding-sessions-list">
										{requestedSessions === null &&
											Array(2)
												.fill(0)
												.map((_) => <BlazeCardLoader/>)}
										{requestedSessions?.length === 0 && (
											<div className="no__sessions fadeIn">
												<Lottie
													options={{animationData: EmptyBox, loop: false}}
													speed={0.45}
												/>
												<h4 style={{fontSize: '1.5em', textAlign: "center", color: 'var(--color-text)'}}>
													There are no requested sessions
												</h4>
											</div>
										)}
										{requestedSessions?.map((session) => (
											<BlazeStudentCard
												onClick={() => {
													// closeDrawer();
													// setIsChatOpen(true);
													// setSelectedSession(session);
													// setSelectedSessionId(session?.id);
												}}
												isSessionSelected={sessionSelected?.id === session?.id}
												key={session?.id}
												sessionId={session?.id}
												type="requested"
												topic={session?.topic}
												studentId={session?.student_id}
												instructorImage={session?.instructor_profile_pic}
												skill={session?.skill}
												chapter={session?.chapter}
												rating={session?.instructor_rating}
												instructorName={session?.instructor_name}
												gradient={session?.subject_color_gradient}
												unreadMsgCount={session?.student_unread_count}
											/>
											// <BlazeRequestCard
											//   key={session?.id}
											//   sessionData={session}
											//   topic={session?.topic}
											//   skill={session?.skill}
											//   sessionId={session?.id}
											//   reference={session?.ref}
											//   studentName={session?.student_name}
											//   setSessionSelected={setSessionSelected}
											//   gradient={session?.subject_color_gradient}
											//   studentImage={session?.student_profile_pic}
											//   isSessionSelected={sessionSelected === session?.id}
											// />
										))}
                  </div>
                </div>
                <InfiniteScroll
                  initialized={completedSessions !== null}
                  className="home-main-sidebar-item completed"
                  fetchMoreFn={fetchMoreCompletedSessions}
                  noMore={noMoreCompletedSessions}
                >
                  <div className="home-main-sidebar-header">
                    <h2>Completed Sessions</h2>
                  </div>
                  <div className="outstanding-sessions-list">
										{completedSessions === null &&
											Array(2)
												.fill(0)
												.map((_) => <BlazeCardLoader/>)}

										{completedSessions?.length === 0 && (
											<div className="no__sessions fadeIn">
												<Lottie
													options={{animationData: EmptyBox, loop: false}}
													speed={0.45}
												/>
												<h4 style={{textAlign: "center", fontSize: '1.5em', color: 'var(--color-text)'}}>
													There are no completed sessions
												</h4>
											</div>
										)}

										{completedSessions?.map((session) => (
											<BlazeStudentCard
												onClick={() => {
													// closeDrawer();
													// setIsChatOpen(true);
													// setSelectedSession(session);
													// setSelectedSessionId(session?.id);
												}}
												isSessionSelected={sessionSelected?.id === session?.id}
												sessionId={session?.id}
												key={session?.id}
												type="completed"
												topic={session?.topic}
												studentId={session?.student_id}
												instructorImage={session?.instructor_profile_pic}
												skill={session?.skill}
												chapter={session?.chapter}
												rating={session?.instructor_rating}
												instructorName={session?.instructor_name}
												gradient={session?.subject_color_gradient}
												unreadMsgCount={session?.student_unread_count}
												queryToAdd="completed=true"
											/>
										))}
                  </div>
                </InfiniteScroll>
              </div>))}
						{!isLargeScreen && inBrowser && (
							<ContinueWatchingCarousel
								setisContinueWatching={setisContinueWatching}
							/>
						)}
					</div>
				</div>
			</div>
			{openPustackCare && (
				<div className="pustack-care-chat">
					<PuStackCare/>
				</div>
			)}
			{!openPustackCare && unreadCareMsgCount > 0 && <PuStackCareChatPopup/>}

			<HomePageSubjectModal
				tabSelected={sectionHighlighted}
				setSectionHighlighted={setSectionHighlighted}
			/>
			<Dialog
				onClose={() => {
					setOpenFreeTrial(false);
					setTrialType(null);
				}}
				aria-labelledby="welcome"
				open={openFreeTrial && trialType}
				// open={true}
				className={
					isDark ? "welcome-dialog-wrapper2 dark" : "welcome-dialog-wrapper2"
				}
			>
				<div className="welcome-dialog">
					<div className="stars__background">
						<div className="stars"/>
						<div className="twinkling"/>
					</div>
					<CancelIcon
						className="close-welcome-dialog"
						onClick={() => {
							setOpenFreeTrial(false);
							setTrialType(null);
						}}
					/>
					<img
						className="logo"
						src={proLogoDark}
						alt="logo"
						draggable={false}
					/>
					<div className="astronaut">
						<Lottie options={{animationData: astronautLottie, loop: true}}/>
					</div>

					<img
						className="welcome-spacecraft"
						src={SpaceCraft}
						alt="spacecraft"
						draggable={false}
					/>
					<div className="welcome-text">
						<img
							className="welcome-background"
							src={HUD1}
							alt="hud"
							draggable={false}
						/>
						<h1>{trialType === "referred" ? "CONGRATULATIONS" : "WELCOME"}</h1>

						<h2>
							Enjoy {trialType === "referred" ? "30" : "7"} days of PuStack Pro
							for FREE
						</h2>
					</div>
				</div>
			</Dialog>
			{/*<Dialog*/}
			{/*  onClose={() => setOpenWelcome(false)}*/}
			{/*  aria-labelledby="simple-dialog-title"*/}
			{/*  open={isLargeScreen && openFreeTrial && openWelcome}*/}
			{/*  // open={true}*/}
			{/*  className="welcome-dialog-wrapper"*/}
			{/*>*/}
			{/*  <div className="welcome-dialog">*/}
			{/*    <CancelIcon*/}
			{/*      className="close-welcome-dialog"*/}
			{/*      onClick={() => setOpenWelcome(false)}*/}
			{/*    />*/}
			{/*    <img*/}
			{/*      className="welcome-background"*/}
			{/*      src={WelcomeBg}*/}
			{/*      alt="welcome"*/}
			{/*      draggable={false}*/}
			{/*    />*/}
			{/*    <img className="logo" src={logoDark2} alt="logo" draggable={false}/>*/}
			{/*    <div className="welcome-text">*/}
			{/*      <h1>Hey {user?.name?.split(" ")[0]}, </h1>{" "}*/}
			{/*      <h1>Welcome to PuStack!</h1>*/}
			{/*      <h2>*/}
			{/*        I'm PuStack, we are really happy to see you here. Let's start this*/}
			{/*        journey together.*/}
			{/*      </h2>*/}
			{/*      <div>*/}
			{/*        <button*/}
			{/*          onClick={() => {*/}
			{/*            setOpenWelcome(false);*/}
			{/*            setTimeout(() => setStepsEnabled(true), 500);*/}
			{/*          }}*/}
			{/*        >*/}
			{/*          Let's go!*/}
			{/*        </button>*/}
			{/*      </div>*/}
			{/*    </div>*/}
			{/*  </div>*/}
			{/*</Dialog>*/}
		</>
	);
}
