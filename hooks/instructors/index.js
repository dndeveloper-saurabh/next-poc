import {useCallback, useEffect, useState} from "react";
import {useIsMounted} from "../isMounted";

export default function useInstructors(init) {
  const [instructors, setInstructors] = useState(init);
  const isMounted = useIsMounted();

  useEffect(() => {
    async function fetchInstructors() {
      const query = require('../../firebase-config').db.collection('users').where('is_instructor', '==', true);
      const instructorsList = [];
      const references = await query.get().then(snapshot => {
        let arr = [];
        snapshot.forEach((doc) => {
          arr.push(doc.ref.collection('meta').doc(doc.id).get());
        })
        return arr;
      });
      const documents = await Promise.all(references);
      console.log('documents - ', documents);
      for(let i = 0; i < documents.length; i++) {
        let document = documents[i];
        if(document.exists) {
          instructorsList.push({
            id: document.id,
            label: document.data().name,
            value: document.id,
            image: document.data().profile_url,
            role: document.data().role
          })
        }
      }
      // clearInterval(id);
      // if(isMounted()) {
        console.log('instructorsList - ', instructorsList);
        setInstructors(instructorsList);
      // }
    }
    fetchInstructors().then();
  }, []);

  return instructors;
}
