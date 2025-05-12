import type React from "react";
import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomSheetPropsMap {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  price: number;
  onShowRoute: () => void;
  isRouteVisible: boolean;
  onHideRoute: () => void;
  children?: React.ReactNode;
}

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.3;

const BottomSheetMap: React.FC<BottomSheetPropsMap> = ({
  isVisible,
  onClose,
  title,
  price,
  onShowRoute,
  isRouteVisible,
  onHideRoute,
  children,
}) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : SHEET_HEIGHT,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isVisible, translateY]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.handle} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}€</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{children}</View>

      {!isRouteVisible ? (
        <TouchableOpacity style={styles.routeButton} onPress={onShowRoute}>
          <Ionicons
            name="navigate"
            size={18}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.routeButtonText}>Afficher l'itinéraire</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.routeButton, styles.clearRouteButton]}
          onPress={onHideRoute}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.routeButtonText}>Masquer l'itinéraire</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    height: SHEET_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  routeButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  clearRouteButton: {
    backgroundColor: "#ef4444",
  },
  routeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default BottomSheetMap;
