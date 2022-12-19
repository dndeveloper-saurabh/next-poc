const showSnackbar = (label, severity, heading) => {
  // setting 5 seconds  timeout so that no other snackbar can show for 5 seconds
  var snackbar_div = document.getElementById("snackbar");
  if (snackbar_div.className === "") {
    // Get the snackbar DIV

    var snackbar_label = document.getElementById("snackbar__label");
    var snackbar_icon = document.getElementById("snackbar__icon");

    // Add the "show" class to DIV
    if (severity === "grace") {
      snackbar_div.className = "showgrace";
    } else {
      snackbar_div.className = "show";
    }
    snackbar_label.textContent = label;

    if(heading) {
      const snackbar_header = document.getElementById("snackbar__heading");
      snackbar_header.textContent = heading;
    }

    switch (severity) {
      case "server-error":
        snackbar_div.style.backgroundColor = "#F44335";
        snackbar_icon.className = "fa fa-server fa-lg";
        break;
      case "trash":
        snackbar_div.style.backgroundColor = "#F44335";
        snackbar_icon.className = "fa fa-trash fa-lg";
        break;
      case "error":
        snackbar_div.style.backgroundColor = "#F44335";
        snackbar_icon.className = "fa fa-bug fa-lg";
        break;
      case "warning":
        snackbar_div.style.backgroundColor = "#FF9800";
        snackbar_icon.className = "fa fa-exclamation-triangle fa-lg";
        break;
      case "grace":
        snackbar_div.style.backgroundColor = "#FF9800";
        snackbar_icon.className = "fa fa-exclamation-triangle fa-lg";
        break;
      case "info":
        snackbar_div.style.backgroundColor = "#2096F3";
        snackbar_icon.className = "fa fa-info-circle fa-lg";
        break;
      case "success":
        snackbar_div.style.backgroundColor = "#4BB04F";
        snackbar_icon.className = "fa fa-check-circle fa-lg";
        break;
      default:
        snackbar_div.style.backgroundColor = "#333";
        snackbar_icon.className = "fa fa-info-circle fa-lg";
    }

    if (severity === "grace") {
      return setTimeout(function () {
        // After 4 seconds, remove the show class from DIV
        snackbar_div.className = "";
      }, 10000);
    } else {
      setTimeout(function () {
        // After 4 seconds, remove the show class from DIV
        snackbar_div.className = "";
      }, 4000);
    }
  }
};

export { showSnackbar };
