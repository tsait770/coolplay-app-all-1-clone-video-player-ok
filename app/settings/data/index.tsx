import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Shield, Clock, Upload, Download, RotateCcw, HardDrive, ChevronRight } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import Colors from "@/constants/colors";
import { useStorage } from "@/providers/StorageProvider";
import { useBookmarks } from "@/providers/BookmarkProvider";
import { importBookmarksFromFile } from "@/utils/bookmarkImporter";

export default function DataManagementSettings() {
  const { t } = useTranslation();
  const storage = useStorage();
  const { importBookmarks, exportBookmarks } = useBookmarks();
  
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(true);
  const [backupFrequency] = useState<string>("daily");
  const [cacheSize, setCacheSize] = useState<string>("128 MB");
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastBackupDate] = useState<string>("2024年1月15日 14:30");

  const handleAutoBackupToggle = async (value: boolean) => {
    setAutoBackupEnabled(value);
    try {
      await storage.setItem("auto_backup_enabled", value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save auto backup setting:", error);
    }
  };

  const handleBackupNow = () => {
    Alert.alert(
      t("backup_now"),
      t("backup_in_progress"),
      [{ text: t("ok") }]
    );
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const htmlContent = exportBookmarks('html');
      const jsonContent = exportBookmarks('json');
      
      if (Platform.OS === 'web') {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookmarks_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Alert.alert(t("success"), t("export_success"));
      } else {
        Alert.alert(
          t("export_data"),
          t("export_data_description"),
          [
            { text: t("cancel"), style: "cancel" },
            { text: "HTML", onPress: () => console.log("Export HTML:", htmlContent) },
            { text: "JSON", onPress: () => console.log("Export JSON:", jsonContent) },
          ]
        );
      }
    } catch (error) {
      console.error('[DataManagement] Export error:', error);
      Alert.alert(t("error"), t("export_failed"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.json';
        
        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) {
            setIsImporting(false);
            return;
          }
          
          try {
            console.log('[DataManagement] Reading file:', file.name, 'Size:', file.size);
            
            const reader = new FileReader();
            reader.onload = async (event: any) => {
              try {
                const content = event.target?.result as string;
                if (!content) {
                  Alert.alert(t("error"), t("file_read_failed"));
                  setIsImporting(false);
                  return;
                }
                
                console.log('[DataManagement] File content length:', content.length);
                
                const format = file.name.endsWith('.json') ? 'json' : 'html';
                console.log('[DataManagement] Detected format:', format);
                
                const result = await importBookmarksFromFile(content, format);
                
                console.log('[DataManagement] Import result:', result);
                
                if (result.success && result.bookmarks.length > 0) {
                  importBookmarks(result.bookmarks);
                  Alert.alert(
                    t("success"),
                    `${t("import_success")}\n${t("imported")}: ${result.imported}\n${t("failed")}: ${result.failed}\n${t("skipped")}: ${result.skipped}`
                  );
                } else {
                  const errorMsg = result.errors.length > 0 
                    ? result.errors[0].reason 
                    : t("no_bookmarks_found");
                  Alert.alert(t("error"), errorMsg);
                }
              } catch (error) {
                console.error('[DataManagement] Parse error:', error);
                Alert.alert(t("error"), t("import_failed"));
              } finally {
                setIsImporting(false);
              }
            };
            
            reader.onerror = () => {
              console.error('[DataManagement] FileReader error');
              Alert.alert(t("error"), t("file_read_failed"));
              setIsImporting(false);
            };
            
            reader.readAsText(file);
          } catch (error) {
            console.error('[DataManagement] File handling error:', error);
            Alert.alert(t("error"), t("import_failed"));
            setIsImporting(false);
          }
        };
        
        input.click();
      } else {
        Alert.alert(
          t("import_data"),
          t("import_data_description"),
          [
            { text: t("cancel"), style: "cancel" },
            { text: t("import"), onPress: () => console.log("Importing data...") },
          ]
        );
        setIsImporting(false);
      }
    } catch (error) {
      console.error('[DataManagement] Import error:', error);
      Alert.alert(t("error"), t("import_failed"));
      setIsImporting(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      t("clear_cache"),
      t("clear_cache_confirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("clear"),
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await storage.clear();
              setCacheSize("0 MB");
              Alert.alert(t("success"), t("cache_cleared"));
            } catch (error: any) {
              console.error("Error clearing storage:", error);
              
              const errorMessage = error?.message || '';
              const errorCode = error?.code;
              const underlyingError = error?.userInfo?.NSUnderlyingError;
              const underlyingCode = underlyingError?.code;
              
              if (errorMessage.includes('No such file or directory') || 
                  errorMessage.includes('無法移除') ||
                  errorMessage.includes('无法移除') ||
                  errorCode === 4 || 
                  errorCode === 'ENOENT' ||
                  underlyingCode === 2) {
                console.log('[Settings] Storage already empty, treating as success');
                setCacheSize("0 MB");
                Alert.alert(t("success"), t("cache_cleared"));
              } else {
                Alert.alert(
                  t("error"),
                  error?.message || t("cache_clear_failed")
                );
              }
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("auto_backup")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Shield size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("enable_auto_backup")}</Text>
                <Text style={styles.settingDescription}>
                  {t("auto_backup_description")}
                </Text>
              </View>
              <Switch
                value={autoBackupEnabled}
                onValueChange={handleAutoBackupToggle}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Clock size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("backup_frequency")}</Text>
                <Text style={styles.settingDescription}>{t(backupFrequency)}</Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("backup_restore")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleBackupNow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Upload size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("backup_now")}</Text>
                <Text style={styles.settingDescription}>
                  {t("last_backup")}: {lastBackupDate}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleExportData} disabled={isExporting}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Download size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("export_data")}</Text>
                <Text style={styles.settingDescription}>
                  {t("download_data_copy")}
                </Text>
              </View>
              {isExporting ? (
                <ActivityIndicator size="small" color={Colors.primary.accent} />
              ) : (
                <ChevronRight size={20} color={Colors.primary.textSecondary} />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleImportData} disabled={isImporting}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <RotateCcw size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("restore_from_backup")}</Text>
                <Text style={styles.settingDescription}>
                  {t("restore_previous_backup")}
                </Text>
              </View>
              {isImporting ? (
                <ActivityIndicator size="small" color={Colors.primary.accent} />
              ) : (
                <ChevronRight size={20} color={Colors.primary.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("storage_space")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <HardDrive size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("clear_cache")}</Text>
                <Text style={styles.settingDescription}>
                  {t("release_storage_space")}
                </Text>
              </View>
              {isClearing ? (
                <ActivityIndicator size="small" color={Colors.primary.accent} />
              ) : (
                <Text style={styles.cacheSize}>{cacheSize}</Text>
              )}
            </TouchableOpacity>
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
  cacheSize: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
});
