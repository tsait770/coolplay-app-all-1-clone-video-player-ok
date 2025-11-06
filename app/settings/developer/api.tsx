import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Key, Server, Globe, Copy, Eye, EyeOff } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import * as Clipboard from "expo-clipboard";

export default function APISettingsScreen() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);
  const [apiEndpoint, setApiEndpoint] = useState<string>("https://api.coolplay.com");

  const generateApiKey = () => {
    const newKey = `cp_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    Alert.alert(t("success"), t("api_key_generated"));
  };

  const copyApiKey = async () => {
    if (apiKey) {
      await Clipboard.setStringAsync(apiKey);
      Alert.alert(t("success"), t("api_key_copied"));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("api_configuration")}</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Key size={20} color={Colors.primary.accent} />
              <Text style={styles.cardTitle}>{t("api_key")}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder={t("enter_api_key")}
                placeholderTextColor={Colors.primary.textSecondary}
                secureTextEntry={!showApiKey}
              />
              <Pressable
                style={styles.iconButton}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff size={20} color={Colors.primary.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.primary.textSecondary} />
                )}
              </Pressable>
            </View>
            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={generateApiKey}>
                <Text style={styles.buttonText}>{t("generate_key")}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={copyApiKey}
              >
                <Copy size={16} color={Colors.primary.accent} />
                <Text style={styles.buttonTextSecondary}>{t("copy")}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Server size={20} color={Colors.primary.accent} />
              <Text style={styles.cardTitle}>{t("api_endpoint")}</Text>
            </View>
            <TextInput
              style={styles.input}
              value={apiEndpoint}
              onChangeText={setApiEndpoint}
              placeholder={t("enter_api_endpoint")}
              placeholderTextColor={Colors.primary.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Globe size={20} color={Colors.primary.accent} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t("test_mode")}</Text>
                  <Text style={styles.settingDescription}>
                    {t("test_mode_desc")}
                  </Text>
                </View>
              </View>
              <Switch
                value={testMode}
                onValueChange={setTestMode}
                trackColor={{
                  false: Colors.primary.textSecondary,
                  true: Colors.primary.accent,
                }}
                thumbColor={Colors.secondary.bg}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("api_documentation")}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {t("api_documentation_info")}
            </Text>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>{t("view_documentation")}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.primary.text,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  iconButton: {
    padding: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary.accent,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary.accent,
    flexDirection: "row",
    gap: 6,
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.accent,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  linkButton: {
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.accent,
  },
});
