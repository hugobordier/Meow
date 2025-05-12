import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Marker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  title: string;
}

interface LeafletMapProps {
  initialLocation?: { lat: number; lng: number };
  initialZoom?: number;
  markers?: Marker[];
  onMarkerPress?: (marker: Marker) => void;
}

const LeafletMap = React.forwardRef<
  {
    centerMap: (lat: number, lng: number, zoom?: number) => void;
    showRoute: (
      start: { lat: number; lng: number },
      end: { lat: number; lng: number }
    ) => void;
    clearRoute: () => void;
    updateUserLocation?: (
      lat: number,
      lng: number,
      accuracy?: number,
      heading?: number
    ) => void;
  },
  LeafletMapProps
>(
  (
    {
      initialLocation = { lat: 48.8566, lng: 2.3522 }, // Paris by default
      initialZoom = 13,
      markers = [],
      onMarkerPress,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate the HTML with the markers data embedded
    const generateHTML = () => {
      const markersJSON = JSON.stringify(markers);

      return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" 
        />
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          .price-marker {
            background-color: white;
            color: #3b82f6;
            border-radius: 8px;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          }
          .leaflet-routing-container {
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-height: 300px;
            overflow-y: auto;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
        <script>
          // Initialize map
          var map = L.map('map', {
  zoomControl: false,         
  attributionControl: false   
}).setView([${initialLocation.lat}, ${initialLocation.lng}], ${initialZoom});
          
          // User location marker with heading
          var userMarker = null;
          var userAccuracy = null;
          
          function updateUserLocation(lat, lng, accuracy, heading) {
            if (userAccuracy) {
              map.removeLayer(userAccuracy);
            }
            
            if (userMarker) {
              map.removeLayer(userMarker);
            }
            
            // Accuracy circle
            userAccuracy = L.circle([lat, lng], {
              radius: accuracy,
              color: 'rgba(59, 130, 246, 0.2)',
              fillColor: 'rgba(59, 130, 246, 0.1)',
              fillOpacity: 0.5
            }).addTo(map);
            
            // User marker with rotation
            var userIcon = L.divIcon({
              className: 'user-marker-container',
              html: '<div style="background-color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: rotate(' + heading + 'deg);">' +
                    '<div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 16px solid #3b82f6; transform: translateY(-2px);"></div>' +
                    '</div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            
            userMarker = L.marker([lat, lng], {
              icon: userIcon
            }).addTo(map);
          }
          
          // Create price marker function
          function createPriceMarker(price) {
            return L.divIcon({
              className: 'price-marker',
              html: '<div>$' + price + '</div>',
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            });
          }
          
          // Add tile layer
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);
          
          // Add markers with clustering
          var markersData = ${markersJSON};
          var leafletMarkers = {};
          var markerCluster = L.markerClusterGroup();
          
          markersData.forEach(function(marker) {
            var m = L.marker([marker.lat, marker.lng], {
              icon: createPriceMarker(marker.price)
            });
            
            m.bindPopup(marker.title);
            
            m.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerClick',
                marker: marker
              }));
            });
            
            leafletMarkers[marker.id] = m;
            markerCluster.addLayer(m);
          });
          
          map.addLayer(markerCluster);
          
          // Routing control (initially hidden)
          var routingControl = null;
          
          // Handle messages from React Native
          window.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
              case 'centerMap':
                map.setView([data.lat, data.lng], data.zoom || map.getZoom());
                break;
                
              case 'showRoute':
                if (routingControl) {
                  map.removeControl(routingControl);
                }
                
                routingControl = L.Routing.control({
                  waypoints: [
                    L.latLng(data.start.lat, data.start.lng),
                    L.latLng(data.end.lat, data.end.lng)
                  ],
                  routeWhileDragging: true,
                  showAlternatives: true,
                  lineOptions: {
                    styles: [{ color: '#3b82f6', weight: 6 }]
                  }
                }).addTo(map);
                break;
                
              case 'clearRoute':
                if (routingControl) {
                  map.removeControl(routingControl);
                  routingControl = null;
                }
                break;
                
              case 'updateUserLocation':
                updateUserLocation(data.lat, data.lng, data.accuracy || 10, data.heading || 0);
                break;
            }
          });
          
          // Notify React Native that the map is ready
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapReady'
          }));
        </script>
      </body>
    </html>
    `;
    };

    // Handle messages from WebView
    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "mapReady":
            setIsLoaded(true);
            break;

          case "markerClick":
            if (onMarkerPress) {
              onMarkerPress(data.marker);
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error);
      }
    };

    // Function to safely send messages to WebView
    const sendMessageToWebView = (message: any) => {
      if (webViewRef.current && webViewRef.current.injectJavaScript) {
        const injectedJavaScript = `
          (function() {
            window.dispatchEvent(new MessageEvent('message', {
              data: '${JSON.stringify(message).replace(/'/g, "\\'")}'
            }));
            true;
          })();
        `;
        webViewRef.current.injectJavaScript(injectedJavaScript);
      }
    };

    // Center map to a specific location
    const centerMap = (lat: number, lng: number, zoom?: number) => {
      sendMessageToWebView({
        type: "centerMap",
        lat,
        lng,
        zoom,
      });
    };

    // Show route between two points
    const showRoute = (
      start: { lat: number; lng: number },
      end: { lat: number; lng: number }
    ) => {
      sendMessageToWebView({
        type: "showRoute",
        start,
        end,
      });
    };

    // Clear the current route
    const clearRoute = () => {
      sendMessageToWebView({
        type: "clearRoute",
      });
    };

    // Update user location
    const updateUserLocation = (
      lat: number,
      lng: number,
      accuracy?: number,
      heading?: number
    ) => {
      sendMessageToWebView({
        type: "updateUserLocation",
        lat,
        lng,
        accuracy: accuracy || 10,
        heading: heading || 0,
      });
    };

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
      centerMap,
      showRoute,
      clearRoute,
      updateUserLocation,
    }));

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: generateHTML() }}
          style={styles.map}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
});

export default LeafletMap;
