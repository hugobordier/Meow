import type { LatLng } from "@/types/type";

// This is a mock implementation. In a real app, you would use a routing API
// like OpenRouteService, OSRM, or MapBox Directions API
export const calculateRoute = async (
  origin: LatLng,
  destination: LatLng
): Promise<{
  coordinates: LatLng[];
  distance: string;
  duration: string;
}> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a simple route (straight line with some variation)
  const steps = 20;
  const coordinates: LatLng[] = [];

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;

    // Add some randomness to make it look like a real route
    const jitter = 0.0005 * (Math.random() - 0.5);

    coordinates.push({
      latitude:
        origin.latitude +
        (destination.latitude - origin.latitude) * fraction +
        jitter,
      longitude:
        origin.longitude +
        (destination.longitude - origin.longitude) * fraction +
        jitter,
    });
  }

  // Calculate approximate distance in kilometers
  const distance = calculateDistance(origin, destination);

  // Estimate duration (assuming average speed of 50 km/h)
  const durationMinutes = Math.round((distance / 50) * 60);

  return {
    coordinates,
    distance: `${distance.toFixed(1)} km`,
    duration: formatDuration(durationMinutes),
  };
};

// Calculate distance between two points using the Haversine formula
const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.latitude)) *
      Math.cos(deg2rad(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
};
