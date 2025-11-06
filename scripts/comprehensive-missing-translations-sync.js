const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url || 'file://' + __filename);
const __dirname = path.dirname(__filename);
const l10nDir = path.join(__dirname, '..', 'l10n');

const missingKeys = {
  // Home Page
  free_trial: {
    en: "Free Trial",
    "zh-TW": "免費試用",
    "zh-CN": "免费试用",
    es: "Prueba Gratuita",
    "pt-BR": "Teste Gratuito",
    pt: "Teste Gratuito",
    de: "Kostenlose Testversion",
    fr: "Essai Gratuit",
    ru: "Бесплатная пробная версия",
    ar: "تجربة مجانية",
    ja: "無料トライアル",
    ko: "무료 체험"
  },

  // Voice Control Page
  voice_control_subtitle: {
    en: "Control your video with voice commands",
    "zh-TW": "使用語音指令控制影片",
    "zh-CN": "使用语音指令控制视频",
    es: "Controla tu video con comandos de voz",
    "pt-BR": "Controle seu vídeo com comandos de voz",
    pt: "Controle o seu vídeo com comandos de voz",
    de: "Steuern Sie Ihr Video mit Sprachbefehlen",
    fr: "Contrôlez votre vidéo avec des commandes vocales",
    ru: "Управляйте видео голосовыми командами",
    ar: "تحكم في الفيديو باستخدام الأوامر الصوتية",
    ja: "音声コマンドでビデオを制御",
    ko: "음성 명령으로 비디오 제어"
  },

  select_video: {
    en: "Select Video",
    "zh-TW": "選擇影片",
    "zh-CN": "选择视频",
    es: "Seleccionar Video",
    "pt-BR": "Selecionar Vídeo",
    pt: "Selecionar Vídeo",
    de: "Video Auswählen",
    fr: "Sélectionner une Vidéo",
    ru: "Выбрать видео",
    ar: "اختر فيديو",
    ja: "ビデオを選択",
    ko: "비디오 선택"
  },

  select_video_subtitle: {
    en: "Choose a video file to start",
    "zh-TW": "選擇視頻文件開始播放",
    "zh-CN": "选择视频文件开始播放",
    es: "Elige un archivo de video para comenzar",
    "pt-BR": "Escolha um arquivo de vídeo para começar",
    pt: "Escolha um ficheiro de vídeo para começar",
    de: "Wählen Sie eine Videodatei zum Starten",
    fr: "Choisissez un fichier vidéo pour commencer",
    ru: "Выберите видеофайл для начала",
    ar: "اختر ملف فيديو للبدء",
    ja: "開始するビデオファイルを選択",
    ko: "시작할 비디오 파일 선택"
  },

  load_from_url: {
    en: "Load from URL",
    "zh-TW": "從網址載入",
    "zh-CN": "从网址加载",
    es: "Cargar desde URL",
    "pt-BR": "Carregar de URL",
    pt: "Carregar de URL",
    de: "Von URL Laden",
    fr: "Charger depuis l'URL",
    ru: "Загрузить по URL",
    ar: "تحميل من رابط",
    ja: "URLから読み込む",
    ko: "URL에서 로드"
  },

  // Voice Control Expanded
  tap_to_speak: {
    en: "Tap to Speak",
    "zh-TW": "點擊說話",
    "zh-CN": "点击说话",
    es: "Toca para Hablar",
    "pt-BR": "Toque para Falar",
    pt: "Toque para Falar",
    de: "Tippen zum Sprechen",
    fr: "Appuyez pour Parler",
    ru: "Нажмите, чтобы говорить",
    ar: "اضغط للتحدث",
    ja: "タップして話す",
    ko: "탭하여 말하기"
  },

  always_listen: {
    en: "Always Listen",
    "zh-TW": "持續聆聽",
    "zh-CN": "持续聆听",
    es: "Escuchar Siempre",
    "pt-BR": "Sempre Ouvir",
    pt: "Sempre Ouvir",
    de: "Immer Zuhören",
    fr: "Toujours Écouter",
    ru: "Всегда слушать",
    ar: "الاستماع دائماً",
    ja: "常に聞く",
    ko: "항상 듣기"
  },

  commands_used: {
    en: "Commands Used",
    "zh-TW": "已使用次數",
    "zh-CN": "已使用次数",
    es: "Comandos Usados",
    "pt-BR": "Comandos Usados",
    pt: "Comandos Usados",
    de: "Verwendete Befehle",
    fr: "Commandes Utilisées",
    ru: "Использовано команд",
    ar: "الأوامر المستخدمة",
    ja: "使用したコマンド",
    ko: "사용된 명령"
  },

  monthly_limit: {
    en: "Monthly Limit",
    "zh-TW": "每月限制",
    "zh-CN": "每月限制",
    es: "Límite Mensual",
    "pt-BR": "Limite Mensal",
    pt: "Limite Mensal",
    de: "Monatliches Limit",
    fr: "Limite Mensuelle",
    ru: "Месячный лимит",
    ar: "الحد الشهري",
    ja: "月間制限",
    ko: "월간 한도"
  },

  upgrade_plan: {
    en: "Upgrade Plan",
    "zh-TW": "升級方案",
    "zh-CN": "升级方案",
    es: "Actualizar Plan",
    "pt-BR": "Atualizar Plano",
    pt: "Atualizar Plano",
    de: "Plan Upgraden",
    fr: "Mettre à Niveau le Plan",
    ru: "Обновить план",
    ar: "ترقية الخطة",
    ja: "プランをアップグレード",
    ko: "플랜 업그레이드"
  },

  available_commands: {
    en: "Available Commands",
    "zh-TW": "可用指令",
    "zh-CN": "可用指令",
    es: "Comandos Disponibles",
    "pt-BR": "Comandos Disponíveis",
    pt: "Comandos Disponíveis",
    de: "Verfügbare Befehle",
    fr: "Commandes Disponibles",
    ru: "Доступные команды",
    ar: "الأوامر المتاحة",
    ja: "利用可能なコマンド",
    ko: "사용 가능한 명령"
  },

  custom: {
    en: "Custom",
    "zh-TW": "自訂",
    "zh-CN": "自定义",
    es: "Personalizado",
    "pt-BR": "Personalizado",
    pt: "Personalizado",
    de: "Benutzerdefiniert",
    fr: "Personnalisé",
    ru: "Пользовательский",
    ar: "مخصص",
    ja: "カスタム",
    ko: "사용자 정의"
  },

  // Voice Command Details
  next_example: {
    en: "\"next video\"",
    "zh-TW": "「下一部」",
    "zh-CN": "「下一个」",
    es: "\"siguiente video\"",
    "pt-BR": "\"próximo vídeo\"",
    pt: "\"próximo vídeo\"",
    de: "\"nächstes Video\"",
    fr: "\"vidéo suivante\"",
    ru: "\"следующее видео\"",
    ar: "\"الفيديو التالي\"",
    ja: "「次の動画」",
    ko: "\"다음 비디오\""
  },

  previous_example: {
    en: "\"previous video\"",
    "zh-TW": "「上一部」",
    "zh-CN": "「上一个」",
    es: "\"video anterior\"",
    "pt-BR": "\"vídeo anterior\"",
    pt: "\"vídeo anterior\"",
    de: "\"vorheriges Video\"",
    fr: "\"vidéo précédente\"",
    ru: "\"предыдущее видео\"",
    ar: "\"الفيديو السابق\"",
    ja: "「前の動画」",
    ko: "\"이전 비디오\""
  },

  replay: {
    en: "Replay",
    "zh-TW": "重播",
    "zh-CN": "重播",
    es: "Repetir",
    "pt-BR": "Repetir",
    pt: "Repetir",
    de: "Wiederholen",
    fr: "Rejouer",
    ru: "Повторить",
    ar: "إعادة التشغيل",
    ja: "リプレイ",
    ko: "다시 재생"
  },

  replay_example: {
    en: "\"replay video\"",
    "zh-TW": "「重播」",
    "zh-CN": "「重播」",
    es: "\"repetir video\"",
    "pt-BR": "\"repetir vídeo\"",
    pt: "\"repetir vídeo\"",
    de: "\"Video wiederholen\"",
    fr: "\"rejouer la vidéo\"",
    ru: "\"повторить видео\"",
    ar: "\"إعادة تشغيل الفيديو\"",
    ja: "「動画を再生」",
    ko: "\"비디오 다시 재생\""
  },

  // Playback Speed
  speed_0_5: {
    en: "0.5x Speed",
    "zh-TW": "0.5 倍速",
    "zh-CN": "0.5 倍速",
    es: "Velocidad 0.5x",
    "pt-BR": "Velocidade 0.5x",
    pt: "Velocidade 0.5x",
    de: "0.5x Geschwindigkeit",
    fr: "Vitesse 0.5x",
    ru: "Скорость 0.5x",
    ar: "سرعة 0.5",
    ja: "0.5倍速",
    ko: "0.5배속"
  },

  speed_0_5_example: {
    en: "\"half speed\"",
    "zh-TW": "「0.5倍速」",
    "zh-CN": "「0.5倍速」",
    es: "\"media velocidad\"",
    "pt-BR": "\"meia velocidade\"",
    pt: "\"meia velocidade\"",
    de: "\"halbe Geschwindigkeit\"",
    fr: "\"demi-vitesse\"",
    ru: "\"половинная скорость\"",
    ar: "\"نصف السرعة\"",
    ja: "「半分の速度」",
    ko: "\"반속도\""
  },

  normal_speed_example: {
    en: "\"normal speed\"",
    "zh-TW": "「正常速度」",
    "zh-CN": "「正常速度\"",
    es: "\"velocidad normal\"",
    "pt-BR": "\"velocidade normal\"",
    pt: "\"velocidade normal\"",
    de: "\"normale Geschwindigkeit\"",
    fr: "\"vitesse normale\"",
    ru: "\"нормальная скорость\"",
    ar: "\"السرعة العادية\"",
    ja: "「通常速度」",
    ko: "\"정상 속도\""
  },

  speed_1_25: {
    en: "1.25x Speed",
    "zh-TW": "1.25 倍速",
    "zh-CN": "1.25 倍速",
    es: "Velocidad 1.25x",
    "pt-BR": "Velocidade 1.25x",
    pt: "Velocidade 1.25x",
    de: "1.25x Geschwindigkeit",
    fr: "Vitesse 1.25x",
    ru: "Скорость 1.25x",
    ar: "سرعة 1.25",
    ja: "1.25倍速",
    ko: "1.25배속"
  },

  speed_1_25_example: {
    en: "\"1.25x speed\"",
    "zh-TW": "「1.25倍速」",
    "zh-CN": "「1.25倍速」",
    es: "\"velocidad 1.25\"",
    "pt-BR": "\"velocidade 1.25\"",
    pt: "\"velocidade 1.25\"",
    de: "\"1.25-fache Geschwindigkeit\"",
    fr: "\"vitesse 1.25\"",
    ru: "\"скорость 1.25\"",
    ar: "\"سرعة 1.25\"",
    ja: "「1.25倍速」",
    ko: "\"1.25배속\""
  },

  speed_1_5: {
    en: "1.5x Speed",
    "zh-TW": "1.5 倍速",
    "zh-CN": "1.5 倍速",
    es: "Velocidad 1.5x",
    "pt-BR": "Velocidade 1.5x",
    pt: "Velocidade 1.5x",
    de: "1.5x Geschwindigkeit",
    fr: "Vitesse 1.5x",
    ru: "Скорость 1.5x",
    ar: "سرعة 1.5",
    ja: "1.5倍速",
    ko: "1.5배속"
  },

  speed_1_5_example: {
    en: "\"1.5x speed\"",
    "zh-TW": "「1.5倍速」",
    "zh-CN": "「1.5倍速」",
    es: "\"velocidad 1.5\"",
    "pt-BR": "\"velocidade 1.5\"",
    pt: "\"velocidade 1.5\"",
    de: "\"1.5-fache Geschwindigkeit\"",
    fr: "\"vitesse 1.5\"",
    ru: "\"скорость 1.5\"",
    ar: "\"سرعة 1.5\"",
    ja: "「1.5倍速」",
    ko: "\"1.5배속\""
  },

  speed_2_0_example: {
    en: "\"double speed\"",
    "zh-TW": "「兩倍速」",
    "zh-CN": "「两倍速」",
    es: "\"doble velocidad\"",
    "pt-BR": "\"velocidade dupla\"",
    pt: "\"velocidade dupla\"",
    de: "\"doppelte Geschwindigkeit\"",
    fr: "\"double vitesse\"",
    ru: "\"двойная скорость\"",
    ar: "\"ضعف السرعة\"",
    ja: "「倍速」",
    ko: "\"2배속\""
  },

  // Settings Page
  ACCOUNT_SETTINGS: {
    en: "ACCOUNT SETTINGS",
    "zh-TW": "帳戶設定",
    "zh-CN": "账户设置",
    es: "CONFIGURACIÓN DE CUENTA",
    "pt-BR": "CONFIGURAÇÕES DA CONTA",
    pt: "DEFINIÇÕES DA CONTA",
    de: "KONTOEINSTELLUNGEN",
    fr: "PARAMÈTRES DU COMPTE",
    ru: "НАСТРОЙКИ АККАУНТА",
    ar: "إعدادات الحساب",
    ja: "アカウント設定",
    ko: "계정 설정"
  },

  login: {
    en: "Login",
    "zh-TW": "登入",
    "zh-CN": "登录",
    es: "Iniciar Sesión",
    "pt-BR": "Entrar",
    pt: "Entrar",
    de: "Anmelden",
    fr: "Connexion",
    ru: "Войти",
    ar: "تسجيل الدخول",
    ja: "ログイン",
    ko: "로그인"
  },

  account_info: {
    en: "Account Information",
    "zh-TW": "帳號資訊",
    "zh-CN": "账号信息",
    es: "Información de la Cuenta",
    "pt-BR": "Informações da Conta",
    pt: "Informações da Conta",
    de: "Kontoinformationen",
    fr: "Informations du Compte",
    ru: "Информация об аккаунте",
    ar: "معلومات الحساب",
    ja: "アカウント情報",
    ko: "계정 정보"
  },

  subscription_plan: {
    en: "Subscription Plan",
    "zh-TW": "訂閱方案",
    "zh-CN": "订阅方案",
    es: "Plan de Suscripción",
    "pt-BR": "Plano de Assinatura",
    pt: "Plano de Subscrição",
    de: "Abonnementplan",
    fr: "Plan d'Abonnement",
    ru: "План подписки",
    ar: "خطة الاشتراك",
    ja: "サブスクリプションプラン",
    ko: "구독 플랜"
  },

  enter_referral_code: {
    en: "Enter Referral Code",
    "zh-TW": "輸入優惠碼",
    "zh-CN": "输入优惠码",
    es: "Ingresar Código de Referencia",
    "pt-BR": "Inserir Código de Indicação",
    pt: "Inserir Código de Referência",
    de: "Empfehlungscode Eingeben",
    fr: "Entrer le Code de Parrainage",
    ru: "Введите реферальный код",
    ar: "إدخال رمز الإحالة",
    ja: "紹介コードを入力",
    ko: "추천 코드 입력"
  },

  device_management: {
    en: "Device Management",
    "zh-TW": "裝置管理",
    "zh-CN": "设备管理",
    es: "Gestión de Dispositivos",
    "pt-BR": "Gerenciamento de Dispositivos",
    pt: "Gestão de Dispositivos",
    de: "Geräteverwaltung",
    fr: "Gestion des Appareils",
    ru: "Управление устройствами",
    ar: "إدارة الأجهزة",
    ja: "デバイス管理",
    ko: "기기 관리"
  },

  APPEARANCE_LANGUAGE: {
    en: "APPEARANCE & LANGUAGE",
    "zh-TW": "外觀與語言",
    "zh-CN": "外观与语言",
    es: "APARIENCIA E IDIOMA",
    "pt-BR": "APARÊNCIA E IDIOMA",
    pt: "APARÊNCIA E IDIOMA",
    de: "ERSCHEINUNGSBILD & SPRACHE",
    fr: "APPARENCE ET LANGUE",
    ru: "ВНЕШНИЙ ВИД И ЯЗЫК",
    ar: "المظهر واللغة",
    ja: "外観と言語",
    ko: "외관 및 언어"
  },

  dark_mode: {
    en: "Dark Mode",
    "zh-TW": "深色模式",
    "zh-CN": "深色模式",
    es: "Modo Oscuro",
    "pt-BR": "Modo Escuro",
    pt: "Modo Escuro",
    de: "Dunkelmodus",
    fr: "Mode Sombre",
    ru: "Темный режим",
    ar: "الوضع الداكن",
    ja: "ダークモード",
    ko: "다크 모드"
  },

  DATA_MANAGEMENT: {
    en: "DATA MANAGEMENT",
    "zh-TW": "資料管理",
    "zh-CN": "数据管理",
    es: "GESTIÓN DE DATOS",
    "pt-BR": "GERENCIAMENTO DE DADOS",
    pt: "GESTÃO DE DADOS",
    de: "DATENVERWALTUNG",
    fr: "GESTION DES DONNÉES",
    ru: "УПРАВЛЕНИЕ ДАННЫМИ",
    ar: "إدارة البيانات",
    ja: "データ管理",
    ko: "데이터 관리"
  },

  auto_backup: {
    en: "Auto Backup",
    "zh-TW": "自動備份",
    "zh-CN": "自动备份",
    es: "Copia de Seguridad Automática",
    "pt-BR": "Backup Automático",
    pt: "Cópia de Segurança Automática",
    de: "Automatisches Backup",
    fr: "Sauvegarde Automatique",
    ru: "Автоматическое резервное копирование",
    ar: "النسخ الاحتياطي التلقائي",
    ja: "自動バックアップ",
    ko: "자동 백업"
  },

  export_backup: {
    en: "Export Backup",
    "zh-TW": "匯出備份",
    "zh-CN": "导出备份",
    es: "Exportar Copia de Seguridad",
    "pt-BR": "Exportar Backup",
    pt: "Exportar Cópia de Segurança",
    de: "Backup Exportieren",
    fr: "Exporter la Sauvegarde",
    ru: "Экспортировать резервную копию",
    ar: "تصدير النسخة الاحتياطية",
    ja: "バックアップをエクスポート",
    ko: "백업 내보내기"
  },

  clear_cache: {
    en: "Clear Cache",
    "zh-TW": "清除快取",
    "zh-CN": "清除缓存",
    es: "Borrar Caché",
    "pt-BR": "Limpar Cache",
    pt: "Limpar Cache",
    de: "Cache Leeren",
    fr: "Vider le Cache",
    ru: "Очистить кэш",
    ar: "مسح ذاكرة التخزين المؤقت",
    ja: "キャッシュをクリア",
    ko: "캐시 지우기"
  },

  reset_data: {
    en: "Reset Data",
    "zh-TW": "重置資料",
    "zh-CN": "重置数据",
    es: "Restablecer Datos",
    "pt-BR": "Redefinir Dados",
    pt: "Redefinir Dados",
    de: "Daten Zurücksetzen",
    fr: "Réinitialiser les Données",
    ru: "Сбросить данные",
    ar: "إعادة تعيين البيانات",
    ja: "データをリセット",
    ko: "데이터 재설정"
  },

  SMART_CLASSIFICATION: {
    en: "SMART CLASSIFICATION",
    "zh-TW": "智慧分類",
    "zh-CN": "智能分类",
    es: "CLASIFICACIÓN INTELIGENTE",
    "pt-BR": "CLASSIFICAÇÃO INTELIGENTE",
    pt: "CLASSIFICAÇÃO INTELIGENTE",
    de: "INTELLIGENTE KLASSIFIZIERUNG",
    fr: "CLASSIFICATION INTELLIGENTE",
    ru: "УМНАЯ КЛАССИФИКАЦИЯ",
    ar: "التصنيف الذكي",
    ja: "スマート分類",
    ko: "스마트 분류"
  },

  enable_auto_classification: {
    en: "Enable Auto Classification",
    "zh-TW": "啟用自動分類",
    "zh-CN": "启用自动分类",
    es: "Habilitar Clasificación Automática",
    "pt-BR": "Ativar Classificação Automática",
    pt: "Ativar Classificação Automática",
    de: "Automatische Klassifizierung Aktivieren",
    fr: "Activer la Classification Automatique",
    ru: "Включить автоматическую классификацию",
    ar: "تفعيل التصنيف التلقائي",
    ja: "自動分類を有効にする",
    ko: "자동 분류 활성화"
  },

  manage_classification_rules: {
    en: "Manage Classification Rules",
    "zh-TW": "管理分類規則",
    "zh-CN": "管理分类规则",
    es: "Gestionar Reglas de Clasificación",
    "pt-BR": "Gerenciar Regras de Classificação",
    pt: "Gerir Regras de Classificação",
    de: "Klassifizierungsregeln Verwalten",
    fr: "Gérer les Règles de Classification",
    ru: "Управление правилами классификации",
    ar: "إدارة قواعد التصنيف",
    ja: "分類ルールを管理",
    ko: "분류 규칙 관리"
  },

  advanced_classification_settings: {
    en: "Advanced Classification Settings",
    "zh-TW": "進階分類設定",
    "zh-CN": "高级分类设置",
    es: "Configuración Avanzada de Clasificación",
    "pt-BR": "Configurações Avançadas de Classificação",
    pt: "Definições Avançadas de Classificação",
    de: "Erweiterte Klassifizierungseinstellungen",
    fr: "Paramètres Avancés de Classification",
    ru: "Расширенные настройки классификации",
    ar: "إعدادات التصنيف المتقدمة",
    ja: "高度な分類設定",
    ko: "고급 분류 설정"
  },

  SYNC_SETTINGS: {
    en: "SYNC SETTINGS",
    "zh-TW": "同步設定",
    "zh-CN": "同步设置",
    es: "CONFIGURACIÓN DE SINCRONIZACIÓN",
    "pt-BR": "CONFIGURAÇÕES DE SINCRONIZAÇÃO",
    pt: "DEFINIÇÕES DE SINCRONIZAÇÃO",
    de: "SYNCHRONISIERUNGSEINSTELLUNGEN",
    fr: "PARAMÈTRES DE SYNCHRONISATION",
    ru: "НАСТРОЙКИ СИНХРОНИЗАЦИИ",
    ar: "إعدادات المزامنة",
    ja: "同期設定",
    ko: "동기화 설정"
  },

  sync_service: {
    en: "Sync Service",
    "zh-TW": "同步服務",
    "zh-CN": "同步服务",
    es: "Servicio de Sincronización",
    "pt-BR": "Serviço de Sincronização",
    pt: "Serviço de Sincronização",
    de: "Synchronisierungsdienst",
    fr: "Service de Synchronisation",
    ru: "Служба синхронизации",
    ar: "خدمة المزامنة",
    ja: "同期サービス",
    ko: "동기화 서비스"
  },

  sync_frequency: {
    en: "Sync Frequency",
    "zh-TW": "同步頻率",
    "zh-CN": "同步频率",
    es: "Frecuencia de Sincronización",
    "pt-BR": "Frequência de Sincronização",
    pt: "Frequência de Sincronização",
    de: "Synchronisierungsfrequenz",
    fr: "Fréquence de Synchronisation",
    ru: "Частота синхронизации",
    ar: "تكرار المزامنة",
    ja: "同期頻度",
    ko: "동기화 빈도"
  },

  daily: {
    en: "Daily",
    "zh-TW": "每日",
    "zh-CN": "每日",
    es: "Diario",
    "pt-BR": "Diário",
    pt: "Diário",
    de: "Täglich",
    fr: "Quotidien",
    ru: "Ежедневно",
    ar: "يومياً",
    ja: "毎日",
    ko: "매일"
  },

  in_app_voice_control: {
    en: "In-app Voice Control",
    "zh-TW": "應用內語音控制",
    "zh-CN": "应用内语音控制",
    es: "Control de Voz en la Aplicación",
    "pt-BR": "Controle de Voz no Aplicativo",
    pt: "Controlo de Voz na Aplicação",
    de: "In-App-Sprachsteuerung",
    fr: "Contrôle Vocal dans l'Application",
    ru: "Голосовое управление в приложении",
    ar: "التحكم الصوتي داخل التطبيق",
    ja: "アプリ内音声制御",
    ko: "앱 내 음성 제어"
  },

  siri_voice_assistant: {
    en: "Siri Voice Assistant",
    "zh-TW": "Siri 語音助手",
    "zh-CN": "Siri 语音助手",
    es: "Asistente de Voz Siri",
    "pt-BR": "Assistente de Voz Siri",
    pt: "Assistente de Voz Siri",
    de: "Siri Sprachassistent",
    fr: "Assistant Vocal Siri",
    ru: "Голосовой помощник Siri",
    ar: "مساعد Siri الصوتي",
    ja: "Siri音声アシスタント",
    ko: "Siri 음성 비서"
  },

  SHORTCUTS: {
    en: "SHORTCUTS",
    "zh-TW": "快捷鍵",
    "zh-CN": "快捷键",
    es: "ATAJOS",
    "pt-BR": "ATALHOS",
    pt: "ATALHOS",
    de: "VERKNÜPFUNGEN",
    fr: "RACCOURCIS",
    ru: "ЯРЛЫКИ",
    ar: "الاختصارات",
    ja: "ショートカット",
    ko: "단축키"
  },

  quick_toggle: {
    en: "Quick Toggle",
    "zh-TW": "快速切換",
    "zh-CN": "快速切换",
    es: "Cambio Rápido",
    "pt-BR": "Alternância Rápida",
    pt: "Alternância Rápida",
    de: "Schnellumschaltung",
    fr: "Basculement Rapide",
    ru: "Быстрое переключение",
    ar: "التبديل السريع",
    ja: "クイックトグル",
    ko: "빠른 전환"
  },

  custom_shortcuts: {
    en: "Custom Shortcuts",
    "zh-TW": "自訂快捷鍵",
    "zh-CN": "自定义快捷键",
    es: "Atajos Personalizados",
    "pt-BR": "Atalhos Personalizados",
    pt: "Atalhos Personalizados",
    de: "Benutzerdefinierte Verknüpfungen",
    fr: "Raccourcis Personnalisés",
    ru: "Пользовательские ярлыки",
    ar: "الاختصارات المخصصة",
    ja: "カスタムショートカット",
    ko: "사용자 정의 단축키"
  },

  NOTIFICATION_SETTINGS: {
    en: "NOTIFICATION SETTINGS",
    "zh-TW": "通知設定",
    "zh-CN": "通知设置",
    es: "CONFIGURACIÓN DE NOTIFICACIONES",
    "pt-BR": "CONFIGURAÇÕES DE NOTIFICAÇÃO",
    pt: "DEFINIÇÕES DE NOTIFICAÇÃO",
    de: "BENACHRICHTIGUNGSEINSTELLUNGEN",
    fr: "PARAMÈTRES DE NOTIFICATION",
    ru: "НАСТРОЙКИ УВЕДОМЛЕНИЙ",
    ar: "إعدادات الإشعارات",
    ja: "通知設定",
    ko: "알림 설정"
  },

  enable_notifications: {
    en: "Enable Notifications",
    "zh-TW": "啟用通知",
    "zh-CN": "启用通知",
    es: "Habilitar Notificaciones",
    "pt-BR": "Ativar Notificações",
    pt: "Ativar Notificações",
    de: "Benachrichtigungen Aktivieren",
    fr: "Activer les Notifications",
    ru: "Включить уведомления",
    ar: "تفعيل الإشعارات",
    ja: "通知を有効にする",
    ko: "알림 활성화"
  },

  notification_types: {
    en: "Notification Types",
    "zh-TW": "通知類型",
    "zh-CN": "通知类型",
    es: "Tipos de Notificación",
    "pt-BR": "Tipos de Notificação",
    pt: "Tipos de Notificação",
    de: "Benachrichtigungstypen",
    fr: "Types de Notification",
    ru: "Типы уведомлений",
    ar: "أنواع الإشعارات",
    ja: "通知タイプ",
    ko: "알림 유형"
  },

  push_frequency: {
    en: "Push Frequency",
    "zh-TW": "推送頻率",
    "zh-CN": "推送频率",
    es: "Frecuencia de Notificaciones",
    "pt-BR": "Frequência de Notificações",
    pt: "Frequência de Notificações",
    de: "Push-Frequenz",
    fr: "Fréquence des Notifications",
    ru: "Частота push-уведомлений",
    ar: "تكرار الإشعارات",
    ja: "プッシュ頻度",
    ko: "푸시 빈도"
  },

  PRIVACY_SECURITY: {
    en: "PRIVACY & SECURITY",
    "zh-TW": "隱私與安全",
    "zh-CN": "隐私与安全",
    es: "PRIVACIDAD Y SEGURIDAD",
    "pt-BR": "PRIVACIDADE E SEGURANÇA",
    pt: "PRIVACIDADE E SEGURANÇA",
    de: "DATENSCHUTZ & SICHERHEIT",
    fr: "CONFIDENTIALITÉ ET SÉCURITÉ",
    ru: "КОНФИДЕНЦИАЛЬНОСТЬ И БЕЗОПАСНОСТЬ",
    ar: "الخصوصية والأمان",
    ja: "プライバシーとセキュリティ",
    ko: "개인정보 및 보안"
  },

  biometric_lock: {
    en: "Biometric Lock",
    "zh-TW": "生物識別鎖",
    "zh-CN": "生物识别锁",
    es: "Bloqueo Biométrico",
    "pt-BR": "Bloqueio Biométrico",
    pt: "Bloqueio Biométrico",
    de: "Biometrische Sperre",
    fr: "Verrouillage Biométrique",
    ru: "Биометрическая блокировка",
    ar: "القفل البيومتري",
    ja: "生体認証ロック",
    ko: "생체 인식 잠금"
  },

  data_encryption: {
    en: "Data Encryption",
    "zh-TW": "資料加密",
    "zh-CN": "数据加密",
    es: "Cifrado de Datos",
    "pt-BR": "Criptografia de Dados",
    pt: "Encriptação de Dados",
    de: "Datenverschlüsselung",
    fr: "Chiffrement des Données",
    ru: "Шифрование данных",
    ar: "تشفير البيانات",
    ja: "データ暗号化",
    ko: "데이터 암호화"
  },

  privacy_settings: {
    en: "Privacy Settings",
    "zh-TW": "隱私設定",
    "zh-CN": "隐私设置",
    es: "Configuración de Privacidad",
    "pt-BR": "Configurações de Privacidade",
    pt: "Definições de Privacidade",
    de: "Datenschutzeinstellungen",
    fr: "Paramètres de Confidentialité",
    ru: "Настройки конфиденциальности",
    ar: "إعدادات الخصوصية",
    ja: "プライバシー設定",
    ko: "개인정보 설정"
  },

  HELP_SUPPORT: {
    en: "HELP & SUPPORT",
    "zh-TW": "幫助與支援",
    "zh-CN": "帮助与支持",
    es: "AYUDA Y SOPORTE",
    "pt-BR": "AJUDA E SUPORTE",
    pt: "AJUDA E SUPORTE",
    de: "HILFE & SUPPORT",
    fr: "AIDE ET SUPPORT",
    ru: "ПОМОЩЬ И ПОДДЕРЖКА",
    ar: "المساعدة والدعم",
    ja: "ヘルプとサポート",
    ko: "도움말 및 지원"
  },

  faq: {
    en: "FAQ",
    "zh-TW": "常見問題",
    "zh-CN": "常见问题",
    es: "Preguntas Frecuentes",
    "pt-BR": "Perguntas Frequentes",
    pt: "Perguntas Frequentes",
    de: "Häufig Gestellte Fragen",
    fr: "FAQ",
    ru: "Часто задаваемые вопросы",
    ar: "الأسئلة الشائعة",
    ja: "よくある質問",
    ko: "자주 묻는 질문"
  },

  contact_us: {
    en: "Contact Us",
    "zh-TW": "聯絡我們",
    "zh-CN": "联系我们",
    es: "Contáctanos",
    "pt-BR": "Entre em Contato",
    pt: "Contacte-nos",
    de: "Kontaktieren Sie Uns",
    fr: "Nous Contacter",
    ru: "Связаться с нами",
    ar: "اتصل بنا",
    ja: "お問い合わせ",
    ko: "문의하기"
  },

  tutorial: {
    en: "Tutorial",
    "zh-TW": "教學",
    "zh-CN": "教程",
    es: "Tutorial",
    "pt-BR": "Tutorial",
    pt: "Tutorial",
    de: "Anleitung",
    fr: "Tutoriel",
    ru: "Руководство",
    ar: "دليل الاستخدام",
    ja: "チュートリアル",
    ko: "튜토리얼"
  },

  report_problem: {
    en: "Report Problem",
    "zh-TW": "回報問題",
    "zh-CN": "报告问题",
    es: "Reportar Problema",
    "pt-BR": "Relatar Problema",
    pt: "Reportar Problema",
    de: "Problem Melden",
    fr: "Signaler un Problème",
    ru: "Сообщить о проблеме",
    ar: "الإبلاغ عن مشكلة",
    ja: "問題を報告",
    ko: "문제 신고"
  },

  user_feedback: {
    en: "User Feedback",
    "zh-TW": "使用者回饋",
    "zh-CN": "用户反馈",
    es: "Comentarios del Usuario",
    "pt-BR": "Feedback do Usuário",
    pt: "Feedback do Utilizador",
    de: "Benutzerfeedback",
    fr: "Retour d'Utilisateur",
    ru: "Отзывы пользователей",
    ar: "ملاحظات المستخدم",
    ja: "ユーザーフィードバック",
    ko: "사용자 피드백"
  },

  version_info: {
    en: "Version Information",
    "zh-TW": "版本資訊",
    "zh-CN": "版本信息",
    es: "Información de Versión",
    "pt-BR": "Informações da Versão",
    pt: "Informações da Versão",
    de: "Versionsinformationen",
    fr: "Informations de Version",
    ru: "Информация о версии",
    ar: "معلومات الإصدار",
    ja: "バージョン情報",
    ko: "버전 정보"
  },

  check_updates: {
    en: "Check for Updates",
    "zh-TW": "檢查更新",
    "zh-CN": "检查更新",
    es: "Buscar Actualizaciones",
    "pt-BR": "Verificar Atualizações",
    pt: "Verificar Atualizações",
    de: "Nach Updates Suchen",
    fr: "Vérifier les Mises à Jour",
    ru: "Проверить обновления",
    ar: "التحقق من التحديثات",
    ja: "アップデートを確認",
    ko: "업데이트 확인"
  },

  animation_demo: {
    en: "Animation Demo",
    "zh-TW": "動畫效果展示",
    "zh-CN": "动画效果展示",
    es: "Demostración de Animación",
    "pt-BR": "Demonstração de Animação",
    pt: "Demonstração de Animação",
    de: "Animations-Demo",
    fr: "Démonstration d'Animation",
    ru: "Демонстрация анимации",
    ar: "عرض الرسوم المتحركة",
    ja: "アニメーションデモ",
    ko: "애니메이션 데모"
  },

  // URL Dialog
  enter_video_url: {
    en: "Enter Video URL",
    "zh-TW": "輸入影片網址",
    "zh-CN": "输入视频网址",
    es: "Ingresar URL del Video",
    "pt-BR": "Inserir URL do Vídeo",
    pt: "Inserir URL do Vídeo",
    de: "Video-URL Eingeben",
    fr: "Entrer l'URL de la Vidéo",
    ru: "Введите URL видео",
    ar: "أدخل رابط الفيديو",
    ja: "ビデオURLを入力",
    ko: "비디오 URL 입력"
  },

  video_url: {
    en: "Video URL",
    "zh-TW": "影片網址",
    "zh-CN": "视频网址",
    es: "URL del Video",
    "pt-BR": "URL do Vídeo",
    pt: "URL do Vídeo",
    de: "Video-URL",
    fr: "URL de la Vidéo",
    ru: "URL видео",
    ar: "رابط الفيديو",
    ja: "ビデオURL",
    ko: "비디오 URL"
  },

  video_url_placeholder: {
    en: "https://example.com/video.mp4",
    "zh-TW": "https://example.com/video.mp4",
    "zh-CN": "https://example.com/video.mp4",
    es: "https://example.com/video.mp4",
    "pt-BR": "https://example.com/video.mp4",
    pt: "https://example.com/video.mp4",
    de: "https://example.com/video.mp4",
    fr: "https://example.com/video.mp4",
    ru: "https://example.com/video.mp4",
    ar: "https://example.com/video.mp4",
    ja: "https://example.com/video.mp4",
    ko: "https://example.com/video.mp4"
  },

  example_formats: {
    en: "Example Formats",
    "zh-TW": "範例格式",
    "zh-CN": "示例格式",
    es: "Formatos de Ejemplo",
    "pt-BR": "Formatos de Exemplo",
    pt: "Formatos de Exemplo",
    de: "Beispielformate",
    fr: "Formats d'Exemple",
    ru: "Примеры форматов",
    ar: "أمثلة على التنسيقات",
    ja: "フォーマット例",
    ko: "예제 형식"
  },

  example_direct_mp4: {
    en: "• Direct MP4: https://example.com/video.mp4",
    "zh-TW": "• 直接 MP4：https://example.com/video.mp4",
    "zh-CN": "• 直接 MP4：https://example.com/video.mp4",
    es: "• MP4 Directo: https://example.com/video.mp4",
    "pt-BR": "• MP4 Direto: https://example.com/video.mp4",
    pt: "• MP4 Direto: https://example.com/video.mp4",
    de: "• Direktes MP4: https://example.com/video.mp4",
    fr: "• MP4 Direct: https://example.com/video.mp4",
    ru: "• Прямой MP4: https://example.com/video.mp4",
    ar: "• MP4 مباشر: https://example.com/video.mp4",
    ja: "• 直接MP4: https://example.com/video.mp4",
    ko: "• 직접 MP4: https://example.com/video.mp4"
  },

  example_hls_stream: {
    en: "• HLS Stream: https://example.com/stream.m3u8",
    "zh-TW": "• HLS 串流：https://example.com/stream.m3u8",
    "zh-CN": "• HLS 流：https://example.com/stream.m3u8",
    es: "• Transmisión HLS: https://example.com/stream.m3u8",
    "pt-BR": "• Stream HLS: https://example.com/stream.m3u8",
    pt: "• Stream HLS: https://example.com/stream.m3u8",
    de: "• HLS-Stream: https://example.com/stream.m3u8",
    fr: "• Flux HLS: https://example.com/stream.m3u8",
    ru: "• HLS-поток: https://example.com/stream.m3u8",
    ar: "• بث HLS: https://example.com/stream.m3u8",
    ja: "• HLSストリーム: https://example.com/stream.m3u8",
    ko: "• HLS 스트림: https://example.com/stream.m3u8"
  },

  example_youtube: {
    en: "• YouTube: https://youtube.com/watch?v=...",
    "zh-TW": "• YouTube：https://youtube.com/watch?v=...",
    "zh-CN": "• YouTube：https://youtube.com/watch?v=...",
    es: "• YouTube: https://youtube.com/watch?v=...",
    "pt-BR": "• YouTube: https://youtube.com/watch?v=...",
    pt: "• YouTube: https://youtube.com/watch?v=...",
    de: "• YouTube: https://youtube.com/watch?v=...",
    fr: "• YouTube: https://youtube.com/watch?v=...",
    ru: "• YouTube: https://youtube.com/watch?v=...",
    ar: "• يوتيوب: https://youtube.com/watch?v=...",
    ja: "• YouTube: https://youtube.com/watch?v=...",
    ko: "• YouTube: https://youtube.com/watch?v=..."
  },

  example_vimeo: {
    en: "• Vimeo: https://vimeo.com/...",
    "zh-TW": "• Vimeo：https://vimeo.com/...",
    "zh-CN": "• Vimeo：https://vimeo.com/...",
    es: "• Vimeo: https://vimeo.com/...",
    "pt-BR": "• Vimeo: https://vimeo.com/...",
    pt: "• Vimeo: https://vimeo.com/...",
    de: "• Vimeo: https://vimeo.com/...",
    fr: "• Vimeo: https://vimeo.com/...",
    ru: "• Vimeo: https://vimeo.com/...",
    ar: "• فيميو: https://vimeo.com/...",
    ja: "• Vimeo: https://vimeo.com/...",
    ko: "• Vimeo: https://vimeo.com/..."
  },

  example_adult_sites: {
    en: "• Adult Sites: Supported",
    "zh-TW": "• 成人網站：支援",
    "zh-CN": "• 成人网站：支持",
    es: "• Sitios para Adultos: Compatible",
    "pt-BR": "• Sites Adultos: Suportado",
    pt: "• Sites Adultos: Suportado",
    de: "• Erwachsenen-Websites: Unterstützt",
    fr: "• Sites pour Adultes: Pris en Charge",
    ru: "• Сайты для взрослых: Поддерживается",
    ar: "• مواقع البالغين: مدعومة",
    ja: "• アダルトサイト: サポート",
    ko: "• 성인 사이트: 지원됨"
  },

  example_social_media: {
    en: "• Social Media: Supported",
    "zh-TW": "• 社群媒體：支援",
    "zh-CN": "• 社交媒体：支持",
    es: "• Redes Sociales: Compatible",
    "pt-BR": "• Redes Sociais: Suportado",
    pt: "• Redes Sociais: Suportado",
    de: "• Soziale Medien: Unterstützt",
    fr: "• Réseaux Sociaux: Pris en Charge",
    ru: "• Социальные сети: Поддерживается",
    ar: "• وسائل التواصل الاجتماعي: مدعومة",
    ja: "• ソーシャルメディア: サポート",
    ko: "• 소셜 미디어: 지원됨"
  },

  download_video: {
    en: "Download Video",
    "zh-TW": "下載影片",
    "zh-CN": "下载视频",
    es: "Descargar Video",
    "pt-BR": "Baixar Vídeo",
    pt: "Descarregar Vídeo",
    de: "Video Herunterladen",
    fr: "Télécharger la Vidéo",
    ru: "Скачать видео",
    ar: "تحميل الفيديو",
    ja: "ビデオをダウンロード",
    ko: "비디오 다운로드"
  },

  playback_speed: {
    en: "Playback Speed",
    "zh-TW": "播放速度",
    "zh-CN": "播放速度",
    es: "Velocidad de Reproducción",
    "pt-BR": "Velocidade de Reprodução",
    pt: "Velocidade de Reprodução",
    de: "Wiedergabegeschwindigkeit",
    fr: "Vitesse de Lecture",
    ru: "Скорость воспроизведения",
    ar: "سرعة التشغيل",
    ja: "再生速度",
    ko: "재생 속도"
  },

  normal_speed: {
    en: "Normal Speed",
    "zh-TW": "正常速度",
    "zh-CN": "正常速度",
    es: "Velocidad Normal",
    "pt-BR": "Velocidade Normal",
    pt: "Velocidade Normal",
    de: "Normale Geschwindigkeit",
    fr: "Vitesse Normale",
    ru: "Нормальная скорость",
    ar: "السرعة العادية",
    ja: "通常速度",
    ko: "정상 속도"
  },

  speed_2_0: {
    en: "2.0x Speed",
    "zh-TW": "2.0 倍速",
    "zh-CN": "2.0 倍速",
    es: "Velocidad 2.0x",
    "pt-BR": "Velocidade 2.0x",
    pt: "Velocidade 2.0x",
    de: "2.0x Geschwindigkeit",
    fr: "Vitesse 2.0x",
    ru: "Скорость 2.0x",
    ar: "سرعة 2.0",
    ja: "2.0倍速",
    ko: "2.0배속"
  },

  next_video: {
    en: "Next Video",
    "zh-TW": "下一部影片",
    "zh-CN": "下一个视频",
    es: "Siguiente Video",
    "pt-BR": "Próximo Vídeo",
    pt: "Próximo Vídeo",
    de: "Nächstes Video",
    fr: "Vidéo Suivante",
    ru: "Следующее видео",
    ar: "الفيديو التالي",
    ja: "次のビデオ",
    ko: "다음 비디오"
  },

  previous_video: {
    en: "Previous Video",
    "zh-TW": "上一部影片",
    "zh-CN": "上一个视频",
    es: "Video Anterior",
    "pt-BR": "Vídeo Anterior",
    pt: "Vídeo Anterior",
    de: "Vorheriges Video",
    fr: "Vidéo Précédente",
    ru: "Предыдущее видео",
    ar: "الفيديو السابق",
    ja: "前のビデオ",
    ko: "이전 비디오"
  }
};

// Languages to update
const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];

console.log('🌐 Starting comprehensive translation sync for all 12 languages...\n');

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    // Read existing translations
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Count missing keys
    let addedCount = 0;
    
    // Add missing keys
    Object.keys(missingKeys).forEach(key => {
      if (!existingData[key]) {
        existingData[key] = missingKeys[key][lang];
        addedCount++;
      }
    });
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log(`✅ ${lang}.json: Added ${addedCount} missing translations`);
  } catch (error) {
    console.error(`❌ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✨ Translation sync complete!');
console.log('\n📋 Summary:');
console.log(`   - Total keys added: ${Object.keys(missingKeys).length}`);
console.log(`   - Languages updated: ${languages.length}`);
console.log(`   - Total translations: ${Object.keys(missingKeys).length * languages.length}`);
