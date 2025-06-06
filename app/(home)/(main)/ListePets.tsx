import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPetsForAUser } from '@/services/pet.service';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Pet } from '@/types/pets';
import { useEffect

 } from 'react';
const mockPets = [
  { id: '1', name: 'River', type: 'dog' },
  { id: '2', name: 'Sky', type: 'cat' },
  { id: '3', name: 'Blue', type: 'fish' },
  { id: '4', name: 'Ginger', type: 'cat' },
];
  // const [pagination] = useState<PaginationParams | null>({
  //   page: 1,
  //   limit: 100000,
  // });


export default function MesAnimaux() {
  const router = useRouter();
  const {user,setUser}= useAuthContext();
  const [listPets, setListPets] = useState<Pet[]>([]);

  useEffect(() => {
  if (user?.id) {
    getPetsForAUser(user.id)
      .then((response) => {
        setListPets(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des animaux :", error);
      });
  }
}, [user]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>MEOW</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Liste des animaux */}
      <Text style={styles.subTitle}>Mes animaux</Text>
      <FlatList
        data={mockPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petItem}>
            <Ionicons
              name={
                item.type === 'dog'
                  ? 'paw'
                  : item.type === 'cat'
                  ? 'logo-octocat'
                  : 'fish'
              }
              size={20}
              color="black"
            />
            <Text style={styles.petName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeef8',
  },
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  petName: {
    marginLeft: 10,
    fontSize: 16,
  },
});