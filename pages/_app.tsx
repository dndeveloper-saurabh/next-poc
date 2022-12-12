import '../styles/globals.scss'
import '../components/style.css'
import "react-circular-progressbar/dist/styles.css";
import "plyr-react/plyr.css";
import "react-phone-input-2/lib/style.css";
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

// import {
//   UserContextProvider,
//   ClassroomContextProvider,
//   ThemeContextProvider,
//   PustackProContextProvider,
//   IntroContextProvider
// } from "../context";

const UserContextProvider = dynamic(() => import("../context/global/user-context"));
const PustackProContextProvider = dynamic(() => import("../context/global/PustackProContext"));
const IntroContextProvider = dynamic(() => import("../context/global/IntroContext"));
const ThemeContextProvider = dynamic(() => import("../context/global/ThemeContext"));
const ClassroomContextProvider = dynamic(() => import("../context/classroom/index"));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PustackProContextProvider>
      <IntroContextProvider>
        <ThemeContextProvider>
          <UserContextProvider>
            <ClassroomContextProvider>
              <Component {...pageProps} />
            </ClassroomContextProvider>
          </UserContextProvider>
        </ThemeContextProvider>
      </IntroContextProvider>
    </PustackProContextProvider>
  )
}
