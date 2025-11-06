const fs = require('fs');
const path = require('path');
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const languages = {
  'en': {
    playback_speed: 'Playback Speed',
    speed_0_5: '0.5x Speed',
    normal_speed: 'Normal Speed',
    speed_1_25: '1.25x Speed',
    speed_1_5: '1.5x Speed',
    speed_2_0: '2.0x Speed',
    next_video: 'Next Video',
    previous_video: 'Previous Video',
    replay: 'Replay'
  },
  'zh-TW': {
    playback_speed: '播放速度',
    speed_0_5: '0.5倍速',
    normal_speed: '正常速度',
    speed_1_25: '1.25倍速',
    speed_1_5: '1.5倍速',
    speed_2_0: '2.0倍速',
    next_video: '下一個影片',
    previous_video: '上一個影片',
    replay: '重播'
  },
  'zh-CN': {
    playback_speed: '播放速度',
    speed_0_5: '0.5倍速',
    normal_speed: '正常速度',
    speed_1_25: '1.25倍速',
    speed_1_5: '1.5倍速',
    speed_2_0: '2.0倍速',
    next_video: '下一个视频',
    previous_video: '上一个视频',
    replay: '重播'
  },
  'es': {
    playback_speed: 'Velocidad de reproducción',
    speed_0_5: 'Velocidad 0.5x',
    normal_speed: 'Velocidad normal',
    speed_1_25: 'Velocidad 1.25x',
    speed_1_5: 'Velocidad 1.5x',
    speed_2_0: 'Velocidad 2.0x',
    next_video: 'Siguiente video',
    previous_video: 'Video anterior',
    replay: 'Repetir'
  },
  'pt-BR': {
    playback_speed: 'Velocidade de reprodução',
    speed_0_5: 'Velocidade 0.5x',
    normal_speed: 'Velocidade normal',
    speed_1_25: 'Velocidade 1.25x',
    speed_1_5: 'Velocidade 1.5x',
    speed_2_0: 'Velocidade 2.0x',
    next_video: 'Próximo vídeo',
    previous_video: 'Vídeo anterior',
    replay: 'Repetir'
  },
  'pt': {
    playback_speed: 'Velocidade de reprodução',
    speed_0_5: 'Velocidade 0.5x',
    normal_speed: 'Velocidade normal',
    speed_1_25: 'Velocidade 1.25x',
    speed_1_5: 'Velocidade 1.5x',
    speed_2_0: 'Velocidade 2.0x',
    next_video: 'Próximo vídeo',
    previous_video: 'Vídeo anterior',
    replay: 'Repetir'
  },
  'de': {
    playback_speed: 'Wiedergabegeschwindigkeit',
    speed_0_5: '0.5x Geschwindigkeit',
    normal_speed: 'Normale Geschwindigkeit',
    speed_1_25: '1.25x Geschwindigkeit',
    speed_1_5: '1.5x Geschwindigkeit',
    speed_2_0: '2.0x Geschwindigkeit',
    next_video: 'Nächstes Video',
    previous_video: 'Vorheriges Video',
    replay: 'Wiederholen'
  },
  'fr': {
    playback_speed: 'Vitesse de lecture',
    speed_0_5: 'Vitesse 0.5x',
    normal_speed: 'Vitesse normale',
    speed_1_25: 'Vitesse 1.25x',
    speed_1_5: 'Vitesse 1.5x',
    speed_2_0: 'Vitesse 2.0x',
    next_video: 'Vidéo suivante',
    previous_video: 'Vidéo précédente',
    replay: 'Rejouer'
  },
  'ru': {
    playback_speed: 'Скорость воспроизведения',
    speed_0_5: 'Скорость 0.5x',
    normal_speed: 'Нормальная скорость',
    speed_1_25: 'Скорость 1.25x',
    speed_1_5: 'Скорость 1.5x',
    speed_2_0: 'Скорость 2.0x',
    next_video: 'Следующее видео',
    previous_video: 'Предыдущее видео',
    replay: 'Повтор'
  },
  'ar': {
    playback_speed: 'سرعة التشغيل',
    speed_0_5: 'سرعة 0.5',
    normal_speed: 'السرعة العادية',
    speed_1_25: 'سرعة 1.25',
    speed_1_5: 'سرعة 1.5',
    speed_2_0: 'سرعة 2.0',
    next_video: 'الفيديو التالي',
    previous_video: 'الفيديو السابق',
    replay: 'إعادة التشغيل'
  },
  'ja': {
    playback_speed: '再生速度',
    speed_0_5: '0.5倍速',
    normal_speed: '通常速度',
    speed_1_25: '1.25倍速',
    speed_1_5: '1.5倍速',
    speed_2_0: '2.0倍速',
    next_video: '次の動画',
    previous_video: '前の動画',
    replay: 'リプレイ'
  },
  'ko': {
    playback_speed: '재생 속도',
    speed_0_5: '0.5배속',
    normal_speed: '정상 속도',
    speed_1_25: '1.25배속',
    speed_1_5: '1.5배속',
    speed_2_0: '2.0배속',
    next_video: '다음 동영상',
    previous_video: '이전 동영상',
    replay: '다시 재생'
  }
};

function updateLanguageFile(lang, translations) {
  const filePath = path.join(__dirname, '..', 'l10n', `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let updated = false;
    for (const [key, value] of Object.entries(translations)) {
      if (!data[key]) {
        data[key] = value;
        updated = true;
        console.log(`✓ Added "${key}" to ${lang}.json`);
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Updated ${lang}.json`);
    } else {
      console.log(`- No updates needed for ${lang}.json`);
    }
  } catch (error) {
    console.error(`✗ Error updating ${lang}.json:`, error.message);
  }
}

console.log('🌍 Adding missing translation keys from screenshots...\n');

for (const [lang, translations] of Object.entries(languages)) {
  updateLanguageFile(lang, translations);
  console.log('');
}

console.log('✅ Translation update complete!');
