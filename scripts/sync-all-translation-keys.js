const fs = require('fs');
const path = require('path');

const languages = [
  'en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 
  'de', 'fr', 'ru', 'ar', 'ja', 'ko'
];

const l10nDir = path.join(__dirname, '..', 'l10n');

const enPath = path.join(l10nDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = Object.keys(enData);

console.log(`✓ English file has ${enKeys.length} keys`);

const missingTranslations = {
  'ar': {
    'account_settings': 'إعدادات الحساب',
    'login': 'تسجيل الدخول',
    'account_info': 'معلومات الحساب',
    'subscription_plan': 'خطة الاشتراك',
    'enter_referral_code': 'إدخال رمز الإحالة',
    'device_management': 'إدارة الأجهزة',
    'appearance_language': 'المظهر واللغة',
    'dark_mode': 'الوضع الداكن',
    'data_management': 'إدارة البيانات',
    'auto_backup': 'النسخ الاحتياطي التلقائي',
    'export_backup': 'تصدير النسخة الاحتياطية',
    'clear_cache': 'مسح ذاكرة التخزين المؤقت',
    'reset_data': 'إعادة تعيين البيانات',
    'smart_classification': 'التصنيف الذكي',
    'enable_auto_classification': 'تفعيل التصنيف التلقائي',
    'manage_classification_rules': 'إدارة قواعد التصنيف',
    'advanced_classification_settings': 'إعدادات التصنيف المتقدمة',
    'sync_settings': 'إعدادات المزامنة',
    'sync_service': 'خدمة المزامنة',
    'sync_frequency': 'تكرار المزامنة',
    'daily': 'يومياً',
    'in_app_voice_control': 'التحكم الصوتي داخل التطبيق',
    'siri_voice_assistant': 'مساعد Siri الصوتي',
    'shortcuts': 'الاختصارات',
    'quick_toggle': 'التبديل السريع',
    'custom_shortcuts': 'الاختصارات المخصصة',
    'notification_settings': 'إعدادات الإشعارات',
    'enable_notifications': 'تفعيل الإشعارات',
    'notification_types': 'أنواع الإشعارات',
    'push_frequency': 'تكرار الإشعارات',
    'privacy_security': 'الخصوصية والأمان',
    'biometric_lock': 'القفل البيومتري',
    'data_encryption': 'تشفير البيانات',
    'privacy_settings': 'إعدادات الخصوصية',
    'help_support': 'المساعدة والدعم',
    'faq': 'الأسئلة الشائعة',
    'contact_us': 'اتصل بنا',
    'tutorial': 'دليل الاستخدام',
    'report_problem': 'الإبلاغ عن مشكلة',
    'user_feedback': 'ملاحظات المستخدم',
    'version_info': 'معلومات الإصدار',
    'check_updates': 'التحقق من التحديثات',
    'enter_video_url': 'أدخل رابط الفيديو',
    'video_url': 'رابط الفيديو',
    'video_url_placeholder': 'https://example.com/video.mp4',
    'example_formats': 'أمثلة على التنسيقات',
    'example_direct_mp4': '• MP4 مباشر: https://example.com/video.mp4',
    'example_hls_stream': '• بث HLS: https://example.com/stream.m3u8',
    'example_youtube': '• يوتيوب: https://youtube.com/watch?v=...',
    'example_vimeo': '• فيميو: https://vimeo.com/...',
    'example_adult_sites': '• مواقع البالغين: مدعومة',
    'example_social_media': '• وسائل التواصل الاجتماعي: مدعومة',
    'download_video': 'تحميل الفيديو',
    'free_trial': 'تجربة مجانية',
    'voice_control_subtitle': 'تحكم في الفيديو باستخدام الأوامر الصوتية',
    'select_video': 'اختر فيديو',
    'select_video_subtitle': 'اختر ملف فيديو للبدء',
    'load_from_url': 'تحميل من رابط',
    'tap_to_speak': 'اضغط للتحدث',
    'always_listen': 'الاستماع دائماً',
    'commands_used': 'الأوامر المستخدمة',
    'monthly_limit': 'الحد الشهري',
    'upgrade_plan': 'ترقية الخطة',
    'available_commands': 'الأوامر المتاحة',
    'custom': 'مخصص',
    'commands': 'أوامر',
  }
};

languages.forEach(lang => {
  if (lang === 'en') return;
  
  const langPath = path.join(l10nDir, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = Object.keys(langData);
  
  const missing = enKeys.filter(key => !langKeys.includes(key));
  
  if (missing.length > 0) {
    console.log(`\n⚠ ${lang}.json is missing ${missing.length} keys:`);
    console.log(missing.slice(0, 10).join(', ') + (missing.length > 10 ? '...' : ''));
    
    missing.forEach(key => {
      if (missingTranslations[lang] && missingTranslations[lang][key]) {
        langData[key] = missingTranslations[lang][key];
      } else {
        langData[key] = enData[key];
      }
    });
    
    const sortedData = {};
    Object.keys(langData).sort().forEach(key => {
      sortedData[key] = langData[key];
    });
    
    fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2) + '\n', 'utf8');
    console.log(`✓ Updated ${lang}.json with ${missing.length} missing keys`);
  } else {
    console.log(`✓ ${lang}.json has all keys`);
  }
});

console.log('\n✅ Translation sync complete!');
