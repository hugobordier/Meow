import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="welcome_id_verification" options={{ headerShown: false }} />
                <Stack.Screen name="id_card_verification" options={{ headerShown: false }} />
                <Stack.Screen name="rib_verification" options={{ headerShown: false }} />
                <Stack.Screen name="insurance_verification" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    );
};

export default Layout;