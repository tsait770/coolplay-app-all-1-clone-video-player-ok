const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url || 'file://' + __filename);
const __dirname = path.dirname(__filename);

const newKeys = {
  "monthly": {
    "en": "Monthly",
    "zh-TW": "每月",
    "zh-CN": "每月",
    "es": "Mensual",
    "pt-BR": "Mensal",
    "pt": "Mensal",
    "de": "Monatlich",
    "fr": "Mensuel",
    "ru": "Ежемесячно",
    "ar": "شهرياً",
    "ja": "毎月",
    "ko": "월간"
  },
  "yearly": {
    "en": "Yearly",
    "zh-TW": "每年",
    "zh-CN": "每年",
    "es": "Anual",
    "pt-BR": "Anual",
    "pt": "Anual",
    "de": "Jährlich",
    "fr": "Annuel",
    "ru": "Ежегодно",
    "ar": "سنوياً",
    "ja": "年間",
    "ko": "연간"
  },
  "save_25_percent": {
    "en": "Save 25%",
    "zh-TW": "節省 25%",
    "zh-CN": "节省 25%",
    "es": "Ahorra 25%",
    "pt-BR": "Economize 25%",
    "pt": "Poupe 25%",
    "de": "Spare 25%",
    "fr": "Économisez 25%",
    "ru": "Сэкономьте 25%",
    "ar": "وفر 25%",
    "ja": "25%節約",
    "ko": "25% 절약"
  },
  "most_popular": {
    "en": "MOST POPULAR",
    "zh-TW": "最受歡迎",
    "zh-CN": "最受欢迎",
    "es": "MÁS POPULAR",
    "pt-BR": "MAIS POPULAR",
    "pt": "MAIS POPULAR",
    "de": "AM BELIEBTESTEN",
    "fr": "LE PLUS POPULAIRE",
    "ru": "САМЫЙ ПОПУЛЯРНЫЙ",
    "ar": "الأكثر شعبية",
    "ja": "最も人気",
    "ko": "가장 인기"
  },
  "best_value": {
    "en": "BEST VALUE",
    "zh-TW": "最超值",
    "zh-CN": "最超值",
    "es": "MEJOR VALOR",
    "pt-BR": "MELHOR VALOR",
    "pt": "MELHOR VALOR",
    "de": "BESTER WERT",
    "fr": "MEILLEURE VALEUR",
    "ru": "ЛУЧШАЯ ЦЕНА",
    "ar": "أفضل قيمة",
    "ja": "最高の価値",
    "ko": "최고 가치"
  },
  "save_per_year": {
    "en": "Save {amount} per year",
    "zh-TW": "每年節省 {amount}",
    "zh-CN": "每年节省 {amount}",
    "es": "Ahorra {amount} por año",
    "pt-BR": "Economize {amount} por ano",
    "pt": "Poupe {amount} por ano",
    "de": "Spare {amount} pro Jahr",
    "fr": "Économisez {amount} par an",
    "ru": "Сэкономьте {amount} в год",
    "ar": "وفر {amount} سنوياً",
    "ja": "年間{amount}節約",
    "ko": "연간 {amount} 절약"
  },
  "subscribe": {
    "en": "Subscribe",
    "zh-TW": "訂閱",
    "zh-CN": "订阅",
    "es": "Suscribirse",
    "pt-BR": "Assinar",
    "pt": "Subscrever",
    "de": "Abonnieren",
    "fr": "S'abonner",
    "ru": "Подписаться",
    "ar": "اشترك",
    "ja": "購読する",
    "ko": "구독하기"
  },
  "cancel_subscription": {
    "en": "Cancel Subscription",
    "zh-TW": "取消訂閱",
    "zh-CN": "取消订阅",
    "es": "Cancelar Suscripción",
    "pt-BR": "Cancelar Assinatura",
    "pt": "Cancelar Subscrição",
    "de": "Abonnement Kündigen",
    "fr": "Annuler l'Abonnement",
    "ru": "Отменить Подписку",
    "ar": "إلغاء الاشتراك",
    "ja": "サブスクリプションをキャンセル",
    "ko": "구독 취소"
  },
  "renews_on": {
    "en": "Renews on",
    "zh-TW": "續訂於",
    "zh-CN": "续订于",
    "es": "Se renueva el",
    "pt-BR": "Renova em",
    "pt": "Renova em",
    "de": "Verlängert am",
    "fr": "Renouvelle le",
    "ru": "Продлевается",
    "ar": "يتجدد في",
    "ja": "更新日",
    "ko": "갱신일"
  },
  "unlock_premium_features": {
    "en": "Unlock unlimited video playback and premium features",
    "zh-TW": "解鎖無限影片播放和高級功能",
    "zh-CN": "解锁无限视频播放和高级功能",
    "es": "Desbloquea reproducción ilimitada y funciones premium",
    "pt-BR": "Desbloqueie reprodução ilimitada e recursos premium",
    "pt": "Desbloqueie reprodução ilimitada e recursos premium",
    "de": "Unbegrenzte Videowiedergabe und Premium-Funktionen freischalten",
    "fr": "Débloquez la lecture vidéo illimitée et les fonctionnalités premium",
    "ru": "Разблокируйте неограниченное воспроизведение видео и премиум-функции",
    "ar": "افتح تشغيل الفيديو غير المحدود والميزات المميزة",
    "ja": "無制限の動画再生とプレミアム機能をアンロック",
    "ko": "무제한 비디오 재생 및 프리미엄 기능 잠금 해제"
  },
  "free_tier_info": {
    "en": "Free tier: 2000 uses on first login + 30 uses daily",
    "zh-TW": "免費方案：首次登入 2000 次使用 + 每日 30 次",
    "zh-CN": "免费方案：首次登录 2000 次使用 + 每日 30 次",
    "es": "Plan gratuito: 2000 usos en el primer inicio de sesión + 30 usos diarios",
    "pt-BR": "Plano gratuito: 2000 usos no primeiro login + 30 usos diários",
    "pt": "Plano gratuito: 2000 utilizações no primeiro login + 30 utilizações diárias",
    "de": "Kostenloser Plan: 2000 Nutzungen bei erster Anmeldung + 30 Nutzungen täglich",
    "fr": "Plan gratuit : 2000 utilisations à la première connexion + 30 utilisations quotidiennes",
    "ru": "Бесплатный план: 2000 использований при первом входе + 30 использований ежедневно",
    "ar": "الخطة المجانية: 2000 استخدام عند أول تسجيل دخول + 30 استخدام يومياً",
    "ja": "無料プラン：初回ログイン時2000回 + 毎日30回",
    "ko": "무료 플랜: 첫 로그인 시 2000회 + 매일 30회"
  },
  "paid_plans_info": {
    "en": "All paid plans start with 2000 bonus uses. Cancel anytime.",
    "zh-TW": "所有付費方案均以 2000 次獎勵使用開始。隨時取消。",
    "zh-CN": "所有付费方案均以 2000 次奖励使用开始。随时取消。",
    "es": "Todos los planes pagos comienzan con 2000 usos de bonificación. Cancela en cualquier momento.",
    "pt-BR": "Todos os planos pagos começam com 2000 usos bônus. Cancele a qualquer momento.",
    "pt": "Todos os planos pagos começam com 2000 utilizações bónus. Cancele a qualquer momento.",
    "de": "Alle bezahlten Pläne beginnen mit 2000 Bonus-Nutzungen. Jederzeit kündbar.",
    "fr": "Tous les plans payants commencent avec 2000 utilisations bonus. Annulez à tout moment.",
    "ru": "Все платные планы начинаются с 2000 бонусных использований. Отмените в любое время.",
    "ar": "تبدأ جميع الخطط المدفوعة بـ 2000 استخدام إضافي. يمكن الإلغاء في أي وقت.",
    "ja": "すべての有料プランは2000回のボーナス使用から始まります。いつでもキャンセル可能。",
    "ko": "모든 유료 플랜은 2000회 보너스 사용으로 시작합니다. 언제든지 취소 가능."
  }
};

const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];
const l10nDir = path.join(__dirname, '..', 'l10n');

console.log('📝 Adding subscription translation keys...\n');

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    let addedCount = 0;
    Object.keys(newKeys).forEach(key => {
      if (!translations[key]) {
        translations[key] = newKeys[key][lang];
        addedCount++;
      }
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf8');
    console.log(`✅ ${lang}.json - Added ${addedCount} new keys`);
    
  } catch (error) {
    console.error(`❌ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✅ Subscription translations added successfully!');
