# 🚀 Quick Start Implementation Guide

## ✅ What's Been Completed

### 1. Critical Bug Fixes
- ✅ Fixed `useLanguage` context error in TabLayout
- ✅ Verified `EXPO_PUBLIC_RORK_API_BASE_URL` is configured

### 2. Database Infrastructure
- ✅ Complete database schema with membership tiers
- ✅ Device binding tables (verifications + bound devices)
- ✅ Usage tracking and logging
- ✅ Automated quota management functions

### 3. Backend API (tRPC)
- ✅ Device verification generation
- ✅ Device binding verification
- ✅ Device listing and removal
- ✅ Stripe checkout session creation
- ✅ Stripe webhook handling

### 4. Frontend Components
- ✅ QR Code display component
- ✅ QR Code scanner component
- ✅ Device binding modal (existing, verified)
- ✅ Usage statistics dashboard
- ✅ Membership provider with quota management

### 5. Video Source Detection
- ✅ Comprehensive platform support
- ✅ Adult content detection
- ✅ DRM platform blocking
- ✅ Membership-based access control

---

## 📋 Next Steps (In Order)

### Step 1: Run Database Migration (5 minutes)

1. Open Supabase Dashboard: https://app.supabase.com
2. Navigate to your project: `tdamcrigenexyhbsopay`
3. Go to SQL Editor
4. Copy and paste the entire contents of `/database-schema.sql`
5. Click "Run" to execute
6. Verify tables are created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

**Expected tables:**
- profiles (updated with new fields)
- bookmarks
- folders
- device_verifications
- bound_devices
- usage_logs

### Step 2: Create Stripe Products (10 minutes)

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to Products → Add Product

**Create these products:**

#### Basic Monthly
- Name: "Basic Membership - Monthly"
- Price: $19.90 USD
- Billing: Recurring monthly
- Copy the Price ID (starts with `price_`)

#### Basic Yearly
- Name: "Basic Membership - Yearly"
- Price: $199.00 USD
- Billing: Recurring yearly
- Copy the Price ID

#### Premium Monthly
- Name: "Premium Membership - Monthly"
- Price: $39.90 USD
- Billing: Recurring monthly
- Copy the Price ID

#### Premium Yearly
- Name: "Premium Membership - Yearly"
- Price: $399.00 USD
- Billing: Recurring yearly
- Copy the Price ID

3. Update `.env` file with the Price IDs:
```bash
EXPO_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_xxxxx
EXPO_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_xxxxx
```

### Step 3: Configure Stripe Webhook (5 minutes)

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/trpc/stripe.webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the Webhook Signing Secret
6. Add to `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 4: Test Device Binding (10 minutes)

1. Start the app: `bun expo start`
2. Open on your device or simulator
3. Navigate to Settings
4. Test device binding flow:
   - Generate verification code
   - Display QR code
   - Scan with another device (or enter code manually)
   - Verify device is bound
   - Check device list

**Test checklist:**
- [ ] QR code displays correctly
- [ ] Verification code is 6 characters
- [ ] Scanner opens camera (on mobile)
- [ ] Manual entry works
- [ ] Device appears in bound devices list
- [ ] Free users limited to 1 device
- [ ] Paid users can bind 3 devices

### Step 5: Test Membership Quotas (15 minutes)

1. Create a new user account
2. Verify free trial status:
   - [ ] Shows 2000 uses remaining
   - [ ] Can access adult content
   - [ ] Limited to 1 device

3. Use the app 2000 times (or manually update database):
```sql
UPDATE profiles 
SET trial_usage_remaining = 0, 
    membership_tier = 'free',
    trial_used = true
WHERE id = 'user-id';
```

4. Verify free tier:
   - [ ] Shows 30 daily uses
   - [ ] Cannot access adult content
   - [ ] Still limited to 1 device

5. Upgrade to Basic (via Stripe test mode):
   - [ ] Shows 1500 monthly + 40 daily
   - [ ] Can access adult content
   - [ ] Can bind 3 devices

6. Upgrade to Premium:
   - [ ] Shows unlimited
   - [ ] Can access adult content
   - [ ] Can bind 5 devices

### Step 6: Test Video Source Detection (10 minutes)

Test with these URLs:

**Mainstream (should work for all tiers):**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://vimeo.com/76979871
```

**Adult (should only work for trial/paid):**
```
https://www.pornhub.com/view_video.php?viewkey=test
```

**Unsupported (should show error):**
```
https://www.netflix.com/watch/12345
```

**Test checklist:**
- [ ] YouTube videos detected correctly
- [ ] Vimeo videos detected correctly
- [ ] Adult content blocked for free users
- [ ] Adult content accessible for paid users
- [ ] DRM platforms show error message
- [ ] Usage quota decrements after playback

### Step 7: Test Stripe Integration (15 minutes)

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Test subscription flow:
   - [ ] Checkout session creates successfully
   - [ ] Redirects to Stripe checkout
   - [ ] Payment processes
   - [ ] Webhook updates membership tier
   - [ ] User sees updated quota
   - [ ] Can access premium features

3. Test subscription management:
   - [ ] Can view subscription status
   - [ ] Can cancel subscription
   - [ ] Membership downgrades on cancellation
   - [ ] Quota updates correctly

---

## 🎨 UI Components to Integrate

### Usage Stats Dashboard

Add to Settings screen:

```typescript
import UsageStatsDashboard from '@/components/UsageStatsDashboard';

// In your settings screen:
<UsageStatsDashboard />
```

### Device Binding

Add to Settings screen:

```typescript
import { DeviceBindingModal } from '@/components/DeviceBindingModal';

const [showDeviceModal, setShowDeviceModal] = useState(false);

<TouchableOpacity onPress={() => setShowDeviceModal(true)}>
  <Text>Manage Devices</Text>
</TouchableOpacity>

<DeviceBindingModal
  visible={showDeviceModal}
  onClose={() => setShowDeviceModal(false)}
  onSuccess={() => {
    // Refresh device list
  }}
/>
```

### QR Code Scanner

For scanning on a second device:

```typescript
import QRCodeScanner from '@/components/QRCodeScanner';

<QRCodeScanner
  onScan={(data) => {
    // Parse QR data and verify device
    const { userId, deviceId, code } = JSON.parse(data);
    // Call verify API
  }}
  onClose={() => setShowScanner(false)}
  onManualEntry={(code) => {
    // Verify with manual code
  }}
/>
```

---

## 🔧 Configuration Checklist

### Environment Variables
- [x] `EXPO_PUBLIC_SUPABASE_URL`
- [x] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [x] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [x] `STRIPE_SECRET_KEY`
- [ ] `EXPO_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID`
- [ ] `EXPO_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID`
- [ ] `EXPO_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID`
- [ ] `EXPO_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID`
- [ ] `STRIPE_WEBHOOK_SECRET`

### Database
- [ ] Run migration script
- [ ] Verify tables created
- [ ] Test database functions
- [ ] Set up daily quota reset cron job

### Stripe
- [ ] Create products
- [ ] Update price IDs
- [ ] Configure webhook
- [ ] Test with test cards

### App
- [ ] Test device binding
- [ ] Test quota management
- [ ] Test video source detection
- [ ] Test subscription flow

---

## 📱 Testing Scenarios

### Scenario 1: New User Journey
1. User signs up → Gets free trial (2000 uses)
2. User plays 2000 videos → Becomes free tier
3. User tries adult content → Blocked
4. User upgrades to Basic → Can access adult content
5. User reaches monthly quota → Prompted to upgrade
6. User upgrades to Premium → Unlimited access

### Scenario 2: Device Management
1. User binds device 1 → Success
2. User tries to bind device 2 (free tier) → Error
3. User upgrades to Basic → Can bind 3 devices
4. User binds devices 2 and 3 → Success
5. User tries to bind device 4 → Error
6. User removes device 1 → Success
7. User binds device 4 → Success

### Scenario 3: Video Playback
1. User plays YouTube video → Success, quota -1
2. User plays Vimeo video → Success, quota -1
3. User plays adult video (free tier) → Blocked
4. User plays adult video (paid tier) → Success, quota -1
5. User tries Netflix → Error message
6. User reaches quota limit → Upgrade prompt

---

## 🐛 Common Issues & Solutions

### Issue: QR Code not displaying
**Solution**: Check that `react-native-qrcode-svg` is installed:
```bash
bun expo install react-native-qrcode-svg
```

### Issue: Camera not working
**Solution**: Request camera permissions:
```typescript
import { useCameraPermissions } from 'expo-camera';
const [permission, requestPermission] = useCameraPermissions();
```

### Issue: Stripe webhook not firing
**Solution**: 
1. Check webhook URL is correct
2. Verify webhook secret in `.env`
3. Check Stripe Dashboard → Webhooks → Logs

### Issue: Quota not resetting
**Solution**: Set up cron job to call `reset_daily_quota()`:
```sql
SELECT cron.schedule(
  'reset-daily-quota',
  '0 0 * * *',
  $$SELECT reset_daily_quota()$$
);
```

### Issue: Device binding fails
**Solution**: 
1. Check device ID is unique
2. Verify user hasn't reached device limit
3. Check verification code hasn't expired

---

## 📚 Key Files Reference

### Components
- `/components/QRCodeDisplay.tsx` - Display QR code for device binding
- `/components/QRCodeScanner.tsx` - Scan QR code or enter manual code
- `/components/DeviceBindingModal.tsx` - Complete device binding flow
- `/components/UsageStatsDashboard.tsx` - Display usage statistics

### Backend
- `/backend/trpc/routes/device/*` - Device binding API
- `/backend/trpc/routes/stripe/*` - Stripe payment API
- `/backend/trpc/app-router.ts` - Main API router

### Database
- `/database-schema.sql` - Complete database schema
- `/lib/supabase.ts` - Supabase client and types

### Providers
- `/providers/MembershipProvider.tsx` - Membership state management
- `/providers/StripeProvider.tsx` - Stripe integration

### Utils
- `/utils/videoSourceDetector.ts` - Video source detection

---

## 🎯 Success Criteria

Your implementation is complete when:

- [ ] All database tables are created
- [ ] Stripe products are configured
- [ ] Device binding works end-to-end
- [ ] Quota management enforces limits
- [ ] Video source detection works correctly
- [ ] Subscription flow completes successfully
- [ ] Webhooks update membership tiers
- [ ] Usage stats display correctly
- [ ] Adult content is properly restricted
- [ ] All test scenarios pass

---

## 🚀 Deployment Checklist

Before going to production:

- [ ] Update Stripe to live mode
- [ ] Update webhook URL to production domain
- [ ] Set up database backups
- [ ] Configure daily quota reset cron job
- [ ] Test on real devices (iOS + Android)
- [ ] Implement age verification for adult content
- [ ] Add analytics tracking
- [ ] Set up error monitoring (Sentry)
- [ ] Create user documentation
- [ ] Prepare customer support materials

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Expo Docs**: https://docs.expo.dev
- **tRPC Docs**: https://trpc.io/docs

---

**Last Updated**: 2025-10-02  
**Status**: Core implementation complete, ready for testing
