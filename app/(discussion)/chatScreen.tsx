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
import { getSocket, waitForSocketConnection  } from "@/services/socket";
import {SegmentedControl} from "segmented-control-rn";
import { getAllUsers } from "@/services/user.service";

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

    fetchUsers();
    if (!socket) {
      console.warn("⚠️ Socket non disponible (non connecté)");
      return;
    }
    
    socket.on("connect", () => { //"on" signifie ecoute un event
      const fullUrl = `wss://${socket.io.opts.hostname}${socket.io.opts.path}`;
      console.log("📲 Client connecté à :", fullUrl);
      
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

  // Si aucune discussion
if (messages.length === 0 && !isUserListVisible) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 16 }}>Aucune discussion pour le moment</Text>
      <TouchableOpacity
        style={{
          padding: 12,
          backgroundColor: '#000',
          borderRadius: 8,
        }}
        onPress={() => setIsUserListVisible(true)}
      >
        <Text style={{ color: '#fff' }}>Commencer une discussion</Text>
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
                
                
                if (!socket) return;
                setLoading(true);
                try{
                  await waitForSocketConnection(socket);

                  if (socket.id){
                    const roomID = generateRoomID(socket.id, user);
                    socket.emit("join", roomID);
                    setSelectedUser(user);
                    setIsUserListVisible(false);
                    setJoinRoom(roomID);
                    console.log("rej room:", roomID);
                  }else{
                    console.log("!!!!!!!!!!socket or socketid not available!!!!!!!!!!!!!!!HEEEEEELP")
                  }
                }catch(err){
                  console.error("Erreur pendant la connexion au socket :", err);
                } finally {
                  setLoading(false); // ✅ sera appelé même si erreur
                }
            
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