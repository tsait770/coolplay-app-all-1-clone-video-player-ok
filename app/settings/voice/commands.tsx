import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function CommandsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("custom_commands")}</Text>
      <Text style={styles.subtext}>Custom commands coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.primary.text,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
  },
});
