// test-tts.js
import 'dotenv/config';
import { synthesizeSpeech } from './lib/tts.js';

(async () => {
  try {
    // Örnek metin
    const text = 'Merhaba, Ben Extrabet Yapay zeka AI aracınız Bir bonus talebi oluşturmuşsunuz kullanıcı adınıza özel olarak talebinizi sorguluyorum.';
    // Dosya adı: tmp klasörüne kaydedilecek
    const outFile = 'test-intro.mp3';
    
    const filePath = await synthesizeSpeech(text, outFile);
    console.log('Oluşan dosya yolu:', filePath);
  } catch (err) {
    console.error('TTS testi sırasında hata:', err);
  }
})();
