import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";

export const DogIcon = () => {
  return (
    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 15.5C4.5 15.5 3 14.5 3 12.5C3 10.5 4.5 9.5 4.5 9.5"
        stroke="#8B5A2B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M19.5 15.5C19.5 15.5 21 14.5 21 12.5C21 10.5 19.5 9.5 19.5 9.5"
        stroke="#8B5A2B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16Z"
        fill="#8B5A2B"
      />
      <Path
        d="M6 10.5C6 6.5 8 4.5 12 4.5C16 4.5 18 6.5 18 10.5"
        stroke="#8B5A2B"
        strokeWidth="1.5"
      />
      <Path
        d="M8 19.5L9.5 18.5L12 20L14.5 18.5L16 19.5"
        stroke="#FF6B6B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="13" r="1" fill="#000000" />
      <Circle cx="15" cy="13" r="1" fill="#000000" />
    </Svg>
  );
};

export const HouseIcon = () => {
  return (
    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5V20.5H21V10.5"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 3L2 10.5L22 10.5L12 3Z"
        fill="#4CAF50"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 20.5V15.5C9 14.3954 9.89543 13.5 11 13.5H13C14.1046 13.5 15 14.3954 15 15.5V20.5"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10.5V8.5"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M17 10.5V8.5"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <G transform="translate(-5, -2)">
        <Circle cx="10" cy="7" r="4" fill="#4CAF50" />
        <Path
          d="M8 5C8 5 9 8 12 8C15 8 16 5 16 5"
          stroke="#3A873A"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </G>
      <G transform="translate(5, -3)">
        <Circle cx="14" cy="8" r="3" fill="#4CAF50" />
        <Path
          d="M12 6.5C12 6.5 13 9 15 9C17 9 18 6.5 18 6.5"
          stroke="#3A873A"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};
