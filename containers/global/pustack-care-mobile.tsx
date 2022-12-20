import React, {
	useContext,
	useEffect,
	useState,
	useRef,
	useCallback,
} from "react";
// TODO: Use fetch api instead of axios
import Axios from 'axios';
import Image1 from 'next/image';
import Modal from "react-modal";
import Lottie from "lottie-react-web";
import Resizer from "react-image-file-resizer";
import CancelIcon from "@material-ui/icons/Cancel";
import { TextareaAutosize } from "@material-ui/core";
import { SwipeableDrawer } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {careFormattedDate} from "../../helpers/functions/careFormattedDate";
import {groupCareMessages} from "../../helpers/functions/groupCareMessages";
import {makeUniqueId} from "../../helpers/functions/makeUniqueId";
import { UserContext, ThemeContext } from "../../context";
import InfoIcon from "@material-ui/icons/Info";
import Loading from "../../public/assets/lottie/iosLoading.json";
import SendIcon from "../../public/assets/blaze/sendIcon";
import info from "../../public/assets/pustackCareChat/info.svg";
import ChatLoader from "../../components/global/ChatLoader";
import CircleLogo from "../../public/assets/images/favicon-circle.png";
import imageGallery from "../../public/assets/images/blaze/imageGallery.svg";
import circularProgress from "../../public/assets/lottie/circularProgress.json";
import pdfIcon from "../../public/assets/images/pdf.svg";
import PdfPreview from "../../components/pdf-preview";

const updateCareMessageCount = ({ userId, grade }) => {
	require('../../firebase-config.js').db.collection("user_notifications")
		.doc(grade)
		.collection("user_notifications")
		.doc(userId)
		.set(
			{
				unread_care_message_count: 0,
			},
			{ merge: true }
		)
		.then(() => {})
		.catch((err) => console.log(err));
};

const updateCareChat = async ({ body, userId }) => {
	return await require('../../firebase-config.js').db
		.collection("care_internal")
		.doc("collections")
		.collection("student")
		.doc(userId)
		.collection("messages_student")
		.add(body)
		.then(() => true)
		.catch(() => false);
};

const getPustackCareNewChat = ({ userId, doc }) => {
	return require('../../firebase-config.js').db
		.collection("care_internal")
		.doc("collections")
		.collection("student")
		.doc(userId)
		.collection("messages_student")
		.orderBy("sent_on", "asc")
		.where("sent_on", ">", doc?.sent_on);
};

const getPustackCareChat = async ({ userId }) => {
	return await require('../../firebase-config.js').db
		.collection("care_internal")
		.doc("collections")
		.collection("student")
		.doc(userId)
		.collection("messages_student")
		.orderBy("sent_on", "desc")
		.limit(21)
		.get()
		.then((snapshot) => {
			let _data = [];
			if (snapshot.docs.length !== 0) {
				snapshot.forEach((doc) => {
					_data.push(doc.data());
				});
			}

			return _data;
		});
};

const getMorePustackCareChat = async ({ userId, doc }) => {
	return await require('../../firebase-config.js').db
		.collection("care_internal")
		.doc("collections")
		.collection("student")
		.doc(userId)
		.collection("messages_student")
		.orderBy("sent_on", "desc")
		.where("sent_on", "<", doc?.sent_on)
		.limit(10)
		.get()
		.then((snapshot) => {
			let _data = [];
			if (snapshot.docs.length !== 0) {
				snapshot.forEach((doc) => {
					_data.push(doc.data());
				});
			}

			return _data;
		})
		.catch(() => []);
};

const updateChatImage = async (file, userId) => {
	let path = `pustack_care/${userId}/${file?.name}`;
	let _url = null;

	await storage
		.ref()
		.child(path)
		.put(await fetch(file?.url).then((r) => r.blob()))
		.then(async (snapshot) => {
			return snapshot.ref.getDownloadURL().then((url) => (_url = url));
		});

	return _url;
};

const updateStudentCareMeta = async (
	userId,
	activeSessionId,
	agentId,
	pastSessionList
) => {

	await require('../../firebase-config.js').db
		.collection("care_internal")
		.doc("collections")
		.collection("student")
		.doc(userId)
		.set(
			{
				active_session_id: activeSessionId,
				agent_id: agentId,
				past_session_list: pastSessionList,
			},
			{ merge: true }
		)
		.catch((err) => console.log(err));
};

const pickAgentCloudFunction = async () => {
	return await Axios.post(
			"https://us-central1-avian-display-193502.cloudfunctions.net/pickAgentLogic"
		)
		.then((result) => result.data)
		.catch((err) => {
			return null;
		});
};

const PuStackCareMobile = () => {
	const [user] = useContext(UserContext).user;
	const [isDark] = useContext(ThemeContext).theme;
	const [openChat, setOpenChat] = useContext(UserContext).openChat;
	const [unreadCareMsgCount] = useContext(UserContext).unreadCareMsgCount;
	const [, setCloseCarePage] = useContext(UserContext).closeCarePage;

	const [chatData, setChatData] = useState(null);
	const [newChatData, setNewChatData] = useState(null);
	const [images, setImages] = useState([]);
	const [openSnack, setOpenSnack] = useState(false);
	const [snackMessage, setSnackMessage] = useState("");
	const [chatText, setChatText] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [openInfo, setOpenInfo] = useState(false);
	const [agentId, setAgentId] = useState("");
	const [moreChat, setMoreChat] = useState(false);
	const [autoScroll, setAutoScroll] = useState(true);
	const [showLogo, setShowLogo] = useState(true);
	const [isVisible, setIsVisible] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [activeSessionId, setActiveSessionId] = useState(null);
	const [pastSessionList, setPastSessionList] = useState([]);
	const [pdfUrl, setPdfUrl] = useState(null);
	const [showPdf, setShowPdf] = useState(false);

	const changeFlagRef = useRef(true);

	const visibility = useRef(null);
	const nthLastRef = useRef(null);
	const endScroll = useRef(null);
	const observer = useRef(null);

	useEffect(() => {
		autoScroll && endScroll.current.scrollIntoView({ behavior: "smooth" });
	}, [chatData, newChatData]);

	// TODO: implement history.listen
	// useEffect(() => {
	// 	if (openChat) {
	// 		history.listen((_, action) => {
	// 			if (action === "POP") {
	// 				setOpenChat(false);
	// 			}
	// 		});
	// 	}
	// });

	useEffect(() => {
		getPustackCareChatFn();
	}, []);

	useEffect(() => {
		const unsubscribe = checkAgentAvailabilityFn();
		return () => unsubscribe();
	}, []);

	const checkAgentAvailabilityFn = () => {
		return require('../../firebase-config.js').db.collection("care_internal")
			.doc("collections")
			.collection("student")
			.doc(user?.uid)
			.onSnapshot((doc) => {
				if (doc.data()) {
					setActiveSessionId(doc.data().active_session_id);
					setAgentId(doc.data().agent_id);
					setPastSessionList(doc.data().past_session_list);
				} else {
					setActiveSessionId(null);
					setAgentId(null);
					setPastSessionList([]);
				}
			});
	};

	const visibilityRef = useCallback(function (node) {
		if (node !== null) {
			if (visibility.current) visibility.current.disconnect();

			visibility.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
				} else {
					setIsVisible(false);
				}
			});
			if (node) visibility.current.observe(node);
		}
	}, []);

	const lastChatRef = useCallback(function (node) {
		if (node !== null) {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					if (moreChat && autoScroll) {
						setIsFetching(true);

						if (chatData[0]) getMorePustackCareChatFn();
						else setIsFetching(false);
					}
				}
			});
			if (node) observer.current.observe(node);
		}
	}, []);

	useEffect(() => {
		if (chatData?.length > 0) {
			const unsubscribe = getPustackCareNewChatFn();
			return () => unsubscribe();
		}
	}, [chatData]);

	useEffect(() => {
		if (unreadCareMsgCount > 0) {
			updateCareMessageCount({ userId: user?.uid, grade: user?.grade });
		}
	}, [unreadCareMsgCount]);

	const pickAgent = async () => {
		const response = await pickAgentCloudFunction();
		return response;
	};

	const getPustackCareChatFn = async (flag = true) => {
		setIsLoading(flag);
		let _data = await getPustackCareChat({ userId: user.uid });

		setIsLoading(false);
		setChatData(groupCareMessages(_data.sort((a, b) => a.sent_on - b.sent_on)));

		if (_data?.length === 21) setShowLogo(false);
		setAutoScroll(true);
		setTimeout(() => setMoreChat(true), 1500);
	};

	const getMorePustackCareChatFn = async () => {
		let _data = await getMorePustackCareChat({
			userId: user.uid,
			doc: chatData[0],
		});

		if (_data?.length < 10) {
			setMoreChat(false);
			setShowLogo(true);
		} else {
			setShowLogo(false);
			setMoreChat(false);
			setTimeout(() => setMoreChat(true), 1500);

			if (nthLastRef.current) nthLastRef.current.scrollIntoView({ top: 62 });
		}

		setIsFetching(false);
		setAutoScroll(false);
		setTimeout(() => setAutoScroll(true), 1500);
		setChatData([
			...groupCareMessages(_data.sort((a, b) => a.sent_on - b.sent_on)),
			...chatData,
		]);
	};

	const getPustackCareNewChatFn = () => {
		return getPustackCareNewChat({
			userId: user?.uid,
			doc: chatData[chatData?.length - 1],
		}).onSnapshot((snapshot) => {
			let _data = [];
			snapshot.forEach((doc) => _data.push(doc.data()));
			setNewChatData(groupCareMessages(_data));
		});
	};

	const resizeImage = (file) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				600,
				600,
				"JPEG",
				90,
				0,
				(uri) => resolve(uri),
				"file"
			);
		});

	const imageSelectionHandler = async (e) => {
		const { files } = e.target;

		let _images = [];

		let _num =
			files.length + images.length > 1
				? images.length - files.length > 0
					? images.length - files.length
					: 1
				: files.length;

		if (files.length + images.length > 1) {
			setSnackMessage("Only 1 image is allowed at a time");
			setOpenSnack(true);
			setTimeout(() => setOpenSnack(false), 5000);
		}

		if (images.length !== 1) {
			for (let i = 0; i < _num; i++) {
				const resizedImage = await resizeImage(files[i]);

				if (resizedImage instanceof Blob) {
					_images[i] = {
						url: URL.createObjectURL(resizedImage),
						ext: files[i].name.split('.').slice(-1)[0],
						name: files[i].name,
					};
				}
			}
			setImages(images.concat(_images));
			setChatText("");
		}
	};

	const handleImageDelete = () => {
		setImages([]);
	};

	const handleReplySubmit = async () => {
		setIsSending(true);

		let _agentId = agentId;
		let _activeSessionId = activeSessionId;
		let _pastSessionList = [];

		if (agentId === null) {
			_agentId = await pickAgent();
			setAgentId(_agentId);

			_activeSessionId = makeUniqueId(20);
			setActiveSessionId(_activeSessionId);

			if (newChatData?.length > 0) {
				_pastSessionList = [
					...pastSessionList,
					{
						[newChatData[newChatData.length - 1]?.receiver_id]:
						newChatData[newChatData.length - 1]?.session_id,
					},
				];
			} else {
				if (chatData.length > 0) {
					_pastSessionList = [
						...pastSessionList,
						{
							[chatData[chatData.length - 1]?.receiver_id]:
							chatData[chatData.length - 1]?.session_id,
						},
					];
				} else {
					_pastSessionList = [...pastSessionList];
				}
			}

			setPastSessionList(_pastSessionList);

			await updateStudentCareMeta(
				user?.uid,
				_activeSessionId,
				_agentId,
				_pastSessionList
			);
		}

		let url = null;
		if (images.length > 0) {
			url = await updateChatImage(images[0], user?.uid);
		}

		let body = {
			attachment:
				images.length > 0
					? {
						attachment_name: images[0].name,
						attachment_type: "image",
						attachment_url: url,
					}
					: null,
			id: makeUniqueId(20),
			message: chatText,
			receiver_id: _agentId,
			sender_id: user?.uid,
			sent_by: "student",
			sent_on: +new Date(),
			session_id: _activeSessionId,
			type: images.length > 0 ? "attachment" : "text",
		};

		const response = await updateCareChat({ body, userId: user?.uid });

		if (!response) {
			setOpenSnack(true);
			setSnackMessage("Some error occured, try again");
			setOpenSnack(true);
			setChatText(body.message);
			setTimeout(() => setOpenSnack(false), 5000);
		} else {
			setImages([]);
			setChatText("");
			if (chatData?.length === 0) {
				getPustackCareChatFn(false);
			}
		}
		setIsSending(false);
	};

	return (
		<div className="care-chat-wrapper-mobile">
			<div
				className="care-chat-head"
				style={{
					background: isVisible && "transparent",
					borderBottom: isVisible
						? "none"
						: "1px solid rgba(128, 128, 128, 0.15)",
				}}
			>
				<div>
					<ChevronLeftIcon
						onClick={() => {
							setOpenChat(false);
							setTimeout(() => setCloseCarePage(true), 500);
						}}
					/>
					<p style={{ opacity: isVisible ? 0 : 1 }}>PuStack Care</p>
				</div>
				<InfoIcon onClick={() => setOpenInfo(true)} />
			</div>

			<div className="care-chat-body">
				{showLogo && (
					<div className="pustack-education fadeIn">
						<Image1 height={100} width={100} alt="pc" src={CircleLogo} ref={visibilityRef} />
						<h3>PuStack Education</h3>
						<p>Our student care agents are always happy to help.</p>
					</div>
				)}
				<div className="care-chat-main">
					{isFetching && (
						<div className="fetching-old-chats">
							<Lottie options={{ animationData: Loading, loop: true }} />
						</div>
					)}
					<div className="lastChatRef" ref={lastChatRef} />
					{chatData?.map(
						(
							{ sent_by, message, type, sent_on, attachment, id, position },
							i
						) =>
							type === "text" ? (
								<div
									className="chat-body"
									key={id}
									ref={i === 9 ? nthLastRef : null}
								>
									<h6>{careFormattedDate(sent_on)}</h6>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" &&
											(position === "none" || position === "bottom") && (
												<Image1 height={100} width={100}
													src={CircleLogo}
													alt="agent"
													className="agent-avatar"
												/>
											)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<p className={position}>{message}</p>
										</div>
									</div>
								</div>
							) : attachment?.attachment_type === "pdf" ? (
								<div className="chat-body" key={id}>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" && (
											<Image1 height={100} width={100}
												src={CircleLogo}
												alt="agent"
												className="agent-avatar"
											/>
										)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<PdfAttachment
												clickHandler={() => {
													setOpenModal(true);
													setPdfUrl(attachment?.attachment_url);
													setShowPdf(true);
												}}
											/>
										</div>
									</div>
								</div>
							) : (
								<div
									className="chat-body img"
									key={id}
									ref={i === 0 ? nthLastRef : null}
								>
									<h6>{careFormattedDate(sent_on)}</h6>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" &&
											(position === "none" || position === "bottom") && (
												<Image1 height={100} width={100}
													src={CircleLogo}
													alt="agent"
													className="agent-avatar"
												/>
											)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<ImageMsg height={100} width={100}
												attachment={attachment}
												setOpenModal={setOpenModal}
												setImageUrl={setImageUrl}
												position={position}
												isStudent={sent_by === "student"}
											/>
										</div>
									</div>
								</div>
							)
					)}
					{newChatData?.map(
						(
							{ sent_by, message, type, sent_on, attachment, id, position },
							i
						) =>
							type === "text" ? (
								<div className="chat-body" key={id}>
									<h6>{careFormattedDate(sent_on)}</h6>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" &&
											(position === "none" || position === "bottom") && (
												<Image1 height={100} width={100}
													src={CircleLogo}
													alt="agent"
													className="agent-avatar"
												/>
											)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<p className={position}>{message}</p>
										</div>
									</div>
								</div>
							) : attachment?.attachment_type === "pdf" ? (
								<div className="chat-body" key={id}>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" && (
											<Image1 height={100} width={100}
												src={CircleLogo}
												alt="agent"
												className="agent-avatar"
											/>
										)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<PdfAttachment
												clickHandler={() => {
													setOpenModal(true);
													setPdfUrl(attachment?.attachment_url);
													setShowPdf(true);
												}}
											/>
										</div>
									</div>
								</div>
							) : (
								<div className="chat-body img" key={id}>
									<h6>{careFormattedDate(sent_on)}</h6>
									<div
										style={{
											justifyContent:
												sent_by === "student" ? "flex-end" : "flex-start",
										}}
									>
										{sent_by !== "student" &&
											(position === "none" || position === "bottom") && (
												<Image1 height={100} width={100}
													src={CircleLogo}
													alt="agent"
													className="agent-avatar"
												/>
											)}
										<div
											className={sent_by === "student" ? "student" : "agent"}
										>
											<Image1 height={100} width={100}Msg
												attachment={attachment}
												setOpenModal={setOpenModal}
												setImageUrl={setImageUrl}
												position={position}
												isStudent={sent_by === "student"}
											/>
										</div>
									</div>
								</div>
							)
					)}
					{isLoading && (
						<div className="chat-body">
							<div className="chat-loader-wrapper">
								<ChatLoader />
								<ChatLoader />
							</div>
						</div>
					)}
					<div className="scroll__to__end" ref={endScroll}></div>
					{openSnack && <div className="snack-message">{snackMessage}</div>}
				</div>
				{images?.length > 0 && (
					<>
						<CancelIcon className="delete-image" onClick={handleImageDelete} />
						<Image1 height={100} width={100} className="selected-image" src={images[0]?.url} alt="img" />
					</>
				)}
				<div className="reply-wrapper">
					<div className="user-chat-input">
						<div
							className={
								isDark ? "care-image-picker dark" : "care-image-picker"
							}
						>
							<label htmlFor="image-picker">
								<div>
									<Image1 height={100} width={100}
										className="care__input__image"
										src={imageGallery}
										alt="chatImageInput"
									/>
								</div>
							</label>
							<input
								accept="image/*"
								type="file"
								id="image-picker"
								style={{ display: "none" }}
								onChange={imageSelectionHandler}
							/>
						</div>

						<div className="textarea__wrapper">
							<TextareaAutosize
								onChange={(event) =>
									changeFlagRef.current && setChatText(event.target.value)
								}
								placeholder="Enter your message here"
								disabled={images?.length > 0}
								className="care-text-input"
								aria-label="maximum height"
								value={chatText}
								rowsMax={4}
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										changeFlagRef.current = false;
										handleReplySubmit();
									} else {
										changeFlagRef.current = true;
									}
								}}
							/>
						</div>
						<button
							onClick={handleReplySubmit}
							// onClick={() => setIsSending(!isSending)}
							className="care-reply-btn"
							disabled={(chatText === "" && images.length === 0) || isSending}
						>
							{!isSending ? (
								<SendIcon
									className="care-send-icon"
									color={
										chatText === "" && images?.length === 0
											? "grey"
											: "var(--color-highlight)"
									}
								/>
							) : (
								<div className="circular__progress__lottie">
									<Lottie
										options={{ animationData: circularProgress, loop: true }}
									/>
								</div>
							)}
						</button>
					</div>
				</div>
			</div>

			<Modal
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => {
					setOpenModal(false);
					setShowPdf(false);
					setImageUrl(null);
				}}
				ariaHideApp={false}
				className="pustack-care-modal"
				overlayClassName="new-post-modal-overlay"
				isOpen={openModal}
			>
				<div className="care-chat-image">
					<div className="container-img">
						{imageUrl && <Image1 height={100} width={100} src={imageUrl} alt="chatimg" draggable={false} />}
						{showPdf && (
							<PdfPreview
								pdf={pdfUrl}
								onClose={() => {
									setOpenModal(false);
									setShowPdf(false);
									setImageUrl(null);
								}} containerClasses={undefined} isPage={undefined}							/>
						)}
						{imageUrl && (
							<CancelIcon
								className="close-image"
								onClick={() => {
									setOpenModal(false);
									setImageUrl(null);
								}}
							/>
						)}
					</div>
				</div>
			</Modal>
			<SwipeableDrawer
				variant="temporary"
				open={openInfo}
				anchor="bottom"
				onClose={() => {
					setOpenInfo(false);
					navigator && navigator.vibrate && navigator.vibrate(5);
				}}
				className={isDark ? "info-care dark" : "info-care"}
				ModalProps={{ keepMounted: true }}
			 onOpen={() => {}}>
				<div className="info-wrapper">
					<h5 />
					<h4>About PuStack Care</h4>
					<CancelIcon
						className="close-info"
						onClick={() => {
							setOpenInfo(false);
							navigator && navigator.vibrate && navigator.vibrate(5);
						}}
					/>
					<div className="info-content">
						<div>
							<Image1 height={100} width={100} src={info} alt="info" />
							<div>
								<h5>What is PuStack Care?</h5>
								<p>
									Pustack agents are always happy to assist you with anything
									related to our products and services. Just send us a message
									and you will get a notification when we respond.{" "}
									<span role="img" aria-label="smile">
                    🙂
                  </span>
								</p>
							</div>
						</div>
						<div>
							<Image1 height={100} width={100} src={info} alt="info" />
							<div>
								<h5>Can agents help me know more about PuStack?</h5>
								<p>
									Ofcourse! All of our agents know our services by heart and are
									always looking for your questions
								</p>
							</div>
						</div>
						<div>
							<Image1 height={100} width={100} src={info} alt="info" />
							<div>
								<h5>Can I get my academic doubts answered?</h5>
								<p>
									Our agents are not teachers, they can help you know more about
									our service; however, they will not be able to clear your
									concepts or solve academic doubts you may have. (Hint: PuStack
									Blaze can help!)
								</p>
							</div>
						</div>
					</div>
					<button
						onClick={() => {
							setOpenInfo(false);
							navigator && navigator.vibrate && navigator.vibrate(5);
						}}
					>
						Okay
					</button>
				</div>
			</SwipeableDrawer>
		</div>
	);
};

export default PuStackCareMobile;

const ImageMsg = ({
	                  attachment,
	                  setOpenModal,
	                  setImageUrl,
	                  position,
	                  isStudent,
                  }) => {
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const objImg = new Image();
		objImg.src = attachment?.attachment_url;
		objImg.onload = () => setImageLoaded(true);
	}, [attachment]);

	return imageLoaded ? (
		<Image1 height={100} width={100}
			src={attachment?.attachment_url}
			alt="img"
			onClick={() => {
				setOpenModal(true);
				setImageUrl(attachment?.attachment_url);
			}}
			className={position}
		/>
	) : (
		<div
			className={`loading-chat-image ${
				isStudent ? "student" : "agent"
			} ${position}`}
		>
			<Lottie options={{ animationData: Loading, loop: true }} />
		</div>
	);
};

const PdfAttachment = ({ clickHandler }) => {
	return (
		<div className="care-pdf" onClick={clickHandler}>
			<Image1 height={100} width={100} src={pdfIcon} alt="img" />
			<h6> Tap to View</h6>
		</div>
	);
};
