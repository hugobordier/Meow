import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomNavBar from "@/components/BottomNavBar";

const Layout = () => {
  return (
    <SafeAreaProvider>
      <Stack >
        <Stack.Screen name="chatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="chatDialogue" options={{ headerShown: false }} />

      </Stack>
      <BottomNavBar/>
    </SafeAreaProvider>
    
  );
};

export default Layout;
