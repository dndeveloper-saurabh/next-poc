import React, {lazy, Suspense, useEffect, useState} from "react";
import Image from 'next/image';
import Typewriter from "typewriter-effect";
import {appLive, appDoubts} from "../public/assets";
import logowhite from "../public/assets/images/logo-white.png";
import OnBoardingFlow from '../containers/boardingFlow';

import iPhone2 from "../public/assets/images/landing/iPhone2.png"



// import {useHistory, useLocation} from "react-router-dom";
// import OnBoardingFlow from "../boardingFlow";
// import PustackFooter from "../../../components/global/pustack-footer";

export default function DesktopLanding({isSliderOpen, setIsSliderOpen}) {
  // const history = useHistory();
  // const location = useLocation();
  const [canPlay, setCanPlay] = useState(false);


  // useEffect(() => {
  //   setTimeout(() => {
  //     if (location.pathname === '/auth') {
  //       setIsSliderOpen(true);
  //     } else {
  //       setIsSliderOpen(false);
  //     }
  //   }, 200)
  // }, [location]);

  // const GooglePlay = () => (
  //   <a target="_blank" rel="noopener noreferrer" href={appGooglePlayLink}>
  //     <img alt="Get it on Google Play" src={googlePlayBadge}/>
  //   </a>
  // );

  return (
    <div>
      <section className="landing__section">
        <nav className="nav__wrapper">
          <span className="nav__logo">
            <Image height={100} width={100} className="nav__logo__img" src={logowhite} alt="Pustack Logo" />
            {/*<img*/}
            {/*  src={logowhite}*/}
            {/*  alt="Pustack Logo"*/}
            {/*  draggable={false}*/}
            {/*  className="nav__logo__img"*/}
            {/*  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}*/}
            {/*/>*/}
          </span>

          <span className="nav__links">
            {/*<a href="https://tutor.pustack.com">Tutor Login</a>*/}
            <span
              className="nav__link signup__btn"
              onClick={() => {
                setIsSliderOpen(true);
                navigator && navigator.vibrate && navigator.vibrate(5);
                // history.push('/auth?step=login');
              }}
            >
              Sign In
            </span>
          </span>
        </nav>

        <div className="steps__circle">
          <div id="circle1" />
          <div id="circle2" />
          <div id="circle3" />
          <div id="circle4" />
          {/*<div id="circle5" />*/}
          <div id="circle6" />
        </div>

        <div className="landing__wrapper">
          <div className="mobile__hero">
            <div className="phones__wrapper">
              <div id="content">
                <div className="bleeding-bg" />
                <div className="backdrop" />

                <div className="app__wrapper">
                  <Image height={100} width={100} src={iPhone2} className="iphone__chassis" width={'unset'}  alt="Iphone"/>
                  {/*<img className="iphone__chassis" src={iPhone2} alt="iphone"/>*/}
                  <div className="app__splash">
                    {/*<img style={{position: 'absolute', display: 'bls*/}
                    <video
                      onCanPlay={() => {
                        setCanPlay(true);
                      }}
                      style={{position: 'relative', zIndex: 2}}
                      muted
                      playsInline
                      loop
                      autoPlay
                      // className="mac__desktop"
                      className="mac__"
                      // src="https://d1kjns6e6wnqfd.cloudfront.net/danceVideo.mp4"
                      src="https://d1kjns6e6wnqfd.cloudfront.net/snippet2.mp4"
                    />
                    <div className="desktop__overlay"/>
                  </div>
                  <div id="homescreen">
                    <div className="hide__bar" />
                    <Image height={100} width={100} src="https://d1kjns6e6wnqfd.cloudfront.net/liveclass.webp" alt="Pustack Home" loading="lazy" width={100} height={100} />
                    {/*<img*/}
                    {/*  src={*/}
                    {/*    "https://d1kjns6e6wnqfd.cloudfront.net/liveclass.webp"*/}
                    {/*  }*/}
                    {/*  alt="PuStack Home"*/}
                    {/*  draggable={false}*/}
                    {/*  loading="lazy"*/}
                    {/*/>*/}
                  </div>
                  <div id="livescreen">
                    <Image height={100} width={100} src={appLive} alt="Pustack Live" loading="lazy" width={'auto'} height={"auto"} />
                    {/*<img*/}
                    {/*  src={appLive}*/}
                    {/*  alt="PuStack Live"*/}
                    {/*  draggable={false}*/}
                    {/*  loading="lazy"*/}
                    {/*/>*/}
                  </div>
                  <div id="livescreen2">
                    <div className="hide__bar" />
                    <div className="live__tag">LIVE</div>
                    <Image height={100} width={100} src="https://d1kjns6e6wnqfd.cloudfront.net/liveclassvideo.webp" width={100} height={100} alt="Pustack Live Video" loading="lazy" />
                    {/*<img*/}
                    {/*  src="https://d1kjns6e6wnqfd.cloudfront.net/liveclassvideo.webp"*/}
                    {/*  alt="PuStack Live Video"*/}
                    {/*  draggable={false}*/}
                    {/*  loading="lazy"*/}
                    {/*/>*/}
                  </div>
                  {/*<div id="doubtscreen">*/}
                  {/*  <img*/}
                  {/*    src={appDoubts}*/}
                  {/*    alt="PuStack Doubts"*/}
                  {/*    draggable={false}*/}
                  {/*    loading="lazy"*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div id="searchscreen">
                    <Image height={100} width={100} src="https://d1kjns6e6wnqfd.cloudfront.net/snap.webp" width={100} height={100} alt="Pustack Search" loading="lazy" />
                    {/*<img*/}
                    {/*  src="https://d1kjns6e6wnqfd.cloudfront.net/snap.webp"*/}
                    {/*  alt="PuStack Search"*/}
                    {/*  draggable={false}*/}
                    {/*  loading="lazy"*/}
                    {/*/>*/}
                  </div>
                </div>
              </div>
              <div id="descriptions">
                <div id="homedesc">
                  <h1>Comprehensive Learning</h1>
                  <p id="home1">Every topic. Every concept. Every question.</p>
                  <p id="home2">
                    India's most driven teachers have covered it all!
                  </p>
                </div>
                <div id="livedesc">
                  <h1>Daily Live Classes</h1>
                  <p id="live1">Being consistent is the key to success.</p>
                  <p id="live2">So we come live EVERYDAY!</p>
                </div>
                <div id="livedesc2">
                  <h1>Interactive Classes</h1>
                  <p id="live21">Chat with our teachers, take a quiz, learn!</p>
                  <p id="live22">Your learning style is ours too.</p>
                </div>
                {/*<div id="doubtdesc">*/}
                {/*  <h1>Doubt Forum</h1>*/}
                {/*  <p id="doubt1">Got something on your mind? Ask us!</p>*/}
                {/*  <p id="doubt2">Our network of teachers is eager to help.</p>*/}
                {/*</div>*/}
                <div id="searchdesc">
                  <h1>Snap &amp; Learn</h1>
                  <p id="search1">This is something out of a sci-fi movie!</p>
                  <p id="search2">
                    Snap and that's it, we will solve your doubts.
                  </p>
                </div>
                <div style={{display: 'flex'}}>
                  {/*<section className="play-button">*/}
                  {/*  <GooglePlay/>*/}
                  {/*</section>*/}
                  <section className="play-button" style={{marginTop: '169px', opacity: 1, marginLeft: '10px'}}>
                    <a target="_blank" rel="noopener noreferrer" href={'#'}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={119.664}
                        height={40}
                        style={{
                          width: '120px',
                          height: '45px',
                          zoom: '1',
                          marginLeft: '9px'
                        }}
                      >
                        <title>{"Download_on_the_App_Store_Badge_US-UK_RGB_blk_4SVG_092917"}</title>
                        <path
                          d="M110.135 0H9.535c-.367 0-.73 0-1.095.002-.306.002-.61.008-.919.013A13.215 13.215 0 0 0 5.517.19a6.665 6.665 0 0 0-1.9.627 6.438 6.438 0 0 0-1.62 1.18A6.258 6.258 0 0 0 .82 3.617a6.601 6.601 0 0 0-.625 1.903 12.993 12.993 0 0 0-.179 2.002c-.01.307-.01.615-.015.921V31.56c.005.31.006.61.015.921a12.992 12.992 0 0 0 .18 2.002 6.588 6.588 0 0 0 .624 1.905A6.208 6.208 0 0 0 1.998 38a6.274 6.274 0 0 0 1.618 1.179 6.7 6.7 0 0 0 1.901.63 13.455 13.455 0 0 0 2.004.177c.31.007.613.011.919.011.366.002.728.002 1.095.002h100.6c.36 0 .724 0 1.084-.002.304 0 .617-.004.922-.01a13.279 13.279 0 0 0 2-.178 6.804 6.804 0 0 0 1.908-.63A6.277 6.277 0 0 0 117.666 38a6.395 6.395 0 0 0 1.182-1.614 6.604 6.604 0 0 0 .619-1.905 13.506 13.506 0 0 0 .185-2.002c.004-.31.004-.61.004-.921.008-.364.008-.725.008-1.094V9.536c0-.366 0-.73-.008-1.092 0-.306 0-.614-.004-.92a13.507 13.507 0 0 0-.185-2.003 6.618 6.618 0 0 0-.62-1.903 6.466 6.466 0 0 0-2.798-2.8 6.768 6.768 0 0 0-1.908-.627 13.044 13.044 0 0 0-2-.176c-.305-.005-.618-.011-.922-.013-.36-.002-.725-.002-1.084-.002Z"
                          style={{
                            fill: "#a6a6a6",
                          }}
                        />
                        <path
                          d="M8.445 39.125c-.305 0-.602-.004-.904-.01a12.687 12.687 0 0 1-1.87-.164 5.884 5.884 0 0 1-1.656-.548 5.406 5.406 0 0 1-1.397-1.016 5.32 5.32 0 0 1-1.02-1.397 5.722 5.722 0 0 1-.544-1.657 12.414 12.414 0 0 1-.166-1.875c-.007-.21-.015-.913-.015-.913v-23.1s.009-.692.015-.895a12.37 12.37 0 0 1 .165-1.872 5.755 5.755 0 0 1 .544-1.662 5.373 5.373 0 0 1 1.015-1.398 5.565 5.565 0 0 1 1.402-1.023 5.823 5.823 0 0 1 1.653-.544A12.586 12.586 0 0 1 7.543.887l.902-.012h102.769l.913.013a12.385 12.385 0 0 1 1.858.162 5.938 5.938 0 0 1 1.671.548 5.594 5.594 0 0 1 2.415 2.42 5.763 5.763 0 0 1 .535 1.649 12.995 12.995 0 0 1 .174 1.887c.003.283.003.588.003.89.008.375.008.732.008 1.092v20.929c0 .363 0 .718-.008 1.075 0 .325 0 .623-.004.93a12.731 12.731 0 0 1-.17 1.853 5.739 5.739 0 0 1-.54 1.67 5.48 5.48 0 0 1-1.016 1.386 5.413 5.413 0 0 1-1.4 1.022 5.862 5.862 0 0 1-1.668.55 12.542 12.542 0 0 1-1.869.163c-.293.007-.6.011-.897.011l-1.084.002Z"/>
                        <g data-name="&lt;Group&gt;">
                          <g data-name="&lt;Group&gt;">
                            <path
                              data-name="&lt;Path&gt;"
                              d="M24.769 20.3a4.949 4.949 0 0 1 2.356-4.151 5.066 5.066 0 0 0-3.99-2.158c-1.68-.176-3.308 1.005-4.164 1.005-.872 0-2.19-.988-3.608-.958a5.315 5.315 0 0 0-4.473 2.728c-1.934 3.348-.491 8.269 1.361 10.976.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.025 2.426-1.332 3.32-2.67a10.962 10.962 0 0 0 1.52-3.092 4.782 4.782 0 0 1-2.92-4.4ZM22.037 12.21a4.872 4.872 0 0 0 1.115-3.49 4.957 4.957 0 0 0-3.208 1.66A4.636 4.636 0 0 0 18.8 13.74a4.1 4.1 0 0 0 3.237-1.53Z"
                              style={{
                                fill: "#fff",
                              }}
                            />
                          </g>
                          <path
                            d="M42.302 27.14H37.57l-1.137 3.356h-2.005l4.484-12.418h2.083l4.483 12.418h-2.039Zm-4.243-1.55h3.752l-1.85-5.446h-.051ZM55.16 25.97c0 2.813-1.506 4.62-3.779 4.62a3.07 3.07 0 0 1-2.848-1.583h-.043v4.484H46.63V21.442h1.8v1.506h.033a3.212 3.212 0 0 1 2.883-1.6c2.298 0 3.813 1.816 3.813 4.622Zm-1.91 0c0-1.833-.948-3.038-2.393-3.038-1.42 0-2.375 1.23-2.375 3.038 0 1.824.955 3.046 2.375 3.046 1.445 0 2.393-1.197 2.393-3.046ZM65.125 25.97c0 2.813-1.506 4.62-3.779 4.62a3.07 3.07 0 0 1-2.848-1.583h-.043v4.484h-1.859V21.442h1.799v1.506h.034a3.212 3.212 0 0 1 2.883-1.6c2.298 0 3.813 1.816 3.813 4.622Zm-1.91 0c0-1.833-.948-3.038-2.393-3.038-1.42 0-2.375 1.23-2.375 3.038 0 1.824.955 3.046 2.375 3.046 1.445 0 2.392-1.197 2.392-3.046ZM71.71 27.036c.138 1.232 1.334 2.04 2.97 2.04 1.566 0 2.693-.808 2.693-1.919 0-.964-.68-1.54-2.29-1.936l-1.609-.388c-2.28-.55-3.339-1.617-3.339-3.348 0-2.142 1.867-3.614 4.519-3.614 2.624 0 4.423 1.472 4.483 3.614h-1.876c-.112-1.239-1.136-1.987-2.634-1.987s-2.521.757-2.521 1.858c0 .878.654 1.395 2.255 1.79l1.368.336c2.548.603 3.606 1.626 3.606 3.443 0 2.323-1.85 3.778-4.793 3.778-2.754 0-4.614-1.42-4.734-3.667ZM83.346 19.3v2.142h1.722v1.472h-1.722v4.991c0 .776.345 1.137 1.102 1.137a5.808 5.808 0 0 0 .611-.043v1.463a5.104 5.104 0 0 1-1.032.086c-1.833 0-2.548-.689-2.548-2.445v-5.189h-1.316v-1.472h1.316V19.3ZM86.065 25.97c0-2.849 1.678-4.639 4.294-4.639 2.625 0 4.295 1.79 4.295 4.639 0 2.856-1.661 4.638-4.295 4.638-2.633 0-4.294-1.782-4.294-4.638Zm6.695 0c0-1.954-.895-3.108-2.401-3.108s-2.4 1.162-2.4 3.108c0 1.962.894 3.106 2.4 3.106s2.401-1.144 2.401-3.106ZM96.186 21.442h1.773v1.541h.043a2.16 2.16 0 0 1 2.177-1.635 2.866 2.866 0 0 1 .637.069v1.738a2.598 2.598 0 0 0-.835-.112 1.873 1.873 0 0 0-1.937 2.083v5.37h-1.858ZM109.384 27.837c-.25 1.643-1.85 2.771-3.898 2.771-2.634 0-4.269-1.764-4.269-4.595 0-2.84 1.644-4.682 4.19-4.682 2.506 0 4.08 1.72 4.08 4.466v.637h-6.394v.112a2.358 2.358 0 0 0 2.436 2.564 2.048 2.048 0 0 0 2.09-1.273Zm-6.282-2.702h4.526a2.177 2.177 0 0 0-2.22-2.298 2.292 2.292 0 0 0-2.306 2.298Z"
                            style={{
                              fill: "#fff",
                            }}
                          />
                        </g>
                        <g data-name="&lt;Group&gt;">
                          <path
                            d="M37.826 8.731a2.64 2.64 0 0 1 2.808 2.965c0 1.906-1.03 3.002-2.808 3.002h-2.155V8.73Zm-1.228 5.123h1.125a1.876 1.876 0 0 0 1.967-2.146 1.881 1.881 0 0 0-1.967-2.134h-1.125ZM41.68 12.444a2.133 2.133 0 1 1 4.248 0 2.134 2.134 0 1 1-4.247 0Zm3.334 0c0-.976-.439-1.547-1.208-1.547-.773 0-1.207.571-1.207 1.547 0 .984.434 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55ZM51.573 14.698h-.922l-.93-3.317h-.07l-.927 3.317h-.913l-1.242-4.503h.902l.806 3.436h.067l.926-3.436h.852l.926 3.436h.07l.803-3.436h.889ZM53.854 10.195h.855v.715h.066a1.348 1.348 0 0 1 1.344-.802 1.465 1.465 0 0 1 1.559 1.675v2.915h-.889v-2.692c0-.724-.314-1.084-.972-1.084a1.033 1.033 0 0 0-1.075 1.141v2.635h-.888ZM59.094 8.437h.888v6.26h-.888ZM61.218 12.444a2.133 2.133 0 1 1 4.247 0 2.134 2.134 0 1 1-4.247 0Zm3.333 0c0-.976-.439-1.547-1.208-1.547-.773 0-1.207.571-1.207 1.547 0 .984.434 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55ZM66.4 13.424c0-.81.604-1.278 1.676-1.344l1.22-.07v-.389c0-.475-.315-.744-.922-.744-.497 0-.84.182-.939.5h-.86c.09-.773.818-1.27 1.84-1.27 1.128 0 1.765.563 1.765 1.514v3.077h-.855v-.633h-.07a1.515 1.515 0 0 1-1.353.707 1.36 1.36 0 0 1-1.501-1.348Zm2.895-.384v-.377l-1.1.07c-.62.042-.9.253-.9.65 0 .405.351.64.834.64a1.062 1.062 0 0 0 1.166-.983ZM71.348 12.444c0-1.423.732-2.324 1.87-2.324a1.484 1.484 0 0 1 1.38.79h.067V8.437h.888v6.26h-.851v-.71h-.07a1.563 1.563 0 0 1-1.415.785c-1.145 0-1.869-.901-1.869-2.328Zm.918 0c0 .955.45 1.53 1.203 1.53.75 0 1.212-.583 1.212-1.526 0-.938-.468-1.53-1.212-1.53-.748 0-1.203.58-1.203 1.526ZM79.23 12.444a2.133 2.133 0 1 1 4.247 0 2.134 2.134 0 1 1-4.247 0Zm3.333 0c0-.976-.438-1.547-1.208-1.547-.772 0-1.207.571-1.207 1.547 0 .984.435 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55ZM84.67 10.195h.855v.715h.066a1.348 1.348 0 0 1 1.344-.802 1.465 1.465 0 0 1 1.559 1.675v2.915h-.889v-2.692c0-.724-.314-1.084-.972-1.084a1.033 1.033 0 0 0-1.075 1.141v2.635h-.889ZM93.515 9.074v1.141h.976v.749h-.976v2.315c0 .472.194.679.637.679a2.967 2.967 0 0 0 .339-.021v.74a2.916 2.916 0 0 1-.484.046c-.988 0-1.381-.348-1.381-1.216v-2.543h-.715v-.749h.715V9.074ZM95.705 8.437h.88v2.481h.07a1.386 1.386 0 0 1 1.374-.806 1.483 1.483 0 0 1 1.55 1.679v2.907h-.889V12.01c0-.72-.335-1.084-.963-1.084a1.052 1.052 0 0 0-1.134 1.142v2.63h-.888ZM104.761 13.482a1.828 1.828 0 0 1-1.95 1.303 2.045 2.045 0 0 1-2.081-2.325 2.077 2.077 0 0 1 2.076-2.352c1.253 0 2.009.856 2.009 2.27v.31h-3.18v.05a1.19 1.19 0 0 0 1.2 1.29 1.08 1.08 0 0 0 1.07-.546Zm-3.126-1.451h2.275a1.086 1.086 0 0 0-1.109-1.167 1.152 1.152 0 0 0-1.166 1.167Z"
                            style={{
                              fill: "#fff",
                            }}
                          />
                        </g>
                      </svg>
                    </a>
                  </section>
                </div>
              </div>
            </div>
          </div>

          <div className="mac__text">
            <div>
              <h2>Learning should be</h2>
              <h1>
                {isSliderOpen ? (
                  "fun"
                ) : (
                  <Typewriter
                    options={{
                      strings: ["intuitive", "fun", "accessible", "affordable"],
                      autoStart: true,
                      loop: true,
                      delay: 45,
                    }}
                  />
                )}
              </h1>
            </div>
            <div className="call__to__action">
              <button
                className="start__learning__btn"
                onClick={() => {
                  setIsSliderOpen(true);
                  navigator && navigator.vibrate && navigator.vibrate(5);
                }}
              >
                Start Learning
              </button>
            </div>

            <div className="down__scroll__indicator">
              <div id="scrollindicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*<PustackFooter/>*/}
      <Suspense fallback={<></>}>
        <OnBoardingFlow
          isOpen={isSliderOpen}
          handleClose={() => setIsSliderOpen(!isSliderOpen)}
        />
      </Suspense>
    </div>
  );
}
