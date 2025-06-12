import React, { use } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Pet } from '../types/pets';
import { getAllImagesForaPet } from '@/services/pet.service';
import { PetImage } from '@/types/petImage';
import { useEffect } from 'react';
import { deletePetImage } from '@/services/pet.service';
import { Ionicons } from '@expo/vector-icons';
import { pickImageFromLibrary } from '@/utils/imagePicker';
import { ToastType, useToast } from "@/context/ToastContext";
import { createPetImage } from '@/services/pet.service';


type Props = {
  visible: boolean;
  onClose: () => void;
  pet: Pet | null;
  onUpdate?: () => void;
};

export default function AlbumPhotoPetModale({ visible, onClose, pet, onUpdate }: Props) {
  if (!pet) return null;
  const [listImages, setListImages] = React.useState<PetImage[]>([]);
  const [image, setImage] = React.useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
      if (visible && pet) {
        handleChgtPhotosPet();
    }
}, [visible, pet]);


  const handleChgtPhotosPet = async() => {
    if (!pet) return;
    try {
        const res = await getAllImagesForaPet(pet.id);
        if (res && res.success && Array.isArray(res.data)) {
        setListImages(res.data);
        } else {
        setListImages([]);
        }
    } catch (e) {
        setListImages([]);
    }
    };
  const handledeleteImage = async(imageId: string) => {
    try {
        const response = await deletePetImage(imageId);
        if (response && response.success) {
            setListImages(prevImages => prevImages.filter(img => img.id !== imageId));
            if (onUpdate) onUpdate();
        } else {
            console.error("Erreur lors de la suppression de l'image");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error);
    }  
    }

    const handleaddPetImage = async (uri: string) => {
      try {
        if (uri) {
          const uploadResult = await createPetImage(pet.id, uri);
          if (uploadResult.success === false) {
            toast.showToast(uploadResult.message, ToastType.ERROR);
            return;
          }
          toast.showToast("Image Ajoutée", ToastType.SUCCESS);
          await handleChgtPhotosPet(); // <-- recharge l'album
          if (onUpdate) onUpdate();
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'image :", error);
      }
    };


 return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>

          <Text style={styles.title}>{pet.name}</Text>
          {pet.photo_url ? (
            <Image source={{ uri: pet.photo_url }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Aucune photo</Text>
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10, color: "#18181b" }}>
            Album photo
          </Text>
          <ScrollView
            style={{ maxHeight: 320, width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                width: "100%",
                marginBottom: 10,
              }}
            >
              {listImages.length > 0 ? (
                listImages.map(img => (
                  <View
                    key={img.id}
                    style={{
                      alignItems: "center",
                      marginBottom: 12,
                      width: "33.33%", 
                    }}
                  >
                    <Image
                      source={{ uri: img.url_image }}
                      style={{
                        width: 80, 
                        height: 80,
                        borderRadius: 12,
                        backgroundColor: "#eee",
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => handledeleteImage(img.id)}
                      style={{ marginTop: 4 }}
                    >
                      <Ionicons name="trash" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#888", fontSize: 14, width: "100%", textAlign: "center" }}>
                  Aucune photo d'album
                </Text>
              )}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={async () => {
              const result = await pickImageFromLibrary();
              if (result.uri) {
                await handleaddPetImage(result.uri);
              } else if (result.error) {
                toast.showToast(result.error, ToastType.ERROR);
              }
            }}
            style={{
              marginTop: 8,
              marginBottom: 10,
              backgroundColor: '#34C759',
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ajouter une image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24,24,27,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#18181b',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  placeholder: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
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
    closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});