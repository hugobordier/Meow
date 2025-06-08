import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createPet, updatePhotoprofilPet } from '@/services/pet.service';
import { ToastType, useToast } from "@/context/ToastContext";
import { pickImageFromLibrary } from "@/utils/imagePicker";
import { updatePet } from '@/services/pet.service';
type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd?: () => void;
};

export default function PetAddModale({ visible, onClose, onAdd }: Props) {
  const toast = useToast();
  
  const [form, setForm] = useState({
    name: '',
    breed: '',
    species: '',
    gender: '',
    color: '',
    age: '',
    weight: '',
    allergy: '',
    diet: '',
    neutered: false,
    description: '',
    photo_url: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      const requiredFields = ['name', 'breed', 'species', 'gender', 'color', 'age', 'weight'];
      for (const field of requiredFields) {
        if (!(form as any)[field]) {
          toast.showToast(`Le champ ${field} est requis`, ToastType.ERROR);
          return;
        }
      }

      const { photo_url, ...dataToSend } = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
      };
      const pet = await createPet(dataToSend);
      console.log("pet:",pet);
      console.log("image:", image, "pet id:", pet?.id);
      if (image && pet?.data?.id) {
        const uploadResult = await updatePhotoprofilPet(pet.data.id, image);
        console.log("Upload result:", uploadResult);
        console.log("Photo URL:", uploadResult?.photo_url);
        if (uploadResult?.photo_url) {
          await updatePet(pet.data.id, { photo_url: uploadResult.photo_url });
        }
        toast.showToast("Image ajoutée", ToastType.SUCCESS);
      }

      toast.showToast("Animal ajouté", ToastType.SUCCESS);
      setForm({
        name: '',
        breed: '',
        species: '',
        gender: '',
        color: '',
        age: '',
        weight: '',
        allergy: '',
        diet: '',
        neutered: false,
        description: '',
        photo_url: '',
      });
      setImage(null);
      if (onAdd) onAdd();
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      toast.showToast("Erreur lors de l'ajout", ToastType.ERROR);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={32} color="black" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={styles.title}>Ajouter un animal</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={text => handleChange('name', text)}
              placeholder="Nom"
            />
            <TextInput
              style={styles.input}
              value={form.breed}
              onChangeText={text => handleChange('breed', text)}
              placeholder="Race"
            />
            <TextInput
              style={styles.input}
              value={form.species}
              onChangeText={text => handleChange('species', text)}
              placeholder="Espèce"
            />
            <TextInput
              style={styles.input}
              value={form.gender}
              onChangeText={text => handleChange('gender', text)}
              placeholder="Genre"
            />
            <TextInput
              style={styles.input}
              value={form.color}
              onChangeText={text => handleChange('color', text)}
              placeholder="Couleur"
            />
            <TextInput
              style={styles.input}
              value={form.age}
              onChangeText={text => handleChange('age', text)}
              placeholder="Âge"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={form.weight}
              onChangeText={text => handleChange('weight', text)}
              placeholder="Poids"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={form.allergy}
              onChangeText={text => handleChange('allergy', text)}
              placeholder="Allergie"
            />
            <TextInput
              style={styles.input}
              value={form.diet}
              onChangeText={text => handleChange('diet', text)}
              placeholder="Régime"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ marginRight: 8 }}>Castré :</Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: form.neutered ? '#4CAF50' : '#ccc',
                  justifyContent: 'center',
                  alignItems: form.neutered ? 'flex-end' : 'flex-start',
                  padding: 4,
                }}
                onPress={() => handleChange('neutered', !form.neutered)}
              >
                <View style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#fff',
                }} />
              </TouchableOpacity>
              <Text style={{ marginLeft: 8 }}>{form.neutered ? 'Oui' : 'Non'}</Text>
            </View>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={form.description}
              onChangeText={text => handleChange('description', text)}
              placeholder="Description"
              multiline
            />
            <TouchableOpacity
              onPress={async () => {
                const result = await pickImageFromLibrary();
                if (result.uri) {
                  setImage(result.uri);
                } else if (result.error) {
                  toast.showToast(result.error, ToastType.ERROR);
                }
              }}
              style={{
                backgroundColor: "#facc15",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 9999,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name="images" size={24} color="white" />
              <Text style={{ color: "white", marginLeft: 8, fontWeight: "bold" }}>
                Choisir une photo
              </Text>
            </TouchableOpacity>
            {image && (
              <Text style={{ marginBottom: 8, color: "#555" }}>
                Image sélectionnée
              </Text>
            )}
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 320,
    minHeight: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    paddingTop: 40,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#ffd700',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});