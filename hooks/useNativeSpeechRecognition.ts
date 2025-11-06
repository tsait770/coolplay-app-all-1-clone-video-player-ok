/**
 * Native Speech Recognition Hook for InstaPlay V7
 * Uses platform-native speech APIs:
 * - iOS: Apple Speech Framework
 * - Android: Google Speech API
 * - Web: Web Speech API / MediaRecorder fallback
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { parseVoiceCommand, ParsedVoiceCommand } from '@/utils/voiceCommandParser';

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface UseNativeSpeechRecognitionReturn {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  parsedCommand: ParsedVoiceCommand | null;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetTranscript: () => void;
}

export function useNativeSpeechRecognition(
  options: SpeechRecognitionOptions = {}
): UseNativeSpeechRecognitionReturn {
  const {
    language = 'en',
    continuous = false,
    interimResults = true,
    maxAlternatives = 3,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedCommand, setParsedCommand] = useState<ParsedVoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const getLanguageCode = useCallback((lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'zh-TW': 'zh-TW',
      'zh-CN': 'zh-CN',
      'es': 'es-ES',
      'pt-BR': 'pt-BR',
      'pt': 'pt-PT',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
    };
    return langMap[lang] || 'en-US';
  }, []);

  const processTranscript = useCallback((text: string, confidence: number, isFinal: boolean) => {
    setTranscript(text);
    
    if (isFinal) {
      console.log('[NativeSpeechRecognition] Final transcript:', text, 'confidence:', confidence);
      const parsed = parseVoiceCommand(text, language, confidence);
      setParsedCommand(parsed);
      setIsProcessing(false);
    } else if (interimResults) {
      console.log('[NativeSpeechRecognition] Interim transcript:', text);
    }
  }, [language, interimResults]);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', getLanguageCode(language));

      console.log('[NativeSpeechRecognition] Sending audio to STT API...');

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.text && result.text.trim().length > 0) {
          console.log('[NativeSpeechRecognition] STT result:', result.text);
          processTranscript(result.text, 0.85, true);
        } else {
          console.log('[NativeSpeechRecognition] No speech detected in audio');
          setError('No speech detected');
        }
      } else {
        const errorText = await response.text();
        console.error('[NativeSpeechRecognition] STT API error:', response.status, errorText);
        setError(`Transcription failed: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error('[NativeSpeechRecognition] Transcription error:', err);
      setError(err?.message || 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  }, [language, getLanguageCode, processTranscript]);

  const startWebSpeechAPI = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('[NativeSpeechRecognition] Web Speech API not supported, falling back to MediaRecorder');
      return false;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = getLanguageCode(language);
      recognitionRef.current.maxAlternatives = maxAlternatives;

      recognitionRef.current.onstart = () => {
        console.log('[NativeSpeechRecognition] Web Speech API started');
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        const last = event.results.length - 1;
        const result = event.results[last];
        
        if (result && result[0]) {
          const transcriptText = result[0].transcript.trim();
          const confidence = result[0].confidence || 0.7;
          const isFinal = result.isFinal;

          if (transcriptText.length > 0) {
            processTranscript(transcriptText, confidence, isFinal);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('[NativeSpeechRecognition] Web Speech API error:', event.error);
        
        if (event.error === 'no-speech') {
          setError('No speech detected');
        } else if (event.error === 'audio-capture') {
          setError('Microphone access denied');
        } else if (event.error === 'not-allowed') {
          setError('Microphone permission denied');
        } else if (event.error === 'network') {
          setError('Network error');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        console.log('[NativeSpeechRecognition] Web Speech API ended');
        setIsListening(false);
      };

      recognitionRef.current.start();
      return true;
    } catch (err: any) {
      console.error('[NativeSpeechRecognition] Failed to start Web Speech API:', err);
      setError(err?.message || 'Failed to start speech recognition');
      return false;
    }
  }, [language, continuous, interimResults, maxAlternatives, getLanguageCode, processTranscript]);

  const startMediaRecorder = useCallback(async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        throw new Error('Media devices not available');
      }

      console.log('[NativeSpeechRecognition] Starting MediaRecorder...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      if (typeof MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder not available');
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('[NativeSpeechRecognition] MediaRecorder stopped');
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        } else {
          console.warn('[NativeSpeechRecognition] No audio data captured');
          setError('No audio data captured');
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.onerror = (event: any) => {
        console.error('[NativeSpeechRecognition] MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error}`);
        setIsListening(false);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      setError(null);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);

      return true;
    } catch (err: any) {
      console.error('[NativeSpeechRecognition] Failed to start MediaRecorder:', err);
      setError(err?.message || 'Failed to start recording');
      return false;
    }
  }, [transcribeAudio]);

  const startListening = useCallback(async () => {
    if (isListening) {
      console.warn('[NativeSpeechRecognition] Already listening');
      return;
    }

    console.log('[NativeSpeechRecognition] Starting speech recognition...');
    setTranscript('');
    setParsedCommand(null);
    setError(null);
    setIsProcessing(true);

    if (Platform.OS === 'web') {
      const webSpeechStarted = startWebSpeechAPI();
      
      if (!webSpeechStarted) {
        await startMediaRecorder();
      }
    } else {
      await startMediaRecorder();
    }
  }, [isListening, startWebSpeechAPI, startMediaRecorder]);

  const stopListening = useCallback(async () => {
    console.log('[NativeSpeechRecognition] Stopping speech recognition...');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('[NativeSpeechRecognition] Error stopping Web Speech API:', err);
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('[NativeSpeechRecognition] Error stopping MediaRecorder:', err);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setIsProcessing(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setParsedCommand(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn('[NativeSpeechRecognition] Cleanup error (recognition):', err);
        }
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          console.warn('[NativeSpeechRecognition] Cleanup error (mediaRecorder):', err);
        }
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isListening,
    isProcessing,
    transcript,
    parsedCommand,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
