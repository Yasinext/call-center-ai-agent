// lib/tts.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ELEVEN_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
// ElevenLabs dashboard’dan aldığınız Türkçe ses ID’sini buraya yazın:
const VOICE_ID = '5RqXmIU9ikjifeWoXHMG';

if (!API_KEY) {
  throw new Error('ELEVEN_API_KEY .env içinde tanımlı değil');
}

/**
 * Metni NineLabs API ile sese çevirip tmp klasörüne kaydeder.
 * @param {string} text      – Sentezlenecek metin
 * @param {string} outName   – Kaydedilecek dosya adı (örn: "abcd-intro.mp3")
 * @returns {string}         – Oluşturulan dosyanın yolu
 */
export async function synthesizeSpeech(text, outName) {
  const response = await axios.post(
    `${BASE_URL}/${VOICE_ID}`,
    {
      text,
      voice_settings: {
        stability: 0.90,
        similarity_boost: 0.50
      }
    },
    {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    }
  );

  // tmp klasörünü oluştur (varsa atla)
  const outDir = path.resolve(process.cwd(), 'tmp');
  fs.mkdirSync(outDir, { recursive: true });

  // MP3 dosyasını kaydet
  const outPath = path.join(outDir, outName);
  fs.writeFileSync(outPath, response.data);

  return outPath;
}
