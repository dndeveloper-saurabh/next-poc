import React, { useState, useMemo, useContext, useCallback, useEffect, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import {Apple, Facebook, Facebook2, Google, logoDark} from "../public/assets";
import snipperFirstFrame from "../public/assets/images/snippetFirstFrame.jpg";
import PhoneInput from "react-phone-input-2";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Lottie from "lottie-react-web";
import circularProgress from "../public/assets/lottie/circularProgress.json";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import launch from "../public/assets/onboarding/launch.json";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import phoneVerification from "../public/assets/onboarding/phone_verification.svg";
import phoneVerificationHand from "../public/assets/onboarding/phone_verification_hand.svg";
import planetEarth from "../public/assets/onboarding/planet_earth.svg";
import Timer from "react-compound-timer";
import {
  deleteUserFromDatabase,
  getUserInfoById,
  rewardProMembership,
  uploadFinalUserInfo,
  uploadUserInfo
} from "../database";
import astronaut from "../public/assets/onboarding/astronaut.json";
import phone from "../public/assets/onboarding/phone.svg";
import {ALREADY_EXIST_PHONE_LOGIN_CODE, loadingWrapper, showSnackbar} from "../helpers";
import {
  signIn, signInWithPhone, submit,
  submitPhoneNumberAuthCode
} from "../services/auth";
import phoneSocial from "../public/assets/onboarding/phone_social.svg";
import {ALREADY_EXIST_EMAIL_LOGIN_CODE} from "../helpers/constants";
import {getAvailableGrades} from "../database/home/fetcher";
import comet from "../public/assets/onboarding/comet.svg";
import gulu from "../public/assets/onboarding/gulu.svg";
import mars from "../public/assets/onboarding/mars.svg";
import controlRoom from "../public/assets/onboarding/control_room.svg";
// import {useHistory, useLocation} from "react-router-dom";
import useQuery from "../hooks/query/useQuery";
import {IntroContext, UserContext} from "../context";
import useIsProduction from "../hooks/isProduction";
import planet1 from "../public/assets/onboarding/planet_1.svg";
import planet2 from "../public/assets/onboarding/planet_2.svg";
import planet3 from "../public/assets/onboarding/planet_3.svg";
import planet4 from "../public/assets/onboarding/planet_4.svg";
import planet5 from "../public/assets/onboarding/planet_5.svg";
import planet6 from "../public/assets/onboarding/planet_6.svg";
import firebase from "firebase";
import packageInfo from "../package.json";
// import "../onboarding/style.scss";
// import "../onboardingMobile/style.scss";
import {useMediaQuery} from "react-responsive";
import Drawer from "@material-ui/core/Drawer";
import {useRouter} from "next/router";
import useAppleDevice from "../hooks/isAppleDevice";
import Image from "next/image";

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => ++value); // update the state to force render
};

const phoneRouteSteps = ['login', 'otp', 'social', 'grade'];
const emailRouteSteps = ['login', 'phone', 'otp', 'grade'];

export default function OnBoardingFlow({setCloseInstallApp = () => {}, isOpen = true, handleClose = () => {}}) {
  const router = useRouter()
  const query = useQuery();
  const forceUpdate = useForceUpdate();
  const [userHasNoGrade, setUserHasNoGrade] = useContext(UserContext).userHasNoGrade;
  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
  const [isiPad, setIsIpad] = useState(false);
  const [activeTab, setActiveStep] = useState(0);
  const isProduction = useIsProduction();
  const [lastInput, setLastInput] = useState(10);
  const [canPlay, setCanPlay] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [tempUserData, setTempUserData] = useState(null);
  const [tempEmailUserData, setTempEmailUserData] = useState(null);
  const [tempPhoneUserData, setTempPhoneUserData] = useState(null);
  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [accountExists, setAccountExists] = useState(false);
  const [plural, setPlural] = useState(true);
  const [spaceKey, setSpaceKey] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState(false);
  const [allowNext, setAllowNext] = useState(false);
  const [resendCode, setResendCode] = useState(true);
  const [phoneRoute, setPhoneRoute] = useState(true);
  const [activeUserGrade, setActiveUserGrade] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [checkingOtp, setCheckingOtp] = useState(false);
  const [animateHand, setAnimateHand] = useState(true);
  const [processStarted, setProcessStarted] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [socialProcessStarted, setSocialProcessStarted] = useState([
    false,
    false,
    false,
  ]);
  const isAppleDevice = useAppleDevice();
  const [showPDF, setShowPDF] = useState(false);
  const [pushDown, setPushDown] = useState(false);
  const [documentToShow, setDocumentToShow] = useState("");
  const [launchRocket, setLaunchRocket] = useState(false);
  const [existingPhone, setExistingPhone] = useState("");
  const [existingAccountError, setExistingAccountError] = useState(null);
  const [phoneExists, setPhoneExists] = useState(false);
  const [gmailExists, setGmailExists] = useState(false);
  const [googleMailAddress, setGoogleMailAddress] = useState("");
  const [stepsAllowed, setStepsAllowed] = useState([0]);
  const [settingActiveTab, setSettingActiveTab] = useState(false);
  const [prevStep, setPrevStep] = useState(0);
  const [facebookPendingCredentials, setFacebookPendingCredentials] =
    useState("");

  let recaptchaRef = useRef();
  let phoneRouteRef = useRef(phoneRoute);

  const [, setUser] = useContext(UserContext).user;
  const [, setOpenFreeTrial] = useContext(IntroContext).openFreeTrial;
  const [, setTrialType] = useContext(IntroContext).trialType;
  const [, setIsUserProTier] = useContext(UserContext).tier;
  const [, setIsInstructor] = useContext(UserContext).isInstructor;
  const [referrerId] = useContext(UserContext).referrerId;

  useEffect(() => {
    return () => {
      window.onbeforeunload = null;
    }
  }, []);

  const handleOpenRoute = (path) => () => {
    const win = window.open(path, "_blank");
    win.focus();
  };

  const handMovementClasses = [
    " zero",
    " one",
    " two",
    " three",
    " four",
    " five",
    " six",
    " seven",
    " eight",
    " nine",
    "",
  ];

  const routeSteps = useMemo(() => {
    if(phoneRoute) return phoneRouteSteps;
    return emailRouteSteps;
  }, [phoneRoute]);

  const encodeStep = useCallback((step) => routeSteps[step], [routeSteps]);
  const decodeStep = useCallback((routeStep) => routeSteps.findIndex(c => c === routeStep), [routeSteps]);


  const planetsArray = [planet1, planet2, planet3, planet4, planet5, planet6];


  function sendToUrl(string) {
    router.push(string);
  }

  function isStepAllowed(step) {
    return stepsAllowed.includes(step);
  }

  function isPrevStep() {
    return prevStep !== 1
  }

  useEffect(() => {
    // if(router.pathname !== '/') return;
    const stepRoute = query.get('step');
    const step = decodeStep(stepRoute);
    if(step < 0) return;
    // if(stepsAllowed.at(-1) === 3 && step !== 3) return setActiveTab(3);
    // if(stepsAllowed.at(-1) === 0 && step !== 0) return setActiveTab(0);
    if(userHasNoGrade && step !== 3) return setActiveTab(3);
    if(isNaN(step)) return setActiveTab(0);
    if(step === 0) {
      setOtpCode(Array(6).fill(""));
      setOtpError(false);
      setOtpErrorMsg("");
      setSocialProcessStarted([false, false, false]);
      tempPhoneUserData && tempPhoneUserData.delete();
      setTempPhoneUserData(null);
      setStepsAllowed([0])
      if(isPrevStep()) {
        console.log('isPrevStep - ', prevStep);
        setPhoneNumber("+91");
        setExistingPhone("");
      }
      setPhoneExists(false);
    }
    if(!isStepAllowed(step)) return setActiveTab(0);
    if(step === 0) setStepsAllowed([0]);
    if(step === 3) setStepsAllowed([3])
    setActiveStep(step);
  }, [query, router.pathname, userHasNoGrade]);

  useEffect(() => {
    if(!settingActiveTab) return;
    const index = stepsAllowed.at(-1);
    if(phoneRoute) {
      if([2,3].includes(index)) {
        window.onbeforeunload = function() {
          return '';
        };
      } else {
        window.onbeforeunload = null;
      }
    } else {
      if([1,3].includes(index)) {
        window.onbeforeunload = function() {
          return '';
        };
      } else {
        window.onbeforeunload = null;
      }
    }
    // if(index === activeTab) return;
    const stepIndex = encodeStep(index);
    if(index > 1 || index === 0) {
      router.replace('/?step=' + stepIndex);
    } else {
      router.push('/?step=' + stepIndex);
    }
    // if(index > 1) {
    // } else {
    //   router.push('/auth?step=' + index);
    // }
    setSettingActiveTab(false);
  }, [settingActiveTab])

  const setActiveTab = useCallback((currentTab) => {
    // if(currentTab === activeTab) return;
    // _setActiveTab(currentTab);
    console.log('currentTab - ', currentTab);
    if(currentTab === 3) {setUserHasNoGrade(true)}
    setStepsAllowed(c => {
      const a = [...c];
      a.push(currentTab);
      setPrevStep(c.at(-1));
      // if(currentTab === 3) a = [3]
      // if(currentTab === 0) {
      //   return [0];
      // }
      setSettingActiveTab(true);
      return a;
    });
  }, [activeTab])

  useEffect(() => {
    console.log('window.recaptchaVerifier - ', window.recaptchaVerifier);
    //TODO: Uncomment this
    // setTimeout(() => {
      // document.querySelector(".loading__wrapper").style.display = "none";
    // }, 2000);

    if(!window.recaptchaVerifier && isOpen) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        `recaptcha-container`,
        {
          size: "invisible",
          callback: (response) => {
            console.log({ response });
          },
          "expired-callback": () => window.recaptchaVerifier.clear(),
        },
        require('../firebase-config').firebaseApp
      );
      return () => {
        window.recaptchaVerifier = null;
      }
    }
  }, [isOpen]);

  const handleSliderClose = () => {
    // router.push('/');

    handleClose();

    setTimeout(() => {
      // setActiveTab(0);
      setSendingOtp(false);
      setPhoneRoute(true);
      setProcessStarted(false);
      setPhoneNumber("+91");
      setOtpCode(Array(6).fill(""));
      setOtpErrorMsg("");
      setTempEmailUserData(null);
      setTempPhoneUserData(null);
      setOtpError(false);
      setSocialProcessStarted([false, false, false]);
      setPhoneNumberError(null);
      setPhoneExists(false);
      setExistingAccountError(null);
      setEmailError(null);
      setFacebookPendingCredentials("");
      setGoogleMailAddress("");
      setGmailExists(false);
      setStepsAllowed([0]);
    }, 500);
  };

  const handleOTPChange = async (e, i) => {
    const { maxLength, value } = e.target;
    forceUpdate();

    if (animateHand) {
      setLastInput(value);
      setTimeout(() => setLastInput(10), 250);

      if (value.length >= maxLength && i < 5) {
        const nextField = document.querySelector(
          `div > input[name=input${i + 1}]`
        );
        if (nextField !== null) nextField.focus();
      }
    }

    if (!spaceKey) {
      otpCode[i] = value;
      setOtpCode(otpCode);

      const code = otpCode?.join("");

      if (code.length === 6) {
        setCheckingOtp(true);

        let user, res, errorCode, exists;
        try {
          [user, res, errorCode, exists] = await submitPhoneNumberAuthCode(
            code,
            facebookPendingCredentials,
            googleMailAddress,
            false
          );
        } catch (err) {

          console.log('err - ', err);
          return;
        }


        setTempPhoneUserData(user);
        if (res) {
          setOtpError(false);

          let [
            name,
            profile_url,
            role,
            email,
            is_instructor,
            sign_up_ts,
            phone_number,
            has_rated_app,
            app_rating,
            pro_expiration_date,
            tier,
            grade,
            phone_country_code,
          ] = await getUserInfoById(user.uid);

          if(!phone_number) {
            let time_now = await uploadUserInfo(
              user?.uid,
              name ?? user?.displayName,
              email ?? null,
              user?.photoURL ?? null,
              false, // setting user as student
              user?.phoneNumber?.slice(countryCode?.length + 1),
              countryCode
            );
            phone_number = user?.phoneNumber?.slice(countryCode?.length + 1);
            phone_country_code = countryCode;
          }
          setCheckingOtp(false);

          if (!email || !phone_number) {
            if(exists) {
              setPhoneRoute(true);
              setActiveTab(2);
              return;
            }
            setActiveTab(activeTab + 1);
          } else {
            const data = {
              email: email,
              uid: user.uid,
              name: name,
              grade: grade,
              is_instructor: is_instructor,
              phone_country_code: phone_country_code,
              phone_number: phone_number,
              profile_url: profile_url,
              role: role,
              sign_up_ts: sign_up_ts,
              has_rated_app: has_rated_app ? has_rated_app : false,
              app_rating: app_rating ? app_rating : 0,
              pro_expiration_date: pro_expiration_date,
            };

            if(user && !grade) {
              return setTempUserData(() => {
                setUserHasNoGrade(true);
                return data;
              })
            }

            setLaunchRocket(true);

            setTimeout(() => {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  uid: data?.uid,
                  grade: data?.grade,
                  name: data?.name,
                  profile_url: data?.profile_url,
                })
              );
              localStorage.setItem(
                "isInstructor",
                JSON.stringify(is_instructor)
              );
              localStorage.setItem(
                "isUserPro",
                JSON.stringify(tier !== "free")
              );
              setUser(data);
              setIsUserProTier(tier !== "free");
              setIsInstructor(is_instructor);
              loadingWrapper();
              sendToUrl("/classroom?subject=physics&chapter=class_9_learn_science_physics_sound");
            }, 2000);
            return setTimeout(handleSliderClose, 1500);
          }

          setAllowNext(true);
        } else {
          setOtpError(true);
          setOtpErrorMsg(errorCode);
          setCheckingOtp(false);
        }
      } else {
        setOtpError(false);
        setAllowNext(false);
      }
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === " ") {
      setSpaceKey(true);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      setAnimateHand(false);
      forceUpdate();

      if (otpCode[i]?.length === 0 && i > 0 && i <= 5) {
        const prevField = document.querySelector(
          `div > input[name=input${i - 1}]`
        );
        if (prevField !== null) prevField.focus();
      }
    } else {
      setAnimateHand(true);
      setSpaceKey(false);
    }
  };

  const onSignInWithFacebookBtnClick = async () => {
    setProcessStarted(true);

    const user = await signIn(
      require('../firebase-config').facebookProvider,
      facebookPendingCredentials,
      googleMailAddress,
      error => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setGoogleMailAddress(error.email);
          setFacebookPendingCredentials(error.credential);
          setGmailExists(true);
        }

        setSocialProcessStarted([false, false, false]);
      }
    );

    if (user) {
      setData(user);
    } else {
      setSocialProcessStarted([false, false, false]);
    }
  };

  const onSignInWithGoogleBtnClick = async () => {
    setProcessStarted(true);

    const user = await signIn(
      require('../firebase-config').googleProvider,
      facebookPendingCredentials,
      googleMailAddress
    );

    if (user) {
      setData(user);
    } else {
      setSocialProcessStarted([false, false, false]);
    }
  };

  const onSignInWithAppleBtnClick = async () => {
    setProcessStarted(true);

    const user = await signIn(
      require('../firebase-config').appleProvider,
      facebookPendingCredentials,
      googleMailAddress
    );

    if (user) {
      setData(user);
    } else {
      setSocialProcessStarted([false, false, false]);
    }
  };

  const setData = async (user, askForPhone) => {
    let data = {};
    setAccountExists(false);

    if (user?.email) {
      let [
        name,
        profile_url,
        role,
        email,
        is_instructor,
        sign_up_ts,
        phone_number,
        has_rated_app,
        app_rating,
        pro_expiration_date,
        tier,
        grade,
        phone_country_code,
      ] = await getUserInfoById(user?.uid);


      let time_now = false;

      if (!email || !phone_number) {
        time_now = await uploadUserInfo(
          user?.uid,
          user?.displayName,
          user?.email,
          user?.photoURL,
          false, // setting user as student
          phoneNumber?.slice(countryCode?.length + 1),
          countryCode
        );
        setPhoneRoute(false)

        if (time_now) {
          data = {
            app_rating: null,
            app_rating_history: [],
            email: user?.email,
            grade: null,
            has_rated_app: false,
            is_instructor: false,
            name: user?.displayName,
            phone_country_code: askForPhone ? null : countryCode,
            phone_number: askForPhone ? null : phone_number,
            pro_expiration_date: null,
            profile_url: user?.photoURL,
            role: "Student",
            sign_up_ts: time_now,
            tier: "free",
            uid: user?.uid,
          };

          setTempUserData({ ...data });
          setTempEmailUserData(user);
          setProcessStarted(false);

          setTimeout(() => {
            if(askForPhone) {
              setPhoneNumberError(null);
              setPhoneNumber('+91');
              setOtpCode(Array(6).fill(""));
              setOtpError(null);
              setOtpErrorMsg(null);
              setCountryCode('');
              setAccountExists(true);
              return setActiveTab(1);
            }
            setActiveTab(activeTab + 1)
          }, 250);

          setSocialProcessStarted([false, false, false]);
        }
      } else {
        setProcessStarted(false);
        data = {
          email: email,
          uid: user?.uid,
          name: name,
          grade: grade,
          is_instructor: is_instructor,
          phone_country_code: phone_country_code,
          phone_number: phone_number,
          profile_url: profile_url,
          role: role,
          sign_up_ts: sign_up_ts,
          has_rated_app: has_rated_app ? has_rated_app : false,
          app_rating: app_rating ? app_rating : 0,
          pro_expiration_date: pro_expiration_date,
          tier: tier,
        };

        const _existingPhone = "+" + phone_country_code + phone_number;
        setExistingPhone(phone_country_code + phone_number);

        if (phoneRouteRef.current && _existingPhone !== phoneNumber) {
          setPhoneExists(true);
          setOtpCode(Array(6).fill(""));
          await signInExistingPhoneFn(2, _existingPhone, null);
          setPhoneRoute(false)
        } else {
          setPhoneExists(false);
          setOtpCode(Array(6).fill(""));
          await signInExistingPhoneFn(2, _existingPhone, null);
          setPhoneRoute(false)
        }
      }
    } else {
      setEmailError("The facebook account doesn't have an email");
      setTimeout(() => {
        setEmailError(null);
        submit(
          require('../firebase-config').googleProvider,
          user,
          setPhoneNumberError,
          setSocialProcessStarted,
          setExistingAccountError,
          handleAuth,
          setData
        ).then();
      }, 2000);

      setPhoneRoute(false);

      setSocialProcessStarted([false, false, false]);

      setTempEmailUserData(user);
    }
  };

  const setUserGrade = async (value) => {
    if(activeUserGrade) return;
    setActiveUserGrade(value);
    let updated, _user = {...tempUserData, grade: value};

    await require('../firebase-config').db
      .collection("users")
      .doc(_user.uid)
      .set({ grade: value }, { merge: true })
      .then(() => true)
      .catch(() => false);
    updated = true;
    setUserHasNoGrade(false);

    // let _user = {
    //   ...tempUserData,
    //   grade: value,
    //   phone_number: phoneNumber.replace("+", "").slice(countryCode?.length),
    //   phone_country_code: countryCode,
    //   source: "web " + version,
    // };
    //
    // let updated = await uploadFinalUserInfo(_user?.uid, _user);

    if (updated) {
      try {
        if (referrerId) {
          const handleAppReferrals =
            require('../firebase-config').functions.httpsCallable("handleAppReferrals");

          await handleAppReferrals({
            referrer_id: referrerId,
            referred_id: _user?.uid,
          });

          setTrialType("referrred");
          setIsUserProTier(true);
        } else {
          const hasBeenRewarded = await rewardProMembership(_user?.uid, 7);
          if (hasBeenRewarded) {
            setTrialType("not-referred");
            setIsUserProTier(true);
          }
        }
      } catch (err) {
        console.log(err);
        setTrialType(null);
        setIsUserProTier(false);
      }

      handleSliderClose();
      setTimeout(() => loadingWrapper(), 1000);

      setTimeout(() => {
        setUser(_user);

        setIsInstructor(false);
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: _user?.uid,
            grade: _user?.grade,
            name: _user?.name,
            profile_url: _user?.profile_url,
          })
        );
        localStorage.setItem("isInstructor", JSON.stringify(false));
        localStorage.setItem("isUserPro", JSON.stringify(false));
        sendToUrl("/classroom?subject=physics&chapter=class_9_learn_science_physics_sound");
      }, 2000);

      setTimeout(() => setOpenFreeTrial(true), 6000);
    } else {
      showSnackbar("Some error occured, please try again", "error");
    }
  };

  const signInExistingPhoneFn = async (
    nextTab,
    phone_number,
    phone_country_code
  ) => {
    if (phone_number.length > 5) {
      await signInWithPhone(
        phone_number,
        phone_country_code,
        setActiveTab,
        nextTab,
        setSendingOtp,
        setPhoneNumberError,
        tempEmailUserData,
        setTempEmailUserData,
        setPhoneRoute,
        setPhoneExists
      );
      setExistingPhone(phone_number);
      setTimeout(() => setSocialProcessStarted([false, false, false]), 3000);
    } else {
      setPhoneNumberError("Invalid phone number");
      setSocialProcessStarted([false, false, false]);

      setTimeout(() => setPhoneNumberError(""), 6000);
    }
  };

  const handleLoginAfterEmailExist = async () => {
    setPhoneNumberError(null);
    setSocialProcessStarted([false, false, false]);
    setPhoneRoute(true);
    setActiveTab(0);
    if(tempPhoneUserData) {
      const uid = tempPhoneUserData?.uid
      tempPhoneUserData.delete();
      setTempPhoneUserData(null);
      const deleteUser = require('../firebase-config').functions.httpsCallable('deleteUser');
      deleteUser({
        uid
      });
      // console.log('response from deleteUser cloud function - ', response);
    }
  }

  const handleLoginAfterPhoneExist = async () => {
    setPhoneNumberError(null);
    setSendingOtp(true);
    if(tempEmailUserData?.uid) {
      const uid = tempEmailUserData?.uid
      tempEmailUserData.delete();
      setTempEmailUserData(null);
      const deleteUser = require('../firebase-config').functions.httpsCallable('deleteUser');
      const response = await deleteUser({
        uid
      });
      console.log('response from deleteUser cloud function - ', response);
    }
    setPhoneRoute(true);
    await signInPhoneFn(1, null, true);
    setSendingOtp(false);

  }

  const signInPhoneFn = async (nextTab, isExisting, isLoggingIn) => {
    let phNum = phoneNumber;
    setSendingOtp(true);
    setAccountExists(false);
    if(isExisting) {
      phNum = existingPhone;
    } else {
      console.log('tempEmailUserData = ', tempEmailUserData, phNum);
      // if(tempEmailUserData && !isLoggingIn) {
      //   const isPhoneExist = require('../firebase-config').functions.httpsCallable('checkIfPhoneExists');
      //   const response = await isPhoneExist({
      //     phone_number: '+' + phNum
      //   });
      //   if(response.data) {
      //     console.log('Already exists');
      //     setPhoneNumberError(ALREADY_EXIST_PHONE_LOGIN_CODE);
      //     setSendingOtp(false)
      //     return setSocialProcessStarted([false, false, false]);
      //   }
      // }
    }
    if (phNum.length > 6) {
      setExistingPhone(phNum);
      await signInWithPhone(
        phNum,
        countryCode,
        setActiveTab,
        nextTab,
        setSendingOtp,
        setPhoneNumberError,
        isLoggingIn ? null : tempEmailUserData,
        setTempEmailUserData,
        setPhoneRoute,
        setPhoneExists
      );
    } else {
      setPhoneNumberError("Invalid phone number");
      setSocialProcessStarted([false, false, false]);
      setSendingOtp(false);

      setTimeout(() => setPhoneNumberError(""), 6000);
    }
  };

  useEffect(() => {
    setIsIpad(navigator.userAgent.match(/iPad/i) !== null);
  }, [])

  useEffect(() => {
    if (processStarted) {
      navigator.vibrate(10);
    }
  }, [activeTab]);

  // useEffect(() => {
  //   if (existingAccountError) {
  //     setOtpCode(Array(6).fill(""));
  //     setOtpError(false);
  //     setOtpErrorMsg("");
  //
  //     onSignInWithGoogleBtnClick();
  //   }
  // }, [existingAccountError]);

  useEffect(() => {
    if (gmailExists && googleMailAddress && facebookPendingCredentials) {
      setEmailError(
        "The credentials are already linked with your other account"
      );
      setTimeout(() => {
        setEmailError("");
        setPhoneNumberError("");
        facebookPendingCredentials === "no-credentials"
          ? onSignInWithFacebookBtnClick()
          : onSignInWithGoogleBtnClick();
      }, 4000);
    }
  }, [gmailExists, googleMailAddress, facebookPendingCredentials]);

  const handleAuth = useCallback(async (data) => {
    setActiveTab(3);

    let _user = {
      ...data,
      grade: null,
      phone_number: phoneNumber.replace("+", "").slice(countryCode?.length),
      phone_country_code: countryCode,
      source: "web " + packageInfo.version,
    };
    setTempUserData(_user);

    await uploadFinalUserInfo(_user?.uid, _user);

    setTimeout(() => setProcessStarted(false), 200);
  }, [phoneNumber, countryCode])

  // When user has taken phone route, and links facebook with the phone number, the fb account doesn't has an email associated with it, then trigger this function

  const submitGoogleEmailFn = () => {
    submit(
      require('../firebase-config').googleProvider,
      tempPhoneUserData,
      setPhoneNumberError,
      setSocialProcessStarted,
      setExistingAccountError,
      handleAuth,
      setData,
    ).then();
  };

  const Views = (
    <SwipeableViews
      axis={"x"}
      index={activeTab}
      onChangeIndex={(e) => setActiveTab(e)}
      scrolling={"false"}
      className="swipeable__onboarding"
      containerStyle={{ background: "#161616", width: "700px" }}
      style={{ background: "#161616" }}
      slideStyle={{ background: "#161616" }}
      disabled={true}
      ignoreNativeScroll={true}
    >
      {/* page 0*/}

      <div className="slide__page">
        <div className="first__page__inner">
          <div className="top__area" />
          <div className="plan__success">
            <Image src={logoDark} alt="logo" />
            <h6>
              Learning made simple. <span>Aasaan hai!</span>
            </h6>
          </div>
          <div className="snippet__video">
            <Image style={{width: '100%', position: 'absolute', display: 'block'}} src={snipperFirstFrame} alt=""/>
            <video
              onCanPlay={() => {
                setCanPlay(true);
              }}
              style={{width: '100%', position: 'relative', zIndex: 2, display: canPlay ? 'block' : 'none'}}
              src="https://d1kjns6e6wnqfd.cloudfront.net/snippet2.mp4"
              autoPlay={isOpen && activeTab === 0}
              loop={isOpen && activeTab === 0}
              playsInline
              muted
              key={isOpen}
            />
          </div>
          <div className="registration__page">
            <div className="phone__number">
              <div ref={(ref) => (recaptchaRef = ref)}>
                <div id="recaptcha-container" className="recaptcha" />
              </div>

              <div
                onMouseLeave={() => {
                  !localStorage.getItem("closeInstallApp") &&
                  setCloseInstallApp(false);
                  setPushDown(false);
                }}
              >
                <PhoneInput
                  country="in"
                  value={phoneNumber}
                  isValid={(_, country) => {
                    setCountryCode(country.dialCode);
                    return true;
                  }}
                  onChange={(phone) => {
                    setPhoneNumber("+" + phone);
                    setPhoneNumberError("");
                  }}
                  placeholder="+91 XXXXX-XXXXX"
                  preferredCountries={["us", "ae", "sg", "my", "in"]}
                  inputProps={{ autoFocus: true }}
                  onClick={() => {
                    setCloseInstallApp(true);
                    // setPushDown(true);
                  }}
                  onEnterKeyPress={() => {
                    if (!sendingOtp) {
                      setPhoneRoute(true);
                      signInPhoneFn(1);
                    }
                  }}
                />

                {phoneNumberError && (
                  <div className="phone__error__message">
                    <ErrorOutlineIcon />
                    {phoneNumberError}
                  </div>
                )}
              </div>
              <button
                id="sign-in-with-phone"
                onClick={async () => {

                  await require('../firebase-config').auth.signOut();
                  if (!sendingOtp) {
                    setPhoneRoute(true);
                    signInPhoneFn(1);
                  }
                }}
              >
                {sendingOtp ? (
                  <Lottie
                    options={{ animationData: circularProgress, loop: true }}
                  />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
            <div className="or__line" style={{ display: pushDown && "none" }}>
              <h6></h6>
              <h5>OR</h5>
              <h6></h6>
            </div>
            {isAppleDevice && <div className="signin__apple">
              <button
                onClick={() => {
                  if (socialProcessStarted.every((item) => !item)) {
                    // setPhoneRoute(false);
                    setSocialProcessStarted([false, false, true]);
                    onSignInWithAppleBtnClick();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Apple} draggable={false} alt="apple icon"/>
                {socialProcessStarted[2] ? (
                  <Lottie
                    options={{animationData: circularProgress, loop: true}}
                  />
                ) : (
                  <h6>Continue with Apple</h6>
                )}
              </button>
            </div>}
            <div
              className="social__buttons"
              style={{ display: pushDown && "none" }}
            >
              <button
                className="facebook"
                onClick={async () => {
                  await require('../firebase-config').auth.signOut();
                  if (socialProcessStarted.every((item) => !item)) {
                    // setPhoneRoute(false);
                    phoneRouteRef.current = false;
                    setPhoneNumber('+91');
                    setCountryCode('');
                    setSocialProcessStarted([true, false, false]);
                    onSignInWithFacebookBtnClick();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Facebook2} draggable={false} alt="facebook icon" />
                {socialProcessStarted[0] ? (
                  <Lottie
                    options={{ animationData: circularProgress, loop: true }}
                  />
                ) : (
                  <h6>Facebook</h6>
                )}
              </button>
              <button
                className="google"
                onClick={async () => {
                  await require('../firebase-config').auth.signOut();
                  if (socialProcessStarted.every((item) => !item)) {
                    // setPhoneRoute(false);
                    phoneRouteRef.current = false;
                    setPhoneNumber('+91');
                    setCountryCode('');
                    setSocialProcessStarted([false, true, false]);
                    onSignInWithGoogleBtnClick();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Google} draggable={false} alt="google icon" />
                {socialProcessStarted[1] ? (
                  <Lottie
                    options={{ animationData: circularProgress, loop: true }}
                  />
                ) : (
                  <h6>Google</h6>
                )}
              </button>
            </div>
            <div className="agreements" style={{ display: pushDown && "none" }}>
              <h6>Having trouble?</h6>
              <div>
                <h5>
                  Reach us at{" "}
                  <a
                    href="mailto:help@pustack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    help@pustack.com
                  </a>
                </h5>
              </div>
            </div>
          </div>

          {emailError && (
            <div className="error__message fadeIn">{emailError}</div>
          )}

          {/*<Dialog*/}
          {/*  open={showPDF}*/}
          {/*  onClose={() => {*/}
          {/*    setShowPDF(false);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {showPDF && (*/}
          {/*    <PdfPreview*/}
          {/*      pdf={documentToShow}*/}
          {/*      onClose={() => {*/}
          {/*        setShowPDF(false);*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</Dialog>*/}
        </div>
      </div>

      {/* page 1*/}
      {phoneRoute ? (
        <div className="slide__page">
          <div className="second__page__inner">
            <div className="top__area">
              <div>
                <button
                  onClick={() => {
                    setTimeout(() => setActiveTab(0), 250);
                    setOtpCode(Array(6).fill(""));
                    setOtpError(false);
                    setOtpErrorMsg("");
                    setSocialProcessStarted([false, false, false]);
                    setPhoneNumber("+91");
                    setExistingPhone("");
                    setPhoneExists(false);
                    setStepsAllowed([0]);
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <h6>My OTP is</h6>
              </div>
              {launchRocket && (
                <div className="launch__lottie">
                  <Lottie options={{ loop: true, animationData: launch }} />
                </div>
              )}
              <button className="checking__otp">
                {!launchRocket && checkingOtp && (
                  <Lottie
                    options={{ animationData: circularProgress, loop: true }}
                  />
                )}
              </button>
              {allowNext && (
                <button onClick={() => setTimeout(() => setActiveTab(2), 250)}>
                  <ArrowForwardIcon />
                </button>
              )}
            </div>

            <div className={otpError ? "otp__input otp__error" : "otp__input"}>
              {phoneExists && (
                <h5 className="already__exists">Account already exists.</h5>
              )}
              {existingPhone.length > 6 && (
                <h5 className="sent__to">
                  Verification code sent to{" "}
                  {"X".repeat(existingPhone.length - 5) +
                    existingPhone.slice(
                      existingPhone.length - 4,
                      existingPhone.length
                    )}
                </h5>
              )}
              <div>
                <div>ƒ
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        <input
                          name={`input${i}`}
                          type="tel"
                          value={otpCode[i]}
                          maxLength={1}
                          autoFocus={i === 0 && activeTab === 1}
                          autoComplete="off"
                          onChange={(e) => handleOTPChange(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <h6>
                <WarningRoundedIcon /> {otpErrorMsg}
              </h6>
            </div>
            <div className="planets__wrapper">
              {planetsArray.map((planet, i) => (
                <Image
                  key={i}
                  alt={`planet${i + 1}`}
                  className={`planet${i + 1}${
                    otpCode[i]?.length > 0 ? handMovementClasses[i + 1] : ""
                  }`}
                  src={planet}
                  draggable={false}
                />
              ))}
            </div>
            <div className="enter__code">
              <Image
                alt="code-vault"
                className="code"
                src={phoneVerification}
                draggable={false}
              />
              <h6 className={`tapBg ${handMovementClasses[lastInput]}`}></h6>
              <Image
                alt="phoneVerificationHand"
                className={`hand ${handMovementClasses[lastInput]}`}
                src={phoneVerificationHand}
                draggable={false}
              />

              <Image
                src={planetEarth}
                className="earth"
                alt="planetEarth"
                draggable={false}
              />

              <div
                className={resendCode ? "resend__code grey" : "resend__code"}
              >
                {activeTab === 1 && (
                  <Timer
                    initialTime={30100}
                    direction="backward"
                    checkpoints={[
                      { time: 1500, callback: () => setPlural(false) },
                      { time: 1100, callback: () => setResendCode(false) },
                    ]}
                  >
                    {({ start, reset }) => (
                      <>
                        <h4
                          onClick={() => {
                            if (!resendCode) {
                              setPlural(true);
                              reset();
                              start();
                              setResendCode(true);
                              signInPhoneFn(1);
                            }
                          }}
                        >
                          Resend Code{resendCode ? "?" : ""}
                        </h4>

                        {resendCode ? (
                          <h6>
                            Tap resend in <Timer.Seconds />{" "}
                            {plural ? "seconds" : "second"}
                          </h6>
                        ) : (
                          <h6
                            onClick={() => {
                              if (!resendCode) {
                                setPlural(true);
                                reset();
                                start();
                                setResendCode(true);
                                signInPhoneFn(1);
                              }
                            }}
                          >
                            Tap here
                          </h6>
                        )}
                      </>
                    )}
                  </Timer>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !processStarted && (
          <div className="slide__page">
            <div className="third__page__inner">
              <div className="stars__background">
                <div className="stars" />
                <div className="twinkling" />
              </div>
              <div className="top__area">
                <div>
                  <button
                    onClick={() => {
                      setActiveTab(0);
                      setOtpCode(Array(6).fill(""));
                      setOtpError(false);
                      setOtpErrorMsg("");
                      setSocialProcessStarted([false, false, false]);
                      setPhoneNumber("+91");
                      setExistingPhone("");
                      setPhoneExists(false);
                      setAccountExists(false);
                      setStepsAllowed([0]);

                      if (tempEmailUserData) {
                        tempEmailUserData.delete();
                        deleteUserFromDatabase(tempEmailUserData?.uid);
                      }
                      setTempEmailUserData(null);
                    }}
                  >
                    <ArrowBackIosIcon />
                  </button>
                  <h6>My phone number is</h6>
                </div>

                {sendingOtp ? (
                  <button className="sending__otp">
                    <Lottie
                      options={{
                        animationData: circularProgress,
                        loop: true,
                      }}
                    />
                  </button>
                ) : (
                  <button onClick={() => !sendingOtp && signInPhoneFn(2)}>
                    <ArrowForwardIcon />
                  </button>
                )}
              </div>
              <div className="phone__input">
                <div ref={(ref) => (recaptchaRef = ref)}>
                  <div id="recaptcha-container" className="recaptcha" />
                </div>

                <div>
                  <PhoneInput
                    country="in"
                    value={phoneNumber}
                    isValid={(_, country) => {
                      setCountryCode(country.dialCode);
                      return true;
                    }}
                    onChange={(phone) => {
                      setPhoneNumber("+" + phone);
                      setPhoneNumberError("");
                    }}
                    placeholder="Enter your phone number here"
                    preferredCountries={["us", "ae", "sg", "my", "in"]}
                    inputProps={{ autoFocus: true }}
                  />
                  {accountExists && <h6 style={{color: 'gold', fontSize: '15px', margin: '20px 0 0px', paddingTop: 0}}>Account already exists. Let's
                    sign you in.</h6>}
                  <h6>We will send a text with verification code.</h6>
                  <h6>Message or data rates may apply.</h6>
                </div>
              </div>
              <div className="astronaut__lottie">
                <Lottie options={{ loop: true, animationData: astronaut }} />
              </div>
              <Image src={phone} alt="phone" className="phone__social" />

              {phoneNumberError && (
                <div className="error__message fadeIn">
                  {phoneNumberError === ALREADY_EXIST_PHONE_LOGIN_CODE ? <p>Account already exist with the phone number. Want to <span style={{cursor: 'pointer', color: 'dodgerblue'}} onClick={handleLoginAfterPhoneExist}>Login</span>?</p> : phoneNumberError}
                </div>
              )}

              <div className="agreements">
                <h6>By continuing, you agree to our</h6>
                <div>
                  <h5
                    onClick={handleOpenRoute('/terms_of_service')}
                  >
                    Terms of Service
                  </h5>{" "}
                  <h5
                    onClick={handleOpenRoute('/privacy_policy')}
                  >
                    Privacy Policy
                  </h5>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* page 2*/}
      {phoneRoute ? (
        <div className="slide__page">
          <div className="third__page__inner">
            <div className="stars__background">
              <div className="stars" />
              <div className="twinkling" />
            </div>
            <div className="top__area third__page">
              <button
                onClick={() =>
                  setTimeout(() => {
                    setActiveTab(0);
                    setOtpCode(Array(6).fill(""));
                    setOtpError(false);
                    setOtpErrorMsg("");
                    setSocialProcessStarted([false, false, false]);
                    tempPhoneUserData && tempPhoneUserData.delete();
                    setTempPhoneUserData(null);
                    setStepsAllowed([0]);
                  })
                }
              >
                <ArrowBackIosIcon />
              </button>
              <h6>I want to connect my</h6>
            </div>
            <div className="social__accounts">
              <button
                className="google"
                onClick={() => {
                  if (socialProcessStarted.every((k) => k === false)) {
                    setSocialProcessStarted([false, true, false]);
                    submit(
                      require('../firebase-config').googleProvider,
                      tempPhoneUserData,
                      setPhoneNumberError,
                      setSocialProcessStarted,
                      setExistingAccountError,
                      handleAuth,
                      setData,
                    ).then();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Google} draggable={false} alt="g" />
                <h6>
                  CONTINUE WITH GOOGLE{" "}
                  {socialProcessStarted[1] && (
                    <Lottie
                      options={{
                        animationData: circularProgress,
                        loop: true,
                      }}
                    />
                  )}
                </h6>
              </button>
              <button
                className="facebook"
                onClick={() => {
                  if (socialProcessStarted.every((item) => item === false)) {
                    setSocialProcessStarted([true, false, false]);
                    submit(
                      require('../firebase-config').facebookProvider,
                      tempPhoneUserData,
                      setPhoneNumberError,
                      setSocialProcessStarted,
                      setExistingAccountError,
                      handleAuth,
                      setData,
                      submitGoogleEmailFn
                    ).then();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Facebook} draggable={false} alt="fb" />
                <h6>
                  CONTINUE WITH FACEBOOK
                  {socialProcessStarted[0] && (
                    <Lottie
                      options={{
                        animationData: circularProgress,
                        loop: true,
                      }}
                    />
                  )}
                </h6>
              </button>
              {isAppleDevice && <button
                className="apple"
                onClick={() => {
                  if (socialProcessStarted.every((item) => item === false)) {
                    setSocialProcessStarted([false, false, true]);
                    submit(
                      require('../firebase-config').appleProvider,
                      tempPhoneUserData,
                      setPhoneNumberError,
                      setSocialProcessStarted,
                      setExistingAccountError,
                      handleAuth,
                      setData
                    ).then();
                  } else {
                    setEmailError("One Process has already started");
                    setTimeout(() => setEmailError(""), 4000);
                  }
                }}
              >
                <Image src={Apple} draggable={false} alt="fb"/>
                <h6>
                  CONTINUE WITH APPLE
                  {socialProcessStarted[2] && (
                    <Lottie
                      options={{
                        animationData: circularProgress,
                        loop: true,
                      }}
                    />
                  )}
                </h6>
              </button>}
            </div>
            <div className="astronaut__lottie">
              <Lottie options={{ loop: true, animationData: astronaut }} />
            </div>
            <Image
              src={phoneSocial}
              alt="phoneSocial"
              className="phone__social"
            />
            {phoneNumberError && (
              <div className="error__message fadeIn">{phoneNumberError === ALREADY_EXIST_EMAIL_LOGIN_CODE ? <p>Account with the email exists. Want to <span style={{cursor: 'pointer', color: 'dodgerblue'}} onClick={handleLoginAfterEmailExist}>Login</span>?</p> : phoneNumberError}</div>
            )}

            <div className="agreements">
              <h6>By continuing, you agree to our</h6>
              <div>
                <h5
                  onClick={handleOpenRoute('/terms_of_service')}
                >
                  Terms of Service
                </h5>{" "}
                <h5
                  onClick={handleOpenRoute('/privacy_policy')}
                >
                  Privacy Policy
                </h5>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="slide__page">
          <div
            className={`second__page__inner ${!phoneRoute && isOpen && "slideInLeft"}`}
          >
            <div className="top__area">
              <div>
                <button
                  onClick={() => {
                    setActiveTab(0);
                    setOtpCode(Array(6).fill(""));
                    setOtpError(false);
                    setOtpErrorMsg("");
                    setSocialProcessStarted([false, false, false]);
                    setPhoneNumber("+91");
                    setExistingPhone("");
                    setPhoneExists(false);
                    setStepsAllowed([0]);
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <h6>My OTP is</h6>
              </div>

              {launchRocket && (
                <div className="launch__lottie">
                  <Lottie options={{ loop: true, animationData: launch }} />
                </div>
              )}

              <button className="checking__otp">
                {checkingOtp && (
                  <Lottie
                    options={{ animationData: circularProgress, loop: true }}
                  />
                )}
              </button>
            </div>

            <div className={otpError ? "otp__input otp__error" : "otp__input"}>
              {phoneExists && (
                <h5 className="already__exists">Account already exists.</h5>
              )}
              {existingPhone.length > 5 && (
                <h5 className="sent__to">
                  Verification code sent to{" "}
                  {"X".repeat(existingPhone.length - 4) +
                    existingPhone.slice(
                      existingPhone.length - 4,
                      existingPhone.length
                    )}
                </h5>
              )}

              <div>
                <div>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        <input
                          name={`input${i}`}
                          type="tel"
                          value={otpCode[i]}
                          maxLength={1}
                          autoFocus={i === 0 && activeTab === 1}
                          autoComplete="off"
                          onChange={(e) => handleOTPChange(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <h6>
                <WarningRoundedIcon /> {otpErrorMsg}
              </h6>
            </div>
            <div className="planets__wrapper">
              {planetsArray.map((planet, i) => (
                <Image
                  key={i}
                  alt={`planet${i + 1}`}
                  className={`planet${i + 1}${
                    otpCode[i]?.length > 0 ? handMovementClasses[i + 1] : ""
                  }`}
                  src={planet}
                  draggable={false}
                />
              ))}
            </div>
            <div className="enter__code">
              <Image
                alt="code-vault"
                className="code"
                src={phoneVerification}
                draggable={false}
              />
              <h6 className={`tapBg ${handMovementClasses[lastInput]}`}></h6>
              <Image
                alt="phoneVerificationHand"
                className={`hand ${handMovementClasses[lastInput]}`}
                src={phoneVerificationHand}
                draggable={false}
              />

              <Image
                src={planetEarth}
                className="earth"
                alt="planetEarth"
                draggable={false}
              />

              <div
                className={resendCode ? "resend__code grey" : "resend__code"}
              >
                {activeTab === 2 && (
                  <Timer
                    initialTime={30100}
                    direction="backward"
                    checkpoints={[
                      { time: 1500, callback: () => setPlural(false) },
                      { time: 1100, callback: () => setResendCode(false) },
                    ]}
                  >
                    {({ start, reset }) => (
                      <>
                        <h4
                          onClick={() => {
                            if (!resendCode) {
                              setPlural(true);
                              reset();
                              start();
                              setResendCode(true);
                              signInPhoneFn(2);
                            }
                          }}
                        >
                          Resend Code{resendCode ? "?" : ""}
                        </h4>

                        {resendCode ? (
                          <h6>
                            Tap resend in <Timer.Seconds />{" "}
                            {plural ? "seconds" : "second"}
                          </h6>
                        ) : (
                          <h6
                            onClick={() => {
                              if (!resendCode) {
                                setPlural(true);
                                reset();
                                start();
                                setResendCode(true);
                                signInPhoneFn(2);
                              }
                            }}
                          >
                            Tap here
                          </h6>
                        )}
                      </>
                    )}
                  </Timer>
                )}
              </div>
            </div>
            {phoneNumberError && (
              <div className="error__message fadeIn">{phoneNumberError}</div>
            )}
          </div>
        </div>
      )}
      {/* page 3*/}
      <div className="slide__page">
        <div className="fourth__page__inner">
          <div className="stars__background">
            <div className="stars"></div>
            <div className="twinkling"></div>
          </div>

          <div className="top__area">
            <h6>I study in</h6>
          </div>
          <div className="select__classes">
            {getAvailableGrades(null, true, isProduction).map(({ planet, grade, enableToSelect, value }) => (
              <div className={"class__item" + ((isProduction ? enableToSelect : true) ? '' : ' disabled') + (activeUserGrade === value ? ' active' : activeUserGrade ? ' not-active' : '')} onClick={() => {
                if(isProduction ? enableToSelect : true) setUserGrade(value);
              }} key={value}>
                <Image src={planet} alt="planet2" draggable={false} />
                <h6>{grade}</h6>
              </div>
            ))}
            {/*[*/}
            {/*// { planet: planet1, grade: "Class 2", value: "class_2" },*/}
            {/*{ planet: planet4, grade: "Class 9", value: "class_9" },*/}
            {/*{ planet: planet6, grade: "Class 10", value: "class_10" },*/}
            {/*]*/}
          </div>

          <Image src={comet} alt="comet" className="comet" />
          <Image src={comet} alt="comet2" className="comet2" />

          <Image src={gulu} alt="gulu" className="gulu" draggable={false} />
          <Image src={mars} alt="mars" className="mars" draggable={false} />
          <Image
            src={controlRoom}
            alt="control"
            className="control"
            draggable={false}
          />
        </div>
      </div>
    </SwipeableViews>
  )

  return (isSmallScreen ? Views :
    <Drawer
      variant="temporary"
      className="onboarding__slider"
      open={isOpen}
      // open={true}
      anchor={isSmallScreen ? (isiPad ? "right" : "bottom") : "right"}
      disableBackdropClick={activeTab > 0 || processStarted}
      disableEscapeKeyDown={activeTab > 0 || processStarted}
      onClose={handleSliderClose}
      ModalProps={{ keepMounted: true }}
      BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.75)" } }}
    >
      {Views}
    </Drawer>)
}
