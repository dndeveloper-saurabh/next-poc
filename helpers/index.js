import {
  planet1,
  planet1_onboard,
  planet2,
  planet2_onboard,
  planet3, planet3_onboard,
  planet4,
  planet5,
  planet6,
  planet7,
  planet8
} from "../public/assets";

export const starPath =
  "M93.658,7.186,68.441,60.6,12.022,69.2C1.9,70.731-2.15,83.763,5.187,91.227l40.818,41.557-9.654,58.7c-1.738,10.611,8.959,18.559,17.918,13.6l50.472-27.718,50.472,27.718c8.959,4.922,19.656-2.986,17.918-13.6l-9.654-58.7,40.818-41.557c7.337-7.464,3.282-20.5-6.835-22.029L141.04,60.6,115.824,7.186A12.139,12.139,0,0,0,93.658,7.186Z";

export const VAPIDKEY =
  "BBAS6jVsiEE86EtJvP9RGSkPt46szXb2Ao7pfUdOL0xhhDiiPGnzgwN3utpw_O6RFMbuxgui2d3F7W98jFB5ZWk";

export const agoraAppID = "320f1867bc3d4922b4da5963a9f2b760";

export const PUSHY_SECRET_API_KEY =
  "73572a9672a97ef4af6e38167d99d87825d53642114ff16780f3082f9973c16f";

export const FCM_AUTH_HEADER =
  "key=AAAAmhuAeFI:APA91bHSnIpAbEKtDTjvZH1F3xtJvHIlz_m1GOOgzbtZdsiqXpUk7QZvVdKs_9PIbnENdz_ytxaEjFqihGA9MZsW7S6FS1WsOOTDfawNdW_6iVbeduNZOxMVwfEzM69QpHsEVouUQFyd";

export const firebaseAPiKey = "AIzaSyCgfeFcXVvvuIp79IJD8KCahJo2PzrHDco";

export const firebaseDbURL = "https://avian-display-193502.firebaseio.com";

export const appGooglePlayLink =
  "https://play.google.com/store/apps/details?id=com.pustack.android.pustack&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1";

export const appAppleLink = "https://apps.apple.com/app/pustack/id6444080075";

export const googlePlayBadge =
  "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

export const ALREADY_EXIST_PHONE_LOGIN_CODE = 'already-exists-phone_login';
export const ALREADY_EXIST_EMAIL_LOGIN_CODE = 'already-exists-email_login'

export const privacyPolicy =
  "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/legal%2FPrivacy%20Policy.pdf?alt=media&token=7233bfb7-dd7b-4587-ba0b-e72bc78bbe4d";

export const termsOfService =
  "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/legal%2FTerms%20of%20Service.pdf?alt=media&token=c108b0eb-31f0-4101-8a4a-096e0ec00f8f";

export const refundAndCancellationPolicy =
  "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/legal%2FRefund%20Policy.pdf?alt=media&token=b75e6bbb-91d4-47fd-9fb4-e1c63ab40e7e"


export const getGradeNameByValue = (value) => {
  const isPresent = getAvailableGrades().find(c => c.value === value);
  if(!isPresent) throw new Error('This Grade "' + value + '" is not supported yet. Please contact Pustack administrator');
  return isPresent.grade;
}

export const getAvailableGrades = (reduced, excludeClass2, isProduction) => {
  // console.log('planet1 - ', planet1);

  let grades = [
    {grade: "Class 5", value: "class_5", planet: planet1_onboard},
    {grade: "Class 6", value: "class_6", planet: planet2_onboard},
    {grade: "Class 7", value: "class_7", planet: planet3_onboard},
    {grade: "Class 8", value: "class_8", planet: planet4},
    {grade: "Class 9", value: "class_9", planet: planet5, standard: true, enableToSelect: true},
    {grade: "Class 10", value: "class_10", planet: planet6, standard: true, enableToSelect: true},
    {grade: "Class 11", value: "class_11", planet: planet7, standard: true},
    {grade: "Class 12", value: "class_12", planet: planet8, standard: true}
  ];

  if(!excludeClass2) grades.splice(0,0,
    {grade: "Class 2", value: "class_2"},
  )

  if(isProduction) {
    grades = [
      {grade: "Class 9", value: "class_9", planet: planet5, standard: true, enableToSelect: true},
      {grade: "Class 10", value: "class_10", planet: planet6, standard: true, enableToSelect: true},
    ]
  }

  if(reduced) return grades.map(c => c.value);
  return grades;

  // let gradeCollection = 'grades_dev';
  // // let gradeCollection = process.env.NODE_ENV === 'production' ? 'grades' : 'grades_dev';
  // const snapshot = await db
  //   .collection(gradeCollection)
  //   .doc('available_grades')
  //   .get();
  //
  // return snapshot.exists ? snapshot.data() : {};
}


export const loadingWrapper = () => {
  document.querySelector(".loading__wrapper").style.display = "flex";
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;

  setTimeout(() => {
    document.querySelector(".loading__wrapper").style.display = "none";

    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }, 3000);
};


export const SNACKBAR_TYPES = ['success', 'warning', 'help', 'error']
