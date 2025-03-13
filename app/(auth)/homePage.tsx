import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-700 p-4">
      <Text className="text-4xl font-JakartaExtraBold mb-8 text-black dark:text-slate-200">
        MEOW
      </Text>

      <Link href="/sign-up" asChild>
        <TouchableOpacity className="bg-gray-200 dark:bg-indigo-800 px-6 py-3 rounded-lg mb-4 w-full">
          <Text className="text-black font-Jakarta dark:text-slate-200 w-full text-center">
            Créer un compte
          </Text>
        </TouchableOpacity>
      </Link>

      <View className="flex-row items-center my-2 w-full">
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-500" />
        <Text className="mx-2 text-gray-500 dark:text-gray-300">ou</Text>
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-500" />
      </View>

      <Link href="/sign-in" asChild>
        <TouchableOpacity className="bg-gray-200 dark:bg-indigo-800 px-6 py-3 mt-4 rounded-lg mb-4 w-full">
          <Text className="text-black dark:text-slate-200 font-Jakarta w-full text-center">
            Se connecter
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
