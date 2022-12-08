export const formatBillDuration = (time) => {
  // Hours, minutes and seconds
  let hrs = ~~(time / 3600);
  let mins = ~~((time % 3600) / 60);
  let secs = ~~time % 60;

  // Output "1:01" or "4:03:59" or "123:03:59"

  let formattedTime = "";
  if (hrs > 0) {
    formattedTime += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  formattedTime +=
    "" + String(mins).padStart(2, "0") + ":" + (secs < 10 ? "0" : "");
  formattedTime += "" + secs;

  return formattedTime;
};
