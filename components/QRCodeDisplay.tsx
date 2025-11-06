import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Colors from '@/constants/colors';

interface QRCodeDisplayProps {
  qrData: string;
  verificationCode: string;
  expiresAt: string;
  isLoading?: boolean;
}

export default function QRCodeDisplay({
  qrData,
  verificationCode,
  expiresAt,
  isLoading = false,
}: QRCodeDisplayProps) {
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary.accent} />
        <Text style={styles.loadingText}>Generating QR Code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code to Bind Device</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={200}
          color={Colors.primary.text}
          backgroundColor={Colors.card.bg}
        />
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Or enter this code:</Text>
        <Text style={styles.code}>{verificationCode}</Text>
      </View>

      <View style={styles.expiryContainer}>
        <Text style={styles.expiryText}>
          Expires in: {getTimeRemaining()}
        </Text>
      </View>

      <Text style={styles.instructions}>
        1. Open the app on your new device{'\n'}
        2. Go to Settings → Device Management{'\n'}
        3. Scan this QR code or enter the code above
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center' as const,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary.text,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: Colors.card.bg,
    borderRadius: 12,
    marginBottom: 20,
  },
  codeContainer: {
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginBottom: 8,
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.primary.accent,
    letterSpacing: 4,
  },
  expiryContainer: {
    backgroundColor: Colors.card.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  instructions: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
});
