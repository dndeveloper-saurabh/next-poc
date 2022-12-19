import '../styles/globals.scss'
import '../components/style.css'
import "react-circular-progressbar/dist/styles.css";
import "plyr-react/plyr.css";
import "react-phone-input-2/lib/style.css";
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import {useEffect} from 'react';

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
const SidebarContextProvider = dynamic(() => import("../context/global/SidebarContext"));
const SubjectModalContextProvider = dynamic(() => import("../context/global/SubjectModal"));
const SnackbarContextProvider = dynamic(() => import("../context/snackbar"));
const ClassroomContextProvider = dynamic(() => import("../context/classroom/index"));

const publicPages = ["/classroom", "/"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <IntroContextProvider>
      <ThemeContextProvider>
        <UserContextProvider>
          {isPublicPage ? (
            <Component {...pageProps} />
          ): (
            <PustackProContextProvider>
              <ClassroomContextProvider>
                <SidebarContextProvider>
                  <SubjectModalContextProvider>
                    <SnackbarContextProvider>
                      <Component {...pageProps} />
                    </SnackbarContextProvider>
                  </SubjectModalContextProvider>
                </SidebarContextProvider>
              </ClassroomContextProvider>
            </PustackProContextProvider>
          )}
        </UserContextProvider>
      </ThemeContextProvider>
    </IntroContextProvider>
  )
}
