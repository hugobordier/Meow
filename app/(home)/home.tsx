import { useAuthContext } from "@/context/AuthContext";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

const Home = () => {
  const { user } = useAuthContext();
  return (
    <SafeAreaView className=" bg-gray-700 h-screen flex items-center justify-center">
      <Text className="p-4 dark:text-white">Bonjour {user?.username}</Text>
      <Link className="dark:text-white" href="/(auth)/homePage">
        {" "}
        Aller au a la page de premier connexion , button a supr
      </Link>
    </SafeAreaView>
  );
};

export default Home;
