#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const __dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filename);

const l10nDir = path.join(__dirname, '..', 'l10n');

const allKeys = {
  "animation_demo": {
    "en": "Animation Demo",
    "zh-TW": "動畫效果展示",
    "zh-CN": "动画效果展示",
    "es": "Demostración de Animación",
    "pt-BR": "Demonstração de Animação",
    "pt": "Demonstração de Animação",
    "de": "Animations-Demo",
    "fr": "Démonstration d'Animation",
    "ru": "Демонстрация Анимации",
    "ar": "عرض الرسوم المتحركة",
    "ja": "アニメーションデモ",
    "ko": "애니메이션 데모"
  },
  "about": {
    "en": "About",
    "zh-TW": "關於",
    "zh-CN": "关于",
    "es": "Acerca de",
    "pt-BR": "Sobre",
    "pt": "Sobre",
    "de": "Über",
    "fr": "À propos",
    "ru": "О приложении",
    "ar": "حول",
    "ja": "について",
    "ko": "정보"
  }
};

const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];

console.log('🔄 Syncing missing translation keys across all languages...\n');

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang}.json not found, skipping...`);
    return;
  }

  let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let addedCount = 0;

  Object.keys(allKeys).forEach(key => {
    if (!translations[key]) {
      translations[key] = allKeys[key][lang];
      addedCount++;
      console.log(`✅ Added "${key}" to ${lang}.json: "${allKeys[key][lang]}"`);
    }
  });

  const sortedTranslations = Object.keys(translations)
    .sort()
    .reduce((acc, key) => {
      acc[key] = translations[key];
      return acc;
    }, {});

  fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2) + '\n', 'utf8');
  
  if (addedCount > 0) {
    console.log(`📝 Updated ${lang}.json with ${addedCount} new keys\n`);
  } else {
    console.log(`✓ ${lang}.json already has all keys\n`);
  }
});

console.log('✨ Translation sync complete!');
