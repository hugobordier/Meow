import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { createSocket, getSocket, waitForSocketConnection } from "@/services/socket";
import {SegmentedControl} from "segmented-control-rn";
import { getAllUsers } from "@/services/user.service";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";


import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserIdFromToken = async (): Promise<string | null> => { //id sender
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) return null;
  const decoded: any = jwtDecode(token);
  return decoded.id;
};

const getUserIdFromUsername = async (username: string): Promise<string | null> => {
  const users = await getAllUsers();
  const match = users.find((u: any) => u.username === username);
  return match?.id || null;
};//id recevier

const generateRoomID = (user1: string, user2: string) => {
  return [user1, user2].sort().join("_");
};

const INACTIVE_COLOR = 'rgba(0, 0, 0, 0.5)';
const ACTIVE_COLOR = 'rgb(0, 0, 0)';

const segments = [
  {
    value: 'Toutes',
    active: <Text style={{ color: ACTIVE_COLOR }}>Toutes</Text>,
    inactive: <Text style={{ color: INACTIVE_COLOR }}>Toutes</Text>,
  },
  {
    value: 'Non lues',
    active: <Text style={{ color: ACTIVE_COLOR }}>Non lues</Text>,
    inactive: <Text style={{ color: INACTIVE_COLOR }}>Non lues</Text>,
  },
  {
    value: 'Favoris',
    active: <Text style={{ color: ACTIVE_COLOR }}>Favoris</Text>,
    inactive: <Text style={{ color: INACTIVE_COLOR }}>Favoris</Text>,
  },
  {
    value: 'Envoyés',
    active: <Text style={{ color: ACTIVE_COLOR }}>Envoyés</Text>,
    inactive: <Text style={{ color: INACTIVE_COLOR }}>Envoyés</Text>,
  },
];

const socket = getSocket();

const router = useRouter();

const ChatScreen = () => {
  const [serverState, setServerState] = useState('Loading...');   //???
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [joinRoom,setJoinRoom] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );

  const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        const usernames = users.map((users: any) => users.username);
        setAllUsers(usernames); 
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally{
        setLoading(false)
      }
    };
  
  useEffect(() => {
  const init = async () => {
    const createdSocket = await createSocket(); // Crée le socket

    if (!createdSocket) {
      console.warn("❌ Socket non créé !");
      return;
    }

    try {
      await waitForSocketConnection(createdSocket); // ⏳ Attend la connexion

      console.log("✅ Socket connecté :", createdSocket.id);

      createdSocket.on("connect", () => {
        const fullUrl = `wss://${createdSocket.io.opts.hostname}${createdSocket.io.opts.path}`;
        console.log("📲 Client connecté à :", fullUrl);
      });

      createdSocket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      createdSocket.on("receive_message", ({ sender, message }) => {
        console.log(`📩 Msg reçu de ${sender}: ${message}`);
        setMessages((prev) => [...prev, { user: `[privé] ${sender}`, text: message }]);
      });

      await fetchUsers();
    } catch (err) {
      console.error("❌ Erreur de connexion socket :", err);
    }
  };

  init(); // Ne pas oublier d’appeler la fonction !
}, []);

  const sendMessage = () => {
    
    if (!socket){
      console.warn("impossible d'envoyer: socket non connecté");
      return;
    }
    if (message.trim() !== "" && recipient.trim() !== "") {
      socket.emit("private_message", { recipientId: recipient, message: message });
      setMessage("");
    }
  };

  // Si aucune discussion
if (messages.length === 0 && !isUserListVisible) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="mb-5 text-base">Aucune discussion pour le moment</Text>
      <TouchableOpacity className="p-3 bg-black rounded-lg"
        onPress={() => setIsUserListVisible(true)}
      >
        <Text className="text-white">Commencer une discussion</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (
    
    <View className="pt-20 px-4">
      
      <Text className="text-xl font-bold mb-4">
        Activité
      </Text>
      {message.length > 0 && (
        <>
      <SegmentedControl
        onChange={(index) => setActiveIndex(index)}
        segments={segments}
        selectedIndex={activeIndex}
      />
        </>
      )}
      {isUserListVisible && (
        <View className="mt-4 ml-2">
          <Text className="font-bold">Choisissez un utilisateurs</Text>
          {allUsers.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                setLoading(true);
                try {
                  let socket = getSocket();

    
                  if (!socket || !socket.connected) {
                  console.log("🔄 Recréation de la socket...");
                  socket = await createSocket();
                  if (!socket) throw new Error("Échec de création du socket");
                  await waitForSocketConnection(socket);
                }

                  console.log("socket.id =", socket.id);

                  const myUserId = await getUserIdFromToken();
                  console.log("myUserId =", myUserId);

                  const recipientUserId = await getUserIdFromUsername(user);

                  if (!myUserId || !recipientUserId) {
                    alert("Impossible de récupérer l'id de l'utilisateur ou du destinataire !");
                    setLoading(false);
                    return;
                  }
                  
                  const roomID = generateRoomID(myUserId, recipientUserId);
                  socket.emit("join", roomID);
                  setSelectedUser(user);
                  setIsUserListVisible(false);
                  setJoinRoom(roomID);
                  console.log("rej room:", roomID);
                  router.push({
                    pathname: "./chatDialogue",
                    params: {
                      roomID,
                      recipient: user,
                      recipientId: recipientUserId,
                    }
                  });
                  
                }catch(err){
                  console.error("Erreur pendant la connexion au socket :", err);
                } finally {
                  setLoading(false); // ✅ sera appelé même si erreur
                }
            
              }}
              className="py-[6px]"
            >
              <Text>{user}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ChatScreen;