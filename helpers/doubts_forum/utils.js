function getDateStringServ(timestamp) {
  const plus0 = (num) => `0${num.toString()}`.slice(-2);
  const d = new Date(timestamp);
  const date = plus0(d.getDate());
  const monthTmp = d.getMonth() + 1;
  return `${months[monthTmp]} ${getNumberWithOrdinal(date)}`;
}

function getNumberWithOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const months = [
  "Unknown",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var periods = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

function formatTime(timeCreated) {
  var diff = Date.now() - timeCreated;

  if (diff > periods.week) {
    return Math.floor(diff / periods.week) + "w";
  } else if (diff > periods.day) {
    return Math.floor(diff / periods.day) + "d";
  } else if (diff > periods.hour) {
    return Math.floor(diff / periods.hour) + "h";
  } else if (diff > periods.minute) {
    return Math.floor(diff / periods.minute) + "m";
  } else if (diff > periods.second) {
    return Math.floor(diff / periods.second) + "s";
  }
  return "Just now";
}

function futureformatTime(timeStamp) {
  var diff = timeStamp - Date.now();

  if (diff > periods.week) {
    return Math.floor(diff / periods.week) + "w";
  } else if (diff > periods.day) {
    return Math.floor(diff / periods.day) + "d";
  } else if (diff > periods.hour) {
    return Math.floor(diff / periods.hour) + "h";
  } else if (diff > periods.minute) {
    return Math.floor(diff / periods.minute) + "m";
  } else if (diff > periods.second) {
    return Math.floor(diff / periods.second) + "s";
  }
  return "Just now";
}

export function futureTimeFormat(timeStamp) {
  var diff = timeStamp - Date.now();

  var w = 0,
    d = 0,
    h = 0,
    m = 0,
    s = 0;
  if (diff > periods.week) {
    w = Math.floor(diff / periods.week);
  } else if (diff > periods.day) {
    d = Math.floor(diff / periods.day);
  } else if (diff > periods.hour) {
    h = Math.floor(diff / periods.hour);
  } else if (diff > periods.minute) {
    m = Math.floor(diff / periods.minute);
  } else if (diff > periods.second) {
    s = Math.floor(diff / periods.second);
  }
  return [w, d, h, m, s];
}

const generateUrlFromString = (string) => {
  string = string
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-");

  if (string.charAt(string.length - 1) === "-") {
    string = string.substr(0, string.length - 1);
  }

  return string;
};

const generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function splitLongString(str, length) {
  var regex = new RegExp("/(w{" + length + "})(?=w)/g");
  return str.replace(regex, "$1 ");
}

const numReaderFriendlyFormat = (number, decPlaces) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index.js to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
};

export {
  getDateStringServ,
  formatTime,
  generateUrlFromString,
  generateRandomString,
  splitLongString,
  numReaderFriendlyFormat,
  futureformatTime,
};
