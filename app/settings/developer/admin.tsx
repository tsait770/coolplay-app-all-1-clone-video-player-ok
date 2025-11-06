import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AdminPanel from "@/components/AdminPanel";
import Colors from "@/constants/colors";
import { Shield } from "lucide-react-native";

export default function AdminScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Shield size={64} color={Colors.primary.accent} />
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.description}>
          Access administrative features and referral code management
        </Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.openButtonText}>Open Admin Panel</Text>
        </TouchableOpacity>
      </View>
      <AdminPanel visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 32,
    lineHeight: 24,
  },
  openButton: {
    backgroundColor: Colors.primary.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  openButtonText: {
    color: Colors.primary.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
