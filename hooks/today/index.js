import {useCallback, useEffect, useState} from "react";
import {fetchIndianTime} from "../../helpers";

function useToday(prop) {
  const [today, setToday] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchIndianTime(signal)
      .then(indianTime => {
        setToday(new Date(indianTime));
      }).catch(console.log)
    return () => controller.abort();
  }, [prop]);

  return today;
}

export default useToday;
