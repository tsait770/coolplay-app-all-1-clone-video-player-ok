import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { User, CreditCard, Gift, Smartphone, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountIndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const accountItems = [
    {
      icon: User,
      label: t("account_info"),
      route: "/settings/account/profile",
    },
    {
      icon: CreditCard,
      label: t("subscription_plan"),
      route: "/settings/account/membership",
    },
    {
      icon: Gift,
      label: t("enter_referral_code"),
      route: "/settings/account/referral",
    },
    {
      icon: Smartphone,
      label: t("device_management"),
      route: "/settings/account/devices",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {accountItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={index}
              style={styles.item}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.itemContent}>
                <Icon size={20} color={Colors.primary.accent} />
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary.bg,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: Colors.primary.text,
    fontWeight: "500" as const,
  },
});
