import React, { useContext } from "react";
import ContentLoader from "react-content-loader";
import { ThemeContext } from "../../context";

const CardLoader = () => {
	const [isDark] = useContext(ThemeContext).theme;

	return (
		<div className="blaze__card loading session__not__selected">
			<ContentLoader
				speed={2}
				width={400}
				height={400}
				viewBox="0 0 400 400"
				backgroundColor={isDark ? "#282828" : "#e3e3e3"}
				foregroundColor={isDark ? "#343434" : "#ecebeb"}
			>
				<rect x="0" y="0" rx="8" ry="8" width="400" height="400" />
			</ContentLoader>
		</div>
	);
};

export default CardLoader;
