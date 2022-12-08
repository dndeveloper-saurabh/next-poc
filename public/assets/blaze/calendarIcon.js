import React from "react";

const CalendarIcon = ({ color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill={color}
      stroke={color}
      className={className}
    >
      <path
        d="M 452,40 H 428 V 0 H 388 V 40 H 124 V 0 H 84 V 40 H 60 C 26.916,40 0,66.916 0,100 v 352 c 0,33.084 26.916,60 60,60 H 344.506 L 512,338.064 V 100 C 512,66.916 485.084,40 452,40 Z M 356,442.397 V 370 c 0,-11.028 8.972,-20 20,-20 h 68.975 z M 472,310 h -96 c -33.084,0 -60,26.916 -60,60 V 472 H 60 C 48.972,472 40,463.028 40,452 V 188 h 432 z m 0,-162 H 40 V 100 C 40,88.972 48.972,80 60,80 h 24 v 40 h 40 V 80 h 264 v 40 h 40 V 80 h 24 c 11.028,0 20,8.972 20,20 z"
        id="path2557"
        strokeWidth={12}
        stroke={color}
      />
    </svg>
  );
};

export default CalendarIcon;
