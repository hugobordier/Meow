import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getSocket } from "@/services/socket";
import {SegmentedControl} from "segmented-control-rn";
import { getAllUsers } from "@/services/user.service";

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

const ChatScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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

    fetchUsers();
    if (!socket) {
      console.warn("⚠️ Socket non disponible (non connecté)");
      return;
    }
    
    socket.on("connect", () => { //"on" signifie ecoute un event
      console.log("✅ Connecté au serveur WebSocket");
      
     fetchUsers();
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    //socket.on("online-users", (userList)=> {
      //console.log("User online:", userList);
      //setAllUsers(userList);//remplir les user (la liste)
    //});

    //For private messages
    socket.on("receive_message", ({ sender, message }) => {
      console.log(`Msg received from ${sender}: ${message}`);

      setMessages((prev) => [
        ...prev,
        {user: `[privé] ${sender}`, text: message},
      ]);
    });
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

  return (
    
    <View className="mt-20">
      <Text>
        Activité
      </Text>
      <SegmentedControl
        onChange={(index) => setActiveIndex(index)}
        segments={segments}
        selectedIndex={activeIndex}
      />
      <TouchableOpacity className="mt-20 items-center"
        onPress={() => setIsUserListVisible(true)}>
        <Text>Send Message</Text>
      </TouchableOpacity>
      {isUserListVisible && (
        <View className="mt-4 ml-2">
          <Text className="font-bold">Utilisateurs</Text>
          {allUsers.map((user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedUser(user);
                setIsUserListVisible(false);
              }}
              style={{ paddingVertical: 6 }}
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
