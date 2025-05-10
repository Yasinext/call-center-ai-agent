// lib/call.js

import AsteriskManager from 'asterisk-manager';
import dotenv from 'dotenv';
dotenv.config();

// AMI ayarları .env’den okunuyor
const amiHost = process.env.AMI_HOST;
const amiPort = parseInt(process.env.AMI_PORT, 10);
const amiUser = process.env.AMI_USER;
const amiPass = process.env.AMI_PASS;
const sipTrunk = process.env.SIP_TRUNK_NAME;

// Asterisk Manager Interface (AMI) bağlantısını başlat
const ami = new AsteriskManager(
  amiPort,        // AMI port (örneğin 5038)
  amiHost,        // AMI sunucu adresi
  amiUser,        // manager.conf’daki kullanıcı adı
  amiPass,        // manager.conf’daki şifre
  false           // SSL kullanmıyorsanız false
);

/**
 * Zoiper trunk üzerinden çağrı başlatır.
 * @param {string} toNumber   - Aranacak üyenin telefon numarası (ör. '+905xxxxxxxxx')
 * @param {string} mediaUrl   - Asterisk’in çalacağı .wav/.mp3 dosyasının base adı (uzantısız)
 * @param {string} formId     - İzleme için formId
 * @returns {Promise<object>} - AMI’den gelen yanıt
 */
export function startCall(toNumber, mediaUrl, formId) {
  return new Promise((resolve, reject) => {
    ami.action({
      Action:  'Originate',
      Channel: `SIP/${toNumber}@${sipTrunk}`,  // Örn: SIP/+905xxxxxxxxx@sipprovider
      Context: 'from-internal',                // extensions.conf’daki context
      Exten:    toNumber,                      // extension olarak da numara
      Priority: 1,
      CallerID: toNumber,                      // Zoiper’daki numara kullanıcıya Caller ID olarak düşsün
      Variable:`FORMID=${formId},MEDIA_URL=${mediaUrl}`, // Dialplan’da okunacak değişkenler
      Async:   true
    }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
