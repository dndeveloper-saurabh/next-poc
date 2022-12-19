import React from "react";
import Plyr from "plyr";
// TODO: Find alternative of react-visibility-sensor
import VisibilitySensor from "react-visibility-sensor";
import "react-visibility-sensor";

class YoutubeEmbed extends React.Component {
	private player: Plyr;
	private _ismounted: boolean;
	componentDidMount() {
		this.player = new Plyr(".youtube-player", {});
		this.player.source = {
			type: "video",
			sources: [
				{
					// @ts-ignore
					src: this.props.body.video_id,
					provider: "youtube",
				},
			],
			// @ts-ignore
			muted: false,
		};

		this.player.on("play", () => {
			// @ts-ignore
			this.props.muteFloating && this.props.muteFloating();
			try {
				const _videos = document.querySelectorAll("video");
				_videos.forEach((vid) => vid.pause());

				const _youtube = Array.from(
					document.querySelectorAll(`.plyr--youtube`)
				).map((p) => p);

				_youtube.forEach((e) => {
					const _btn = e.querySelector('.plyr__controls > [data-plyr="play"]');
					if (
						_btn?.classList?.contains("plyr__control--pressed") &&
						!(
							e.querySelector(".plyr__poster").getAttribute("style") ===
							// @ts-ignore
							`background-image: url("https://i.ytimg.com/vi/${this.props.body.video_id}/maxresdefault.jpg");` ||
							e.querySelector(".plyr__poster").getAttribute("style") ===
							// @ts-ignore
							`background-image: url("https://i.ytimg.com/vi/${this.props.body.video_id}/sddefault.jpg");`
						)
					) {
						// @ts-ignore
						_btn.click();
					}
				});
			} catch (error) {
				console.error(`facing error ${error} while youtube embed`);
			}
		});

		this.player.on("enterfullscreen", () => {
			// @ts-ignore
			this.props.muteFloating && this.props.muteFloating();
			this.player.play();
		});

		// @ts-ignore
		this._ismounted = true;
	}

	// componentDidUpdate() {
	//   const iframes = document.querySelectorAll('*[id^="youtube-"]');

	//   console.log({ iframes });

	//   for (let i = 0; i < iframes.length; i++) {
	//     let iframe = iframes[i].contentWindow;
	//     // iframes[i].contentWindow.document.body.querySelector("ytp-chrome-top");

	//     iframe.addEventListener("load", () => {
	//       var doc = iframe.contentDocument || iframe.contentWindow.document;
	//       var target = doc.getElementById("ytp-chrome-top");
	//       console.log({ target });
	//     })
	//   }
	// }

	componentWillUnmount() {
		// this.player.destroy();
		this._ismounted = false;
	}

	render() {
		return (
			<VisibilitySensor
				onChange={(visible) => {
					if (!visible) {
						setTimeout(() => {
							if (!this.player.fullscreen.active) {
								this.player.pause();
							}
						});
					}
				}}
			>
				{
					// @ts-ignore
					this.props.body.video_id !== null ? (
					<div
						className="youtube-player-wrapper"
						style={{ marginTop: "8px" }}
						// @ts-ignore
						key={this.props.body.doubtId}
					>
						<video className="youtube-player plyr__video-embed" />
					</div>
				) : (
					""
				)}
			</VisibilitySensor>
		);
	}
}

export default YoutubeEmbed;
