import React, {useEffect, useState} from "react";
import RightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';

const getSubject = (arr) => {
	let sub = "";
	arr.map((w) => (sub = sub + " " + w));
	return sub.slice(1);
};

const OngoingCard = ({ onClick, title, gradient, instructorId, sessionId, skill, studentId, instrcutorImage: instructorImage, instructorName }) => {
	const [unreadCount, setUnreadCount] = useState(0);

	// TOOD: Implement the chat meta feature
	useEffect(() => {
		const unsubscribe = require('../../firebase-config').db
			.collection('/blaze_dev/collections/blaze_sessions/' + sessionId + '/chat_meta')
			.doc(studentId)
			.onSnapshot((snapshot) => {
				if(snapshot.exists) {
					setUnreadCount(snapshot.data().unread_count);
				}
			})

		return () => unsubscribe();
	}, [])

	const subjectName = () => {
		let splitted = skill?.split("_");
		if (splitted.length > 0) {
			return splitted.length === 3 || splitted.length === 4
				? splitted[2]
				: getSubject(splitted.slice(3));
		}
	};
	return (
		<div className="ongoing-card fadeIn" onClick={onClick}>
			<div className="ongoing-card-bg" />
			<div className="card-content">
				<div
					className="card-neon-line"
					style={{
						backgroundColor: gradient[0],
						boxShadow: `4px 0 14px 3px ${gradient[1]}80`,
					}}
				/>
				<h1>{title}</h1>
				{unreadCount > 0 && <div className="card-unread_count">
          <span>{unreadCount}</span>
        </div>}
			</div>
			<div className="card-divider"></div>
			<div className="student-details">
				<div className="student-inner">
					<div className="student-img">
						<img
							src={instructorImage}
							className="image__student"
							draggable={false}
							alt="ins"
						/>
					</div>

					<section>
						<div>
							<h4>{instructorName ?? "Pustack Instructor"}</h4>
						</div>
						<h6>Pustack {subjectName()} Expert</h6>
					</section>
				</div>
				<button>
					<RightRoundedIcon />
				</button>
			</div>
		</div>
	);
};

export default OngoingCard;
