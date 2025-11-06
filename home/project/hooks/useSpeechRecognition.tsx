import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import {
  transcribeAudio,
  isSpeechRecognitionSupported,
  SpeechRecognitionError,
} from '../utils/speechRecognition';

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!isSpeechRecognitionSupported()) {
        setError('Speech recognition is not supported on this device');
        return;
      }

      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } else {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });

        await recording.startAsync();
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      if (Platform.OS === 'web') {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          
          await new Promise<void>((resolve) => {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.onstop = () => resolve();
            }
          });

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const result = await transcribeAudio(audioUrl);
          setTranscript(result.text);
          
          URL.revokeObjectURL(audioUrl);
          
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
        }
      } else {
        if (recordingRef.current) {
          await recordingRef.current.stopAndUnloadAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
          });

          const uri = recordingRef.current.getURI();
          if (uri) {
            const result = await transcribeAudio(uri);
            setTranscript(result.text);
          }
          
          recordingRef.current = null;
        }
      }
      
      setIsRecording(false);
      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      
      const speechError = err as SpeechRecognitionError;
      if (speechError.type === 'network') {
        setError('Network error: Please check your internet connection and try again.');
      } else {
        setError('Failed to process audio. Please try again.');
      }
      
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    isProcessing,
    error,
    transcript,
    startRecording,
    stopRecording,
    clearError,
    clearTranscript,
    isSupported: isSpeechRecognitionSupported(),
  };
}
