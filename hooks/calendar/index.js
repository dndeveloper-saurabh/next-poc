import {useCallback, useEffect, useState} from "react";
import {fetchIndianTime} from "../../helpers";
import useToday from "../today";

/**
 *
 * @param initial? {{month: number, year: number} | undefined | null}
 * @returns {{next: next, current: *, prev: prev}}
 */
export default function useCalendar(initial) {
  const [current, setCurrent] = useState(() => {
    if (initial) return initial;
    // For initial value, using the device time.
    // But after fetching the indian time from server will be replaced
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [dates, setDates] = useState([[]]);
  const [today, setToday] = useState(null);
  const [monthView, setMonthView] = useState(false);
  const todayHook = useToday();

  useEffect(() => {
    if(todayHook) {
      setCurrent({
        year: todayHook.getFullYear(),
        month: todayHook.getMonth()
      });
      setToday({
        date: todayHook.getDate(),
        month: todayHook.getMonth(),
        year: todayHook.getFullYear(),
        isCurMonth: true
      });
    }
  }, [todayHook]);

  useEffect(() => {
    if(today) {
      async function setWeek() {
        const _dateData = await next7Days();
        setDates([_dateData]);
      }
      if (monthView) {
        const dates = getMonthGridDates();
        setDates(dates);
      } else {
        setWeek().then();
      }
    }
  }, [monthView, today]);

  const getMonthGridDates = useCallback(
    (num = 0, jumpOptions) => {
      if (!today) return null;
      const todayClone = new Date(today.year, today.month, today.date);
      if (jumpOptions) {
        todayClone.setFullYear(jumpOptions.year);
        todayClone.setDate(1);
        todayClone.setMonth(jumpOptions.month);
      } else {
        todayClone.setFullYear(current.year);
        todayClone.setDate(1);
        todayClone.setMonth(current.month + num);
      }

      const curMonth = todayClone.getMonth();

      setCurrent({
        month: curMonth,
        year: todayClone.getFullYear(),
        direction: num
      });

      const prevDayCount =
        todayClone.getDay() > 0 ? todayClone.getDay() - 1 : 6;
      todayClone.setDate(todayClone.getDate() - prevDayCount);

      let result = [[]];
      let isCurMonth;
      let gridLength = 35;
      for (let i = 0; i < gridLength; i++) {
        if (result[result.length - 1].length === 7) {
          result.push([]);
        }
        todayClone.setDate(todayClone.getDate() + (i === 0 ? 0 : 1));
        isCurMonth = todayClone.getMonth() === curMonth;
        result[result.length - 1].push({
          day: todayClone.getDay(),
          date: todayClone.getDate(),
          month: todayClone.getMonth(),
          year: todayClone.getFullYear(),
          isCurMonth
        });

        if (i === gridLength - 1 && isCurMonth) {
          let lastDate = new Date(todayClone);
          lastDate.setDate(lastDate.getDate() + 1);
          if (lastDate.getMonth() === curMonth) {
            gridLength += 7;
          }
        }
      }
      return result;
    },
    [current, today]
  );

  const jumpTo = useCallback(
    (month, year) => {
      /**
       * current: {month: 2, year: 2021}
       * jumpTo: {month: 0, year: 2022}
       */
      if (current.year === year && current.month === month) return;
      let num;
      if (current.year === year) {
        if (current.month < month) {
          num = 1;
        } else {
          num = -1;
        }
      } else if (current.year > year) {
        num = -1;
      } else {
        num = 1;
      }
      console.log('jumpTo - ', month, year);
      const dates = getMonthGridDates(num, { month, year });
      setDates(dates);
    },
    [current, setDates, getMonthGridDates]
  );

  const next7Days = useCallback(() => {
    if (!today) return null;
    let result = [];
    let curr = new Date(today.year, today.month, today.date);
    const curMonth = curr.getMonth();

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;

      if (i === 1 && curr.getDay() === 0) {
        first = curr.getDate() - 6;
      }

      let day = new Date(curr.setDate(first));
      result.push({
        date: day.getDate(),
        day: day.getDay(),
        month: day.getMonth(),
        year: day.getFullYear(),
        isCurMonth: curMonth === day.getMonth()
      });
    }

    return result;
  }, [today]);

  const calendarHandle = useCallback(
    (direction) => {
      return () => {
        const dates = getMonthGridDates(direction);
        // console.log("dates - ", dates);
        setDates(dates);
      };
    },
    [setDates, getMonthGridDates]
  );

  return {current, jumpTo, next: calendarHandle(1), prev: calendarHandle(-1), dates, currDate: today, monthView, setMonthView}
}
