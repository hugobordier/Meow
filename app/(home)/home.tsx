import { useAuthContext } from "@/context/AuthContext";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <SafeAreaView className=" bg-red-600 h-screen flex items-center justify-center">
      <Text className="p-4">Bonjour {user?.username}</Text>
      <Link href="/(auth)/homePage">
        {" "}
        Aller au a la page de premier connexion , button a supr
      </Link>
    </SafeAreaView>
  );
};

export default Home;
