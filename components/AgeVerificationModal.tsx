import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { AlertCircle, CheckCircle, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

export interface AgeVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AgeVerificationModal({
  visible,
  onClose,
  onVerified,
}: AgeVerificationModalProps) {
  const { t } = useTranslation();
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmAdult, setConfirmAdult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyAgeMutation = trpc.membership.verifyAge.useMutation();

  const handleSubmit = async () => {
    if (!confirmAdult) {
      Alert.alert(
        t('error'),
        'You must confirm that you are 18 years or older.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyAgeMutation.mutateAsync({
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        confirmAdult,
      });

      if (result.success && result.ageVerified) {
        Alert.alert(t('success'), result.message);
        onVerified();
        onClose();
      } else {
        Alert.alert(t('error'), result.message);
      }
    } catch (error: any) {
      console.error('[AgeVerificationModal] Error:', error);
      Alert.alert(
        t('error'),
        error?.message || 'Failed to verify age. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.primary.textSecondary} />
          </TouchableOpacity>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <AlertCircle size={64} color={Colors.semantic.warning} />
            </View>

            <Text style={styles.title}>Age Verification Required</Text>
            
            <Text style={styles.description}>
              You are attempting to access adult content. This requires age verification to comply with legal regulations.
            </Text>

            <View style={styles.warningBox}>
              <AlertCircle size={20} color={Colors.semantic.warning} />
              <Text style={styles.warningText}>
                You must be at least 18 years old to access this content.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {dateOfBirth.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmAdult(!confirmAdult)}
            >
              <View style={[styles.checkbox, confirmAdult && styles.checkboxChecked]}>
                {confirmAdult && <CheckCircle size={20} color={Colors.primary.bg} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I confirm that I am 18 years of age or older and understand that the content may be explicit in nature.
              </Text>
            </TouchableOpacity>

            <View style={styles.legalNotice}>
              <Text style={styles.legalText}>
                <Text style={styles.legalBold}>Legal Notice: </Text>
                InstaPlay is a neutral video player that does not host, distribute, or recommend any content. All content is provided by external sources and accessed directly by you. By proceeding, you acknowledge sole responsibility for accessing such content in compliance with your local laws.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!confirmAdult || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!confirmAdult || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 159, 10, 0.1)',
    borderWidth: 1,
    borderColor: Colors.semantic.warning,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: Colors.semantic.warning,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.text,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: Colors.primary.bgTertiary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  dateText: {
    fontSize: 16,
    color: Colors.primary.text,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.card.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.accent,
    borderColor: Colors.primary.accent,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 20,
  },
  legalNotice: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  legalText: {
    fontSize: 12,
    color: Colors.primary.textTertiary,
    lineHeight: 18,
  },
  legalBold: {
    fontWeight: '700',
    color: Colors.primary.textSecondary,
  },
  submitButton: {
    backgroundColor: Colors.primary.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.interactive.disabled,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.text,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
  },
});
