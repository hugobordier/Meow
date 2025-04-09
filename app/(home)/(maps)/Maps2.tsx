"use client";

import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@/components/SearchBar";
import { BottomSheet } from "@/components/BottomSheet";
import { RouteInfo } from "@/components/RouteInfo";
import { MarkerButton } from "@/components/MarkerButton";
import type { LatLng } from "@/types/type";
import { WebView } from "react-native-webview";

export default function Maps2() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Send location to WebView
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          setUserLocation(${currentLocation.coords.latitude}, ${currentLocation.coords.longitude});
          true;
        `);
      }
    })();
  }, []);

  useEffect(() => {
    if (location && destination) {
      // Calculate route in WebView
      webViewRef.current?.injectJavaScript(`
        calculateRoute(
          [${location.coords.longitude}, ${location.coords.latitude}],
          [${destination.longitude}, ${destination.latitude}]
        );
        true;
      `);
    }
  }, [location, destination]);

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "mapClick":
          handleMapClick(data.latitude, data.longitude);
          break;
        case "routeCalculated":
          setRouteInfo({
            distance: data.distance,
            duration: data.duration,
          });
          setIsBottomSheetVisible(true);
          break;
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  const handleMapClick = (latitude: number, longitude: number) => {
    if (isAddingMarker) {
      const newMarker = { latitude, longitude };
      setMarkers([...markers, newMarker]);

      // Add marker in WebView
      webViewRef.current?.injectJavaScript(`
        addMarker(${latitude}, ${longitude}, 'Marker ${
        markers.length + 1
      }', 'green');
        true;
      `);

      setIsAddingMarker(false);
    } else if (!destination) {
      const newDestination = { latitude, longitude };
      setDestination(newDestination);

      // Add destination in WebView
      webViewRef.current?.injectJavaScript(`
        addMarker(${latitude}, ${longitude}, 'Destination', 'red');
        true;
      `);
    }
  };

  const clearRoute = () => {
    setDestination(null);
    setRouteInfo(null);
    setIsBottomSheetVisible(false);

    // Clear route in WebView
    webViewRef.current?.injectJavaScript(`
      clearRoute();
      true;
    `);
  };

  const centerOnUserLocation = () => {
    if (location) {
      // Center map in WebView
      webViewRef.current?.injectJavaScript(`
        centerMap(${location.coords.latitude}, ${location.coords.longitude});
        true;
      `);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    // Search in WebView
    webViewRef.current?.injectJavaScript(`
      searchLocation("${searchQuery}");
      true;
    `);
  };

  // HTML content for the WebView with OpenStreetMap and MapLibre GL
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Map</title>
      <link href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
      <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      
      <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
      <script>
        // Initialize map
        const map = new maplibregl.Map({
          container: 'map',
          style: {
            version: 8,
            sources: {
              'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm',
                minzoom: 0,
                maxzoom: 19
              }
            ],
            // Waze-like style customizations
            glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
            transition: {
              duration: 300,
              delay: 0
            }
          },
          center: [2.3522, 48.8566], // Default to Paris
          zoom: 13
        });
        
        // Apply Waze-like styling
        map.on('load', function() {
          // Customize map appearance to look more like Waze
          map.setPaintProperty('osm-tiles', 'raster-opacity', 0.8);
          map.setPaintProperty('osm-tiles', 'raster-brightness-max', 0.9);
          map.setPaintProperty('osm-tiles', 'raster-saturation', 0.2);
          
          // Add custom layer for roads if needed
          // This would require vector tiles, which is more complex
        });
        
        // User location marker
        let userMarker = null;
        
        // Set user location and add marker
        function setUserLocation(lat, lng) {
          if (userMarker) {
            userMarker.remove();
          }
          
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = 'rgba(63, 81, 181, 0.2)';
          el.style.display = 'flex';
          el.style.justifyContent = 'center';
          el.style.alignItems = 'center';
          
          const dot = document.createElement('div');
          dot.style.width = '12px';
          dot.style.height = '12px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = '#3F51B5';
          el.appendChild(dot);
          
          userMarker = new maplibregl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);
          
          map.flyTo({
            center: [lng, lat],
            zoom: 15,
            speed: 1.5
          });
        }
        
        // Add a marker to the map
        function addMarker(lat, lng, title, color) {
          const el = document.createElement('div');
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = color === 'red' ? '#FF5722' : '#4CAF50';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          
          new maplibregl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup().setText(title))
            .addTo(map);
        }
        
        // Center map on coordinates
        function centerMap(lat, lng) {
          map.flyTo({
            center: [lng, lat],
            zoom: 15,
            speed: 1.5
          });
        }
        
        // Route line
        let routeLine = null;
        
        // Calculate route between two points
        function calculateRoute(start, end) {
          // In a real app, you would use a routing API like OSRM or GraphHopper
          // For this example, we'll create a simple straight line with some variation
          
          // Clear previous route
          clearRoute();
          
          // Generate route points (simplified for demo)
          const steps = 20;
          const coordinates = [];
          
          for (let i = 0; i <= steps; i++) {
            const fraction = i / steps;
            
            // Add some randomness to make it look like a real route
            const jitter = 0.0005 * (Math.random() - 0.5);
            
            coordinates.push([
              start[0] + (end[0] - start[0]) * fraction + jitter,
              start[1] + (end[1] - start[1]) * fraction + jitter
            ]);
          }
          
          // Add route line to map
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          });
          
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3F51B5',
              'line-width': 5
            }
          });
          
          // Calculate approximate distance in kilometers
          const distance = calculateDistance(
            [start[1], start[0]],
            [end[1], end[0]]
          );
          
          // Estimate duration (assuming average speed of 50 km/h)
          const durationMinutes = Math.round((distance / 50) * 60);
          
          // Send route info back to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'routeCalculated',
            distance: distance.toFixed(1) + ' km',
            duration: formatDuration(durationMinutes)
          }));
        }
        
        // Clear route from map
        function clearRoute() {
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          
          if (map.getSource('route')) {
            map.removeSource('route');
          }
        }
        
        // Calculate distance between two points using the Haversine formula
        function calculateDistance(point1, point2) {
          const [lat1, lon1] = point1;
          const [lat2, lon2] = point2;
          
          const R = 6371; // Earth's radius in km
          const dLat = deg2rad(lat2 - lat1);
          const dLon = deg2rad(lon2 - lon1);
          
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        }
        
        function deg2rad(deg) {
          return deg * (Math.PI / 180);
        }
        
        function formatDuration(minutes) {
          if (minutes < 60) {
            return minutes + ' min';
          }
          
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          
          if (remainingMinutes === 0) {
            return hours + ' h';
          }
          
          return hours + ' h ' + remainingMinutes + ' min';
        }
        
        // Search for a location using Nominatim
        function searchLocation(query) {
          fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => {
              if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                
                // Center map on result
                map.flyTo({
                  center: [lon, lat],
                  zoom: 15,
                  speed: 1.5
                });
                
                // Add marker for result
                addMarker(lat, lon, result.display_name, 'red');
                
                // Send coordinates back to React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'searchResult',
                  latitude: lat,
                  longitude: lon,
                  name: result.display_name
                }));
              }
            })
            .catch(error => {
              console.error('Error searching location:', error);
            });
        }
        
        // Handle map clicks
        map.on('click', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.map}
        onMessage={handleWebViewMessage}
        geolocationEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* Search bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onClear={() => setSearchQuery("")}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={24} color="#3F51B5" />
        </TouchableOpacity>

        <MarkerButton
          isActive={isAddingMarker}
          onPress={() => setIsAddingMarker(!isAddingMarker)}
        />

        {routeInfo && (
          <TouchableOpacity style={styles.controlButton} onPress={clearRoute}>
            <Ionicons name="close-circle" size={24} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>

      {/* Route information bottom sheet */}
      {routeInfo && (
        <BottomSheet
          visible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
        >
          <RouteInfo
            distance={routeInfo.distance}
            duration={routeInfo.duration}
            onStartNavigation={() => {
              // Start navigation
              webViewRef.current?.injectJavaScript(`
                // Start navigation mode
                true;
              `);
            }}
          />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "transparent",
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
