import React from 'react';
import PustackShimmer from "../../components/global/Shimmer";

export default function VideoShimmer({}) {

	return (
		<div className="tutor-tips grid-card grid-card-6">
			<div className="tutor-tips-head">
				<PustackShimmer style={{width: '100px', height: '30px', borderRadius: '4px'}} />
				<div className="toggle-btn">
					<PustackShimmer style={{width: '100%', height: '30px', borderRadius: '4px'}} />
				</div>
			</div>
			<div className="recommended-video" style={{height: 'unset'}}>
				<div className="video-js" style={{background: 'var(--color-base)'}} />
				{/*<VideoPlayer*/}
				{/*  src={videoItem.link}*/}
				{/*  thumbnail={videoItem.thumbnail}*/}
				{/*  shouldPause={activeTab !== videoItem.id - 1}*/}
				{/*/>*/}
				<div className="video-detail" style={{width: '100%'}}>
					<PustackShimmer style={{width: '70%', height: '30px', borderRadius: '4px'}} />
					<PustackShimmer style={{width: '100%', marginTop: '12px', height: '20px', borderRadius: '4px'}} />
					<PustackShimmer style={{width: '70%', marginTop: '5px', height: '20px', borderRadius: '4px'}} />
					<PustackShimmer style={{width: '80%', marginTop: '5px', height: '20px', borderRadius: '4px'}} />
				</div>
			</div>
		</div>
	)
}
