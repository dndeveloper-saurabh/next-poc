import React, {useEffect, useState} from 'react';
// const Tab = dynamic(() => import('@material-ui/core/Tab'));
// const Tabs = dynamic(() => import('@material-ui/core/Tabs'));
// const SwipeableViews = dynamic(() => import('react-swipeable-views'));
// import classes from './no_auth_classroom.module.scss'
import Plyr from "plyr-react";
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { logoDark } from "../public/assets";
import {NextPageContext} from 'next';
// const Plyr = dynamic(() => import('plyr-react'));

const getYoutubeThumbnailUrls = (videoId: string) => {
	return [
		'https://img.youtube.com/vi/' + videoId + '/0.jpg',
		'https://img.youtube.com/vi/' + videoId + '/1.jpg',
		'https://img.youtube.com/vi/' + videoId + '/2.jpg',
		'https://img.youtube.com/vi/' + videoId + '/3.jpg',
	]
}

const getYoutubeID = (url) => {
	var regExp =
		/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	var match = url.match(regExp);
	return match && match[1].length === 11 ? match[1] : false;
};

const getReferenceOfTheLectureItemById = async (id: string): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null> => {
	let items = id.split('_');
	if(items[0] !== 'class') return null;
	const grade = items[0] + '_' + items[1];
	items = items.slice(2);
	let steps = ['scope', 'category', 'subject', 'chapter', 'tab', 'lecture_item', 'lecture_header_item'];
	let response = await getReferenceOfTheChapterById(id);
	if(!response) return null;
	let {ref, skippable} = response;
	const length = skippable ? items.length + 1 : items.length;
	for(let i = 4; i < length; i++) {
		let itemId = grade + '_' + items.slice(0, i+1).join('_');
		if(skippable) {
			itemId = grade + '_' + items.slice(0, i).join('_');
		}
		ref = ref.collection(steps[i])
			.doc(itemId);
	}

	return ref;
}

const getReferenceOfTheChapterById = async (id: string): Promise<{ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, skippable: boolean} | null> => {
	let items = id.split('_');
	if(items[0] !== 'class') return null;
	const grade = items[0] + '_' + items[1];
	items = items.slice(2);
	let steps = ['scope', 'category', 'subject', 'chapter', 'tab', 'lecture_item', 'lecture_header_item'];
	let ref = (await import('../firebase-admin')).firebaseAdmin.firestore().collection('cms_data')
		.doc(grade);

	let categoryRef = (await import('../firebase-admin')).firebaseAdmin.firestore().collection('cms_data')
		.doc(grade);

	for(let i = 0; i < 2; i++) {
		const itemId = grade + '_' + items.slice(0, i + 1).join('_');
		categoryRef = categoryRef.collection(steps[i])
			.doc(itemId);
	}

	let skippable = false;
	const snapshot = await categoryRef.get();
	if(!snapshot.exists) return null;

	const data = snapshot.data();

	if(!data) return null;

	if(data.skippable) {
		skippable = true;
	}

	for(let i = 0; i < 4; i++) {
		let itemId = grade + '_' + items.slice(0, i + 1).join('_');
		if(skippable && i === 2) {
			itemId = grade + '_' + items.slice(0, 2).join('_');
		}
		if(skippable && i > 2) {
			itemId = grade + '_' + items.slice(0, i).join('_');
		}
		ref = ref.collection(steps[i])
			.doc(itemId);
	}
	return {ref, skippable};
}

// const getCookie = (cookieString: string, cookieName: string): string | null | undefined => {
// 	let arr = cookieString.split("=")
// 	let ind = arr.findIndex(c => c.includes(cookieName));
// 	if(ind < 0) return null;
// 	return arr[ind + 1];
// }

export async function getServerSideProps(context: NextPageContext ) {
	// Fetch data from external API
	// const res = await fetch(`https://.../data`)
	// const data = await res.json()

	const itemId = context.query.item_id;
	// return {props: {isUser: true}}
	//
	// const cookie = context.req.headers.cookie;
	//
	// const tokenValue = getCookie(cookie, 'fsToken');
	//
	// console.log('tokenValue - ', tokenValue);

	// if(tokenValue) {
		try {
			// const headers: HeadersInit = {
			// 	'Content-Type': 'application/json',
			// 	'Authorization': JSON.stringify({ token: tokenValue })
			// };
			//
			// const protocol = context.req.headers['x-forwarded-proto'] || 'http'
			// const baseUrl = context.req ? `${protocol}://${context.req.headers.host}` : ''
			//
			// const result = await fetch(baseUrl + '/api/validate', { headers });
			// // return { props: {...result} };
			// const json = await result.json();

			if(!itemId) {
				return {props: {isUser: true}}
			}

			const lectureItemRef = await getReferenceOfTheLectureItemById(itemId instanceof Array ? itemId[0] : itemId);
			// const chapterRef = await getReferenceOfTheChapterById(itemId);

			// if(!chapterRef) return {props: {error: "Unable to get chapter reference"}};
			if(!lectureItemRef) return {props: {error: "Unable to get lectureItem reference"}};

			console.log('lectureItemRef - ', lectureItemRef.path);

			// Get chapter item
			// const chapterItem = (await chapterRef.ref.get()).data();

			// Get lecture item
			const lectureItem = (await lectureItemRef.get()).data();

			// @ts-ignore
			const youtubeUrl = lectureItem.youtube_url;
			const youtubeId = getYoutubeID(youtubeUrl);

			// Pass data to the page via props
			return { props: { chapterItem: {}, lectureItem, youtubeId, context: 'json' } }
		} catch (e) {
			console.log('e - ', e);
			// let exceptions fail silently
			// could be invalid token, just let client-side deal with that
		}
	// }
	// return {
	// 	redirect: {
	// 		permanent: false,
	// 		destination: '/'
	// 	}
	// }
}

const CheckIconImage = (
	<svg width="191.667" height="191.667" xmlns="http://www.w3.org/2000/svg">
		<metadata id="metadata870">image/svg+xml</metadata>

		<g>
			<title>Layer 1</title>
			<path fill="#cccccc" strokeWidth="0.66292" id="path833" d="m95.833,32.3036c-35.03,0 -63.52957,28.49891 -63.52957,63.52957c0,35.03066 28.49957,63.53023 63.52957,63.53023c35.03,0 63.52957,-28.49957 63.52957,-63.53023c0,-35.03066 -28.49891,-63.52957 -63.52957,-63.52957zm36.4798,52.79889l-39.9124,39.9124c-1.69707,1.69707 -3.95299,2.63112 -6.35276,2.63112c-2.39977,0 -4.65568,-0.93405 -6.35276,-2.63112l-20.34168,-20.34169c-1.69708,-1.69707 -2.63179,-3.95299 -2.63179,-6.35276c0,-2.40043 0.93471,-4.65634 2.63179,-6.35342c1.69641,-1.69707 3.95232,-2.63179 6.35276,-2.63179c2.39977,0 4.65634,0.93472 6.35276,2.63245l13.98826,13.98761l33.55898,-33.55898c1.69708,-1.69707 3.95299,-2.63113 6.35276,-2.63113c2.39977,0 4.65568,0.93406 6.35276,2.63113c3.50419,3.50419 3.50419,9.20331 0.00089,12.70618l0.00043,0z"/>
			<g id="g835"/>
			<g id="g837"/>
			<g id="g839"/>
			<g id="g841"/>
			<g id="g843"/>
			<g id="g845"/>
			<g id="g847"/>
			<g id="g849"/>
			<g id="g851"/>
			<g id="g853"/>
			<g id="g855"/>
			<g id="g857"/>
			<g id="g859"/>
			<g id="g861"/>
			<g id="g863"/>
		</g>
	</svg>
)

const data = [
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

export default function NoAuthClassRoomPage({lectureItem, youtubeId}) {

	const tags = lectureItem.generated_tags.reduce((acc, curr, ind) => {
		acc += curr;

		if(ind !== lectureItem.generated_tags.length - 1) acc += ', '

		return acc
	}, '');

	return (
		<div className="classroom__screen__wrapper">
			<Head>
				<title>{lectureItem.chapter_name + " | PuStack"}</title>
				<meta name="keywords" content={`${lectureItem.chapter_name}, ${tags}, pustack, classroom, lectures`} />
				<meta name="description" content={lectureItem.image_content} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": 'VideoObject',
							contentUrl: 'https://www.youtube.com/watch?v=' + youtubeId,
							name: lectureItem.lecture_header_item_name ?? lectureItem.lecture_item_name,
							thumbnailUrl: getYoutubeThumbnailUrls(youtubeId),
							description: lectureItem.image_content,
							learningResourceType: 'Lecture',
							educationalLevel: lectureItem.grade_name,
							uploadDate: new Date(2018, 10, 10).toISOString()
						})}}
				/>
			</Head>
			<div className="classroom__navbar">
				<Link href="/">
					<div className="classroom__logo">
						<Image height={100} width={100} className="header__leftImage" src={logoDark} alt="PuStack" draggable={false} />
					</div>
				</Link>
				<div className="separator">|</div>
				<div className="classroom__chapter__name">{lectureItem.lecture_header_item_name ?? lectureItem.lecture_item_name}</div>{" "}
				<div className={"classroom__progress no_user"}>
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
				</div>
			</div>
			<div className="classroom__screen">
				<div className="classroom__content">
					{/*<ClassroomPlayer video_id={youtubeId} />*/}
					<div className={"classroom-player-wrapper"}>
						<Plyr
							source={{
								type: "video",
								// @ts-ignore
								sources: [{ src: youtubeId, provider: 'youtube' }],
							}}
						/>
					</div>
					<div className="classroom__breadcrumb">
						<h1>{lectureItem.lecture_header_item_name ? (lectureItem.lecture_header_item_name + ' | ' + lectureItem.lecture_item_name) : lectureItem.lecture_item_name } | {lectureItem.chapter_name}</h1>
	          {/*<p>{chapterItem?.description ?? ''}</p>*/}
          </div>
					{lectureItem.image_content && <DescriptionContent content={lectureItem.image_content}/>}
				</div>
				<div className="classroom__sidebar dark" data-nosnippet="">
					<div className={"tab_container"} style={{filter: 'blur(8px)', pointerEvents: 'none'}}>
						{data !== null &&
							data?.map((tab, index) => (
								<div className="tab_item" key={tab.tab_id}>
									<p>{tab.tab_name}</p>
								</div>
							))}
					</div>

					<div className="classroom__tabs__wrapper" style={{filter: 'blur(8px)', pointerEvents: 'none'}}>
						{data !== null && (
							data[0].lecture_items?.map((tab, index) => (
								<div className={"lecture_item"} key={tab?.lecture_item_id}>
									{CheckIconImage}
									<p>{tab?.lecture_item_name}</p>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	)

}

function DescriptionContent({content}) {
	const [isExpand, setIsExpand] = useState(false);

	return (
		<div className="classroom_text-content">
			<p className={isExpand ? 'expanded' : ''}>
				{content}
			</p>
			<button onClick={() => setIsExpand(c => !c)}>{isExpand ? 'Show less' : 'Show more'}</button>
		</div>
	)
}
