import React from "react";
import { View, ViewStyle } from "react-native";
import { useColorScheme } from "react-native";

type SectionCardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

const SectionCard = ({ children, style = {} }: SectionCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: isDark ? "#374151" : "#ffffff",
        borderWidth: 1,
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
      }}
    >
      {children}
    </View>
  );
};

export default SectionCard;
