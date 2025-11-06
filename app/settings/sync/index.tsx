import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Clock, 
  Wifi, 
  Battery,
  Check,
} from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import Colors from "@/constants/colors";
import { useStorage } from "@/providers/StorageProvider";

type SyncService = "none" | "icloud" | "google" | "dropbox";
type SyncFrequency = "auto" | "hourly" | "daily" | "manual";

export default function SyncSettings() {
  const { t } = useTranslation();
  const storage = useStorage();
  const insets = useSafeAreaInsets();
  
  const [syncEnabled, setSyncEnabled] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<SyncService>("google");
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>("auto");
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [chargingOnly, setChargingOnly] = useState<boolean>(false);
  const [lastSyncDate] = useState<string>("2024年1月15日 14:30");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncServices: { id: SyncService; label: string; icon: any }[] = [
    { id: "none", label: t("no_sync"), icon: CloudOff },
    { id: "icloud", label: "iCloud", icon: Cloud },
    { id: "google", label: "Google Drive", icon: Cloud },
    { id: "dropbox", label: "Dropbox", icon: Cloud },
  ];

  const syncFrequencies: { id: SyncFrequency; label: string; description: string }[] = [
    { id: "auto", label: t("auto"), description: t("sync_when_changed") },
    { id: "hourly", label: t("hourly"), description: t("sync_every_hour") },
    { id: "daily", label: t("daily"), description: t("sync_every_day") },
    { id: "manual", label: t("manual"), description: t("sync_manually") },
  ];

  const handleSyncToggle = async (value: boolean) => {
    setSyncEnabled(value);
    try {
      await storage.setItem("sync_enabled", value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save sync setting:", error);
    }
  };

  const handleServiceSelect = async (service: SyncService) => {
    setSelectedService(service);
    try {
      await storage.setItem("sync_service", service);
    } catch (error) {
      console.error("Failed to save sync service:", error);
    }
  };

  const handleFrequencySelect = async (frequency: SyncFrequency) => {
    setSyncFrequency(frequency);
    try {
      await storage.setItem("sync_frequency", frequency);
    } catch (error) {
      console.error("Failed to save sync frequency:", error);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(t("success"), t("sync_complete"));
    } catch {
      Alert.alert(t("error"), t("sync_failed"));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleWifiToggle = async (value: boolean) => {
    setWifiOnly(value);
    try {
      await storage.setItem("sync_wifi_only", value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save wifi setting:", error);
    }
  };

  const handleChargingToggle = async (value: boolean) => {
    setChargingOnly(value);
    try {
      await storage.setItem("sync_charging_only", value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save charging setting:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.syncStatusCard}>
            <View style={styles.syncStatusIcon}>
              <Cloud size={32} color={Colors.primary.accent} />
            </View>
            <View style={styles.syncStatusInfo}>
              <Text style={styles.syncStatusTitle}>
                {syncEnabled ? t("synced") : t("sync_disabled")}
              </Text>
              <Text style={styles.syncStatusDescription}>
                {t("last_sync")}: {lastSyncDate}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.syncButton} 
            onPress={handleSyncNow}
            disabled={isSyncing || !syncEnabled}
          >
            <RefreshCw 
              size={20} 
              color={Colors.primary.text} 
              style={isSyncing ? styles.spinning : undefined}
            />
            <Text style={styles.syncButtonText}>
              {isSyncing ? t("syncing") : t("sync_now")}
            </Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("sync_service")}</Text>
          </View>

          <View style={styles.card}>
            {syncServices.map((service, index) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              return (
                <React.Fragment key={service.id}>
                  <TouchableOpacity
                    style={styles.serviceRow}
                    onPress={() => handleServiceSelect(service.id)}
                  >
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: Colors.primary.accent + "20" }
                    ]}>
                      <Icon size={24} color={Colors.primary.accent} />
                    </View>
                    <Text style={styles.serviceLabel}>{service.label}</Text>
                    {isSelected && (
                      <Check size={20} color={Colors.primary.accent} />
                    )}
                  </TouchableOpacity>
                  {index < syncServices.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("sync_frequency")}</Text>
          </View>

          <View style={styles.card}>
            {syncFrequencies.map((frequency, index) => {
              const isSelected = syncFrequency === frequency.id;
              return (
                <React.Fragment key={frequency.id}>
                  <TouchableOpacity
                    style={styles.frequencyRow}
                    onPress={() => handleFrequencySelect(frequency.id)}
                  >
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: Colors.primary.accent + "20" }
                    ]}>
                      <Clock size={24} color={Colors.primary.accent} />
                    </View>
                    <View style={styles.frequencyInfo}>
                      <Text style={styles.frequencyLabel}>{frequency.label}</Text>
                      <Text style={styles.frequencyDescription}>
                        {frequency.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={20} color={Colors.primary.accent} />
                    )}
                  </TouchableOpacity>
                  {index < syncFrequencies.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("sync_conditions")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: Colors.primary.accent + "20" }
              ]}>
                <Wifi size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("wifi_only_sync")}</Text>
                <Text style={styles.settingDescription}>
                  {t("save_mobile_data")}
                </Text>
              </View>
              <Switch
                value={wifiOnly}
                onValueChange={handleWifiToggle}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: Colors.primary.accent + "20" }
              ]}>
                <Battery size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("charging_only_sync")}</Text>
                <Text style={styles.settingDescription}>
                  {t("save_battery")}
                </Text>
              </View>
              <Switch
                value={chargingOnly}
                onValueChange={handleChargingToggle}
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
  syncStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  syncStatusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.accent + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  syncStatusInfo: {
    flex: 1,
  },
  syncStatusTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  syncStatusDescription: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  spinning: {
    transform: [{ rotate: "360deg" }],
  },
  sectionHeader: {
    marginTop: 8,
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
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  serviceLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.primary.text,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  frequencyInfo: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  frequencyDescription: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
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
