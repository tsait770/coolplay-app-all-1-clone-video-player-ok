const fs = require('fs');
const path = require('path');

const allMissingTranslations = {
  en: {
    "ACCOUNT_SETTINGS": "ACCOUNT SETTINGS",
    "APPEARANCE_LANGUAGE": "APPEARANCE & LANGUAGE",
    "DATA_MANAGEMENT": "DATA MANAGEMENT",
    "SMART_CLASSIFICATION": "SMART CLASSIFICATION",
    "SYNC_SETTINGS": "SYNC SETTINGS",
    "SHORTCUTS": "SHORTCUTS",
    "NOTIFICATION_SETTINGS": "NOTIFICATION SETTINGS",
    "PRIVACY_SECURITY": "PRIVACY & SECURITY",
    "HELP_SUPPORT": "HELP & SUPPORT"
  },
  "zh-TW": {
    "ACCOUNT_SETTINGS": "帳戶設定",
    "APPEARANCE_LANGUAGE": "外觀與語言",
    "DATA_MANAGEMENT": "資料管理",
    "SMART_CLASSIFICATION": "智慧分類",
    "SYNC_SETTINGS": "同步設定",
    "SHORTCUTS": "快捷鍵",
    "NOTIFICATION_SETTINGS": "通知設定",
    "PRIVACY_SECURITY": "隱私與安全",
    "HELP_SUPPORT": "幫助與支援"
  },
  "zh-CN": {
    "ACCOUNT_SETTINGS": "账户设置",
    "APPEARANCE_LANGUAGE": "外观与语言",
    "DATA_MANAGEMENT": "数据管理",
    "SMART_CLASSIFICATION": "智能分类",
    "SYNC_SETTINGS": "同步设置",
    "SHORTCUTS": "快捷键",
    "NOTIFICATION_SETTINGS": "通知设置",
    "PRIVACY_SECURITY": "隐私与安全",
    "HELP_SUPPORT": "帮助与支持"
  },
  es: {
    "ACCOUNT_SETTINGS": "CONFIGURACIÓN DE CUENTA",
    "APPEARANCE_LANGUAGE": "APARIENCIA E IDIOMA",
    "DATA_MANAGEMENT": "GESTIÓN DE DATOS",
    "SMART_CLASSIFICATION": "CLASIFICACIÓN INTELIGENTE",
    "SYNC_SETTINGS": "CONFIGURACIÓN DE SINCRONIZACIÓN",
    "SHORTCUTS": "ATAJOS",
    "NOTIFICATION_SETTINGS": "CONFIGURACIÓN DE NOTIFICACIONES",
    "PRIVACY_SECURITY": "PRIVACIDAD Y SEGURIDAD",
    "HELP_SUPPORT": "AYUDA Y SOPORTE"
  },
  "pt-BR": {
    "ACCOUNT_SETTINGS": "CONFIGURAÇÕES DA CONTA",
    "APPEARANCE_LANGUAGE": "APARÊNCIA E IDIOMA",
    "DATA_MANAGEMENT": "GERENCIAMENTO DE DADOS",
    "SMART_CLASSIFICATION": "CLASSIFICAÇÃO INTELIGENTE",
    "SYNC_SETTINGS": "CONFIGURAÇÕES DE SINCRONIZAÇÃO",
    "SHORTCUTS": "ATALHOS",
    "NOTIFICATION_SETTINGS": "CONFIGURAÇÕES DE NOTIFICAÇÃO",
    "PRIVACY_SECURITY": "PRIVACIDADE E SEGURANÇA",
    "HELP_SUPPORT": "AJUDA E SUPORTE"
  },
  pt: {
    "ACCOUNT_SETTINGS": "DEFINIÇÕES DA CONTA",
    "APPEARANCE_LANGUAGE": "APARÊNCIA E IDIOMA",
    "DATA_MANAGEMENT": "GESTÃO DE DADOS",
    "SMART_CLASSIFICATION": "CLASSIFICAÇÃO INTELIGENTE",
    "SYNC_SETTINGS": "DEFINIÇÕES DE SINCRONIZAÇÃO",
    "SHORTCUTS": "ATALHOS",
    "NOTIFICATION_SETTINGS": "DEFINIÇÕES DE NOTIFICAÇÃO",
    "PRIVACY_SECURITY": "PRIVACIDADE E SEGURANÇA",
    "HELP_SUPPORT": "AJUDA E SUPORTE"
  },
  de: {
    "ACCOUNT_SETTINGS": "KONTOEINSTELLUNGEN",
    "APPEARANCE_LANGUAGE": "ERSCHEINUNGSBILD & SPRACHE",
    "DATA_MANAGEMENT": "DATENVERWALTUNG",
    "SMART_CLASSIFICATION": "INTELLIGENTE KLASSIFIZIERUNG",
    "SYNC_SETTINGS": "SYNCHRONISIERUNGSEINSTELLUNGEN",
    "SHORTCUTS": "TASTENKOMBINATIONEN",
    "NOTIFICATION_SETTINGS": "BENACHRICHTIGUNGSEINSTELLUNGEN",
    "PRIVACY_SECURITY": "DATENSCHUTZ & SICHERHEIT",
    "HELP_SUPPORT": "HILFE & SUPPORT"
  },
  fr: {
    "ACCOUNT_SETTINGS": "PARAMÈTRES DU COMPTE",
    "APPEARANCE_LANGUAGE": "APPARENCE ET LANGUE",
    "DATA_MANAGEMENT": "GESTION DES DONNÉES",
    "SMART_CLASSIFICATION": "CLASSIFICATION INTELLIGENTE",
    "SYNC_SETTINGS": "PARAMÈTRES DE SYNCHRONISATION",
    "SHORTCUTS": "RACCOURCIS",
    "NOTIFICATION_SETTINGS": "PARAMÈTRES DE NOTIFICATION",
    "PRIVACY_SECURITY": "CONFIDENTIALITÉ ET SÉCURITÉ",
    "HELP_SUPPORT": "AIDE ET SUPPORT"
  },
  ru: {
    "ACCOUNT_SETTINGS": "НАСТРОЙКИ АККАУНТА",
    "APPEARANCE_LANGUAGE": "ВНЕШНИЙ ВИД И ЯЗЫК",
    "DATA_MANAGEMENT": "УПРАВЛЕНИЕ ДАННЫМИ",
    "SMART_CLASSIFICATION": "УМНАЯ КЛАССИФИКАЦИЯ",
    "SYNC_SETTINGS": "НАСТРОЙКИ СИНХРОНИЗАЦИИ",
    "SHORTCUTS": "ГОРЯЧИЕ КЛАВИШИ",
    "NOTIFICATION_SETTINGS": "НАСТРОЙКИ УВЕДОМЛЕНИЙ",
    "PRIVACY_SECURITY": "КОНФИДЕНЦИАЛЬНОСТЬ И БЕЗОПАСНОСТЬ",
    "HELP_SUPPORT": "ПОМОЩЬ И ПОДДЕРЖКА"
  },
  ar: {
    "ACCOUNT_SETTINGS": "إعدادات الحساب",
    "APPEARANCE_LANGUAGE": "المظهر واللغة",
    "DATA_MANAGEMENT": "إدارة البيانات",
    "SMART_CLASSIFICATION": "التصنيف الذكي",
    "SYNC_SETTINGS": "إعدادات المزامنة",
    "SHORTCUTS": "الاختصارات",
    "NOTIFICATION_SETTINGS": "إعدادات الإشعارات",
    "PRIVACY_SECURITY": "الخصوصية والأمان",
    "HELP_SUPPORT": "المساعدة والدعم"
  },
  ja: {
    "ACCOUNT_SETTINGS": "アカウント設定",
    "APPEARANCE_LANGUAGE": "外観と言語",
    "DATA_MANAGEMENT": "データ管理",
    "SMART_CLASSIFICATION": "スマート分類",
    "SYNC_SETTINGS": "同期設定",
    "SHORTCUTS": "ショートカット",
    "NOTIFICATION_SETTINGS": "通知設定",
    "PRIVACY_SECURITY": "プライバシーとセキュリティ",
    "HELP_SUPPORT": "ヘルプとサポート"
  },
  ko: {
    "ACCOUNT_SETTINGS": "계정 설정",
    "APPEARANCE_LANGUAGE": "외관 및 언어",
    "DATA_MANAGEMENT": "데이터 관리",
    "SMART_CLASSIFICATION": "스마트 분류",
    "SYNC_SETTINGS": "동기화 설정",
    "SHORTCUTS": "단축키",
    "NOTIFICATION_SETTINGS": "알림 설정",
    "PRIVACY_SECURITY": "개인정보 보호 및 보안",
    "HELP_SUPPORT": "도움말 및 지원"
  }
};

const l10nDir = path.join(process.cwd(), 'l10n');

console.log('🌍 Adding missing translations to all language files...\n');

Object.keys(allMissingTranslations).forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    let updated = false;
    Object.keys(allMissingTranslations[lang]).forEach(key => {
      if (!translations[key]) {
        translations[key] = allMissingTranslations[lang][key];
        updated = true;
        console.log(`  ✓ Added "${key}" to ${lang}.json`);
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf8');
      console.log(`✅ Updated ${lang}.json\n`);
    } else {
      console.log(`✓ No updates needed for ${lang}.json\n`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✅ Translation update complete! All 12 languages now have the missing keys.');
