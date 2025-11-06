import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import ReferralCodeModal from "@/components/ReferralCodeModal";

export default function ReferralScreen() {
  return (
    <View style={styles.container}>
      <ReferralCodeModal visible={true} onClose={() => {}} isFirstTime={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
});
