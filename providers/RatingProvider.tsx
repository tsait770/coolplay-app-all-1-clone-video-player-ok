import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { useStorage, safeJsonParse } from '@/providers/StorageProvider';
import { useMembership } from '@/providers/MembershipProvider';

interface RatingState {
  hasRated: boolean;
  ratingPromptShown: boolean;
  usageCountSinceUpgrade: number;
  lastPromptDate: string | null;
}

const RATING_TRIGGER_COUNT = 3;
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';

export const [RatingProvider, useRating] = createContextHook(() => {
  const { getItem, setItem } = useStorage();
  const { tier, usageCount } = useMembership();
  const [state, setState] = useState<RatingState>({
    hasRated: false,
    ratingPromptShown: false,
    usageCountSinceUpgrade: 0,
    lastPromptDate: null,
  });

  const saveRatingState = useCallback(async (data: RatingState) => {
    try {
      await setItem('ratingState', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save rating state:', error);
    }
  }, [setItem]);

  const loadRatingState = useCallback(async () => {
    try {
      const data = await getItem('ratingState');
      if (data && typeof data === 'string' && data.length > 0) {
        const parsed = safeJsonParse(data, null);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setState(parsed as RatingState);
        } else {
          console.warn('[RatingProvider] Invalid rating state format, clearing');
          await setItem('ratingState', JSON.stringify({
            hasRated: false,
            ratingPromptShown: false,
            usageCountSinceUpgrade: 0,
            lastPromptDate: null,
          }));
        }
      }
    } catch (error) {
      console.error('[RatingProvider] Failed to load rating state:', error);
    }
  }, [getItem, setItem]);

  useEffect(() => {
    loadRatingState();
  }, [loadRatingState]);

  const shouldShowRatingPrompt = useCallback((): boolean => {
    if (state.hasRated || state.ratingPromptShown) {
      return false;
    }

    if (tier === 'free' || tier === 'free_trial') {
      return false;
    }

    if (state.usageCountSinceUpgrade >= RATING_TRIGGER_COUNT) {
      return true;
    }

    return false;
  }, [state, tier]);

  const incrementUsageCount = useCallback(async () => {
    if (tier === 'free' || tier === 'free_trial') {
      return;
    }

    const newState = {
      ...state,
      usageCountSinceUpgrade: state.usageCountSinceUpgrade + 1,
    };

    setState(newState);
    await saveRatingState(newState);

    if (shouldShowRatingPrompt()) {
      showRatingPrompt();
    }
  }, [state, tier, saveRatingState, shouldShowRatingPrompt]);

  const showRatingPrompt = useCallback(() => {
    Alert.alert(
      'Enjoying the App?',
      'Would you like to rate us? Your feedback helps us improve!',
      [
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: async () => {
            const newState = {
              ...state,
              ratingPromptShown: true,
              lastPromptDate: new Date().toISOString(),
            };
            setState(newState);
            await saveRatingState(newState);
          },
        },
        {
          text: 'Send Feedback',
          onPress: () => {
            collectFeedback();
          },
        },
        {
          text: 'Rate 5 Stars',
          onPress: () => {
            openStoreRating();
          },
        },
      ]
    );
  }, [state, saveRatingState]);

  const openStoreRating = useCallback(async () => {
    const newState = {
      ...state,
      hasRated: true,
      ratingPromptShown: true,
      lastPromptDate: new Date().toISOString(),
    };
    setState(newState);
    await saveRatingState(newState);

    const storeUrl = Platform.select({
      ios: APP_STORE_URL,
      android: PLAY_STORE_URL,
      default: APP_STORE_URL,
    });

    try {
      const supported = await Linking.canOpenURL(storeUrl);
      if (supported) {
        await Linking.openURL(storeUrl);
      } else {
        Alert.alert('Error', 'Unable to open app store');
      }
    } catch (error) {
      console.error('Failed to open store:', error);
      Alert.alert('Error', 'Unable to open app store');
    }
  }, [state, saveRatingState]);

  const collectFeedback = useCallback(() => {
    Alert.prompt(
      'Send Feedback',
      'Please share your thoughts with us:',
      async (text) => {
        if (text && text.trim()) {
          console.log('User feedback:', text);
          
          const newState = {
            ...state,
            ratingPromptShown: true,
            lastPromptDate: new Date().toISOString(),
          };
          setState(newState);
          await saveRatingState(newState);

          Alert.alert('Thank You!', 'Your feedback has been received.');
        }
      },
      'plain-text'
    );
  }, [state, saveRatingState]);

  const resetRatingState = useCallback(async () => {
    const initialState: RatingState = {
      hasRated: false,
      ratingPromptShown: false,
      usageCountSinceUpgrade: 0,
      lastPromptDate: null,
    };
    setState(initialState);
    await saveRatingState(initialState);
  }, [saveRatingState]);

  return useMemo(() => ({
    ...state,
    shouldShowRatingPrompt,
    incrementUsageCount,
    showRatingPrompt,
    openStoreRating,
    collectFeedback,
    resetRatingState,
  }), [
    state,
    shouldShowRatingPrompt,
    incrementUsageCount,
    showRatingPrompt,
    openStoreRating,
    collectFeedback,
    resetRatingState,
  ]);
});
