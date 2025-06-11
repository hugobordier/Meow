// import dotenv from "dotenv";

// dotenv.config();

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/callback`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Environment Constants
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export const APP_SCHEME = "meow"; //meow en prod et avec expo go exp

export const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1f1b24" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#cfc2ff" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f1b24" }] },

  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#5e4b8b" }],
  },

  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2c2236" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#3a2d4a" }],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry",
    stylers: [{ color: "#433357" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "geometry",
    stylers: [{ color: "#4b3a60" }],
  },

  // 🌱 ZONES VERTES COMPLÉMENTAIRES
  {
    featureType: "poi.school",
    elementType: "geometry",
    stylers: [{ color: "#2b2438" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#2d2538" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#332a42" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#503d72" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3f3158" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#3a2f4c" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2a2139" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#322743" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#241a33" }],
  },

  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#352c44" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#192841" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a78bfa" }],
  },
];

export const lightMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4b4b4b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },

  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#e0e0e0" }],
  },

  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f3e5f5" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d0f0e0" }],
  },
  {
    featureType: "poi.sports_complex",
    elementType: "geometry",
    stylers: [{ color: "#e2f3ec" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "geometry",
    stylers: [{ color: "#f8f1ff" }],
  },

  // 🌿 ZONES VERTES COMPLÉMENTAIRES
  {
    featureType: "poi.school",
    elementType: "geometry",
    stylers: [{ color: "#f0f4f8" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#f5f0fa" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ebf5ec" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#f8f8f8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d0d0d0" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#f2f2f2" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dddddd" }],
  },

  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f1f1f1" }],
  },
  { featureType: "transit.station", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d7e9f7" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9edc" }],
  },
];
