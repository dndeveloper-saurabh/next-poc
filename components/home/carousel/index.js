import React, { useEffect, useState, useCallback, useContext } from "react";
import Modal from "react-modal";
// import { useHistory } from "react-router-dom";
import {useRouter} from 'next/router';
import ContentLoader from "react-content-loader";
import CancelIcon from "@material-ui/icons/Cancel";
import { useEmblaCarousel } from "embla-carousel/react";
import PdfPreview from "../../pdf-preview";
import YoutubeEmbed from "../../global/YoutubeEmbed";
import { DotButton, PrevButton, NextButton } from "./carouselbuttons";
import {
  LiveSessionContext,
  PustackProContext,
  ThemeContext,
  UserContext,
} from "../../../context";

export const getMainCarouselData = async ({ grade, tier_type }) => {
  const snapshot = await require('../../../firebase-config').db
    .collection("main_carousel")
    .where("grade_id", "in", ["all", grade])
    .get();

  // TODO: Temporary solution as we dont have any carousel/banner for class 9 web
  return snapshot.docs.map((doc) => doc.data()).filter(c => ["all", "web", "tablet"].includes(c.device_type));
};

const getYoutubeID = (url) => {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : false;
};

export default function HomePageCarouselSlider() {
  const [viewportRef, embla] = useEmblaCarousel();
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [bannerData, setBannerData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [isNote, setIsNote] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [, setOpenSearchBox] = useContext(UserContext).openSearchBox;
  const [, setOpenMobileSearch] = useContext(UserContext).openMobileSearch;

  const [, setCurrentSession] = useContext(LiveSessionContext).current;
  const [, setIsSliderOpen] = useContext(PustackProContext).value;
  const [user] = useContext(UserContext).user;
  const [isUserPro] = useContext(UserContext).tier;
  const [isDark] = useContext(ThemeContext).theme;

  const router = useRouter();

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback((idx) => embla && embla.scrollTo(idx), [embla]);

  const viewportCss = {
    overflow: "hidden",
  };
  const containerCss = {
    display: "flex",
  };
  const slideCss = {
    position: "relative",
    minWidth: "100%",
    minHeight: "72px",
  };

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    embla.reInit();
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, bannerData, user?.grade]);

  useEffect(() => {
    if (user?.grade) {
      getMainCarouselDataFn();
    }
  }, [user?.grade]);

  const getMainCarouselDataFn = async () => {
    const res = await getMainCarouselData({
      grade: user?.grade,
      tier_type: isUserPro ? "pro" : "basic",
    });

    setBannerData(res);
  };

  const handleBannerClick = (data) => {

    if (data?.type === "live_session") {
      setCurrentSession(data?.live_session_id);
      return router.push(`/classes/${data?.live_session_id}`);
    } else if (data?.type === "video") {
      setIsModalOpen(true);
      setIsYoutubeVideo(true);
      setYoutubeLink(data?.video_url);
    } else if (data?.type === "note") {
      setIsModalOpen(true);
      setIsNote(true);
      setPdfLink(data?.note_url);
    } else if (data?.type === "chapter") {
      let subject = data?.subject_id?.split("_")[4];
      if (
        data?.subject_id?.split("_")[3] === "mathematics" ||
        data?.subject_id?.split("_")[3] === "maths"
      ) {
        subject = "maths";
      }
      return router.push(
        `/classroom/?subject=${subject}&chapter=${data?.chapter_id}`
      );
    } else if (data?.type === "offer") {
      setIsSliderOpen(true);
    } else if (data?.type === "image_search") {
      setOpenSearchBox(true);
      setOpenMobileSearch(true);
    }
  };

  if (bannerData)
    return (
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef} style={viewportCss}>
          <div className="embla__container" style={containerCss}>
            {bannerData.map((item) => (
              <div
                className="embla__slide"
                key={item?.id}
                style={slideCss}
                onClick={() => {
                  embla.clickAllowed() && handleBannerClick(item);
                }}
              >
                <div className="embla__slide__inner">
                  {item.type === "link" ? (
                    <a
                      href={`${item?.link_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="embla__slide__img__wrapper">
                        <img
                          className="embla__slide__img"
                          src={item?.web_banner}
                          alt="slideimg"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="embla__slide__img__wrapper">
                      <img
                        className="embla__slide__img"
                        src={item?.web_banner}
                        alt="slideimg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <Modal
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => {
            setIsModalOpen(false);
            setYoutubeLink(null);
          }}
          ariaHideApp={false}
          className="carousel-video-modal"
          overlayClassName="carousel-video-modal-overlay"
          isOpen={isModalOpen}
        >
          {isYoutubeVideo && (
            <div className="youtube-modal-wrapper">
              <div className="modal-close-icon">
                <CancelIcon
                  onClick={() => {
                    setIsModalOpen(false);
                    setYoutubeLink(null);
                    setIsYoutubeVideo(false);
                  }}
                />
              </div>
              {youtubeLink && (
                <YoutubeEmbed body={{ video_id: getYoutubeID(youtubeLink) }} />
              )}
            </div>
          )}
          {isNote && (
            <PdfPreview
              pdf={pdfLink}
              onClose={() => {
                setIsNote(false);
                setIsModalOpen(false);
                setPdfLink(null);
              }}
            />
          )}
        </Modal>
      </div>
    );
  else
    return (
      <div className="embla">
        <ContentLoader
          speed={2}
          backgroundColor={isDark ? "#282828" : "#e3e3e3"}
          foregroundColor={isDark ? "#343434" : "#d4cdcd"}
          style={{ width: "100%", height: "500px" }}
        >
          <rect x="0" y="0" rx="15" ry="15" width="100%" height="100%" />
        </ContentLoader>
      </div>
    );
}
