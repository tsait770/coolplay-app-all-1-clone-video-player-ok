#!/usr/bin/env node

/**
 * 修復所有語言文件中缺失的翻譯key
 * 特別處理大寫的section headers和其他未翻譯的內容
 */

const fs = require('fs');
const path = require('path');

const l10nDir = path.resolve(__dirname, '..', 'l10n');

// 所有需要添加的key及其對應的翻譯
const missingKeys = {
  // 大寫section headers (映射到小寫key)
  'ACCOUNT_SETTINGS': {
    en: 'Account Settings',
    'zh-TW': '帳戶設定',
    'zh-CN': '账户设置',
    es: 'Configuración de Cuenta',
    'pt-BR': 'Configurações da Conta',
    pt: 'Configurações da Conta',
    de: 'Kontoeinstellungen',
    fr: 'Paramètres du Compte',
    ru: 'Настройки аккаунта',
    ar: 'إعدادات الحساب',
    ja: 'アカウント設定',
    ko: '계정 설정'
  },
  'APPEARANCE_LANGUAGE': {
    en: 'Appearance & Language',
    'zh-TW': '外觀與語言',
    'zh-CN': '外观与语言',
    es: 'Apariencia e Idioma',
    'pt-BR': 'Aparência e Idioma',
    pt: 'Aparência e Idioma',
    de: 'Erscheinungsbild & Sprache',
    fr: 'Apparence et Langue',
    ru: 'Внешний вид и язык',
    ar: 'المظهر واللغة',
    ja: '外観と言語',
    ko: '외관 및 언어'
  },
  'DATA_MANAGEMENT': {
    en: 'Data Management',
    'zh-TW': '資料管理',
    'zh-CN': '数据管理',
    es: 'Gestión de Datos',
    'pt-BR': 'Gerenciamento de Dados',
    pt: 'Gestão de Dados',
    de: 'Datenverwaltung',
    fr: 'Gestion des Données',
    ru: 'Управление данными',
    ar: 'إدارة البيانات',
    ja: 'データ管理',
    ko: '데이터 관리'
  },
  'SMART_CLASSIFICATION': {
    en: 'Smart Classification',
    'zh-TW': '智慧分類',
    'zh-CN': '智能分类',
    es: 'Clasificación Inteligente',
    'pt-BR': 'Classificação Inteligente',
    pt: 'Classificação Inteligente',
    de: 'Intelligente Klassifizierung',
    fr: 'Classification Intelligente',
    ru: 'Умная классификация',
    ar: 'التصنيف الذكي',
    ja: 'スマート分類',
    ko: '스마트 분류'
  },
  'SYNC_SETTINGS': {
    en: 'Sync Settings',
    'zh-TW': '同步設定',
    'zh-CN': '同步设置',
    es: 'Configuración de Sincronización',
    'pt-BR': 'Configurações de Sincronização',
    pt: 'Configurações de Sincronização',
    de: 'Synchronisierungseinstellungen',
    fr: 'Paramètres de Synchronisation',
    ru: 'Настройки синхронизации',
    ar: 'إعدادات المزامنة',
    ja: '同期設定',
    ko: '동기화 설정'
  },
  'SHORTCUTS': {
    en: 'Shortcuts',
    'zh-TW': '快捷鍵',
    'zh-CN': '快捷键',
    es: 'Atajos',
    'pt-BR': 'Atalhos',
    pt: 'Atalhos',
    de: 'Verknüpfungen',
    fr: 'Raccourcis',
    ru: 'Ярлыки',
    ar: 'الاختصارات',
    ja: 'ショートカット',
    ko: '단축키'
  },
  'NOTIFICATION_SETTINGS': {
    en: 'Notification Settings',
    'zh-TW': '通知設定',
    'zh-CN': '通知设置',
    es: 'Configuración de Notificaciones',
    'pt-BR': 'Configurações de Notificação',
    pt: 'Configurações de Notificação',
    de: 'Benachrichtigungseinstellungen',
    fr: 'Paramètres de Notification',
    ru: 'Настройки уведомлений',
    ar: 'إعدادات الإشعارات',
    ja: '通知設定',
    ko: '알림 설정'
  },
  'PRIVACY_SECURITY': {
    en: 'Privacy & Security',
    'zh-TW': '隱私與安全',
    'zh-CN': '隱私与安全',
    es: 'Privacidad y Seguridad',
    'pt-BR': 'Privacidade e Segurança',
    pt: 'Privacidade e Segurança',
    de: 'Datenschutz & Sicherheit',
    fr: 'Confidentialité et Sécurité',
    ru: 'Конфиденциальность и безопасность',
    ar: 'الخصوصية والأمان',
    ja: 'プライバシーとセキュリティ',
    ko: '개인정보 및 보안'
  },
  'HELP_SUPPORT': {
    en: 'Help & Support',
    'zh-TW': '幫助與支援',
    'zh-CN': '帮助与支持',
    es: 'Ayuda y Soporte',
    'pt-BR': 'Ajuda e Suporte',
    pt: 'Ajuda e Suporte',
    de: 'Hilfe & Support',
    fr: 'Aide et Support',
    ru: 'Помощь и поддержка',
    ar: 'المساعدة والدعم',
    ja: 'ヘルプとサポート',
    ko: '도움말 및 지원'
  },
  'invalid_video_url': {
    en: 'Invalid video URL',
    'zh-TW': '無效的視頻網址',
    'zh-CN': '無效的视频网址',
    es: 'URL de video inválida',
    'pt-BR': 'URL de vídeo inválida',
    pt: 'URL de vídeo inválido',
    de: 'Ungültige Video-URL',
    fr: 'URL vidéo invalide',
    ru: 'Неверный URL видео',
    ar: 'عنوان URL للفيديو غير صالح',
    ja: '無効な動画URL',
    ko: '잘못된 동영상 URL'
  },
  'max_folders_reached': {
    en: 'Maximum number of folders reached',
    'zh-TW': '已達到資料夾數量上限',
    'zh-CN': '已达到文件夹数量上限',
    es: 'Número máximo de carpetas alcanzado',
    'pt-BR': 'Número máximo de pastas atingido',
    pt: 'Número máximo de pastas atingido',
    de: 'Maximale Anzahl an Ordnern erreicht',
    fr: 'Nombre maximum de dossiers atteint',
    ru: 'Достигнуто максимальное количество папок',
    ar: 'تم الوصول إلى الحد الأقصى لعدد المجلدات',
    ja: 'フォルダの最大数に達しました',
    ko: '최대 폴더 수에 도달했습니다'
  },
  'cache_clear_failed': {
    en: 'Failed to clear cache',
    'zh-TW': '清除快取失敗',
    'zh-CN': '清除缓存失败',
    es: 'Error al limpiar caché',
    'pt-BR': 'Falha ao limpar cache',
    pt: 'Falha ao limpar cache',
    de: 'Cache konnte nicht gelöscht werden',
    fr: 'Échec de la suppression du cache',
    ru: 'Не удалось очистить кэш',
    ar: 'فشل مسح ذاكرة التخزين المؤقت',
    ja: 'キャッシュのクリアに失敗しました',
    ko: '캐시 지우기 실패'
  },
  'animation_demo': {
    en: 'Animation Demo',
    'zh-TW': '動畫效果展示',
    'zh-CN': '动画效果展示',
    es: 'Demostración de Animación',
    'pt-BR': 'Demonstração de Animação',
    pt: 'Demonstração de Animação',
    de: 'Animations-Demo',
    fr: 'Démonstration d\'Animation',
    ru: 'Демонстрация анимации',
    ar: 'عرض الرسوم المتحركة',
    ja: 'アニメーションデモ',
    ko: '애니메이션 데모'
  }
};

// 語言列表
const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];

console.log('🔧 修復所有語言文件中缺失的翻譯key...\n');

let totalUpdated = 0;

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    let updated = false;
    let addedCount = 0;
    
    // 添加所有缺失的key
    Object.entries(missingKeys).forEach(([key, langTranslations]) => {
      if (!translations[key] && langTranslations[lang]) {
        translations[key] = langTranslations[lang];
        updated = true;
        addedCount++;
        console.log(`  ✓ ${lang}: ${key} = "${langTranslations[lang]}"`);
      }
    });
    
    if (updated) {
      // 按key排序
      const sortedTranslations = Object.keys(translations)
        .sort()
        .reduce((acc, key) => {
          acc[key] = translations[key];
          return acc;
        }, {});
      
      // 保存更新後的文件
      fs.writeFileSync(
        filePath,
        JSON.stringify(sortedTranslations, null, 2) + '\n',
        'utf8'
      );
      console.log(`✅ ${lang}.json: 添加了 ${addedCount} 個key\n`);
      totalUpdated++;
    } else {
      console.log(`⏭️  ${lang}.json: 無需更新\n`);
    }
  } catch (error) {
    console.error(`❌ 處理 ${lang}.json 時出錯:`, error.message);
  }
});

console.log(`\n✨ 完成！共更新了 ${totalUpdated} 個語言文件`);
