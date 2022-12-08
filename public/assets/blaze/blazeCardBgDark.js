import React from "react";

const BlazeCardBgDark = ({ color1, color2, sessionId }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="750"
      height="366"
      viewBox="0 0 750 366"
    >
      <defs>
        <radialGradient
          id={"radial-gradient" + sessionId}
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0" stopColor={color1} />
          <stop offset="1" stopColor={color2} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-2"
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#ffa000" />
          <stop offset="1" stopColor="#fdb946" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-3"
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#1976d2" />
          <stop offset="1" stopColor="#2d8ff2" stopOpacity="0" />
        </radialGradient>
        <clipPath id="clip-blaze-card-bg-dark">
          <rect width="750" height="366" />
        </clipPath>
      </defs>
      <g id="blaze-card-bg-dark" clipPath="url(#clip-blaze-card-bg-dark)">
        <ellipse
          id="Ellipse_1"
          data-name="Ellipse 1"
          cx="215.5"
          cy="204.5"
          rx="215.5"
          ry="204.5"
          transform="translate(470 90)"
          fill={`url(#radial-gradient${sessionId})`}
        />
        <circle
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="101.5"
          cy="101.5"
          r="101.5"
          transform="translate(262 225)"
          fill="url(#radial-gradient-2)"
        />
        <circle
          id="Ellipse_3"
          data-name="Ellipse 3"
          cx="132"
          cy="132"
          r="132"
          transform="translate(287 -81)"
          fill="url(#radial-gradient-3)"
        />
      </g>
    </svg>
  );
};

export default BlazeCardBgDark;
