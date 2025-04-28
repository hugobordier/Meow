import { useEffect } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Href, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

export enum AnimationType {
  FADE = "fade",
  SLIDE = "slide",
  SCALE = "scale",
}

interface AnimatedButtonProps {
  text?: string;
  route?: Href;
  visible?: boolean;
  animationType?: AnimationType;
  style?: StyleProp<ViewStyle>;
  color?: string; // <-- Ici
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text = "Cliquez ici",
  route = "/",
  visible = true,
  animationType = AnimationType.SLIDE,
  style = {},
  color = "#3498db", // <-- Ici aussi
}) => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50);
      scale.value = withTiming(0.8);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case "fade":
        return { opacity: opacity.value };
      case "slide":
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      case "scale":
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
      default:
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }, { scale: scale.value }],
        };
    }
  });

  const handlePress = () => {
    router.replace(route as Href);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        style={[styles.button, { backgroundColor: color }, style]}
        onPress={handlePress}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    marginVertical: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AnimatedButton;
