#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const l10nDir = path.join(__dirname, '..', 'l10n');

// 需要添加的大寫key映射
const uppercaseKeys = {
  'ACCOUNT_SETTINGS': 'account_settings',
  'APPEARANCE_LANGUAGE': 'appearance_language',
  'DATA_MANAGEMENT': 'data_management',
  'SMART_CLASSIFICATION': 'smart_classification',
  'SYNC_SETTINGS': 'sync_settings',
  'SHORTCUTS': 'shortcuts',
  'NOTIFICATION_SETTINGS': 'notification_settings',
  'PRIVACY_SECURITY': 'privacy_security',
  'HELP_SUPPORT': 'help_support'
};

// 語言文件列表
const languages = [
  'en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 
  'de', 'fr', 'ru', 'ar', 'ja', 'ko'
];

console.log('🔄 同步大寫key到所有語言文件...\n');

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    let updated = false;
    
    // 為每個大寫key添加映射
    Object.entries(uppercaseKeys).forEach(([upperKey, lowerKey]) => {
      if (!translations[upperKey] && translations[lowerKey]) {
        translations[upperKey] = translations[lowerKey];
        updated = true;
        console.log(`  ✓ ${lang}: 添加 ${upperKey} = ${translations[lowerKey]}`);
      }
    });
    
    if (updated) {
      // 保存更新後的文件
      fs.writeFileSync(
        filePath,
        JSON.stringify(translations, null, 2) + '\n',
        'utf8'
      );
      console.log(`✅ ${lang}.json 已更新\n`);
    } else {
      console.log(`⏭️  ${lang}.json 無需更新\n`);
    }
  } catch (error) {
    console.error(`❌ 處理 ${lang}.json 時出錯:`, error.message);
  }
});

console.log('✨ 同步完成！');
