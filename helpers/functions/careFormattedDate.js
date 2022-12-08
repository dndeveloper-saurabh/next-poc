import { format } from "date-fns";
import differenceInCalendarWeeks from "date-fns/differenceInCalendarWeeks";


export const careFormattedDate = (timestamp) => {
  if (timestamp !== null && typeof timestamp !== "undefined") {
    const _chatDate = +new Date(timestamp).getDate();
    const _chatMonth = +new Date(timestamp).getMonth();

    const _date = +new Date().getDate();
    const _month = +new Date().getMonth();
    const _weekDiff = differenceInCalendarWeeks(
      new Date(),
      new Date(timestamp)
    );

    if (_chatDate === _date) {
      return (
        format(new Date(timestamp), "h") +
        ":" +
        format(new Date(timestamp), "mm") +
        " " +
        format(new Date(timestamp), "aaa")
      );
    } else if ((_chatDate < _date || _chatMonth < _month) && _weekDiff === 0) {
      return (
        format(new Date(timestamp), "cccc") +
        ", " +
        format(new Date(timestamp), "h") +
        ":" +
        format(new Date(timestamp), "mm") +
        " " +
        format(new Date(timestamp), "aaa")
      );
    } else if (_weekDiff > 0) {
      return (
        format(new Date(timestamp), "MMMM") +
        " " +
        _chatDate +
        ", " +
        format(new Date(timestamp), "yyyy") +
        " at " +
        format(new Date(timestamp), "h") +
        ":" +
        format(new Date(timestamp), "mm") +
        String(format(new Date(timestamp), "aaa")).toLowerCase()
      );
    }
  } else
    return (
      format(new Date(), "h") +
      ":" +
      format(new Date(), "mm") +
      " " +
      format(new Date(), "aaa")
    );
};
