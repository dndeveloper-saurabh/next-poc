import {
  deleteCategory,
  deleteChapter, deleteCMSItem, deleteLectureHeaderItem,
  deleteLectureItem,
  deleteSection,
  deleteSubject,
  deleteTab
} from "../../database/cms";
import {fetchIndianTime} from "../functions/getIndianTime";
// import {showSnackbar} from "../functions/show-snackbar";

export const concatPathWithUnderScore = (...args) => args.join('_');

export const deleteFn = {
  'grade': (keys) => deleteSection([keys.grade_id]),
  'category': (keys, user) => {
    if(keys.scope_id.includes('learn')) return deleteCategory('learn', keys, user);
    if(keys.scope_id.includes('tip')) return deleteCategory('tip', keys, user);
    if(keys.scope_id.includes('practice')) return deleteCategory('practice', keys, user);
  },
  'subject': deleteSubject,
  'chapter': deleteChapter,
  'tab': deleteTab,
  'lecture_item': deleteLectureItem,
  'lecture_header_item': deleteLectureHeaderItem,
  'tip': (keys, user) => deleteCMSItem(keys, user, 'onTipDelete'),
  'practice': (keys, user) => deleteCMSItem(keys, user, 'onExamDelete'),
  'exam_item': (keys, user) => deleteCMSItem(keys, user, 'onExamItemDelete'),
  'exam_header_item': (keys, user) => deleteCMSItem(keys, user, 'onExamHeaderItemDelete'),
  // 'tip': (keys) => deleteSection([keys.grade_id, 'scope', keys.scope_id, 'category', keys.category_id, 'tip', keys.tip_id]),
  // 'practice': (keys) => deleteSection([keys.grade_id, 'scope', keys.scope_id, 'category', keys.category_id, 'exam', keys.practice_id]),
  // 'exam_item': (keys) => deleteSection([keys.grade_id, 'scope', keys.scope_id, 'category', keys.category_id, 'exam', keys.practice_id, 'exam_item', keys.exam_item_id]),
  // 'exam_header_item': (keys) => deleteSection([keys.grade_id, 'scope', keys.scope_id, 'category', keys.category_id, 'exam', keys.practice_id, 'exam_item', keys.exam_item_id, 'exam_header_item', keys.exam_header_item_id]),
}

export const createLog = async ({level, action, status, user, affectedKeys, itemId, error}) => {
  const docRef = (await import('../../firebase-config')).db.collection('cms_logs').doc();
  const ist = await fetchIndianTime();
  const log = {
    id: docRef.id,
    level,
    action,
    status,
    requested_by: {
      id: user.uid,
      name: user.name,
      image: user.profile_url
    },
    affected_keys_list: affectedKeys ? Object.keys(affectedKeys) : [],
    affected_keys: affectedKeys,
    item_id: itemId,
    timestamp: +ist,
    error: error ?? null
  }
  return docRef.set(log);
  // showSnackbar('Log created successfully!', 'success');
}

export const prepareAffectedKeys = (prevObj, newObj) => {
  const oldKeys = Object.keys(prevObj);
  const affectedObj = oldKeys.reduce((acc, key) => {
    const newVal = newObj[key];
    const oldVal = prevObj[key];
    if(newVal === undefined) return acc;
    if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      acc[key] = {prev_value: oldVal, new_value: newVal};
    }
    return acc;
  }, {});

  console.log('newObj - ', affectedObj);
  return affectedObj;
}
