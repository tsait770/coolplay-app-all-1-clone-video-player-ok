# Video Source Testing System

## Overview
A comprehensive testing system for validating video source playback across multiple platforms and streaming protocols.

## Access the Test Page
Navigate to `/video-test` in your app to access the testing interface.

## Features

### 1. **Automated Testing**
- Run all tests with a single button click
- Individual test execution for specific sources
- Real-time status updates during testing
- Comprehensive test summary with success/failure counts

### 2. **Test Categories**

#### Mainstream Platforms
- **YouTube**: Full support with video ID extraction
- **Vimeo**: Full support with video ID extraction

#### Streaming Protocols
- **M3U8 (HLS)**: HTTP Live Streaming support
- **DASH (MPD)**: Dynamic Adaptive Streaming over HTTP
- **MP4 Direct**: Direct MP4 file playback

#### Adult Content Platforms (Premium Only)
- Pornhub
- Xvideos
- Xnxx
- Redtube
- YouPorn
- Spankbang

### 3. **Membership Integration**
The testing system respects membership tiers:
- **Free Trial**: Access to all sources (2000 uses)
- **Free**: Limited to mainstream platforms only
- **Basic/Premium**: Full access including adult content

### 4. **Custom URL Testing**
Test any video URL by entering it in the custom URL field.

## Test Results

### Status Indicators
- ✅ **Success**: Video source detected and can be played
- ❌ **Failed**: Video source not supported or invalid
- ⚠️ **Blocked**: Requires premium membership
- 🔄 **Testing**: Currently being tested

### Information Displayed
For each test, you'll see:
- Source name and category
- Full URL
- Detection result (video type)
- Playback capability
- Error messages (if any)

## Test Sources

### YouTube
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Expected: Supported
Type: youtube
```

### Vimeo
```
URL: https://vimeo.com/76979871
Expected: Supported
Type: vimeo
```

### M3U8 (HLS Stream)
```
URL: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
Expected: Supported
Type: stream
```

### DASH (MPD Stream)
```
URL: https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd
Expected: Supported
Type: stream
```

### MP4 Direct
```
URL: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
Expected: Supported
Type: direct
```

## Testing Workflow

### 1. Run All Tests
1. Click "Run All Tests" button
2. System will test each source sequentially
3. Wait for all tests to complete
4. Review the summary and detailed results

### 2. Test Individual Source
1. Find the source you want to test
2. Click the "Test" button on that source card
3. Video player will appear showing the test
4. Result will be displayed immediately

### 3. Test Custom URL
1. Enter your video URL in the input field
2. Click "Test" button
3. System will detect the source type
4. Result will show if it's playable

## Error Handling

### Common Errors

#### "Adult content requires premium membership"
- **Cause**: Trying to play adult content with free membership
- **Solution**: Upgrade to Basic or Premium membership

#### "Unsupported platform: [Platform Name]"
- **Cause**: Platform uses DRM or is not supported
- **Solution**: Use supported platforms only

#### "Cannot play this video"
- **Cause**: Video source is invalid or unavailable
- **Solution**: Check URL format and availability

#### "Unknown video source"
- **Cause**: URL doesn't match any known patterns
- **Solution**: Verify URL is correct and from supported platform

## Supported Video Formats

### Direct Video Files
- MP4 (`.mp4`)
- WebM (`.webm`)
- OGG (`.ogg`)
- OGV (`.ogv`)

### Streaming Protocols
- HLS (`.m3u8`)
- DASH (`.mpd`)
- RTMP (`rtmp://`)

### Platform Embeds
- YouTube (iframe API)
- Vimeo (player API)

## Unsupported Platforms

The following platforms are **NOT** supported due to DRM restrictions:
- Netflix
- Disney+
- HBO Max
- Amazon Prime Video
- iQIYI (愛奇藝)

## Technical Details

### Detection Logic
The system uses regex patterns to detect video sources:

```typescript
// YouTube detection
/youtube\.com\/watch\?v=[\w-]+/
/youtu\.be\/[\w-]+/

// Vimeo detection
/vimeo\.com\/\d+/

// Direct video files
/.*\.(mp4|webm|ogg|ogv)$/

// HLS streams
/.*\.m3u8$/

// DASH streams
/.*\.mpd$/

// RTMP streams
/^rtmp:\/\/.*$/
```

### Membership Checks
```typescript
function canPlayVideo(url: string, membershipTier: MembershipTier) {
  const sourceInfo = detectVideoSource(url);
  
  // Adult content requires paid membership
  if (sourceInfo.type === 'adult' && membershipTier === 'free') {
    return { canPlay: false, reason: 'Adult content requires paid membership' };
  }
  
  // Unsupported platforms
  if (sourceInfo.type === 'unsupported') {
    return { canPlay: false, reason: 'Platform not supported' };
  }
  
  return { canPlay: true };
}
```

## Best Practices

### 1. Test Before Production
Always test video URLs before adding them to your production content.

### 2. Check Membership Requirements
Verify that your users have the appropriate membership tier for the content.

### 3. Handle Errors Gracefully
Implement proper error handling and user feedback for failed playback.

### 4. Monitor Performance
Keep track of which sources work reliably and which have issues.

### 5. Update Regularly
Video platforms may change their APIs or embed methods. Keep the detection logic updated.

## Troubleshooting

### Video Won't Load
1. Check if URL is correct and accessible
2. Verify membership tier allows this content
3. Check network connectivity
4. Try a different video from the same platform

### Detection Failed
1. Ensure URL format matches expected patterns
2. Check if platform is in supported list
3. Verify URL is not shortened or redirected

### Playback Issues
1. Check if video is still available on the platform
2. Verify video is not region-locked
3. Test on different devices/browsers
4. Check console for error messages

## Future Enhancements

Potential improvements for the testing system:
- [ ] Batch testing with CSV import
- [ ] Export test results to JSON/CSV
- [ ] Performance metrics (load time, buffering)
- [ ] Automated regression testing
- [ ] Video quality detection
- [ ] Subtitle/caption support testing
- [ ] Mobile vs Web comparison

## Support

For issues or questions about video source testing:
1. Check this documentation first
2. Review console logs for detailed errors
3. Test with known working URLs
4. Contact support with test results

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
