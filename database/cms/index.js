import axios from "axios";
import {baseUrl} from "../agora/config";
import {fetchIndianTime} from "../../helpers";

const attachListener = (path, cb, parentId) => {
  if(path.includes('undefined')) throw new Error(`"${path}" - is not valid`);
  return new Promise(async (res, rej) => {
    const unsubscribe = (await import('../../firebase-config')).db.collection(path)
      .onSnapshot(async (snapshot) => {
        cb(snapshot.docs, parentId, (await import('../../firebase-config')).db.collection(path));
      })
    res(unsubscribe);
  })
}

export const fetchGrades = (cb) => {
  const path = `cms_data`;
  return attachListener(path, cb, null);
  // return (await import('../../firebase-config')).db.collection('cms_data')
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchScopes = ({grade_id}, cb) => {
  const path = `cms_data/${grade_id}/scope`;
  return attachListener(path, cb, grade_id);
  // if(!grade_id) throw new Error('GradeId is required to fetch the scope.');
  // console.log('cms_data/gradeId/scope - ', `cms_data/${grade_id}/scope`)
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope`)
  //   .get()
  //   .then(snapshot => {
  //     console.log('fetchScopes - ', snapshot);
  //     return snapshot.docs;
  //   });
}

// export const fetchCategories = (gradeId, scope) => {
//   if(!gradeId || !scope) throw new Error('GradeId and Scope is required to fetch the category.');
//   return (await import('../../firebase-config')).db.collection(`cms_data/${gradeId}/scope/${scope}/category`)
//     .get()
//     .then(snapshot => {
//       return snapshot.docs;
//     });
// }

export const fetchCategories = ({grade_id, scope_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category`;
  return attachListener(path, cb, scope_id);
  // if(!grade_id || !scope_id) throw new Error('GradeId and Scope is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchSubjects = ({grade_id, scope_id, category_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject`;
  return attachListener(path, cb, category_id);
  // if(!grade_id || !scope_id || !category_id) throw new Error('GradeId and Scope and Category is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchTips = ({grade_id, scope_id, category_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/tip`;
  return attachListener(path, cb, category_id);
  // if(!grade_id || !scope_id || !category_id) throw new Error('GradeId and Scope and Category is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/tip`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchPractices = ({grade_id, scope_id, category_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/exam`;
  return attachListener(path, cb);
  // if(!grade_id || !scope_id || !category_id) throw new Error('GradeId and Scope and Category is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/exam`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchExamItems = ({grade_id, scope_id, category_id, practice_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/exam/${practice_id}/exam_item`;
  return attachListener(path, cb, practice_id);
  // if(!grade_id || !scope_id || !category_id || !practice_id) throw new Error('GradeId and Scope and Category and Practice Id is required to fetch the category.');
  // return new Promise((res, rej) => {
  //   const unsubscribe = (await import('../../firebase-config')).db.collection()
  //     .onSnapshot(snapshot => {
  //       console.log('snapshot - ', snapshot);
  //       cb(snapshot.docs);
        // return snapshot.docs;
      // })
    // res(unsubscribe);
  // })
    // .then(snapshot => {
    //   return snapshot.docs;
    // });
}

export const fetchExamHeaderItems = ({grade_id, scope_id, category_id, practice_id, exam_item_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/exam/${practice_id}/exam_item/${exam_item_id}/exam_header_item`;
  return attachListener(path, cb, exam_item_id);
  // if(!grade_id || !scope_id || !category_id || !practice_id || !exam_item_id) throw new Error('GradeId and Scope and Category and Practice Id and Exam Item Id is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/exam/${practice_id}/exam_item/${exam_item_id}/exam_header_item`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchChapters = ({grade_id, scope_id, category_id, subject_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter`;
  return attachListener(path, cb, subject_id);
  // if(!grade_id || !scope_id || !category_id || !subject_id) throw new Error('GradeId and Scope and Category and Subject is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchTabs = ({grade_id, scope_id, category_id, subject_id, chapter_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab`;
  return attachListener(path, cb, chapter_id);
  // if(!grade_id || !scope_id || !category_id || !subject_id || !chapter_id) throw new Error('GradeId and Scope and Category and Subject and Chapter is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}


export const fetchTabItems = ({grade_id, scope_id, category_id, subject_id, chapter_id, tab_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab/${tab_id}/lecture_item`;
  return attachListener(path, cb, tab_id);
  // if(!grade_id || !scope_id || !category_id || !subject_id || !chapter_id) throw new Error('GradeId and Scope and Category and Subject and Chapter is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab/${tab_id}/lecture_item`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

export const fetchLectureHeaderItems = ({grade_id, scope_id, category_id, subject_id, chapter_id, tab_id, lecture_item_id}, cb) => {
  const path = `cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab/${tab_id}/lecture_item/${lecture_item_id}/lecture_header_item`;
  return attachListener(path, cb);
  // if(!grade_id || !scope_id || !category_id || !subject_id || !chapter_id || !lecture_item_id) throw new Error('GradeId and Scope and Category and Subject and Chapter and Lecture Item Id is required to fetch the category.');
  // return (await import('../../firebase-config')).db.collection(`cms_data/${grade_id}/scope/${scope_id}/category/${category_id}/subject/${subject_id}/chapter/${chapter_id}/tab/${tab_id}/lecture_item/${lecture_item_id}/lecture_header_item`)
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs;
  //   });
}

const checkForClass9And10 = (pathItems) => {
  // if(pathItems.includes('class_9') || pathItems.includes('class_10')) throw new Error('Operations on Class 9 and 10 are not allowed.');
}

export const modifySubjectUpdatedOn = async (keys) => {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const ist = await fetchIndianTime();
    await (await import('../../firebase-config')).db
      .collection('cms_data')
      .doc(keys.grade_id)
      .collection('scope')
      .doc(keys.scope_id)
      .collection('category')
      .doc(keys.category_id)
      .collection('subject')
      .doc(keys.subject_id)
      .set({updated_on: +ist}, {merge: true});
    return true;
  } catch (e) {
    return false;
  }
}

async function deleteSection (pathItems) {
  // checkForClass9And10(pathItems);
  try {
    const deletePath = pathItems.join('/');
    const response = await axios.post(baseUrl() + '/recursiveDelete', {
      path: `cms_data/${deletePath}`
    });
    return response.status === 200;
  } catch (e) {
    console.log('Error in deleting the section - ', e);
    return false;
  }
}

export const prepareObjectFromKeys = obj => {
  return Object.keys(obj).reduce((acc, cur) => {
    let [first , ...split] = cur.split('_');
    if(first === 'practice') first = 'exam';
    let key = first + split.reduce((acc, cur) => {
      acc += cur.slice(0, 1).toLocaleUpperCase() + cur.slice(1);
      return acc;
    }, '');
    acc[key] = obj[cur];
    return acc;
  }, {});
}

async function deleteCategory(categoryType, keys, userParams) {
  const functionName = {
    learn: 'onLearnCategoryDelete',
    practice: 'onPracticeCategoryDelete',
    tip: 'onTipCategoryDelete'
  }
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    return await axios.post(baseUrl() + '/' + functionName[categoryType], {
      cmsParams: prepareObjectFromKeys(keys),
      userParams
    });
  } catch (e) {
    console.log('Error in deleting the category - ', e);
    return e;
  }
}

async function deleteSubject(keys, userParams) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const response = await axios.post(baseUrl() + '/onSubjectDelete', {cmsParams: prepareObjectFromKeys(keys), userParams});
    return response.status === 200;
  } catch (e) {
    console.log('Error in deleting the subject - ', e);
    return e;
  }
}

async function deleteChapter(keys, userParams) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const response = await axios.post(baseUrl() + '/onChapterDelete', {cmsParams: prepareObjectFromKeys(keys), userParams});
    let ok = modifySubjectUpdatedOn(keys);
    return response;
  } catch (e) {
    console.log('Error in deleting the chapter - ', e);
    return e;
  }
}

async function deleteTab(keys, userParams) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const response = await axios.post(baseUrl() + '/onTabDelete', {cmsParams: prepareObjectFromKeys(keys), userParams});
    let ok = modifySubjectUpdatedOn(keys);
    return response;
  } catch (e) {
    console.log('Error in deleting the tab - ', e);
    return e;
  }
}

async function deleteCMSItem(keys, userParams, functionName) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    return await axios.post(baseUrl() + '/' + functionName, {cmsParams: prepareObjectFromKeys(keys), userParams});
  } catch (e) {
    console.log('Error in deleting the exam - ', e);
    return e;
  }
}

async function deleteLectureItem(keys, userParams) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const response = await axios.post(baseUrl() + '/onLectureItemDelete', {cmsParams: prepareObjectFromKeys(keys), userParams});
    let ok = modifySubjectUpdatedOn(keys);
    return response;
  } catch (e) {
    console.log('Error in deleting the lecture item - ', e);
    return e;
  }
}

async function deleteLectureHeaderItem(keys, userParams) {
  // if(keys.grade_id === 'class_9' || keys.grade_id === 'class_10') throw new Error('Operations on Class 9 and 10 are not allowed.');
  try {
    const response = await axios.post(baseUrl() + '/onLectureHeaderItemDelete', {cmsParams: prepareObjectFromKeys(keys), userParams});
    let ok = modifySubjectUpdatedOn(keys);
    return response;
  } catch (e) {
    console.log('Error in deleting the lecture header item - ', e);
    return e;
  }
}

export {deleteSubject, deleteChapter, deleteTab, deleteCMSItem, deleteLectureHeaderItem, deleteLectureItem, deleteSection, deleteCategory};
