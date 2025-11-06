import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Code, Database, FileText, Zap, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function DeveloperIndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const developerOptions = [
    {
      icon: Code,
      label: t("admin_panel"),
      description: t("admin_panel_desc"),
      route: "/settings/developer/admin",
    },
    {
      icon: Database,
      label: t("category_management"),
      description: t("category_management_desc"),
      route: "/settings/developer/category-management",
    },
    {
      icon: FileText,
      label: t("api_settings"),
      description: t("api_settings_desc"),
      route: "/settings/developer/api",
    },
    {
      icon: FileText,
      label: t("debug_logs"),
      description: t("debug_logs_desc"),
      route: "/settings/developer/logs",
    },
    {
      icon: Zap,
      label: t("experimental_features"),
      description: t("experimental_features_desc"),
      route: "/settings/developer/experimental",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("developer_options")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("developer_options_subtitle")}
          </Text>
        </View>

        <View style={styles.section}>
          {developerOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Pressable
                key={index}
                style={styles.optionItem}
                onPress={() => router.push(option.route as any)}
                android_ripple={{ color: "rgba(108,212,255,0.15)" }}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.iconContainer}>
                    <Icon size={22} color={Colors.primary.accent} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.primary.textSecondary} />
              </Pressable>
            );
          })}
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 20,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary.bg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${Colors.primary.accent}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
    lineHeight: 18,
  },
});
