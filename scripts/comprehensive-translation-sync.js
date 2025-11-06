const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url || 'file://' + __filename);
const __dirname = path.dirname(__filename);

const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];
const l10nDir = path.join(__dirname, '..', 'l10n');

console.log('🔍 Comprehensive Translation Sync Check\n');
console.log('=' .repeat(80));

const allTranslations = {};
const allKeys = new Set();

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    allTranslations[lang] = JSON.parse(content);
    Object.keys(allTranslations[lang]).forEach(key => allKeys.add(key));
    console.log(`✓ Loaded ${lang}.json - ${Object.keys(allTranslations[lang]).length} keys`);
  } catch (error) {
    console.error(`✗ Error loading ${lang}.json:`, error.message);
    allTranslations[lang] = {};
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Total unique keys found: ${allKeys.size}\n`);

const missingKeys = {};
languages.forEach(lang => {
  missingKeys[lang] = [];
  allKeys.forEach(key => {
    if (!allTranslations[lang][key]) {
      missingKeys[lang].push(key);
    }
  });
});

console.log('🔍 Missing Keys Report:\n');
let hasMissingKeys = false;

languages.forEach(lang => {
  if (missingKeys[lang].length > 0) {
    hasMissingKeys = true;
    console.log(`\n❌ ${lang}.json - Missing ${missingKeys[lang].length} keys:`);
    missingKeys[lang].slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (missingKeys[lang].length > 10) {
      console.log(`   ... and ${missingKeys[lang].length - 10} more`);
    }
  } else {
    console.log(`✅ ${lang}.json - All keys present`);
  }
});

if (!hasMissingKeys) {
  console.log('\n✅ All translation files are synchronized!');
} else {
  console.log('\n⚠️  Some translation files have missing keys.');
  console.log('Run the sync script to fix missing translations.');
}

console.log('\n' + '='.repeat(80));
console.log('\n📋 Key Statistics by Category:\n');

const categories = {
  'Voice Control': ['voice_control', 'tap_to_speak', 'always_listen', 'commands_used', 'monthly_limit', 'upgrade_plan', 'available_commands'],
  'Settings': ['account_settings', 'login', 'account_info', 'subscription_plan', 'device_management', 'appearance_language', 'dark_mode'],
  'Data Management': ['data_management', 'auto_backup', 'export_backup', 'clear_cache', 'reset_data'],
  'Video Player': ['select_video', 'load_from_url', 'video_url', 'download_video', 'playback_speed'],
  'Notifications': ['notification_settings', 'enable_notifications', 'notification_types', 'push_frequency'],
};

Object.entries(categories).forEach(([category, keys]) => {
  const presentCount = keys.filter(key => allKeys.has(key)).length;
  console.log(`${category}: ${presentCount}/${keys.length} keys present`);
});

console.log('\n' + '='.repeat(80));
