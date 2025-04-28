import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  useColorScheme,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = 400;

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
}) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SHEET_HEIGHT / 3) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 h-full justify-end z-50">
      <TouchableOpacity
        className="absolute top-0 left-0 right-0 bottom-0 bg-black/40"
        onPress={onClose}
      />
      <Animated.View
        className={`rounded-t-3xl px-6 pb-8 shadow-xl ${
          isDark ? "bg-neutral-800" : "bg-white"
        }`}
        style={[
          {
            height: SHEET_HEIGHT,
            transform: [{ translateY }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 15,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View
          className={`h-2.5 w-20 rounded-full self-center mt-4 mb-5 ${
            isDark ? "bg-neutral-500" : "bg-neutral-300"
          }`}
        />
        <TouchableOpacity
          className="absolute top-3 right-4 p-4"
          onPress={onClose}
        >
          <Ionicons name="close" size={40} color={isDark ? "#aaa" : "#666"} />
        </TouchableOpacity>
        <View className="flex-1 mt-8">
          <View className="flex-1 justify-center">
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {children}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
