import React, { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react-web";
import Drawer from "@material-ui/core/Drawer";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import HistoryIcon from "@material-ui/icons/History";
import CallMadeIcon from "@material-ui/icons/CallMade";
import Image from 'next/image';
import {
	elasticHeaders,
	META_QUERY_API,
	regexExpression,
	META_QUERY_RESULTS_API,
} from "../../helpers/search";
import { getYoutubeID } from "../../helpers";
import { UserContext } from "../../context";
import { DoubtSearchTile } from "../../containers";
import LectureSearchTile from "../../components/global/LectureSearchTile";
import notFound from "../../public/assets/lottie/not_found.json";
import Searching from "../../public/assets/lottie/searching.json";
import searchIcon from "../../public/assets/images/icons/search-icon.png";
import SpeechToTextSearch from "../../components/global/SpeechToText";
import circularProgress from "../../public/assets/lottie/circularProgress.json";

const PuStackMobileSearch = ({ isDark }) => {
	const [user] = useContext(UserContext).user;
	const [openMobileSearch, setOpenMobileSearch] =
		useContext(UserContext).openMobileSearch;

	const [interval, setInter] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [animateMic, setAnimateMic] = useState(false);
	const [queryResults, setQueryResults] = useState([]);
	const [querySuggestions, setQuerySuggestions] = useState([]);
	const [isSearchingResults, setIsSearchingResults] = useState(false);
	const [previousSearchQueries, setPreviousSearchQueries] = useState([]);
	const [trendingQueries] = useState([
		"Number Systems",
		"Revision",
		"Gravity",
		"Linear Equations",
		"Social Science",
	]);

	const updatePreviousQueries = (query) => {
		const _previousSearchQueries = [
			query,
			...previousSearchQueries.filter((item) => item !== query),
		];

		if (_previousSearchQueries.length > 10) {
			_previousSearchQueries.length = 10;
		}

		setPreviousSearchQueries(_previousSearchQueries);

		localStorage.setItem(
			"previousSearchQueries",
			JSON.stringify(_previousSearchQueries)
		);
	};

	const clearAllPreviousQueries = () => {
		setPreviousSearchQueries([]);

		localStorage.setItem("previousSearchQueries", JSON.stringify([]));
	};

	const clearTheQuery = (query) => {
		const _previousSearchQueries = [
			...previousSearchQueries.filter((item) => item !== query),
		];

		setPreviousSearchQueries(_previousSearchQueries);

		localStorage.setItem(
			"previousSearchQueries",
			JSON.stringify(_previousSearchQueries)
		);
	};

	useEffect(() => {
		if (localStorage.getItem("previousSearchQueries")) {
			setPreviousSearchQueries(
				JSON.parse(localStorage.getItem("previousSearchQueries"))
			);
		}
	}, []);

	useEffect(() => {
		if (!openMobileSearch) {
			setAnimateMic(false);
			if (!searchText) setQuerySuggestions([]);
		}
	}, [openMobileSearch]);

	function countUp() {
		setElapsedTime((elapsedTime) => elapsedTime + 1);
	}

	useEffect(() => {
		if (!animateMic) {
			clearInterval(interval);
			setInter(null);
			setElapsedTime(0);
		} else {
			let interval = setInterval(() => countUp(), 1000);
			setInter(interval);
		}
	}, [animateMic]);

	const fetchQuerySuggestions = () => {
		const _types = {
			documents: {
				fields: [
					"image_content",
					"generated_tags",
					"lecture_item_name",
					"lecture_header_item_name",
					// "question_text",
				],
			},
		};
		const url = META_QUERY_API;

		fetch(url, {
			method: "POST",
			headers: elasticHeaders,
			body: JSON.stringify({
				query: searchText.replace(regexExpression, "").slice(0, 110),
				// types: _types,
			}),
		})
			.then((result) =>
				result
					.json()
					.then((response) => setQuerySuggestions(response.results.documents))
			)
			.catch((err) => console.log({ err }));
	};

	const fetchQueryResults = (query) => {
		setQueryResults([]);
		setIsLoading(true);
		setIsSearchingResults(true);
		updatePreviousQueries(query);

		const url = META_QUERY_RESULTS_API;
		const _filters = {
			any: [{ grade_id: [user?.grade] }],
		};

		fetch(url, {
			method: "POST",
			headers: elasticHeaders,
			body: JSON.stringify({
				query: query.replace(regexExpression, "").slice(0, 110),
				filters: _filters,
				page: { size: 15 },
			}),
		})
			.then((result) =>
				result.json().then((response) => {
					setQueryResults(response.results);
					setIsLoading(false);
				})
			)
			.catch((err) => console.log({ err }));
	};

	useEffect(() => {
		animateMic && setIsSearchingResults(false);

		setTimeout(
			() =>
				searchText
					? !isSearchingResults && fetchQuerySuggestions()
					: setQuerySuggestions([]),
			200
		);
	}, [searchText]);

	return (
		<Drawer
			open={openMobileSearch}
			anchor="bottom"
			variant="temporary"
			onClose={() => setOpenMobileSearch(false)}
			className={isDark ? "mobile-search-drawer dark" : "mobile-search-drawer"}
		>
			<div className={`pustack-search-mobile show-search-box`} id="searchPage">
				<div className="search-box-wrapper">
					<div
						className="cancel-btn"
						onClick={() => setOpenMobileSearch(false)}
					>
						<ArrowBackIcon />
					</div>
					<input
						id="pustackMobilesearch"
						type="text"
						autoFocus
						className="search-box"
						placeholder="Search PuStack"
						draggable={false}
						name="Search"
						autoComplete="off"
						spellCheck={false}
						value={searchText}
						onChange={({ target }) => {
							setSearchText(target.value);
							setAnimateMic(false);
							setIsSearchingResults(false);
						}}
						onKeyPress={(e) =>
							e.key === "Enter" && fetchQueryResults(searchText)
						}
					/>
					<Image height={100} width={100} src={searchIcon} key="pustack-search" alt="search-icon" />
					{isLoading && (
						<div className="loading-results">
							<Lottie
								options={{ animationData: circularProgress, loop: true }}
							/>
						</div>
					)}

					{searchText === "" ? (
						<div
							className={
								animateMic ? "speech-to-text animate" : "speech-to-text"
							}
						>
							<SpeechToTextSearch
								setAnimateMic={setAnimateMic}
								setSearchText={setSearchText}
								animateMic={animateMic}
								elapsedTime={elapsedTime}
							/>
						</div>
					) : (
						<CancelIcon
							className="clear-text"
							onClick={() => {
								setIsSearchingResults(false);
								setQuerySuggestions([]);
								setSearchText("");
							}}
						/>
					)}
				</div>

				{!isSearchingResults ? (
					<div className="search-queries">
						{searchText !== "" && (
							<div
								className="search-header"
								onClick={() => fetchQueryResults(searchText)}
							>
								<h5>
									<Image height={100} width={100} src={searchIcon} key="pustack-search" alt="search" />
								</h5>
								<h6>
									Search for <span>{searchText}</span>
								</h6>
							</div>
						)}

						{querySuggestions.length === 0 ? (
							<>
								{previousSearchQueries?.length > 0 && (
									<div className="recent-searches-head">
										<h5>Recent searches</h5>
										<h6 onClick={clearAllPreviousQueries}>Clear</h6>
									</div>
								)}
								{previousSearchQueries?.slice(0, 6)?.map((query, i) => (
									<div key={i} className="recent-search-items">
										<h6
											onClick={() => {
												setSearchText(query);
												fetchQueryResults(query);
											}}
										>
											<HistoryIcon />
											<span>{query}</span>
										</h6>
										<ClearIcon onClick={() => clearTheQuery(query)} />
									</div>
								))}
								<div className="trending-searches-head">
									<h5>Trending searches</h5>
								</div>
								{trendingQueries.map((query, i) => (
									<div key={i} className="trending-search-items">
										<h6
											onClick={() => {
												setSearchText(query);
												fetchQueryResults(query);
											}}
										>
											<Image height={100} width={100} src={searchIcon} key={i} alt="search" />
											<span>{query}</span>
										</h6>
										<CallMadeIcon onClick={() => setSearchText(query)} />
									</div>
								))}
							</>
						) : (
							<>
								{querySuggestions?.map(({ suggestion }, i) => (
									<div key={i} className="trending-search-items">
										<h6
											onClick={() => {
												setSearchText(suggestion);
												fetchQueryResults(suggestion);
											}}
										>
											<Image height={100} width={100} src={searchIcon} key={i} alt="search" />
											<span>{suggestion}</span>
										</h6>
										<CallMadeIcon onClick={() => setSearchText(suggestion)} />
									</div>
								))}
							</>
						)}
					</div>
				) : (
					<div className={"search-results"}>
						<div className="search-results-inner">
							{queryResults?.length > 0
								? queryResults?.map((result) =>
										result?.youtube_url?.raw && (
											<LectureSearchTile
												key={result?.category_id?.raw}
												video_id={getYoutubeID(result?.youtube_url?.raw)}
												doubtId={result?.category_id?.raw}
												subject={result?.category_name.raw}
												chapter={result?.chapter_name.raw}
												title={result?.lecture_item_name?.raw}
												pdfUrl={result?.notes_link?.raw} rawData={undefined}
											/>
										))
								: !isLoading && (
								<div className="no-results">
									<Lottie
										options={{ animationData: notFound, loop: false }}
									/>
									<h6>We could not find a similar post</h6>
								</div>
							)}
							{isLoading && (
								<div className="loading-results-2">
									<Lottie options={{ animationData: Searching, loop: true }} />
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</Drawer>
	);
};

export default PuStackMobileSearch;
