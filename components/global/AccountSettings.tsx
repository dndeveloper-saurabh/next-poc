import React, {useState, useContext, useEffect, useRef} from "react";
import Modal from "react-modal";
import Fade from "@material-ui/core/Fade";
import { useMediaQuery } from "react-responsive";
import Snackbar from "@material-ui/core/Snackbar";
import CancelIcon from "@material-ui/icons/Cancel";
import { format, formatDistanceToNow } from "date-fns";
import { Drawer } from "@material-ui/core";
import Link from 'next/link';
import Axios from 'axios';
import {firebaseAPiKey} from "../../helpers";
import {useRouter} from 'next/router';
// import { Link, useLocation, useHistory } from "react-router-dom";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
// TODO: Find another alternative of react-share
import {
	EmailShareButton,
	FacebookShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	EmailIcon,
	FacebookIcon,
	WhatsappIcon,
	TwitterIcon,
	TelegramIcon,
} from "react-share";
import {
	ThemeContext,
	UserContext,
} from "../../context";

import {
	Friends,
	OpenGift,
	ShareLink,
	defaultPic,
	planet1,
	planet2,
	planet3,
	planet4,
	planet5,
	planet6,
	referralImage
} from "../../public/assets";
import "react-phone-input-2/lib/style.css";
import PuStackCareMobile from "../../containers/global/pustack-care-mobile";
import info from "../../public/assets/pustackCareChat/info.svg";

import AccountSettingsViews from "../../containers/global/account-settings-views";

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

const getReferredUserList = async (uid) => {
	return await db
		.collection("referrals")
		.doc(uid)
		.get()
		.then((doc) => doc.data().referred_user_list)
		.catch(() => []);
};


const formatJoiningDate = (timestamp) => {
	if (!timestamp) return;
	return format(new Date(timestamp), "PPP");
};

const formatJoiningDate2 = (timestamp) => {
	if (!timestamp) return;
	return formatDistanceToNow(new Date(timestamp));
};

const AccountSettings = ({ setBackdrop, profileVisibility }) => {
	const [user, ] = useContext(UserContext).user;
	const [openMenu, setOpenMenu] = useContext(UserContext).openMenu;
	const [openMenuSettings, ] =
		useContext(UserContext).openMenuSettings;
	const [openChat, setOpenChat] = useContext(UserContext).openChat;
	const [closeCarePage, setCloseCarePage] =
		useContext(UserContext).closeCarePage;

	const [isDark] = useContext(ThemeContext).theme;

	const [message, ] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [otpSent, ] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [currentPath, setCurrentPath] = useState("");
	const [openSnack, setOpenSnack] = useState(false);
	const [referredList, setReferredList] = useState([]);
	const [referralLink, setReferralLink] = useState("");
	const [openSharableModal, setOpenSharableModal] = useState(false);
	const [phoneNumberError, ] = useState(false);
	const [openLearnMore, setOpenLearnMore] = useState([false, false]);
	const [friendDetails, setFriendDetails] = useState(null);
	const [openFriendsDrawer, setOpenFriendsDrawer] = useState(false);
	const [generatingLink, setGeneratingLink] = useState(false);

	const [, setProcessingRefill] = useState(false);
	const [, setProcessingOrder] = useState(false);
	const [orderId, ] = useState(null);
	const [, setOrderStatus] = useState(false);
	const [, setOrderSuccessfull] = useState(false);

	const [, setPhoneNumber] = useState(
		user?.phone_country_code + user?.phone_number
	);
	const [,setProfileName] = useState(user?.name);
	const [, setActiveIndex] = useState(openMenuSettings ? 1 : 0);
	const [, setProfileImage] = useState({ url: user?.profile_url });
	const [, setRating] = useState(user?.app_rating ? user?.app_rating : 0);

	const router = useRouter();
	let recaptchaRef = useRef(null);
	const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });


	const milliSeconds = user?.pro_expiration_date?.seconds * 1000;
	let expiryDate = null;
	if (milliSeconds) {
		expiryDate = format(new Date(milliSeconds), "MM/dd/yyyy");
	}

	useEffect(() => {
		setPhoneNumber(user?.phone_country_code + user?.phone_number);
		// setActiveIndex(openMenuSettings ? 1 : 0);
		setRating(user?.app_rating ? user?.app_rating : 0);
		setProfileName(user?.name);
		setProfileImage({ url: user?.profile_url });
	}, [
		user?.profile_url,
		user?.phone_country_code,
		user?.phone_number,
		user?.app_rating,
	]);

	const handleSnackClose = () => {
		setOpenSnack(false);
	};


	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
		setBackdrop(true);
	};

	useEffect(() => {
		if (openMenu) {
			let currentTarget = document.getElementById("userMenuAnchor");
			handleClick({ currentTarget });
			setOpenMenu(false);
		}
	}, [openMenu]);

	useEffect(() => {
		setProfileImage({ url: user?.profile_url });
	}, [user?.profile_url]);

	useEffect(() => {
		setCurrentPath(router.pathname);
	}, [router]);



	useEffect(() => {
		console.log('phoneNumberError - ', otpSent, phoneNumberError);
	}, [phoneNumberError, otpSent])

	const handleAccountSettingsOpen = () => {
		setIsOpen(true);
		setActiveIndex(0);

		router.push(
			`${
				currentPath === "/" ? "" : "/" + currentPath.replace(/\//g, "")
			}/?page=account`
		);
	};

	useEffect(() => {
		if (openMenuSettings) setActiveIndex(1);
	}, [openMenuSettings]);

	useEffect(() => {
		user?.uid && getReferredUserListFn();
	}, [user?.uid]);

	const getReferredUserListFn = async () => {
		const res = await getReferredUserList(user?.uid);
		setReferredList(res?.sort((a, b) => b.sign_up_ts - a.sign_up_ts));
	};

	const handleLearnMoreClose = () => {
		setOpenLearnMore([false, false]);
	};

	const generateInviteLinkAndShare = async () => {
		if (user?.uid && !generatingLink) {
			setGeneratingLink(true);
			const res = await generateInvitationLink(user?.uid);
			setReferralLink(res?.shortLink);

			handleLearnMoreClose();
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

	const ReferralProgramInfo = () => (
		<div className="referral-program">
			<h1>PuStack Referral Program</h1>
			<CancelIcon
				className="close-referral-modal"
				onClick={handleLearnMoreClose}
			/>
			<div className="referral-program-div">
				<div className="referral-program-list">
					<img src={ShareLink} alt="generate" draggable={false} />
					<div>
						<h4>1. Generate link</h4>
						<h6>Generate your unique referral link</h6>
					</div>
				</div>
				<div className="referral-program-list">
					<img src={Friends} alt="invite" draggable={false} />
					<div>
						<h4>2. Invite friends</h4>
						<h6>Invite your friends to sign up through your referral link</h6>
					</div>
				</div>
				<div className="referral-program-list">
					<img src={OpenGift} alt="rewards" draggable={false} />
					<div>
						<h4>3. Get rewards</h4>
						<h6>
							Both you and your friend will get free Pro membership for 30 days
							once your friend signs up
						</h6>
					</div>
				</div>
				<button className="share-btn" onClick={generateInviteLinkAndShare}>
					Share
				</button>
			</div>
		</div>
	);

	const ReferredFriendInfo = () => (
		<div className="referral-program">
			<h1>Referral Reward Granted</h1>
			<CancelIcon
				className="close-referral-modal"
				onClick={() => setFriendDetails(null)}
			/>
			<div className="referral-program-div">
				<div className="referral-program-list granted">
					<img src={info} alt="generate" draggable={false} />
					<div>
						<h4>What happened?</h4>
						<h6>
							Your friend {friendDetails?.name} joined PuStack using your
							referral link on {formatJoiningDate(friendDetails?.sign_up_ts)}.
							For this kind gesture, we have rewarded you both PuStack Pro
							membership for 30 more days!
						</h6>
					</div>
				</div>
				<div className="referral-program-list granted">
					<img src={info} alt="invite" draggable={false} />
					<div>
						<h4>Can I earn more?</h4>
						<h6>
							Of course! There is no limit to rewards you can earn! Invite 1
							friend, get a free month. Invite 10, get 10 months! As simple as
							1, 2, 3...
						</h6>
					</div>
				</div>

				<button className="share-btn" onClick={generateInviteLinkAndShare}>
					Invite More Friends!
				</button>
			</div>
		</div>
	);

	const ReferredFriendsList = () => (
		<div className="referral-program all-list">
			<h1>Referrals</h1>
			<CancelIcon
				className="close-referral-modal"
				onClick={() => setOpenFriendsDrawer(false)}
			/>
			<div className="referral-program-div">
				<div className="referral-graph">
					<div className="main-user">
						<div className="user-ring"></div>
						<img src={user?.profile_url} alt={user?.name} draggable={false} />
					</div>
					{referredList?.slice(0, 5)?.map((item, i) => (
						<img
							src={item.profile_url}
							className={`referred-${i}`}
							alt={item?.name}
							draggable={false}
						/>
					))}
					{[planet1, planet2, planet3, planet4, planet5, planet6].map(
						(planet, i) => (
							planet
							// <img
							//   src={planet}
							//   className={`planet-${i}`}
							//   alt="planet"
							//   draggable={false}
							// />
						)
					)}
				</div>
				<div className="referred-list">
					<h6>Recent</h6>
					<div className="referred-friends">
						{referredList?.map((item) => (
							<div key={item?.name} className="referred-details-wrapper">
								<img
									src={item.profile_url}
									alt={item?.name}
									draggable={false}
								/>
								<div className="referred-details">
									<h5>{item?.name}</h5>
									<p>Joined {formatJoiningDate2(item?.sign_up_ts)} ago.</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	useEffect(() => {
		const orderStatusListener = () => {
			const doc = require('../../firebase-config').db.collection("orders").doc(orderId);
			setProcessingOrder(true);

			return doc.onSnapshot((docSnapshot) => {
				const { transaction_status } = docSnapshot.data();

				if (
					transaction_status === "authorization_failed" ||
					transaction_status === "payment_capture_failed"
				) {
					setOrderSuccessfull(false);
					setTimeout(() => setOrderStatus(true), 1000);
					setProcessingRefill(false);
				}
				if (transaction_status === "payment_captured") {
					setOrderSuccessfull(true);
					setTimeout(() => setOrderStatus(true), 1000);
					setProcessingRefill(false);
				}
			});
		};

		if(orderId) {
			const unsubscribe = orderStatusListener();
			return () => unsubscribe();
		}
	}, [orderId])

	return (
		<>
			<div>
				{user ? (
					<div className="account-settings">
						<div ref={(ref) => (recaptchaRef = ref)}>
							<div id="recaptcha-container" />
						</div>
						<Snackbar
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							open={openSnack}
							onClose={handleSnackClose}
							message={message}
							key={"bottom" + "center"}
							TransitionComponent={Fade}
							className={isDark ? "snackbar snackbarDark" : "snackbar"}
						/>
						{profileVisibility && (
							<div
								className="user__menu__btn"
								id="userMenuAnchor"
								onClick={(e) =>
									isSmallScreen ? handleAccountSettingsOpen() : handleClick(e)
								}
								referrerPolicy="no-referrer"
							>
								<img
									className="navigation-profile-img"
									src={user?.profile_url ? user?.profile_url : defaultPic}
									alt="dp"
									draggable={false}
								/>
								<div className="user__name">{user?.name?.split(" ")[0]}</div>
							</div>
						)}
						<Modal
							shouldCloseOnEsc={true}
							shouldCloseOnOverlayClick={true}
							onRequestClose={handleLearnMoreClose}
							ariaHideApp={false}
							overlayClassName="new-post-modal-overlay"
							isOpen={openLearnMore[0]}
							className={
								isDark
									? "referral-program-wrapper dark"
									: "referral-program-wrapper"
							}
						>
							<ReferralProgramInfo />
						</Modal>
						<Drawer
							variant="temporary"
							open={openLearnMore[1]}
							anchor={"bottom"}
							onClose={() => {
								handleLearnMoreClose();
								navigator && navigator.vibrate && navigator.vibrate(5);
							}}
							ModalProps={{ keepMounted: true }}
							className="referral-drawer"
						>
							<div
								className={
									isDark
										? "referral-program-wrapper dark"
										: "referral-program-wrapper"
								}
							>
								<div className="drawer-dash"></div>
								<ReferralProgramInfo />
							</div>
						</Drawer>
						{!isSmallScreen ? (
							<Modal
								shouldCloseOnEsc={true}
								shouldCloseOnOverlayClick={true}
								onRequestClose={() => setFriendDetails(null)}
								ariaHideApp={false}
								overlayClassName="new-post-modal-overlay"
								isOpen={Boolean(friendDetails)}
								className={
									isDark
										? "referral-program-wrapper dark"
										: "referral-program-wrapper"
								}
							>
								<ReferredFriendInfo />
							</Modal>
						) : (
							<Drawer
								variant="temporary"
								open={friendDetails}
								anchor={"bottom"}
								onClose={() => {
									setFriendDetails(null);
									navigator && navigator.vibrate && navigator.vibrate(5);
								}}
								ModalProps={{ keepMounted: true }}
								className="referral-drawer"
							>
								<div
									className={
										isDark
											? "referral-program-wrapper dark"
											: "referral-program-wrapper"
									}
								>
									<div className="drawer-dash"></div>
									<ReferredFriendInfo />
								</div>
							</Drawer>
						)}

						<Modal
							shouldCloseOnEsc={true}
							shouldCloseOnOverlayClick={true}
							onRequestClose={() => setOpenSharableModal(false)}
							ariaHideApp={false}
							overlayClassName="new-post-modal-overlay"
							isOpen={openSharableModal}
							className={
								isDark
									? "referral-program-wrapper dark"
									: "referral-program-wrapper"
							}
						>
							<div className="referral-program">
								<h1>Share</h1>
								<img
									src={referralImage}
									alt="referral"
									className="referral-banner"
								/>
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

						<AccountSettingsViews anchorEl={anchorEl} setAnchorEl={setAnchorEl} isOpen={isOpen} setIsOpen={setIsOpen} profileVisibility={profileVisibility} setBackdrop={setBackdrop} />

						<Drawer
							variant="temporary"
							open={openChat}
							anchor={"right"}
							onClose={() => {
								setOpenChat(false);
								setCloseCarePage(true);
							}}
							className={isDark ? "dark" : ""}
							ModalProps={{ keepMounted: true }}
						>
							{!closeCarePage && <PuStackCareMobile />}
						</Drawer>
						{isSmallScreen && (
							<Drawer
								variant="temporary"
								open={openFriendsDrawer}
								anchor={"bottom"}
								onClose={() => {
									setOpenFriendsDrawer(false);
									navigator && navigator.vibrate && navigator.vibrate(5);
								}}
								ModalProps={{ keepMounted: true }}
								className="referral-drawer"
							>
								<div
									className={
										isDark
											? "referral-program-wrapper list dark"
											: "referral-program-wrapper list"
									}
								>
									<div className="drawer-dash"></div>
									<ReferredFriendsList />
								</div>
							</Drawer>
						)}

						{/*<Dialog open={showPDF} onClose={() => setShowPDF(false)}>*/}
						{/*  {showPDF && (*/}
						{/*    <PdfPreview*/}
						{/*      pdf={documentToShow}*/}
						{/*      onClose={() => setShowPDF(false)}*/}
						{/*    />*/}
						{/*  )}*/}
						{/*</Dialog>*/}
					</div>
				) : (
					<>
						<div className="header__right">
							<div className="header__info">
								<Link href="/signin">
									<button className="answers__bottomButton">Signin</button>
								</Link>
							</div>
						</div>
					</>
				)}
			</div>
			{/*<Dialog c open={openGradeChangeModal} onClose={() => setOpenGradeChangeModal(false)}>*/}
			{/*  <div className={"grade_change-modal" + (isDark ? ' dark' : '')}>*/}
			{/*    <div className="grade_change-header">*/}
			{/*      <h2>Update Grade</h2>*/}
			{/*      <div className="grade_change-header-close_icon" onClick={() => setOpenGradeChangeModal(false)}>*/}
			{/*        <CloseIcon/>*/}
			{/*      </div>*/}
			{/*    </div>*/}
			{/*    <div className="grade_change-item-container">*/}
			{/*      {grades.map(gradeItem => (*/}
			{/*        <div onClick={() => setActiveGradeItemInModal(gradeItem.value)} className={"grade_change-item" + (gradeItem.enable ? '' : ' disabled') + (activeGradeItemInModal === gradeItem.value ? ' active' : '') + (user?.grade === gradeItem.value ? ' current' : '')}>*/}
			{/*          <img src={gradeItem.planet} alt={gradeItem.name}/>*/}
			{/*          <h4>{gradeItem.name}</h4>*/}
			{/*        </div>*/}
			{/*      ))}*/}
			{/*      <button className="green" onClick={() => handleGradeChange(activeGradeItemInModal, gradeItem.enable)}>*/}
			{/*        <span style={{opacity: changingGrade ? 0 : 1}}>Save</span>*/}
			{/*        <div className="loader" style={{opacity: changingGrade ? 1 : 0}}>*/}
			{/*          <Lottie*/}
			{/*            options={{ animationData: circularProgress, loop: true }}*/}
			{/*          />*/}
			{/*        </div>*/}
			{/*      </button>*/}
			{/*      <button onClick={() => setOpenGradeChangeModal(false)}>Close</button>*/}
			{/*    </div>*/}
			{/*  </div>*/}
			{/*</Dialog>*/}
		</>
	);
};

export default AccountSettings;
