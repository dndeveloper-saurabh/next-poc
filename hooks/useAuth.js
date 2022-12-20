import {useContext, useEffect, useState} from "react";
import {UserContext, ThemeContext} from '../context';
import {useRouter} from 'next/router';
import {defaultPic} from '../public/assets'


const getCareMessageCount = ({ userId, grade }) => {
  return (require('../firebase-config')).db
    .collection("user_notifications")
    .doc(grade)
    .collection("user_notifications")
    .doc(userId);
};

const userImportantData = (userId) => {
  // .then((doc) => doc.data().tier === "pro");

  return (require('../firebase-config')).db.collection("users").doc(userId);
};

const removeFcmToken = async (userId, fcmToken) => {
  return await (require('../firebase-config')).db
    .collection("user_tokens")
    .doc(userId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        let tokens = doc.data().tokens?.filter((t) => t.token !== fcmToken);

        return await (require('../firebase-config')).db
          .collection("user_tokens")
          .doc(userId)
          .update({ tokens: tokens })
          .then(() => true)
          .catch((e) => {
            console.log(e)
            return false;
          });
      }
      return true;
    })
    .catch((e) => {
      console.log(e);
      return false;
    });
};

const logOut = async () => {
  let logout_sucess;
  await (require('../firebase-config')).auth.signOut().then(() => {
    logout_sucess = true;
  });


  return logout_sucess;
};


export default function useAuth() {
  const [user, setUser] = useContext(UserContext).user;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [userHasNoGrade, setUserHasNoGrade] = useContext(UserContext).userHasNoGrade;
  const [, setIsUserProTier] = useContext(UserContext).tier;
  const [isInstructor, setIsInstructor] = useContext(UserContext).isInstructor;
  const [checkedLoggedInStatus, setCheckedLoggedInStatus] = useState(false);
  const [isDarkMode, setIsDarkMode] = useContext(ThemeContext).theme;
  const [, setIsExternal] = useContext(UserContext).isExternal;
  const [, setUnreadCareMsgCount] = useContext(UserContext).unreadCareMsgCount;
  const [closeInstallApp, setCloseInstallApp] =
    useContext(UserContext).closeInstallApp;

  useEffect(() => {
    // let path = window.location.pathname;

    // if (path === "/app") {
    // 	return (window.location.href = appGooglePlayLink);
    // }

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
    } else {
      router.replace('/');
    }

    setIsLoading(false);
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

              // loadingWrapper();

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
        setIsLoading(false);

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
          // !isSmallScreen && setOpenPustackCare(true);
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

  return {user, isLoading};
}
