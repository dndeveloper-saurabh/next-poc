import { deleteUserFromDatabase } from "../../database";
import firebase from "firebase/app";
import {
  db,
  auth,
  googleProvider,
  appleProvider,
  facebookProvider, functions,
} from "../../firebase-config";
import {castIndianTime} from "../../helpers";
import {ALREADY_EXIST_EMAIL_LOGIN_CODE} from "../../helpers/constants";

export const signInWithGoogle = async (
  facebookPendingCredentials,
  googleMailAddress
) => {
  let user;
  await auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      user = res.user;

      if (
        facebookPendingCredentials &&
        googleMailAddress === res.user.email &&
        facebookPendingCredentials !== "no-credentials"
      ) {
        res.user.linkWithCredential(facebookPendingCredentials);
      }
    })
    .catch((_) => (user = null));

  return user;
};

export const submitGoogleEmail = async (
  userData,
  setActiveTab,
  activeTab,
  setTempUserData,
  setPhoneNumberError,
  setSocialProcessStarted,
  setExistingAccountError,
  setProcessStarted,
  handleAuth,
  setData
) => {
  try {
    // logged-in user with the phone
    const prevUser = auth.currentUser;

    // logging in with the GOOGLE provider
    const res = await auth.signInWithPopup(googleProvider)

    // If the email account does not have the phone number attached to it, irrespective if it exists or not.
    if(res.user.phoneNumber === null) {
      let time_now = await castIndianTime();
      let displayName = "";
      let photoURL = "";
      const email = res.user?.email;
      const uidToDelete = res.user?.uid;

      let dataArray = res.user.providerData;

      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i]?.displayName) {
          displayName = dataArray[i]?.displayName;
        }
        if (dataArray[i]?.displayName) {
          photoURL = dataArray[i]?.photoURL;
        }
      }

      // Deleting the email user
      await res.user.delete();

      // Deleting the email user using the cloud function
      await deleteUserFn(uidToDelete);

      // Linking the email account to the user signed in with the phone
      // It will not throw the error 'already-exist/or similar' as we have deleted the existed email user
      await prevUser.linkWithCredential(res.credential);

      // And then logging back to the account(phone-number one) as the logged-in email account has been deleted.
      await auth.signInWithCredential(res.credential);

      let data = {
        app_rating: null,
        app_rating_history: [],
        email,
        grade: null,
        has_rated_app: false,
        is_instructor: false,
        name: displayName,
        pro_expiration_date: null,
        profile_url: photoURL,
        role: "Student",
        sign_up_ts: +time_now,
        tier: "free",
        uid: prevUser?.uid,
      };

      // Now, updating the firebase document with the user id.
      handleAuth(data);
    } else {
      setData(res.user);
    }
  } catch (e) {
    console.log('e - ', e);
  }

  // userData
  //   .linkWithPopup(googleProvider)
  //   .then(async (res) => {
  //     let time_now = await castIndianTime();
  //     let displayName = "";
  //     let photoURL = "";
  //
  //     let dataArray = res.user.providerData;
  //
  //     for (let i = 0; i < dataArray.length; i++) {
  //       if (dataArray[i]?.displayName) {
  //         displayName = dataArray[i]?.displayName;
  //       }
  //       if (dataArray[i]?.displayName) {
  //         photoURL = dataArray[i]?.photoURL;
  //       }
  //     }
  //
  //     let data = {
  //       app_rating: null,
  //       app_rating_history: [],
  //       email: res.user?.email,
  //       grade: null,
  //       has_rated_app: false,
  //       is_instructor: false,
  //       name: displayName,
  //       pro_expiration_date: null,
  //       profile_url: photoURL,
  //       role: "Student",
  //       sign_up_ts: +time_now,
  //       tier: "free",
  //       uid: res.user?.uid,
  //     };
  //     console.log('handlingAuth here - ');

  // handleAuth(data);


  // setTempUserData({ ...data });
  // console.log('activeTab - ', activeTab);
  // setActiveTab(activeTab + 1);
  // setTimeout(() => setProcessStarted(false), 200);
  //   })
  //   .catch(async (error) => {
  //     console.log('error - ', error, userData, auth.currentUser);
  //     if (
  //       error.code === "auth/credential-already-in-use" ||
  //       error.code === "auth/email-already-in-use"
  //     ) {
  //       // userData.delete();
  //       // setExistingAccountError(error);
  //       setSocialProcessStarted([false, false, false]);
  //       return setPhoneNumberError(ALREADY_EXIST_EMAIL_LOGIN_CODE)
  //       // return;
  //     }
  //     setPhoneNumberError(error.message);
  //     setSocialProcessStarted([false, false, false]);
  //   });
};

export const signInWithApple = async () => {
  let user;
  appleProvider.addScope("email");
  appleProvider.addScope("name");

  await auth
    .signInWithPopup(appleProvider)
    .then((res) => (user = res.user))
    .catch((error) => {
      user = null;
    });

  return user;
};

export const deleteUserFn = (uid) => {
  const deleteUser = functions.httpsCallable('deleteUser');
  return deleteUser({
    uid
  });
}

export const signInWithFacebook = async (
  setSocialProcessStarted,
  setGmailExists,
  setGoogleMailAddress,
  setFacebookPendingCredentials
) => {
  let user;

  auth.useDeviceLanguage();

  await auth
    .signInWithPopup(facebookProvider)
    .then(function (result) {
      user = result.user;
    })
    .catch(function (error) {
      user = null;

      if (error.code === "auth/account-exists-with-different-credential") {
        setGoogleMailAddress(error.email);
        setFacebookPendingCredentials(error.credential);
        setGmailExists(true);
      }

      setSocialProcessStarted([false, false, false]);
    });

  return user;
};

export const linkFacebookWithGmail = (email, onSignInWithGoogleBtnClick) => {
  auth
    .fetchSignInMethodsForEmail(email)
    .then((methods) => {})
    .catch((err) => console.log(err));
};

export const submitFacebook = (
  userData,
  setActiveTab,
  activeTab,
  setTempUserData,
  setPhoneNumberError,
  setSocialProcessStarted,
  setGmailExists,
  //catch error
  setGoogleMailAddress,
  setFacebookPendingCredentials,
  submitGoogleEmailFn,
  handleAuth
) => {
  userData
    .linkWithPopup(facebookProvider)
    .then(async (res) => {
      let time_now = await castIndianTime();
      let displayName = "";
      let photoURL = "";

      let dataArray = res.user.providerData;

      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i]?.displayName) {
          displayName = dataArray[i]?.displayName;
        }
        if (dataArray[i]?.displayName) {
          photoURL = dataArray[i]?.photoURL;
        }
      }

      if (!res.user?.email) {
        setPhoneNumberError("The facebook account doesn't have an email");
        setSocialProcessStarted([false, false, false]);
        setTimeout(() => {
          setPhoneNumberError("");
          submitGoogleEmailFn();
        }, 2000);
        return;
      }

      let data = {
        app_rating: null,
        app_rating_history: [],
        email: res.user?.email,
        grade: null,
        has_rated_app: false,
        is_instructor: false,
        name: displayName,
        pro_expiration_date: null,
        profile_url: photoURL,
        role: "Student",
        sign_up_ts: +time_now,
        tier: "free",
        uid: res.user?.uid,
      };

      handleAuth(data);

      // setTempUserData({ ...data });
      // setActiveTab(activeTab + 1);
    })
    .catch(async (error) => {
      if (error.code === "auth/email-already-in-use") {
        userData.delete();

        setGmailExists(true);
        setGoogleMailAddress(error.email);
        setFacebookPendingCredentials(error.credential);
      }

      if (error.code === "auth/credential-already-in-use") {
        userData.delete();

        setGmailExists(true);
        setGoogleMailAddress(error.email);
        setFacebookPendingCredentials("no-credentials");
      }
      setPhoneNumberError(error.message);
      setSocialProcessStarted([false, false, false]);
    });
};

export const signInWithPhone = async (
  phoneNumber,
  countryCode,
  setActiveTab,
  tab = 1,
  setSendingOtp,
  setPhoneNumberError,
  tempEmailUserData,
  setTempEmailUserData,
  setPhoneRoute,
  setPhoneExists,
  cb = () => {}
) => {
  auth.useDeviceLanguage();

  // const phoneExists = await checkIfPhoneNumberExists(
  //   countryCode ? phoneNumber.slice(countryCode?.length + 1) : phoneNumber
  // );

  if (tempEmailUserData?.phoneNumber === null) {
    await submitPhoneNumber(
      phoneNumber,
      setActiveTab,
      tab,
      setSendingOtp,
      setPhoneNumberError,
      cb
    );
    // tempEmailUserData
    //   .linkWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    //   .then((confirmationResult) => {
    //     window.confirmationResult = confirmationResult;
    //
    //     setSendingOtp(false);
    //
    //     setTimeout(() => setActiveTab(tab), 100);
    //     cb();
    //   })
    //   .catch((error) => {
    //     if (error?.code === "auth/invalid-phone-number") {
    //       setPhoneNumberError("Invalid Phone Number");
    //     } else {
    //       setPhoneNumberError(error?.message);
    //     }
    //
    //     setSendingOtp(false);
    //     setTimeout(() => setPhoneNumberError(""), 5000);
    //   });
  } else {
    if (tempEmailUserData) {
      tempEmailUserData.delete();
      deleteUserFromDatabase(tempEmailUserData?.uid);
      setTempEmailUserData(null);
      setPhoneExists(true);
      setPhoneRoute(true);

      await new Promise(res => setTimeout(res, 1000));

      await submitPhoneNumber(
        phoneNumber,
        setActiveTab,
        -1,
        setSendingOtp,
        setPhoneNumberError,
        cb
      );

    } else {
      console.log('coming from here');
      setPhoneRoute(true);

      await submitPhoneNumber(
        phoneNumber,
        setActiveTab,
        tab,
        setSendingOtp,
        setPhoneNumberError,
        cb
      );
    }
  }
};

const submitPhoneNumber = async (
  phoneNumber,
  setActiveTab,
  tab,
  setSendingOtp,
  setPhoneNumberError,
  cb = () => {}
) => {
  const appVerifier = window.recaptchaVerifier;

  await auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log('coming here');
      window.confirmationResult = confirmationResult;

      setSendingOtp(false);

      if(tab >= 0) setTimeout(() => setActiveTab(tab), 100);
      cb();
    })
    .catch((error) => {
      if (error?.code === "auth/invalid-phone-number") {
        setPhoneNumberError("Invalid Phone Number");
      } else {
        setPhoneNumberError(error?.message);
      }

      setSendingOtp(false);
      setTimeout(() => setPhoneNumberError(""), 5000);
    });
};

export const submitPhoneNumberAuthCode = async (
  code,
  facebookPendingCredentials,
  googleMailAddress,
  updatePhone = false,
) => {
  const otpConfirm = window.confirmationResult;

  if (updatePhone) {
    return auth.currentUser
      .updatePhoneNumber(
        firebase.auth.PhoneAuthProvider.credential(
          otpConfirm.verificationId,
          code
        )
      )
      .then(() => [null, true, ""])
      .catch((err) => {
        console.log('err - ', err);
        return [null, false, err.message]
      });
  }

  const credential = firebase.auth.PhoneAuthProvider.credential(
    otpConfirm.verificationId,
    code
  );
  // firebase.auth.PhoneAuthProvider.

  const prevUser = auth.currentUser;

  // console.log('auth.currentUser - ', auth.currentUser, credential);

  return await otpConfirm
    ?.confirm(code)
    .then(async (result) => {
      console.log('result -', result);
      let user = result.user;

      if(user.email === null && prevUser?.phoneNumber === null) {
        const uidToDelete = user.uid;
        await user.delete();
        await deleteUserFn(uidToDelete);
        await prevUser.linkWithCredential(credential);
        await auth.signInWithCredential(credential);
        user = prevUser;
      }

      if (
        facebookPendingCredentials &&
        googleMailAddress === result.user.email
      ) {
        result.user.linkWithCredential(facebookPendingCredentials);
      }

      return [user, true, ""];
    })
    .catch(async (err) => {
      console.log('err - ', err);
      if (err.code === "auth/credential-already-in-use") {
        return [null, false, "Phone number associated with another user."];
      } else if (err.code === "code-expired") {
        return [null, false, "The OTP has expired, please try again."];
      }
      return [null, false, err.code];
    });
};

export const updatePhoneNumber = async (uid, phoneNumber, countryCode) => {
  return await db
    .collection("users")
    .doc(uid)
    .set(
      {
        phone_number: phoneNumber,
        phone_country_code: countryCode,
      },
      { merge: true }
    )
    .then(() => true)
    .catch(() => false);
};

export const logOut = async () => {
  let logout_sucess;
  await auth.signOut().then(() => {
    logout_sucess = true;
  });


  return logout_sucess;
};

export const removeFcmToken = async (userId, fcmToken) => {
  return await db
    .collection("user_tokens")
    .doc(userId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        let tokens = doc.data().tokens?.filter((t) => t.token !== fcmToken);

        return await db
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

const checkIfPhoneNumberExists = async (phoneNumber) => {
  return await db
    .collection("users")
    .where("phone_number", "==", phoneNumber)
    .get()
    .then((res) => res.docs.length === 1)
    .catch(() => false);
};

