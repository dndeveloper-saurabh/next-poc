import React, { useEffect, useState, useContext } from "react";
import Lottie from "lottie-react-web";
//TODO: Find alternative of react-scrolllock
import ScrollLock from "react-scrolllock";
import ClearIcon from "@material-ui/icons/Clear";
import CancelIcon from "@material-ui/icons/Cancel";
import HistoryIcon from "@material-ui/icons/History";
import CallMadeIcon from "@material-ui/icons/CallMade";

import {
	elasticHeaders,
	META_QUERY_API,
	regexExpression,
	META_QUERY_RESULTS_API,
} from "../../helpers/search";
import { UserContext } from "../../context";
import LectureSearchTile from "../../components/global/LectureSearchTile";
import notFound from "../../public/assets/lottie/not_found.json";
import Searching from "../../public/assets/lottie/searching.json";
import searchIcon from "../../public/assets/images/icons/search-icon.png";
import SpeechToTextSearch from "../../components/global/SpeechToText";
import circularProgress from "../../public/assets/lottie/circularProgress.json";


const getYoutubeID = (url) => {
	const regExp =
		/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	const match = url.match(regExp);
	return match && match[1].length === 11 ? match[1] : false;
};


const PuStackSearch = ({ openSearchBox, setOpenSearchBox }) => {
	const [user] = useContext(UserContext).user;

	const [interval, setInter] = useState(null);
	const [animate, setAnimate] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [animateMic, setAnimateMic] = useState(false);
	const [hideResults, setHideResults] = useState(false);
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
		if (!openSearchBox) {
			setAnimateMic(false);
			if (!searchText) setQuerySuggestions([]);
		}
	}, [openSearchBox]);

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
		setHideResults(false);
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
			.then((result) => {
				return result.json().then((response) => {
					let _results = response?.results;
					let filteredResults = _results?.filter(
						(item, i, a) =>
							a?.findIndex(
								(p) => p?.youtube_url?.raw === item?.youtube_url?.raw
							) === i
					);

					console.log('filteredResults - ', filteredResults);
					setQueryResults(filteredResults || []);
					setIsLoading(false);
				})
			})
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

	useEffect(() => {
		if (openSearchBox) setAnimate(openSearchBox);
	}, [openSearchBox]);

	return (
		<div
			className={`pustack-search ${
				animate ? (openSearchBox ? "show-search-box" : "hide-search-box") : ""
			}`}
			id="searchPage"
		>
			<div
				className="search-box-wrapper"
				onClick={() => setOpenSearchBox(true)}
			>
				<input
					id="pustacksearch"
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

						if (isSearchingResults) {
							setHideResults(true);
							setTimeout(() => setIsSearchingResults(false), 125);
						} else {
							setHideResults(false);
						}
					}}
					onKeyPress={(e) => e.key === "Enter" && fetchQueryResults(searchText)}
				/>
				<img src={searchIcon} key="pustack-search" alt="search-icon" />
				{isLoading && (
					<div className="loading-results">
						<Lottie options={{ animationData: circularProgress, loop: true }} />
					</div>
				)}

				{searchText === "" ? (
					<div
						className={animateMic ? "speech-to-text animate" : "speech-to-text"}
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
							setHideResults(true);
							setTimeout(() => {
								setIsSearchingResults(false);
								setQuerySuggestions([]);
								setSearchText("");
								setHideResults(false);
							}, 125);
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
								<img src={searchIcon} key="pustack-search" alt="search-icon" />
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
										<img src={searchIcon} key={i} alt="search-icon" />
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
										<img src={searchIcon} key={i} alt="search-icon" />
										<span>{suggestion}</span>
									</h6>
									<CallMadeIcon onClick={() => setSearchText(suggestion)} />
								</div>
							))}
						</>
					)}
				</div>
			) : (
				<div className={hideResults ? "search-results hide" : "search-results"}>
					<ScrollLock isActive={isSearchingResults && openSearchBox}>
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
											rawData={result}
											title={result?.lecture_item_name?.raw}
											pdfUrl={result?.notes_link?.raw}
										/>
									)
								)
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
					</ScrollLock>
				</div>
			)}
		</div>
	);
};

export default PuStackSearch;
