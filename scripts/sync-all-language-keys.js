const fs = require('fs');
const path = require('path');

const l10nDir = path.join(__dirname, '..', 'l10n');
const languages = ['en', 'ar', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ja', 'ko'];

console.log('🔄 Synchronizing all language keys...\n');

const allKeys = new Set();
const languageData = {};

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    languageData[lang] = data;
    Object.keys(data).forEach(key => allKeys.add(key));
    console.log(`✓ Loaded ${lang}.json (${Object.keys(data).length} keys)`);
  } catch (error) {
    console.error(`✗ Error loading ${lang}.json:`, error.message);
    languageData[lang] = {};
  }
});

console.log(`\n📊 Total unique keys found: ${allKeys.size}\n`);

const sortedKeys = Array.from(allKeys).sort();

languages.forEach(lang => {
  const data = languageData[lang];
  const missingKeys = sortedKeys.filter(key => !(key in data));
  
  if (missingKeys.length > 0) {
    console.log(`⚠️  ${lang}.json is missing ${missingKeys.length} keys:`);
    missingKeys.forEach(key => {
      data[key] = languageData['en'][key] || key;
      console.log(`   + ${key}`);
    });
    
    const sortedData = {};
    sortedKeys.forEach(key => {
      if (key in data) {
        sortedData[key] = data[key];
      }
    });
    
    const filePath = path.join(l10nDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2) + '\n', 'utf8');
    console.log(`✓ Updated ${lang}.json\n`);
  } else {
    console.log(`✓ ${lang}.json has all keys\n`);
  }
});

console.log('✅ All language files synchronized!');
console.log(`\n📝 Summary:`);
console.log(`   - Total keys: ${sortedKeys.length}`);
console.log(`   - Languages: ${languages.length}`);
console.log(`   - All files now have identical key structure`);
