import React, {useContext} from "react";
import ContentLoader from "react-content-loader";
import { ThemeContext } from "../../context";

const ChatLoader = () => {
	const [isDark] = useContext(ThemeContext).theme;
	return (
		<div className="chatLoader">
			<ContentLoader
				speed={2}
				width={450}
				height={100}
				viewBox="0 0 450 100"
				backgroundColor={isDark ? "#101010" : "#f3f3f3"}
				foregroundColor={isDark ? "#343434" : "#c5c5ca"}
				className="agent"
			>
				<rect x="0" y="18" rx="50" ry="50" width="76" height="76" />
				<rect x="100" y="18" rx="28" ry="28" width="315" height="80" />
			</ContentLoader>
			<ContentLoader
				speed={2}
				backgroundColor={isDark ? "#101010" : "#f3f3f3"}
				foregroundColor={isDark ? "#343434" : "#c5c5ca"}
				width={450}
				height={100}
				viewBox="0 0 450 100"
				className="student"
			>
				<rect x="105" y="18" rx="28" ry="28" width="315" height="80" />
			</ContentLoader>
		</div>
	);
};

export default ChatLoader;
