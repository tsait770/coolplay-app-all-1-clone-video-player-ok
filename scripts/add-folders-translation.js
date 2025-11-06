const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const __dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filename);

const translations = {
  'en': 'Folders',
  'zh-TW': '資料夾',
  'zh-CN': '文件夹',
  'es': 'Carpetas',
  'pt-BR': 'Pastas',
  'pt': 'Pastas',
  'de': 'Ordner',
  'fr': 'Dossiers',
  'ru': 'Папки',
  'ar': 'المجلدات',
  'ja': 'フォルダ',
  'ko': '폴더'
};

const l10nDir = path.join(__dirname, '..', 'l10n');

Object.entries(translations).forEach(([lang, translation]) => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.folders) {
      data.folders = translation;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Added "folders" translation to ${lang}.json: "${translation}"`);
    } else {
      console.log(`⏭️  "folders" already exists in ${lang}.json`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('\n✨ Translation update complete!');
