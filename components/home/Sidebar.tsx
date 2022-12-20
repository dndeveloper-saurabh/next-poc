import React, { useContext } from "react";
import format from "date-fns/format";
import Link from 'next/link';
import Image from 'next/image';
import CreateIcon from "@material-ui/icons/Create";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import {
	ThemeContext,
	UserContext,
	PustackProContext,
	SubjectModalContext,
} from "../../context";

import UserAnalytics from "./UserAnalytics";
import proMaskBg from "../../public/assets/images/userMenu/proMaskBg.svg";
import astronaut from "../../public/assets/images/userMenu/pro_person.png";
import planet1 from "../../public/assets/images/userMenu/pro_planet_blue.svg";
import planet2 from "../../public/assets/images/userMenu/pro_planet_purple.svg";
import planet3 from "../../public/assets/images/userMenu/pro_planet_yellow.svg";
import useStandardGrade from "../../hooks/isStandardGrade";
import useSnackbar from "../../hooks/snackbar/useSnackbar";

const HomeSidebar = ({
	                     sectionSelected,
	                     setSectionSelected,
	                     sessionsToday,
                     }) => {
	const [isDark] = useContext(ThemeContext).theme;
	const [isUserPro] = useContext(UserContext).tier;
	const [totalSeconds] = useContext(UserContext).totalSeconds;
	const [, setIsSliderOpen] = useContext(PustackProContext).value;
	const [isSubjectModalOpen] = useContext(SubjectModalContext).isOpen;
	const isStandardGrade = useStandardGrade();
	const {show} = useSnackbar();

	const handleMenuItemClick = (i) => {
		setSectionSelected(i);
	};

	return (
		<div
			className={isDark ? "home-sidebar-wrapper dark" : "home-sidebar-wrapper"}
			onClick={() => {
				show({
					title: 'From Dashboard',
					type: 'success'
				})
			}}
		>
			<div>
				<h3
					className="home-sidebar-title"
					style={{
						animationPlayState: isSubjectModalOpen ? "paused" : "running",
					}}
				>
					Home
				</h3>
				{(isStandardGrade !== null && isStandardGrade) && <div className={isDark ? "home-sidebar-menu dark" : "home-sidebar-menu"} >
          <div
            className={
							sectionSelected === 0
								? "home-sidebar-menu-item menu-selected"
								: "home-sidebar-menu-item"
						}
            onClick={() => handleMenuItemClick(0)}
          >
            <h4>
              <MenuBookIcon />
            </h4>
            <h5>Learn</h5>
          </div>
          <div
            className={
							sectionSelected === 1
								? "home-sidebar-menu-item menu-selected"
								: "home-sidebar-menu-item"
						}
            onClick={() => handleMenuItemClick(1)}
          >
            <h4>
              <EmojiObjectsIcon style={{ fontSize: 24 }} />
            </h4>
            <h5>Tips</h5>
          </div>
          <div
            className={
							sectionSelected === 2
								? "home-sidebar-menu-item menu-selected"
								: "home-sidebar-menu-item"
						}
            onClick={() => handleMenuItemClick(2)}
          >
            <h4>
              <CreateIcon />
            </h4>
            <h5>Practice</h5>
          </div>
        </div>
				}
				{sessionsToday?.length > 0 && (
					<>
						<SectionDivider isDark={isDark} />
						<div className="today-sessions">
							<h6 className="today-sessions-heading">TODAY'S CLASSES</h6>
							<div className="today-sessions-list">
								{sessionsToday?.map(({ session_id, name, start_ts }, i) => (
									<Link key={session_id} href={`/classes/${session_id}`}>
										<div
											className={
												isDark
													? "today-sessions-list-item dark"
													: "today-sessions-list-item"
											}
											style={{ animationDelay: `${0.15 * i}s` }}
										>
											<h6>
												<span>{format(new Date(start_ts), "p")}</span>
											</h6>
											<h5>{name}</h5>
										</div>
									</Link>
								))}
							</div>
						</div>
					</>
				)}

				<SectionDivider isDark={isDark} />
			</div>

			<div className="section-bottom">
				<div className={isDark ? "user-pro-section dark" : "user-pro-section"}>
					<h6>PuStack Pro</h6>
					<Image height={100} width={100}
						className="user-pro-mask-bg"
						src={proMaskBg}
						alt="mask"
						draggable={false}
					/>

					<div
						className="user-pro-wrapper"
						onClick={() => setIsSliderOpen(true)}
					>
						<Image height={100} width={100}
							className="user-pro-image astronaut"
							src={astronaut}
							alt="pro-img"
							draggable={false}
							style={{
								animationPlayState: isSubjectModalOpen ? "paused" : "running",
							}}
						/>
						<Image height={100} width={100}
							className="user-pro-image planet1"
							src={planet1}
							alt="pro-img"
							draggable={false}
							style={{
								animationPlayState: isSubjectModalOpen ? "paused" : "running",
							}}
						/>
						<Image height={100} width={100}
							className="user-pro-image planet2"
							src={planet2}
							alt="pro-img"
							draggable={false}
							style={{
								animationPlayState: isSubjectModalOpen ? "paused" : "running",
							}}
						/>
						<Image height={100} width={100}
							className="user-pro-image planet3"
							src={planet3}
							alt="pro-img"
							draggable={false}
							style={{
								animationPlayState: isSubjectModalOpen ? "paused" : "running",
							}}
						/>
					</div>
					<div className="view-benefits-wrapper">
						<button
							className={isDark ? "view-benefits dark" : "view-benefits"}
							onClick={() => setIsSliderOpen(true)}
							aria-label="view-benifits"
						>
							{isUserPro ? "View Benefits" : "Join Pro"}
						</button>
					</div>
				</div>

				{totalSeconds > 0 && <SectionDivider isDark={isDark} />}

				{isStandardGrade && <div
          className={isDark ? "user-analytics dark" : "user-analytics"}
          style={{height: totalSeconds === 0 && "0px"}}
        >
					{totalSeconds > 0 && <h6>USER ANALYTICS</h6>}
          <UserAnalytics aspectRatio={1.75}/>
        </div>}
			</div>
		</div>
	);
};

export default HomeSidebar;

const SectionDivider = ({ isDark }) => (
	<div
		style={{
			borderBottom: `1px solid ${
				isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
			}`,
			marginTop: "0.5rem",
			marginBottom: "0.5rem",
		}}
	/>
);
