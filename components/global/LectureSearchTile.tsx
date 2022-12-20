import React, {useEffect, useState, useContext} from "react";
//TODO: Find alternative of react-modal package
import Modal from "react-modal";
import PdfPreview from "../pdf-preview";
import {useRouter} from 'next/router';
import NotesSVG from "../../public/assets/images/pdf.svg";
import YoutubeEmbed from "../../components/global/YoutubeEmbed";
// import {useHistory} from "react-router-dom";
import {ClassroomContext} from "../../context";
import Image from 'next/image';

const LectureSearchTile = ({
	                           video_id,
	                           doubtId,
	                           title,
	                           subject,
	                           rawData,
	                           chapter,
	                           pdfUrl,
                           }) => {
	const [showPdf, setShowPdf] = useState(false);
	const [, setActiveTabId] = useContext(ClassroomContext).tabId;
	const [, setActiveItem] = useContext(ClassroomContext).activeItem;
	const router = useRouter();

	/**
	 *  We will need the chapter id and subject name if the subject name is not present then should be extracted from the subject id.
	 *
	 */
	const handleClick = () => {
		const subjectName = rawData.subject_id.raw.split('_').at(-1);
		const chapterId = rawData.chapter_id.raw;

		const query = new URLSearchParams();
		query.append('chapter', chapterId);         // Chapter ID
		query.append('subject', subjectName);       // Subject Name
		query.append('no_default', 'true');

		setActiveTabId(rawData.tab_id.raw);

		const parent = rawData.lecture_header_item_name.raw ? rawData.lecture_item_id.raw : null;
		const item = rawData.id.raw

		setActiveItem({
			parent, item
		});
		router.push('/auth_classroom?' + query.toString());

	}

	useEffect(() => {
		console.log('video_id, doubtId, title, subject, chapter, pdfUrl -', video_id, doubtId, title, subject, chapter, pdfUrl)
	}, [video_id, doubtId, title, subject, chapter, pdfUrl])

	return (
		<div className="lecture-search-tile" onClick={handleClick}>
			<h6 className="lecture-details">
				<span>{subject}</span> • <span>{chapter}</span>
			</h6>
			<div className="video-wrapper">
				{/* @ts-ignore */}
				<YoutubeEmbed body={{ video_id, doubtId }} />
			</div>
			<div className="lecture-title">
				<h6>{title}</h6>
				{pdfUrl && (
					<button onClick={() => setShowPdf(true)}>
						<Image height={100} width={100} className="notes__svg" alt="PuStack Notes" src={NotesSVG} />
					</button>
				)}
			</div>

			<Modal
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => setShowPdf(false)}
				ariaHideApp={false}
				className="new-post-modal pdf-preview-modal"
				overlayClassName="new-post-modal-overlay"
				isOpen={showPdf}
			>
				<PdfPreview pdf={pdfUrl} onClose={() => setShowPdf(false)} containerClasses={undefined} isPage={undefined} />
			</Modal>
		</div>
	);
};

export default LectureSearchTile;
