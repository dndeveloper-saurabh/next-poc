import React, {useEffect, useMemo, useState} from 'react';

import VideoJs from "video.js";
import "videojs-contrib-hls";
import "video.js/dist/video-js.css";
import useDidMountEffect from "../../hooks/didMount";

export default function VideoPlayer({shouldPause, src, thumbnail}) {
	const videoId = useMemo(() => 'video-id_' + new Date().getTime(), []);
	const [player, setPlayer] = useState(null);

	useEffect(() => {
		const _player = VideoJs(videoId, {
			height: '100%',
			width: '100%',
			controls: true,
			preload: "auto",
			fluid: true,
		});

		_player.src({src });
		setPlayer(_player);

		return () => {
			_player.dispose();
		}
	}, []);

	useEffect(() => {
		console.log('player.state - ', player?.state);
	}, [player?.state])

	useDidMountEffect((checking) => {
		if(!player || typeof player.pause !== 'function') return false;
		if(checking) return true;
		// if(!player.played()) return true;
		if(shouldPause) player.pause()
		// else player.play();
		return true;
	}, [player, shouldPause])

	return (
		<video id={videoId} className="video-js" poster={thumbnail} />
	)
}
