import React, {Suspense, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import Image from 'next/image';
// @ts-ignore
import {useMediaQuery} from 'react-responsive';
// @ts-ignore
import {usePageVisibility} from 'react-page-visibility';

import TopBarProgress from 'react-topbar-progress-indicator';
import {logOut} from '../services';
import {defaultPic} from '../public/assets';
import AuthClassroom from '../components/classroom/auth-classroom';
// import OnBoardingFlow from '../containers/boardingFlow';


import {ClassroomContext} from '../context/classroom';
import {ThemeContext} from '../context';
import {UserContext} from '../context/global/user-context';

// @ts-ignore
import proLogoDark from '../public/assets/images/proLogoDark.png';
// import "./style.scss";
import useQuery from '../hooks/query/useQuery';
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
const ChevronLeftIcon = dynamic(() => import('@material-ui/icons/ChevronLeft'))
// const TopBarProgress = dynamic(() => import('react-topbar-progress-indicator'))
// const PdfPreview = dynamic(() => import('../components/pdf-preview'))
// import PdfPreview from "../components/pdf-preview";

// import {
// 	ClassroomNavbar,
// 	ClassroomPlayer,
// 	ClassroomSidebar,
// } from "../components";
const ClassroomNavbar = dynamic(() => import('../components/classroom/navbar'))
const ClassroomPlayer = dynamic(() => import('../components/classroom/player'))
const ClassroomSidebar = dynamic(() => import('../components/classroom/sidebar'))


const getYoutubeID = (url) => {
	var regExp =
		/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	var match = url.match(regExp);
	return match && match[1].length === 11 ? match[1] : false;
};

class AppValidate {

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
		return Validate.isNotNull(value) && Validate.isNotUndefined(value)
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
			if(!Validate.isDefined(obj[key])) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}
}

const getCareMessageCount = ({ userId, grade }) => {
	return (require('../firebase-config')).db
		.collection("user_notifications")
		.doc(grade)
		.collection("user_notifications")
		.doc(userId);
};

const userImportantData = (userId) => {
	// .then((doc) => doc.data().tier === "pro");

	return (require('../firebase-config')).db.collection("users").doc(userId);
};


const userEngagementMapData = async ({ userId, grade, chapter_id }) => {
	if (chapter_id) {
		const category = chapter_id.split("_")[3];
		const subject = chapter_id.split("_")[4];

		let chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}_${subject}`;

		if (category === "maths") {
			chapterPath = `${grade}_learn_${category}_${grade}_learn_${category}`;
		}

		return await (require('../firebase-config')).db
			.collection("user_engagement")
			.doc(grade)
			.collection(userId)
			.doc(chapterPath)
			.collection(chapter_id)
			.doc("engagement_map")
			.get()
			.then((doc) => doc.data())
			.catch((error) => console.log(error));
	} else return null;
};

const userEngagementChapterData = async ({
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

		return await (require('../firebase-config')).db
			.collection("user_engagement")
			.doc(grade)
			.collection(userId)
			.doc(chapterPath)
			.get()
			.then((doc) => doc.data())
			.catch((error) => console.log(error));
	} else return null;
};

const getUserDailyEngagement = async ({ grade, userId, yearMonth }) => {
	return await (require('../firebase-config')).db
		.collection("user_engagement")
		.doc("daily_engagement")
		.collection(userId)
		.doc(yearMonth)
		.get()
		.then((doc) => {
			if (doc.exists) return doc.data();
			else return null;
		});
};

const getLectureItemsForChapter = async ({ grade, chapter_id }) => {
	const _category = chapter_id.split("_")[3];
	const _subject = chapter_id.split("_")[4];

	let subjectPath = `${grade}_learn_${_category}`;

	if (_category !== "maths" && _category !== "mathematics") {
		subjectPath = `${grade}_learn_${_category}_${_subject}`;
	}

	return await (require('../firebase-config')).db
		.collection("cms_data")
		.doc(grade)
		.collection("scope")
		.doc(`${grade}_learn`)
		.collection("category")
		.doc(`${grade}_learn_${_category}`)
		.collection("subject")
		.doc(subjectPath)
		.collection("chapter")
		.doc(chapter_id)
		.get()
		.then((doc) => {
			if (doc.exists) {
				let tabs = [];

				let _tabs_map = doc.data()._meta;

				_tabs_map.sort((a, b) => (a.serial_order > b.serial_order ? 1 : -1));

				for (var i = 0; i < _tabs_map?.length; i++) {
					tabs.push(_tabs_map[i]);
				}

				return [doc.data(), tabs];
			}

			return null;
		});
};

TopBarProgress.config({
	barColors: {
		0: "#bb281b",
		"1.0": "#bb281b",
	},
	shadowBlur: 5,
});

const schemaMarkUp = {
	"@context": "https://schema.org",
	"@type": ["VideoObject", "LearningResource"],
	"name": "An introduction to Genetics",
	"description": "Explanation of the basics of Genetics for beginners.",
	"learningResourceType": "Concept Overview",
	"educationalLevel": "Grade 8 (US)",
	"contentUrl": "https://www.example.com/video/123/file.mp4",
	"thumbnailUrl": [
		"https://example.com/photos/1x1/photo.jpg",
		"https://example.com/photos/4x3/photo.jpg",
		"https://example.com/photos/16x9/photo.jpg"
	],
	"uploadDate": "2016-03-31T08:00:00+08:00"
}

const changeUserGrade = async (userId: string, grade: string) => {
	return await require('../firebase-config').db
		.collection("users")
		.doc(userId)
		.set({ grade: grade }, { merge: true })
		.then(() => true)
		.catch(() => false);
};

let id = 'class_10_learn_science_physics_lightreflectionrefraction_chapter_reflectionoflight';

let headerItemId = 'class_10_learn_science_physics_lightreflectionrefraction_chapter_refractionoflight_convexlensuses';


export const getYoutubeThumbnailUrls = (videoId: string) => {
	return [
		'https://img.youtube.com/vi/' + videoId + '/0.jpg',
		'https://img.youtube.com/vi/' + videoId + '/1.jpg',
		'https://img.youtube.com/vi/' + videoId + '/2.jpg',
		'https://img.youtube.com/vi/' + videoId + '/3.jpg',
	]
}




// @ts-ignore
export default function ClassroomScreen({chapterItemFromServerProp, lectureItemFromServerProp, youtubeIdFromServerProp, isUser}) {
	// const location = useLocation();
	// const history = useHistory();
	const router = useRouter();
	const search = useQuery();
	const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
	const [user, setUser] = useContext(UserContext).user;

	/**
	 *
	 *
	 *
	 *
	 *
	 * @param grade
	 */

	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [userHasNoGrade, setUserHasNoGrade] = useContext(UserContext).userHasNoGrade;
	const [, setIsUserProTier] = useContext(UserContext).tier;
	const [isInstructor, setIsInstructor] = useContext(UserContext).isInstructor;
	const [checkedLoggedInStatus, setCheckedLoggedInStatus] = useState(false);
	const [isDarkMode, setIsDarkMode] = useContext(ThemeContext).theme;
	const [, setIsExternal] = useContext(UserContext).isExternal;
	const [, setUnreadCareMsgCount] = useContext(UserContext).unreadCareMsgCount;
	const [closeInstallApp, setCloseInstallApp] =
		useContext(UserContext).closeInstallApp;
	const [openPustackCare, setOpenPustackCare] =
		useContext(UserContext).openPustackCare;

	useEffect(() => {
		let path = window.location.pathname;

		if (path === "/app") {
			return (window.location.href = appGooglePlayLink);
		}

		if (localStorage.getItem("user")) {
			const _user = JSON.parse(localStorage.getItem("user"));
			setUser(_user);
			if(_user && !_user.grade) {
				setUserHasNoGrade(true);
			} else {
				setUserHasNoGrade(false);
			}

			if (_user) {
				try {
					setUserImportantDataFn(_user.uid);
					setUnreadMsgCountFn(_user);
				} catch (error) {
					setUser(null);
				}
			}

			if (localStorage.getItem("pustack-dark-theme") === "true") {
				try {
					setIsDarkMode(true);
				} catch (error) {
					setIsDarkMode(false);
				}
			}

			if (localStorage.getItem("closeInstallApp")) {
				setCloseInstallApp(true);
			}

			if (localStorage.getItem("isUserPro")) {
				setIsUserProTier(localStorage.getItem("isUserPro") === "true");
			}

			if (localStorage.getItem("isInstructor")) {
				setIsInstructor(localStorage.getItem("isInstructor") === "true");
			}

			if (localStorage.getItem("isExternalInstructor")) {
				setIsExternal(localStorage.getItem("isExternalInstructor") === "true");
			}
		} else {
			router.replace('/');
		}

		setCheckedLoggedInStatus(true);
	}, []);

	const setUserImportantDataFn = async (uid) => {
		const res = await userImportantData(uid);

		res.onSnapshot(async (snapshot) => {
			console.log('user - ', user, snapshot.data());
			// console.log('user?.has_rated_app, snapshot.data()?.has_rated_app - ', user?.has_rated_app, snapshot.data()?.has_rated_app)
			// if(user?.has_rated_app !== undefined && snapshot.data()?.has_rated_app !== user?.has_rated_app) return;
			if (snapshot.data() || "") {
				setIsUserProTier(snapshot.data()?.tier === "pro");
				setIsInstructor(snapshot.data()?.is_instructor);
				setIsExternal(snapshot.data()?.is_external_instructor || false);

				if(snapshot.data().is_deleted) {

					let fcmToken = localStorage.getItem("fcmToken");
					let isTokenRemoved = await removeFcmToken(snapshot.data().uid, fcmToken);

					if (isTokenRemoved) {
						let logout_success = await logOut();
						if (logout_success) {
							setUser(null);

							// loadingWrapper();

							localStorage.clear();
							localStorage.setItem("hideCookie", true);

							// window.location = "/";
						}
					}

					return;
				}

				let _user = JSON.parse(localStorage.getItem("user"));

				_user = { ..._user, ...snapshot.data() };

				if(!_user.profile_url) _user.profile_url = defaultPic;
				setUser(_user);

				localStorage.setItem(
					"user",
					JSON.stringify({
						uid: _user?.uid,
						grade: _user?.grade,
						name: _user?.name,
						profile_url: _user?.profile_url,
					})
				);

				localStorage.setItem(
					"isUserPro",
					JSON.stringify(snapshot.data()?.tier === "pro")
				);
				localStorage.setItem(
					"isInstructor",
					JSON.stringify(snapshot.data()?.is_instructor)
				);
				localStorage.setItem(
					"isExternalInstructor",
					JSON.stringify(snapshot.data()?.is_external_instructor || false)
				);
			} else {
				if (navigator.onLine) {
					setUser(null);
					setIsUserProTier(false);
					setIsInstructor(false);
					localStorage.clear();
					localStorage.setItem("hideCookie", true);
					window.location = "/";
				}
			}
		});
	};

	const setUnreadMsgCountFn = async (_user) => {
		(await getCareMessageCount({ userId: _user?.uid, grade: _user?.grade })).onSnapshot(
			(snapshot) => {
				const count = snapshot.data()?.unread_care_message_count;

				setUnreadCareMsgCount(count);

				if (count > 0) {
					!isSmallScreen && setOpenPustackCare(true);
					// TODO: Load mp3
					// if (!openPustackCare) {
					//   let audio = new Audio(newMsgAudio);
					//   audio.play();
					// }
				}
			},
			(error) => console.log(error)
		);
	};


	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 * @param grade
	 */

	if(!user) return null;

	return (
		<AuthClassroom />
	)
}
