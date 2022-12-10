import '../styles/globals.scss'
import '../components/style.css'
import "react-circular-progressbar/dist/styles.css";
import "plyr-react/plyr.css";
import "react-phone-input-2/lib/style.css";
import type { AppProps } from 'next/app';
import {
  UserContextProvider,
  ThemeContextProvider,
  PustackProContextProvider,
  PageContextProvider,
  TipsContextProvider,
  IntroContextProvider,
  SidebarContextProvider,
  PracticeContextProvider,
  ClassroomContextProvider,
  LiveSessionContextProvider,
  SubjectModalContextProvider, BlazeSessionContextProvider,
} from "../context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PustackProContextProvider>
      <ThemeContextProvider>
        <UserContextProvider>
          <IntroContextProvider>
            <SidebarContextProvider>
              <TipsContextProvider>
                <PracticeContextProvider>
                  <PageContextProvider>
                    <LiveSessionContextProvider>
                      <SubjectModalContextProvider>
                        <BlazeSessionContextProvider>
                          <ClassroomContextProvider>
                            <Component {...pageProps} />
                          </ClassroomContextProvider>
                        </BlazeSessionContextProvider>
                      </SubjectModalContextProvider>
                    </LiveSessionContextProvider>
                  </PageContextProvider>
                </PracticeContextProvider>
              </TipsContextProvider>
            </SidebarContextProvider>
          </IntroContextProvider>
        </UserContextProvider>
      </ThemeContextProvider>
    </PustackProContextProvider>
  )
}
