# Quick Reference Guide

## 🚀 Quick Start

### 1. Setup Stripe (5 minutes)
```bash
# 1. Go to https://dashboard.stripe.com
# 2. Create 4 products:
#    - Basic Monthly: $19.90/month
#    - Basic Yearly: $199/year
#    - Plus Monthly: $39.90/month
#    - Plus Yearly: $399/year
# 3. Copy Price IDs to .env
# 4. Configure webhook endpoint
```

### 2. Update Environment Variables
```env
EXPO_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_xxxxx
```

### 3. Update App Store URLs
```typescript
// providers/RatingProvider.tsx
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';
```

### 4. Test
```bash
npm start
# Navigate to /subscription
# Test with card: 4242 4242 4242 4242
```

## 📋 Membership Tiers

| Tier | Price | Uses | Features |
|------|-------|------|----------|
| **Free Trial** | Free | 2000 + 30/day | All features |
| **Free** | Free | 30/day | Basic sources only |
| **Basic** | $19.9/mo or $199/yr | 1500/mo + 40/day | All sources + Custom commands |
| **Plus** | $39.9/mo or $399/yr | Unlimited | All features + Priority support |

## 🎯 Key Features

### Video Source Detection
```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';

const sourceInfo = detectVideoSource(url);
const { canPlay, reason } = canPlayVideo(url, userTier);
```

### Membership Management
```typescript
import { useMembership } from '@/providers/MembershipProvider';

const { tier, canUseFeature, useFeature, getRemainingUsage } = useMembership();
```

### Rating System
```typescript
import { useRating } from '@/providers/RatingProvider';

const { incrementUsageCount, showRatingPrompt } = useRating();

// After video playback
await incrementUsageCount();
```

### Stripe Integration
```typescript
import { useStripe } from '@/providers/StripeProvider';

const { plans, createCheckoutSession, cancelSubscription } = useStripe();

// Subscribe to plan
await createCheckoutSession('basic_monthly');
```

## 🧪 Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0025 0000 3155 | 3D Secure |

## 📱 Supported Video Sources

### Free Sources (All Tiers)
- YouTube, Vimeo, Twitch, Facebook
- Google Drive, Dropbox
- MP4, WebM, OGG, M3U8, RTMP, DASH

### Premium Sources (Paid Only)
- Pornhub, Xvideos, Xnxx, Redtube
- Tktube, YouPorn, Spankbang
- Brazzers, Naughty America, Bangbros, Reality Kings

### Blocked Sources (All Tiers)
- Netflix, Disney+, HBO Max, Prime Video, iQIYI

## 🔧 Common Tasks

### Check User Membership
```typescript
const { tier, getRemainingUsage } = useMembership();
const remaining = getRemainingUsage();

if (tier === 'free' && remaining === 0) {
  // Show upgrade prompt
}
```

### Validate Video Access
```typescript
const { canPlay, reason } = canPlayVideo(videoUrl, tier);

if (!canPlay) {
  Alert.alert('Cannot Play Video', reason);
}
```

### Track Usage
```typescript
const { useFeature, canUseFeature } = useMembership();

if (canUseFeature()) {
  await useFeature();
  // Play video
} else {
  // Show upgrade prompt
}
```

### Show Rating Prompt
```typescript
const { incrementUsageCount } = useRating();

// After successful video playback
await incrementUsageCount();
// Prompt shows automatically after 3rd use
```

## 🐛 Troubleshooting

### Stripe Checkout Not Opening
```typescript
// Check environment variables
console.log(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
console.log(process.env.STRIPE_SECRET_KEY);
```

### Webhook Not Working
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/trpc/stripe.webhook

# Check webhook logs in Stripe Dashboard
```

### Video Not Playing
```typescript
// Check source detection
const sourceInfo = detectVideoSource(url);
console.log('Source:', sourceInfo);

// Check membership tier
const { tier } = useMembership();
console.log('Tier:', tier);

// Check if can play
const { canPlay, reason } = canPlayVideo(url, tier);
console.log('Can play:', canPlay, 'Reason:', reason);
```

### Rating Prompt Not Showing
```typescript
// Check usage count
const { usageCountSinceUpgrade } = useRating();
console.log('Usage count:', usageCountSinceUpgrade);

// Check if already rated
const { hasRated, ratingPromptShown } = useRating();
console.log('Has rated:', hasRated, 'Prompt shown:', ratingPromptShown);
```

## 📊 Monitoring

### Stripe Dashboard
- Monitor payments: https://dashboard.stripe.com/payments
- Check webhooks: https://dashboard.stripe.com/webhooks
- View customers: https://dashboard.stripe.com/customers

### Key Metrics
- Conversion rate: Free → Paid
- Churn rate: Cancellations per month
- ARPU: Average revenue per user
- Usage patterns: Daily/Monthly active users

## 🔐 Security

### Environment Variables
```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use different keys for dev/prod
# Test: pk_test_... / sk_test_...
# Live: pk_live_... / sk_live_...
```

### Webhook Security
```typescript
// Always verify webhook signatures
const signature = request.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  request.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

## 📚 Documentation

- **Full System**: `MEMBERSHIP_SYSTEM.md`
- **Stripe Setup**: `STRIPE_SETUP_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Video Sources**: `VIDEO_SOURCE_SUPPORT.md`

## 🆘 Support

### Stripe Issues
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

### App Issues
- Check console logs
- Review error messages
- Test in isolation
- Check provider state

## ✅ Pre-Launch Checklist

- [ ] Stripe products created
- [ ] Environment variables set
- [ ] App Store URLs updated
- [ ] Translations added
- [ ] Payment flow tested
- [ ] Webhook tested
- [ ] Video sources tested
- [ ] Rating system tested
- [ ] Device management tested
- [ ] Error handling verified

## 🚀 Launch

```bash
# 1. Switch Stripe to Live Mode
# 2. Update .env with live keys
# 3. Deploy to production
# 4. Monitor Stripe Dashboard
# 5. Check error logs
# 6. Test with real payment
```

## 🎉 Success!

Your membership system is ready to launch! Follow this guide for quick reference and troubleshooting.

For detailed information, refer to the full documentation files.
