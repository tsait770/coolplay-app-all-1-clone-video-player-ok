# Build & Release

## Android APK
```bash
cd universal_player_app
flutter build apk \
  --dart-define=SUPABASE_URL=... \
  --dart-define=SUPABASE_ANON_KEY=... \
  --dart-define=STRIPE_PUBLISHABLE_KEY=...
# output: build/app/outputs/flutter-apk/app-release.apk
```

## iOS IPA
1) Xcode: set Team, Bundle Id, Background Modes (Audio), Microphone usage strings
2) Build IPA:
```bash
flutter build ipa \
  --dart-define=SUPABASE_URL=... \
  --dart-define=SUPABASE_ANON_KEY=... \
  --dart-define=STRIPE_PUBLISHABLE_KEY=...
# output: build/ios/ipa/*.ipa
```

## CI Tips
- Store secrets as env vars, not in code
- Run tests before build
- Attach APK/IPA artifacts