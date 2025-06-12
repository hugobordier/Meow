import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createPet, updatePhotoprofilPet, updatePet } from '@/services/pet.service';
import { ToastType, useToast } from "@/context/ToastContext";
import { pickImageFromLibrary } from "@/utils/imagePicker";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd?: () => void;
};

export default function PetAddModal({ visible, onClose, onAdd }: Props) {
  const toast = useToast();

  const GENDER_OPTIONS = [
  { label: 'Sélectionnez votre genre', value: '' },
  { label: 'Mâle', value: 'Male' },
  { label: 'Femelle', value: 'Female' },
  { label: 'Hermaphrodite', value: 'hermaphrodite' },
  ];
  
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const resetForm = () => {
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
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'name', label: 'Nom' },
      { key: 'breed', label: 'Race' },
      { key: 'species', label: 'Espèce' },
      { key: 'gender', label: 'Genre' },
      { key: 'color', label: 'Couleur' },
      { key: 'age', label: 'Âge' },
      { key: 'weight', label: 'Poids' },
    ];

    for (const field of requiredFields) {
      if (!(form as any)[field.key]) {
        toast.showToast(`Le champ "${field.label}" est requis`, ToastType.ERROR);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { photo_url, ...dataToSend } = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
      };

      const pet = await createPet(dataToSend);
      
      if (image && pet?.data?.id) {
        const uploadResult = await updatePhotoprofilPet(pet.data.id, image);
        if (uploadResult?.photo_url) {
          await updatePet(pet.data.id, { photo_url: uploadResult.photo_url });
        }
        toast.showToast("Animal ajouté avec photo", ToastType.SUCCESS);
      } else {
        toast.showToast("Animal ajouté avec succès", ToastType.SUCCESS);
      }

      resetForm();
      if (onAdd) onAdd();
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      toast.showToast("Erreur lors de l'ajout", ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    key: string,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={(form as any)[key]}
        onChangeText={text => handleChange(key, text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderToggleField = () => {
    const value = Boolean(form.neutered);
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Castré/Stérilisé</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggle, value && styles.toggleActive]}
            onPress={() => handleChange('neutered', !value)}
          >
            <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
          </TouchableOpacity>
          <Text style={styles.toggleText}>{value ? 'Oui' : 'Non'}</Text>
        </View>
      </View>
    );
  };

  const renderGenderField = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Genre *</Text>
        <View style={styles.genderContainer}>
          {GENDER_OPTIONS.filter(opt => opt.value === 'Male' || opt.value === 'Female').map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderButton,
                form.gender === option.value && styles.genderButtonSelected
              ]}
              onPress={() => handleChange('gender', option.value)}
            >
              <Text style={[
                styles.genderButtonText,
                form.gender === option.value && styles.genderButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              form.gender === 'hermaphrodite' && styles.genderButtonSelected
            ]}
            onPress={() => handleChange('gender', 'hermaphrodite')}
          >
            <Text style={[
              styles.genderButtonText,
              form.gender === 'hermaphrodite' && styles.genderButtonTextSelected
            ]}>
              Hermaphrodite
            </Text>
          </TouchableOpacity>
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
            <Text style={styles.title}>Ajouter un animal</Text>
            
            {/* Image Selection */}
            <View style={styles.imageSection}>
              {image ? (
                <View style={styles.selectedImageContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageSelectedText}>Photo sélectionnée</Text>
                </View>
              ) : (
                <View style={styles.placeholderImageContainer}>
                  <Ionicons name="camera-outline" size={40} color="#ccc" />
                  <Text style={styles.placeholderText}>Aucune photo</Text>
                </View>
              )}
              
              <View style={styles.imageActions}>
                <TouchableOpacity
                  onPress={async () => {
                    const result = await pickImageFromLibrary();
                    if (result.uri) {
                      setImage(result.uri);
                    } else if (result.error) {
                      toast.showToast(result.error, ToastType.ERROR);
                    }
                  }}
                  style={styles.imageBtn}
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text style={styles.imageBtnText}>
                    {image ? 'Changer la photo' : 'Ajouter une photo'}
                  </Text>
                </TouchableOpacity>

                {image && (
                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    style={styles.removeImageBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color="white" />
                    <Text style={styles.imageBtnText}>Supprimer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {renderInputField('Nom *', 'name', 'Nom de l\'animal')}
              {renderInputField('Race *', 'breed', 'Race de l\'animal')}
              {renderInputField('Espèce *', 'species', 'Chien, Chat, etc.')}
              
              {renderGenderField()}
              
              {renderInputField('Couleur *', 'color', 'Couleur du pelage')}
              {renderInputField('Âge *', 'age', 'Âge en années', 'numeric')}
              {renderInputField('Poids (kg) *', 'weight', 'Poids en kg', 'numeric')}
              {renderInputField('Allergies', 'allergy', 'Allergies connues')}
              {renderInputField('Régime alimentaire', 'diet', 'Régime spécial')}
              {renderToggleField()}
              {renderInputField('Description', 'description', 'Description générale', 'default', true)}
            </View>

            <Text style={styles.requiredNote}>* Champs obligatoires</Text>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addBtn, isLoading && styles.addBtnDisabled]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={20} color="white" />
              ) : (
                <Ionicons name="add" size={20} color="white" />
              )}
              <Text style={styles.addBtnText}>
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  selectedImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  imageSelectedText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  placeholderImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  imageActions: {
    gap: 12,
    width: '100%',
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
  formSection: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
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
  requiredNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    backgroundColor: '#f8f9fa',
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
  addBtn: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnDisabled: {
    backgroundColor: '#a0a0a0',
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent:'center'
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: '#fafbfc',
  },
  genderButtonSelected: {
    backgroundColor: '#D946EF',
    borderColor: '#D946EF',
  },
  genderButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
});