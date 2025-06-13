import { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

type NotificationContextType = {
  expoPushToken: string | null;
  sendTestNotification: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  expoPushToken: null,
  sendTestNotification: async () => {},
});

// Configure les notifications pour l'application
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const { user } = useAuth();

  const sendTestNotification = async () => {
    try {
      if (!expoPushToken) {
        console.log(
          "❌ Pas de token disponible pour envoyer la notification test"
        );
        return;
      }

      console.log("📤 Envoi d'une notification test...");
      await api.post("/notifications/send", {
        token: expoPushToken,
        title: "Test de Notification",
        body: "Si vous voyez ceci, les notifications fonctionnent ! 🎉",
        data: { type: "test" },
      });
      console.log("✅ Notification test envoyée");
    } catch (error) {
      console.log("❌ Erreur lors de l'envoi de la notification test:", error);
    }
  };

  useEffect(() => {
    console.log("🔄 Initialisation des notifications...");

    const initializeNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log("📱 Token obtenu:", token);

        if (token) {
          setExpoPushToken(token);

          if (user?.id) {
            console.log(
              "👤 Envoi du token au backend pour l'utilisateur:",
              user.id
            );
            try {
              await api.post("/NotificationToken/notification-tokens", {
                expo_push_token: token,
              });
              console.log("✅ Token sauvegardé avec succès sur le backend");
            } catch (error) {
              console.log("❌ Erreur lors de la sauvegarde du token:", error);
            }
          }
        }
      } catch (error) {
        console.log(
          "❌ Erreur lors de l'initialisation des notifications:",
          error
        );
      }
    };

    initializeNotifications();

    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📩 Notification reçue en foreground:", notification);
      }
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          "🕹️ Interaction utilisateur avec la notification:",
          response
        );
      }
    );

    return () => {
      console.log("🧹 Nettoyage des listeners de notifications");
      foregroundSub.remove();
      responseSub.remove();
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, sendTestNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

async function registerForPushNotificationsAsync(): Promise<string | null> {
  console.log("📲 Vérification du device...");

  if (!Device.isDevice) {
    console.log("⚠️ Notifications non disponibles sur l'émulateur");
    return null;
  }

  console.log("🔐 Vérification des permissions...");
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    console.log("📝 Demande de permissions...");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("🚫 Permissions refusées pour les notifications");
    return null;
  }

  console.log("🎯 Récupération du token...");
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log("✨ Token généré avec succès");
    return tokenData.data;
  } catch (error) {
    console.log("❌ Erreur lors de la génération du token:", error);
    return null;
  }
}
