function isValidYouTubeUrl(url) {
  if (url !== undefined || url !== "") {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url?.match(regExp);
    if (match && match[2].length === 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
      return true;
    } else {
      return false;
    }
  }
}

function youTubeGetID(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

export { isValidYouTubeUrl, youTubeGetID };
