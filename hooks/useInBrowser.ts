import {useEffect, useState} from 'react';

export default function useInBrowser() {
	const [inBrowser, setInBrowser] = useState(false);

	useEffect(() => {
		setInBrowser(true);
	}, [])

	return inBrowser;
}
