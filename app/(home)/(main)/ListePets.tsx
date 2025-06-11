import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPetsForAUser } from '@/services/pet.service';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Pet } from '@/types/pets';
import { useEffect

 } from 'react';
 import PetDetailModale from '@/components/PetDetailModale';
import { refresh } from '@react-native-community/netinfo';

  // const [pagination] = useState<PaginationParams | null>({
  //   page: 1,
  //   limit: 100000,
  // });


export default function MesAnimaux() {
  const {user,setUser}= useAuthContext();
  const [listPets, setListPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    // console.log(user?.id)
  if (user?.id) {
    getPetsForAUser()
      .then((response) => {
        // console.log("animaux:", response);
        setListPets(response.data);
      })
      .catch((error) => {
        console.log("Erreur lors du chargement des animaux :", error);
      });
  }
}, []);

  const handlePressPet = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const refreshPets = async () => {
  if (user?.id) {
    try {
      const response = await getPetsForAUser();
      setListPets(response.data);
      if (selectedPet) {
        const updatedPet = response.data.find((p) => p.id === selectedPet.id);
        if (updatedPet) setSelectedPet(updatedPet);
      }
    } catch (error) {
      console.log("Erreur lors du rafraîchissement des animaux :", error);
    }
  }
};

  return (
    <SafeAreaView style={styles.container}>

      {/* Liste des animaux */}
      <Text style={styles.subTitle}>Mes animaux</Text>
      <FlatList
        data={listPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressPet(item)}>
            <View style={styles.petItem}>
              {item.photo_url ? (
                <Image
                  source={{ uri: item.photo_url }}
                  style={styles.petImage}
                />
              ) : (
                <Ionicons
                  name="paw"
                  size={20}
                  color="black"
                />
              )}
              <Text style={styles.petName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
      <PetDetailModale
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          pet={selectedPet}
          onUpdate={refreshPets}
        />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeef8',
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
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  petName: {
    marginLeft: 10,
    fontSize: 16,
  },
});