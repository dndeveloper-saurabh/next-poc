import {useContext, useEffect, useRef, useState} from 'react';
import {
  fetchCategories,
  fetchChapters,
  fetchExamHeaderItems,
  fetchExamItems,
  fetchGrades, fetchLectureHeaderItems,
  fetchPractices,
  fetchScopes,
  fetchSubjects,
  fetchTabItems,
  fetchTabs,
  fetchTips
} from "../../database/cms";
import {CmsContext} from "../../context/cms/CmsContext";

class Step {
  constructor(id, key, header, fetcher, next, skip) {
    this.id = id;
    this.key = key;
    this.header = header;
    this.fetcher = fetcher;
    this.next = next;
    this.skip = skip;
  }
}

const steps = [
  {type: 'grade', childType: 'scope', fetcher: fetchScopes, skip: null, header: 'Scope', key: 'scope_name', path: ''},
  {type: 'scope', childType: 'category', fetcher: fetchCategories, skip: null, header: 'Category', key: 'category_name', path: ''},
  {type: 'category', childType: 'subject', fetcher: fetchSubjects, skip: null, header: 'Subject', key: 'subject_name', path: ''},
  {type: 'subject', childType: 'chapter', fetcher: fetchChapters, skip: null, header: 'Chapter', key: 'chapter_name', path: ''},
  // The items which have the childType key null, they are being set dynamically or it means that they don't have any child i.e, they are files.
  {type: 'tip', childType: null, fetcher: null, skip: null, path: ''},
  {type: 'practice', childType: 'exam_item', fetcher: fetchExamItems, skip: null, header: 'Exam Item', key: 'exam_item_name', path: ''},
  {type: 'exam_item', childType: null, fetcher: null, skip: null, path: ''},
  {type: 'exam_header_item', childType: null, fetcher: null, skip: null, path: ''},
  {type: 'chapter', childType: 'tab', fetcher: fetchTabs, skip: null, header: 'Tab', key: 'tab_name', path: ''},
  {type: 'tab', childType: 'lecture_item', fetcher: fetchTabItems, skip: null, header: 'Lecture Item', key: 'lecture_item_name', path: ''},
  {type: 'lecture_item', childType: null, fetcher: null, skip: null, path: ''},
  {type: 'lecture_header_item', childType: null, fetcher: null, skip: null, path: ''},
];

const headerMap = {
  exam_item: {
    fetcher: fetchExamHeaderItems,
    childType: 'exam_header_item',
    header: 'Exam Header Item',
    key: 'lecture_header_item_name'
  },
  lecture_item: {
    fetcher: fetchLectureHeaderItems,
    childType: 'lecture_header_item',
    header: 'Lecture Header Item',
    key: 'lecture_header_item_name'
  }
}

const filesDir = ['tip', 'exam_item', 'exam_header_item', 'lecture_item', 'lecture_header_item'];

export default function usePath() {
  const [path, setPath] = useState([]);
  const [parsedPath, setParsedPath] = useState({});
  const [pathItems, setPathItems] = useState([]);
  const [_, setInfoData] = useContext(CmsContext).infoData;
  const [, setUnsubscribes] = useContext(CmsContext).unsubscribes;
  const prevPath = useRef([]);
  const [routedPath, setRoutedPath] = useState([]);
  const [newUpdatedItems, setNewUpdatedItems] = useState(null);
  const [clickedId, setClickedId] = useState(null);

  function handleItemClick(docData, id, type, fileType, skippable, headerData, index, forced, ref) {
    // console.log('handling item click');

    setInfoData({docData, ref});

    if(id === path?.at(-1)?.path && !forced) return;


    // if(pathItems.some(c => c.parentId === id)) {
    //   return;
    // }

    const stepIndex = steps.findIndex(c => c.type === type);
    const step = steps[stepIndex];
    setClickedId(id);

    if(fileType !== 'file') {
      if(!(pathItems.some(c => c.parentId === id))) {
        setPathItems(c => {
          let newC = c.slice(0, index + 1);
          return [...newC, {loader: true}]
        });
      }

      if (type === 'category') {
        const item = path.find(c => c.type === 'scope');
        const isTip = item.path.includes('tip');
        const isLearn = item.path.includes('learn');
        const isPractice = item.path.includes('practice');
        const isSkippable = skippable;

        if (isTip) {
          step.childType = 'tip';
          step.fetcher = fetchTips;
          step.header = 'Tip';
          step.key = 'tip_name';
        } else if (isLearn) {
          step.childType = 'subject';
          step.fetcher = fetchSubjects;
          step.header = 'Subject';
          step.key = 'subject_name';

          if (isSkippable) {
            step.childType = 'chapter';
            step.fetcher = fetchChapters;
            step.header = 'Chapter';
            step.key = 'chapter_name';
          }
        } else if (isPractice) {
          step.childType = 'practice';
          step.fetcher = fetchPractices;
          step.header = 'Exam';
          step.key = 'exam_name';
        }
      }
    } else {
      if(!(pathItems.some(c => c.parentId === id))) {
        setPathItems(c => {
          return c.slice(0, index + 1)
        });
      }
    }

    let name = fileType === 'file' ? undefined : docData[type ? (type === 'practice' ? 'exam' : type) + '_name' : 'grade_name'];

    const setPathFn = p => {
      let a = [...p];
      a[index] = {
        ...step,
        path: id,
        skip: skippable,
        name,
        ...headerData
      };
      return a.slice(0, index + 1);
    }
    setPath(setPathFn);
    setRoutedPath(setPathFn);
  }

  useEffect(() => {
    setPathItems([{loader: true}]);
    let a = 0;
    const promise = fetchGrades(function(grades, parentId, ref) {
      a += 1;
      const items = grades.map(value => {
        if(!value.exists) return null;
        const data = value.data();
        return {
          id: value.id,
          typeof: 'grade',
          name: data.grade_name,
          ...data,
          ref: value.ref,
          docData: {
            id: value.id,
            ...data
          }
        };
      }).filter(c => c !== null)
        .sort((a, b) => a.serial_order - b.serial_order);

      console.log('items - ', items);

      setPathItems(c => {
        let newC = [...c];
        newC[0] = {id: 'grade', header: 'Grade', ref, parentId: null, items};
        return newC;
      });
      if(a === 1) handleItemClick(items[0].docData, items[0].id, 'grade', false, null, {}, 0, true, items[0].ref);
    })


    return () => {
      promise.then(c => typeof c === 'function' ? c() : null);
    }
  }, []);

  useEffect(() => {
    if(!newUpdatedItems) return;
    setPathItems(c => {
      let newC = c.filter(a => !a.loader).slice(0, path.length + 1);
      // console.log('newC - ', newC);
      // console.log(newC, newUpdatedItems);
      let isUpdated = false;
      for(let i = 0; i < newC.length; i++) {
        let item = newC[i];
        if (item.id === newUpdatedItems.id)  {
          newC[i] = newUpdatedItems;
          isUpdated = true;
          break;
        }
      }
      if(!isUpdated) newC.push(newUpdatedItems)
      return newC;
      // return [...newC, {id: path.at(-1).type, header: path.at(-1).header, items}];
    });
  }, [newUpdatedItems])

  const handlePathChange = async () => {
    if(!(path.length > 0)) return;
    if(!path.at(-1).childType) return;
    // Following code returns the unsubscribe method
    // console.log('clickedId - ', clickedId);
    if((pathItems.some(c => c.parentId === clickedId))) {
      setPathItems(c => {
        return c.filter(a => !a.loader).slice(0, path.length + 1);
      });
      return;
    }

    const unsubscribe = await path.at(-1).fetcher(parsedPath, function(docs, parentId, parentRef) {
      console.log('docs - ', docs);
      const items = docs.map(value => {
        if(!value.exists) return null;
        const data = value.data();
        let headerData = {};
        if(filesDir.includes(path.at(-1).childType) && data[path.at(-1).childType + '_type'] === 'header') {
          headerData = headerMap[path.at(-1).childType];
        }
        return {
          id: value.id,
          typeof: path.at(-1).childType,
          name: data[path.at(-1).key],
          ref: value.ref,
          fileType: filesDir.includes(path.at(-1).childType) && data[path.at(-1).childType + '_type'] !== 'header' ? 'file' : 'folder',
          ...data,
          headerData,
          docData: {
            id: value.id,
            ...data
          }
        };
      }).filter(c => c !== null)
        .sort((a, b) => a.serial_order - b.serial_order);
      setNewUpdatedItems({id: path.at(-1).childType, ref: parentRef, parentId, header: path.at(-1).header, items});
    });

    setUnsubscribes(c => {
      if(c[path.at(-1).type]) c[path.at(-1).type]();
      return {...c, [path.at(-1).type]: unsubscribe}
    });

  }
  
  useEffect(() => {
    // console.log('path changed ');
    if(!(path.length > 0)) return;
    setParsedPath(c => {
      return {
        ...c,
        subject_id: path.at(-1).skip && path.at(-1).type === 'category' ? path.at(-1).path : c.subject_id,
        [path.at(-1).type + '_id']: path.at(-1).path,
      }
    })

  }, [path]);

  useEffect(() => {
    handlePathChange().then();
  }, [parsedPath])

  return {path, setPath, pathItems, parsedPath, setPathItems, handleItemClick};
}
