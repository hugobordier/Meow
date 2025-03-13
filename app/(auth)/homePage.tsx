import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
    return (
        <View className='flex-1 items-center justify-center bg-white p-4'>
            <Text className='text-4xl font-bold mb-8'>MEOW</Text>

            <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg mb-4 w-full'>
                <Link href="/sign-up" className='text-black text-center'>Créer un compte</Link>
            </TouchableOpacity>


            <View className='flex-row items-center my-2 w-full'>
                <View className='flex-1 h-[1px] bg-gray-300' />
                <Text className='mx-2 text-gray-500'>ou</Text>
                <View className='flex-1 h-[1px] bg-gray-300' />
            </View>

            <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg w-full'>
                <Link href="/sign-in" className='text-black text-center'>Se connecter</Link>
            </TouchableOpacity>
        </View>
    )
}