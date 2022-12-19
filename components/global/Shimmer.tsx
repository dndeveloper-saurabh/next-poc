import React, {useContext} from 'react';
import {ThemeContext} from "../../context";

interface Props {
	style?: object,
	className?: string
}

export default function PustackShimmer({className, style}: Props) {
	const [isDark] = useContext(ThemeContext).theme;

	return (
		<div style={style} className={"pustack-shimmer " + (isDark ? ' dark-shim ' : '') + (className ?? '')} />
	)
}
