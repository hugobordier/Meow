import {
  View,
  Pressable,
  Text,
  useColorScheme,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter, usePathname, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSocket } from "@/services/socket";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Route = {
  name: string;
  path: Href;
  icon: IconName;
  activeIcon: IconName;
};

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, []);

  const routes: Route[] = [
    {
      name: "Home",
      path: "/(home)/(main)/home",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      name: "Maps",
      path: "/(home)/(maps)/Maps",
      icon: "map-outline",
      activeIcon: "map",
    },
    {
      name: "Menu",
      path: "/(home)/(petsitter)/PetSitterPage",
      icon: "menu-outline",
      activeIcon: "menu",
    },
    {
      name: "Chat",
      path: "/(discussion)/chatScreen",
      icon: "chatbubble-outline",
      activeIcon: "chatbubble",
    },
    {
      name: "Profile",
      path: "/(home)/(profil)/profil",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: isDarkMode ? "#111827" : "#fdf4ff",
          borderTopColor: isDarkMode ? "#1f2937" : "#e5e7eb",
          paddingBottom: Math.max((insets.bottom * 7) / 10, 10),
          display: isKeyboardVisible ? "none" : "flex",
        },
      ]}
    >
      {routes.map((route) => {
        const isActive = route.path.toString().includes(pathname);

        return (
          <Pressable
            key={route.name}
            onPress={() => {
              if (route.name === "Chat") {
                const socket = getSocket();
                if (socket) {
                  console.log("🔌 Socket connecté ?", socket.connected);
                  if (socket.connected) {
                    console.log("✅ Le socket est bien connecté !");
                  } else {
                    console.log("❌ Le socket est PAS connecté !");
                  }
                } else {
                  console.log("⚠️ Aucun socket actif (null)");
                }
              }

              router.push(route.path as Href);
            }}
            style={[styles.tab]}
          >
            <Ionicons
              name={isActive ? route.activeIcon : route.icon}
              size={isActive ? 22 : 18}
              color={
                isActive
                  ? isDarkMode
                    ? "#60a5fa"
                    : "#2563eb"
                  : isDarkMode
                  ? "#d1d5db"
                  : "#6b7280"
              }
            />
            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: isActive ? "700" : "400",
                color: isActive
                  ? isDarkMode
                    ? "#bfdbfe"
                    : "#1d4ed8"
                  : isDarkMode
                  ? "#d1d5db"
                  : "#4b5563",
              }}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    flex: 1,
  },
});
