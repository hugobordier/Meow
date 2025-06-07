import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types/pets';
import { deletePet, updatePet } from '@/services/pet.service';
import { useEffect } from 'react';
import { ToastType, useToast } from "@/context/ToastContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  pet: Pet | null;
  onUpdate?: () => void;
};

export default function PetDetailModale({ visible, onClose, pet, onUpdate }: Props) {
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Pet>>(pet || {});

  useEffect(() => {
    setForm(pet || {});
    setEditMode(false);
  }, [pet, visible]);

  if (!pet) return null;

  const handleChange = (key: keyof Pet, value: any) => {
    setForm({ ...form, [key]: value });
  };

 const handleSave = async () => {
  try {
    const { user_id, ...formToSend } = form;
    if (formToSend.age) formToSend.age = Number(formToSend.age);
    if (formToSend.weight) formToSend.weight = Number(formToSend.weight);

    await updatePet(pet.id, formToSend as Pet);
    setEditMode(false);
    setForm(formToSend);
    if (onUpdate) onUpdate();
    // if (onClose) onClose();
    toast.showToast("Animal modifié", ToastType.SUCCESS);
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    toast.showToast("Erreur lors de la modification", ToastType.ERROR);
  }
};

const handleDelete = async () => {
  try {

    await deletePet(pet.id);
    setEditMode(false);
    if (onUpdate) onUpdate();
    if (onClose) onClose();
    toast.showToast("Animal supprimé", ToastType.SUCCESS);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    toast.showToast("Erreur lors de la suppression", ToastType.ERROR);
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
            {pet.photo_url ? (
              <Image source={{ uri: pet.photo_url }} style={styles.image} resizeMode="contain" />
            ) : (
              <Ionicons name="paw" size={60} color="black" style={styles.image} />
            )}
            {editMode ? (
              <>
                <TextInput
                  style={styles.input}
                  value={form.name || ''}
                  onChangeText={text => handleChange('name', text)}
                  placeholder="Nom"
                />
                <TextInput
                  style={styles.input}
                  value={form.breed || ''}
                  onChangeText={text => handleChange('breed', text)}
                  placeholder="Race"
                />
                <TextInput
                  style={styles.input}
                  value={form.species || ''}
                  onChangeText={text => handleChange('species', text)}
                  placeholder="Espèce"
                />
                <TextInput
                  style={styles.input}
                  value={form.gender || ''}
                  onChangeText={text => handleChange('gender', text)}
                  placeholder="Genre"
                />
                <TextInput
                  style={styles.input}
                  value={form.color || ''}
                  onChangeText={text => handleChange('color', text)}
                  placeholder="Couleur"
                />
                <TextInput
                  style={styles.input}
                  value={form.age ? String(form.age) : ''}
                  onChangeText={text => handleChange('age', Number(text))}
                  placeholder="Âge"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={form.weight ? String(form.weight) : ''}
                  onChangeText={text => handleChange('weight', Number(text))}
                  placeholder="Poids"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={form.allergy || ''}
                  onChangeText={text => handleChange('allergy', text)}
                  placeholder="Allergie"
                />
                <TextInput
                  style={styles.input}
                  value={form.diet || ''}
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
                  value={form.description || ''}
                  onChangeText={text => handleChange('description', text)}
                  placeholder="Description"
                  multiline
                />
              </>
            ) : (
              <>
                <Text style={styles.name}>{pet.name}</Text>
                <Text>Race : {pet.breed}</Text>
                <Text>Espèce : {pet.species}</Text>
                <Text>Genre : {pet.gender}</Text>
                <Text>Couleur : {pet.color}</Text>
                <Text>Age : {pet.age}</Text>
                <Text>Poids : {pet.allergy}</Text>
                <Text>Allergie : {pet.allergy}</Text>
                <Text>Régime : {pet.allergy}</Text>
                <Text>Castré : {pet.neutered ? "Oui" : "Non"}</Text>
                <Text>Description : {pet.allergy}</Text>
              </>
            )}
          </ScrollView>
          <View style={styles.buttonRow}>
            {editMode ? (
              <TouchableOpacity style={styles.editBtn} onPress={handleSave}>
                <Text style={styles.btnText}>Enregistrer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.btnText}>Supprimer</Text>
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
    width: 300,
    minHeight: 450,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  image: {
    width: 180,
    height: 180,
    // borderRadius: 40,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
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
});
