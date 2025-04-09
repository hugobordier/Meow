import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/header";
import useFantinMusic from "@/hooks/useFantinMode";
import { Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Layout = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("onBoarding");
  useFantinMusic();

  const bottomPadding = insets.bottom + 64;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <>
      {!isOnboarding && <Header />}
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            paddingBottom: isKeyboardVisible ? 0 : bottomPadding,
          }}
        >
          <Stack>
            <Stack.Screen
              name="(main)"
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
              name="(maps)"
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false, animation: "none" }}
            />
          </Stack>

          {!isOnboarding && <BottomNavBar />}
        </View>
      </SafeAreaProvider>
    </>
  );
};

export default Layout;
