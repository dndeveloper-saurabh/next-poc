import React from "react";
import Link from 'next/link';
import circularIcon from "../../public/assets/images/favicon-circle.png";

const PuStackCareChatPopup = () => {
	return (
		<div className="care-popup-bubble">
			<div className="care-popup-wrapper">
				<h6 className="notification-dot" />
				<Link href="/care">
					<img src={circularIcon} alt="pustack notification" />
				</Link>
			</div>
		</div>
	);
};

export default PuStackCareChatPopup;
