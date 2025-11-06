#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 
  'de', 'fr', 'ru', 'ar', 'ja', 'ko'
];

const L10N_DIR = path.join(process.cwd(), 'l10n');

const MISSING_KEYS = {
  video_url_input_hint: {
    en: "Please enter video URL",
    "zh-TW": "請輸入影片網址",
    "zh-CN": "请输入视频网址",
    es: "Por favor ingrese la URL del video",
    "pt-BR": "Por favor, insira o URL do vídeo",
    pt: "Por favor, insira o URL do vídeo",
    de: "Bitte geben Sie die Video-URL ein",
    fr: "Veuillez saisir l'URL de la vidéo",
    ru: "Пожалуйста, введите URL видео",
    ar: "الرجاء إدخال رابط الفيديو",
    ja: "ビデオURLを入力してください",
    ko: "비디오 URL을 입력하세요"
  },
  supported_video_sources: {
    en: "Supported Video Sources",
    "zh-TW": "支援影片來源",
    "zh-CN": "支持视频来源",
    es: "Fuentes de Video Compatibles",
    "pt-BR": "Fontes de Vídeo Suportadas",
    pt: "Fontes de Vídeo Suportadas",
    de: "Unterstützte Videoquellen",
    fr: "Sources Vidéo Prises en Charge",
    ru: "Поддерживаемые источники видео",
    ar: "مصادر الفيديو المدعومة",
    ja: "サポートされているビデオソース",
    ko: "지원되는 비디오 소스"
  },
  direct_video_files: {
    en: "Direct video files: MP4, HLS (.m3u8)",
    "zh-TW": "直接影片檔：MP4、HLS (.m3u8)",
    "zh-CN": "直接视频文件：MP4、HLS (.m3u8)",
    es: "Archivos de video directos: MP4, HLS (.m3u8)",
    "pt-BR": "Arquivos de vídeo diretos: MP4, HLS (.m3u8)",
    pt: "Ficheiros de vídeo diretos: MP4, HLS (.m3u8)",
    de: "Direkte Videodateien: MP4, HLS (.m3u8)",
    fr: "Fichiers vidéo directs : MP4, HLS (.m3u8)",
    ru: "Прямые видеофайлы: MP4, HLS (.m3u8)",
    ar: "ملفات الفيديو المباشرة: MP4، HLS (.m3u8)",
    ja: "直接ビデオファイル：MP4、HLS (.m3u8)",
    ko: "직접 비디오 파일: MP4, HLS (.m3u8)"
  },
  video_platforms: {
    en: "Video platforms: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "zh-TW": "影片平台：YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    "zh-CN": "视频平台：YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    es: "Plataformas de video: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "pt-BR": "Plataformas de vídeo: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    pt: "Plataformas de vídeo: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    de: "Videoplattformen: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    fr: "Plateformes vidéo : YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    ru: "Видеоплатформы: YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    ar: "منصات الفيديو: YouTube، Vimeo، Twitch، Facebook، Dailymotion",
    ja: "ビデオプラットフォーム：YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    ko: "비디오 플랫폼: YouTube, Vimeo, Twitch, Facebook, Dailymotion"
  },
  social_media_videos: {
    en: "Social media videos: Facebook, Instagram, etc.",
    "zh-TW": "社群媒體影片：Facebook、Instagram 等",
    "zh-CN": "社交媒体视频：Facebook、Instagram 等",
    es: "Videos de redes sociales: Facebook, Instagram, etc.",
    "pt-BR": "Vídeos de redes sociais: Facebook, Instagram, etc.",
    pt: "Vídeos de redes sociais: Facebook, Instagram, etc.",
    de: "Social-Media-Videos: Facebook, Instagram usw.",
    fr: "Vidéos de réseaux sociaux : Facebook, Instagram, etc.",
    ru: "Видео из социальных сетей: Facebook, Instagram и т.д.",
    ar: "فيديوهات وسائل التواصل الاجتماعي: Facebook، Instagram، إلخ",
    ja: "ソーシャルメディア動画：Facebook、Instagram など",
    ko: "소셜 미디어 비디오: Facebook, Instagram 등"
  },
  adult_sites_18plus: {
    en: "Adult sites (18+ required): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "zh-TW": "成人網站（需滿 18 歲）：Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbang 等",
    "zh-CN": "成人网站（需满 18 岁）：Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbang 等",
    es: "Sitios para adultos (18+ requerido): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "pt-BR": "Sites adultos (18+ obrigatório): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    pt: "Sites adultos (18+ obrigatório): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    de: "Erwachsenenseiten (18+ erforderlich): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang usw.",
    fr: "Sites pour adultes (18+ requis) : Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    ru: "Сайты для взрослых (18+ обязательно): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang и т.д.",
    ar: "مواقع البالغين (18+ مطلوب): Pornhub، Xvideos، Xnxx، Redtube، Tktube، YouPorn، Spankbang، إلخ",
    ja: "アダルトサイト（18歳以上必須）：Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbang など",
    ko: "성인 사이트 (18세 이상 필수): Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang 등"
  },
  cloud_videos: {
    en: "Cloud videos: Google Drive, Dropbox, OneDrive, Mega",
    "zh-TW": "雲端影片：Google Drive、Dropbox、OneDrive、Mega",
    "zh-CN": "云端视频：Google Drive、Dropbox、OneDrive、Mega",
    es: "Videos en la nube: Google Drive, Dropbox, OneDrive, Mega",
    "pt-BR": "Vídeos na nuvem: Google Drive, Dropbox, OneDrive, Mega",
    pt: "Vídeos na nuvem: Google Drive, Dropbox, OneDrive, Mega",
    de: "Cloud-Videos: Google Drive, Dropbox, OneDrive, Mega",
    fr: "Vidéos cloud : Google Drive, Dropbox, OneDrive, Mega",
    ru: "Облачные видео: Google Drive, Dropbox, OneDrive, Mega",
    ar: "فيديوهات السحابة: Google Drive، Dropbox، OneDrive، Mega",
    ja: "クラウド動画：Google Drive、Dropbox、OneDrive、Mega",
    ko: "클라우드 비디오: Google Drive, Dropbox, OneDrive, Mega"
  },
  local_videos: {
    en: "Local videos: MP4, MKV, AVI, MOV, etc.",
    "zh-TW": "本地影片：MP4、MKV、AVI、MOV 等",
    "zh-CN": "本地视频：MP4、MKV、AVI、MOV 等",
    es: "Videos locales: MP4, MKV, AVI, MOV, etc.",
    "pt-BR": "Vídeos locais: MP4, MKV, AVI, MOV, etc.",
    pt: "Vídeos locais: MP4, MKV, AVI, MOV, etc.",
    de: "Lokale Videos: MP4, MKV, AVI, MOV usw.",
    fr: "Vidéos locales : MP4, MKV, AVI, MOV, etc.",
    ru: "Локальные видео: MP4, MKV, AVI, MOV и т.д.",
    ar: "فيديوهات محلية: MP4، MKV، AVI، MOV، إلخ",
    ja: "ローカル動画：MP4、MKV、AVI、MOV など",
    ko: "로컬 비디오: MP4, MKV, AVI, MOV 등"
  },
  direct_url_streams: {
    en: "Direct URL streams: M3U8 / HLS / RTMP / DASH",
    "zh-TW": "網址直鏈：M3U8 / HLS / RTMP / DASH",
    "zh-CN": "网址直链：M3U8 / HLS / RTMP / DASH",
    es: "Transmisiones de URL directas: M3U8 / HLS / RTMP / DASH",
    "pt-BR": "Streams de URL diretos: M3U8 / HLS / RTMP / DASH",
    pt: "Streams de URL diretos: M3U8 / HLS / RTMP / DASH",
    de: "Direkte URL-Streams: M3U8 / HLS / RTMP / DASH",
    fr: "Flux URL directs : M3U8 / HLS / RTMP / DASH",
    ru: "Прямые URL-потоки: M3U8 / HLS / RTMP / DASH",
    ar: "بث URL المباشر: M3U8 / HLS / RTMP / DASH",
    ja: "直接URLストリーム：M3U8 / HLS / RTMP / DASH",
    ko: "직접 URL 스트림: M3U8 / HLS / RTMP / DASH"
  },
  adult_content_age_verification: {
    en: "Adult sites require age verification. Please confirm you are 18+",
    "zh-TW": "成人網站會跳出年齡驗證，請確認您已滿 18 歲",
    "zh-CN": "成人网站会跳出年龄验证，请确认您已满 18 岁",
    es: "Los sitios para adultos requieren verificaci��n de edad. Por favor confirme que tiene 18+",
    "pt-BR": "Sites adultos exigem verificação de idade. Por favor, confirme que você tem 18+",
    pt: "Sites adultos exigem verificação de idade. Por favor, confirme que tem 18+",
    de: "Erwachsenenseiten erfordern Altersüberprüfung. Bitte bestätigen Sie, dass Sie 18+ sind",
    fr: "Les sites pour adultes nécessitent une vérification d'âge. Veuillez confirmer que vous avez 18+",
    ru: "Сайты для взрослых требуют подтверждения возраста. Пожалуйста, подтвердите, что вам 18+",
    ar: "تتطلب مواقع البالغين التحقق من العمر. يرجى تأكيد أنك 18+",
    ja: "アダルトサイトは年齢確認が必要です。18歳以上であることを確認してください",
    ko: "성인 사이트는 연령 확인이 필요합니다. 18세 이상임을 확인하세요"
  },
  supported_video_formats: {
    en: "Supported Video Formats",
    "zh-TW": "支援影片格式",
    "zh-CN": "支持视频格式",
    es: "Formatos de Video Compatibles",
    "pt-BR": "Formatos de Vídeo Suportados",
    pt: "Formatos de Vídeo Suportados",
    de: "Unterstützte Videoformate",
    fr: "Formats Vidéo Pris en Charge",
    ru: "Поддерживаемые форматы видео",
    ar: "تنسيقات الفيديو المدعومة",
    ja: "サポートされているビデオ形式",
    ko: "지원되는 비디오 형식"
  },
  container_formats: {
    en: "Container Formats: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "zh-TW": "封裝格式：MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    "zh-CN": "封装格式：MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    es: "Formatos de contenedor: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "pt-BR": "Formatos de contêiner: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    pt: "Formatos de contentor: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    de: "Containerformate: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    fr: "Formats de conteneur : MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    ru: "Форматы контейнеров: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    ar: "تنسيقات الحاوية: MP4، MKV، AVI، MOV، FLV، WMV، WebM، 3GP، TS",
    ja: "コンテナ形式：MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    ko: "컨테이너 형식: MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS"
  },
  streaming_protocols: {
    en: "Streaming Protocols: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "zh-TW": "串流協議：HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    "zh-CN": "串流协议：HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    es: "Protocolos de transmisión: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "pt-BR": "Protocolos de streaming: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    pt: "Protocolos de streaming: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    de: "Streaming-Protokolle: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    fr: "Protocoles de streaming : HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    ru: "Протоколы потоковой передачи: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    ar: "بروتوكولات البث: HLS (.m3u8)، MPEG-DASH (.mpd)، RTMP / RTSP، Progressive MP4",
    ja: "ストリーミングプロトコル：HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    ko: "스트리밍 프로토콜: HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4"
  },
  video_codecs: {
    en: "Video Codecs: H.264, H.265 (HEVC), VP8, VP9, AV1",
    "zh-TW": "視訊編碼：H.264、H.265 (HEVC)、VP8、VP9、AV1",
    "zh-CN": "视频编码：H.264、H.265 (HEVC)、VP8、VP9、AV1",
    es: "Códecs de video: H.264, H.265 (HEVC), VP8, VP9, AV1",
    "pt-BR": "Codecs de vídeo: H.264, H.265 (HEVC), VP8, VP9, AV1",
    pt: "Codecs de vídeo: H.264, H.265 (HEVC), VP8, VP9, AV1",
    de: "Video-Codecs: H.264, H.265 (HEVC), VP8, VP9, AV1",
    fr: "Codecs vidéo : H.264, H.265 (HEVC), VP8, VP9, AV1",
    ru: "Видеокодеки: H.264, H.265 (HEVC), VP8, VP9, AV1",
    ar: "ترميزات الفيديو: H.264، H.265 (HEVC)، VP8، VP9، AV1",
    ja: "ビデオコーデック：H.264、H.265 (HEVC)、VP8、VP9、AV1",
    ko: "비디오 코덱: H.264, H.265 (HEVC), VP8, VP9, AV1"
  },
  audio_codecs: {
    en: "Audio Codecs: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    "zh-TW": "音訊編碼：AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    "zh-CN": "音频编码：AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    es: "Códecs de audio: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    "pt-BR": "Codecs de áudio: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    pt: "Codecs de áudio: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    de: "Audio-Codecs: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    fr: "Codecs audio : AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    ru: "Аудиокодеки: AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    ar: "ترميزات الصوت: AAC، MP3، Opus، Vorbis، AC3، E-AC3",
    ja: "オーディオコーデック：AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    ko: "오디오 코덱: AAC, MP3, Opus, Vorbis, AC3, E-AC3"
  },
  usage_notes: {
    en: "Usage Notes",
    "zh-TW": "使用注意事項",
    "zh-CN": "使用注意事项",
    es: "Notas de Uso",
    "pt-BR": "Notas de Uso",
    pt: "Notas de Utilização",
    de: "Nutzungshinweise",
    fr: "Notes d'Utilisation",
    ru: "Примечания по использованию",
    ar: "ملاحظات الاستخدام",
    ja: "使用上の注意",
    ko: "사용 참고사항"
  },
  adult_content_age_restriction: {
    en: "Adult content is restricted to 18+ (or local legal age)",
    "zh-TW": "成人內容僅限滿 18 歲（或當地法定年齡）",
    "zh-CN": "成人内容仅限满 18 岁（或当地法定年龄）",
    es: "El contenido para adultos está restringido a mayores de 18 años (o edad legal local)",
    "pt-BR": "Conteúdo adulto é restrito a maiores de 18 anos (ou idade legal local)",
    pt: "Conteúdo adulto é restrito a maiores de 18 anos (ou idade legal local)",
    de: "Erwachseneninhalte sind auf 18+ beschränkt (oder lokales gesetzliches Alter)",
    fr: "Le contenu pour adultes est réservé aux 18+ (ou âge légal local)",
    ru: "Контент для взрослых ограничен 18+ (или местный законный возраст)",
    ar: "المحتوى للبالغين مقيد بـ 18+ (أو السن القانوني المحلي)",
    ja: "アダルトコンテンツは18歳以上に制限されています（または現地の法定年齢）",
    ko: "성인 콘텐츠는 18세 이상으로 제한됩니다 (또는 현지 법정 연령)"
  },
  no_illegal_content: {
    en: "Do not enter illegal or pirated video links",
    "zh-TW": "請勿輸入非法或盜版影片",
    "zh-CN": "请勿输入非法或盗版视频",
    es: "No ingrese enlaces de videos ilegales o pirateados",
    "pt-BR": "Não insira links de vídeos ilegais ou pirateados",
    pt: "Não insira links de vídeos ilegais ou pirateados",
    de: "Geben Sie keine illegalen oder raubkopierten Videolinks ein",
    fr: "N'entrez pas de liens vidéo illégaux ou piratés",
    ru: "Не вводите ссылки на нелегальные или пиратские видео",
    ar: "لا تدخل روابط فيديو غير قانونية أو مقرصنة",
    ja: "違法または海賊版のビデオリンクを入力しないでください",
    ko: "불법 또는 불법 복제 비디오 링크를 입력하지 마세요"
  },
  follow_local_laws: {
    en: "Follow local laws - adult content may be restricted in some regions",
    "zh-TW": "遵守當地法律，部分地區成人內容可能受限",
    "zh-CN": "遵守当地法律，部分地区成人内容可能受限",
    es: "Siga las leyes locales: el contenido para adultos puede estar restringido en algunas regiones",
    "pt-BR": "Siga as leis locais - conteúdo adulto pode ser restrito em algumas regiões",
    pt: "Siga as leis locais - conteúdo adulto pode ser restrito em algumas regiões",
    de: "Befolgen Sie lokale Gesetze - Erwachseneninhalte können in einigen Regionen eingeschränkt sein",
    fr: "Respectez les lois locales - le contenu pour adultes peut être restreint dans certaines régions",
    ru: "Соблюдайте местные законы - контент для взрослых может быть ограничен в некоторых регионах",
    ar: "اتبع القوانين المحلية - قد يكون المحتوى للبالغين مقيدًا في بعض المناطق",
    ja: "現地の法律に従ってください - アダルトコンテンツは一部の地域で制限される場合があります",
    ko: "현지 법률을 준수하세요 - 일부 지역에서는 성인 콘텐츠가 제한될 수 있습니다"
  },
  no_browsing_history_saved: {
    en: "App does not save browsing history",
    "zh-TW": "App 不會保存瀏覽記錄",
    "zh-CN": "App 不会保存浏览记录",
    es: "La aplicación no guarda el historial de navegación",
    "pt-BR": "O aplicativo não salva o histórico de navegação",
    pt: "A aplicação não guarda o histórico de navegação",
    de: "Die App speichert keinen Browserverlauf",
    fr: "L'application ne sauvegarde pas l'historique de navigation",
    ru: "Приложение не сохраняет историю просмотров",
    ar: "التطبيق لا يحفظ سجل التصفح",
    ja: "アプリは閲覧履歴を保存しません",
    ko: "앱은 검색 기록을 저장하지 않습니다"
  },
  membership_tiers: {
    en: "Membership Tiers",
    "zh-TW": "會員簡易說明",
    "zh-CN": "会员简易说明",
    es: "Niveles de Membresía",
    "pt-BR": "Níveis de Associação",
    pt: "Níveis de Associação",
    de: "Mitgliedschaftsstufen",
    fr: "Niveaux d'Adhésion",
    ru: "Уровни членства",
    ar: "مستويات العضوية",
    ja: "メンバーシップレベル",
    ko: "멤버십 등급"
  },
  all_formats_trial: {
    en: "All formats available for trial",
    "zh-TW": "全部格式皆可試用",
    "zh-CN": "全部格式皆可试用",
    es: "Todos los formatos disponibles para prueba",
    "pt-BR": "Todos os formatos disponíveis para teste",
    pt: "Todos os formatos disponíveis para teste",
    de: "Alle Formate für Testversion verfügbar",
    fr: "Tous les formats disponibles pour l'essai",
    ru: "Все форматы доступны для пробной версии",
    ar: "جميع التنسيقات متاحة للتجربة",
    ja: "すべての形式が試用可能",
    ko: "모든 형식을 체험할 수 있습니다"
  },
  trial_description: {
    en: "First-time experience, all formats available for trial",
    "zh-TW": "初次體驗，所有格式皆可試用",
    "zh-CN": "初次体验，所有格式皆可试用",
    es: "Primera experiencia, todos los formatos disponibles para prueba",
    "pt-BR": "Primeira experiência, todos os formatos disponíveis para teste",
    pt: "Primeira experiência, todos os formatos disponíveis para teste",
    de: "Erstmalige Erfahrung, alle Formate für Testversion verfügbar",
    fr: "Première expérience, tous les formats disponibles pour l'essai",
    ru: "Первый опыт, все форматы доступны для пробной версии",
    ar: "تجربة لأول مرة، جميع التنسيقات متاحة للتجربة",
    ja: "初回体験、すべての形式が試用可能",
    ko: "첫 경험, 모든 형식을 체험할 수 있습니다"
  },
  free_member_description: {
    en: "Daily free quota for basic use. Upgrade to unlock adult sites, cloud streaming, and all video sources, and remove daily usage limits",
    "zh-TW": "每日可免費使用基本影片格式；升級會員可解鎖成人網站影片、雲端串流及全部影片來源，並移除每日次數限制",
    "zh-CN": "每日可免费使用基本视频格式；升级会员可解锁成人网站视频、云端串流及全部视频来源，并移除每日次数限制",
    es: "Cuota diaria gratuita para uso básico. Actualice para desbloquear sitios para adultos, transmisión en la nube y todas las fuentes de video, y eliminar los límites de uso diario",
    "pt-BR": "Cota diária gratuita para uso básico. Atualize para desbloquear sites adultos, streaming na nuvem e todas as fontes de vídeo, e remover limites de uso diário",
    pt: "Quota diária gratuita para uso básico. Atualize para desbloquear sites adultos, streaming na nuvem e todas as fontes de vídeo, e remover limites de uso diário",
    de: "Tägliches kostenloses Kontingent für grundlegende Nutzung. Upgrade, um Erwachsenenseiten, Cloud-Streaming und alle Videoquellen freizuschalten und tägliche Nutzungslimits zu entfernen",
    fr: "Quota quotidien gratuit pour une utilisation de base. Mettez à niveau pour débloquer les sites pour adultes, le streaming cloud et toutes les sources vidéo, et supprimer les limites d'utilisation quotidiennes",
    ru: "Ежедневная бесплатная квота для базового использования. Обновите, чтобы разблокировать сайты для взрослых, облачную трансляцию и все источники видео, и снять ежедневные ограничения использования",
    ar: "حصة يومية مجانية للاستخدام الأساسي. قم بالترقية لفتح مواقع البالغين والبث السحابي وجميع مصادر الفيديو، وإزالة حدود الاستخدام اليومية",
    ja: "基本使用のための毎日の無料割り当て。アップグレードしてアダルトサイト、クラウドストリーミング、すべてのビデオソースのロックを解除し、毎日の使用制限を削除します",
    ko: "기본 사용을 위한 일일 무료 할당량. 업그레이드하여 성인 사이트, 클라우드 스트리밍 및 모든 비디오 소스를 잠금 해제하고 일일 사용 제한을 제거하세요"
  },
  monthly_1500_plus_daily_40: {
    en: "1500 uses/month + 40 uses/day",
    "zh-TW": "每月 1500 次 + 每日 40 次",
    "zh-CN": "每月 1500 次 + 每日 40 次",
    es: "1500 usos/mes + 40 usos/día",
    "pt-BR": "1500 usos/mês + 40 usos/dia",
    pt: "1500 usos/mês + 40 usos/dia",
    de: "1500 Nutzungen/Monat + 40 Nutzungen/Tag",
    fr: "1500 utilisations/mois + 40 utilisations/jour",
    ru: "1500 использований/месяц + 40 использований/день",
    ar: "1500 استخدام/شهر + 40 استخدام/يوم",
    ja: "1500回/月 + 40回/日",
    ko: "1500회/월 + 40회/일"
  },
  all_formats_including_adult: {
    en: "All formats (including adult sites)",
    "zh-TW": "全部格式（含成人網站）",
    "zh-CN": "全部格式（含成人网站）",
    es: "Todos los formatos (incluidos sitios para adultos)",
    "pt-BR": "Todos os formatos (incluindo sites adultos)",
    pt: "Todos os formatos (incluindo sites adultos)",
    de: "Alle Formate (einschließlich Erwachsenenseiten)",
    fr: "Tous les formats (y compris les sites pour adultes)",
    ru: "Все форматы (включая сайты для взрослых)",
    ar: "جميع التنسيقات (بما في ذلك مواقع البالغين)",
    ja: "すべての形式（アダルトサイトを含む）",
    ko: "모든 형식 (성인 사이트 포함)"
  },
  basic_member_description: {
    en: "Access all video sources and adult content, suitable for regular users",
    "zh-TW": "可使用全部影片來源與成人網站內容，適合常用者",
    "zh-CN": "可使用全部视频来源与成人网站内容，适合常用者",
    es: "Acceda a todas las fuentes de video y contenido para adultos, adecuado para usuarios regulares",
    "pt-BR": "Acesse todas as fontes de vídeo e conteúdo adulto, adequado para usuários regulares",
    pt: "Aceda a todas as fontes de vídeo e conteúdo adulto, adequado para utilizadores regulares",
    de: "Zugriff auf alle Videoquellen und Erwachseneninhalte, geeignet für regelmäßige Benutzer",
    fr: "Accédez à toutes les sources vidéo et au contenu pour adultes, adapté aux utilisateurs réguliers",
    ru: "Доступ ко всем источникам видео и контенту для взрослых, подходит для обычных пользователей",
    ar: "الوصول إلى جميع مصادر الفيديو والمحتوى للبالغين، مناسب للمستخدمين العاديين",
    ja: "すべてのビデオソースとアダルトコンテンツにアクセス、通常のユーザーに適しています",
    ko: "모든 비디오 소스 및 성인 콘텐츠에 액세스, 일반 사용자에게 적합"
  },
  premium_member_description: {
    en: "Unlimited viewing, supports all video sources and formats, ideal for advanced users",
    "zh-TW": "無限制觀看，支援全部影片來源與格式，適合進階用戶",
    "zh-CN": "无限制观看，支持全部视频来源与格式，适合进阶用户",
    es: "Visualización ilimitada, admite todas las fuentes y formatos de video, ideal para usuarios avanzados",
    "pt-BR": "Visualização ilimitada, suporta todas as fontes e formatos de vídeo, ideal para usuários avançados",
    pt: "Visualização ilimitada, suporta todas as fontes e formatos de vídeo, ideal para utilizadores avançados",
    de: "Unbegrenzte Anzeige, unterstützt alle Videoquellen und -formate, ideal für fortgeschrittene Benutzer",
    fr: "Visionnage illimité, prend en charge toutes les sources et formats vidéo, idéal pour les utilisateurs avancés",
    ru: "Неограниченный просмотр, поддерживает все источники и форматы видео, идеально для продвинутых пользователей",
    ar: "مشاهدة غير محدودة، يدعم جميع مصادر وتنسيقات الفيديو، مثالي للمستخدمين المتقدمين",
    ja: "無制限の視聴、すべてのビデオソースと形式をサポート、上級ユーザーに最適",
    ko: "무제한 시청, 모든 비디오 소스 및 형식 지원, 고급 사용자에게 이상적"
  },
  upgrade_unlock_features: {
    en: "Upgrade membership to unlock adult sites, more streaming & cloud sources, and remove daily usage limits",
    "zh-TW": "升級會員即可解鎖成人網站影片、更多串流與雲端來源，並移除每日使用次數限制",
    "zh-CN": "升级会员即可解锁成人网站视频、更多串流与云端来源，并移除每日使用次数限制",
    es: "Actualice la membresía para desbloquear sitios para adultos, más fuentes de transmisión y nube, y eliminar los límites de uso diario",
    "pt-BR": "Atualize a associação para desbloquear sites adultos, mais fontes de streaming e nuvem, e remover limites de uso diário",
    pt: "Atualize a associação para desbloquear sites adultos, mais fontes de streaming e nuvem, e remover limites de uso diário",
    de: "Upgrade der Mitgliedschaft, um Erwachsenenseiten, mehr Streaming- und Cloud-Quellen freizuschalten und tägliche Nutzungslimits zu entfernen",
    fr: "Mettez à niveau l'adhésion pour débloquer les sites pour adultes, plus de sources de streaming et cloud, et supprimer les limites d'utilisation quotidiennes",
    ru: "Обновите членство, чтобы разблокировать сайты для взрослых, больше источников потоковой передачи и облака, и снять ежедневные ограничения использования",
    ar: "قم بترقية العضوية لفتح مواقع البالغين، والمزيد من مصادر البث والسحابة، وإزالة حدود الاستخدام اليومية",
    ja: "メンバーシップをアップグレードして、アダルトサイト、より多くのストリーミングとクラウドソースのロックを解除し、毎日の使用制限を削除します",
    ko: "멤버십을 업그레이드하여 성인 사이트, 더 많은 스트리밍 및 클라우드 소스를 잠금 해제하고 일일 사용 제한을 제거하세요"
  }
};

function syncTranslations() {
  console.log('🔄 Starting comprehensive multilingual sync...\n');

  let totalKeysAdded = 0;
  let filesUpdated = 0;

  LANGUAGES.forEach(lang => {
    const filePath = path.join(L10N_DIR, `${lang}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Warning: ${lang}.json not found, skipping...`);
      return;
    }

    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let keysAdded = 0;

    Object.keys(MISSING_KEYS).forEach(key => {
      if (!translations[key]) {
        translations[key] = MISSING_KEYS[key][lang];
        keysAdded++;
        totalKeysAdded++;
      }
    });

    if (keysAdded > 0) {
      const sortedTranslations = {};
      Object.keys(translations).sort().forEach(key => {
        sortedTranslations[key] = translations[key];
      });

      fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2), 'utf8');
      console.log(`✅ ${lang}.json: Added ${keysAdded} missing keys`);
      filesUpdated++;
    } else {
      console.log(`✓  ${lang}.json: Already up to date`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Files updated: ${filesUpdated}/${LANGUAGES.length}`);
  console.log(`   Total keys added: ${totalKeysAdded}`);
  console.log(`\n✨ Multilingual sync completed!`);
}

syncTranslations();
