import React, { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react-web";
import Link from 'next/link';
import Image from 'next/image';
import { BlazeSessionContext, UserContext } from "../../../../context";
import verifiedCheck from "../../../../public/assets/images/icons/verified.png";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import searchInstructor from '../../../../public/assets/lottie/searching_instructor.json';
import unAssigned from "../../../../public/assets/images/unassigned.png";

const listenToUnreadMessages = ({ sessionId, userId, callback }) => {
	if (sessionId) {
		return require('../../../../firebase-config').db.collection("blaze_dev")
			.doc("collections")
			.collection("blaze_sessions")
			.doc(sessionId)
			.collection("chat_meta")
			.doc(userId)
			.onSnapshot((doc) => {
				if (doc.exists) {
					callback(doc.data().unread_count);
				}
			});
	}
	return () => {};
};

export const getSubject = (arr) => {
	let sub = "";
	arr.map((w) => (sub = sub + " " + w));
	return sub.slice(1);
};

// eslint-disable-next-line react/display-name
const BlazeStudentCard = React.forwardRef(({
	                                           type,
	                                           skill,
	                                           topic,
	                                           rating,
	                                           onClick,
	                                           gradient,
	                                           sessionId,
	                                           instructorName,
	                                           instructorImage,
	                                           isSessionSelected,
	                                           queryToAdd,
                                           }, ref) => {
	const [, setInstructorRating] =
		useContext(BlazeSessionContext).instructorRating;

	const [, setCurrentSessionUnreadCount] =
		useContext(BlazeSessionContext).currentSessionUnreadCount;

	const subjectName = (skill) => {
		let splitted = skill?.split("_");
		if (splitted.length > 0) {
			return splitted.length === 3 || splitted.length === 4
				// ? splitted[2]
				// TODO: This topic condition is temporary solution
				? splitted.length === 3 && topic === 'Mathematics' ? `${splitted[0]} ${splitted[1]}th` : splitted[2]
				: getSubject(splitted.slice(3));
		}
	};

	const [user] = useContext(UserContext).user;
	const [unreadMsgCount, setUnreadMsgCount] = useState(0);

	useEffect(() => {
		if (type === "accepted") {
			const unsubscribe = listenToUnreadMessages({
				sessionId,
				userId: user?.uid,
				callback: (count) => {
					setUnreadMsgCount(count);
				},
			});
			return () => unsubscribe();
		}
	}, [sessionId]);

	useEffect(() => {
		if (unreadMsgCount >= 0 && isSessionSelected) {
			setCurrentSessionUnreadCount(unreadMsgCount);
		}
	}, [unreadMsgCount, isSessionSelected]);

	return (
		<div
			ref={ref}
			id={"blaze-sidebar-card-" + sessionId}
			className={
				isSessionSelected ? "blaze-card selected fadeIn" : "blaze-card fadeIn"
			}
			style={{boxShadow: isSessionSelected ? `${gradient[1]}8f 0px 0px 6px 2px` : 'none'}}
			onClick={() => {
				onClick();
				setInstructorRating(rating);
			}}
		>
			<Link to={`/blaze/chat/${sessionId}` + (queryToAdd ? '?' + queryToAdd : '')}>
				<div className="blaze-card-bg"></div>
				<div className={"blaze-card-content"} style={{borderColor: isSessionSelected ? (gradient[0]) : '#88888826'}}>
					<div
						className={`card-${type}`}
						style={{
							backgroundColor: gradient[0],
							boxShadow: `4px 0 14px 3px ${gradient[1]}80`,
						}}
					></div>
					<div className="blaze-card-inner">
						{unreadMsgCount > 0 && (
							<div className="unread-messages">
								<h6>{unreadMsgCount > 9 ? "9+" : unreadMsgCount}</h6>
							</div>
						)}
						<div className="blaze-card-details">
							<div className="blaze-topic">
								{/*<img*/}
								{/*  src={roundedVideoCamera}*/}
								{/*  alt="vid"*/}
								{/*  className="video-cam"*/}
								{/*  draggable={false}*/}
								{/*/>{" "}*/}
								<div>
									<h2>{topic}</h2>
									<h5>
										{subjectName(skill) === "maths"
											? "Mathematics"
											: subjectName(skill)}
									</h5>
								</div>
							</div>

							<div className="card-divider"></div>
							<div className="instructor-details">
								<div className="instructor-inner">
									{instructorImage ? (
										<div className="instructor-img">
											<Image height={100} width={100}
												src={instructorImage}
												className="image__instructor"
												draggable={false}
												alt="ins"
											/>
											<Image height={100} width={100}
												src={verifiedCheck}
												alt="v"
												className="image__verified"
												draggable={false}
											/>
										</div>
									) : type === "completed" ? (
										<div className="instructor-img">
											<Image height={100} width={100}
												src={unAssigned}
												className="image__instructor"
												alt="un"
												draggable={false}
											/>
										</div>
									) : (
										<div className="instructor-search">
											<Lottie
												options={{
													animationData: searchInstructor,
													loop: true,
												}}
											/>
										</div>
									)}
									<section>
										<div>
											<h4>
												{instructorName
													? instructorName?.split(" ")[0] + " Sir"
													: type === "completed"
														? "Unassigned"
														: "Searching..."}
											</h4>
											{/*{rating > 0 && (*/}
											{/*  <StarRatings*/}
											{/*    name="rating"*/}
											{/*    numberOfStars={5}*/}
											{/*    starSpacing="2px"*/}
											{/*    starDimension="20px"*/}
											{/*    rating={rating}*/}
											{/*    svgIconPath={starPath}*/}
											{/*    starRatedColor="#fec107"*/}
											{/*    starHoverColor="#fec107"*/}
											{/*    svgIconViewBox="0 0 207.802 207.748"*/}
											{/*  />*/}
											{/*)}*/}
										</div>
										<h6>
											PuStack{" "}
											{subjectName(skill) === "maths"
												? "Mathematics"
												: subjectName(skill)}{" "}
											Expert
										</h6>
									</section>
								</div>
								<button>
									<ArrowForwardIosRoundedIcon />
								</button>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
});

export default BlazeStudentCard;
