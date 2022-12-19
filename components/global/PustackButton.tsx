import React from 'react';
import Lottie from "lottie-react-web";
import {circularProgress} from "../../public/assets";

export default function PustackButton({onClick, children, className, isLoading, ...props}) {
	return (
		<button onClick={onClick} className={className} style={{position: 'relative'}} {...props}>
			<div style={{opacity: isLoading ? 0 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				{children}
			</div>
			<Lottie
				style={{
					height: '25px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: isLoading ? 1 : 0
				}}
				options={{
					animationData: circularProgress,
					loop: true,
				}}
			/>
		</button>
	)
}
