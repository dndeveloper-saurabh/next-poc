import Head from 'next/head'
import Image from 'next/image'
import React, {useContext, useEffect, useState} from 'react';
import DesktopLanding from '../components/PustackLanding';
import initialize from '../animations';
// @ts-ignore
// import {isMessagingSupported, messaging} from '../firebase-config';
import logo from '../public/assets/images/logo.png'
import {UserContext, ThemeContext} from '../context';
import {
  getCareMessageCount,
  userImportantData,
} from "../database";
import {logOut} from "../services";
import {defaultPic} from "../public/assets";

const VAPIDKEY =
  "BBAS6jVsiEE86EtJvP9RGSkPt46szXb2Ao7pfUdOL0xhhDiiPGnzgwN3utpw_O6RFMbuxgui2d3F7W98jFB5ZWk";

export default function Home() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [user, setUser] = useContext(UserContext).user;
  const [userHasNoGrade, setUserHasNoGrade] = useContext(UserContext).userHasNoGrade;
  const [, setIsUserProTier] = useContext(UserContext).tier;
  const [isInstructor, setIsInstructor] = useContext(UserContext).isInstructor;
  const [checkedLoggedInStatus, setCheckedLoggedInStatus] = useState(false);
  const [isDarkMode, setIsDarkMode] = useContext(ThemeContext).theme;
  const [, setIsExternal] = useContext(UserContext).isExternal;
  const [, setUnreadCareMsgCount] = useContext(UserContext).unreadCareMsgCount;
  const [closeInstallApp, setCloseInstallApp] =
    useContext(UserContext).closeInstallApp;
  const [openPustackCare, setOpenPustackCare] =
    useContext(UserContext).openPustackCare;
  // const [isSliderOpen, setIsSliderOpen] = useContext(PustackProContext).value;

  useEffect(() => {
    initialize();
  }, [])

  useEffect(() => {
    let path = window.location.pathname;

    if (path === "/app") {
      return (window.location.href = appGooglePlayLink);
    }

    if (localStorage.getItem("user")) {
      const _user = JSON.parse(localStorage.getItem("user"));
      setUser(_user);
      if(_user && !_user.grade) {
        setUserHasNoGrade(true);
      } else {
        setUserHasNoGrade(false);
      }

      if (_user) {
        try {
          setUserImportantDataFn(_user.uid);
          setUnreadMsgCountFn(_user);
        } catch (error) {
          setUser(null);
        }
      }

      if (localStorage.getItem("pustack-dark-theme") === "true") {
        try {
          setIsDarkMode(true);
        } catch (error) {
          setIsDarkMode(false);
        }
      }

      if (localStorage.getItem("closeInstallApp")) {
        setCloseInstallApp(true);
      }

      if (localStorage.getItem("isUserPro")) {
        setIsUserProTier(localStorage.getItem("isUserPro") === "true");
      }

      if (localStorage.getItem("isInstructor")) {
        setIsInstructor(localStorage.getItem("isInstructor") === "true");
      }

      if (localStorage.getItem("isExternalInstructor")) {
        setIsExternal(localStorage.getItem("isExternalInstructor") === "true");
      }
    }

    setCheckedLoggedInStatus(true);
  }, []);

  const setUserImportantDataFn = async (uid) => {
    const res = await userImportantData(uid);

    res.onSnapshot(async (snapshot) => {
      console.log('user - ', user, snapshot.data());
      // console.log('user?.has_rated_app, snapshot.data()?.has_rated_app - ', user?.has_rated_app, snapshot.data()?.has_rated_app)
      // if(user?.has_rated_app !== undefined && snapshot.data()?.has_rated_app !== user?.has_rated_app) return;
      if (snapshot.data() || "") {
        setIsUserProTier(snapshot.data()?.tier === "pro");
        setIsInstructor(snapshot.data()?.is_instructor);
        setIsExternal(snapshot.data()?.is_external_instructor || false);

        if(snapshot.data().is_deleted) {

          let fcmToken = localStorage.getItem("fcmToken");
          let isTokenRemoved = await removeFcmToken(snapshot.data().uid, fcmToken);

          if (isTokenRemoved) {
            let logout_success = await logOut();
            if (logout_success) {
              setUser(null);

              loadingWrapper();

              localStorage.clear();
              localStorage.setItem("hideCookie", true);

              // window.location = "/";
            }
          }

          return;
        }

        let _user = JSON.parse(localStorage.getItem("user"));

        _user = { ..._user, ...snapshot.data() };

        if(!_user.profile_url) _user.profile_url = defaultPic;
        setUser(_user);

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: _user?.uid,
            grade: _user?.grade,
            name: _user?.name,
            profile_url: _user?.profile_url,
          })
        );

        localStorage.setItem(
          "isUserPro",
          JSON.stringify(snapshot.data()?.tier === "pro")
        );
        localStorage.setItem(
          "isInstructor",
          JSON.stringify(snapshot.data()?.is_instructor)
        );
        localStorage.setItem(
          "isExternalInstructor",
          JSON.stringify(snapshot.data()?.is_external_instructor || false)
        );
      } else {
        if (navigator.onLine) {
          setUser(null);
          setIsUserProTier(false);
          setIsInstructor(false);
          localStorage.clear();
          localStorage.setItem("hideCookie", true);
          window.location = "/";
        }
      }
    });
  };

  const setUnreadMsgCountFn = async (_user) => {
    (await getCareMessageCount({ userId: _user?.uid, grade: _user?.grade })).onSnapshot(
      (snapshot) => {
        const count = snapshot.data()?.unread_care_message_count;

        setUnreadCareMsgCount(count);

        if (count > 0) {
          !isSmallScreen && setOpenPustackCare(true);
          // TODO: Load mp3
          // if (!openPustackCare) {
          //   let audio = new Audio(newMsgAudio);
          //   audio.play();
          // }
        }
      },
      (error) => console.log(error)
    );
  };

  return (
    // <div className={styles.container}>
    <>
      <Head>
        <title>Pustack</title>
        <meta name="description" content="At PuStack we believe that it is our responsibility to build quality tools and generate flawless content to help students globally." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*<main className={styles.main}>*/}
        <DesktopLanding isSliderOpen={isSliderOpen} setIsSliderOpen={setIsSliderOpen} />
      <div className="loading__wrapper" data-nosnippet="">
        <div className="loading__content fadeIn">
          <Image
            src={logo}
            alt="Pustack Logo"
            className="loader__logo"
          />
          <span id="loader" />
        </div>
      </div>
      {/*</main>*/}

      {/*<footer className={styles.footer}>*/}
      {/*  <a*/}
      {/*    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Powered by{' '}*/}
      {/*    <span className={styles.logo}>*/}
      {/*      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />*/}
      {/*    </span>*/}
      {/*  </a>*/}
      {/*</footer>*/}
    </>
    // </div>
  )
}
