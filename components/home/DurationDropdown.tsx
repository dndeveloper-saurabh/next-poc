import React, { useState, useContext } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {ThemeContext} from "../../context";

const monthToStringFormatter = (month) => {
	switch (month) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
			return "December";
		default:
			return "";
	}
};


export default function DurationDropdown({ durationObj, setDurationObj }) {
	const [durationItem, setDurationItem] = useState(durationObj.name);

	const [isDark] = useContext(ThemeContext).theme;

	const last5months = () => {
		let d = new Date();
		d.setDate(1);

		let arr = [];

		for (let i = 0; i <= 4; i++) {
			arr.push({
				name: monthToStringFormatter(d.getMonth()),
				index: i + 1,
				month: d.getMonth() + 1,
				year: d.getFullYear(),
			});
			d.setMonth(d.getMonth() - 1);
		}

		return arr;
	};

	const durationLabels = [
		{ name: "Last 30 days", index: 0, month: null, year: null },
		...last5months(),
		{ name: "Lifetime", index: 6, month: null, year: null },
	];

	const handleChange = (event) => {
		const value = event.target.value;
		setDurationObj(durationLabels.filter((item) => item.name === value)[0]);
		setDurationItem(value);
	};

	const MenuProps = {
		PaperProps: { style: { maxHeight: 188, width: 170 } },
		classes: { paper: isDark ? "duration-select dark" : "duration-select" },
	};

	const renderValue = (selected) => {
		if (selected?.length === 0) {
			return <em>{durationLabels[0].name}</em>;
		}

		return selected;
	};

	// @ts-ignore
	return (
		// @ts-ignore
		<FormControl sx={{ m: 1, width: 300, mt: 2 }}>
			<Select
				displayEmpty
				value={durationItem}
				onChange={handleChange}
				input={<OutlinedInput />}
				renderValue={renderValue}
				MenuProps={MenuProps}
				inputProps={{ "aria-label": "Without label" }}
			>
				{durationLabels.map(({ name, index }) => (
					<MenuItem key={index} value={name}>
						{name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
