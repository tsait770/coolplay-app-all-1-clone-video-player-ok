#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const __dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filename);

const l10nDir = path.join(__dirname, '..', 'l10n');

const translations = {
  "es": "Demostración de Animación",
  "pt-BR": "Demonstração de Animação",
  "pt": "Demonstração de Animação",
  "de": "Animations-Demo",
  "fr": "Démonstration d'Animation",
  "ru": "Демонстрация Анимации",
  "ja": "アニメーションデモ",
  "ko": "애니메이션 데모"
};

console.log('🔄 Adding animation_demo key to remaining language files...\n');

Object.keys(translations).forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang}.json not found, skipping...`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.animation_demo) {
    console.log(`✓ ${lang}.json already has animation_demo key`);
    return;
  }

  data.animation_demo = translations[lang];
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Added animation_demo to ${lang}.json: "${translations[lang]}"`);
});

console.log('\n✨ Animation demo key added to all languages!');
