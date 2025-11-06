import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CategoryManagement from "@/components/CategoryManagement";
import Colors from "@/constants/colors";
import { FolderTree } from "lucide-react-native";

export default function CategoryManagementScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FolderTree size={64} color={Colors.primary.accent} />
        <Text style={styles.title}>Category Management</Text>
        <Text style={styles.description}>
          Manage categories, keywords, and classification rules
        </Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.openButtonText}>Open Category Management</Text>
        </TouchableOpacity>
      </View>
      <CategoryManagement visible={modalVisible} onClose={() => setModalVisible(false)} />
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
