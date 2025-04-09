import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuthContext();
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-white dark:bg-slate-900"
    >
      <ScrollView className="flex-1">
        {/* User Profile */}
        <View className="flex-row items-center px-4 mt-4">
          <Image
            source={{ uri: user?.profilePicture }}
            className="w-12 h-12 rounded-full bg-yellow-200 dark:bg-yellow-300"
          />
          <View className="ml-3">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Hi, {user?.username}!
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {user?.city}, {user?.country}
            </Text>
          </View>
          <View className="ml-auto">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Localisation
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mt-4">
          <View className="flex-row items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Localisation"
              className="ml-2 flex-1 text-gray-700 dark:text-gray-300"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Your Pets Section */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Your Pets
            </Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            {/* Add Pet */}
            <TouchableOpacity className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-300 items-center justify-center">
                <Ionicons name="add" size={24} color="black" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Add Pet
              </Text>
            </TouchableOpacity>

            {/* Pet - River */}
            <TouchableOpacity className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-blue-200 dark:bg-blue-300 items-center justify-center">
                <FontAwesome5 name="dog" size={24} color="brown" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                River
              </Text>
            </TouchableOpacity>

            {/* Pet - Sky */}
            <TouchableOpacity className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-300 items-center justify-center">
                <FontAwesome5 name="cat" size={24} color="orange" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Sky
              </Text>
            </TouchableOpacity>

            {/* Pet - Blue */}
            <TouchableOpacity className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-200 items-center justify-center">
                <FontAwesome5 name="fish" size={24} color="blue" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Blue
              </Text>
            </TouchableOpacity>

            {/* Pet - Ginger */}
            <TouchableOpacity className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-orange-200 dark:bg-orange-300 items-center justify-center">
                <FontAwesome5 name="cat" size={24} color="orange" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Ginger
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Ongoing Requests */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold text-black dark:text-white">
            Demandes en cours
          </Text>

          <View className="mt-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
            {/* Request 1 */}
            <View className="flex-row items-center mb-3">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/41.jpg",
                }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="ml-3 flex-1 text-black dark:text-white">
                Jean-Paul Dupuis
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  En attente
                </Text>
              </View>
            </View>

            {/* Request 2 */}
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/67.jpg",
                }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="ml-3 flex-1 text-black dark:text-white">
                Marie Delarue
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Refusé
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center">
                <FontAwesome5 name="paw" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Mes animaux
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-red-500 items-center justify-center">
                <MaterialIcons name="location-on" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Pet-sitters proches
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center">
                <FontAwesome5 name="user-friends" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Mes pet-sitters
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center">
                <Ionicons name="notifications" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Mes alertes
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-yellow-400 items-center justify-center">
                <FontAwesome5 name="user-plus" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Parrainer un ami
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center">
                <FontAwesome5 name="percent" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Offres & Réductions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center">
                <MaterialIcons name="support-agent" size={20} color="white" />
              </View>
              <Text className="text-xs mt-1 text-center text-black dark:text-white">
                Assistance
              </Text>
            </TouchableOpacity>

            <View className="w-14" />
          </View>
        </View>

        {/* Promo Banner */}
        <View className="mt-6 mb-4">
          <View className="h-32 bg-orange-500 dark:bg-orange-600 mx-4 rounded-lg p-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">pet corner</Text>
              <Text className="text-white text-3xl font-bold mt-1">Gold</Text>
              <Text className="text-white text-xl font-bold mt-1">10%</Text>
              <Text className="text-white font-bold">cashback</Text>
            </View>
            <Image
              source={{
                uri: "https://www.purina.co.uk/sites/default/files/2022-07/Can-Cats-and-Dogs-Live-Together.jpg",
              }}
              className="w-24 h-24"
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
