# universal_player

Unified cross-platform media player controller with pluggable backends, source parsers, voice control, and UI controls.

## Getting started

```dart
final controller = UniversalPlayerController(backend: /* provide platform backend */);
```

## Modules
- Controller API: `UniversalPlayerController`
- Backend interface: `PlayerBackend`
- Models: `MediaSource`, `MediaVariant`, `PlayerState`, `PlayerError`
- Source parsing: `SourceParser` with pluggable resolvers
- Voice: `VoiceService`, `CommandMapper`
- UI: `VideoControls` (placeholder)

## Roadmap
- Android ExoPlayer / iOS AVPlayer backends
- FFmpeg integration for transcode/remux fallback
- Full glassmorphism UI with ABR and quality toggles
