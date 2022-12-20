import '../styles/globals.scss'
import '../components/style.css'
import "react-circular-progressbar/dist/styles.css";
import "plyr-react/plyr.css";
import "react-phone-input-2/lib/style.css";
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import {useState} from 'react';

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
const LiveSessionContextProvider = dynamic(() => import("../context/livesessions/LiveSessionContext"));
const PustackProSlider = dynamic(() => import("../containers/global/pro-slider"));

const publicPages = ["/classroom"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [proSliderOpen, setProSliderOpen] = useState(false);

  // const [pageLoading, setPageLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   const handleStart = () => { setPageLoading(true); };
  //   const handleComplete = () => { setPageLoading(false); };
  //
  //   router.events.on('routeChangeStart', handleStart);
  //   router.events.on('routeChangeComplete', handleComplete);
  //   router.events.on('routeChangeError', handleComplete);
  // }, [router]);

  const isPublicPage = publicPages.includes(router.pathname);

  // if(pageLoading) return (
  //   <div>
  //     <h1>Page loading...</h1>
  //   </div>
  // )

  return (
    <IntroContextProvider>
      <ThemeContextProvider>
        <UserContextProvider>
          <PustackProContextProvider>
            {isPublicPage ? (
              <Component {...pageProps} />
            ): (
                <ClassroomContextProvider>
                  <SidebarContextProvider>
                    <SubjectModalContextProvider>
                      <SnackbarContextProvider>
                        <LiveSessionContextProvider>
                          <Component {...pageProps} setProSliderOpen={setProSliderOpen} proSliderOpen={proSliderOpen} />
                        </LiveSessionContextProvider>
                      </SnackbarContextProvider>
                    </SubjectModalContextProvider>
                  </SidebarContextProvider>
                </ClassroomContextProvider>
            )}
            <PustackProSlider
              isOpen={proSliderOpen}
              handleClose={() => setProSliderOpen(c => !c)}
            />
          </PustackProContextProvider>
        </UserContextProvider>
      </ThemeContextProvider>
    </IntroContextProvider>
  )
}
