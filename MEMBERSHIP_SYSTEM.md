# Membership System Documentation

## Overview
This document describes the complete membership system implementation for CoolPlay, including pricing tiers, video source support, Stripe integration, and 5-star rating system.

## Membership Tiers

### Free Trial (First-time users)
- **Initial Bonus**: 2000 uses
- **Daily Bonus**: +30 uses per day
- **Features**:
  - All video sources supported (including adult content)
  - Basic voice commands
  - No custom voice commands
- **Limitations**: After 2000 uses consumed, automatically downgraded to Free tier

### Free Member
- **Daily Limit**: 30 uses per day
- **Features**:
  - Basic video sources (YouTube, Vimeo, MP4, WebM, etc.)
  - Basic voice commands
  - No custom voice commands
- **Limitations**: 
  - No adult content support
  - No DRM content support
  - Daily limit resets at midnight

### Basic Member ($19.9/month or $199/year)
- **Initial Bonus**: 2000 uses on first subscription
- **Monthly Quota**: 1500 uses per month
- **Daily Bonus**: +40 uses per day
- **Features**:
  - All video sources supported (including adult content)
  - Custom voice commands
  - Unused quota rolls over to next month
  - All video formats supported
- **Badge**: "MOST POPULAR"
- **Annual Savings**: 25% ($49.75 saved per year)

### Plus Member ($39.9/month or $399/year)
- **Initial Bonus**: 2000 uses on first subscription
- **Monthly Quota**: Unlimited
- **Features**:
  - All video sources supported (including adult content)
  - Custom voice commands
  - Priority support
  - Early access to new features
  - All video formats supported
- **Badge**: "BEST VALUE"
- **Annual Savings**: 25% ($99.75 saved per year)

## Supported Video Sources

### Free Sources (All Tiers)
- **Streaming Platforms**:
  - YouTube (https://www.youtube.com/watch?v=xxxx)
  - Vimeo (https://vimeo.com/xxxx)
  - Twitch (https://www.twitch.tv/xxxx)
  - Facebook (https://www.facebook.com/watch/?v=xxxx)
  
- **Cloud Storage**:
  - Google Drive (public share links)
  - Dropbox (public share links)
  
- **Direct Video Files**:
  - MP4, WebM, OGG, OGV
  - M3U8 (HLS streams)
  - RTMP streams
  - DASH streams (.mpd)

### Premium Sources (Paid Tiers Only)
- **Adult Platforms**:
  - Pornhub
  - Xvideos
  - Xnxx
  - Redtube
  - Tktube
  - YouPorn
  - Spankbang
  - Brazzers
  - Naughty America
  - Bangbros
  - Reality Kings

### Unsupported Sources (All Tiers)
- Netflix (DRM protected)
- Disney+ (DRM protected)
- iQIYI (DRM protected)
- HBO Max (DRM protected)
- Amazon Prime Video (DRM protected)

## Device Management

### Device Limits
- **Free Trial/Free**: 1 device
- **Basic**: 3 devices
- **Plus**: 5 devices

### Device Binding
- QR Code verification system
- Device ID tracking
- Last login timestamp
- Device name (optional)

## Stripe Integration

### Environment Variables
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
EXPO_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_basic_monthly
EXPO_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=price_basic_yearly
EXPO_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_plus_monthly
EXPO_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_plus_yearly
```

### Creating Stripe Products

1. **Login to Stripe Dashboard**: https://dashboard.stripe.com/

2. **Create Products**:
   - Go to Products → Add Product
   - Create 4 products:
     - Basic Monthly ($19.90)
     - Basic Yearly ($199.00)
     - Plus Monthly ($39.90)
     - Plus Yearly ($399.00)

3. **Copy Price IDs**:
   - After creating each product, copy the Price ID (starts with `price_`)
   - Update your `.env` file with these IDs

4. **Configure Webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/trpc/stripe.webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### Subscription Flow

1. **User selects plan** → `app/subscription/index.tsx`
2. **Create checkout session** → `providers/StripeProvider.tsx`
3. **Redirect to Stripe** → Stripe Checkout page
4. **Payment success** → Webhook updates user profile
5. **User redirected back** → Success page with updated membership

## 5-Star Rating System

### Implementation
- **Provider**: `providers/RatingProvider.tsx`
- **Trigger**: After 3rd use for paid members
- **Platforms**: iOS App Store & Google Play Store

### Flow
1. User upgrades to paid membership
2. System tracks usage count since upgrade
3. After 3rd use, rating prompt appears
4. User options:
   - **Rate 5 Stars**: Opens App Store/Play Store
   - **Send Feedback**: Opens feedback form
   - **Not Now**: Dismisses (won't show again)

### Configuration
```typescript
const RATING_TRIGGER_COUNT = 3;
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';
```

### Usage
```typescript
import { useRating } from '@/providers/RatingProvider';

const { incrementUsageCount, showRatingPrompt } = useRating();

// After each video playback
await incrementUsageCount();
```

## Video Source Detection

### Implementation
- **Utility**: `utils/videoSourceDetector.ts`
- **Functions**:
  - `detectVideoSource(url)`: Detects video platform
  - `canPlayVideo(url, membershipTier)`: Checks if user can play video
  - `getSupportedPlatforms(membershipTier)`: Lists supported platforms

### Usage Example
```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';

const sourceInfo = detectVideoSource(videoUrl);
const { canPlay, reason } = canPlayVideo(videoUrl, userTier);

if (!canPlay) {
  Alert.alert('Cannot Play Video', reason);
}
```

## UI/UX Requirements

### Design Guidelines
- ✅ Use Font Awesome icons (via lucide-react-native)
- ❌ No emoji images
- ✅ Support multi-language switching
- ✅ Monthly/Yearly toggle with clear savings display
- ✅ Badge system: "MOST POPULAR" and "BEST VALUE"
- ✅ Clean, modern design inspired by iOS, Instagram, Airbnb

### Color Scheme
- **Basic Plan**: Primary accent color (`Colors.primary.accent`)
- **Plus Plan**: Green (`#10b981`)
- **Savings Badge**: Green (`#10b981`)

## Translation Support

### Adding Membership Translations

Add these keys to all language files in `l10n/`:

```json
{
  "membership_free_trial": "Free Trial",
  "membership_free": "Free Member",
  "membership_basic": "Basic Member",
  "membership_plus": "Plus Member",
  "upgrade_to_premium": "Upgrade to Premium",
  "most_popular": "MOST POPULAR",
  "best_value": "BEST VALUE",
  "save_percent": "Save {percent}%",
  "per_month": "per month",
  "per_year": "per year",
  "monthly": "Monthly",
  "yearly": "Yearly",
  "subscribe": "Subscribe",
  "current_plan": "Current Plan",
  "cancel_subscription": "Cancel Subscription",
  "uses_remaining": "{count} uses remaining",
  "unlimited_uses": "Unlimited uses",
  "daily_bonus": "+{count} daily bonus",
  "monthly_quota": "{count} uses per month",
  "custom_voice_commands": "Custom voice commands",
  "all_video_sources": "All video sources supported",
  "priority_support": "Priority support",
  "early_access": "Early access to new features"
}
```

## Testing Checklist

### Subscription Flow
- [ ] Monthly plan selection works
- [ ] Yearly plan selection works
- [ ] Stripe checkout opens correctly
- [ ] Payment success updates user profile
- [ ] Payment failure shows error message
- [ ] Subscription cancellation works
- [ ] Webhook processes events correctly

### Video Source Detection
- [ ] YouTube videos detected correctly
- [ ] Adult content blocked for free users
- [ ] Adult content allowed for paid users
- [ ] DRM content blocked for all users
- [ ] Direct video files play correctly

### Rating System
- [ ] Rating prompt shows after 3rd use
- [ ] Rating prompt only shows for paid users
- [ ] App Store link opens correctly (iOS)
- [ ] Play Store link opens correctly (Android)
- [ ] Feedback form works
- [ ] "Not Now" dismisses permanently

### Device Management
- [ ] Device limit enforced correctly
- [ ] QR code generation works
- [ ] Device binding works
- [ ] Device removal works
- [ ] Last login timestamp updates

## Troubleshooting

### Stripe Issues
- **Checkout not opening**: Check `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Webhook not working**: Verify webhook URL and secret
- **Payment not updating profile**: Check webhook event handling

### Video Playback Issues
- **Adult content not playing**: Verify user membership tier
- **DRM content error**: Expected behavior, show upgrade prompt
- **Direct video not loading**: Check video URL format

### Rating System Issues
- **Prompt not showing**: Check usage count and membership tier
- **Store link not opening**: Verify APP_STORE_URL and PLAY_STORE_URL
- **Prompt showing repeatedly**: Check hasRated flag in storage

## Next Steps

1. **Create Stripe Products**: Set up products in Stripe Dashboard
2. **Update Environment Variables**: Add Stripe Price IDs to `.env`
3. **Configure Webhooks**: Set up webhook endpoint in Stripe
4. **Test Payment Flow**: Complete end-to-end subscription test
5. **Add Translations**: Translate membership keys to all languages
6. **Update App Store URLs**: Replace placeholder URLs with actual ones
7. **Test on Real Devices**: Verify payment and rating flows on iOS/Android
