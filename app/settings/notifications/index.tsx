import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

import { Bell, CheckCircle, AlertCircle, Download, Volume2 } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import Colors from "@/constants/colors";
import { useStorage } from "@/providers/StorageProvider";

export default function NotificationsSettings() {
  const { t } = useTranslation();
  const storage = useStorage();
  
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [backupComplete, setBackupComplete] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<boolean>(true);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggle = async (key: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    try {
      await storage.setItem(`notification_${key}`, value ? "true" : "false");
    } catch (error) {
      console.error(`Failed to save notification setting ${key}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Bell size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("push_notifications")}</Text>
                <Text style={styles.settingDescription}>
                  {t("receive_app_notifications")}
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={(val) => handleToggle("push", val, setPushNotifications)}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("notification_types")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.success + "20" }]}>
                <CheckCircle size={24} color={Colors.success} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("backup_complete")}</Text>
                <Text style={styles.settingDescription}>
                  {t("notify_when_backup_complete")}
                </Text>
              </View>
              <Switch
                value={backupComplete}
                onValueChange={(val) => handleToggle("backup", val, setBackupComplete)}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.danger + "20" }]}>
                <AlertCircle size={24} color={Colors.danger} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("sync_error")}</Text>
                <Text style={styles.settingDescription}>
                  {t("notify_when_sync_error")}
                </Text>
              </View>
              <Switch
                value={syncError}
                onValueChange={(val) => handleToggle("sync_error", val, setSyncError)}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Download size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("update_reminder")}</Text>
                <Text style={styles.settingDescription}>
                  {t("notify_when_update_available")}
                </Text>
              </View>
              <Switch
                value={updateAvailable}
                onValueChange={(val) => handleToggle("update", val, setUpdateAvailable)}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("sound_settings")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Volume2 size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("sound_effects")}</Text>
                <Text style={styles.settingDescription}>
                  {t("play_notification_sound")}
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={(val) => handleToggle("sound", val, setSoundEnabled)}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  card: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary.accent + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card.border,
    marginVertical: 12,
  },
});
