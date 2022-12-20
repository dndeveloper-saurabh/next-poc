import React, {useEffect, useContext, useMemo, useState} from 'react';
import SwipeableViews from "react-swipeable-views";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReasonForDeletingImage from '../../public/assets/images/reason_for_deleting_account.svg';
import EnterOTPImage from '../../public/assets/images/enter_otp.svg';
import CrossSVG from '../../public/assets/images/cross.svg';
import PustackButton from "../../components/global/PustackButton";
import DeleteImage from '../../public/assets/images/delete_confirm.webp';
import {smartPhone} from "../../public/assets";
import Timer from "react-compound-timer";
import {ThemeContext, UserContext} from "../../context";
import {signInWithPhone} from "../../services/auth";
import firebase from "firebase";
import Image from 'next/image';

function ScreenLayout({children, goBack}) {
	const SCREEN_HEADER = 'screen-header';
	const SCREEN_BODY = 'screen-body';
	const SCREEN_IMAGE = 'screen-image';
	const header = useMemo(() => {
		if(!children) return;
		if(!(children instanceof Array)) return children;
		return children.find(c => typeof c.type === 'string' && c.type.toLowerCase() === SCREEN_HEADER);
	}, [children]);
	const body = useMemo(() => {
		if(!children) return;
		if(!(children instanceof Array)) return children;
		return children.find(c => typeof c.type === 'string' && c.type.toLowerCase() === SCREEN_BODY);
	}, [children]);

	// const jsxContent = useCallback(() => {
	//   const imageData = [];
	//   const isImage = (cur) => typeof cur.type === 'string' && cur.type.toLowerCase() === SCREEN_IMAGE;
	//
	//   return children.map((c, ind) => {
	//     if(isImage(c)) {
	//       return
	//     }
	//   })
	// }, [header, body, children])

	return (
		<>
			<div className="screen-header">
				<h2 className="page-title">
					<ArrowBackIcon
						style={{cursor: 'pointer'}}
						onClick={() => {
							console.log('clicking');
							goBack();
						}}
					/>
					<span style={{marginTop: '2px'}}>Delete Account</span>
				</h2>
			</div>
			<div className="screen-body">
				{body?.props.children}
			</div>
		</>
	)
}

const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return () => setValue((value) => ++value); // update the state to force render
};

const reasonOptions = [
	{id: 1, value: 'gradeNotPresent', label: 'My grade is not present'},
	{id: 2, value: 'poorLectureQuality', label: 'Unsatisfactory lecture quality'},
	{id: 3, value: 'other', label: 'Other'},
]

export default function DeleteAccountScreen({logOut, isOpen, onChange, setActiveSettingIndex}) {
	const [activeIndex, setIndex] = useState(0);
	const [user] = useContext(UserContext).user;
	const [otpCode, setOtpCode] = useState(Array(6).fill(""));
	const forceUpdate = useForceUpdate();
	const [spaceKey, setSpaceKey] = useState(false);
	const [otpError, setOtpError] = useState(false);
	const [resendCode, setResendCode] = useState(true);
	const [allowNext, setAllowNext] = useState(false);
	const [plural, setPlural] = useState(true);
	const [sendingOtp, setSendingOtp] = useState(false);
	const [isDark, setIsDark] = useContext(ThemeContext).theme;
	const [otpSent, setOtpSent] = useState(false);
	const [reasonCode, setReasonCode] = useState(null);
	const [why, setWhy] = useState('');
	const [userToDelete, setUserToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const setActiveIndex = index => {
		onChange(index);
		setIndex(index);
	}

	useEffect(() => {
		console.log('isOpen - ', isOpen);
		if(!isOpen) {
			setActiveIndex(0);
			setUserToDelete(null);
			setWhy('')
			setReasonCode(null)
			setAllowNext(false);
			setResendCode(true);
			setOtpCode(Array(6).fill(""));
		}
	}, [isOpen])

	useEffect(() => {
		if(activeIndex === 3) {
			setOtpCode(Array(6).fill(""));
			setAllowNext(false);
			setUserToDelete(null);
			setOtpSent(false);
			setResendCode(true);
		}
	}, [activeIndex])

	function goBack(notLastOne) {
		console.log('going Back - ');
		setActiveIndex(c => {
			console.log('c - ', c);
			if(c === 0) {
				// Go back to account settings
				setActiveSettingIndex(1)
				return c;
			}
			if(notLastOne) {
				return c - 2;
			}
			return c - 1;
		})
	}

	useEffect(() => {
		if (activeIndex === 2 && !window.recaptchaVerifier) {
			window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
				`recaptcha-container`,
				{
					size: "invisible",
					callback: (response) => console.log({ response }),
					"expired-callback": () => window.recaptchaVerifier.clear(),
				},
				require('../../firebase-config').firebaseApp
			);
		}
	}, [activeIndex]);

	const handleSendingOTP = async () => {

		setSendingOtp(true);

		// const isPhoneExist = functions.httpsCallable('checkIfPhoneExists');
		// const response = await isPhoneExist({
		//   phone_number: '+' + user.phone_number
		// })
		// if(response.data) {
		//   setSendingOtp(false);
		//   // setPhoneNumberError('Phone number is already registered');
		//   return;
		// }
		// console.log('isPhoneExist - ', response);


		// if (phoneNumber.length > 8) {

		await signInWithPhone(
			"+" + user.phone_country_code + user.phone_number,
			user.phone_country_code,
			setActiveIndex,
			-1,
			setSendingOtp,
			() => {},
			null,
			null,
			null,
			null,
			() => {
				console.log('cb - ');
				setOtpSent(true);
				setActiveIndex(3)
			}
		);
	};

	const handleOTPChange = async (e, i) => {
		try {
			const { maxLength, value } = e.target;
			forceUpdate();

			if (spaceKey) return;

			otpCode[i] = value;
			setOtpCode(otpCode);

			const code = otpCode?.join("");

			if (code.length === 6) {
				const otpConfirm = window.confirmationResult;

				if(!otpConfirm) return;

				const result = await otpConfirm.confirm(code)

				let user = result.user;

				// const [user, res, errorMessage] = await submitPhoneNumberAuthCode(code, null, null, false);

				if(user) {
					setUserToDelete(user);
				}

				setOtpError(false);
				setAllowNext(true);

			} else {
				setOtpError(false);
				setAllowNext(false);
			}

			if (value.length >= maxLength && i < 5) {
				const nextField = document.querySelector(
					`div > input[name=input${i + 1}]`
				);
				if (nextField !== null) nextField.focus();
			}
		} catch (err) {
			let e = err.code;
			setAllowNext(false);
			navigator && navigator.vibrate && navigator.vibrate([10, 10]);
			if (err.code === "auth/invalid-verification-code") {
				e = "Incorrect Verification Code.";
			} else if (err.code === "code-expired") {
				e = "The OTP has expired, please try again.";
			}
			setOtpError(e);
			// return [null, false, err.code];
		}
	};

	const handleKeyDown = (e, i) => {
		if (e.key === " ") {
			setSpaceKey(true);
		} else if (e.key === "Backspace" || e.key === "Delete") {
			forceUpdate();

			if (otpCode[i]?.length === 0 && i > 0 && i <= 5) {
				const prevField = document.querySelector(
					`div > input[name=input${i - 1}]`
				);
				if (prevField !== null) prevField.focus();
			}
		} else {
			setSpaceKey(false);
		}
	};

	const handleSubmitDeletion = async () => {
		if(!userToDelete) return;

		setIsDeleting(true);

		let details = why;
		if(details.trim().length === 0) details = 'Not Provided';
		const reasonForAccountDeletion = {
			code: reasonCode,
			details
		}

		await require('../../firebase-config').db.collection('users')
			.doc(userToDelete.uid)
			.set({
				reason_for_account_deletion: reasonForAccountDeletion,
				is_deleted: true,
				phone_number: null,
				email: null
			}, {merge: true});
		await userToDelete.delete();

		setIsDeleting(false);
		logOut();
	}

	return (
		<SwipeableViews
			axis={"x"}
			scrolling={"false"}
			index={activeIndex}
			style={{ outline: "none" }}
			ignoreNativeScroll={true}
			disabled={true}
		>
			{/* page 0 */}
			<ScreenLayout goBack={goBack}>
				<screen-body>
					<Image height={100} width={100} style={{height: '270px'}} src={ReasonForDeletingImage} alt="Reason for Deleting Image" onClick={() => setActiveIndex(1)}/>
					<h2 style={{margin: '10px'}}>Why are you deleting your account?</h2>
					<form style={{width: '250px'}} onChange={(e) => {
						setReasonCode(e.target.value);
						setActiveIndex(1);
					}}>
						{reasonOptions.map(option => (
							<div key={option.id} className="delete-account-reason-input">
								<input type="radio" name="delete_account_reason" id={option.value} checked={reasonCode === option.value} value={option.value}/>
								<label onClick={() => {
									setReasonCode(option.value);
									setActiveIndex(1);
								}} htmlFor="broken">{option.label}</label>
							</div>
						))}
					</form>
				</screen-body>
			</ScreenLayout>
			{/* page 1 */}
			<ScreenLayout goBack={goBack}>
				<screen-body>
					<p style={{color: 'rgba(var(--color-text-rgb), .6)', margin: '15px', lineHeight: 1.4}}>We are sorry to see you go. Your feedback is valuable to us.</p>
					<textarea onChange={(e) => {
						setWhy(e.target.value)
					}} placeholder="Type your feedback here" name="" id="" cols="30" rows="10" />
					<PustackButton onClick={() => setActiveIndex(2)}>
						{why.trim().length === 0 ? 'Skip' : 'Continue'}
					</PustackButton>
				</screen-body>
			</ScreenLayout>
			{/* page 2 */}
			<ScreenLayout goBack={goBack}>
				<screen-body>
					<div className='align-column-center'>
						<Image height={100} width={100} style={{height: '270px'}} src={EnterOTPImage} alt="Enter OTP"/>
						<h2 style={{margin: '10px'}}>OTP Verification is required!</h2>
						{/*<p style={{*/}
						{/*  fontSize: '14px',*/}
						{/*  margin: '0 10px',*/}
						{/*  textAlign: 'center',*/}
						{/*  color: 'rgba(var(--color-text-rgb), .6)'*/}
						{/*}}>This is a sensitive operation, Therefore you are required to authenticate yourself.</p>*/}
						<h5 style={{fontSize: '14px', marginTop: '5px'}}>Please request an OTP on your phone number</h5>
					</div>
					<PustackButton isLoading={sendingOtp} onClick={() => {
						handleSendingOTP()
					}}>
						Send OTP
					</PustackButton>
				</screen-body>
			</ScreenLayout>
			{/* page 3 */}
			<ScreenLayout goBack={goBack}>
				<div
					className={
						isDark
							? "otp-verification-modal dark"
							: "otp-verification-modal"
					}
				>
					<div className="wrapper">
						<div className="otp-verification-modal-inner">
							<Image height={100} width={100} src={smartPhone} alt="sp" draggable={false} />
							<h5>OTP Verification</h5>
							<h6>
								<span>Enter OTP sent to</span> + {user?.phone_country_code} {user?.phone_number}
							</h6>
							<div
								className={
									otpError
										? "otp-verification error"
										: "otp-verification"
								}
							>
								<div>
									{Array(6)
										.fill(0)
										.map((_, i) => (
											<div key={i}>
												<input
													name={`input${i}`}
													type="tel"
													value={otpCode[i]}
													maxLength={1}
													autoFocus={i === 0}
													autoComplete="off"
													onChange={(e) => handleOTPChange(e, i)}
													onKeyDown={(e) => handleKeyDown(e, i)}
												/>
											</div>
										))}
								</div>
							</div>
							{otpError && <h3 style={{
								marginTop: '10px',
								color: 'rgb(252, 74, 30)',
								fontSize: '15px',
								fontWeight: 500
							}}>{otpError || 'Verification failed, try again.'}</h3>}
							<div
								className={
									resendCode ? "resend__code grey" : "resend__code"
								}
							>
								<Timer
									initialTime={30100}
									direction="backward"
									checkpoints={[
										{
											time: 1500,
											callback: () => setPlural(false),
										},
										{
											time: 500,
											callback: () => setResendCode(false),
										},
									]}
								>
									{({ start, reset }) => (
										<h4
											onClick={() => {
												if (!resendCode) {
													setPlural(true);
													reset();
													start();
													setResendCode(true);
													handleSendingOTP();
												}
											}}
										>
											Resend OTP
											{resendCode && (
												<>
													? Tap in <Timer.Seconds /> second
													{plural && "s"}
												</>
											)}
										</h4>
									)}
								</Timer>
							</div>
							<button
								disabled={!allowNext}
								onClick={() => {
									setActiveIndex(4)
								}}
							>
								Verify
							</button>
						</div>
					</div>
				</div>
			</ScreenLayout>
			{/* page 4 */}
			<ScreenLayout goBack={() => goBack(true)}>
				<screen-body>
					<div className='align-column-center' style={{alignItems: 'flex-start'}}>
						<Image height={100} width={100} style={{height: '270px', alignSelf: 'center'}} src={DeleteImage} alt="Delete Account"/>
						<h2 style={{margin: '10px'}}>Deleting account will do the following</h2>
						<div className="delete-account-doings">
							<Image height={100} width={100} src={CrossSVG} alt="Cross" />
							<span>Log you out on all the devices.</span>
						</div>
						<div className="delete-account-doings">
							<Image height={100} width={100} src={CrossSVG} alt="Cross" />
							<span>Delete all of your account information.</span>
						</div>
					</div>
					<PustackButton isLoading={isDeleting} onClick={handleSubmitDeletion}>
						Confirm Deletion
					</PustackButton>
				</screen-body>
			</ScreenLayout>
		</SwipeableViews>
	)
}
