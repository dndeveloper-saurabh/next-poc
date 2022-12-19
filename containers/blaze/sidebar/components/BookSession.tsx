import React, {useCallback, useContext, useState} from 'react';
import {BlazeSessionContext, PustackProContext, UserContext} from "../../../../context";
import Lottie from "lottie-react-web";
import {circularProgress} from "../../../../public/assets";
import {useMediaQuery} from "react-responsive";
import useSnackbar from "../../../../hooks/snackbar/useSnackbar";
import {formatDateDoc} from "../../../../database/livesessions/sessions";
import {castIndianTime} from "../../../../helpers/getIndianTime";

const getActiveStudentSessions = (studentId) => {
	return require('../../../../firebase-config.js').db.collection('/blaze_dev/collections/blaze_sessions')
		.where('student_id', '==', studentId)
		.where('session_status', '!=', 'completed')
		.get()
		.then(querySnapshot => {
			let a = [];
			querySnapshot.forEach(c => a.push(c.data()))
			return a;
		})
}

const usedMinutesForToday = async (studentId) => {
	const ist = await castIndianTime();
	return require('../../../../firebase-config.js').db.collection('/blaze_dev/collections/students/' + studentId + '/engagement')
		.doc(formatDateDoc(ist, false, true))
		.get()
		.then(c => {
			if(c.exists) {
				const d = c.data();
				if(!d.daily_engagement[formatDateDoc(ist)]) return 0;
				return Object.keys(d.daily_engagement[formatDateDoc(ist)]).reduce((acc, cur) => {
					acc += d.daily_engagement[formatDateDoc(ist)][cur].call_duration;
					return acc;
				}, 0);
			}
			console.log('Document not found in used Minutes.')
			return null;
		})
}


export default function BookSession({onBeforeClickStuff = function() {}, children, className, ...props}) {
	const [,setOpenBookingPopup] = useContext(BlazeSessionContext).openBookingPopup;
	const [user] = useContext(UserContext).user;
	const [isProTier] = useContext(UserContext).tier;
	const [_, setShowWarning] = useContext(PustackProContext).warning;
	const [, setIsOpen] = useContext(PustackProContext).value;
	const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
	const [isLoading, setIsLoading] = useState(false);
	const {show} = useSnackbar();

	const openPopUp = useCallback(() => {setOpenBookingPopup(true)}, [])

	return (
		<button
			className={className + (' book-session-btn')}
			onClick={() => {
				setIsLoading(true);
				getActiveStudentSessions(user.uid).then(async (activeSessions) => {
					let availableSessionLength = 1;
					if(isProTier) availableSessionLength = 5;
					if(!isProTier) {

						const usedMinutes = await usedMinutesForToday(user.uid);

						console.log('usedMinutes - ', usedMinutes)

						if(usedMinutes >= 480) {
							setIsLoading(false);
							if(isSmallScreen) {
								setIsOpen(true);
							} else {
								setShowWarning({Content: (
										<>
											<h1>Daily Limit Reached</h1>
											<h2>Join Pro to get unlimited access.</h2>
										</>
									)});
							}
							return;
						}
					}
					setIsLoading(false);
					onBeforeClickStuff();

					if(activeSessions.length < availableSessionLength) {
						openPopUp();
						return;
					}
					if(isProTier) {
						show({
							title: 'Session limit exceeded',
							description: 'Please close any existing session before creating a new one.',
							type: 'warning'
						})
						// showSnackbar("Please close any existing session before creating a new one.", "warning", "Session limit exceeded!");
						return;
					}

					if(isSmallScreen) {
						setIsOpen(true);
					} else {
						setShowWarning({Content: (
								<>
									<h2>Session Limit Reached</h2>
									<p>Join Pro to create more than one session at a time.</p>
								</>
							)});
					}
				});
			}}
			// onClick={() => showSnackbar("Access coming soon", "info")}
			{...props}
		>
			<div style={{opacity: isLoading ? 0 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				{children}
			</div>
			<Lottie
				style={{
					height: '25px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: isLoading ? 1 : 0
				}}
				options={{
					animationData: circularProgress,
					loop: true,
				}}
			/>
		</button>
	)
}
