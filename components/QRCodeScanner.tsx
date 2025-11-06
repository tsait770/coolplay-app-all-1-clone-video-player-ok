import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { X, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  onManualEntry: (code: string) => void;
}

export default function QRCodeScanner({ onScan, onClose, onManualEntry }: QRCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);

  useEffect(() => {
    if (!permission?.granted && Platform.OS !== 'web') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    onScan(data);
  };

  const handleManualSubmit = () => {
    if (manualCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-character verification code');
      return;
    }
    onManualEntry(manualCode.toUpperCase());
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Camera size={48} color={Colors.primary.textSecondary} />
        <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => setShowManualEntry(true)}
        >
          <Text style={styles.secondaryButtonText}>Enter Code Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showManualEntry) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.primary.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>Enter the 6-character code displayed on your other device</Text>

        <TextInput
          style={styles.input}
          value={manualCode}
          onChangeText={(text) => setManualCode(text.toUpperCase())}
          placeholder="ABC123"
          placeholderTextColor={Colors.primary.textSecondary}
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity 
          style={[styles.button, manualCode.length !== 6 && styles.buttonDisabled]} 
          onPress={handleManualSubmit}
          disabled={manualCode.length !== 6}
        >
          <Text style={styles.buttonText}>Verify Device</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => setShowManualEntry(false)}
        >
          <Text style={styles.secondaryButtonText}>Scan QR Code Instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={24} color={Colors.primary.text} />
      </TouchableOpacity>

      {Platform.OS !== 'web' ? (
        <CameraView
          style={styles.camera}
          facing={'back' as CameraType}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              {scanned ? 'QR Code Scanned!' : 'Point camera at QR code'}
            </Text>
          </View>
        </CameraView>
      ) : (
        <View style={styles.webFallback}>
          <Camera size={64} color={Colors.primary.textSecondary} />
          <Text style={styles.message}>Camera scanning not available on web</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => setShowManualEntry(true)}
      >
        <Text style={styles.secondaryButtonText}>Enter Code Manually</Text>
      </TouchableOpacity>

      {scanned && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: Colors.card.bg,
    borderRadius: 20,
    padding: 8,
  },
  camera: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden' as const,
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary.accent,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center' as const,
  },
  webFallback: {
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.primary.text,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginBottom: 24,
    textAlign: 'center' as const,
  },
  message: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
    marginTop: 16,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.card.bg,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.primary.text,
    textAlign: 'center' as const,
    letterSpacing: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.accent,
  },
  secondaryButtonText: {
    color: Colors.primary.accent,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});
