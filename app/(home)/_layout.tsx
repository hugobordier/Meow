import BottomNavBar from "@/components/BottomNavBar";
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("onBoarding");

  return (
    <SafeAreaProvider>
      <View className="flex-1">
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
  );
};

export default Layout;
