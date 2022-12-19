import React from "react";
import SpeechToText from "speech-to-text";
import MicIcon from "@material-ui/icons/Mic";

class SpeechToTextSearch extends React.Component {
	private listener: any;
	constructor(props) {
		super(props);
		this.state = { error: "", interimText: "", listening: false };
	}

	startListening = () => {
		try {
			this.listener = new SpeechToText(
				this.onFinalised,
				this.onEndEvent,
				this.onAnythingSaid,
				"en-IN"
			);
			this.listener.startListening();
			this.setState({ listening: true });
		} catch (err) {
			console.log({ err });
		}
	};

	stopListening = () => {
		// @ts-ignore
		const { setAnimateMic } = this.props;

		this.listener.stopListening();
		this.setState({ listening: false });
		setAnimateMic(false);
	};

	onAnythingSaid = (text) => {
		// @ts-ignore
		const { setSearchText } = this.props;

		this.setState({ interimText: text });
		setSearchText(text);
	};

	onEndEvent = () => {
		this.stopListening();
	};

	onFinalised = (text) => {
		// @ts-ignore
		const { setSearchText } = this.props;

		setSearchText(text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));

		this.setState({ interimText: "" });

		this.stopListening();
	};

	componentDidUpdate(prevProps) {
		// @ts-ignore
		const { interimText, listening } = this.state;
		// @ts-ignore
		const { animateMic, elapsedTime, setAnimateMic } = this.props;

		if (prevProps.animateMic !== animateMic) {
			!animateMic && this.stopListening();
		}

		if (elapsedTime > 10 && !interimText && listening) {
			setAnimateMic(false);
		}
	}

	render() {
		// @ts-ignore
		const { setAnimateMic, animateMic } = this.props;
		// @ts-ignore
		const { listening } = this.state;

		return (
			<>
				<MicIcon
					onClick={() => {
						if (listening) {
							this.stopListening();
						} else {
							this.startListening();
						}
						setAnimateMic(!animateMic);
					}}
				/>
				<div className="ripple1"></div>
			</>
		);
	}
}

export default SpeechToTextSearch;
