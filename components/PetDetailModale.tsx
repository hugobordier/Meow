import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types/pets';
import { deletePet, deletePhotoprofilPet, updatePet } from '@/services/pet.service';
import { ToastType, useToast } from "@/context/ToastContext";
import { pickImageFromLibrary } from "@/utils/imagePicker";
import { updatePhotoprofilPet } from '@/services/pet.service';
import { useColorScheme } from 'react-native';
import AlbumPhotoPetModale from './AlbumPhotoPetModale';

type Props = {
  visible: boolean;
  onClose: () => void;
  pet: Pet | null;
  onUpdate?: () => void;
};

export default function PetDetailModal({ visible, onClose, pet, onUpdate }: Props) {
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Pet>>(pet || {});
  const [image, setImage] = useState<string | null>(null);
  const [albumVisible, setAlbumVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";



  useEffect(() => {
    setForm(pet || {});
    setEditMode(false);
    setImage(null);
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
        toast.showToast("Image mise à jour", ToastType.SUCCESS);
      }
      toast.showToast("Animal modifié avec succès", ToastType.SUCCESS);
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
      toast.showToast("Animal supprimé avec succès", ToastType.SUCCESS);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.showToast("Erreur lors de la suppression", ToastType.ERROR);
    }
  };

  const handledeletephoto = async () => {
    try {
      if (!pet.photo_url) {
        toast.showToast("Aucune photo à supprimer", ToastType.WARNING);
        return;
      }
      setImage(null);
      setForm({ ...form, photo_url: "" });
      await deletePhotoprofilPet(pet.id);
      if (onUpdate) onUpdate();
      toast.showToast("Photo supprimée", ToastType.SUCCESS);
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo :", error);
      toast.showToast("Erreur lors de la suppression de la photo", ToastType.ERROR);
      return;
    }

  };

  const renderField = (label: string, value: string | number | boolean | undefined) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>
        {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : (value || 'Non renseigné')}
      </Text>
    </View>
  );

  const renderEditField = (
    label: string, 
    key: keyof Pet, 
    placeholder: string = '', 
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.editFieldContainer}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={typeof form[key] === 'number' ? String(form[key]) : (form[key] as string) || ''}
        onChangeText={text => handleChange(key, keyboardType === 'numeric' ? Number(text) : text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderToggleField = (label: string, key: keyof Pet) => {
    const value = Boolean(form[key]); // Convertir explicitement en booléen
    
    return (
      <View style={styles.editFieldContainer}>
        <Text style={styles.editFieldLabel}>{label}</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggle, value && styles.toggleActive]}
            onPress={() => handleChange(key, !value)}
          >
            <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
          </TouchableOpacity>
          <Text style={styles.toggleText}>{value ? 'Oui' : 'Non'}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Pet Image */}
            <View style={styles.imageContainer}>
              {(image || form.photo_url || pet.photo_url) ? (
                <Image 
                  source={{ uri: image || form.photo_url || pet.photo_url }} 
                  style={styles.image} 
                  resizeMode="cover" 
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="paw" size={60} color="#ccc" />
                </View>
              )}
            </View>

            {editMode ? (
              <View style={styles.editContainer}>
                <Text style={styles.sectionTitle}>Modifier les informations</Text>
                
                {renderEditField('Nom', 'name', 'Nom de l\'animal')}
                {renderEditField('Race', 'breed', 'Race de l\'animal')}
                {renderEditField('Espèce', 'species', 'Chien, Chat, etc.')}
                {renderEditField('Genre', 'gender', 'Mâle, Femelle')}
                {renderEditField('Couleur', 'color', 'Couleur du pelage')}
                {renderEditField('Âge', 'age', 'Âge en années', 'numeric')}
                {renderEditField('Poids (kg)', 'weight', 'Poids en kg', 'numeric')}
                {renderEditField('Allergies', 'allergy', 'Allergies connues')}
                {renderEditField('Régime alimentaire', 'diet', 'Régime spécial')}
                {renderToggleField('Castré/Stérilisé', 'neutered')}
                {renderEditField('Description', 'description', 'Description générale', 'default', true)}

                {/* Image Selection */}
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    onPress={async () => {
                      const result = await pickImageFromLibrary();
                      if (result.uri) setImage(result.uri);
                      else if (result.error) toast.showToast(result.error, ToastType.ERROR);
                    }}
                    style={styles.imageBtn}
                  >
                    <Ionicons name="camera" size={20} color="white" />
                    <Text style={styles.imageBtnText}>Changer la photo</Text>
                  </TouchableOpacity>

                  {(image || form.photo_url) && (
                    <TouchableOpacity
                      onPress={() => { handledeletephoto()
                      }}
                      style={styles.removeImageBtn}
                    >
                      <Ionicons name="trash-outline" size={18} color="white" />
                      <Text style={styles.imageBtnText}>Supprimer la photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.detailsContainer}>
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.fieldsContainer}>
                  {renderField('Race', pet.breed)}
                  {renderField('Espèce', pet.species)}
                  {renderField('Genre', pet.gender)}
                  {renderField('Couleur', pet.color)}
                  {renderField('Âge', pet.age ? `${pet.age} ans` : undefined)}
                  {renderField('Poids', pet.weight ? `${pet.weight} kg` : undefined)}
                  {renderField('Allergies', pet.allergy)}
                  {renderField('Régime', pet.diet)}
                  {renderField('Castré/Stérilisé', pet.neutered)}
                  {renderField('Description', pet.description)}

                  <TouchableOpacity
                    style={[styles.editBtn, { backgroundColor: '#D946EF', marginTop: 16 }]}
                    onPress={() => setAlbumVisible(true)}
                  >
                    <Ionicons name="images" size={18} color="white" />
                    <Text style={styles.editBtnText}>Album photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {editMode ? (
              <>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
                  <Text style={styles.cancelBtnText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveBtnText}>Enregistrer</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
                  <Ionicons name="pencil" size={18} color="white" />
                  <Text style={styles.editBtnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Ionicons name="trash" size={18} color="white" />
                  <Text style={styles.deleteBtnText}>Supprimer</Text>
                </TouchableOpacity>

              </>
            )}
            
          </View>
        </View>
      </View>
      <AlbumPhotoPetModale
        visible={albumVisible}
        onClose={() => setAlbumVisible(false)}
        pet={pet}
      />
    </Modal>
    
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 550,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldsContainer: {
    width: '100%',
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  editContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  editFieldContainer: {
    marginBottom: 16,
  },
  editFieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fafbfc',
    color: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e1e5e9',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  imageActions: {
    marginTop: 8,
    gap: 12,
  },
  imageBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  removeImageBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imageBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    backgroundColor: '#f8f9fa',
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});