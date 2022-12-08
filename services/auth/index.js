import { deleteUserFromDatabase } from "../../database";
import firebase from "firebase/app";
import {castIndianTime} from "../../helpers";

const PROVIDER_NOT_SUPPORTED_MSG = 'The auth provider is not supported. Please contact pustack administrator.'

export const deleteUserFn = (uid) => {
  const deleteUser = require('../../firebase-config').functions.httpsCallable('deleteUser');
  return deleteUser({
    uid
  });
}

/**
 *
 * @param provider
 * @param facebookPendingCredentials
 * @param googleMailAddress
 * @param handleError
 * @returns {Promise<*>}
 */
export const signIn = async (provider, facebookPendingCredentials, googleMailAddress, handleError = () => {}) => {

  if(!provider) throw new Error(PROVIDER_NOT_SUPPORTED_MSG)

  let user;
  await require('../../firebase-config').auth
    .signInWithPopup(provider)
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
    .catch((e) => {
      user = null;
      handleError(e);
    });

  return user;
}

/**
 *
 * @param provider
 * @param userData
 * @param setPhoneNumberError
 * @param setSocialProcessStarted
 * @param setExistingAccountError
 * @param handleAuth
 * @param setData
 * @param handleIfNoEmail
 * @returns {Promise<*>}
 */
export const submit = async (
  provider,
  userData,
  setPhoneNumberError,
  setSocialProcessStarted,
  setExistingAccountError,
  handleAuth,
  setData,
  handleIfNoEmail = () => {}
) => {
  try {

    if (!provider) throw new Error(PROVIDER_NOT_SUPPORTED_MSG)

    // logged-in user with the phone
    const prevUser = require('../../firebase-config').auth.currentUser;

    // logging in with the GOOGLE provider
    const res = await require('../../firebase-config').auth.signInWithPopup(provider);

    if (!res.user?.email) {
      setPhoneNumberError("The facebook account doesn't have an email");
      setSocialProcessStarted([false, false, false]);
      setTimeout(() => {
        setPhoneNumberError("");
        handleIfNoEmail();
      }, 2000);
      return;
    }

    const snapshot = await require('../../firebase-config').db.collection('users')
      .doc(res.user.uid)
      .get();

    if (snapshot.exists) {

      // Deleting the phone user using the cloud function
      await deleteUserFn(prevUser.uid);

      // Deleting the phone user
      await prevUser.delete();

      if (res.user.phoneNumber !== null) return setData(res.user);

      return setData(res.user, true);
    } else {
      let time_now = await castIndianTime();
      let displayName = "";
      let photoURL = "";
      const email = res.user?.email;

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

      await prevUser.linkWithCredential(res.credential);

      // And then logging back to the account(phone-number one) as the logged-in email account has been deleted.
      await require('../../firebase-config').auth.signInWithCredential(res.credential);

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
    }
  } catch (error) {
    console.log('error - ', error);
    if (
      error.code === "auth/credential-already-in-use" ||
      error.code === "auth/email-already-in-use"
    ) {
      userData.delete();
      // setExistingAccountError(error);
      setSocialProcessStarted([false, false, false]);
      // return setPhoneNumberError(ALREADY_EXIST_EMAIL_LOGIN_CODE)
      return;
    }
    setPhoneNumberError(error.message);
    setSocialProcessStarted([false, false, false]);
  }
}

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
  require('../../firebase-config').auth.useDeviceLanguage();

  // const phoneExists = await checkIfPhoneNumberExists(
  //   countryCode ? phoneNumber.slice(countryCode?.length + 1) : phoneNumber
  // );

  console.log('tempEmailUserData - ', tempEmailUserData);

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
    //     if (error?.code === "require('../../firebase-config').auth/invalid-phone-number") {
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

      await submitPhoneNumber(
        phoneNumber,
        setActiveTab,
        1,
        setSendingOtp,
        setPhoneNumberError,
        cb
      );

      setActiveTab(1);
      setPhoneRoute(true);
    } else {
      console.log('coming from here- ', tab);
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

  console.log('phone number - ', phoneNumber);

  await require('../../firebase-config').auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log('coming here');
      window.confirmationResult = confirmationResult;

      setSendingOtp(false);

      if(tab >= 0) setTimeout(() => setActiveTab(tab), 100);
      cb();
    })
    .catch((error) => {
      console.log('error - ', error);
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
    return require('../../firebase-config').auth.currentUser
      .updatePhoneNumber(
        firebase.auth.PhoneAuthProvider.credential(
          otpConfirm.verificationId,
          code
        )
      )
      .then(() => [null, true, ""])
      .catch((err) => {
        console.log('err - ', err);
        let e = err.message;
        if (err.code === "auth/invalid-verification-code") {
          e = "Incorrect Verification Code.";
        } else if (err.code === "code-expired") {
          e = "The OTP has expired, please try again.";
        }
        return [null, false, e]
      });
  }
  const prevUser = require('../../firebase-config').auth.currentUser;

  console.log('prevUser - ', prevUser);

  return await otpConfirm
    ?.confirm(code)
    .then(async (result) => {
      let user = result.user;

      const snapshot = await require('../../firebase-config').db.collection('users')
        .doc(user.uid)
        .get();

      console.log('result -', result, prevUser, snapshot.exists);

      if(snapshot.exists && prevUser && prevUser !== result.user) {

        // Deleting the email user using the cloud function
        await deleteUserFn(prevUser.uid);

        // Deleting the phone user
        await prevUser.delete();


        // if(user.email !== null) {
        //

        // }
        return [user, true, "", true];
      }

      if(!snapshot.exists && prevUser && prevUser !== result.user){

        const credential = firebase.auth.PhoneAuthProvider.credential(
          otpConfirm.verificationId,
          code
        );

        // Deleting the email user using the cloud function
        await deleteUserFn(result.user.uid);

        // Deleting the phone user
        await result.user.delete();

        await prevUser.linkWithCredential(credential);

        // And then logging back to the account(phone-number one) as the logged-in email account has been deleted.
        const resss = await require('../../firebase-config').auth.signInWithCredential(credential);

        user = resss.user;
      }

      console.log('user - ', user);

      return [user, true, ""];


      // if (
      //   facebookPendingCredentials &&
      //   googleMailAddress === result.user.email
      // ) {
      //   result.user.linkWithCredential(facebookPendingCredentials);
      // }

      // return [user, true, ""];
    })
    .catch(async (err) => {
      console.log('err - ', err);
      if (err.code === "auth/credential-already-in-use") {
        return [null, false, "Phone number associated with another user."];
      } else if (err.code === "code-expired") {
        return [null, false, "The OTP has expired, please try again."];
      } else if (err.code === "auth/invalid-verification-code") {
        return [null, false, "Incorrect Verification Code."];
      }
      return [null, false, err.code];
    });
};

export const updatePhoneNumber = async (uid, phoneNumber, countryCode) => {
  return await require('../../firebase-config').db
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
  await require('../../firebase-config').auth.signOut().then(() => {
    logout_sucess = true;
  });

  window.recaptchaVerifier = undefined;

  return logout_sucess;
};

export const removeFcmToken = async (userId, fcmToken) => {
  return await require('../../firebase-config').db
    .collection("user_tokens")
    .doc(userId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        let tokens = doc.data().tokens?.filter((t) => t.token !== fcmToken);

        return await require('../../firebase-config').db
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
