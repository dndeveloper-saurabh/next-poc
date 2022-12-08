const getMinuteValue = (timestamp) => {
  return (
    String(new Date(timestamp).getMinutes()) +
    String(new Date(timestamp).getHours())
  );
};

const groupMessages = (messages) => {
  let currentMinute = 0;
  let lastPosition = "bottom";

  for (let i = 0; i < messages?.length; i++) {
    currentMinute = getMinuteValue(messages[i]?.timestamp);
    let nextMsgMinute = 0;
    let prevMsgMinute = 0;
    if (i + 1 < messages.length) {
      nextMsgMinute = getMinuteValue(messages[i + 1]?.timestamp);
    } else {
      nextMsgMinute = "";
    }

    if (i > 0) {
      prevMsgMinute = getMinuteValue(messages[i - 1]?.timestamp);
    } else {
      prevMsgMinute = "";
    }

    // group messages logic
    if (messages[i] && messages[i].type !== "call_detail") {
      if (prevMsgMinute !== currentMinute && nextMsgMinute !== currentMinute) {
        messages[i]["position"] = "none";
        lastPosition = "bottom";
      } else if (currentMinute === nextMsgMinute && lastPosition === "bottom") {
        messages[i]["position"] = "top";
        lastPosition = "top";
      } else if (
        currentMinute === nextMsgMinute &&
        (lastPosition === "top" || lastPosition === "middle")
      ) {
        messages[i]["position"] = "middle";
        lastPosition = "middle";
      } else if (
        currentMinute !== nextMsgMinute &&
        (lastPosition === "top" || lastPosition === "middle")
      ) {
        messages[i]["position"] = "bottom";
        lastPosition = "bottom";
      } else if (currentMinute !== nextMsgMinute && i === messages.length - 1) {
        messages[i]["position"] = "bottom";
        lastPosition = "bottom";
      } else {
        messages[i]["position"] = "none";
        lastPosition = "bottom";
      }
    }
  }

  return messages;
};

export const groupBlazeMessages = (messages) => {
  let currentMinute = 0;
  let clusters = Array(messages.length * 2).fill(Array(0));
  let arrayIndex = 0;
  let prevFlag = false;

  for (let i = 0; i < messages?.length; i++) {
    let prevMsgMinute = 0;
    currentMinute = getMinuteValue(messages[i]?.timestamp);

    if (i > 0) {
      prevMsgMinute = getMinuteValue(messages[i - 1]?.timestamp);
    } else {
      prevMsgMinute = currentMinute;
    }

    if (messages[i]?.isByUser) {
      if (!prevFlag) {
        arrayIndex += 1;
        prevFlag = messages[i]?.isByUser;
      }

      if (currentMinute === prevMsgMinute) {
        clusters[arrayIndex] = [...clusters[arrayIndex], messages[i]];
      } else {
        arrayIndex += 1;
        clusters[arrayIndex] = [...clusters[arrayIndex], messages[i]];
      }
    } else {
      if (prevFlag) {
        arrayIndex += 1;
        prevFlag = messages[i]?.isByUser;
      }
      if (currentMinute === prevMsgMinute) {
        clusters[arrayIndex] = [...clusters[arrayIndex], messages[i]];
      } else {
        arrayIndex += 1;
        clusters[arrayIndex] = [...clusters[arrayIndex], messages[i]];
      }
    }
  }

  let groupedMessages = [];

  for (let i = 0; i < clusters.length; i++) {
    let groupedData = groupMessages(clusters[i]);
    groupedMessages = [...groupedMessages, ...groupedData];
  }
  return groupedMessages;
};

export const getGrade = (skill) => {
  const splitted = skill?.split("_");
  return "class_" + splitted[1];
};
