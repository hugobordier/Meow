// ToastContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  X,
} from "react-native-feather";
import { useColorScheme } from "nativewind";

// Types de toasts
export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

// Interface pour le Toast
interface ToastData {
  message: string;
  type: ToastType;
}

// Interface pour le contexte
interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

// Props du Provider
interface ToastProviderProps {
  children: ReactNode;
}

// Props du Toast
interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

// Configuration de style par type
interface ToastConfig {
  bgColor: string;
  borderColor: string;
  textColor: string;
  Icon: React.ComponentType<any>;
  iconColor: string;
}

// Création du contexte
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    message: string,
    type: ToastType = ToastType.SUCCESS,
    duration: number = 3000
  ) => {
    // Annuler le toast précédent s'il existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Définir le nouveau toast
    setToast({ message, type });

    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer pour masquer le toast
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
      translateY.setValue(-20);
    });
  };

  // Nettoyer le timeout quand le composant est démonté
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const animatedStyle: ViewStyle = {
    opacity: fadeAnim,
    transform: [{ translateY }],
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 9999,
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View style={animatedStyle}>
          <Toast toast={toast} onDismiss={hideToast} />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { type, message } = toast;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const configs: Record<
    ToastType,
    {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      Icon: React.ComponentType<any>;
      iconColor: string;
    }
  > = {
    [ToastType.SUCCESS]: {
      backgroundColor: isDark ? "#14532d" : "#dcfce7",
      borderColor: "#22c55e",
      textColor: isDark ? "#dcfce7" : "#166534",
      Icon: CheckCircle,
      iconColor: isDark ? "#4ade80" : "#22c55e",
    },
    [ToastType.ERROR]: {
      backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
      borderColor: "#ef4444",
      textColor: isDark ? "#fee2e2" : "#991b1b",
      Icon: AlertCircle,
      iconColor: isDark ? "#f87171" : "#ef4444",
    },
    [ToastType.WARNING]: {
      backgroundColor: isDark ? "#78350f" : "#fef3c7",
      borderColor: "#f59e0b",
      textColor: isDark ? "#fef3c7" : "#92400e",
      Icon: AlertTriangle,
      iconColor: isDark ? "#fbbf24" : "#f59e0b",
    },
  };

  const { backgroundColor, borderColor, textColor, Icon, iconColor } =
    configs[type];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <Icon width={20} height={20} color={iconColor} />
      <Text
        style={{
          flex: 1,
          marginHorizontal: 12,
          fontWeight: "500",
          color: textColor,
        }}
      >
        {message}
      </Text>
      <TouchableOpacity
        style={{ padding: 4 }}
        onPress={onDismiss}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <X width={18} height={18} color={isDark ? "#9ca3af" : "#6b7280"} />
      </TouchableOpacity>
    </View>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé dans un ToastProvider");
  }
  return context;
};
