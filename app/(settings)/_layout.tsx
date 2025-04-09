import Header from "@/components/header";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
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
