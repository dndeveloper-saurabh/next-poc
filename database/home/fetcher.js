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
} from "../../public/assets";
import axios from "axios";
import {isProduction} from "../../hooks/isProduction";

export const getSubjectMeta = async ({ grade, subjectCode }) => {
  return await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_learn`)
    .collection("category")
    .doc(`${grade}_learn_${subjectCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let _categories = [];

        let _categories_map = doc.data()._meta;

        _categories_map.forEach((category) => {
          _categories.push({
            description: category.description,
            code: category.generic_name,
            hex_color: category.hex_color,
            name: category.subject_name,
            illustration_art: category.illustration_art,
            chapters: category.chapters,
            serial_order: category.serial_order,
            updated_on: category.updated_on,
          });
        });

        return _categories;
      }

      return null;
    });
};

export const getSubjectMeta2 = async ({ grade, subjectCode }) => {
  return await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_learn`)
    .collection("category")
    .doc(`${grade}_learn_${subjectCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let _categories = [];

        let _categories_map = doc.data()._meta;

        _categories_map.forEach((category) => {
          _categories.push({
            description: category.description,
            code: category.generic_name,
            hex_color: category.hex_color,
            name: category.subject_name,
            illustration_art: category.illustration_art,
            chapters: category.chapters,
            serial_order: category.serial_order,
            updated_on: category.updated_on,
          });
        });

        return { categories: _categories, description: doc.data().description };
      }

      return null;
    });
};

export const getTipsMeta = async ({ grade, subjectCode }) => {
  return await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_tips`)
    .collection("category")
    .doc(`${grade}_tips_${subjectCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let _categories = [];

        let _categories_map = doc.data()._meta;

        _categories_map.forEach((category) => {
          _categories.push({
            description: category.description,
            code: category.generic_name,
            name: category.tip_name,
            banner_image: category.banner_image,
            serial_order: category.serial_order,
            side_image_url: category.side_image_url,
            tip_id: category.tip_id,
            tier: category.tier,
          });
        });

        return _categories.sort((a, b) => a.serial_order - b.serial_order);
      }

      return null;
    });
};

export const getPracticeMeta = async ({ grade, subjectCode }) => {
  return await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_practice`)
    .collection("category")
    .doc(`${grade}_practice_${subjectCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let _categories = [];

        let _categories_map = doc.data()._meta;

        _categories_map.forEach((category) => {
          _categories.push({
            description: category.description,
            code: category.generic_name,
            name: category.exam_name,
            main_thumbnail_url: category.main_thumbnail_url,
            mini_thumbnail_url: category.mini_thumbnail_url,
            serial_order: category.serial_order,
            exam_id: category.exam_id,
            exam_item_count: category.exam_item_count,
            exam_image_url: category.exam_image_url,
            exam_number: category.exam_number,
          });
        });

        return _categories.sort((a, b) => a.serial_order - b.serial_order);
      }

      return null;
    });
};

export const getSubjectCodes = async ({ grade }) => {
  const snapshot = await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_learn`)
    .collection("category")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

export const getTipsCodes = async ({ grade }) => {
  const snapshot = await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_tips`)
    .collection("category")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

export const getPracticeCodes = async ({ grade }) => {
  const snapshot = await (await import('../../firebase-config')).db
    .collection("cms_data")
    .doc(grade)
    .collection("scope")
    .doc(`${grade}_practice`)
    .collection("category")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

export const getMainCarouselData = async ({ grade, tier_type }) => {
  const snapshot = await (await import('../../firebase-config')).db
    .collection("main_carousel")
    .where("grade_id", "in", ["all", grade])
    .get();

  // TODO: Temporary solution as we dont have any carousel/banner for class 9 web
  return snapshot.docs.map((doc) => doc.data()).filter(c => ["all", "web", "tablet"].includes(c.device_type));
};

export const getGradeNameByValue = (value) => {
  const isPresent = getAvailableGrades().find(c => c.value === value);
  if(!isPresent) throw new Error('This Grade "' + value + '" is not supported yet. Please contact Pustack administrator');
  return isPresent.grade;
}

export const getAvailableGrades = (reduced, excludeClass2) => {
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
  // const snapshot = await (await import('../../firebase-config')).db
  //   .collection(gradeCollection)
  //   .doc('available_grades')
  //   .get();
  //
  // return snapshot.exists ? snapshot.data() : {};
}

export const getVimeoVideos = async () => {
  const vimeoVideos = [];
  const snapshot = await (await import('../../firebase-config')).db
    .collection('/admin_videos')
    .doc('pustack_app')
    .get();

  if(!snapshot.exists) return;

  const videos = snapshot.data().videos?.home_video_list;

  if(!videos) return;

  for(let i = 0; i < videos.length; i++) {
    let videoData = videos[i];
    try {
      const {data} = await axios.get('https://api.vimeo.com/videos/' + videoData.video_id, {
        headers: {
          'Authorization': 'Bearer eb3aa30f683094b5e51d077a9b8bbff5'
        }
      });
      const thumbnailItem = data.pictures.sizes.find(c => (c.width === 1280 && c.height === 720));
      const linkItem = data.files.find(c => c.quality === 'hls');
      const thumbnail = thumbnailItem?.link_with_play_button;
      const link = linkItem?.link;
      if(data.error || !thumbnail || !link) continue;
      vimeoVideos.push({
        id: +new Date() + '_' + videoData.video_id,
        link,
        thumbnail,
        description: videoData.description,
        title: videoData.title
      })
    } catch(e) {
      console.log('error in vimeo video response - ', e);
    }
  }

  return vimeoVideos;
}
