import React, {Component, useEffect, useRef} from "react";
// import Plyr from "plyr";
// import Lottie from "lottie-react-web";
import { logoDark, nounBook, circularProgress } from "../../../public/assets";
import Image from "next/image";
import dynamic from "next/dynamic";
const YouTube = dynamic(() => import('react-youtube'));

export default function ClassroomPlayer({video_id}) {
  console.log('video_id - ', video_id);

  return (
    <div className={"classroom-player-wrapper"}>
      <YouTube
        videoId={video_id || ''}
        id={'video-preview'}
        containerClassName={'video__wrapper'}
        onReady={() => {}}
      />
    </div>
  )
}

class ClassroomClassroomPlayerPlayer extends Component {
  intervalID = 0;

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      ended: false,
      height: 0,
      interval: null,
      progress: 0,
      videoDuration: 0,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "pip",
        "airplay",
        "settings",
        "fullscreen",
      ],
    };
    this.videoRef = React.createRef();
    this.player = null;
  }

  componentDidMount() {
    const {
      video_id,
      isSmallScreen,
      setAutoPlay,
      setPlaying,
      nextItem,
      isUserProTier,
      playing,
      setVideoSeeking,
      setVideoDuration
    } = this.props;

    this.playerNext = nextItem;

    if (video_id !== null) {
      this.player = new Plyr(".youtube-player", {
        controls: this.state.controls,
        hideControls: isSmallScreen,
        muted: false,
      });

      this.player.on("play", () => {
        setVideoDuration(this.player.duration);
        setVideoSeeking(false);
      });
      this.player.on("ready", () => (this.player.currentTime = 0));

      this.player.on("playing", () => setPlaying(true));
      this.player.on("seeking", () => setPlaying(false));
      this.player.on("seeked", () => setPlaying(true));
      // this.player.muted = false;

      if (isSmallScreen) {
        this.player.on("canplay", () => setVideoSeeking(false));
        this.player.on("seeked", () => setVideoSeeking(false));
      }

      this.player.on("pause", () => setPlaying(false));
      this.player.on("ended", () => this.player.pause());

      const startTimer = () => {
        this.setState({ ended: true });
        setPlaying(false);

        const interval = setInterval(() => {
          this.player.pause();
          let { progress } = this.state;

          progress += 2.5;

          if (this.state.interval === null || playing) {
            progress = 0;
            clearInterval(interval);
          }

          this.setState({ progress });

          if (this.state.progress > 99) {
            setAutoPlay(true);
            setPlaying(false);

            this.setState({
              interval: null,
              ended: false,
              progress: 0,
            });

            if (this.state.interval !== null) clearInterval(interval);
          }
        }, 125);

        if (this.state.interval === null) this.setState({ interval: interval });
      };

      this.player.on("ended", () => {
        this.player.pause();
        if (this.player.fullscreen.active) this.player.fullscreen.exit();

        const isNextValid =
          (isUserProTier || this.playerNext?.tier === "basic") &&
          this.playerNext?.item;

        if (isNextValid) {
          startTimer();
        } else {
          if (playing) this.player.pause();
        }
      });

      this.player.source = {
        type: "video",
        sources: [{ src: video_id, provider: "youtube" }],
      };
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentDidUpdate(prevProps) {
    const {
      video_id,
      nextItem,
      playing,
      setPlaying,
      setVideoDuration,
      setVideoSeeking,
      isUserProTier,
      isSmallScreen,
      isTabletScreen,
      setAutoPlay,
    } = this.props;


    this.playerNext = nextItem;

    if (prevProps.nextItem !== nextItem) {
      this.playerNext = nextItem;
    }

    if (video_id !== null) {
      if (this.player !== null && typeof this.player === "object") {

        if (prevProps.video_id !== video_id) {
          console.log('classroom player did update - ', video_id, prevProps.video_id);
          this.player.source = {
            type: "video",
            sources: [{ src: video_id, provider: "youtube" }],
          };

          if (isTabletScreen) {
            setTimeout(() => setVideoSeeking(false), 3000);
          }

          this.setState({ interval: null, ended: false });
        }
      } else {
        this.player = new Plyr(".youtube-player", {
          controls: this.state.controls,
          hideControls: isSmallScreen,
          muted: false,
        });

        const startTimer = () => {
          this.setState({ ended: true });
          setPlaying(false);

          const interval = setInterval(() => {
            this.player.pause();
            let { progress } = this.state;
            progress += 2.5;

            if (this.state.interval === null || playing) {
              progress = 0;
              clearInterval(interval);
            }

            this.setState({ progress });

            if (this.state.progress > 99) {
              setAutoPlay(true);
              setPlaying(false);

              this.setState({ interval: null, ended: false, progress: 0 });

              if (this.state.interval !== null) clearInterval(interval);
            }
          }, 125);

          if (this.state.interval === null)
            this.setState({ interval: interval });
        };

        this.player.on("ended", () => {
          this.player.pause();
          if (this.player.fullscreen.active) this.player.fullscreen.exit();

          const isNextValid =
            (isUserProTier || this.playerNext?.tier === "basic") &&
            this.playerNext?.item;

          if (isNextValid) {
            startTimer();
          } else {
            if (playing) this.player.pause();
          }
        });

        this.player.source = {
          type: "video",
          sources: [{ src: video_id, provider: "youtube" }],
        };
      }
    }
  }

  render() {
    const { ended, progress, interval } = this.state;
    const {
      nextItem,
      setActiveItem,
      setLastEngagement,
      isUserProTier,
      videoSeeking,
      playing,
      setVideoSeeking,
      isSmallScreen,
      setLectureTier,
      showOnlyLogo,
    } = this.props;

    return (
      <div className={"classroom-player-wrapper"}>
        <video
          className="youtube-player plyr__video-embed"
          ref={this.videoRef}
          autoPlay
        />
        {!showOnlyLogo ? (
          videoSeeking &&
          !playing && (
            <div
              className="classroom__video__seeking"
              onClick={() => isSmallScreen && setVideoSeeking(false)}
            >
              <div className="lottie__progress">
                {/*<Lottie*/}
                {/*  options={{ animationData: circularProgress, loop: true }}*/}
                {/*/>*/}
              </div>
              <div className="classroom__video__branding">
                <Image height={100} width={100} src={nounBook} alt="pustack logo" draggable={false} />
              </div>
            </div>
          )
        ) : (
          <div
            className="classroom__video__seeking"
            onClick={() => isSmallScreen && setVideoSeeking(false)}
          >
            <div className="classroom__video__branding">
              <Image height={100} width={100} src={nounBook} alt="pustack logo" draggable={false} />
            </div>
            <h6 className="classroom__video__text">This is a Pro Content</h6>
          </div>
        )}
        {typeof nextItem?.item !== "undefined" && (
          <div
            className="classroom__end__placeholder"
            id="videoEndPlaceholder"
            style={{
              visibility:
                (isUserProTier || nextItem?.tier === "basic") && ended
                  ? "visible"
                  : "hidden",
            }}
          >
            <Image height={100} width={100}
              className="placeholder__logo"
              src={logoDark}
              alt="PuStack"
              draggable={false}
            />
            <div className="up__next">UP NEXT</div>
            <div className="next__video__name">{nextItem?.childName}</div>
            <div
              className="progress__play"
              onClick={() => {
                setActiveItem({
                  parent: nextItem?.parent,
                  item: nextItem?.item,
                });

                if (nextItem?.tier === "pro") {
                  setLectureTier(true);
                } else {
                  setLectureTier(false);
                }
                setLastEngagement({
                  lecture_type: nextItem?.lectureType,
                  lecture_header_item_index: nextItem?.headerItemIndex,
                  lecture_item_index: nextItem?.itemIndex,
                  tab_index: nextItem?.tabIndex,
                });
                setVideoSeeking(true);
                if (interval !== null) clearInterval(interval);
                this.setState({ ended: false, interval: null, progress: 0 });
              }}
            >
              <ProgressRing radius={40} stroke={4} progress={progress} />
              <div className="progress__content">
                <i className="fas fa-play" />
              </div>
            </div>

            <button
              onClick={() => {
                if (interval !== null) clearInterval(interval);
                this.setState({ ended: false, interval: null, progress: 0 });
              }}
              className="cancel__btn"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
}

class ProgressRing extends Component {
  constructor(props) {
    super(props);

    const { radius, stroke } = this.props;

    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  render() {
    const { radius, stroke, progress } = this.props;
    const strokeDashoffset =
      this.circumference - (progress / 100) * this.circumference;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={this.circumference + " " + this.circumference}
          style={{ strokeDashoffset }}
          stroke-width={stroke}
          r={this.normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    );
  }
}
