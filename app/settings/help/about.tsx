import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { Info, Globe, Mail, Github, Twitter, ExternalLink } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import Constants from "expo-constants";

export default function AboutScreen() {
  const { t } = useTranslation();

  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const buildNumber = Constants.expoConfig?.extra?.buildNumber || "1";
  const appName = Constants.expoConfig?.name || "CoolPlay";

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.appIcon}>
            <Info size={48} color={Colors.primary.accent} />
          </View>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.version}>
            {t("version")} {appVersion} ({buildNumber})
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("about_app")}</Text>
          <View style={styles.card}>
            <Text style={styles.description}>
              {t("app_description")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("app_information")}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("version")}</Text>
              <Text style={styles.infoValue}>{appVersion}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("build_number")}</Text>
              <Text style={styles.infoValue}>{buildNumber}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("platform")}</Text>
              <Text style={styles.infoValue}>
                {Constants.platform?.ios
                  ? "iOS"
                  : Constants.platform?.android
                    ? "Android"
                    : "Web"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("expo_version")}</Text>
              <Text style={styles.infoValue}>
                {Constants.expoVersion || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("connect_with_us")}</Text>
          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://coolplay.com")}
          >
            <View style={styles.linkLeft}>
              <Globe size={20} color={Colors.primary.accent} />
              <Text style={styles.linkText}>{t("website")}</Text>
            </View>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("mailto:support@coolplay.com")}
          >
            <View style={styles.linkLeft}>
              <Mail size={20} color={Colors.primary.accent} />
              <Text style={styles.linkText}>{t("email_support")}</Text>
            </View>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://github.com/coolplay")}
          >
            <View style={styles.linkLeft}>
              <Github size={20} color={Colors.primary.accent} />
              <Text style={styles.linkText}>GitHub</Text>
            </View>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://twitter.com/coolplay")}
          >
            <View style={styles.linkLeft}>
              <Twitter size={20} color={Colors.primary.accent} />
              <Text style={styles.linkText}>Twitter</Text>
            </View>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("legal")}</Text>
          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://coolplay.com/terms")}
          >
            <Text style={styles.linkText}>{t("terms_of_service")}</Text>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://coolplay.com/privacy")}
          >
            <Text style={styles.linkText}>{t("privacy_policy")}</Text>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => openLink("https://coolplay.com/licenses")}
          >
            <Text style={styles.linkText}>{t("open_source_licenses")}</Text>
            <ExternalLink size={18} color={Colors.primary.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2025 CoolPlay. {t("all_rights_reserved")}
          </Text>
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
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: `${Colors.primary.accent}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  section: {
    padding: 20,
    paddingTop: 0,
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
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  description: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card.border,
    marginVertical: 4,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.primary.text,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  copyright: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: "center",
  },
});
