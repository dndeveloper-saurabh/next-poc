import React, {useContext, useState, useEffect, useCallback, useMemo, useRef} from "react";
import Modal from "react-modal";
import format from "date-fns/format";
import Lottie from "lottie-react-web";
import Confetti from "react-confetti";
// import {circularProgress, LockIcon, TimeSlotNotAvailable} from "../../public/assets";
// import { db } from "../../../firebase_config";
import Drawer from "@material-ui/core/Drawer";
import {loadScript} from "../../helpers";
import {castIndianTime} from '../../helpers/getIndianTime';
import CloseIcon from "@material-ui/icons/Close";
import { useMediaQuery } from "react-responsive";
import CancelIcon from "@material-ui/icons/Cancel";
import Image from 'next/image';
// TODO: Refactor react-use library
import useWindowSize from "react-use/lib/useWindowSize";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { ThemeContext, UserContext } from "../../context";
import MicrosoftLogo from '../../public/assets/images/microsoft-logo.png';
import ScholarshipPageLight from '../../public/assets/images/scholarship_page_background_light.svg';
import ScholarshipPageDark from '../../public/assets/images/scholarship_page_background_dark.svg';
import ScholarshipSuccessLottie from '../../public/assets/lottie/scholarship_success-1.json';

import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {
	EmailIcon,
	TwitterIcon,
	FacebookIcon,
	WhatsappIcon,
	TelegramIcon,
	EmailShareButton,
	TwitterShareButton,
	FacebookShareButton,
	TelegramShareButton,
	WhatsappShareButton,
} from "react-share";

import { referralImage } from "../../public/assets";

import proBg1 from "../../public/assets/images/film_1.jpg";
import proBg2 from "../../public/assets/images/film_2.jpg";
import proBg3 from "../../public/assets/images/film_3.jpg";
import PuStackWhiteLogo from "../../public/assets/images/logoDark.png";
import PuStackLightLogo from "../../public/assets/images/logo.png";
import circleProg from "../../public/assets/lottie/circularProgress.json";
import CheckCircleIcon from "../../public/assets/images/icons/check-circle.svg";
import {ErrorOutline, LibraryBooks, School} from "@material-ui/icons";
import Carousel from "react-material-ui-carousel";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SwipeableViews from "react-swipeable-views";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
//TODO: Implement form select

// import {SessionFormSelect} from "../../../components/livesessions/sessionform-input";
import {getAvailableGrades} from "../../helpers";
import useForm, {Validators} from "../../hooks/form";
import PustackButton from "../../components/global/PustackButton";
import {Dialog} from "@material-ui/core";
// import {ScholarshipInput} from "./scholarship-input";
import useStandardGrade from "../../hooks/isStandardGrade";
import Axios from 'axios';
import useInBrowser from '../../hooks/useInBrowser';

// Commented out code will be used later, when the embargo is lifted

// TODO: Refactor generateInvitationLink
const generateInvitationLink = async (uid) => {
	return await Axios.post(
			`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${firebaseAPiKey}`,
			{
				dynamicLinkInfo: {
					domainUriPrefix: "https://pustack.page.link",
					link: `https://pustack.com/referrals/?q=${uid}`,
					androidInfo: {
						androidPackageName: "com.pustack.android.pustack",
						androidMinPackageVersionCode: "1",
					},
					socialMetaTagInfo: {
						socialTitle: "PuStack Pro Invitation",
						socialDescription:
							"Get 30 days of PuStack Pro membership when you signup using this link",
						socialImageLink: "https://www.pustack.com/facebook.png",
					},
					navigationInfo: {
						enableForcedRedirect: true,
					},
				},
			}
		)
		.then((res) => res?.data)
		.catch((err) => err);
};

const createProOrder = async ({ planId, userId, userGrade }) => {
	const createProOrderFunction = require('../../firebase-config').functions.httpsCallable("createProOrder");

	const response = await createProOrderFunction({
		plan_id: planId,
		user_id: userId,
		user_grade: userGrade,
	});

	return response?.data;
};

const getPlans = async () => {
	return await require('../../firebase-config').db
		.collection("products")
		.doc("pro")
		.get()
		.then((doc) => doc.data().plans)
		.catch((_) => null);
};

function formatPhoneNumber(value) {
	// if input value is falsy eg if the user deletes the input, then just return
	if (!value) return value;

	// clean the input for any non-digit values.
	const phoneNumber = value.replace(/[^\d]/g, '');

	// phoneNumberLength is used to know when to apply our formatting for the phone number
	const phoneNumberLength = phoneNumber.length;

	// we need to return the value with no formatting if its less then four digits
	// this is to avoid weird behavior that occurs if you  format the area code to early

	if (phoneNumberLength < 6) return phoneNumber;

	// console.log('phone number - ', phoneNumber, `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`);

	// if phoneNumberLength is greater than 4 and less the 7 we start to return
	// the formatted number
	// if (phoneNumberLength < 7) {
	return `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5, 10)}`;
	// }

	// finally, if the phoneNumberLength is greater then seven, we add the last
	// bit of formatting and return it.
	// return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
	//   3,
	//   6
	// )}-${phoneNumber.slice(6, 10)}`;
}

const ScholarshipInput = ({value, onChange, invalidKeys, className, placeholder = 'Type here...', name, type = "text", ...props}) => {

	// function handleChange(e) {
	//   onTextChange(e.target.value);
	//   typeof onChange === 'function' && onChange(e);
	// }

	return (
		<div className={"scholarship-form-input " + (className ?? '') + (invalidKeys.includes(name) ? ' error' : '')}>
			<input value={value} name={name} onChange={onChange} type={type} {...props}/>
			<label htmlFor="">{placeholder}</label>
		</div>
	)
}

export default function PustackProSlider({ isOpen, handleClose }) {
	const [plans, setPlans] = useState([{
		is_recommended: false,
		plan_duration: 1,
		plan_name: "1-month Plan",
		plan_price: 5999,
		serial_order: 0,
	}]);
	const [orderId, setOrderId] = useState(null);
	const [planIndex, setPlanIndex] = useState(0);
	const [referralLink, setReferralLink] = useState("");
	const [orderStatus, setOrderStatus] = useState(false);
	const [generatingLink, setGeneratingLink] = useState(false);
	const [proOrderCreating, setProOrderCreating] = useState(false);
	const [openCriteriaModal, setOpenCriteriaModal] = useState(false);
	const [openSharableModal, setOpenSharableModal] = useState(false);
	const inBrowser = useInBrowser();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isUserAlreadyAppliedForScholarship, setIsUserAlreadyAppliedScholarship] = useState(null);
	const [date, handleDate] = useState(null);
	const [phone, setPhone] = useState('');
	const [user] = useContext(UserContext).user;
	const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
	const [runConfetti, setRunConfetti] = useState(false);
	const [invalidKeys, setInvalidKeys] = useState([]);
	const formRef = useRef(null);
	const [touched, setTouched] = useState(false);
	const {register, handleChange, form, changeIndex} = useForm({
		firstName: ['', [Validators.req()]],
		lastName: ['', [Validators.req()]],
		phone: ['', [Validators.req()]],
		schoolName: ['', [Validators.req()]],
		// dob: [null, [Validators.req()]],
		grade: [user?.grade || '', [Validators.req()]],
	})
	const isStandardGrade = useStandardGrade();

	const [isDark] = useContext(ThemeContext).theme;
	const [isUserPro] = useContext(UserContext).tier;

	const { width, height } = useWindowSize();

	useEffect(() => {
		if (user) {
			getPlansFn();
		}
	}, [user?.pro_expiration_date, user?.uid, isOpen]);

	useEffect(() => {
		if(activeIndex === 3) setRunConfetti(true);
	}, [activeIndex]);

	// useEffect(() => {
	//   let el = formRef.current;
	//   if(invalidKeys && el) {
	//     if(!el[invalidKeys]) return;
	//     el[invalidKeys].focus();
	//   }
	// }, [invalidKeys, formRef])

	const validateInputs = (withFocus) => {

		form.validate();
		let keys = [];

		let errorKeys = Object.keys(form.errors), focused = false;
		for(let i = 0; i < errorKeys.length; i++) {
			let isThere = formRef.current[errorKeys[i]] && form.errors[errorKeys[i]];
			if(isThere) {
				keys.push(errorKeys[i]);
				if(!focused && withFocus) formRef.current[errorKeys[i]].focus();
				focused = true;
				// break;
			} else {
				keys = keys.filter(c => c !== errorKeys[i])
			}
		}

		if(!date) {
			keys.push('dob')
		} else {
			keys = keys.filter(c => c !== 'dob');
		}

		setInvalidKeys(keys);
		return keys.length === 0;
	}

	useEffect(() => {
		if(!touched) return;
		validateInputs();
	}, [changeIndex, touched, date])

	const handleSubmit = async () => {
		// setInvalidKey('schoolName')

		const isValid = validateInputs(true);
		setTouched(true);

		if(!isValid) return;

		setIsSubmittingApplication(true);
		const ist = await castIndianTime();

		const dob = format(date, 'dd/LL/yyyy');

		const docRef = require('../../firebase-config').db.collection('scholarships').doc();

		const controls = Object.keys(form.controls).filter(c => c.startsWith('class_'));

		let gradeMarks = controls.reduce((acc, key) => {
			acc[key] = form.get(key).value;
			return acc;
		}, {})

		const obj = {
			applied_on: +ist,
			date_of_birth: dob,
			first_name: form.get('firstName').value,
			grade: form.get('grade').value,
			id: docRef.id,
			last_name: form.get('lastName').value,
			marks_map: gradeMarks,
			organisation_name: "Microsoft",
			phone_number: form.get('phone').value,
			school_name: form.get('schoolName').value,
			uid: user.uid,
		}

		await docRef.set(obj);

		setIsSubmittingApplication(false);
		setActiveIndex(3);
	}

	function checkIfUserApplied(cb = () => {}) {
		require('../../firebase-config').db.collection('scholarships')
			.where('uid', '==', user?.uid)
			.get()
			.then(snapshot => {
				setIsUserAlreadyAppliedScholarship(snapshot.docs.length > 0);
				cb();
			})
	}

	useEffect(() => {
		if(!user?.uid) return;
		checkIfUserApplied();
	}, [user?.uid])

	const gradeItems = useMemo(() => {
		const availableGrades = getAvailableGrades(false, true);
		return availableGrades.map(c => ({
			id: c.grade,
			value: c.value,
			label: c.grade
		}))
	}, [])

	const handlePhoneChange = (e) => {
		let formattedValue = formatPhoneNumber(e.target.value);

		console.log('formattedValue - ', formattedValue);
		handleChange(e);

		setPhone(formattedValue);
	}

	const commaSeperated = (x) => {
		if (x) {
			x = x.toString();
			let lastThree = x.substring(x.length - 3);
			let otherNumbers = x.substring(0, x.length - 3);
			if (otherNumbers !== "") lastThree = "," + lastThree;
			let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
			return res;
		} else return 0;
	};

	const getPlansFn = async () => {
		const result = await getPlans();
		let _plans = [];

		console.log('result - ', { result });

		for (let plan in result) {
			_plans.push({
				planId: plan,
				name: result[plan].plan_name,
				price: "₹" + commaSeperated(result[plan].plan_price),
				introductoryPrice: "₹" + commaSeperated(result[plan].crossed_price),
				validity: calculateDate(result[plan].plan_duration),
				is_recommended: result[plan].is_recommended,
				serial_order: result[plan].serial_order,
			});

			if (result[plan].is_recommended) {
				setPlanIndex(result[plan].serial_order);
			}
		}
		_plans.sort((a, b) => a.serial_order - b.serial_order);
		console.log('_plans - ', _plans)
		setPlans(_plans);
	};

	useEffect(() => {
		const orderStatusListener = () => {
			const doc = require('../../firebase-config').db.collection("orders").doc(orderId);

			return doc.onSnapshot((docSnapshot) => {
				const { payment_status } = docSnapshot.data();

				if (
					payment_status === "authorization_failed" ||
					payment_status === "payment_capture_failed"
				) {
					setOrderStatus(false);
					setOrderId(null);
				}
				if (payment_status === "payment_captured") {
					setOrderStatus(true);
					setOrderId(null);
					handleClose();
				}
			});
		};

		if(orderId) {
			const unsubscribe = orderStatusListener();
			return () => unsubscribe();
		}
	}, [orderId]);

	const tagLinesUnStandard = [
		"India's Best Teachers",
		"Unlimited Doubt Solving",
		"Live Classes",
		"Personal Mentor"
	];

	const tagLinesStandard = [
		"India's Best Teachers",
		"Unlimited Doubt Solving",
		"Daily Live Classes",
		"Full Content Access",
		"Personal Mentor"
	];

	const calculateDate = (duration) => {
		// duration in 30 * months
		let newDate = new Date(new Date().setMonth(new Date().getMonth() + duration));

		let expiryDate = null;

		if (user?.pro_expiration_date) {
			expiryDate = +new Date(user?.pro_expiration_date?.seconds * 1000);

			if (isUserPro) {
				newDate = new Date(expiryDate).setMonth(
					new Date(expiryDate).getMonth() + duration
				);
			}
		}

		return format(new Date(newDate), "MMMM do, yyyy");
	};

	const isSmallScreen = useMediaQuery({ query: "(max-width: 769px)" });

	const initPayment = async () => {
		if(proOrderCreating) return;
		setProOrderCreating(true);

		console.log('planIndex = ', planIndex, plans);

		const _orderData = await createProOrder({
			planId: plans[planIndex].planId,
			userId: user?.uid,
			userGrade: user?.grade,
		});

		let res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

		handleClose();
		setProOrderCreating(false);

		if (!res) {
			// RazorPay SDK Failed To Load
			console.error("RazorPay SDK Failed To Load");
		} else {
			const _orderId = _orderData?.order_id;
			const planDuration = Number(_orderData?.plan_duration);
			const planName = _orderData?.plan_name;
			const price = Number(_orderData?.amount);
			const orderDescription = "Valid till " + plans[planIndex].validity;

			setOrderId(_orderId);

			let paymentOptions = {
				key: "rzp_test_DtDgmVmIj5dm2Y",
				amount: price * 100, //in the smallest currency sub-unit.
				name: "PuStack Pro",
				order_id: _orderId, //Generate order_id using Orders API
				description: orderDescription,
				handler: function () {},
				modal: {
					ondismiss: function () {
						setOrderStatus(false);
						handleClose();
					},
				},
				prefill: {
					name: user?.name,
					contact: user?.phone_number,
					email: user?.email,
				},
				notes: {
					user_id: user?.uid,
					plan_duration: planDuration,
					product_name: "pustack_pro",
					plan_name: planName,
				},
			};

			console.info("242", paymentOptions);

			let rzr_checkout = new window.Razorpay(paymentOptions);

			rzr_checkout.on("payment.failed", function (response) {
				console.log({ payment: "failed" });
			});

			rzr_checkout.open();
		}
	};

	const generateInviteLinkAndShare = async () => {
		if (user?.uid && !generatingLink) {
			setGeneratingLink(true);
			const res = await generateInvitationLink(user?.uid);

			setReferralLink(res?.shortLink);

			setGeneratingLink(false);

			if (navigator?.canShare && res?.shortLink) {
				return await navigator.share({
					title: "PuStack Referral Program",
					text: "Invite your friends to sign up through your referral link",
					url: res?.shortLink,
				});
			} else if (res?.shortLink) {
				setOpenSharableModal(true);
			}
		}
	};

	const copyToClipBoard = () => {
		navigator.clipboard.writeText(referralLink);
	};

	const renderPlans = useCallback(() => {
		return (
			plans?.map(plan => (
				<div key={plan.serial_order} className="pustack__plan">
					<h2>{plan.name}</h2>
					<h5>
						<span>{plan.introductoryPrice}</span> {plan.price}
					</h5>

					<p>
						{isUserPro ? "Extend" : "Valid"} till{" "}
						{plan.validity}
					</p>
				</div>
			))
		)
	}, [plans]);

	useEffect(() => {
		// setGradeMarks({});
		const controls = Object.keys(form.controls).filter(c => c.startsWith('class_'));
		controls.forEach(controlName => form.removeControl(controlName));

		const getPreviousGrades = (anchorGrade) => {
			let index = gradeItems.findIndex(c => c.value === anchorGrade);
			let end = index + 1;
			let start = end - 3 < 0 ? 0 : end - 3;
			return gradeItems.slice(start, end);
		}

		const prevGrades = getPreviousGrades(form.get('grade').value);
		prevGrades.map((gradeItem) => {
			form.registerControl(gradeItem.value, ['', [Validators.req()]]);
		})

	}, [form.get('grade').value, gradeItems]);

	const renderPreviousClassMarks = () => {
		const curGrade = form.get('grade').value;

		const getPreviousGrades = (anchorGrade) => {
			let index = gradeItems.findIndex(c => c.value === anchorGrade);
			let end = index + 1;
			let start = end - 3 < 0 ? 0 : end - 3;
			return gradeItems.slice(start, end);
		}

		const prevGrades = getPreviousGrades(curGrade);

		return prevGrades.map((gradeItem, index) => {
			const lastInd = Math.ceil(7 / (prevGrades.length / (index + 1)))
			let startInd = lastInd - Math.floor(7 / prevGrades.length);
			startInd = startInd > 0 ? startInd : 1;
			return (
				<ScholarshipInput
					key={gradeItem.value}
					{...register(gradeItem.value)}
					// value={gradeMarks[gradeItem.value] ?? ''}
					// onChange={(e) => {
					//   let val = e.currentTarget.value;
					//   setGradeMarks(c => ({
					//     ...c,
					//     [gradeItem?.value]: val
					//   }))
					// }}
					type="number"
					required
					placeholder={gradeItem.value.split('_')[1] + 'th Percentage'}
					className={`span-${startInd}-${lastInd}`}
					invalidKeys={invalidKeys}
				/>
			)
		})

		// return (
		//   <>
		//     <div className="scholarship-form-input span-1-3">
		//       <input type="number" required/>
		//       <label htmlFor="">5th Marks</label>
		//     </div>
		//     <div className="scholarship-form-input span-3-5">
		//       <input type="number" required/>
		//       <label htmlFor="">6th Marks</label>
		//     </div>
		//     <div className="scholarship-form-input span-5-7">
		//       <input onClick={() => {
		//         console.log('form - ', form);
		//       }} type="number" required/>
		//       <label htmlFor="">7th Marks</label>
		//     </div>
		//   </>
		// )
	}

	return (
		<Drawer
			variant="temporary"
			// open={true}
			open={isOpen}
			anchor={isSmallScreen ? "bottom" : "right"}
			onClose={() => {
				handleClose();
				setActiveIndex(0)
				setOrderStatus(false);
			}}
			className={
				(orderStatus
					? "pustack__pro__drawer pustack__pro__success"
					: "pustack__pro__drawer") + (isDark ? ' dark' : '')
			}
			ModalProps={{ keepMounted: true }}
		>
			{user && (
				<SwipeableViews
					axis={"x"}
					scrolling={"false"}
					index={activeIndex}
					style={{ outline: "none", width: "100%", height: '100%' }}
					ignoreNativeScroll={true}
					disabled={true}
				>
					<>
						<div className="pro__background">
							<div
								style={{
									backgroundImage: `url(/assets/images/film_1.jpg)`,
									animationPlayState: isOpen ? "running" : "paused",
								}}
								className="pro__bg1"
							/>
							<div
								style={{
									backgroundImage: `url(/assets/images/film_2.jpg)`,
									animationPlayState: isOpen ? "running" : "paused",
								}}
								className="pro__bg2"
							/>
							<div
								style={{
									backgroundImage: `url(/assets/images/film_3.jpg)`,
									animationPlayState: isOpen ? "running" : "paused",
								}}
								className="pro__bg3"
							/>
						</div>
						<div className="slider__restainer__wrapper">
							{orderStatus && (
								<Confetti
									width={width}
									height={height}
									tweenDuration={4000}
									run={isOpen}
								/>
							)}
							<div
								className="close__wrapper"
								onClick={() => {
									handleClose();
									setOrderStatus(false);
								}}
							>
								<CloseIcon className="close__icon" />
							</div>
							<div className="slider__restainer">
								<div className="pustack__pro__branding">
									<Image
										draggable="false"
										src={PuStackWhiteLogo}
										alt="PuStack Logo"
										className="modal__logo"
									/>
									<h6>PRO</h6>
								</div>
								{orderStatus && (
									<div className="pro__user__success">
										<h2>Congratulations!</h2>
										<h4>You are a Pro now.</h4>
									</div>
								)}
								<div className="pustack__pro__content">
									{(isStandardGrade ? tagLinesStandard : tagLinesUnStandard).map((line, index) => (
										<div className="pustack__pro__taglines" key={index}>
											<Image src={CheckCircleIcon} alt={`check`} />
											<h5>{line}</h5>
										</div>
									))}
								</div>
								{orderStatus
									? ""
									: plans && (
									<div className="plan__carousel">
										<Carousel
											index={plans.length - 1}
											NextIcon={<ChevronRightIcon style={{ fill: "grey" }} />}
											PrevIcon={<ChevronLeftIcon style={{ fill: "grey" }} />}
											animation="slide"
											cycleNavigation={false}
											autoPlay={false}
											indicatorIconButtonProps={{ style: { color: "grey" } }}
											activeIndicatorIconButtonProps={{
												style: { color: "white" },
											}}
											onChange={e => {
												setPlanIndex(e);
											}}
										>
											{renderPlans()}
										</Carousel>
									</div>
								)}
								<div className="join__now__wrapper">
									{orderStatus ? (
										<button
											className="join__now"
											onClick={() => {
												handleClose();
												setOrderStatus(false);
											}}
										>
											Explore PuStack Pro{" "}
											<ChevronRightIcon className="right-icon" />
										</button>
									) : isUserPro ? (
										<button
											className="join__now"
											onClick={initPayment}
											// style={{ cursor: "not-allowed" }}
										>
											{proOrderCreating ? (
												<div className="circular__progress">
													<Lottie
														options={{ animationData: circleProg, loop: true }}
													/>
												</div>
											) : (
												"Extend Pro"
											)}
										</button>
									) : (
										<button
											className="join__now"
											onClick={initPayment}
										>
											{proOrderCreating ? (
												<div className="circular__progress">
													<Lottie
														options={{ animationData: circleProg, loop: true }}
													/>
												</div>
											) : (
												"Join Pro"
											)}
										</button>
									)}
								</div>
								<p style={{display: 'none'}} onClick={() => {
									if(isUserAlreadyAppliedForScholarship) return;
									setActiveIndex(1)
								}} className={"explore__scholarship__btn" + (isUserAlreadyAppliedForScholarship ? ' noCursor' : '')}>{isUserAlreadyAppliedForScholarship ? 'Your scholarship application is under review' : 'Explore Scholarship'}</p>
							</div>
						</div>
					</>
					<div className="scholarship-form-wrapper">
						<div className="scholarship-form-header">
							<ArrowBackIcon onClick={() => setActiveIndex(0)} />
							<h2>Scholarship</h2>
						</div>
						<div className="scholarship-form-logo lowMargin">
							<Image src={MicrosoftLogo} alt=""/>
						</div>
						<div className="scholarship-form-input-container">
							<div className="scholarship-form-control note-item span-full">
								<LibraryBooks />
								<span>Microsoft is founded by Mr. Bill Gates in 2002.</span>
							</div>
							<div className="scholarship-form-control note-item span-full">
								<LibraryBooks />
								<span>This foundation aims to reward students for their hard work.</span>
							</div>
							<div className="scholarship-form-control note-item span-full">
								<LibraryBooks />
								<span>Covers 100% of the Pustack pro subscription cost.</span>
							</div>
							<div className="scholarship-form-control note-item span-full">
								<LibraryBooks />
								<span>Requires last 3 years of excellent academic performance.</span>
							</div>
							<div className="scholarship-form-control note-item span-full">
								<Image src={isDark ? ScholarshipPageDark : ScholarshipPageLight} alt=""/>
							</div>
						</div>
						<div className="scholarship-form-control span-full">
							{/*<div className="scholarship-form-control-notice">*/}
							{/*  <ErrorOutline />*/}
							{/*  <span>Please go over the <span onClick={() => setActiveIndex(2)}>criteria</span> for the scholarship.</span>*/}
							{/*</div>*/}
							<button onClick={() => setActiveIndex(2)}>
								<School />
								<span>Apply for Scholarship</span>
							</button>
						</div>
					</div>
					<div className="scholarship-form-wrapper">
						<div>
							<div className="scholarship-form-header">
								<ArrowBackIcon onClick={() => setActiveIndex(1)} />
								<h2>Scholarship</h2>
							</div>
							<div className="scholarship-form-logo">
								<Image src={MicrosoftLogo} alt=""/>
							</div>
						</div>
						<form ref={formRef} onSubmit={e => e.preventDefault()} className="scholarship-form-input-container shiftVertical">
							{/*<div className="scholarship-form-input span-1-4">*/}
							{/*  <input {...register('firstName')} type="text" required/>*/}
							{/*  <label htmlFor="">First Name</label>*/}
							{/*</div>*/}
							{/*<div className="scholarship-form-input span-4-7">*/}
							{/*  <input {...register('lastName')}  type="text" required/>*/}
							{/*  <label htmlFor="">Last Name</label>*/}
							{/*</div>*/}
							<ScholarshipInput
								{...register('firstName')}
								required
								placeholder="First Name"
								className="span-1-4"
								invalidKeys={invalidKeys}
							/>
							<ScholarshipInput
								{...register('lastName')}
								required
								placeholder="Last Name"
								className="span-4-7"
								invalidKeys={invalidKeys}
							/>
							{/*<div className="scholarship-form-input span-full">*/}
							{/*  <input {...register('phone')} value={phone} onChange={e => handlePhoneChange(e)} required/>*/}
							{/*  <label htmlFor="">Phone Number</label>*/}
							{/*</div>*/}
							<ScholarshipInput
								{...register('phone')}
								value={phone}
								onChange={e => handlePhoneChange(e)}
								required
								placeholder="Phone Number"
								className="span-full"
								invalidKeys={invalidKeys}
							/>
							<ScholarshipInput
								{...register('schoolName')}
								type="text"
								required
								placeholder="School Name"
								className="span-full"
								invalidKeys={invalidKeys}
							/>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DatePicker
									label="Date&Time picker"
									value={date}
									name={'dob'}
									disableFuture
									// onChange={handleDate}
									onChange={handleDate}
									format={"MMMM d, yyyy"}
									PopoverProps={{PaperProps: {style: {zIndex: 1400}}}}
									DialogProps={{style: {zIndex: 1400}}}
									TextFieldComponent={(params) => {
										return (
											<div className={"scholarship-form-input span-full" + (invalidKeys.includes('dob') ? ' error' : '')}>
												<input type="text" {...params} required onFocus={params.onClick}/>
												<label htmlFor="">Date of Birth</label>
											</div>
										)
									}}
								/>
							</MuiPickersUtilsProvider>
							{/*<SessionFormSelect*/}
							{/*	style={{marginTop: 0}}*/}
							{/*	forceDark={true}*/}
							{/*	className="scholarship-form-input span-full"*/}
							{/*	{...register('grade')}*/}
							{/*	// invalid={showError && form.errors['access_tier']}*/}
							{/*	id={'select-session-access-tier'}*/}
							{/*	PopoverClasses={{root: 'scholarship-grade-popover'}}*/}
							{/*	placeholder=""*/}
							{/*	items={gradeItems}*/}
							{/*/>*/}
							{renderPreviousClassMarks()}
							{/*<div className="scholarship-form-input">*/}
							{/*  <input type="text"/>*/}
							{/*  <label htmlFor="">Date of Birth</label>*/}
							{/*</div>*/}
						</form>
						<div className="scholarship-form-control span-full">
							<div className="scholarship-form-control-notice">
								<ErrorOutline />
								<span>Please go over the <span onClick={() => setOpenCriteriaModal(true)}>criteria</span> for the scholarship.</span>
							</div>
							<PustackButton onClick={handleSubmit} isLoading={isSubmittingApplication}>
								<School />
								<span>Submit Application</span>
							</PustackButton>
						</div>
					</div>
					<div className="successful-submission">
						<div
							className="close__wrapper"
							onClick={() => {
								handleClose();
								setOrderStatus(false);
							}}
						>
							<CloseIcon className="close__icon" />
						</div>
						<Confetti
							width={'700px'}
							// height={'1080px'}
							tweenDuration={10000}
							run={runConfetti}
							recycle={false}
							style={{ zIndex: 999 }}
							confettiSource={{ x: 0, y: 0, w: 350, h: 0 }}
						/>
						<Confetti
							width={'700px'}
							// height={'1080px'}
							tweenDuration={10000}
							run={runConfetti}
							recycle={false}
							style={{ zIndex: 999 }}
							confettiSource={{ x: 100, y: -300, w: 350, h: 500 }}
						/>
						<Confetti
							width={'700px'}
							// height={'1080px'}
							tweenDuration={10000}
							run={runConfetti}
							recycle={false}
							style={{ zIndex: 999 }}
							confettiSource={{ x: 650, y: 0, w: 350, h: 0 }}
						/>
						<div className="successful-submission-logo">
							<Image src={isDark ? PuStackWhiteLogo : PuStackLightLogo} alt="Pustack"/>
						</div>
						<div className="successful-submission-content">
							<Lottie
								style={{width: '70%'}}
								options={{
									animationData: ScholarshipSuccessLottie,
									loop: true,
								}}
							/>
							<h3>Submitted</h3>
							<p>Your application is being reviewed.</p>
						</div>
						<button className="successful-submission-btn" onClick={() => {
							setIsUserAlreadyAppliedScholarship(true)
							setActiveIndex(0)
						}}>Go Back</button>
					</div>
				</SwipeableViews>
			)}
			<Modal
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => setOpenSharableModal(false)}
				ariaHideApp={false}
				overlayClassName="new-post-modal-overlay"
				isOpen={openSharableModal}
				className={
					isDark ? "referral-program-wrapper dark" : "referral-program-wrapper"
				}
			>
				<div className="referral-program">
					<h1>Share</h1>
					<Image src={referralImage} alt="referral" className="referral-banner" />
					<p>Invite your friends to sign up through this referral link</p>
					<CancelIcon
						className="close-referral-modal"
						onClick={() => setOpenSharableModal(false)}
					/>
					<h4>
						<span onClick={copyToClipBoard}>{referralLink}</span>
						<FileCopyOutlinedIcon onClick={copyToClipBoard} />
					</h4>
					<div className="share-icons">
						<EmailShareButton
							subject="PuStack invitation link"
							body={`Visit this link to get 30 days of PuStack Pro membership ${referralLink}`}
							url={referralLink}
							windowHeight={52}
							windowWidth={52}
						>
							<EmailIcon size={52} round />
						</EmailShareButton>
						<FacebookShareButton
							quote={`Visit this link to get 30 days of PuStack Pro membership ${referralLink}`}
							url={referralLink}
							windowHeight={52}
							windowWidth={52}
						>
							<FacebookIcon size={52} round />
						</FacebookShareButton>
						<TelegramShareButton
							url={referralLink}
							title="PuStack invitation link"
							windowHeight={52}
							windowWidth={52}
							className="telegram-btn"
						>
							<TelegramIcon size={52} round />
						</TelegramShareButton>
						<TwitterShareButton
							url={referralLink}
							title="PuStack invitation link"
							windowHeight={52}
							windowWidth={52}
						>
							<TwitterIcon size={52} round />
						</TwitterShareButton>
						<WhatsappShareButton
							url={referralLink}
							title="PuStack invitation link"
							seperator=": "
							windowHeight={52}
							windowWidth={52}
							className="whatsapp-btn"
						>
							<WhatsappIcon size={52} round />
						</WhatsappShareButton>
					</div>
				</div>
			</Modal>
			{isSmallScreen && inBrowser && <Drawer
        variant="temporary"
				// open={false}
        open={openCriteriaModal}
        anchor={"bottom"}
        onClose={() => setOpenCriteriaModal(false)}
        PaperProps={{className: 'criteria-sheet-paper'}}
        className={"criteria-sheet" + (isDark ? ' dark' : '')}
        ModalProps={{keepMounted: true}}
      >
        <div
          className="close__wrapper"
          onClick={() => {
						setOpenCriteriaModal(false)
					}}
        >
          <CloseIcon className="close__icon"/>
        </div>
        <h2>Qualification Criteria</h2>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Microsoft is founded by Mr. Bill Gates in 2002.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>This foundation aims to reward students for their hard work.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Covers 100% of the Pustack pro subscription cost.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Requires last 3 years of excellent academic performance.</span>
        </div>
        <PustackButton onClick={() => {
				}} isLoading={isSubmittingApplication}>
          Learn More
        </PustackButton>
      </Drawer>}
			{!isSmallScreen && inBrowser && <Dialog
        PaperProps={{className: 'criteria-modal'}}
        onClose={() => setOpenCriteriaModal(false)}
        className={"criteria-modal-overlay" + (isDark ? ' dark' : '')}
        open={openCriteriaModal}
      >
        <div
          className="close__wrapper"
          onClick={() => {
						setOpenCriteriaModal(false)
					}}
        >
          <CloseIcon className="close__icon"/>
        </div>
        <h2>Qualification Criteria</h2>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Microsoft is founded by Mr. Bill Gates in 2002.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>This foundation aims to reward students for their hard work.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Covers 100% of the Pustack pro subscription cost.</span>
        </div>
        <div className="criteria-modal-note">
          <LibraryBooks/>
          <span>Requires last 3 years of excellent academic performance.</span>
        </div>
        <PustackButton onClick={() => {
				}} isLoading={isSubmittingApplication}>
          Learn More
        </PustackButton>
      </Dialog>}
			{/*<Modal*/}
			{/*  shouldCloseOnEsc={true}*/}
			{/*  shouldCloseOnOverlayClick={true}*/}
			{/*  onRequestClose={() => setOpenCriteriaModal(false)}*/}
			{/*  ariaHideApp={false}*/}
			{/*  overlayClassName="criteria-modal-overlay"*/}
			{/*  isOpen={openCriteriaModal}*/}
			{/*  className="criteria-modal"*/}
			{/*>*/}
			{/*  <div*/}
			{/*    className="close__wrapper"*/}
			{/*    onClick={() => {*/}
			{/*      setOpenCriteriaModal(false)*/}
			{/*    }}*/}
			{/*  >*/}
			{/*    <CloseIcon className="close__icon" />*/}
			{/*  </div>*/}
			{/*  <h2>Qualification Criteria</h2>*/}
			{/*  <div className="criteria-modal-note">*/}
			{/*    <LibraryBooks />*/}
			{/*    <span>Microsoft is founded by Mr. Bill Gates in 2002.</span>*/}
			{/*  </div>*/}
			{/*  <div className="criteria-modal-note">*/}
			{/*    <LibraryBooks />*/}
			{/*    <span>This foundation aims to reward students for their hard work.</span>*/}
			{/*  </div>*/}
			{/*  <div className="criteria-modal-note">*/}
			{/*    <LibraryBooks />*/}
			{/*    <span>Covers 100% of the Pustack pro subscription cost.</span>*/}
			{/*  </div>*/}
			{/*  <div className="criteria-modal-note">*/}
			{/*    <LibraryBooks />*/}
			{/*    <span>Requires last 3 years of excellent academic performance.</span>*/}
			{/*  </div>*/}
			{/*  <PustackButton onClick={() => {}} isLoading={isSubmittingApplication}>*/}
			{/*    Learn More*/}
			{/*  </PustackButton>*/}
			{/*</Modal>*/}
		</Drawer>
	);
}

// function Item({ plan }) {
//   return (
//     <div className="pustack__plan" key={plan.name}>
//       <h2>{plan.name}</h2>
//       {/* <h5>{plan.price}</h5> */}
//       <h5>
//         <Image src={LockIcon} alt="lock" />
//       </h5>
//       <p>Valid till {plan.validity}</p>
//     </div>
//   );
// }
