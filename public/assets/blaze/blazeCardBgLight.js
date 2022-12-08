import React from "react";

const BlazeCardBgLight = ({ color1, color2, sessionId }) => {
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
          id="radial-gradient"
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0" stopColor="#9187ff" />
          <stop offset="1" stopColor="#9187ff" stopOpacity="0.533" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-2"
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#ffa000" stopOpacity="0.71" />
          <stop offset="1" stopColor="#fdb946" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={"radial-gradient-3" + sessionId}
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="0" stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </radialGradient>
        <clipPath id="clip-blaze-card-bg-light">
          <rect width="750" height="366" />
        </clipPath>
      </defs>
      <g id="blaze-card-bg-light" clipPath="url(#clip-blaze-card-bg-light)">
        <ellipse
          id="Ellipse_1"
          data-name="Ellipse 1"
          cx="151.5"
          cy="145"
          rx="151.5"
          ry="145"
          transform="translate(-84 29)"
          fill="url(#radial-gradient)"
        />
        <circle
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="91"
          cy="91"
          r="91"
          transform="translate(295 168)"
          fill="url(#radial-gradient-2)"
        />
        <ellipse
          id="Ellipse_4"
          data-name="Ellipse 4"
          cx="164.5"
          cy="157"
          rx="164.5"
          ry="157"
          transform="translate(462 209)"
          fill={`url(#radial-gradient-3${sessionId})`}
        />
        <ellipse
          id="Ellipse_5"
          data-name="Ellipse 5"
          cx="147.5"
          cy="141"
          rx="147.5"
          ry="141"
          transform="translate(404 -131)"
          fill="url(#radial-gradient)"
        />
      </g>
    </svg>
  );
};

export default BlazeCardBgLight;
