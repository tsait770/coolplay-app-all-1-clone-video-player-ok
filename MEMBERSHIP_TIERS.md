# Membership Tiers & Video Source Support

## Overview

This document defines the membership system, usage limits, supported video sources, and device binding rules for the CoolPlay Voice Control App.

---

## Membership Tiers

### Free Trial (First-Time Users)
- **Duration**: One-time only (upon first login)
- **Usage Limit**: 2,000 uses total
- **Daily Limit**: Unlimited
- **Supported Sources**: All supported formats (including adult content)
- **Device Limit**: 1 device
- **Custom Voice Commands**: No
- **Notes**: 
  - Automatically converts to Free tier when trial uses are exhausted
  - Best for evaluating all features before purchasing

### Free (Default)
- **Monthly Cost**: $0
- **Usage Limit**: 30 uses per day
- **Daily Reset**: 00:00 UTC
- **Supported Sources**: Basic formats only (MP4, WebM, OGG, OGV, YouTube, Vimeo)
- **Unsupported Sources**: Adult content, premium streaming platforms
- **Device Limit**: 1 device
- **Custom Voice Commands**: No
- **Notes**: 
  - Daily quota resets automatically
  - Upgrade prompt shown when limit reached

### Basic (Paid)
- **Monthly Cost**: $19.90/month or $199/year (save ~17%)
- **Usage Limit**: 1,500 uses per month + 40 daily login bonus
- **Monthly Reset**: 1st of each month
- **Supported Sources**: All supported formats (including adult content)
- **Device Limit**: 3 devices
- **Custom Voice Commands**: Yes
- **Rollover**: Unused monthly quota carries over to next month
- **Notes**: 
  - Most popular tier
  - Ideal for regular users
  - Annual plan offers best value

### Premium (Paid)
- **Monthly Cost**: $39.90/month or $399/year (save ~17%)
- **Usage Limit**: Unlimited
- **Supported Sources**: All supported formats (including adult content)
- **Device Limit**: 3 devices
- **Custom Voice Commands**: Yes
- **Priority Support**: Yes
- **Early Access**: New features and formats
- **Notes**: 
  - Best for power users
  - No usage restrictions
  - Recommended for content creators

---

## Supported Video Sources

### Mainstream Platforms (All Tiers)
- **YouTube**: 
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
  - `https://www.youtube-nocookie.com/embed/VIDEO_ID`
  
- **Vimeo**: 
  - `https://vimeo.com/VIDEO_ID`
  - `https://player.vimeo.com/video/VIDEO_ID`
  
- **Twitch**: 
  - `https://www.twitch.tv/CHANNEL`
  - `https://www.twitch.tv/videos/VIDEO_ID`
  
- **Facebook**: 
  - `https://www.facebook.com/watch/?v=VIDEO_ID`
  - `https://fb.watch/SHORT_CODE`

### Cloud Storage (All Tiers)
- **Google Drive**: Public shared video links
- **Dropbox**: Public shared video links

### Direct Video Files (All Tiers)
- **MP4** (video/mp4)
- **WebM** (video/webm)
- **OGG/OGV** (video/ogg)

### Streaming Protocols (All Tiers)
- **HLS** (.m3u8)
- **DASH** (.mpd)
- **RTMP** (rtmp://)

### Social Media (All Tiers)
- **Twitter/X**: Video posts
- **Instagram**: Reels, posts, IGTV
- **TikTok**: Video posts
- **Bilibili**: Video posts

### Adult Content Platforms (Paid Tiers Only)
**Available for**: Free Trial, Basic, Premium

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

**Note**: Adult content is blocked for Free tier users. Upgrade required.

---

## Unsupported Sources (All Tiers)

The following platforms use DRM (Digital Rights Management) and cannot be supported:

- **Netflix** - Widevine DRM
- **Disney+** - Widevine DRM
- **HBO Max** - Widevine DRM
- **Amazon Prime Video** - Widevine DRM
- **Apple TV+** - FairPlay DRM
- **iQIYI** - Custom DRM

**Reason**: These platforms use encrypted streams that require proprietary decryption keys. Supporting them would violate their Terms of Service and copyright laws.

---

## Device Binding Rules

### Free Trial & Free Tier
- **Maximum Devices**: 1
- **Binding Method**: QR Code or verification code
- **Device Removal**: Must remove existing device before adding new one

### Basic & Premium Tiers
- **Maximum Devices**: 3
- **Binding Method**: QR Code or verification code
- **Device Removal**: Can manage devices in settings
- **Concurrent Use**: All devices can be used simultaneously

### Device Verification Process
1. User initiates device binding from new device
2. System generates 6-digit verification code and QR code
3. User enters code or scans QR code
4. Device is bound to account
5. Device information stored:
   - Device ID (unique identifier)
   - Device name (optional, user-provided)
   - Last login timestamp
   - Binding date

---

## Usage Counting Rules

### What Counts as "One Use"
- Playing a video (counts once per video session)
- Voice command execution (play, pause, seek, volume, etc.)
- Opening a video URL via voice command

### What Does NOT Count
- Browsing bookmarks
- Managing folders
- Changing settings
- Device binding/unbinding
- Viewing usage statistics

### Usage Reset Schedule
- **Daily Quota**: Resets at 00:00 UTC
- **Monthly Quota**: Resets on 1st of each month at 00:00 UTC
- **Trial Quota**: Does not reset (one-time allocation)

---

## Video Source Detection Function

```typescript
import { detectVideoSource, canPlayVideo } from '@/utils/videoSourceDetector';

// Detect video source type
const sourceInfo = detectVideoSource(url);
console.log(sourceInfo);
// {
//   type: 'youtube' | 'vimeo' | 'direct' | 'stream' | 'adult' | 'unsupported' | 'unknown',
//   platform: 'YouTube',
//   requiresPremium: false,
//   videoId: 'dQw4w9WgXcQ',
//   streamType: 'hls' | 'dash' | 'rtmp' | 'mp4' | 'webm' | 'ogg'
// }

// Check if user can play video
const accessCheck = canPlayVideo(url, membershipTier);
if (!accessCheck.canPlay) {
  console.error(accessCheck.reason);
  // Show upgrade prompt
}
```

---

## Implementation Checklist

### Backend Requirements
- [ ] Implement usage counting middleware
- [ ] Add daily/monthly quota reset cron jobs
- [ ] Create device binding API endpoints
- [ ] Implement QR code generation
- [ ] Add membership tier validation
- [ ] Create usage statistics API
- [ ] Implement Stripe webhook handlers
- [ ] Add device limit enforcement

### Frontend Requirements
- [ ] Integrate video source detector
- [ ] Add usage limit warnings
- [ ] Implement upgrade prompts
- [ ] Create device management UI
- [ ] Add QR code scanner
- [ ] Display usage statistics
- [ ] Show membership benefits
- [ ] Implement payment flow

### Database Schema
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  membership_tier VARCHAR(20) DEFAULT 'free_trial',
  trial_used BOOLEAN DEFAULT FALSE,
  trial_remaining INTEGER DEFAULT 2000,
  monthly_quota INTEGER DEFAULT 0,
  daily_quota INTEGER DEFAULT 0,
  last_daily_reset TIMESTAMP,
  last_monthly_reset TIMESTAMP,
  max_devices INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Devices table
devices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(255),
  last_login TIMESTAMP,
  bound_at TIMESTAMP DEFAULT NOW()
);

-- Usage logs table
usage_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_id UUID REFERENCES devices(id),
  action_type VARCHAR(50),
  video_url TEXT,
  video_platform VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## Error Messages

### Usage Limit Reached
```
Free Tier: "Daily limit reached (30/30). Upgrade to Basic for 1,500 monthly uses + 40 daily bonus!"
Basic Tier: "Monthly quota exhausted. Resets on [DATE]. Daily bonus: [X/40] remaining."
Trial: "Trial uses exhausted (2000/2000). Upgrade to continue using all features!"
```

### Adult Content Blocked
```
"Adult content requires a paid membership. Upgrade to Basic ($19.90/mo) or Premium ($39.90/mo) to access."
```

### Device Limit Reached
```
Free Tier: "Device limit reached (1/1). Remove existing device or upgrade to Basic for 3 devices."
Paid Tier: "Device limit reached (3/3). Remove a device to add a new one."
```

### Unsupported Platform
```
"[Platform Name] is not supported due to DRM restrictions. Supported platforms: YouTube, Vimeo, Twitch, and more."
```

---

## Testing Checklist

### Video Source Testing
- [ ] Test all YouTube URL formats (watch, embed, short, nocookie)
- [ ] Test Vimeo standard and player URLs
- [ ] Test direct video files (MP4, WebM, OGG)
- [ ] Test HLS streams (.m3u8)
- [ ] Test DASH streams (.mpd)
- [ ] Test RTMP streams
- [ ] Test adult content URLs (with paid account)
- [ ] Test unsupported platforms (Netflix, Disney+)
- [ ] Test invalid/malformed URLs

### Membership Testing
- [ ] Verify trial quota decrements correctly
- [ ] Test daily quota reset at midnight UTC
- [ ] Test monthly quota reset on 1st of month
- [ ] Verify upgrade flow (Free → Basic → Premium)
- [ ] Test downgrade flow (Premium → Basic → Free)
- [ ] Verify Stripe webhook processing
- [ ] Test subscription cancellation
- [ ] Test payment failure handling

### Device Binding Testing
- [ ] Test QR code generation
- [ ] Test QR code scanning
- [ ] Test verification code input
- [ ] Test device limit enforcement
- [ ] Test device removal
- [ ] Test concurrent device usage
- [ ] Test device name updates

---

## Support & Troubleshooting

### Common Issues

**Q: Why can't I play Netflix/Disney+ videos?**
A: These platforms use DRM encryption that we cannot legally bypass. Use supported platforms like YouTube, Vimeo, or direct video files.

**Q: My daily quota didn't reset.**
A: Daily quotas reset at 00:00 UTC. Check your timezone. If issue persists, contact support.

**Q: I upgraded but still can't access adult content.**
A: Ensure your payment processed successfully and your membership tier updated. Try logging out and back in. Contact support if issue persists.

**Q: Can I use the app on multiple devices simultaneously?**
A: Yes, if you have Basic or Premium membership (up to 3 devices). Free tier allows only 1 device.

**Q: What happens to unused monthly quota?**
A: For Basic tier, unused quota rolls over to next month. Premium has unlimited usage.

---

## Pricing & Billing

### Payment Methods
- Credit/Debit Cards (via Stripe)
- Apple Pay (iOS)
- Google Pay (Android)

### Billing Cycles
- **Monthly**: Charged on same day each month
- **Annual**: Charged once per year (17% discount)

### Refund Policy
- 7-day money-back guarantee for first-time subscribers
- Pro-rated refunds for annual plans (within 30 days)
- No refunds for monthly plans after 7 days

### Cancellation
- Cancel anytime from account settings
- Access continues until end of billing period
- No partial refunds after 7-day window

---

## Compliance & Legal

### Age Restrictions
- Adult content requires age verification (18+)
- Users must accept Terms of Service
- Parental controls available

### Data Privacy
- Usage data stored for analytics only
- No video content is stored on our servers
- GDPR & CCPA compliant

### Copyright
- Users responsible for content they access
- We do not host or distribute copyrighted content
- DMCA takedown process available

---

**Last Updated**: 2025-10-02  
**Version**: 1.0.0
