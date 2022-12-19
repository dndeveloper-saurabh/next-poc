import React, {useEffect} from 'react';
import { useRouter } from 'next/router'

const ClassRoom = () => {
	const router = useRouter()

	useEffect(() => {
		console.log('query - ', router.query);
	}, [router])

	return <p>Post</p>
}

export default ClassRoom;
