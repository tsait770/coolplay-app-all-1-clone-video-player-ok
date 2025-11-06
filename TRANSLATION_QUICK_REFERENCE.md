# 🌍 Translation System - Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Import the hook
```typescript
import { useTranslation } from '@/hooks/useTranslation';
```

### 2. Use in component
```typescript
const { t } = useTranslation();
```

### 3. Translate text
```typescript
<Text>{t("key_name")}</Text>
```

---

## 📋 Supported Languages

| Code | Language | Flag |
|------|----------|------|
| `en` | English | 🇺🇸 |
| `zh-TW` | 繁體中文 | 🇹🇼 |
| `zh-CN` | 简体中文 | 🇨🇳 |
| `es` | Español | 🇪🇸 |
| `pt-BR` | Português (BR) | 🇧🇷 |
| `pt` | Português | 🇵🇹 |
| `de` | Deutsch | 🇩🇪 |
| `fr` | Français | 🇫🇷 |
| `ru` | Русский | 🇷🇺 |
| `ar` | العربية | 🇸🇦 |
| `ja` | 日本語 | 🇯🇵 |
| `ko` | 한국어 | 🇰🇷 |

---

## 💡 Common Usage Examples

### Basic Text
```typescript
<Text>{t("app_name")}</Text>
<Text>{t("home")}</Text>
<Text>{t("settings")}</Text>
```

### Button Titles
```typescript
<Button title={t("save")} />
<Button title={t("cancel")} />
<Button title={t("confirm")} />
```

### Placeholders
```typescript
<TextInput 
  placeholder={t("search_placeholder")}
/>
```

### Alert Messages
```typescript
Alert.alert(
  t("error"),
  t("error_message")
);
```

### Conditional Text
```typescript
<Text>
  {isLoggedIn ? t("logout") : t("login")}
</Text>
```

---

## 🔄 Language Switching

```typescript
import { useLanguage } from '@/hooks/useLanguage';

const { language, setLanguage } = useLanguage();

// Get current language
console.log(language); // "en"

// Change language
await setLanguage("zh-TW");
```

---

## ➕ Adding New Keys

### 1. Add to `l10n/en.json`
```json
{
  "new_feature": "New Feature"
}
```

### 2. Add to all other language files
```json
// l10n/zh-TW.json
{
  "new_feature": "新功能"
}

// l10n/zh-CN.json
{
  "new_feature": "新功能"
}

// ... etc for all 12 languages
```

### 3. Use in code
```typescript
<Text>{t("new_feature")}</Text>
```

---

## ✅ Do's

✅ Always use `t()` for user-facing text  
✅ Use descriptive key names  
✅ Keep keys in snake_case  
✅ Add keys to ALL 12 language files  
✅ Test in multiple languages  

---

## ❌ Don'ts

❌ Don't hardcode strings  
❌ Don't use `t()` outside components  
❌ Don't forget to add keys to all languages  
❌ Don't use spaces in key names  
❌ Don't use special characters in keys  

---

## 🔍 Key Naming Patterns

```typescript
// Screens
"home_title"
"settings_title"

// Actions
"button_save"
"button_cancel"

// Messages
"error_network"
"success_saved"

// Placeholders
"input_email_placeholder"
"search_placeholder"

// Descriptions
"feature_import_desc"
"player_description"
```

---

## 🧪 Validation

Run validation script:
```bash
node scripts/validate-translation-keys.js
```

This checks:
- ✅ All languages have same keys
- ✅ No missing translations
- ✅ No empty values

---

## 📁 File Locations

```
l10n/
├── en.json          # English (base)
├── zh-TW.json       # Traditional Chinese
├── zh-CN.json       # Simplified Chinese
├── es.json          # Spanish
├── pt-BR.json       # Brazilian Portuguese
├── pt.json          # Portuguese
├── de.json          # German
├── fr.json          # French
├── ru.json          # Russian
├── ar.json          # Arabic
├── ja.json          # Japanese
└── ko.json          # Korean

hooks/
├── useLanguage.tsx
└── useTranslation.tsx
```

---

## 🎯 Complete Example

```typescript
import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';

export default function MyScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  return (
    <View>
      {/* Title */}
      <Text>{t("app_name")}</Text>
      
      {/* Description */}
      <Text>{t("subtitle")}</Text>
      
      {/* Input */}
      <TextInput 
        placeholder={t("search_placeholder")}
      />
      
      {/* Buttons */}
      <Button 
        title={t("save")} 
        onPress={() => {}}
      />
      
      {/* Language Switcher */}
      <Button 
        title={t("language")}
        onPress={() => setLanguage("zh-TW")}
      />
      
      {/* Current Language */}
      <Text>{t("current_language")}: {language}</Text>
    </View>
  );
}
```

---

## 🆘 Troubleshooting

### Key not found?
- Check spelling (case-sensitive)
- Verify key exists in `l10n/en.json`
- Run validation script

### Language not changing?
- Ensure `LanguageProvider` wraps app
- Check AsyncStorage permissions
- Clear app cache

### Translation not updating?
- Use `t()` inside component
- Don't destructure outside render

---

## 📊 Current Stats

- **Languages:** 12
- **Translation Keys:** 541+
- **Coverage:** 100%
- **Status:** ✅ Production Ready

---

## 🔗 Related Files

- [Complete Guide](./TRANSLATION_BINDING_GUIDE.md)
- [Validation Script](./scripts/validate-translation-keys.js)
- [useTranslation Hook](./hooks/useTranslation.tsx)
- [useLanguage Hook](./hooks/useLanguage.tsx)

---

**Last Updated:** 2025-10-02  
**Quick Reference Version:** 1.0
