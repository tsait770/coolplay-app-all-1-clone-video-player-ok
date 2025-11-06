import { Platform } from 'react-native';

const STT_API_URL = 'https://toolkit.rork.com/stt/transcribe/';

export interface SpeechRecognitionResult {
  text: string;
  language: string;
}

export interface SpeechRecognitionError {
  type: 'network' | 'permission' | 'not-supported' | 'unknown';
  message: string;
}

export async function transcribeAudio(
  audioUri: string,
  language?: string
): Promise<SpeechRecognitionResult> {
  try {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const response = await fetch(audioUri);
      const blob = await response.blob();
      formData.append('audio', blob, 'recording.webm');
    } else {
      const uriParts = audioUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const audioFile = {
        uri: audioUri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any;
      
      formData.append('audio', audioFile);
    }

    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(STT_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Speech recognition error:', error);
    
    if (error instanceof TypeError && error.message.includes('network')) {
      throw {
        type: 'network',
        message: 'Network connection failed. Please check your internet connection and try again.',
      } as SpeechRecognitionError;
    }
    
    throw {
      type: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    } as SpeechRecognitionError;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (Platform.OS === 'web') {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
  return true;
}
