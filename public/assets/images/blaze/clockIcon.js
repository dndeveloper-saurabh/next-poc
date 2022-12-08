import React from "react";

const ClockIcon = ({ color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      className={className}
    >
      <path
        d="M 12,2.247191 A 9.752809,9.752809 0 1 0 21.752809,12 9.764335,9.764335 0 0 0 12,2.247191 Z m 0,17.73238 A 7.979571,7.979571 0 1 1 19.979571,12 7.9893238,7.9893238 0 0 1 12,19.979571 Z"
        id="path833"
        style={{ strokeWidth: 0.4, stroke: color }}
      />
      <path
        d="M 12.886619,11.63294 V 6.680286 a 0.886619,0.886619 0 0 0 -1.773238,0 V 12 a 0.886619,0.886619 0 0 0 0.259779,0.62684 l 2.659857,2.659857 a 0.886619,0.886619 0 0 0 1.25368,-1.25368 z"
        id="path835"
        style={{ strokeWidth: 0.4, stroke: color }}
      />
    </svg>
  );
};

export default ClockIcon;
