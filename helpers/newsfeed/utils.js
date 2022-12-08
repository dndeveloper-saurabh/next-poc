const removeAtIndex = (array, index) => {
  var _array = array;

  if (_array.length === 1) {
    return [];
  } else {
    _array.splice(index, 1);
    return _array;
  }
};

function getVideoCover(file, seekTo = 1.0) {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement("video");
    videoPlayer.setAttribute("src", file);
    videoPlayer.load();
    videoPlayer.addEventListener("error", (ex) => {
      reject("error when loading video file", ex);
      return false;
    });
    videoPlayer.addEventListener("loadedmetadata", () => {
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return false;
      }
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      videoPlayer.addEventListener("seeked", () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.75 /* quality */
          );
        } catch (err) {
          reject("VIDEO IS NOT SUPPORTED");
          return false;
        }
      });
    });
  }).catch((e) => {
    return false;
  });
}

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}

const linkParser = new RegExp(
  "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
);

const getYoutubeID = (url) => {
  var regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  var match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : false;
};

export { removeAtIndex, getVideoCover, debounce, linkParser, getYoutubeID };
