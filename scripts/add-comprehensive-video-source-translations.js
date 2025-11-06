const fs = require('fs');
const path = require('path');

const newKeys = {
  en: {
    // Video Source Support Section
    "video_source_support_title": "Supported Video Sources",
    "video_source_direct": "Direct Video Files",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Video Platforms",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Social Media Videos",
    "video_source_social_desc": "Facebook, Instagram, etc.",
    "video_source_adult": "Adult Websites (18+ only)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "video_source_cloud": "Cloud Videos",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Local Videos",
    "video_source_local_desc": "MP4, MKV, AVI, MOV, etc.",
    "video_source_direct_link": "Direct URL Links",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Note: Adult websites require age verification. Please confirm you are 18+.",
    
    // Video Format Support Section
    "video_format_support_title": "Supported Video Formats",
    "video_format_container": "Container Formats",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Streaming Protocols",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Video Codecs",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Audio Codecs",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    // Usage Notice Section
    "usage_notice_title": "Usage Notice",
    "usage_notice_age": "Adult content is restricted to 18+ (or local legal age)",
    "usage_notice_illegal": "Do not input illegal or pirated videos",
    "usage_notice_law": "Comply with local laws, adult content may be restricted in some regions",
    "usage_notice_privacy": "App does not save browsing history",
    
    // Membership Brief Section
    "membership_brief_title": "Membership Overview",
    "membership_free_trial": "Free Trial",
    "membership_free_trial_uses": "Usage: 2000 times",
    "membership_free_trial_sources": "Supported Sources: All formats available for trial",
    "membership_free_trial_desc": "First-time experience, all formats available",
    
    "membership_free": "Free Member",
    "membership_free_uses": "Usage: 30 times per day",
    "membership_free_sources": "Supported Sources: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Daily free quota, entry-level usage",
    
    "membership_basic": "Basic Member",
    "membership_basic_uses": "Usage: 1500 times per month + 40 times per day",
    "membership_basic_sources": "Supported Sources: All formats (including adult sites)",
    "membership_basic_desc": "Support for more video sources and adult content",
    
    "membership_premium": "Premium Member",
    "membership_premium_uses": "Usage: Unlimited",
    "membership_premium_sources": "Supported Sources: All formats (including adult sites)",
    "membership_premium_desc": "Unlimited viewing, supports all video sources and formats, suitable for advanced users",
    
    "membership_upgrade_tip": "Key Point: Upgrade membership to unlock adult website videos, more streaming and cloud sources, and remove daily usage limits.",
  },
  
  "zh-TW": {
    "video_source_support_title": "支援影片來源",
    "video_source_direct": "直接影片檔",
    "video_source_direct_desc": "MP4、HLS (.m3u8)",
    "video_source_platforms": "影片平台",
    "video_source_platforms_desc": "YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    "video_source_social": "社交媒體影片",
    "video_source_social_desc": "Facebook、Instagram 等",
    "video_source_adult": "成人網站影片（需滿 18 歲）",
    "video_source_adult_desc": "Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbang 等",
    "video_source_cloud": "雲端影片",
    "video_source_cloud_desc": "Google Drive、Dropbox、OneDrive、Mega",
    "video_source_local": "自有影片",
    "video_source_local_desc": "本地檔案 MP4、MKV、AVI、MOV 等",
    "video_source_direct_link": "網址直鏈",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "提示：成人網站會跳出年齡驗證，請確認您已滿 18 歲。",
    
    "video_format_support_title": "支援影片格式",
    "video_format_container": "封裝格式",
    "video_format_container_desc": "MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    "video_format_streaming": "串流協議",
    "video_format_streaming_desc": "HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    "video_format_video_codec": "視訊編碼",
    "video_format_video_codec_desc": "H.264、H.265 (HEVC)、VP8、VP9、AV1",
    "video_format_audio_codec": "音訊編碼",
    "video_format_audio_codec_desc": "AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    
    "usage_notice_title": "使用注意事項",
    "usage_notice_age": "成人內容僅限滿 18 歲（或當地法定年齡）",
    "usage_notice_illegal": "請勿輸入非法或盜版影片",
    "usage_notice_law": "遵守當地法律，部分地區成人內容可能受限",
    "usage_notice_privacy": "App 不會保存瀏覽記錄",
    
    "membership_brief_title": "會員簡易說明",
    "membership_free_trial": "免費試用",
    "membership_free_trial_uses": "使用次數：2000 次",
    "membership_free_trial_sources": "支援影片來源：全部格式皆可試用",
    "membership_free_trial_desc": "初次體驗，所有格式皆可試用",
    
    "membership_free": "免費會員",
    "membership_free_uses": "使用次數：每日 30 次",
    "membership_free_sources": "支援影片來源：MP4、WebM、OGG、OGV、YouTube、Vimeo",
    "membership_free_desc": "每日免費額度，入門使用",
    
    "membership_basic": "基礎會員",
    "membership_basic_uses": "使用次數：每月 1500 次 + 每日 40 次",
    "membership_basic_sources": "支援影片來源：全部格式（含成人網站）",
    "membership_basic_desc": "支援更多影片來源與成人內容",
    
    "membership_premium": "高級會員",
    "membership_premium_uses": "使用次數：無限制",
    "membership_premium_sources": "支援影片來源：全部格式（含成人網站）",
    "membership_premium_desc": "無限制觀看，支援全部影片來源與格式，適合進階用戶",
    
    "membership_upgrade_tip": "重點提示：升級會員即可解鎖成人網站影片、更多串流與雲端來源，並移除每日使用次數限制。",
  },
  
  "zh-CN": {
    "video_source_support_title": "支持视频来源",
    "video_source_direct": "直接视频文件",
    "video_source_direct_desc": "MP4、HLS (.m3u8)",
    "video_source_platforms": "视频平台",
    "video_source_platforms_desc": "YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    "video_source_social": "社交媒体视频",
    "video_source_social_desc": "Facebook、Instagram 等",
    "video_source_adult": "成人网站视频（需满 18 岁）",
    "video_source_adult_desc": "Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbang 等",
    "video_source_cloud": "云端视频",
    "video_source_cloud_desc": "Google Drive、Dropbox、OneDrive、Mega",
    "video_source_local": "本地视频",
    "video_source_local_desc": "本地文件 MP4、MKV、AVI、MOV 等",
    "video_source_direct_link": "网址直链",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "提示：成人网站会弹出年龄验证，请确认您已满 18 岁。",
    
    "video_format_support_title": "支持视频格式",
    "video_format_container": "封装格式",
    "video_format_container_desc": "MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    "video_format_streaming": "流媒体协议",
    "video_format_streaming_desc": "HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    "video_format_video_codec": "视频编码",
    "video_format_video_codec_desc": "H.264、H.265 (HEVC)、VP8、VP9、AV1",
    "video_format_audio_codec": "音频编码",
    "video_format_audio_codec_desc": "AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    
    "usage_notice_title": "使用注意事项",
    "usage_notice_age": "成人内容仅限满 18 岁（或当地法定年龄）",
    "usage_notice_illegal": "请勿输入非法或盗版视频",
    "usage_notice_law": "遵守当地法律，部分地区成人内容可能受限",
    "usage_notice_privacy": "App 不会保存浏览记录",
    
    "membership_brief_title": "会员简易说明",
    "membership_free_trial": "免费试用",
    "membership_free_trial_uses": "使用次数：2000 次",
    "membership_free_trial_sources": "支持视频来源：全部格式皆可试用",
    "membership_free_trial_desc": "初次体验，所有格式皆可试用",
    
    "membership_free": "免费会员",
    "membership_free_uses": "使用次数：每日 30 次",
    "membership_free_sources": "支持视频来源：MP4、WebM、OGG、OGV、YouTube、Vimeo",
    "membership_free_desc": "每日免费额度，入门使用",
    
    "membership_basic": "基础会员",
    "membership_basic_uses": "使用次数：每月 1500 次 + 每日 40 次",
    "membership_basic_sources": "支持视频来源：全部格式（含成人网站）",
    "membership_basic_desc": "支持更多视频来源与成人内容",
    
    "membership_premium": "高级会员",
    "membership_premium_uses": "使用次数：无限制",
    "membership_premium_sources": "支持视频来源：全部格式（含成人网站）",
    "membership_premium_desc": "无限制观看，支持全部视频来源与格式，适合进阶用户",
    
    "membership_upgrade_tip": "重点提示：升级会员即可解锁成人网站视频、更多流媒体与云端来源，并移除每日使用次数限制。",
  },
  
  "es": {
    "video_source_support_title": "Fuentes de Video Compatibles",
    "video_source_direct": "Archivos de Video Directos",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Plataformas de Video",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Videos de Redes Sociales",
    "video_source_social_desc": "Facebook, Instagram, etc.",
    "video_source_adult": "Sitios para Adultos (solo mayores de 18)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "video_source_cloud": "Videos en la Nube",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Videos Locales",
    "video_source_local_desc": "Archivos locales MP4, MKV, AVI, MOV, etc.",
    "video_source_direct_link": "Enlaces Directos",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Nota: Los sitios para adultos requieren verificación de edad. Confirme que tiene 18+.",
    
    "video_format_support_title": "Formatos de Video Compatibles",
    "video_format_container": "Formatos de Contenedor",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Protocolos de Transmisión",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Códecs de Video",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Códecs de Audio",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Aviso de Uso",
    "usage_notice_age": "El contenido para adultos está restringido a mayores de 18 años (o edad legal local)",
    "usage_notice_illegal": "No ingrese videos ilegales o pirateados",
    "usage_notice_law": "Cumpla con las leyes locales, el contenido para adultos puede estar restringido en algunas regiones",
    "usage_notice_privacy": "La aplicación no guarda el historial de navegación",
    
    "membership_brief_title": "Resumen de Membresías",
    "membership_free_trial": "Prueba Gratuita",
    "membership_free_trial_uses": "Uso: 2000 veces",
    "membership_free_trial_sources": "Fuentes Compatibles: Todos los formatos disponibles para prueba",
    "membership_free_trial_desc": "Primera experiencia, todos los formatos disponibles",
    
    "membership_free": "Miembro Gratuito",
    "membership_free_uses": "Uso: 30 veces por día",
    "membership_free_sources": "Fuentes Compatibles: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Cuota diaria gratuita, uso básico",
    
    "membership_basic": "Miembro Básico",
    "membership_basic_uses": "Uso: 1500 veces por mes + 40 veces por día",
    "membership_basic_sources": "Fuentes Compatibles: Todos los formatos (incluidos sitios para adultos)",
    "membership_basic_desc": "Soporte para más fuentes de video y contenido para adultos",
    
    "membership_premium": "Miembro Premium",
    "membership_premium_uses": "Uso: Ilimitado",
    "membership_premium_sources": "Fuentes Compatibles: Todos los formatos (incluidos sitios para adultos)",
    "membership_premium_desc": "Visualización ilimitada, compatible con todas las fuentes y formatos de video, adecuado para usuarios avanzados",
    
    "membership_upgrade_tip": "Punto Clave: Actualice la membresía para desbloquear videos de sitios para adultos, más fuentes de transmisión y nube, y eliminar límites de uso diario.",
  },
  
  "pt-BR": {
    "video_source_support_title": "Fontes de Vídeo Suportadas",
    "video_source_direct": "Arquivos de Vídeo Diretos",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Plataformas de Vídeo",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Vídeos de Redes Sociais",
    "video_source_social_desc": "Facebook, Instagram, etc.",
    "video_source_adult": "Sites Adultos (apenas 18+)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "video_source_cloud": "Vídeos na Nuvem",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Vídeos Locais",
    "video_source_local_desc": "Arquivos locais MP4, MKV, AVI, MOV, etc.",
    "video_source_direct_link": "Links Diretos",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Nota: Sites adultos exigem verificação de idade. Confirme que você tem 18+.",
    
    "video_format_support_title": "Formatos de Vídeo Suportados",
    "video_format_container": "Formatos de Contêiner",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Protocolos de Streaming",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Codecs de Vídeo",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Codecs de Áudio",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Aviso de Uso",
    "usage_notice_age": "Conteúdo adulto é restrito a maiores de 18 anos (ou idade legal local)",
    "usage_notice_illegal": "Não insira vídeos ilegais ou pirateados",
    "usage_notice_law": "Cumpra as leis locais, conteúdo adulto pode ser restrito em algumas regiões",
    "usage_notice_privacy": "O aplicativo não salva o histórico de navegação",
    
    "membership_brief_title": "Resumo de Assinaturas",
    "membership_free_trial": "Teste Gratuito",
    "membership_free_trial_uses": "Uso: 2000 vezes",
    "membership_free_trial_sources": "Fontes Suportadas: Todos os formatos disponíveis para teste",
    "membership_free_trial_desc": "Primeira experiência, todos os formatos disponíveis",
    
    "membership_free": "Membro Gratuito",
    "membership_free_uses": "Uso: 30 vezes por dia",
    "membership_free_sources": "Fontes Suportadas: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Cota diária gratuita, uso básico",
    
    "membership_basic": "Membro Básico",
    "membership_basic_uses": "Uso: 1500 vezes por mês + 40 vezes por dia",
    "membership_basic_sources": "Fontes Suportadas: Todos os formatos (incluindo sites adultos)",
    "membership_basic_desc": "Suporte para mais fontes de vídeo e conteúdo adulto",
    
    "membership_premium": "Membro Premium",
    "membership_premium_uses": "Uso: Ilimitado",
    "membership_premium_sources": "Fontes Suportadas: Todos os formatos (incluindo sites adultos)",
    "membership_premium_desc": "Visualização ilimitada, suporta todas as fontes e formatos de vídeo, adequado para usuários avançados",
    
    "membership_upgrade_tip": "Ponto Chave: Atualize a assinatura para desbloquear vídeos de sites adultos, mais fontes de streaming e nuvem, e remover limites de uso diário.",
  },
  
  "pt": {
    "video_source_support_title": "Fontes de Vídeo Suportadas",
    "video_source_direct": "Ficheiros de Vídeo Diretos",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Plataformas de Vídeo",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Vídeos de Redes Sociais",
    "video_source_social_desc": "Facebook, Instagram, etc.",
    "video_source_adult": "Sites Adultos (apenas 18+)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "video_source_cloud": "Vídeos na Nuvem",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Vídeos Locais",
    "video_source_local_desc": "Ficheiros locais MP4, MKV, AVI, MOV, etc.",
    "video_source_direct_link": "Links Diretos",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Nota: Sites adultos exigem verificação de idade. Confirme que tem 18+.",
    
    "video_format_support_title": "Formatos de Vídeo Suportados",
    "video_format_container": "Formatos de Contentor",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Protocolos de Streaming",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Codecs de Vídeo",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Codecs de Áudio",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Aviso de Utilização",
    "usage_notice_age": "Conteúdo adulto é restrito a maiores de 18 anos (ou idade legal local)",
    "usage_notice_illegal": "Não insira vídeos ilegais ou pirateados",
    "usage_notice_law": "Cumpra as leis locais, conteúdo adulto pode ser restrito em algumas regiões",
    "usage_notice_privacy": "A aplicação não guarda o histórico de navegação",
    
    "membership_brief_title": "Resumo de Assinaturas",
    "membership_free_trial": "Teste Gratuito",
    "membership_free_trial_uses": "Utilização: 2000 vezes",
    "membership_free_trial_sources": "Fontes Suportadas: Todos os formatos disponíveis para teste",
    "membership_free_trial_desc": "Primeira experiência, todos os formatos disponíveis",
    
    "membership_free": "Membro Gratuito",
    "membership_free_uses": "Utilização: 30 vezes por dia",
    "membership_free_sources": "Fontes Suportadas: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Quota diária gratuita, utilização básica",
    
    "membership_basic": "Membro Básico",
    "membership_basic_uses": "Utilização: 1500 vezes por mês + 40 vezes por dia",
    "membership_basic_sources": "Fontes Suportadas: Todos os formatos (incluindo sites adultos)",
    "membership_basic_desc": "Suporte para mais fontes de vídeo e conteúdo adulto",
    
    "membership_premium": "Membro Premium",
    "membership_premium_uses": "Utilização: Ilimitado",
    "membership_premium_sources": "Fontes Suportadas: Todos os formatos (incluindo sites adultos)",
    "membership_premium_desc": "Visualização ilimitada, suporta todas as fontes e formatos de vídeo, adequado para utilizadores avançados",
    
    "membership_upgrade_tip": "Ponto Chave: Atualize a assinatura para desbloquear vídeos de sites adultos, mais fontes de streaming e nuvem, e remover limites de utilização diária.",
  },
  
  "de": {
    "video_source_support_title": "Unterstützte Videoquellen",
    "video_source_direct": "Direkte Videodateien",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Videoplattformen",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Social-Media-Videos",
    "video_source_social_desc": "Facebook, Instagram, usw.",
    "video_source_adult": "Erwachsenen-Websites (nur 18+)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, usw.",
    "video_source_cloud": "Cloud-Videos",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Lokale Videos",
    "video_source_local_desc": "Lokale Dateien MP4, MKV, AVI, MOV, usw.",
    "video_source_direct_link": "Direkte Links",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Hinweis: Erwachsenen-Websites erfordern Altersverifizierung. Bitte bestätigen Sie, dass Sie 18+ sind.",
    
    "video_format_support_title": "Unterstützte Videoformate",
    "video_format_container": "Container-Formate",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Streaming-Protokolle",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Video-Codecs",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Audio-Codecs",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Nutzungshinweis",
    "usage_notice_age": "Erwachseneninhalte sind auf 18+ (oder lokales gesetzliches Alter) beschränkt",
    "usage_notice_illegal": "Geben Sie keine illegalen oder raubkopierten Videos ein",
    "usage_notice_law": "Befolgen Sie lokale Gesetze, Erwachseneninhalte können in einigen Regionen eingeschränkt sein",
    "usage_notice_privacy": "Die App speichert keinen Browserverlauf",
    
    "membership_brief_title": "Mitgliedschaftsübersicht",
    "membership_free_trial": "Kostenlose Testversion",
    "membership_free_trial_uses": "Nutzung: 2000 Mal",
    "membership_free_trial_sources": "Unterstützte Quellen: Alle Formate zum Testen verfügbar",
    "membership_free_trial_desc": "Erste Erfahrung, alle Formate verfügbar",
    
    "membership_free": "Kostenloses Mitglied",
    "membership_free_uses": "Nutzung: 30 Mal pro Tag",
    "membership_free_sources": "Unterstützte Quellen: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Tägliches kostenloses Kontingent, Einstiegsnutzung",
    
    "membership_basic": "Basis-Mitglied",
    "membership_basic_uses": "Nutzung: 1500 Mal pro Monat + 40 Mal pro Tag",
    "membership_basic_sources": "Unterstützte Quellen: Alle Formate (einschließlich Erwachsenen-Websites)",
    "membership_basic_desc": "Unterstützung für mehr Videoquellen und Erwachseneninhalte",
    
    "membership_premium": "Premium-Mitglied",
    "membership_premium_uses": "Nutzung: Unbegrenzt",
    "membership_premium_sources": "Unterstützte Quellen: Alle Formate (einschließlich Erwachsenen-Websites)",
    "membership_premium_desc": "Unbegrenzte Anzeige, unterstützt alle Videoquellen und -formate, geeignet für fortgeschrittene Benutzer",
    
    "membership_upgrade_tip": "Wichtiger Punkt: Aktualisieren Sie die Mitgliedschaft, um Videos von Erwachsenen-Websites, mehr Streaming- und Cloud-Quellen freizuschalten und tägliche Nutzungslimits zu entfernen.",
  },
  
  "fr": {
    "video_source_support_title": "Sources Vidéo Prises en Charge",
    "video_source_direct": "Fichiers Vidéo Directs",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Plateformes Vidéo",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Vidéos des Réseaux Sociaux",
    "video_source_social_desc": "Facebook, Instagram, etc.",
    "video_source_adult": "Sites pour Adultes (18+ uniquement)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang, etc.",
    "video_source_cloud": "Vidéos Cloud",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Vidéos Locales",
    "video_source_local_desc": "Fichiers locaux MP4, MKV, AVI, MOV, etc.",
    "video_source_direct_link": "Liens Directs",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Note : Les sites pour adultes nécessitent une vérification d'âge. Veuillez confirmer que vous avez 18+.",
    
    "video_format_support_title": "Formats Vidéo Pris en Charge",
    "video_format_container": "Formats de Conteneur",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Protocoles de Streaming",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Codecs Vidéo",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Codecs Audio",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Avis d'Utilisation",
    "usage_notice_age": "Le contenu pour adultes est réservé aux 18+ (ou âge légal local)",
    "usage_notice_illegal": "Ne saisissez pas de vidéos illégales ou piratées",
    "usage_notice_law": "Respectez les lois locales, le contenu pour adultes peut être restreint dans certaines régions",
    "usage_notice_privacy": "L'application ne sauvegarde pas l'historique de navigation",
    
    "membership_brief_title": "Aperçu des Abonnements",
    "membership_free_trial": "Essai Gratuit",
    "membership_free_trial_uses": "Utilisation : 2000 fois",
    "membership_free_trial_sources": "Sources Prises en Charge : Tous les formats disponibles pour l'essai",
    "membership_free_trial_desc": "Première expérience, tous les formats disponibles",
    
    "membership_free": "Membre Gratuit",
    "membership_free_uses": "Utilisation : 30 fois par jour",
    "membership_free_sources": "Sources Prises en Charge : MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Quota quotidien gratuit, utilisation de base",
    
    "membership_basic": "Membre Basique",
    "membership_basic_uses": "Utilisation : 1500 fois par mois + 40 fois par jour",
    "membership_basic_sources": "Sources Prises en Charge : Tous les formats (y compris les sites pour adultes)",
    "membership_basic_desc": "Support pour plus de sources vidéo et de contenu pour adultes",
    
    "membership_premium": "Membre Premium",
    "membership_premium_uses": "Utilisation : Illimitée",
    "membership_premium_sources": "Sources Prises en Charge : Tous les formats (y compris les sites pour adultes)",
    "membership_premium_desc": "Visionnage illimité, prend en charge toutes les sources et formats vidéo, adapté aux utilisateurs avancés",
    
    "membership_upgrade_tip": "Point Clé : Mettez à niveau l'abonnement pour débloquer les vidéos des sites pour adultes, plus de sources de streaming et cloud, et supprimer les limites d'utilisation quotidiennes.",
  },
  
  "ru": {
    "video_source_support_title": "Поддерживаемые Источники Видео",
    "video_source_direct": "Прямые Видеофайлы",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "Видеоплатформы",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "Видео из Социальных Сетей",
    "video_source_social_desc": "Facebook, Instagram и т.д.",
    "video_source_adult": "Сайты для Взрослых (только 18+)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang и т.д.",
    "video_source_cloud": "Облачные Видео",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "Локальные Видео",
    "video_source_local_desc": "Локальные файлы MP4, MKV, AVI, MOV и т.д.",
    "video_source_direct_link": "Прямые Ссылки",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "Примечание: Сайты для взрослых требуют подтверждения возраста. Подтвердите, что вам 18+.",
    
    "video_format_support_title": "Поддерживаемые Форматы Видео",
    "video_format_container": "Форматы Контейнеров",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "Протоколы Потоковой Передачи",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "Видеокодеки",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "Аудиокодеки",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "Уведомление об Использовании",
    "usage_notice_age": "Контент для взрослых ограничен для лиц старше 18 лет (или местного законного возраста)",
    "usage_notice_illegal": "Не вводите нелегальные или пиратские видео",
    "usage_notice_law": "Соблюдайте местные законы, контент для взрослых может быть ограничен в некоторых регионах",
    "usage_notice_privacy": "Приложение не сохраняет историю просмотров",
    
    "membership_brief_title": "Обзор Подписок",
    "membership_free_trial": "Бесплатная Пробная Версия",
    "membership_free_trial_uses": "Использование: 2000 раз",
    "membership_free_trial_sources": "Поддерживаемые Источники: Все форматы доступны для пробной версии",
    "membership_free_trial_desc": "Первый опыт, все форматы доступны",
    
    "membership_free": "Бесплатный Участник",
    "membership_free_uses": "Использование: 30 раз в день",
    "membership_free_sources": "Поддерживаемые Источники: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "Ежедневная бесплатная квота, базовое использование",
    
    "membership_basic": "Базовый Участник",
    "membership_basic_uses": "Использование: 1500 раз в месяц + 40 раз в день",
    "membership_basic_sources": "Поддерживаемые Источники: Все форматы (включая сайты для взрослых)",
    "membership_basic_desc": "Поддержка большего количества источников видео и контента для взрослых",
    
    "membership_premium": "Премиум Участник",
    "membership_premium_uses": "Использование: Неограниченно",
    "membership_premium_sources": "Поддерживаемые Источники: Все форматы (включая сайты для взрослых)",
    "membership_premium_desc": "Неограниченный просмотр, поддерживает все источники и форматы видео, подходит для продвинутых пользователей",
    
    "membership_upgrade_tip": "Ключевой Момент: Обновите подписку, чтобы разблокировать видео с сайтов для взрослых, больше источников потоковой передачи и облачных хранилищ, и снять ежедневные ограничения на использование.",
  },
  
  "ar": {
    "video_source_support_title": "مصادر الفيديو المدعومة",
    "video_source_direct": "ملفات الفيديو المباشرة",
    "video_source_direct_desc": "MP4، HLS (.m3u8)",
    "video_source_platforms": "منصات الفيديو",
    "video_source_platforms_desc": "YouTube، Vimeo، Twitch، Facebook، Dailymotion",
    "video_source_social": "فيديوهات وسائل التواصل الاجتماعي",
    "video_source_social_desc": "Facebook، Instagram، إلخ",
    "video_source_adult": "مواقع البالغين (18+ فقط)",
    "video_source_adult_desc": "Pornhub، Xvideos، Xnxx، Redtube، Tktube، YouPorn، Spankbang، إلخ",
    "video_source_cloud": "فيديوهات السحابة",
    "video_source_cloud_desc": "Google Drive، Dropbox، OneDrive، Mega",
    "video_source_local": "الفيديوهات المحلية",
    "video_source_local_desc": "ملفات محلية MP4، MKV، AVI، MOV، إلخ",
    "video_source_direct_link": "روابط مباشرة",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "ملاحظة: تتطلب مواقع البالغين التحقق من العمر. يرجى تأكيد أنك 18+.",
    
    "video_format_support_title": "تنسيقات الفيديو المدعومة",
    "video_format_container": "تنسيقات الحاوية",
    "video_format_container_desc": "MP4، MKV، AVI، MOV، FLV، WMV، WebM، 3GP، TS",
    "video_format_streaming": "بروتوكولات البث",
    "video_format_streaming_desc": "HLS (.m3u8)، MPEG-DASH (.mpd)، RTMP / RTSP، Progressive MP4",
    "video_format_video_codec": "ترميزات الفيديو",
    "video_format_video_codec_desc": "H.264، H.265 (HEVC)، VP8، VP9، AV1",
    "video_format_audio_codec": "ترميزات الصوت",
    "video_format_audio_codec_desc": "AAC، MP3، Opus، Vorbis، AC3، E-AC3",
    
    "usage_notice_title": "إشعار الاستخدام",
    "usage_notice_age": "محتوى البالغين مقيد لمن هم فوق 18 عامًا (أو السن القانوني المحلي)",
    "usage_notice_illegal": "لا تدخل مقاطع فيديو غير قانونية أو مقرصنة",
    "usage_notice_law": "الامتثال للقوانين المحلية، قد يكون محتوى البالغين مقيدًا في بعض المناطق",
    "usage_notice_privacy": "التطبيق لا يحفظ سجل التصفح",
    
    "membership_brief_title": "نظرة عامة على العضوية",
    "membership_free_trial": "تجربة مجانية",
    "membership_free_trial_uses": "الاستخدام: 2000 مرة",
    "membership_free_trial_sources": "المصادر المدعومة: جميع التنسيقات متاحة للتجربة",
    "membership_free_trial_desc": "التجربة الأولى، جميع التنسيقات متاحة",
    
    "membership_free": "عضو مجاني",
    "membership_free_uses": "ال��ستخدام: 30 مرة يوميًا",
    "membership_free_sources": "المصادر المدعومة: MP4، WebM، OGG، OGV، YouTube، Vimeo",
    "membership_free_desc": "حصة يومية مجانية، استخدام أساسي",
    
    "membership_basic": "عضو أساسي",
    "membership_basic_uses": "الاستخدام: 1500 مرة شهريًا + 40 مرة يوميًا",
    "membership_basic_sources": "المصادر المدعومة: جميع التنسيقات (بما في ذلك مواقع البالغين)",
    "membership_basic_desc": "دعم المزيد من مصادر الفيديو ومحتوى البالغين",
    
    "membership_premium": "عضو مميز",
    "membership_premium_uses": "الاستخدام: غير محدود",
    "membership_premium_sources": "المصادر المدعومة: جميع التنسيقات (بما في ذلك مواقع البالغين)",
    "membership_premium_desc": "مشاهدة غير محدودة، يدعم جميع مصادر وتنسيقات الفيديو، مناسب للمستخدمين المتقدمين",
    
    "membership_upgrade_tip": "نقطة رئيسية: قم بترقية العضوية لفتح مقاطع فيديو من مواقع البالغين، والمزيد من مصادر البث والسحابة، وإزالة حدود الاستخدام اليومية.",
  },
  
  "ja": {
    "video_source_support_title": "サポートさ���ている動画ソース",
    "video_source_direct": "直接動画ファイル",
    "video_source_direct_desc": "MP4、HLS (.m3u8)",
    "video_source_platforms": "動画プラットフォーム",
    "video_source_platforms_desc": "YouTube、Vimeo、Twitch、Facebook、Dailymotion",
    "video_source_social": "ソーシャルメディア動画",
    "video_source_social_desc": "Facebook、Instagramなど",
    "video_source_adult": "アダルトサイト（18歳以上のみ）",
    "video_source_adult_desc": "Pornhub、Xvideos、Xnxx、Redtube、Tktube、YouPorn、Spankbangなど",
    "video_source_cloud": "クラウド動画",
    "video_source_cloud_desc": "Google Drive、Dropbox、OneDrive、Mega",
    "video_source_local": "ローカル動画",
    "video_source_local_desc": "ローカルファイル MP4、MKV、AVI、MOVなど",
    "video_source_direct_link": "直接リンク",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "注意：アダルトサイトは年齢確認が必要です。18歳以上であることを確認してください。",
    
    "video_format_support_title": "サポートされている動画形式",
    "video_format_container": "コンテナ形式",
    "video_format_container_desc": "MP4、MKV、AVI、MOV、FLV、WMV、WebM、3GP、TS",
    "video_format_streaming": "ストリーミングプロトコル",
    "video_format_streaming_desc": "HLS (.m3u8)、MPEG-DASH (.mpd)、RTMP / RTSP、Progressive MP4",
    "video_format_video_codec": "ビデオコーデック",
    "video_format_video_codec_desc": "H.264、H.265 (HEVC)、VP8、VP9、AV1",
    "video_format_audio_codec": "オーディオコーデック",
    "video_format_audio_codec_desc": "AAC、MP3、Opus、Vorbis、AC3、E-AC3",
    
    "usage_notice_title": "使用上の注意",
    "usage_notice_age": "アダルトコンテンツは18歳以上（または現地の法定年齢）に制限されています",
    "usage_notice_illegal": "違法または海賊版の動画を入力しないでください",
    "usage_notice_law": "現地の法律を遵守してください。一部の地域ではアダルトコンテンツが制限される場合があります",
    "usage_notice_privacy": "アプリは閲覧履歴を保存しません",
    
    "membership_brief_title": "メンバーシップ概要",
    "membership_free_trial": "無料トライアル",
    "membership_free_trial_uses": "使用回数：2000回",
    "membership_free_trial_sources": "サポートされているソース：すべての形式がトライアル可能",
    "membership_free_trial_desc": "初回体験、すべての形式が利用可能",
    
    "membership_free": "無料メンバー",
    "membership_free_uses": "使用回数：1日30回",
    "membership_free_sources": "サポートされているソース：MP4、WebM、OGG、OGV、YouTube、Vimeo",
    "membership_free_desc": "毎日の無料枠、基本的な使用",
    
    "membership_basic": "ベーシックメンバー",
    "membership_basic_uses": "使用回数：月1500回 + 1日40回",
    "membership_basic_sources": "サポートされているソース：すべての形式（アダルトサイトを含む）",
    "membership_basic_desc": "より多くの動画ソースとアダルトコ���テンツをサポート",
    
    "membership_premium": "プレミアムメンバー",
    "membership_premium_uses": "使用回数：無制限",
    "membership_premium_sources": "サポートされているソース：すべての形式（アダルトサイトを含む）",
    "membership_premium_desc": "無制限の視聴、すべての動画ソースと形式をサポート、上級ユーザーに適しています",
    
    "membership_upgrade_tip": "重要なポイント：メンバーシップをアップグレードして、アダルトサイトの動画、より多くのストリーミングとクラウドソースをアンロックし、毎日の使用制限を削除します。",
  },
  
  "ko": {
    "video_source_support_title": "지원되는 비디오 소스",
    "video_source_direct": "직접 비디오 파일",
    "video_source_direct_desc": "MP4, HLS (.m3u8)",
    "video_source_platforms": "비디오 플랫폼",
    "video_source_platforms_desc": "YouTube, Vimeo, Twitch, Facebook, Dailymotion",
    "video_source_social": "소셜 미디어 비디오",
    "video_source_social_desc": "Facebook, Instagram 등",
    "video_source_adult": "성인 사이트 (18세 이상만)",
    "video_source_adult_desc": "Pornhub, Xvideos, Xnxx, Redtube, Tktube, YouPorn, Spankbang 등",
    "video_source_cloud": "클라우드 비디오",
    "video_source_cloud_desc": "Google Drive, Dropbox, OneDrive, Mega",
    "video_source_local": "로컬 비디오",
    "video_source_local_desc": "로컬 파일 MP4, MKV, AVI, MOV 등",
    "video_source_direct_link": "직접 링크",
    "video_source_direct_link_desc": "M3U8 / HLS / RTMP / DASH",
    "video_source_age_notice": "참고: 성인 사이트는 연령 확인이 필요합니다. 18세 이상임을 확인하세요.",
    
    "video_format_support_title": "지원되는 비디오 형식",
    "video_format_container": "컨테이너 형식",
    "video_format_container_desc": "MP4, MKV, AVI, MOV, FLV, WMV, WebM, 3GP, TS",
    "video_format_streaming": "스트리밍 프로토콜",
    "video_format_streaming_desc": "HLS (.m3u8), MPEG-DASH (.mpd), RTMP / RTSP, Progressive MP4",
    "video_format_video_codec": "비디오 코덱",
    "video_format_video_codec_desc": "H.264, H.265 (HEVC), VP8, VP9, AV1",
    "video_format_audio_codec": "오디오 코덱",
    "video_format_audio_codec_desc": "AAC, MP3, Opus, Vorbis, AC3, E-AC3",
    
    "usage_notice_title": "사용 주의사항",
    "usage_notice_age": "성인 콘텐츠는 18세 이상(또는 현지 법정 연령)으로 제한됩니다",
    "usage_notice_illegal": "불법 또는 해적판 비디오를 입력하지 마세요",
    "usage_notice_law": "현지 법률을 준수하세요. 일부 지역에서는 성인 콘텐츠가 제한될 수 있습니다",
    "usage_notice_privacy": "앱은 검색 기록을 저장하지 않습니다",
    
    "membership_brief_title": "멤버십 개요",
    "membership_free_trial": "무료 체험",
    "membership_free_trial_uses": "사용 횟수: 2000회",
    "membership_free_trial_sources": "지원되는 소스: 모든 형식 체험 가능",
    "membership_free_trial_desc": "첫 경험, 모든 형식 사용 가능",
    
    "membership_free": "무료 회원",
    "membership_free_uses": "사용 횟수: 하루 30회",
    "membership_free_sources": "지원되는 소스: MP4, WebM, OGG, OGV, YouTube, Vimeo",
    "membership_free_desc": "일일 무료 할당량, 기본 사용",
    
    "membership_basic": "기본 회원",
    "membership_basic_uses": "사용 횟수: 월 1500회 + 하루 40회",
    "membership_basic_sources": "지원되는 소스: 모든 형식 (성인 사이트 포함)",
    "membership_basic_desc": "더 많은 비디오 소스 및 성인 콘텐츠 지원",
    
    "membership_premium": "프리미엄 회원",
    "membership_premium_uses": "사용 횟수: 무제한",
    "membership_premium_sources": "지원되는 소스: 모든 형식 (성인 사이트 포함)",
    "membership_premium_desc": "무제한 시청, 모든 비디오 소스 및 형식 지원, 고급 사용자에게 적합",
    
    "membership_upgrade_tip": "핵심 포인트: 멤버십을 업그레이드하여 성인 사이트 비디오, 더 많은 스트리밍 및 클라우드 소스를 잠금 해제하고 일일 사용 제한을 제거하세요.",
  },
};

// Function to update language file
function updateLanguageFile(langCode) {
  const filePath = path.join('l10n', `${langCode}.json`);
  
  try {
    // Read existing file
    const existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge with new keys
    const updatedContent = {
      ...existingContent,
      ...newKeys[langCode]
    };
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedContent, null, 2), 'utf8');
    console.log(`✅ Updated ${langCode}.json`);
  } catch (error) {
    console.error(`❌ Error updating ${langCode}.json:`, error.message);
  }
}

// Update all language files
const languages = ['en', 'zh-TW', 'zh-CN', 'es', 'pt-BR', 'pt', 'de', 'fr', 'ru', 'ar', 'ja', 'ko'];

console.log('🚀 Starting comprehensive video source translation updates...\n');

languages.forEach(lang => {
  updateLanguageFile(lang);
});

console.log('\n✨ All language files have been updated with comprehensive video source information!');
