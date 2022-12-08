import {useState, useEffect, useCallback} from 'react';
import {fetchIndianTime} from "../../helpers";

/**
 *
 * @param interval in milliseconds
 * @description This is just a timer accepts the interval and returns timer and clearTimer function in array
 * @returns {[Date, Function]}
 */
function useTimer(interval = 60000) {
  const [now, setNow] = useState(null);
  const [timer, setTimer] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const calculateTime = useCallback(
    (time, toAddTime = 0) => {
      let indianTime;
      if (!time) {
        indianTime = now;
        setTimer(new Date(indianTime));
      } else {
        indianTime = new Date(time);
      }
      indianTime.setMilliseconds(indianTime.getMilliseconds() + toAddTime);
      setTimer(new Date(indianTime.toISOString()));
    },
    [now]
  );

  useEffect(() => {

    if(!now) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetchIndianTime(signal).then(time => {
        setNow(time);
        calculateTime(time);
      }).catch(console.log)

      return () => controller.abort();
    }
  }, [calculateTime, now]);

  useEffect(() => {
    let timerInterval;
    if (now) {
      timerInterval = setInterval(() => calculateTime(timer, interval), interval);
    }
    setIntervalId(timerInterval);
    return () => clearInterval(timerInterval);
  }, [now, timer, interval, calculateTime]);

  const clearTimer = useCallback(() => {
    clearInterval(+intervalId);
  }, [intervalId])

  return [timer, clearTimer];
}

export default useTimer;
