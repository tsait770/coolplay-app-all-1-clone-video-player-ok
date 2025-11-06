# Device Binding & Membership System Implementation

## Overview
Complete implementation of device binding with QR code verification and membership-based video source access control.

---

## Features Implemented

### 1. Device Binding System
- **QR Code Verification**: Generate verification codes for device binding
- **Device Limits**: 
  - Free users: 1 device
  - Basic members: 3 devices
  - Premium members: 5 devices
- **Device Management**: List, add, and remove devices

### 2. Video Source Detection
Enhanced video source detector with support for:

#### Supported Sources (All Tiers)
- YouTube
- Vimeo
- Twitch
- Facebook
- Google Drive / Dropbox
- Direct files: MP4, WebM, OGG, OGV
- Streaming: M3U8 (HLS), RTMP, DASH

#### Adult Content (Paid Members Only)
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
- Stripchat
- LiveJasmin
- BongaCams

#### Unsupported (DRM Protected)
- Netflix
- Disney+
- iQIYI
- HBO Max
- Prime Video

### 3. Membership Rules

#### Free Trial
- **Usage**: 2000 times (one-time)
- **Supported**: All sources including adult content
- **Device Limit**: 1 device

#### Free Tier
- **Usage**: 30 times per day
- **Supported**: Basic sources only (YouTube, Vimeo, direct files)
- **Not Supported**: Adult content
- **Device Limit**: 1 device

#### Basic Tier ($19.9/month or $199/year)
- **Usage**: 1500 times per month + 40 times per day bonus
- **Supported**: All sources including adult content
- **Device Limit**: 3 devices

#### Premium Tier ($39.9/month or $399/year)
- **Usage**: Unlimited
- **Supported**: All sources including adult content
- **Device Limit**: 5 devices

---

## Backend Implementation

### tRPC Routes Created

#### 1. Generate Verification
**Route**: `device.generateVerification`
- Generates 6-character verification code
- Creates QR code data
- 15-minute expiration
- Returns: `{ verificationCode, qrCodeData, expiresAt }`

#### 2. Verify Device
**Route**: `device.verifyDevice`
- Validates verification code
- Checks device limits based on membership tier
- Binds device to user account
- Returns: `{ success, deviceId }`

#### 3. List Devices
**Route**: `device.listDevices`
- Returns all devices bound to user
- Ordered by last login
- Returns: `{ devices: [] }`

#### 4. Remove Device
**Route**: `device.removeDevice`
- Removes device from user account
- Returns: `{ success, deviceId }`

### Context Enhancement
Updated `backend/trpc/create-context.ts`:
- Added Supabase authentication
- Created `protectedProcedure` middleware
- User context available in all protected routes

---

## Database Schema

### Tables Created

#### `device_verifications`
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- device_id: TEXT
- device_name: TEXT
- verification_code: TEXT
- expires_at: TIMESTAMPTZ
- verified: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- UNIQUE(user_id, device_id)
```

#### `user_devices`
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- device_id: TEXT
- device_name: TEXT
- last_login: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- UNIQUE(user_id, device_id)
```

### RLS Policies
- Users can only view/modify their own devices
- Users can only view/modify their own verifications

### Indexes
- `idx_device_verifications_user_id`
- `idx_device_verifications_device_id`
- `idx_device_verifications_expires_at`
- `idx_user_devices_user_id`
- `idx_user_devices_device_id`

---

## Frontend Components

### DeviceBindingModal
**Location**: `components/DeviceBindingModal.tsx`

**Features**:
- Auto-generates verification code on open
- Displays 6-character code prominently
- Manual code entry input
- Real-time validation
- Success/error states
- Device info detection using `expo-device`

**Usage**:
```tsx
import { DeviceBindingModal } from '@/components/DeviceBindingModal';

<DeviceBindingModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => {
    // Handle successful binding
  }}
/>
```

---

## Video Source Detection

### Functions

#### `detectVideoSource(url: string): VideoSourceInfo`
Returns:
```typescript
{
  type: 'youtube' | 'vimeo' | 'direct' | 'stream' | 'unsupported' | 'adult' | 'unknown',
  platform: string,
  requiresPremium: boolean,
  videoId?: string,
  error?: string
}
```

#### `canPlayVideo(url: string, membershipTier: MembershipTier): { canPlay: boolean; reason?: string }`
Checks if user can play video based on:
- Video source type
- User membership tier
- DRM restrictions

#### `getSupportedPlatforms(membershipTier: MembershipTier): string[]`
Returns list of supported platforms for given tier

---

## Usage Examples

### Check Video Access
```typescript
import { canPlayVideo, detectVideoSource } from '@/utils/videoSourceDetector';
import { useMembership } from '@/providers/MembershipProvider';

const { tier } = useMembership();
const videoUrl = 'https://www.pornhub.com/view_video.php?viewkey=xxx';

const { canPlay, reason } = canPlayVideo(videoUrl, tier);

if (!canPlay) {
  console.log(`Cannot play: ${reason}`);
  // Show upgrade prompt
}
```

### Device Binding Flow
```typescript
import { DeviceBindingModal } from '@/components/DeviceBindingModal';
import { useMembership } from '@/providers/MembershipProvider';

const { devices, getMaxDevices } = useMembership();
const [showBindingModal, setShowBindingModal] = useState(false);

// Check if device limit reached
if (devices.length >= getMaxDevices()) {
  // Show upgrade prompt or device management
} else {
  setShowBindingModal(true);
}
```

---

## Setup Instructions

### 1. Database Setup
Run the SQL schema in Supabase:
```bash
# Execute database-schema-device-binding.sql in Supabase SQL Editor
```

### 2. Environment Variables
Already configured in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://tdamcrigenexyhbsopay.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Install Dependencies
```bash
bun expo install expo-device
```

### 4. Test Device Binding
1. Open app on device
2. Trigger device binding modal
3. Generate verification code
4. Enter code to verify
5. Device should be bound successfully

---

## Security Considerations

1. **Verification Code Expiration**: 15 minutes
2. **Row Level Security**: Enabled on all tables
3. **User Authentication**: Required for all device operations
4. **Device Limits**: Enforced at backend level
5. **Code Cleanup**: Expired verifications auto-deleted

---

## Future Enhancements

1. **QR Code Display**: Add visual QR code rendering
2. **Device Notifications**: Alert when new device is bound
3. **Device Nicknames**: Allow users to rename devices
4. **Last Active**: Show last active timestamp for each device
5. **Remote Logout**: Allow users to remotely unbind devices
6. **Suspicious Activity**: Detect and alert on unusual device binding patterns

---

## Testing Checklist

- [ ] Generate verification code
- [ ] Verify device with correct code
- [ ] Verify device with incorrect code
- [ ] Verify device with expired code
- [ ] Check device limit enforcement
- [ ] Test video source detection for all platforms
- [ ] Test adult content blocking for free users
- [ ] Test adult content access for paid users
- [ ] Test DRM platform blocking
- [ ] List all bound devices
- [ ] Remove device
- [ ] Test membership tier upgrades

---

## API Reference

### Device Binding
```typescript
// Generate verification
const { verificationCode, qrCodeData, expiresAt } = 
  await trpc.device.generateVerification.mutate({
    deviceId: string,
    deviceName?: string
  });

// Verify device
const { success, deviceId } = 
  await trpc.device.verifyDevice.mutate({
    deviceId: string,
    verificationCode: string
  });

// List devices
const { devices } = await trpc.device.listDevices.query();

// Remove device
const { success, deviceId } = 
  await trpc.device.removeDevice.mutate({
    deviceId: string
  });
```

### Video Source Detection
```typescript
// Detect source
const sourceInfo = detectVideoSource(url);

// Check if can play
const { canPlay, reason } = canPlayVideo(url, membershipTier);

// Get supported platforms
const platforms = getSupportedPlatforms(membershipTier);
```
