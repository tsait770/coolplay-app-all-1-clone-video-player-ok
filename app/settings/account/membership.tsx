import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Crown, Check, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { useMembership } from "@/providers/MembershipProvider";

export default function MembershipScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const membership = useMembership();
  const membershipType = membership.tier || "free";
  const usage = {
    remaining: membership.trialUsageRemaining || 0,
    totalUsed: membership.usageCount || 0,
  };

  const plans = [
    {
      id: "trial",
      name: t("free_trial"),
      price: t("free"),
      features: [
        t("trial_uses_2000"),
        t("all_sources_supported"),
        t("adult_content_supported"),
        t("one_device"),
      ],
      color: Colors.primary.accent,
      current: membershipType === "free_trial",
    },
    {
      id: "free",
      name: t("free_member"),
      price: t("free"),
      features: [
        t("daily_30_uses"),
        t("basic_sources_only"),
        t("no_adult_content"),
        t("one_device"),
      ],
      color: Colors.primary.textSecondary,
      current: membershipType === "free",
    },
    {
      id: "basic",
      name: t("basic_member"),
      price: "$4.99/mo",
      features: [
        t("monthly_1500_uses"),
        t("daily_40_bonus"),
        t("all_sources_supported"),
        t("adult_content_supported"),
        t("three_devices"),
      ],
      color: Colors.accent.gradient.blue[0],
      current: membershipType === "basic",
    },
    {
      id: "premium",
      name: t("premium_member"),
      price: "$9.99/mo",
      features: [
        t("unlimited_uses"),
        t("all_sources_supported"),
        t("adult_content_supported"),
        t("five_devices"),
        t("priority_support"),
      ],
      color: Colors.accent.gradient.purple[0],
      current: membershipType === "premium",
    },
  ];

  const handleUpgrade = (planId: string) => {
    router.push("/subscription" as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentPlanSection}>
        <Crown size={40} color={Colors.primary.accent} />
        <Text style={styles.currentPlanTitle}>{t("current_plan")}</Text>
        <Text style={styles.currentPlanName}>
          {plans.find((p) => p.current)?.name || t("free_member")}
        </Text>

        {membershipType !== "premium" && (
          <View style={styles.usageInfo}>
            <Text style={styles.usageText}>
              {t("remaining_uses")}: {usage.remaining}
            </Text>
            <Text style={styles.usageText}>
              {t("total_used")}: {usage.totalUsed}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>{t("available_plans")}</Text>

        {plans.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.current && styles.planCardCurrent,
              { borderColor: plan.color },
            ]}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={[styles.planPrice, { color: plan.color }]}>
                  {plan.price}
                </Text>
              </View>
              {plan.current && (
                <View style={[styles.currentBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.currentBadgeText}>{t("current")}</Text>
                </View>
              )}
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {!plan.current && plan.id !== "free" && (
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: plan.color }]}
                onPress={() => handleUpgrade(plan.id)}
              >
                <Zap size={18} color={Colors.primary.text} />
                <Text style={styles.upgradeButtonText}>
                  {t("upgrade_now")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  currentPlanSection: {
    alignItems: "center",
    padding: 30,
    backgroundColor: Colors.surface.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  currentPlanTitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginTop: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.primary.text,
    marginTop: 8,
  },
  usageInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.primary.bg,
    borderRadius: 12,
    width: "100%",
  },
  usageText: {
    fontSize: 14,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  plansSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary.textSecondary,
    marginBottom: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  planCard: {
    backgroundColor: Colors.surface.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  planCardCurrent: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary.text,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginTop: 4,
  },
  currentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.primary.text,
    flex: 1,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
});
