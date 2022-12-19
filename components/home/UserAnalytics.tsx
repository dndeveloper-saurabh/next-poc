import React, { useState, useContext, useEffect } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UserContext, ThemeContext } from "../../context";

const getDailyEngagement = async (
	userId,
	curYearMonth,
	prevYearMonth,
	isDateLessThan7
) => {
	const currMonthData = await db
		.collection("user_engagement")
		.doc("daily_engagement")
		.collection(userId)
		.doc(curYearMonth)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return doc.data();
			} else return null;
		});

	let prevMonthData = null;

	if (isDateLessThan7) {
		prevMonthData = await db
			.collection("user_engagement")
			.doc("daily_engagement")
			.collection(userId)
			.doc(prevYearMonth)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return doc.data();
				} else return null;
			});
	}

	return [currMonthData, prevMonthData];
};

const UserAnalytics = ({ aspectRatio }) => {
	const [analyticsData, setAnalyticsData] = useState([]);
	const [dailyEngagementData, setDailyEngagementData] = useState(null);

	const [user] = useContext(UserContext).user;
	const [isDark] = useContext(ThemeContext).theme;
	const [totalSeconds, setTotalSeconds] = useContext(UserContext).totalSeconds;

	let months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const formatDate = (date) => {
		let dd = date.getDate();
		let mm = date.getMonth() + 1;
		let yyyy = date.getFullYear();

		date = `${yyyy}_${mm}_${dd}`;
		return date;
	};

	const formatDate2 = (date) => {
		let splittedDate = date.split("_");

		return `${months[splittedDate[1] - 1]} ${splittedDate[2]}`;
	};

	const last7Days = () => {
		let result = [];
		for (let i = 0; i < 7; i++) {
			let d = new Date();
			d.setDate(d.getDate() - i);
			result.push(formatDate(d));
		}

		return result;
	};

	useEffect(() => {
		getDailyEngagementFn();
	}, []);

	useEffect(() => {
		let _analyticsData = [];
		const dates = last7Days();
		let _totalSeconds = 0;

		if (dailyEngagementData) {
			dates.map((date) => {
				let isFound = false;
				let reqData = null;

				dailyEngagementData.map((d) => {
					if (d.date === date && !isFound) {
						reqData = d;
						isFound = true;
					}
				});

				if (reqData) {
					_analyticsData.push({
						date: formatDate2(date),
						minutesWatched: reqData.totalSecondsWatched / 60,
						lecturesWatched: reqData.totalLecturesWatched,
					});

					_totalSeconds += reqData.totalSecondsWatched;
				} else {
					_analyticsData.push({
						date: formatDate2(date),
						minutesWatched: 0,
						lecturesWatched: 0,
					});
					_totalSeconds += 0;
				}
			});

			setTotalSeconds(_totalSeconds);
		} else {
			dates.map((date) => {
				_analyticsData.push({
					date: formatDate2(date),
					minutesWatched: 0,
					lecturesWatched: 0,
				});
			});
		}

		setAnalyticsData(_analyticsData.reverse());
	}, [dailyEngagementData]);

	const getDailyEngagementFn = async () => {
		const isDateLessThan7 = new Date().getDate() < 7;

		const curYearMonth = `${new Date().getFullYear()}_${
			new Date().getMonth() + 1
		}`;

		const prevYearMonth = `${new Date().getFullYear()}_${new Date().getMonth()}`;

		const res = await getDailyEngagement(
			user?.uid,
			curYearMonth,
			prevYearMonth,
			isDateLessThan7
		);

		let _data = [];

		res.map((item) => {
			if (item) {
				for (let key in item.daily_engagement) {
					_data.push({
						date: key,
						totalLecturesWatched:
						item?.daily_engagement[key]?.total_watched_lecture_count,
						totalSecondsWatched: item?.daily_engagement[key]?.total_spent_time,
					});
				}
			}
		});

		setDailyEngagementData(_data);
	};

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<p
						className="label"
						style={{
							fontSize: "10px",
							fontWeight: "600",
							color: isDark ? "white" : "black",
						}}
					>
						{label}
					</p>
					<p
						className="intro"
						style={{
							fontSize: "10px",
							fontWeight: "500",
							color: isDark ? "white" : "black",
						}}
					>
						{Math.ceil(payload[0].value)} mins
					</p>
				</div>
			);
		}

		return null;
	};

	const allEqual = (data) =>
		data.every((item) => item.minutesWatched === data[0].minutesWatched);

	if (totalSeconds > 0)
		return (
			<div className="fadeIn">
				<ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
					<LineChart
						data={analyticsData}
						margin={{ top: 40, left: 15, right: 15, bottom: -4 }}
					>
						<defs>
							<linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" stopColor="green" />
								<stop offset="100%" stopColor="red" />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="date"
							axisLine={{
								color: "rgba(255,255,255,0)",
								strokeWidth: 0,
							}}
							style={{ fontSize: "0.55rem", fontWeight: "400" }}
							tickLine={{ stroke: "rgba(255,255,255,0)" }}
							tick={{ fill: isDark ? "white" : "black" }}
							tickCount={7}
							interval={0}
						/>
						<Tooltip
							contentStyle={{
								background: "rgba(255,255,255,0)",
								border: "none",
								textAlign: "left",
								lineHeight: 0.5,
							}}
							content={<CustomTooltip />}
							cursor={true}
							position={{ x: "auto", y: 0 }}
						/>
						<Line
							type="monotone"
							dataKey="minutesWatched"
							stroke={allEqual(analyticsData) ? "green" : "url(#colorUv)"}
							strokeWidth={2}
							strokeLinecap="round"
							connectNulls
							dot={({ cx, cy }) => (
								<svg
									x={cx - 2.25}
									y={cy - 2.25}
									width={4.5}
									height={4.5}
									fill={isDark ? "white" : "black"}
									viewBox="0 0 2048 2048"
									key={cx}
								>
									<circle
										cx="1024"
										cy="1024"
										r="1024"
										stroke={isDark ? "white" : "black"}
										strokeWidth={3}
										fill={isDark ? "white" : "black"}
									/>
								</svg>
							)}
							activeDot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		);
	else return null;
};

export default UserAnalytics;
