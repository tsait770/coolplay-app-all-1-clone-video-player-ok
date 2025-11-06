#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Translation Key Validation Script
 * 
 * This script validates that all 12 language files have consistent keys
 * and reports any missing or extra keys.
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'en',
  'zh-TW',
  'zh-CN',
  'es',
  'pt-BR',
  'pt',
  'de',
  'fr',
  'ru',
  'ar',
  'ja',
  'ko'
];

const L10N_DIR = path.join(__dirname, '..', 'l10n');

console.log('🌍 Translation Key Validation\n');
console.log('=' .repeat(60));

// Load all translation files
const translations = {};
const errors = [];

for (const lang of LANGUAGES) {
  const filePath = path.join(L10N_DIR, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[lang] = JSON.parse(content);
    console.log(`✅ Loaded ${lang}.json (${Object.keys(translations[lang]).length} keys)`);
  } catch (error) {
    console.error(`❌ Failed to load ${lang}.json:`, error.message);
    errors.push(`Failed to load ${lang}.json`);
  }
}

console.log('\n' + '='.repeat(60));

// Use English as the base reference
const baseKeys = new Set(Object.keys(translations['en'] || {}));
console.log(`\n📋 Base language (English) has ${baseKeys.size} keys\n`);

// Check each language against the base
const missingKeys = {};
const extraKeys = {};

for (const lang of LANGUAGES) {
  if (lang === 'en') continue; // Skip base language
  
  const langKeys = new Set(Object.keys(translations[lang] || {}));
  
  // Find missing keys (in base but not in this language)
  const missing = [...baseKeys].filter(key => !langKeys.has(key));
  if (missing.length > 0) {
    missingKeys[lang] = missing;
  }
  
  // Find extra keys (in this language but not in base)
  const extra = [...langKeys].filter(key => !baseKeys.has(key));
  if (extra.length > 0) {
    extraKeys[lang] = extra;
  }
}

// Report missing keys
if (Object.keys(missingKeys).length > 0) {
  console.log('⚠️  Missing Keys:\n');
  for (const [lang, keys] of Object.entries(missingKeys)) {
    console.log(`  ${lang}: ${keys.length} missing keys`);
    if (keys.length <= 10) {
      keys.forEach(key => console.log(`    - ${key}`));
    } else {
      keys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      console.log(`    ... and ${keys.length - 10} more`);
    }
    console.log('');
  }
} else {
  console.log('✅ No missing keys found!\n');
}

// Report extra keys
if (Object.keys(extraKeys).length > 0) {
  console.log('⚠️  Extra Keys (not in base):\n');
  for (const [lang, keys] of Object.entries(extraKeys)) {
    console.log(`  ${lang}: ${keys.length} extra keys`);
    if (keys.length <= 10) {
      keys.forEach(key => console.log(`    - ${key}`));
    } else {
      keys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      console.log(`    ... and ${keys.length - 10} more`);
    }
    console.log('');
  }
} else {
  console.log('✅ No extra keys found!\n');
}

// Check for empty values
console.log('🔍 Checking for empty values...\n');
let emptyValuesFound = false;

for (const [lang, trans] of Object.entries(translations)) {
  const emptyKeys = Object.entries(trans)
    .filter(([key, value]) => !value || value.trim() === '')
    .map(([key]) => key);
  
  if (emptyKeys.length > 0) {
    emptyValuesFound = true;
    console.log(`  ${lang}: ${emptyKeys.length} empty values`);
    emptyKeys.slice(0, 5).forEach(key => console.log(`    - ${key}`));
    if (emptyKeys.length > 5) {
      console.log(`    ... and ${emptyKeys.length - 5} more`);
    }
    console.log('');
  }
}

if (!emptyValuesFound) {
  console.log('✅ No empty values found!\n');
}

// Summary
console.log('='.repeat(60));
console.log('\n📊 Summary:\n');

const totalMissing = Object.values(missingKeys).reduce((sum, keys) => sum + keys.length, 0);
const totalExtra = Object.values(extraKeys).reduce((sum, keys) => sum + keys.length, 0);

console.log(`  Total languages: ${LANGUAGES.length}`);
console.log(`  Base keys (English): ${baseKeys.size}`);
console.log(`  Languages with missing keys: ${Object.keys(missingKeys).length}`);
console.log(`  Total missing keys: ${totalMissing}`);
console.log(`  Languages with extra keys: ${Object.keys(extraKeys).length}`);
console.log(`  Total extra keys: ${totalExtra}`);

if (errors.length > 0) {
  console.log(`\n❌ Errors: ${errors.length}`);
  errors.forEach(err => console.log(`  - ${err}`));
}

console.log('\n' + '='.repeat(60));

// Exit with error code if there are issues
if (totalMissing > 0 || totalExtra > 0 || errors.length > 0) {
  console.log('\n⚠️  Translation validation completed with warnings\n');
  process.exit(1);
} else {
  console.log('\n✅ All translations are valid and consistent!\n');
  process.exit(0);
}
