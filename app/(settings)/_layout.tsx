import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/header";
import useFantinMusic from "@/hooks/useFantinMode";
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  useFantinMusic();

  return (
    <>
      <Header />
      <SafeAreaProvider>
        <View className="flex-1">
          <Stack>
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </>
  );
};

export default Layout;
