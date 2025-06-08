import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types/pets';
import { deletePet, updatePet } from '@/services/pet.service';
import { useEffect } from 'react';
import { ToastType, useToast } from "@/context/ToastContext";
import { pickImageFromLibrary } from "@/utils/imagePicker";
import { updatePhotoprofilPet} from '@/services/pet.service';

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
  const [image, setImage] = useState<string | null>(null);

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

    if (image) {
      const uploadResult = await updatePhotoprofilPet(pet.id, image);
      if (uploadResult?.photo_url) {
        await updatePet(pet.id, { photo_url: uploadResult.photo_url });
        setForm({ ...form, photo_url: uploadResult.photo_url });
        if (onUpdate) onUpdate();
      }
      toast.showToast("Image ajoutée", ToastType.SUCCESS);
    }
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Nom</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.name || ''}
                    onChangeText={text => handleChange('name', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Race</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.breed || ''}
                    onChangeText={text => handleChange('breed', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Espèce</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.species || ''}
                    onChangeText={text => handleChange('species', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Genre</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.gender || ''}
                    onChangeText={text => handleChange('gender', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Couleur</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.color || ''}
                    onChangeText={text => handleChange('color', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Âge</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.age ? String(form.age) : ''}
                    onChangeText={text => handleChange('age', Number(text))}
                    placeholder=""
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Poids</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.weight ? String(form.weight) : ''}
                    onChangeText={text => handleChange('weight', Number(text))}
                    placeholder=""
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Allergie</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.allergy || ''}
                    onChangeText={text => handleChange('allergy', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Régime</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.diet || ''}
                    onChangeText={text => handleChange('diet', text)}
                    placeholder=""
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Castré</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ width: 90 }}>Description</Text>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0, height: 60 }]}
                    value={form.description || ''}
                    onChangeText={text => handleChange('description', text)}
                    placeholder=""
                    multiline
                  />
                </View>
                {editMode && (
                  <>
                    <TouchableOpacity
                      onPress={async () => {
                        const result = await pickImageFromLibrary();
                        if (result.uri) setImage(result.uri);
                        else if (result.error) toast.showToast(result.error, ToastType.ERROR);
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
                  </>
                )}
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
