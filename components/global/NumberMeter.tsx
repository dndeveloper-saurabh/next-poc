import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function formatForDisplay(number = 0, useDecimal) {
	return useDecimal
		? parseFloat(Math.max(number, 0)).toFixed(1).split("").reverse()
		: parseFloat(Math.max(number, 0)).toFixed(0).split("").reverse();
}

function DecimalColumn() {
	return (
		<div style={{marginTop: '7px'}}>
			<span>.</span>
		</div>
	);
}

function NumberColumn({ digit }) {
	const [position, setPosition] = useState(0);
	const columnContainer = useRef();

	const setColumnToNumber = (number) => {
		setPosition(columnContainer.current.clientHeight * Number(number));
	};

	useEffect(() => setColumnToNumber(digit), [digit]);

	return (
		<div className="ticker-column-container" ref={columnContainer}>
			<motion.div animate={{ y: position }} className="ticker-column">
				{[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => (
					<div key={num} className="ticker-digit">
						<span>{num}</span>
					</div>
				))}
			</motion.div>
			<span className="number-placeholder">0</span>
		</div>
	);
}

export default function NumberMeter({ value, useDecimal }) {
	const numArray = formatForDisplay(value, useDecimal);

	return (
		<motion.div layout className="ticker-view">
			{numArray.map((number, index) =>
				number === "." ? (
					<DecimalColumn key={index} />
				) : (
					<NumberColumn key={index} digit={number} />
				)
			)}
		</motion.div>
	);
}
