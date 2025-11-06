import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Play, Mic, AlertCircle, Info } from 'lucide-react-native';
import UniversalVideoPlayer from '@/components/UniversalVideoPlayer';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { detectVideoSource, getSupportedPlatforms, getVideoFormatSupport } from '@/utils/videoSourceDetector';
import { parseVoiceCommand, getSupportedLanguages } from '@/utils/voiceCommandParser';
import { useNativeSpeechRecognition } from '@/hooks/useNativeSpeechRecognition';
import { useMembership } from '@/providers/MembershipProvider';
import Colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

export default function PlayerDemoScreen() {
  const { t } = useTranslation();
  const { tier } = useMembership();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const {
    isListening,
    isProcessing,
    transcript,
    parsedCommand,
    error: speechError,
    startListening: startSpeech,
    stopListening: stopSpeech,
    resetTranscript,
  } = useNativeSpeechRecognition({
    language: 'en',
    continuous: false,
    interimResults: true,
  });

  const handlePlayUrl = () => {
    if (!url.trim()) {
      Alert.alert(t('error'), 'Please enter a valid URL');
      return;
    }

    const sourceInfo = detectVideoSource(url);
    console.log('[PlayerDemo] Source info:', sourceInfo);

    if (sourceInfo.type === 'unsupported') {
      Alert.alert(
        'Unsupported Platform',
        `${sourceInfo.platform} is not supported due to DRM restrictions. Please use content from supported platforms.`
      );
      return;
    }

    setCurrentUrl(url);
  };

  const handleAgeVerificationRequired = () => {
    setShowAgeVerification(true);
  };

  const handleAgeVerified = () => {
    console.log('[PlayerDemo] Age verified, continuing playback');
  };

  const handleError = (error: string) => {
    Alert.alert('Playback Error', error);
  };

  const supportedPlatforms = getSupportedPlatforms(tier);
  const supportedFormats = getVideoFormatSupport(tier);
  const supportedLanguages = getSupportedLanguages();

  // Test voice command parsing
  const testVoiceCommand = (text: string, language: string = 'en') => {
    const parsed = parseVoiceCommand(text, language);
    console.log('[PlayerDemo] Voice command test:', parsed);
    Alert.alert(
      'Voice Command Parsed',
      `Type: ${parsed.type}\nValue: ${parsed.value || 'N/A'}\nUnit: ${parsed.unit || 'N/A'}`
    );
  };

  const handleVoiceRecognition = async () => {
    if (isListening) {
      await stopSpeech();
    } else {
      resetTranscript();
      await startSpeech();
    }
  };

  useEffect(() => {
    if (parsedCommand && parsedCommand.type !== 'unknown') {
      console.log('[PlayerDemo] Parsed command:', parsedCommand);
      Alert.alert(
        'Voice Command Detected',
        `Command: ${parsedCommand.type}\nText: "${parsedCommand.originalText}"\nConfidence: ${(parsedCommand.confidence * 100).toFixed(0)}%`,
        [
          { text: 'OK', onPress: resetTranscript },
        ]
      );
    }
  }, [parsedCommand]);

  useEffect(() => {
    if (speechError) {
      Alert.alert('Speech Recognition Error', speechError);
    }
  }, [speechError]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Video Player Demo',
          headerStyle: { backgroundColor: Colors.primary.bg },
          headerTintColor: Colors.primary.text,
        }}
      />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Enter Video URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderTextColor={Colors.primary.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handlePlayUrl}
              >
                <Play size={20} color={Colors.primary.text} />
                <Text style={styles.buttonText}>Play Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setShowInfo(!showInfo)}
              >
                <Info size={20} color={Colors.primary.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          {showInfo && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Your Membership: {tier.toUpperCase()}</Text>
              
              <Text style={styles.infoSubtitle}>Supported Platforms:</Text>
              <Text style={styles.infoText}>
                {supportedPlatforms.slice(0, 10).join(', ')}
                {supportedPlatforms.length > 10 ? `, and ${supportedPlatforms.length - 10} more...` : ''}
              </Text>

              <Text style={styles.infoSubtitle}>Supported Formats:</Text>
              <Text style={styles.infoText}>
                {supportedFormats.join(', ').toUpperCase()}
              </Text>

              <Text style={styles.infoSubtitle}>Voice Control Languages:</Text>
              <Text style={styles.infoText}>
                {supportedLanguages.join(', ')}
              </Text>
            </View>
          )}

          {/* Player Section */}
          {currentUrl ? (
            <View style={styles.playerSection}>
              <Text style={styles.playerTitle}>Now Playing</Text>
              <View style={styles.playerContainer}>
                <UniversalVideoPlayer
                  url={currentUrl}
                  onError={handleError}
                  onAgeVerificationRequired={handleAgeVerificationRequired}
                  autoPlay={false}
                />
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <AlertCircle size={48} color={Colors.primary.textTertiary} />
              <Text style={styles.placeholderText}>
                Enter a video URL above to start playing
              </Text>
              <Text style={styles.placeholderSubtext}>
                Supports YouTube, Vimeo, direct MP4/HLS/DASH links, and more
              </Text>
            </View>
          )}

          {/* Voice Command Test Section */}
          <View style={styles.voiceSection}>
            <Text style={styles.sectionTitle}>Voice Command Test</Text>
            
            {/* Native Speech Recognition */}
            <TouchableOpacity
              style={[
                styles.voiceButton,
                styles.nativeSpeechButton,
                isListening && styles.voiceButtonActive,
              ]}
              onPress={handleVoiceRecognition}
              disabled={isProcessing}
            >
              <Mic size={24} color={isListening ? Colors.semantic.danger : Colors.primary.text} />
              <View style={styles.voiceButtonTextContainer}>
                <Text style={styles.voiceButtonText}>
                  {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to Speak'}
                </Text>
                {transcript && (
                  <Text style={styles.transcriptText}>{transcript}</Text>
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.dividerText}>Or test with pre-defined commands:</Text>

            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => testVoiceCommand('play', 'en')}
            >
              <Mic size={20} color={Colors.primary.text} />
              <Text style={styles.voiceButtonText}>Test: &quot;Play&quot;</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => testVoiceCommand('fast forward 10 seconds', 'en')}
            >
              <Mic size={20} color={Colors.primary.text} />
              <Text style={styles.voiceButtonText}>Test: &quot;Fast forward 10 seconds&quot;</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => testVoiceCommand('播放', 'zh-TW')}
            >
              <Mic size={20} color={Colors.primary.text} />
              <Text style={styles.voiceButtonText}>Test: &quot;播放&quot; (Chinese)</Text>
            </TouchableOpacity>
          </View>

          {/* Sample URLs */}
          <View style={styles.samplesSection}>
            <Text style={styles.sectionTitle}>Sample URLs</Text>
            {[
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              'https://vimeo.com/76979871',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            ].map((sampleUrl, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sampleButton}
                onPress={() => {
                  setUrl(sampleUrl);
                  setCurrentUrl(sampleUrl);
                }}
              >
                <Text style={styles.sampleText} numberOfLines={1}>
                  {sampleUrl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        visible={showAgeVerification}
        onClose={() => setShowAgeVerification(false)}
        onVerified={handleAgeVerified}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.primary.text,
    borderWidth: 1,
    borderColor: Colors.card.border,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary.accent,
  },
  secondaryButton: {
    width: 56,
    backgroundColor: Colors.primary.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.primary.accent,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.text,
  },
  infoSection: {
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.text,
    marginBottom: 16,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.text,
    marginTop: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    lineHeight: 18,
  },
  playerSection: {
    marginBottom: 24,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.text,
    marginBottom: 12,
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  placeholderContainer: {
    aspectRatio: 16 / 9,
    borderRadius: 16,
    backgroundColor: Colors.primary.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: Colors.primary.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  voiceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.text,
    marginBottom: 12,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  voiceButtonText: {
    fontSize: 14,
    color: Colors.primary.text,
  },
  nativeSpeechButton: {
    paddingVertical: 20,
    backgroundColor: Colors.primary.bgTertiary,
    borderWidth: 2,
    borderColor: Colors.primary.accent,
  },
  voiceButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: Colors.semantic.danger,
  },
  voiceButtonTextContainer: {
    flex: 1,
    gap: 4,
  },
  transcriptText: {
    fontSize: 12,
    color: Colors.primary.accent,
    fontStyle: 'italic',
  },
  dividerText: {
    fontSize: 12,
    color: Colors.primary.textTertiary,
    textAlign: 'center',
    marginVertical: 12,
  },
  samplesSection: {
    marginBottom: 24,
  },
  sampleButton: {
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  sampleText: {
    fontSize: 12,
    color: Colors.primary.accent,
  },
});
