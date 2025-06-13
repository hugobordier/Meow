import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  "The action 'POP_TO_TOP' was not handled by any navigator",
    "Warning: useInsertionEffect must not schedule updates.",
]);
const Layout = () => {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="homePage" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="HandleCreateAccountPetSitter"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(id_verification)"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default Layout;
