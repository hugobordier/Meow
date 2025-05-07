// import { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   SafeAreaView,
//   Platform,
// } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";
// import { Ionicons } from "@expo/vector-icons";
// import { StatusBar } from "expo-status-bar";

// // Types
// type LocationType = {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// };

// type RoutePoint = {
//   latitude: number;
//   longitude: number;
// };

// type MarkerType = {
//   id: string;
//   coordinate: {
//     latitude: number;
//     longitude: number;
//   };
//   title: string;
//   description: string;
// };

// const INITIAL_REGION = {
//   latitude: 48.8566,
//   longitude: 2.3522, // Paris
//   latitudeDelta: 0.0922,
//   longitudeDelta: 0.0421,
// };

// const Map = () => {
//   // Refs
//   const mapRef = useRef<MapView | null>(null);

//   // State
//   const [region, setRegion] = useState<LocationType>(INITIAL_REGION);
//   const [currentLocation, setCurrentLocation] = useState<RoutePoint | null>(
//     null
//   );
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Markers state
//   const [markers, setMarkers] = useState<MarkerType[]>([
//     {
//       id: "1",
//       coordinate: { latitude: 48.8584, longitude: 2.2945 },
//       title: "Eiffel Tower",
//       description: "Famous landmark in Paris",
//     },
//     {
//       id: "2",
//       coordinate: { latitude: 48.8606, longitude: 2.3376 },
//       title: "Louvre Museum",
//       description: "World's largest art museum",
//     },
//   ]);
//   const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

//   // Route state
//   const [startPoint, setStartPoint] = useState<RoutePoint | null>(null);
//   const [endPoint, setEndPoint] = useState<RoutePoint | null>(null);
//   const [routeCoordinates, setRouteCoordinates] = useState<RoutePoint[]>([]);

//   // Search state
//   const [searchText, setSearchText] = useState("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [isSearchingStart, setIsSearchingStart] = useState(true);

//   // Get user location on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setErrorMsg("Permission to access location was denied");
//           return;
//         }

//         setIsLoading(true);
//         const location = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.Balanced,
//         });

//         const userLocation = {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         };

//         setCurrentLocation(userLocation);
//         setStartPoint(userLocation);

//         setRegion({
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//       } catch (error) {
//         console.log("Error getting location:", error);
//         setErrorMsg("Could not get current location");
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   // Center map on user location
//   const centerOnUserLocation = async () => {
//     try {
//       setIsLoading(true);
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });

//       const userLocation = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       };

//       setCurrentLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(userLocation, 1000);
//       }
//     } catch (error) {
//       console.log("Error centering on location:", error);
//       setErrorMsg("Could not get current location");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Create a custom marker
//   const createCustomMarker = (latitude: number, longitude: number) => {
//     const newMarker: MarkerType = {
//       id: `custom-${Date.now()}`,
//       coordinate: { latitude, longitude },
//       title: `Custom Location ${markers.length + 1}`,
//       description: "Custom marker location",
//     };

//     setMarkers([...markers, newMarker]);
//     setSelectedMarker(newMarker);
//   };

//   // Search for locations
//   const searchAddress = (text: string) => {
//     if (text.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     setIsLoading(true);

//     // Mock search results
//     setTimeout(() => {
//       const mockResults = [
//         {
//           id: "1",
//           name: "Paris, France",
//           location: { latitude: 48.8566, longitude: 2.3522 },
//         },
//         {
//           id: "2",
//           name: "Marseille, France",
//           location: { latitude: 43.2965, longitude: 5.3698 },
//         },
//         {
//           id: "3",
//           name: "Lyon, France",
//           location: { latitude: 45.764, longitude: 4.8357 },
//         },
//         {
//           id: "4",
//           name: text + " Street, Paris",
//           location: {
//             latitude: 48.8566 + Math.random() * 0.02 - 0.01,
//             longitude: 2.3522 + Math.random() * 0.02 - 0.01,
//           },
//         },
//       ];

//       setSearchResults(mockResults);
//       setIsLoading(false);
//     }, 500);
//   };

//   // Handle search result selection
//   const handleSelectSearchResult = (result: any) => {
//     const selectedLocation = result.location;

//     if (isSearchingStart) {
//       setStartPoint(selectedLocation);
//     } else {
//       setEndPoint(selectedLocation);
//     }

//     // Clear search
//     setSearchText("");
//     setSearchResults([]);

//     // Move map to the selected location
//     if (mapRef.current) {
//       mapRef.current.animateToRegion(
//         {
//           ...selectedLocation,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         },
//         1000
//       );
//     }

//     // Calculate route if both points are set
//     if ((isSearchingStart && endPoint) || (!isSearchingStart && startPoint)) {
//       const start = isSearchingStart ? selectedLocation : startPoint;
//       const end = isSearchingStart ? endPoint : selectedLocation;
//       calculateRoute(start!, end!);
//     }
//   };

//   // Use current location as start or end point
//   const useCurrentLocationAs = async (type: "start" | "end") => {
//     if (!currentLocation) {
//       setErrorMsg("Current location not available");
//       return;
//     }

//     if (type === "start") {
//       setStartPoint(currentLocation);
//       if (endPoint) {
//         calculateRoute(currentLocation, endPoint);
//       }
//     } else {
//       setEndPoint(currentLocation);
//       if (startPoint) {
//         calculateRoute(startPoint, currentLocation);
//       }
//     }
//   };

//   // Calculate route between two points
//   const calculateRoute = (start: RoutePoint, end: RoutePoint) => {
//     setIsLoading(true);

//     try {
//       // Create a simple route with some intermediate points
//       const numPoints = 10;
//       const points: RoutePoint[] = [];

//       for (let i = 0; i <= numPoints; i++) {
//         const fraction = i / numPoints;

//         // Linear interpolation between start and end
//         const lat = start.latitude + (end.latitude - start.latitude) * fraction;
//         const lng =
//           start.longitude + (end.longitude - start.longitude) * fraction;

//         // Add some randomness to make it look like a real route
//         const jitter =
//           i > 0 && i < numPoints ? (Math.random() - 0.5) * 0.005 : 0;

//         points.push({
//           latitude: lat + jitter,
//           longitude: lng + jitter,
//         });
//       }

//       setRouteCoordinates(points);

//       // Fit map to show the entire route
//       if (points.length > 0 && mapRef.current) {
//         setTimeout(() => {
//           if (mapRef.current) {
//             mapRef.current.fitToCoordinates(points, {
//               edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//               animated: true,
//             });
//           }
//         }, 500);
//       }
//     } catch (error) {
//       console.log("Error calculating route:", error);
//       setErrorMsg("Could not calculate route");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUseCurrentLocationAs = async (type: "start" | "end") => {
//     if (!currentLocation) {
//       setErrorMsg("Current location not available");
//       return;
//     }

//     if (type === "start") {
//       setStartPoint(currentLocation);
//       if (endPoint) {
//         calculateRoute(currentLocation, endPoint);
//       }
//     } else {
//       setEndPoint(currentLocation);
//       if (startPoint) {
//         calculateRoute(startPoint, currentLocation);
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="auto" />

//       {/* Map */}
//       <View style={styles.mapContainer}>
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           initialRegion={region}
//           showsUserLocation={true}
//           showsMyLocationButton={false}
//           onLongPress={(e) =>
//             createCustomMarker(
//               e.nativeEvent.coordinate.latitude,
//               e.nativeEvent.coordinate.longitude
//             )
//           }
//         >
//           {/* Standard markers */}
//           {markers.map((marker) => (
//             <Marker
//               key={marker.id}
//               coordinate={marker.coordinate}
//               title={marker.title}
//               description={marker.description}
//               onPress={() => setSelectedMarker(marker)}
//             />
//           ))}

//           {/* Start point marker */}
//           {startPoint && (
//             <Marker coordinate={startPoint} pinColor="green" title="Start" />
//           )}

//           {/* End point marker */}
//           {endPoint && (
//             <Marker coordinate={endPoint} pinColor="red" title="Destination" />
//           )}

//           {/* Route line */}
//           {routeCoordinates.length > 0 && (
//             <Polyline
//               coordinates={routeCoordinates}
//               strokeWidth={4}
//               strokeColor="#4285F4"
//             />
//           )}
//         </MapView>
//       </View>

//       {/* Loading indicator */}
//       {isLoading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       )}

//       {/* Search bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder={
//               isSearchingStart
//                 ? "Search for starting point..."
//                 : "Search for destination..."
//             }
//             value={searchText}
//             onChangeText={(text) => {
//               setSearchText(text);
//               searchAddress(text);
//             }}
//           />
//           <TouchableOpacity
//             style={styles.searchTypeToggle}
//             onPress={() => setIsSearchingStart(!isSearchingStart)}
//           >
//             <Text style={styles.searchTypeText}>
//               {isSearchingStart ? "Start" : "Dest"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search results */}
//         {searchResults.length > 0 && (
//           <ScrollView style={styles.searchResults}>
//             {searchResults.map((result) => (
//               <TouchableOpacity
//                 key={result.id}
//                 style={styles.searchResultItem}
//                 onPress={() => handleSelectSearchResult(result)}
//               >
//                 <Text>{result.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}
//       </View>

//       {/* Current location button */}
//       <TouchableOpacity
//         style={styles.currentLocationButton}
//         onPress={centerOnUserLocation}
//       >
//         <Ionicons name="locate" size={24} color="black" />
//       </TouchableOpacity>

//       {/* Route controls */}
//       <View style={styles.routeControlsContainer}>
//         <TouchableOpacity
//           style={styles.routeButton}
//           onPress={() => handleUseCurrentLocationAs("start")}
//         >
//           <Text style={styles.routeButtonText}>Start from my location</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.routeButton}
//           onPress={() => handleUseCurrentLocationAs("end")}
//         >
//           <Text style={styles.routeButtonText}>End at my location</Text>
//         </TouchableOpacity>

//         {startPoint && endPoint && (
//           <TouchableOpacity
//             style={styles.routeButton}
//             onPress={() => calculateRoute(startPoint, endPoint)}
//           >
//             <Text style={styles.routeButtonText}>Calculate Route</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Selected marker info */}
//       {selectedMarker && (
//         <View style={styles.markerInfoContainer}>
//           <View style={styles.markerInfo}>
//             <View style={styles.markerInfoHeader}>
//               <View style={styles.markerInfoTextContainer}>
//                 <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
//                 <Text style={styles.markerDescription}>
//                   {selectedMarker.description}
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setSelectedMarker(null)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* Error message */}
//       {errorMsg && (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{errorMsg}</Text>
//           <TouchableOpacity onPress={() => setErrorMsg(null)}>
//             <Text style={styles.closeErrorText}>Dismiss</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Hint */}
//       <View style={styles.hintContainer}>
//         <Text style={styles.hintText}>Long press on map to add a marker</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   mapContainer: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   searchContainer: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 50 : 40,
//     left: 10,
//     right: 10,
//     backgroundColor: "white",
//     borderRadius: 8,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     zIndex: 1,
//   },
//   searchInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   searchInput: {
//     flex: 1,
//     height: 50,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//   },
//   searchTypeToggle: {
//     padding: 10,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 8,
//     marginRight: 5,
//   },
//   searchTypeText: {
//     fontWeight: "bold",
//   },
//   searchResults: {
//     maxHeight: 200,
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//   },
//   searchResultItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   currentLocationButton: {
//     position: "absolute",
//     bottom: 200,
//     right: 20,
//     backgroundColor: "white",
//     borderRadius: 30,
//     width: 60,
//     height: 60,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   routeControlsContainer: {
//     position: "absolute",
//     bottom: 20,
//     left: 10,
//     right: 10,
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 10,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   routeButton: {
//     backgroundColor: "#4285F4",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   routeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   markerInfoContainer: {
//     position: "absolute",
//     bottom: 120,
//     left: 10,
//     right: 10,
//     alignItems: "center",
//   },
//   markerInfo: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 15,
//     width: "100%",
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   markerInfoHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   markerInfoTextContainer: {
//     flex: 1,
//   },
//   markerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   markerDescription: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//   },
//   closeButtonText: {
//     color: "#4285F4",
//     fontWeight: "bold",
//   },
//   errorContainer: {
//     position: "absolute",
//     top: 120,
//     left: 10,
//     right: 10,
//     backgroundColor: "#ffcccc",
//     padding: 10,
//     borderRadius: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "#cc0000",
//   },
//   closeErrorText: {
//     color: "#cc0000",
//     fontWeight: "bold",
//   },
//   loadingContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.5)",
//   },
//   hintContainer: {
//     position: "absolute",
//     top: 110,
//     alignSelf: "center",
//     backgroundColor: "rgba(0,0,0,0.7)",
//     padding: 8,
//     borderRadius: 20,
//   },
//   hintText: {
//     color: "white",
//     fontSize: 12,
//   },
// });

// export default Map;
