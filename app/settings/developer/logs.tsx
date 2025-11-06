import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { FileText, Trash2, Download, Filter } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import * as Clipboard from "expo-clipboard";

type LogLevel = "info" | "warning" | "error" | "debug";

type LogEntry = {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: string;
};

export default function DebugLogsScreen() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | "all">("all");

  useEffect(() => {
    const sampleLogs: LogEntry[] = [
      {
        id: "1",
        timestamp: new Date(),
        level: "info",
        message: "App initialized successfully",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 60000),
        level: "warning",
        message: "Slow network detected",
        details: "Response time: 3.2s",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 120000),
        level: "error",
        message: "Failed to load video",
        details: "Error: Network timeout",
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 180000),
        level: "debug",
        message: "Voice command processed",
        details: "Command: play",
      },
    ];
    setLogs(sampleLogs);
  }, []);

  const filteredLogs =
    filterLevel === "all"
      ? logs
      : logs.filter((log) => log.level === filterLevel);

  const clearLogs = () => {
    Alert.alert(
      t("confirm"),
      t("confirm_clear_logs"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("clear"),
          style: "destructive",
          onPress: () => setLogs([]),
        },
      ]
    );
  };

  const exportLogs = async () => {
    const logsText = logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.message}${log.details ? `\n  ${log.details}` : ""}`
      )
      .join("\n\n");
    await Clipboard.setStringAsync(logsText);
    Alert.alert(t("success"), t("logs_copied_to_clipboard"));
  };

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case "info":
        return Colors.primary.accent;
      case "warning":
        return "#FFA500";
      case "error":
        return "#FF4444";
      case "debug":
        return "#9B59B6";
      default:
        return Colors.primary.textSecondary;
    }
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: `${getLevelColor(item.level)}20` },
          ]}
        >
          <Text
            style={[styles.levelText, { color: getLevelColor(item.level) }]}
          >
            {item.level.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.logMessage}>{item.message}</Text>
      {item.details && <Text style={styles.logDetails}>{item.details}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {(["all", "info", "warning", "error", "debug"] as const).map(
            (level) => (
              <Pressable
                key={level}
                style={[
                  styles.filterButton,
                  filterLevel === level && styles.filterButtonActive,
                ]}
                onPress={() => setFilterLevel(level)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterLevel === level && styles.filterButtonTextActive,
                  ]}
                >
                  {level === "all" ? t("all") : level}
                </Text>
              </Pressable>
            )
          )}
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={exportLogs}>
            <Download size={18} color={Colors.primary.accent} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={clearLogs}>
            <Trash2 size={18} color="#FF4444" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.logsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color={Colors.primary.textSecondary} />
            <Text style={styles.emptyText}>{t("no_logs_available")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.secondary.bg,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary.accent,
    borderColor: Colors.primary.accent,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.primary.textSecondary,
    textTransform: "capitalize" as const,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  logsList: {
    padding: 16,
  },
  logItem: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.primary.textSecondary,
  },
  logMessage: {
    fontSize: 14,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    fontFamily: "monospace",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    marginTop: 16,
  },
});
