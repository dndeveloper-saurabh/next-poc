import Head from 'next/head'
import Image from 'next/image'
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import DesktopLanding from '../components/PustackLanding';
import initialize from '../animations';
// @ts-ignore
// import {isMessagingSupported, messaging} from '../firebase-config';
import logo from '../public/assets/images/logo.png'
import {PustackProContext} from '../context';
import useAuth from '../hooks/useAuth';
import Dashboard from '../components/home/Dashboard';
const VAPIDKEY =
  "BBAS6jVsiEE86EtJvP9RGSkPt46szXb2Ao7pfUdOL0xhhDiiPGnzgwN3utpw_O6RFMbuxgui2d3F7W98jFB5ZWk";


export default function Home({proSliderOpen, setProSliderOpen}) {
  // const [isSliderOpen, setIsSliderOpen] = useState(false);
  const {user, isLoading} = useAuth();
  const [isSliderOpen, setIsSliderOpen] = useContext(PustackProContext).value;

  console.log('isLoading - ', isLoading);

  useEffect(() => {
    if(!isLoading && !user) initialize();
  }, [isLoading, user])

  return (
    // <div className={styles.container}>
    <>
      <Head>
        <title>Pustack</title>
        <meta name="description" content="At PuStack we believe that it is our responsibility to build quality tools and generate flawless content to help students globally." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*<main className={styles.main}>*/}
      {(!isLoading && !user) && <DesktopLanding isSliderOpen={isSliderOpen} setIsSliderOpen={setIsSliderOpen} />}
      {user && <Dashboard user={user} setProSliderOpen={setProSliderOpen} proSliderOpen={proSliderOpen} />}
      {/*<div className="loading__wrapper" data-nosnippet="">*/}
      {/*  <div className="loading__content fadeIn">*/}
      {/*    <Image height={100} width={100}*/}
      {/*      src={logo}*/}
      {/*      alt="Pustack Logo"*/}
      {/*      className="loader__logo"*/}
      {/*    />*/}
      {/*    <span id="loader" />*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*</main>*/}

      {/*<footer className={styles.footer}>*/}
      {/*  <a*/}
      {/*    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Powered by{' '}*/}
      {/*    <span className={styles.logo}>*/}
      {/*      <Image height={100} width={100} src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />*/}
      {/*    </span>*/}
      {/*  </a>*/}
      {/*</footer>*/}
    </>
    // </div>
  )
}
