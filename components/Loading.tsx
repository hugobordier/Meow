import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  useColorScheme,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from "react-native";

interface FuturisticLoaderProps {
  // Text options
  text?: string;
  showText?: boolean;
  customTextStyle?: TextStyle;

  // Animation options
  animationDuration?: number;
  spinnerSpeed?: number;

  // Style options
  containerStyle?: ViewStyle;
  spinnerSize?: number;
  imageSize?: number;

  // Content options
  customImages?: ImageSourcePropType[];
  frameInterval?: number;

  // Colors
  lightModeColors?: {
    text: string;
    spinnerOuter: string;
    spinnerInner: string;
    background: string;
  };
  darkModeColors?: {
    text: string;
    spinnerOuter: string;
    spinnerInner: string;
    background: string;
  };
}

// Default sleeping animal frames
const defaultLoadingFrames = [
  require("@/assets/images/loading/sleeping-cat.png"),
  require("@/assets/images/loading/sleeping-dog-1.png"),
  require("@/assets/images/loading/sleeping-dog-2.png"),
];

const Loading: React.FC<FuturisticLoaderProps> = ({
  // Default values for all props
  text = "Chargement en cours...",
  showText = true,
  customTextStyle = {},
  animationDuration = 2000,
  spinnerSpeed = 2000,
  containerStyle = {},
  spinnerSize = 40,
  imageSize = 150,
  customImages,
  frameInterval = 800,
  lightModeColors = {
    text: "#333333",
    spinnerOuter: "#4169E1", // Royal blue
    spinnerInner: "#8A2BE2", // Blue violet
    background: "#f5f5f5",
  },
  darkModeColors = {
    text: "#ffffff",
    spinnerOuter: "#6A5ACD", // Slate blue
    spinnerInner: "#9370DB", // Medium purple
    background: "#121212",
  },
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const [currentLoadingFrame, setCurrentLoadingFrame] = useState(0);
  const rotation = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const loadingFrames = customImages || defaultLoadingFrames;

  const colors = isDarkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoadingFrame((prev) => (prev + 1) % loadingFrames.length);
    }, frameInterval);

    return () => clearInterval(interval);
  }, [loadingFrames, frameInterval]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: spinnerSpeed,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        containerStyle,
        { opacity: fadeAnim },
      ]}
    >
      <Image
        source={loadingFrames[currentLoadingFrame]}
        style={[styles.loadingImage, { width: imageSize, height: imageSize }]}
        resizeMode="contain"
      />

      {showText && (
        <Text
          style={[styles.loadingText, { color: colors.text }, customTextStyle]}
        >
          {text}
        </Text>
      )}

      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View
          style={[
            styles.svgContainer,
            { width: spinnerSize, height: spinnerSize },
          ]}
        >
          <View
            style={[
              styles.svgCircle,
              {
                backgroundColor: colors.spinnerOuter,
                width: spinnerSize,
                height: spinnerSize,
                borderRadius: spinnerSize / 2,
              },
            ]}
          />
          <View
            style={[
              styles.svgInnerCircle,
              {
                backgroundColor: colors.spinnerInner,
                width: spinnerSize / 2,
                height: spinnerSize / 2,
                borderRadius: spinnerSize / 4,
              },
            ]}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  loadingImage: {
    marginBottom: 20,
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  svgCircle: {
    position: "absolute",
  },
  svgInnerCircle: {
    position: "absolute",
  },
});

export default Loading;
