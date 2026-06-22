// Konfigurasi DTSEN Desa.
//
// apiUrl KOSONG  -> Mode Lokal: data tersimpan di perangkat (localStorage), offline.
// apiUrl DIISI   -> Mode Server: Google Sheets sebagai database via Apps Script.
//                   Tempel URL Web App hasil deploy (lihat server/README.md), mis.
//                   'https://script.google.com/macros/s/AKfycb..../exec'
window.DTSEN_CONFIG = {
  apiUrl: 'https://script.google.com/macros/s/AKfycbyIQMf6bRYfdgPcvLkuqD0UgdjN6a-makhEBSv8gL2dthOzKezHmixX9myWpLaFw7U8eg/exec'
};
