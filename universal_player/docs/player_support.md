# Player Support & Integration

## Formats
- MP4 (video/mp4)
- WebM (video/webm)
- Ogg/OGV (video/ogg)
- HLS (.m3u8)
- DASH (.mpd)
- RTMP (rtmp://)

## Headers & Proxy
- User-Agent: mimic common browsers if needed
- Referer: source domain for anti-leech
- Cookie: pass auth cookies securely
- Use server-side proxy to inject headers and handle CORS

## Mixed Content
- Android: configure network_security_config.xml for allowed domains
- iOS: ATS exceptions in Info.plist for trusted hosts

## Client Routing
- .m3u8 -> HLS (native or Exo/AV)
- .mpd -> DASH (Exo; iOS consider fallback)
- .mp4/.webm/.ogg -> basic playback

## YouTube Handling
- Normalize URLs (watch/short/embed/nocookie)
- Prefer embed; fallback to "Open in browser" if blocked

## Error Reporting
- Emit machine-readable errors with domain/code/message
- Show user-friendly messages and suggested fallback