/* AUTO-GENERATED from src/* by build.js — do not edit directly. */
// ---------------------------------------------------------------------------
// css(): parse an inline-style string ("a:b;c:d") into a React style object.
// Keeps the design's style strings usable verbatim as style={css("...")}.
// ---------------------------------------------------------------------------
function css(str) {
  const o = {};
  if (!str) return o;
  String(str).split(';').forEach(d => {
    d = d.trim();
    if (!d) return;
    const i = d.indexOf(':');
    if (i < 0) return;
    const k = d.slice(0, i).trim(),
      v = d.slice(i + 1).trim();
    let prop;
    if (k.charAt(0) === '-') {
      prop = k.replace(/^-/, '').replace(/-([a-z])/g, (m, c) => c.toUpperCase());
      prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    } else {
      prop = k.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
    }
    o[prop] = v;
  });
  return o;
}

// ---------------------------------------------------------------------------
// Path helpers for the nested FASIH form ("rumah.lantaiBahan",
// "anggota.2.disabilitas.fisik", "meteran.0.idPelanggan"). Immutable setPath
// clones along the path so React state updates stay pure.
// ---------------------------------------------------------------------------
// Tanggal lokal WITA (UTC+8) dalam format YYYY-MM-DD.
function todayWITA() {
  var d = new Date();
  return new Date(d.getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
function getPath(obj, path) {
  var p = String(path).split('.'),
    c = obj;
  for (var i = 0; i < p.length; i++) {
    if (c == null) return undefined;
    c = c[p[i]];
  }
  return c;
}
function setPath(obj, path, val) {
  var p = String(path).split('.');
  var root = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  var c = root;
  for (var i = 0; i < p.length - 1; i++) {
    var k = p[i];
    var nx = c[k];
    c[k] = Array.isArray(nx) ? nx.slice() : Object.assign({}, nx || {});
    c = c[k];
  }
  c[p[p.length - 1]] = val;
  return root;
}

// ---------------------------------------------------------------------------
// FASIH "Pemutakhiran DTSEN PBI 2026" (moda Aplikasi) — daftar kode jawaban,
// persis seperti kuesioner. Nilai tersimpan = string berkode ("1. ...") agar
// jelas & mudah divalidasi. Dipakai untuk render form & mesin validasi.
// ---------------------------------------------------------------------------
var ORANGE = '#e0701f'; // aksen oranye ala FASIH (dipakai di form kuesioner)
var ORANGE_BG = '#fff6ee';
var KODE = {
  statusKeluarga: ['0. Tidak Ditemukan (STOP)', '1. Ditemukan', '3. Meninggal', '4. Tidak Eligible', '5. Tidak dapat ditemui sampai akhir pendataan'],
  alamatSesuaiKK: ['1. Ya, Sesuai KK', '2. Tidak Sesuai KK'],
  geotagMode: ['1. Geotagging langsung', '2. Input Manual'],
  jenisBangunan: ['1. Rumah tinggal tunggal', '2. Apartemen', '3. Rumah Susun', '4. Rumah Deret', '5. Kos'],
  statusKepemilikan: ['1. Milik sendiri', '2. Kontrak/sewa', '3. Bebas sewa', '4. Dinas', '5. Lainnya'],
  buktiMilik: ['1. SHM', '2. Sertifikat selain SHM (SHGB, SHSRS)', '3. Surat bukti lainnya (Girik, Letter C, dll)', '4. Tidak Punya'],
  lantaiBahan: ['1. Marmer/granit', '2. Keramik', '3. Parket/vinil/permadani', '4. Ubin/tegel/teraso', '5. Kayu/papan', '6. Semen/bata merah', '7. Bambu', '8. Tanah', '9. Lainnya'],
  kondisi: ['1. Baik', '2. Rusak ringan', '3. Rusak sedang', '4. Rusak berat'],
  dindingBahan: ['1. Tembok', '2. Plesteran anyaman bambu/kawat', '3. Kayu/Papan/Gypsum/GRC/Calciboard', '4. Anyaman bambu', '5. Batang kayu', '6. Bambu', '7. Lainnya'],
  atapBahan: ['1. Beton', '2. Genteng', '3. Seng', '4. Asbes', '5. Bambu', '6. Kayu/sirap', '7. Jerami/ijuk/daun daunan/rumbia', '8. Lainnya'],
  fasilitasBAB: ['1. Ada, digunakan oleh anggota keluarga dalam satu rumah', '2. Ada, digunakan bersama oleh anggota keluarga dari beberapa rumah', '3. Ada, di MCK komunal', '4. Ada, di MCK umum/siapapun menggunakan', '5. Ada, anggota keluarga tidak menggunakan', '6. Tidak Ada'],
  jenisKloset: ['1. Leher angsa', '2. Plengsengan dengan tutup', '3. Plengsengan tanpa tutup', '4. Cemplung/cubluk'],
  pembuanganTinja: ['1. Tangki septik', '2. IPAL', '3. Kolam/sawah/sungai/danau/laut', '4. Lubang tanah', '5. Pantai/tanah lapang/kebun', '6. Lainnya'],
  sumberAirMinum: ['1. Air kemasan bermerk', '2. Air isi ulang', '3. Leding', '4. Sumur bor/pompa', '5. Sumur terlindung', '6. Sumur tak terlindung', '7. Mata air terlindung', '8. Mata air tak terlindung', '9. Air permukaan (sungai/danau/waduk/kolam/irigasi)', '10. Air hujan', '11. Lainnya'],
  sumberPenerangan: ['1. Listrik PLN dengan meteran', '2. Listrik PLN tanpa meteran', '3. Listrik Non-PLN', '4. Bukan listrik'],
  daya: ['1. 450 watt', '2. 900 watt', '3. 1.300 watt', '4. 2.200 watt', '5. > 2.200 watt'],
  jenisIdMeteran: ['ID Pelanggan', 'No Meteran'],
  keberadaan: ['1. Tinggal di rumah/tempat tinggal ini', '2. Meninggal', '3. Tidak tinggal bersama keluarga/pindah ke wilayah (daerah lain di Indonesia)', '4. Tidak tinggal bersama keluarga/pindah ke luar negeri', '6. Sudah pisah KK', '7. Tidak ditemukan/Tidak dikenal'],
  domisili: ['1. Sesuai KK dan KTP', '2. Hanya Sesuai KK', '3. Hanya Sesuai KTP', '4. Tidak sesuai dengan KK dan KTP'],
  jk: ['1. Laki-laki', '2. Perempuan'],
  bulan: ['01 - Januari', '02 - Februari', '03 - Maret', '04 - April', '05 - Mei', '06 - Juni', '07 - Juli', '08 - Agustus', '09 - September', '10 - Oktober', '11 - November', '12 - Desember'],
  statusKawin: ['1. Belum kawin', '2. Kawin/nikah', '3. Cerai hidup', '4. Cerai mati'],
  hubungan: ['1. Kepala Keluarga', '2. Istri/Suami', '3. Anak', '4. Menantu', '5. Cucu', '6. Orang Tua', '7. Mertua', '8. Famili Lain', '9. Lainnya'],
  partisipasiSekolah: ['0. Tidak/belum pernah sekolah', '1. Masih sekolah', '2. Tidak bersekolah lagi'],
  pendidikan: ['0. Tidak punya ijazah', '1. SD/sederajat', '2. SMP/sederajat', '3. SMA/sederajat', '4. D1/D2/D3', '5. D4/S1', '6. S2/S3'],
  yaTidakTT: ['1. Ya', '2. Tidak', '9. Tidak Tahu'],
  yaTidak: ['1. Ya', '2. Tidak'],
  statusKerja: ['1. Berusaha sendiri', '2. Berusaha dibantu buruh', '3. Buruh/karyawan/pegawai swasta', '4. ASN/TNI/Polri/BUMN/BUMD/pejabat negara/kades', '5. Pekerja bebas', '6. Pekerja keluarga/tidak dibayar', '9. Tidak tahu'],
  rekening: ['1. Ya untuk usaha', '2. Ya untuk pribadi', '3. Ya untuk usaha dan pribadi', '4. Tidak ada', '9. Tidak tahu']
};
// Blok IV R38 (a–f) & R39 (a–r): item Ya/Tidak per anggota.
var DISABILITAS_ITEMS = [['fisik', 'Disabilitas Fisik'], ['mental', 'Disabilitas Mental'], ['intelektual', 'Disabilitas Intelektual'], ['netra', 'Disabilitas Sensorik Netra'], ['rungu', 'Disabilitas Sensorik Rungu'], ['wicara', 'Disabilitas Sensorik Wicara']];
var KESEHATAN_ITEMS = [['hipertensi', 'Hipertensi (tekanan darah tinggi)'], ['rematik', 'Rematik'], ['asma', 'Asma'], ['jantung', 'Masalah jantung'], ['diabetes', 'Diabetes (kencing manis)'], ['tbc', 'Tuberkulosis (TBC)'], ['stroke', 'Stroke'], ['kanker', 'Kanker atau tumor ganas'], ['ginjal', 'Gagal ginjal'], ['hemofilia', 'Hemofilia'], ['hiv', 'HIV/AIDS'], ['kolesterol', 'Kolestrol'], ['sirosis', 'Sirosis hati'], ['talasemia', 'Talasemia'], ['leukemia', 'Leukemia'], ['alzheimer', 'Alzheimer'], ['lainnya', 'Lainnya'], ['tidakTahu', 'Tidak tahu']];
// Blok III R22 aset bergerak (key,label,satuan) & R23 aset tidak bergerak.
var ASET22 = [['tabungGas3', 'Tabung gas 3 kg', 'unit'], ['tabungGas55', 'Tabung gas 5,5 kg atau lebih', 'unit'], ['kulkas', 'Lemari es/kulkas', 'unit'], ['ac', 'AC', 'unit'], ['emas', 'Emas/perhiasan', 'gram'], ['komputer', 'Komputer/laptop/tablet', 'unit'], ['sepedaMotor', 'Sepeda motor', 'unit'], ['mobil', 'Mobil', 'unit']];
var ASET23 = [['lahanLain', 'Jumlah lahan di tempat lain'], ['bangunanLain', 'Jumlah rumah/bangunan di tempat lain']];

// Skema field Blok II (Perumahan). `when(k)` = skip-logic; tanpa `when` selalu berlaku.
var BLOK2 = [{
  p: 'rumah.jumlahKeluarga',
  r: '5a',
  label: 'Jumlah keluarga yang tinggal dalam 1 rumah/tempat tinggal',
  type: 'number',
  req: true
}, {
  p: 'rumah.jenisBangunan',
  r: '6a',
  label: 'Jenis bangunan tempat tinggal yang ditempati',
  type: 'radio',
  opts: KODE.jenisBangunan,
  req: true
}, {
  p: 'rumah.statusKepemilikan',
  r: '7a',
  label: 'Status kepemilikan bangunan tempat tinggal',
  type: 'radio',
  opts: KODE.statusKepemilikan,
  req: true
}, {
  p: 'rumah.buktiMilik',
  r: '7b',
  label: 'Jenis bukti kepemilikan tanah bangunan tempat tinggal',
  type: 'radio',
  opts: KODE.buktiMilik,
  req: true,
  when: k => /Milik sendiri/.test(getPath(k, 'rumah.statusKepemilikan') || '')
}, {
  p: 'rumah.nilaiSewa',
  r: '8',
  label: 'Perkiraan nilai sewa/kontrak sebulan',
  type: 'rupiah',
  req: true,
  when: k => /Milik sendiri|Bebas sewa|Kontrak\/sewa/.test(getPath(k, 'rumah.statusKepemilikan') || '')
}, {
  p: 'rumah.luasLantai',
  r: '9',
  label: 'Luas lantai bangunan tempat tinggal (m²)',
  type: 'number',
  req: true
}, {
  p: 'rumah.lantaiBahan',
  r: '10a',
  label: 'Bahan bangunan utama lantai rumah terluas',
  type: 'radio',
  opts: KODE.lantaiBahan,
  req: true
}, {
  p: 'rumah.lantaiKondisi',
  r: '10b',
  label: 'Kondisi lantai',
  type: 'radio',
  opts: KODE.kondisi,
  req: true
}, {
  p: 'rumah.dindingBahan',
  r: '11a',
  label: 'Bahan bangunan utama dinding rumah terluas',
  type: 'radio',
  opts: KODE.dindingBahan,
  req: true
}, {
  p: 'rumah.dindingKondisi',
  r: '11b',
  label: 'Kondisi dinding',
  type: 'radio',
  opts: KODE.kondisi,
  req: true
}, {
  p: 'rumah.atapBahan',
  r: '12a',
  label: 'Bahan bangunan utama atap rumah terluas',
  type: 'radio',
  opts: KODE.atapBahan,
  req: true
}, {
  p: 'rumah.atapKondisi',
  r: '12b',
  label: 'Kondisi atap',
  type: 'radio',
  opts: KODE.kondisi,
  req: true
}, {
  p: 'rumah.fasilitasBAB',
  r: '13',
  label: 'Fasilitas tempat buang air besar & siapa yang menggunakan',
  type: 'radio',
  opts: KODE.fasilitasBAB,
  req: true
}, {
  p: 'rumah.jenisKloset',
  r: '14',
  label: 'Jenis kloset yang digunakan',
  type: 'radio',
  opts: KODE.jenisKloset,
  req: true
}, {
  p: 'rumah.pembuanganTinja',
  r: '15',
  label: 'Tempat pembuangan akhir tinja',
  type: 'radio',
  opts: KODE.pembuanganTinja,
  req: true
}, {
  p: 'rumah.sumberAirMinum',
  r: '16',
  label: 'Sumber air utama yang digunakan keluarga untuk minum',
  type: 'radio',
  opts: KODE.sumberAirMinum,
  req: true
}, {
  p: 'rumah.sumberPenerangan',
  r: '17',
  label: 'Sumber penerangan utama rumah ini',
  type: 'radio',
  opts: KODE.sumberPenerangan,
  req: true
}];
// Blok II lanjutan (setelah roster Meteran R18).
var BLOK2B = [{
  p: 'rumah.pengeluaranListrik',
  r: '19',
  label: 'Nilai pengeluaran listrik sebulan',
  type: 'rupiah',
  req: true
}, {
  p: 'rumah.pengeluaranPulsa',
  r: '20a',
  label: 'Pengeluaran pulsa seluruh anggota keluarga sebulan',
  type: 'rupiah',
  req: true
}, {
  p: 'rumah.pengeluaranInternet',
  r: '20b',
  label: 'Pengeluaran internet seluruh anggota keluarga sebulan',
  type: 'rupiah',
  req: true
}];
// Skema field per anggota (Blok IV). `rp` = path relatif di objek anggota.
// `when(k,a)` = skip-logic; `digits` = panjang digit wajib (NIK).
var ANGGOTA_FIELDS = [{
  rp: 'nama',
  r: '25',
  label: 'Nama Anggota Keluarga',
  type: 'text',
  req: true
}, {
  rp: 'nik',
  r: '26a',
  label: 'Nomor Induk Kependudukan (NIK)',
  type: 'text',
  req: true,
  digits: 16
}, {
  rp: 'hp',
  r: '26b',
  label: 'Nomor telepon/HP (isi "-" bila tidak ada)',
  type: 'text',
  req: true
}, {
  rp: 'keberadaan',
  r: '27a',
  label: 'Keberadaan anggota keluarga',
  type: 'radio',
  opts: KODE.keberadaan,
  req: true
}, {
  rp: 'domisili',
  r: '27b',
  label: 'Alamat Domisili',
  type: 'radio',
  opts: KODE.domisili,
  req: true
}, {
  rp: 'jk',
  r: '29',
  label: 'Jenis Kelamin',
  type: 'radio',
  opts: KODE.jk,
  req: true
}, {
  rp: '_tglLahir',
  r: '30',
  label: 'Tanggal Lahir',
  type: 'tglLahir'
}, {
  rp: 'statusKawin',
  r: '31',
  label: 'Status Perkawinan',
  type: 'radio',
  opts: KODE.statusKawin,
  req: true
}, {
  rp: 'hubungan',
  r: '32',
  label: 'Hubungan dengan Kepala Keluarga',
  type: 'radio',
  opts: KODE.hubungan,
  req: true
}, {
  rp: 'partisipasiSekolah',
  r: '33',
  label: 'Partisipasi sekolah',
  type: 'radio',
  opts: KODE.partisipasiSekolah,
  req: true
}, {
  rp: 'pendidikan',
  r: '34',
  label: 'Pendidikan tertinggi yang ditamatkan',
  type: 'radio',
  opts: KODE.pendidikan,
  req: true
}, {
  rp: 'pendapatanKerja',
  r: '35a',
  label: 'Pendapatan dari pekerjaan (gaji/upah/honor)',
  type: 'radio',
  opts: KODE.yaTidakTT,
  req: true
}, {
  rp: 'nilaiKerja',
  r: '35a',
  label: 'Total pendapatan dari pekerjaan sebulan',
  type: 'rupiah',
  req: true,
  when: (k, a) => /^1\. Ya/.test(a.pendapatanKerja || '')
}, {
  rp: 'pendapatanUsaha',
  r: '35b',
  label: 'Pendapatan dari usaha (offline/online)',
  type: 'radio',
  opts: KODE.yaTidakTT,
  req: true
}, {
  rp: 'nilaiUsaha',
  r: '35b',
  label: 'Total pendapatan dari usaha sebulan',
  type: 'rupiah',
  req: true,
  when: (k, a) => /^1\. Ya/.test(a.pendapatanUsaha || '')
}, {
  rp: 'pendapatanLain',
  r: '35c',
  label: 'Penerimaan pendapatan lain (transfer/pemberian/passive income)',
  type: 'radio',
  opts: KODE.yaTidakTT,
  req: true
}, {
  rp: 'nilaiLain',
  r: '35c',
  label: 'Total penerimaan lain sebulan',
  type: 'rupiah',
  req: true,
  when: (k, a) => /^1\. Ya/.test(a.pendapatanLain || '')
}, {
  rp: 'profesi',
  r: '36',
  label: 'Profesi/Pekerjaan Utama',
  type: 'text',
  req: true
}, {
  rp: 'statusKerja',
  r: '37',
  label: 'Status Kedudukan dalam Pekerjaan Utama',
  type: 'radio',
  opts: KODE.statusKerja,
  req: true
}, {
  rp: 'rekening',
  r: '40',
  label: 'Memiliki rekening aktif atau dompet digital?',
  type: 'radio',
  opts: KODE.rekening,
  req: true
}];

// ---------------------------------------------------------------------------
// Component: ported from the DTSEN Desa design. DCLogic ≈ React.Component
// (state / setState / props), so the original logic is reused verbatim and
// renderVals() feeds a JSX translation of the design template.
// ---------------------------------------------------------------------------
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.ASET = ['Sepeda', 'Sepeda Motor', 'Mobil', 'Kulkas', 'TV', 'AC', 'Perahu', 'Ternak'];
    this.BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    // Akun demo (prototipe — autentikasi sisi-klien). Hanya Operator & Kepala Desa
    // yang dapat CRUD; Kepala SLS bersifat hanya-lihat dan dibatasi ke wilayahnya.
    this.ACCOUNTS = [{
      username: 'kepaladesa',
      password: 'desa123',
      nama: 'I Gusti Ngurah Rai',
      role: 'Kepala Desa',
      wilayah: null
    }, {
      username: 'operator',
      password: 'operator123',
      nama: 'Komang Sutarja',
      role: 'Operator',
      wilayah: null
    }, {
      username: 'sls.sambirenteng',
      password: 'sls123',
      nama: 'I Nyoman Lestari',
      role: 'Kepala SLS',
      wilayah: 'Banjar Dinas Sambirenteng'
    }, {
      username: 'sls.penyumbahan',
      password: 'sls123',
      nama: 'I Ketut Wirya',
      role: 'Kepala SLS',
      wilayah: 'Banjar Dinas Penyumbahan'
    }, {
      username: 'sls.penuktukan',
      password: 'sls123',
      nama: 'I Wayan Sudiarta',
      role: 'Kepala SLS',
      wilayah: 'Banjar Dinas Penuktukan'
    }, {
      username: 'sls.tembok',
      password: 'sls123',
      nama: 'I Made Astawan',
      role: 'Kepala SLS',
      wilayah: 'Banjar Dinas Tembok'
    }, {
      username: 'sls.ngis',
      password: 'sls123',
      nama: 'I Gede Mariana',
      role: 'Kepala SLS',
      wilayah: 'Banjar Dinas Ngis'
    }];
    // Konfigurasi server opsional. Bila window.DTSEN_CONFIG.apiUrl diisi (lihat
    // config.js), aplikasi memakai Google Sheets via Apps Script sebagai database;
    // bila kosong, aplikasi berjalan murni lokal (localStorage) seperti semula.
    var CFG = typeof window !== 'undefined' && window.DTSEN_CONFIG || {};
    this.apiUrl = String(CFG.apiUrl || '').trim();
    this._cred = null; // kredensial di memori untuk dilampirkan ke tiap permintaan
    this.state = this.initState();
  }

  // -- Lapisan server (Google Sheets via Apps Script) --------------------------
  serverMode() {
    return !!this.apiUrl;
  }
  apiCall(action, payload) {
    return window.fetch(this.apiUrl, {
      method: 'POST',
      // text/plain agar tidak memicu CORS preflight ke Apps Script.
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: action,
        auth: this._cred || null,
        payload: payload || {}
      })
    }).then(function (r) {
      return r.json();
    });
  }
  bootstrap() {
    if (!this.serverMode()) return;
    this.setState({
      loading: true
    });
    this.apiCall('bootstrap', {}).then(res => {
      this.setState({
        loading: false
      });
      if (res && res.ok) {
        this.setState({
          warga: res.warga || [],
          sanggahan: res.sanggahan || []
        });
      } else {
        this.setState({
          toast: {
            type: 'err',
            msg: 'Gagal memuat data dari server. Menampilkan data lokal.'
          }
        });
        this.autoClear();
      }
    }).catch(() => {
      this.setState({
        loading: false,
        toast: {
          type: 'err',
          msg: 'Gagal memuat data dari server. Menampilkan data lokal.'
        }
      });
      this.autoClear();
    });
  }
  // Dorong perubahan ke server (no-op di mode lokal). Kegagalan tidak memblokir
  // state lokal — hanya memunculkan notifikasi.
  push(action, payload) {
    if (!this.serverMode()) return;
    this.apiCall(action, payload).then(res => {
      if (!res || !res.ok) {
        this.setState({
          toast: {
            type: 'err',
            msg: 'Sinkron server gagal: ' + (res && res.error || 'tidak diketahui')
          }
        });
        this.autoClear();
      }
    }).catch(() => {
      this.setState({
        toast: {
          type: 'err',
          msg: 'Server tidak terjangkau — perubahan tersimpan lokal.'
        }
      });
      this.autoClear();
    });
  }

  // -- Sesi login --------------------------------------------------------------
  static get AUTH_KEY() {
    return 'dtsen-desa-auth-v1';
  }
  static get CRED_KEY() {
    return 'dtsen-desa-cred-v1';
  }
  loadAuth() {
    try {
      const raw = window.localStorage.getItem(Component.AUTH_KEY);
      if (!raw) return null;
      const a = JSON.parse(raw);
      if (a && a.role && a.nama) return a;
    } catch (e) {}
    return null;
  }
  loadCred() {
    try {
      const raw = window.localStorage.getItem(Component.CRED_KEY);
      if (!raw) return null;
      const c = JSON.parse(raw);
      if (c && c.username && c.password) return c;
    } catch (e) {}
    return null;
  }
  canCrud() {
    const a = this.state.auth;
    return !!a && (a.role === 'Operator' || a.role === 'Kepala Desa');
  }
  // Warga yang boleh dilihat: Kepala SLS dibatasi ke wilayahnya, lainnya melihat semua.
  visibleWarga() {
    const a = this.state.auth;
    const w = this.state.warga;
    return a && a.wilayah ? w.filter(x => x.dusun === a.wilayah) : w;
  }
  onLoginField(e) {
    const k = e.target.getAttribute('data-login');
    const v = e.target.value;
    this.setState(s => ({
      loginForm: Object.assign({}, s.loginForm, {
        [k]: v,
        error: ''
      })
    }));
  }
  loginOk(auth, persist) {
    if (persist) {
      try {
        window.localStorage.setItem(Component.AUTH_KEY, JSON.stringify(auth));
      } catch (e2) {}
    }
    this.setState({
      auth: auth,
      view: 'dashboard',
      loginForm: {
        username: '',
        password: '',
        error: ''
      },
      toast: {
        type: 'ok',
        msg: 'Selamat datang, ' + auth.nama + '.'
      }
    });
    this.autoClear();
  }
  loginFail(msg) {
    this.setState(s => ({
      loginForm: Object.assign({}, s.loginForm, {
        error: msg || 'Username atau kata sandi salah.'
      })
    }));
  }
  login(e) {
    if (e && e.preventDefault) e.preventDefault();
    const f = this.state.loginForm;
    const u = (f.username || '').trim().toLowerCase();
    if (this.serverMode()) {
      // Mode server: validasi & ambil data dari Google Sheets.
      this.setState({
        loading: true
      });
      this._cred = {
        username: u,
        password: f.password
      };
      this.apiCall('login', {
        username: u,
        password: f.password
      }).then(res => {
        this.setState({
          loading: false
        });
        if (!res || !res.ok) {
          this._cred = null;
          this.loginFail(res && res.error);
          return;
        }
        try {
          window.localStorage.setItem(Component.CRED_KEY, JSON.stringify({
            username: u,
            password: f.password
          }));
        } catch (e) {}
        this.loginOk(res.user, true);
        this.bootstrap();
      }).catch(() => {
        this.setState({
          loading: false
        });
        this._cred = null;
        this.loginFail('Server tidak terjangkau. Periksa koneksi / URL.');
      });
      return;
    }
    // Mode lokal: akun demo bawaan.
    const acc = this.ACCOUNTS.find(a => a.username === u && a.password === f.password);
    if (!acc) {
      this.loginFail();
      return;
    }
    this.loginOk({
      username: acc.username,
      nama: acc.nama,
      role: acc.role,
      wilayah: acc.wilayah
    }, true);
  }
  logout() {
    try {
      window.localStorage.removeItem(Component.AUTH_KEY);
    } catch (e) {}
    try {
      window.localStorage.removeItem(Component.CRED_KEY);
    } catch (e) {}
    this._cred = null;
    this.setState({
      auth: null,
      view: 'dashboard',
      form: null,
      editId: null,
      selectedId: null,
      selectedTanggal: null,
      showSanggahanForm: false,
      processingId: null,
      confirmModal: null,
      toast: null,
      loading: false,
      sortBy: null,
      sortDir: 'asc'
    });
  }
  initState() {
    const saved = this.loadStore();
    return {
      auth: this.loadAuth(),
      loginForm: {
        username: '',
        password: '',
        error: ''
      },
      view: 'dashboard',
      search: '',
      filterDesa: 'semua',
      filterRt: 'semua',
      filterDesil: 'semua',
      filterBansos: 'semua',
      filterSanggahan: 'semua',
      warga: saved ? saved.warga : this.seedWarga(),
      sanggahan: saved ? saved.sanggahan : this.seedSanggahan(),
      form: null,
      editId: null,
      selectedId: null,
      selectedTanggal: null,
      showSanggahanForm: false,
      sanggahanForm: {
        pengaju: '',
        nik: '',
        hubungan: 'Warga Bersangkutan',
        alasan: ''
      },
      processingId: null,
      processCatatan: '',
      confirmModal: null,
      loading: false,
      sortBy: null,
      sortDir: 'asc',
      isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
      page: 1,
      showScrollTop: false,
      toast: null,
      today: typeof todayWITA === 'function' ? todayWITA() : new Date().toISOString().slice(0, 10)
    };
  }

  // -- Persistensi data (localStorage) -----------------------------------------
  static get STORE_KEY() {
    return 'dtsen-desa-v1';
  }
  loadStore() {
    try {
      const raw = window.localStorage.getItem(Component.STORE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.warga) && Array.isArray(d.sanggahan)) return d;
    } catch (e) {}
    return null;
  }
  saveStore(state) {
    try {
      window.localStorage.setItem(Component.STORE_KEY, JSON.stringify({
        warga: state.warga,
        sanggahan: state.sanggahan
      }));
    } catch (e) {}
  }
  resetStore() {
    if (!this.canCrud()) return;
    if (this.serverMode()) {
      this.apiCall('reset', {}).then(res => {
        if (res && res.ok) {
          this.bootstrap();
          this.setState({
            view: 'dashboard',
            toast: {
              type: 'ok',
              msg: 'Data contoh di server dipulihkan.'
            }
          });
          this.autoClear();
        } else {
          this.push('reset', {});
        }
      }).catch(() => {
        this.setState({
          toast: {
            type: 'err',
            msg: 'Server tidak terjangkau.'
          }
        });
        this.autoClear();
      });
      return;
    }
    try {
      window.localStorage.removeItem(Component.STORE_KEY);
    } catch (e) {}
    this.setState({
      warga: this.seedWarga(),
      sanggahan: this.seedSanggahan(),
      view: 'dashboard',
      selectedId: null,
      selectedTanggal: null,
      form: null,
      editId: null,
      toast: {
        type: 'ok',
        msg: 'Data contoh dipulihkan.'
      }
    });
    this.autoClear();
  }
  componentDidMount() {
    this._onResize = () => this.setState({
      isMobile: window.innerWidth < 768
    });
    window.addEventListener('resize', this._onResize);
    this._onScroll = () => this.setState({
      showScrollTop: window.scrollY > 300
    });
    window.addEventListener('scroll', this._onScroll, {
      passive: true
    });
    // Server mode: restore saved credentials so API calls work after page refresh.
    if (this.serverMode() && this.state.auth) {
      const cred = this.loadCred();
      if (cred) {
        this._cred = cred;
        this.bootstrap();
      } else {
        this.setState({
          auth: null
        });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
  }
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.warga !== this.state.warga || prevState.sanggahan !== this.state.sanggahan) {
      this.saveStore(this.state);
    }
  }

  // -- Formatters & utilitas tampilan ------------------------------------------
  rupiah(n) {
    n = Number(n || 0);
    return 'Rp' + n.toLocaleString('id-ID');
  }
  formatBytes(b) {
    b = Number(b || 0);
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }
  formatTanggal(s) {
    if (!s) return '-';
    const p = s.split('-');
    return Number(p[2]) + ' ' + this.BULAN[Number(p[1]) - 1] + ' ' + p[0];
  }
  getDS(d) {
    d = Math.max(1, Math.min(10, Number(d) || 1));
    const hue = 25 + (d - 1) / 9 * 125;
    return {
      text: 'oklch(0.46 0.14 ' + hue + ')',
      bg: 'oklch(0.955 0.04 ' + hue + ')',
      solid: 'oklch(0.63 0.15 ' + hue + ')'
    };
  }
  bansosStyle(b) {
    if (b === 'Tidak Ada') return {
      bg: '#f0f0ef',
      text: '#6b7280'
    };
    if (b === 'PKH') return {
      bg: '#ebf1fd',
      text: '#1d4ed8'
    };
    if (b === 'BPNT') return {
      bg: '#eaf5ee',
      text: '#166534'
    };
    return {
      bg: '#f0edfb',
      text: '#5b21b6'
    };
  }
  sgStatusStyle(s) {
    if (s === 'Diajukan') return {
      bg: '#fffbeb',
      text: '#92400e'
    };
    if (s === 'Diproses') return {
      bg: '#eef2fc',
      text: '#1e50d0'
    };
    if (s === 'Diterima') return {
      bg: '#eaf5ee',
      text: '#166534'
    };
    return {
      bg: '#f3f3f2',
      text: '#52576b'
    };
  }
  hitungDesil(d) {
    let s = 0;
    const p = Number(d.penghasilan) || 0;
    if (p < 800000) s += 0;else if (p < 1500000) s += 1.5;else if (p < 2500000) s += 3;else if (p < 4000000) s += 4.5;else s += 6;
    s += d.lantai === 'Tanah' ? 0 : d.lantai === 'Semen' ? 1 : 2;
    s += d.dinding === 'Bambu/Kayu' ? 0 : d.dinding === 'Setengah Tembok' ? 1 : 2;
    s += d.atap === 'Daun/Rumbia' ? 0 : d.atap === 'Seng/Asbes' ? 1 : 2;
    s += d.sumberAir === 'Sungai/Hujan' ? 0 : d.sumberAir === 'Sumur' ? 1 : 2;
    s += d.penerangan === 'Non-PLN' ? 0 : d.penerangan === 'PLN 450 VA' ? 1 : 2;
    s += (d.aset ? d.aset.length : 0) * 0.8;
    const low = ['Tidak Bekerja', 'Buruh Tani', 'Buruh Harian'];
    s += low.indexOf(d.pekerjaan) >= 0 ? 0 : 1.5;
    s += d.pendidikan === 'Tidak Sekolah' || d.pendidikan === 'SD' ? 0 : d.pendidikan === 'SMP' || d.pendidikan === 'SMA' ? 1 : 2;
    return Math.max(1, Math.min(10, Math.round(s / 23 * 9) + 1));
  }
  diffKeys() {
    return [['pekerjaan', 'Pekerjaan'], ['pendidikan', 'Pendidikan'], ['penghasilan', 'Penghasilan'], ['jumlahAnggota', 'Jumlah Anggota'], ['disabilitas', 'Disabilitas'], ['statusRumah', 'Status Rumah'], ['lantai', 'Lantai'], ['dinding', 'Dinding'], ['atap', 'Atap'], ['sumberAir', 'Sumber Air'], ['penerangan', 'Penerangan'], ['aset', 'Aset'], ['desil', 'Desil'], ['bansos', 'Status Bansos']];
  }
  fmtVal(k, v) {
    if (k === 'penghasilan') return this.rupiah(v);
    if (k === 'desil') return 'Desil ' + v;
    if (k === 'aset') return v && v.length ? v.join(', ') : '—';
    return v === '' || v == null ? '—' : String(v);
  }
  computeDiff(prev, next) {
    const out = [];
    const ks = this.diffKeys();
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i][0],
        lab = ks[i][1];
      const a = prev[k],
        b = next[k];
      const eq = Array.isArray(a) ? JSON.stringify(a || []) === JSON.stringify(b || []) : a === b;
      if (!eq) out.push({
        label: lab,
        dari: this.fmtVal(k, a),
        ke: this.fmtVal(k, b)
      });
    }
    return out;
  }
  emptyFoto() {
    return {
      depan: null,
      ruangTamu: null,
      kamarMandi: null
    };
  }
  // Foto contoh (placeholder 1px) agar data seed lolos validasi foto wajib.
  seedFoto() {
    const ph = {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      before: 48000,
      after: 30000
    };
    return {
      depan: Object.assign({}, ph),
      ruangTamu: Object.assign({}, ph),
      kamarMandi: null
    };
  }
}

// ---------------------------------------------------------------------------
// Data layer: FASIH struct factories, seed warga, form state factories.
// Methods dibagi terpisah dari class body utama agar mudah dikelola.
// ---------------------------------------------------------------------------
Object.assign(Component.prototype, {
  // -- FASIH: faktori anggota, pemetaan ringkasan, & pembangkit struktur seed --
  emptyDisabilitas() {
    const o = {};
    DISABILITAS_ITEMS.forEach(it => {
      o[it[0]] = '2. Tidak';
    });
    return o;
  },
  emptyKesehatan() {
    const o = {};
    KESEHATAN_ITEMS.forEach(it => {
      o[it[0]] = '2. Tidak';
    });
    return o;
  },
  mkAnggota(over) {
    over = over || {};
    return {
      no: over.no || 1,
      nama: over.nama || '',
      nik: over.nik || '',
      hp: over.hp || '-',
      keberadaan: over.keberadaan || '1. Tinggal di rumah/tempat tinggal ini',
      domisili: over.domisili || '1. Sesuai KK dan KTP',
      jk: over.jk || '1. Laki-laki',
      tglLahir: over.tglLahir || '',
      blnLahir: over.blnLahir || '',
      thnLahir: over.thnLahir || '',
      umur: over.umur || '',
      statusKawin: over.statusKawin || '2. Kawin/nikah',
      hubungan: over.hubungan || '1. Kepala Keluarga',
      partisipasiSekolah: over.partisipasiSekolah || '2. Tidak bersekolah lagi',
      pendidikan: over.pendidikan || '1. SD/sederajat',
      pendapatanKerja: over.pendapatanKerja || '2. Tidak',
      nilaiKerja: over.nilaiKerja || '',
      pendapatanUsaha: over.pendapatanUsaha || '2. Tidak',
      nilaiUsaha: over.nilaiUsaha || '',
      pendapatanLain: over.pendapatanLain || '2. Tidak',
      nilaiLain: over.nilaiLain || '',
      profesi: over.profesi || '',
      statusKerja: over.statusKerja || '6. Pekerja keluarga/tidak dibayar',
      disabilitas: Object.assign(this.emptyDisabilitas(), over.disabilitas || {}),
      kesehatan: Object.assign(this.emptyKesehatan(), over.kesehatan || {}),
      rekening: over.rekening || '4. Tidak ada'
    };
  },
  kepalaKeluarga(k) {
    const a = k && k.anggota || [];
    return a.find(x => String(x.hubungan || '').indexOf('1.') === 0) || a[0] || null;
  },
  totalPendapatan(k) {
    let s = 0;
    (k && k.anggota || []).forEach(a => {
      s += Number(a.nilaiKerja || 0) + Number(a.nilaiUsaha || 0) + Number(a.nilaiLain || 0);
    });
    return s;
  },
  pendidikanProxy(p) {
    p = String(p || '');
    if (/^0\./.test(p)) return 'Tidak Sekolah';
    if (/^1\./.test(p)) return 'SD';
    if (/^2\./.test(p)) return 'SMP';
    if (/^3\./.test(p)) return 'SMA';
    if (/^4\./.test(p)) return 'D3';
    return 'S1';
  },
  pendidikanProxyInv(old) {
    old = String(old || '');
    const m = {
      'Tidak Sekolah': '0. Tidak punya ijazah',
      'SD': '1. SD/sederajat',
      'SMP': '2. SMP/sederajat',
      'SMA': '3. SMA/sederajat',
      'D3': '4. D1/D2/D3',
      'S1': '5. D4/S1'
    };
    return m[old] || '1. SD/sederajat';
  },
  statusRumahProxy(r) {
    const s = String(r && r.statusKepemilikan || '');
    if (/Milik sendiri/.test(s)) return 'Milik Sendiri';
    if (/Kontrak|sewa/.test(s) && !/Bebas/.test(s)) return 'Sewa/Kontrak';
    return 'Numpang';
  },
  defaultWilayah(meta) {
    const kodeDesa = {
      'Desa Sambirenteng': '[008]',
      'Desa Penuktukan': '[009]',
      'Desa Tembok': '[010]'
    };
    return {
      provinsi: '[51] BALI',
      kabupaten: '[08] BULELENG',
      kecamatan: '[090] TEJAKULA',
      desa: (kodeDesa[meta.desa] || '[010]') + ' ' + String(meta.desa || '').replace('Desa ', '').toUpperCase(),
      klasifikasi: '2. Perdesaan',
      kodeSls: '0003' + String(meta.rt || '01').slice(-2),
      namaSls: meta.dusun || '',
      kodePos: '81173',
      namaJalan: meta.alamat || '',
      nomorRumah: '-'
    };
  },
  // Pemetaan struktur FASIH -> input lama hitungDesil() (dipertahankan apa adanya).
  deriveDesilInputs(k) {
    const r = k.rumah || {},
      as = k.aset || {},
      krt = this.kepalaKeluarga(k) || {};
    const lantai = /Tanah/.test(r.lantaiBahan) ? 'Tanah' : /Semen|Bambu|Kayu|papan/.test(r.lantaiBahan) ? 'Semen' : 'Keramik/Ubin';
    const dinding = /^1\. Tembok/.test(r.dindingBahan) ? 'Tembok' : /Plesteran|Kayu|Papan|Gypsum/.test(r.dindingBahan) ? 'Setengah Tembok' : 'Bambu/Kayu';
    const atap = /Beton|Genteng/.test(r.atapBahan) ? 'Genteng/Beton' : /Seng|Asbes/.test(r.atapBahan) ? 'Seng/Asbes' : 'Daun/Rumbia';
    const air = /kemasan|isi ulang|Leding|bor|pompa/.test(r.sumberAirMinum) ? 'PDAM/Ledeng' : /Sumur|Mata air/.test(r.sumberAirMinum) ? 'Sumur' : 'Sungai/Hujan';
    const daya = k.meteran && k.meteran[0] && k.meteran[0].daya || '';
    const pen = /Bukan listrik|Non-PLN/.test(r.sumberPenerangan) ? 'Non-PLN' : /^1\. 450/.test(daya) ? 'PLN 450 VA' : 'PLN 900+ VA';
    const aset = [];
    if (Number(as.sepedaMotor) > 0) aset.push('Sepeda Motor');
    if (Number(as.mobil) > 0) aset.push('Mobil');
    if (Number(as.kulkas) > 0) aset.push('Kulkas');
    if (Number(as.ac) > 0) aset.push('AC');
    return {
      penghasilan: this.totalPendapatan(k),
      lantai: lantai,
      dinding: dinding,
      atap: atap,
      sumberAir: air,
      penerangan: pen,
      aset: aset,
      pekerjaan: krt.profesi || 'Tidak Bekerja',
      pendidikan: this.pendidikanProxy(krt.pendidikan)
    };
  },
  // Ringkasan datar yang dipakai dashboard/daftar/riwayat/desil/snapshot.
  deriveSummary(k) {
    const inp = this.deriveDesilInputs(k);
    const desil = k.desilManual ? Number(k.desil || 5) : this.hitungDesil(inp);
    const disab = (k.anggota || []).some(a => DISABILITAS_ITEMS.some(it => /^1\. Ya/.test(a.disabilitas && a.disabilitas[it[0]] || ''))) ? 'Ada' : 'Tidak Ada';
    return Object.assign({}, inp, {
      desil: desil,
      bansos: k.bansos || 'Tidak Ada',
      jumlahAnggota: (k.anggota || []).length,
      disabilitas: disab,
      statusRumah: this.statusRumahProxy(k.rumah)
    });
  },
  // Bangun blok terstruktur FASIH dari satu "state" ekonomi lama (untuk seed).
  stateToStruct(state, meta) {
    const invLantai = {
      'Tanah': '8. Tanah',
      'Semen': '6. Semen/bata merah',
      'Keramik/Ubin': '2. Keramik'
    };
    const invDinding = {
      'Bambu/Kayu': '6. Bambu',
      'Setengah Tembok': '2. Plesteran anyaman bambu/kawat',
      'Tembok': '1. Tembok'
    };
    const invAtap = {
      'Daun/Rumbia': '7. Jerami/ijuk/daun daunan/rumbia',
      'Seng/Asbes': '3. Seng',
      'Genteng/Beton': '2. Genteng'
    };
    const invAir = {
      'Sungai/Hujan': '9. Air permukaan (sungai/danau/waduk/kolam/irigasi)',
      'Sumur': '5. Sumur terlindung',
      'PDAM/Ledeng': '3. Leding'
    };
    const invStatus = {
      'Milik Sendiri': '1. Milik sendiri',
      'Sewa/Kontrak': '2. Kontrak/sewa',
      'Numpang': '3. Bebas sewa'
    };
    const penToDaya = {
      'PLN 450 VA': '1. 450 watt',
      'PLN 900+ VA': '3. 1.300 watt'
    };
    const daya = penToDaya[state.penerangan] || null;
    const penerangan = state.penerangan === 'Non-PLN' ? '3. Listrik Non-PLN' : '1. Listrik PLN dengan meteran';
    const rumah = {
      jumlahKeluarga: 1,
      jenisBangunan: '1. Rumah tinggal tunggal',
      statusKepemilikan: invStatus[state.statusRumah] || '1. Milik sendiri',
      buktiMilik: '1. SHM',
      nilaiSewa: state.statusRumah === 'Milik Sendiri' ? 500000 : 800000,
      luasLantai: 36 + Number(state.jumlahAnggota || 1) * 8,
      lantaiBahan: invLantai[state.lantai] || '8. Tanah',
      lantaiKondisi: '1. Baik',
      dindingBahan: invDinding[state.dinding] || '6. Bambu',
      dindingKondisi: '1. Baik',
      atapBahan: invAtap[state.atap] || '3. Seng',
      atapKondisi: '1. Baik',
      fasilitasBAB: '1. Ada, digunakan oleh anggota keluarga dalam satu rumah',
      jenisKloset: '1. Leher angsa',
      pembuanganTinja: '1. Tangki septik',
      sumberAirMinum: invAir[state.sumberAir] || '5. Sumur terlindung',
      sumberPenerangan: penerangan,
      pengeluaranListrik: state.penerangan === 'Non-PLN' ? 0 : daya && /450/.test(daya) ? 75000 : 250000,
      pengeluaranPulsa: 100000,
      pengeluaranInternet: Number(state.penghasilan || 0) > 3000000 ? 150000 : 0,
      foto: this.seedFoto()
    };
    const meteran = daya ? [{
      daya: daya,
      jenisId: 'ID Pelanggan',
      idPelanggan: (String(meta.noKK) + '00').slice(0, 12)
    }] : [];
    const A = state.aset || [];
    const has = n => A.indexOf(n) >= 0;
    const aset = {
      tabungGas3: 1,
      tabungGas55: 0,
      kulkas: has('Kulkas') || has('TV') ? 1 : 0,
      ac: has('AC') ? 1 : 0,
      emas: has('Mobil') ? 20 : 0,
      komputer: 0,
      sepedaMotor: has('Sepeda Motor') ? 1 : 0,
      nilaiSepedaMotor: has('Sepeda Motor') ? 15000000 : 0,
      mobil: has('Mobil') ? 1 : 0,
      nilaiMobil: has('Mobil') ? 120000000 : 0,
      lahanLain: 0,
      bangunanLain: 0
    };
    const names = meta.anggota && meta.anggota.length ? meta.anggota : [meta.nama];
    const dis = state.disabilitas === 'Ada';
    const anggota = names.map((nm, i) => {
      const hub = i === 0 ? '1. Kepala Keluarga' : i === 1 ? '2. Istri/Suami' : '3. Anak';
      const jk = i === 0 ? '1. Laki-laki' : i === 1 ? '2. Perempuan' : i % 2 ? '1. Laki-laki' : '2. Perempuan';
      const thn = 1990 - i * 3;
      return this.mkAnggota({
        no: i + 1,
        nama: nm,
        nik: i === 0 ? meta.nik : String(meta.nik).slice(0, -2) + String(20 + i).slice(-2),
        hp: i === 0 ? '0812' + String(meta.noKK).slice(-8) : '-',
        jk: jk,
        hubungan: hub,
        tglLahir: String(5 + i),
        blnLahir: '05 - Mei',
        thnLahir: String(thn),
        umur: String(2026 - thn),
        statusKawin: i < 2 ? '2. Kawin/nikah' : '1. Belum kawin',
        partisipasiSekolah: i >= 2 ? '1. Masih sekolah' : '2. Tidak bersekolah lagi',
        pendidikan: this.pendidikanProxyInv(state.pendidikan),
        pendapatanKerja: i === 0 && !/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan) ? '1. Ya' : '2. Tidak',
        pendapatanUsaha: i === 0 && /wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan) ? '1. Ya' : '2. Tidak',
        nilaiKerja: i === 0 && !/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan) ? Number(state.penghasilan || 0) : '',
        nilaiUsaha: i === 0 && /wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan) ? Number(state.penghasilan || 0) : '',
        profesi: i === 0 ? state.pekerjaan : i === 1 ? 'Mengurus rumah tangga' : 'Pelajar/Mahasiswa',
        statusKerja: i === 0 ? '1. Berusaha sendiri' : '6. Pekerja keluarga/tidak dibayar',
        disabilitas: dis && i === 0 ? {
          fisik: '1. Ya'
        } : {}
      });
    });
    return {
      rumah: rumah,
      meteran: meteran,
      aset: aset,
      anggota: anggota
    };
  },
  mkWarga(meta, states) {
    const snaps = [];
    let prev = null;
    for (let i = 0; i < states.length; i++) {
      const st = states[i];
      const data = {
        pekerjaan: st.pekerjaan,
        pendidikan: st.pendidikan,
        penghasilan: st.penghasilan,
        jumlahAnggota: st.jumlahAnggota,
        disabilitas: st.disabilitas,
        statusRumah: st.statusRumah,
        lantai: st.lantai,
        dinding: st.dinding,
        atap: st.atap,
        sumberAir: st.sumberAir,
        penerangan: st.penerangan,
        aset: st.aset.slice(),
        bansos: st.bansos
      };
      data.desil = this.hitungDesil(data);
      const diff = prev ? this.computeDiff(prev, data) : [];
      snaps.push({
        tanggal: st.tanggal,
        operator: st.operator,
        data: data,
        foto: this.emptyFoto(),
        fieldYangBerubah: diff
      });
      prev = data;
    }
    const last = snaps[snaps.length - 1];
    const struct = this.stateToStruct(states[states.length - 1], meta);
    return Object.assign({}, meta, last.data, {
      foto: last.foto,
      snapshots: snaps,
      anggota: struct.anggota,
      rumah: struct.rumah,
      meteran: struct.meteran,
      aset: struct.aset,
      wilayah: this.defaultWilayah(meta),
      statusKeluarga: '1. Ditemukan',
      geotag: {
        mode: '2. Input Manual',
        lat: '',
        long: '',
        akurasi: ''
      },
      catatan: '',
      status: 'final',
      jumlahAnggotaKK: struct.anggota.length,
      alamatSesuaiKK: '1. Ya, Sesuai KK',
      desilManual: false
    });
  },
  // Data dummy: Kecamatan Tejakula, Kabupaten Buleleng — Desa Sambirenteng,
  // Penuktukan, dan Tembok. SLS = banjar dinas. Dirancang menutup semua kasus:
  // desil 1–10, semua status bansos, perubahan desil naik & turun, disabilitas,
  // beragam kondisi rumah/pekerjaan, serta rumah tangga 1 & 2 snapshot.
  seedWarga() {
    const W = [];
    const mk = (m, s) => W.push(this.mkWarga(m, s));

    // === Desa Sambirenteng =================================================
    mk({
      id: 'w01',
      noKK: '5108150101010001',
      nik: '5108150101800001',
      nama: 'I Wayan Sukra',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Sambirenteng',
      rt: '001',
      rw: '001',
      alamat: 'Jl. Air Sanih Gg. Melati',
      anggota: ['I Wayan Sukra', 'Ni Ketut Rinjin', 'Kadek Adi']
    }, [{
      tanggal: '2026-06-15',
      operator: 'Komang Sutarja',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'Tidak Sekolah',
      penghasilan: 600000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Daun/Rumbia',
      sumberAir: 'Sungai/Hujan',
      penerangan: 'Non-PLN',
      aset: [],
      bansos: 'PKH + BPNT'
    }]);
    mk({
      id: 'w02',
      noKK: '5108150101010002',
      nik: '5108154208650002',
      nama: 'Ni Nengah Rauh',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Sambirenteng',
      rt: '002',
      rw: '001',
      alamat: 'Jl. Air Sanih No. 8',
      anggota: ['Ni Nengah Rauh', 'I Gede Bagia']
    }, [{
      tanggal: '2025-09-10',
      operator: 'Komang Sutarja',
      pekerjaan: 'Buruh Harian',
      pendidikan: 'SD',
      penghasilan: 1500000,
      jumlahAnggota: 2,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['TV', 'Sepeda'],
      bansos: 'PKH'
    }, {
      tanggal: '2026-06-15',
      operator: 'Komang Sutarja',
      pekerjaan: 'Tidak Bekerja',
      pendidikan: 'SD',
      penghasilan: 700000,
      jumlahAnggota: 2,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['TV'],
      bansos: 'PKH'
    }]);
    mk({
      id: 'w03',
      noKK: '5108150102010003',
      nik: '5108150703700003',
      nama: 'I Ketut Murta',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Penyumbahan',
      rt: '001',
      rw: '002',
      alamat: 'Br. Penyumbahan Kaja',
      anggota: ['I Ketut Murta', 'Ni Wayan Sari', 'Putu Eka', 'Kadek Dwi']
    }, [{
      tanggal: '2026-06-16',
      operator: 'Putu Ariani',
      pekerjaan: 'Nelayan',
      pendidikan: 'SD',
      penghasilan: 1700000,
      jumlahAnggota: 4,
      disabilitas: 'Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['Perahu', 'Sepeda Motor'],
      bansos: 'BPNT'
    }]);
    mk({
      id: 'w04',
      noKK: '5108150102010004',
      nik: '5108151511780004',
      nama: 'I Putu Gde Astawa',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Penyumbahan',
      rt: '002',
      rw: '002',
      alamat: 'Br. Penyumbahan Kelod',
      anggota: ['I Putu Gde Astawa', 'Ni Made Asih', 'Gede Surya']
    }, [{
      tanggal: '2025-08-01',
      operator: 'Putu Ariani',
      pekerjaan: 'Pedagang',
      pendidikan: 'SMP',
      penghasilan: 2300000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'TV'],
      bansos: 'BPNT'
    }, {
      tanggal: '2026-06-16',
      operator: 'Putu Ariani',
      pekerjaan: 'Wiraswasta',
      pendidikan: 'SMP',
      penghasilan: 4200000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Mobil', 'Kulkas', 'TV'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w05',
      noKK: '5108150103010005',
      nik: '5108151009820005',
      nama: 'I Gede Suardika',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Bantes',
      rt: '001',
      rw: '003',
      alamat: 'Br. Bantes',
      anggota: ['I Gede Suardika', 'Ni Luh Putri', 'Komang Tri']
    }, [{
      tanggal: '2026-06-17',
      operator: 'Komang Sutarja',
      pekerjaan: 'PNS',
      pendidikan: 'S1',
      penghasilan: 6500000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Mobil', 'Sepeda Motor', 'Kulkas', 'TV', 'AC'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w06',
      noKK: '5108150103010006',
      nik: '5108154506880006',
      nama: 'Ni Made Sari',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Bantes',
      rt: '002',
      rw: '003',
      alamat: 'Br. Bantes Gg. II',
      anggota: ['Ni Made Sari', 'I Ketut Lanus', 'Putu Ayu']
    }, [{
      tanggal: '2026-06-17',
      operator: 'Komang Sutarja',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'SD',
      penghasilan: 1100000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['TV'],
      bansos: 'PKH'
    }]);

    // === Desa Penuktukan ===================================================
    mk({
      id: 'w07',
      noKK: '5108150201010007',
      nik: '5108150201750007',
      nama: 'I Nyoman Reta',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Penuktukan',
      rt: '001',
      rw: '001',
      alamat: 'Jl. Singaraja-Amlapura',
      anggota: ['I Nyoman Reta', 'Ni Ketut Kerti', 'Wayan Sukasta', 'Made Sukasti']
    }, [{
      tanggal: '2026-06-18',
      operator: 'Made Sukerta',
      pekerjaan: 'Nelayan',
      pendidikan: 'Tidak Sekolah',
      penghasilan: 700000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Daun/Rumbia',
      sumberAir: 'Sungai/Hujan',
      penerangan: 'PLN 450 VA',
      aset: ['Perahu'],
      bansos: 'PKH + BPNT'
    }]);
    mk({
      id: 'w08',
      noKK: '5108150201010008',
      nik: '5108151203800008',
      nama: 'I Kadek Yasa',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Penuktukan',
      rt: '002',
      rw: '001',
      alamat: 'Jl. Pantai Penuktukan',
      anggota: ['I Kadek Yasa', 'Ni Putu Eni', 'Gede Restu']
    }, [{
      tanggal: '2025-11-12',
      operator: 'Made Sukerta',
      pekerjaan: 'Tukang Bangunan',
      pendidikan: 'SMP',
      penghasilan: 2000000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor'],
      bansos: 'BPNT'
    }, {
      tanggal: '2026-06-18',
      operator: 'Made Sukerta',
      pekerjaan: 'Tukang Bangunan',
      pendidikan: 'SMP',
      penghasilan: 2400000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'TV'],
      bansos: 'BPNT'
    }]);
    mk({
      id: 'w09',
      noKK: '5108150202010009',
      nik: '5108151807790009',
      nama: 'I Gede Parwata',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Kanginan',
      rt: '001',
      rw: '002',
      alamat: 'Br. Kanginan',
      anggota: ['I Gede Parwata', 'Ni Nengah Wari', 'Kadek Sania', 'Komang Tris']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Putu Ariani',
      pekerjaan: 'Pedagang',
      pendidikan: 'SMA',
      penghasilan: 2700000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['Sepeda Motor'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w10',
      noKK: '5108150202010010',
      nik: '5108152208770010',
      nama: 'I Putu Mertayasa',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Kanginan',
      rt: '002',
      rw: '002',
      alamat: 'Br. Kanginan Gg. III',
      anggota: ['I Putu Mertayasa', 'Ni Wayan Rai', 'Gede Adnyana']
    }, [{
      tanggal: '2025-07-05',
      operator: 'Putu Ariani',
      pekerjaan: 'Sopir',
      pendidikan: 'SMA',
      penghasilan: 2600000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'TV'],
      bansos: 'BPNT'
    }, {
      tanggal: '2026-06-19',
      operator: 'Putu Ariani',
      pekerjaan: 'Wiraswasta',
      pendidikan: 'SMA',
      penghasilan: 5000000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Mobil', 'Sepeda Motor', 'Kulkas', 'TV', 'AC'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w11',
      noKK: '5108150203010011',
      nik: '5108154811900011',
      nama: 'Ni Luh Sukerti',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Kawanan',
      rt: '001',
      rw: '003',
      alamat: 'Br. Kawanan',
      anggota: ['Ni Luh Sukerti', 'I Wayan Tama']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Made Sukerta',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'SD',
      penghasilan: 850000,
      jumlahAnggota: 2,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH'
    }]);
    mk({
      id: 'w12',
      noKK: '5108150203010012',
      nik: '5108150512720012',
      nama: 'I Komang Wirawan',
      desa: 'Desa Penuktukan',
      dusun: 'Banjar Dinas Kawanan',
      rt: '002',
      rw: '003',
      alamat: 'Br. Kawanan No. 1',
      anggota: ['I Komang Wirawan', 'Ni Kadek Mertini', 'Gede Bagus', 'Putu Indah']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Putu Ariani',
      pekerjaan: 'PNS',
      pendidikan: 'S1',
      penghasilan: 8500000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Mobil', 'Sepeda Motor', 'Kulkas', 'TV', 'AC'],
      bansos: 'Tidak Ada'
    }]);

    // === Desa Tembok =======================================================
    mk({
      id: 'w13',
      noKK: '5108150301010013',
      nik: '5108150301680013',
      nama: 'I Wayan Repot',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Tembok',
      rt: '001',
      rw: '001',
      alamat: 'Jl. Tembok-Tejakula',
      anggota: ['I Wayan Repot', 'Ni Ketut Sari']
    }, [{
      tanggal: '2026-06-20',
      operator: 'Komang Sutarja',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'Tidak Sekolah',
      penghasilan: 650000,
      jumlahAnggota: 2,
      disabilitas: 'Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Daun/Rumbia',
      sumberAir: 'Sungai/Hujan',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH'
    }]);
    mk({
      id: 'w14',
      noKK: '5108150301010014',
      nik: '5108151404810014',
      nama: 'I Nengah Kerti',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Tembok',
      rt: '002',
      rw: '001',
      alamat: 'Jl. Tembok No. 22',
      anggota: ['I Nengah Kerti', 'Ni Wayan Sukern', 'Kadek Riska']
    }, [{
      tanggal: '2025-10-10',
      operator: 'Made Sukerta',
      pekerjaan: 'Pengrajin',
      pendidikan: 'SMP',
      penghasilan: 1900000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'TV'],
      bansos: 'BPNT'
    }, {
      tanggal: '2026-06-20',
      operator: 'Made Sukerta',
      pekerjaan: 'Buruh Harian',
      pendidikan: 'SMP',
      penghasilan: 1200000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['TV'],
      bansos: 'BPNT'
    }]);
    mk({
      id: 'w15',
      noKK: '5108150302010015',
      nik: '5108154909860015',
      nama: 'Ni Ketut Lasia',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Dukuh',
      rt: '001',
      rw: '002',
      alamat: 'Br. Dukuh',
      anggota: ['Ni Ketut Lasia', 'I Gede Mara', 'Putu Sentana']
    }, [{
      tanggal: '2026-06-20',
      operator: 'Putu Ariani',
      pekerjaan: 'Tidak Bekerja',
      pendidikan: 'SD',
      penghasilan: 500000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH + BPNT'
    }]);
    mk({
      id: 'w16',
      noKK: '5108150302010016',
      nik: '5108152610830016',
      nama: 'I Made Suarjana',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Dukuh',
      rt: '002',
      rw: '002',
      alamat: 'Br. Dukuh Kaja',
      anggota: ['I Made Suarjana', 'Ni Luh Armini', 'Gede Pasek', 'Kadek Lina']
    }, [{
      tanggal: '2026-06-21',
      operator: 'Putu Ariani',
      pekerjaan: 'Wiraswasta',
      pendidikan: 'SMA',
      penghasilan: 4500000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Mobil', 'Sepeda Motor', 'Kulkas', 'TV'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w17',
      noKK: '5108150303010017',
      nik: '5108151712880017',
      nama: 'I Putu Adi',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Ngis',
      rt: '001',
      rw: '003',
      alamat: 'Br. Ngis',
      anggota: ['I Putu Adi', 'Ni Made Yuni', 'Komang Bayu']
    }, [{
      tanggal: '2026-06-21',
      operator: 'Komang Sutarja',
      pekerjaan: 'Guru Honorer',
      pendidikan: 'S1',
      penghasilan: 2300000,
      jumlahAnggota: 3,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Sewa/Kontrak',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Kulkas', 'TV'],
      bansos: 'Tidak Ada'
    }]);
    mk({
      id: 'w18',
      noKK: '5108150303010018',
      nik: '5108150208730018',
      nama: 'I Gede Mangku',
      desa: 'Desa Tembok',
      dusun: 'Banjar Dinas Ngis',
      rt: '002',
      rw: '003',
      alamat: 'Br. Ngis Kelod',
      anggota: ['I Gede Mangku', 'Ni Ketut Warti', 'Putu Gunawan', 'Made Lestari', 'Kadek Ari']
    }, [{
      tanggal: '2025-06-12',
      operator: 'Made Sukerta',
      pekerjaan: 'Petani',
      pendidikan: 'SMA',
      penghasilan: 3000000,
      jumlahAnggota: 5,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Ternak', 'TV'],
      bansos: 'Tidak Ada'
    }, {
      tanggal: '2026-06-21',
      operator: 'Made Sukerta',
      pekerjaan: 'Wiraswasta',
      pendidikan: 'SMA',
      penghasilan: 5500000,
      jumlahAnggota: 5,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Mobil', 'Sepeda Motor', 'Ternak', 'Kulkas', 'TV', 'AC'],
      bansos: 'Tidak Ada'
    }]);
    return W;
  },
  seedSanggahan() {
    return [
    // Diajukan — menunggu diproses
    {
      id: 's1',
      wargaId: 'w02',
      tanggalSnapshot: '2026-06-15',
      pengaju: 'Ni Nengah Rauh',
      nik: '5108154208650002',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Saya memang sudah tidak bekerja tetap, namun masih menerima kiriman dari anak. Mohon ditinjau agar status PKH tetap sesuai kondisi sebenarnya.',
      status: 'Diajukan',
      tanggalPengajuan: '2026-06-16',
      tanggalSelesai: '',
      catatanOperator: ''
    }, {
      id: 's2',
      wargaId: 'w13',
      tanggalSnapshot: '2026-06-20',
      pengaju: 'Kelian Banjar Dinas Tembok',
      nik: '-',
      hubungan: 'RT/RW',
      alasan: 'Pak I Wayan Repot menyandang disabilitas dan tinggal menumpang. Mohon diprioritaskan untuk bantuan tambahan selain PKH.',
      status: 'Diajukan',
      tanggalPengajuan: '2026-06-21',
      tanggalSelesai: '',
      catatanOperator: ''
    },
    // Diproses
    {
      id: 's3',
      wargaId: 'w04',
      tanggalSnapshot: '2026-06-16',
      pengaju: 'I Putu Gde Astawa',
      nik: '5108151511780004',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Penghasilan usaha saya tercatat naik, namun tahun ini sebenarnya menurun karena sepi pembeli. Mohon verifikasi ulang sebelum status bansos dicabut.',
      status: 'Diproses',
      tanggalPengajuan: '2026-06-18',
      tanggalSelesai: '',
      catatanOperator: ''
    },
    // Diterima
    {
      id: 's4',
      wargaId: 'w08',
      tanggalSnapshot: '2026-06-18',
      pengaju: 'I Kadek Yasa',
      nik: '5108151203800008',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Atap rumah sudah diganti genteng dari hasil bantuan, namun kondisi ekonomi belum membaik. Mohon BPNT tetap dipertahankan.',
      status: 'Diterima',
      tanggalPengajuan: '2026-06-19',
      tanggalSelesai: '2026-06-22',
      catatanOperator: 'Hasil verifikasi lapangan menunjukkan kondisi ekonomi keluarga masih layak menerima BPNT. Sanggahan diterima dan status bansos dipertahankan.'
    },
    // Ditolak
    {
      id: 's5',
      wargaId: 'w10',
      tanggalSnapshot: '2026-06-19',
      pengaju: 'I Putu Mertayasa',
      nik: '5108152208770010',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Mobil yang tercatat adalah kendaraan operasional pinjaman, bukan milik pribadi. Mohon dikeluarkan dari aset agar desil tidak naik.',
      status: 'Ditolak',
      tanggalPengajuan: '2026-06-20',
      tanggalSelesai: '2026-06-22',
      catatanOperator: 'Pengecekan STNK menunjukkan kendaraan atas nama yang bersangkutan. Sanggahan ditolak sesuai bukti dokumen.'
    }];
  },
  blankForm() {
    const id = 'w' + Date.now();
    return {
      id: id,
      isNew: true,
      status: 'draft',
      noKK: '',
      nik: '',
      nama: '',
      desa: 'Desa Sambirenteng',
      dusun: 'Banjar Dinas Sambirenteng',
      rt: '',
      rw: '',
      alamat: '',
      wilayah: {
        provinsi: '[51] BALI',
        kabupaten: '[08] BULELENG',
        kecamatan: '[090] TEJAKULA',
        desa: '',
        klasifikasi: '2. Perdesaan',
        kodeSls: '',
        namaSls: '',
        kodePos: '',
        namaJalan: '',
        nomorRumah: ''
      },
      statusKeluarga: '1. Ditemukan',
      jumlahAnggotaKK: '',
      alamatSesuaiKK: '',
      geotag: {
        mode: '2. Input Manual',
        lat: '',
        long: '',
        akurasi: ''
      },
      rumah: {
        jumlahKeluarga: '',
        jenisBangunan: '',
        statusKepemilikan: '',
        buktiMilik: '',
        nilaiSewa: '',
        luasLantai: '',
        lantaiBahan: '',
        lantaiKondisi: '',
        dindingBahan: '',
        dindingKondisi: '',
        atapBahan: '',
        atapKondisi: '',
        fasilitasBAB: '',
        jenisKloset: '',
        pembuanganTinja: '',
        sumberAirMinum: '',
        sumberPenerangan: '',
        pengeluaranListrik: '',
        pengeluaranPulsa: '',
        pengeluaranInternet: '',
        foto: this.emptyFoto()
      },
      meteran: [],
      aset: {
        tabungGas3: '',
        tabungGas55: '',
        kulkas: '',
        ac: '',
        emas: '',
        komputer: '',
        sepedaMotor: '',
        nilaiSepedaMotor: '',
        mobil: '',
        nilaiMobil: '',
        lahanLain: '',
        bangunanLain: ''
      },
      anggota: [this.mkAnggota({
        no: 1,
        hubungan: '1. Kepala Keluarga'
      })],
      catatan: '',
      bansos: 'Tidak Ada',
      desilManual: false,
      desil: '5',
      _openIdx: 0,
      _activeBlok: 'I',
      _showRingkasan: false
    };
  },
  dataToForm(w) {
    const clone = JSON.parse(JSON.stringify(w));
    if (!clone.id) clone.id = 'w' + Date.now();
    // Migrate: if aset was corrupted to an array by an earlier save, rebuild object from array
    if (Array.isArray(clone.aset)) {
      const arr = clone.aset;
      clone.aset = {
        tabungGas3: '',
        tabungGas55: '',
        kulkas: '',
        ac: '',
        emas: '',
        komputer: '',
        sepedaMotor: '',
        nilaiSepedaMotor: '',
        mobil: '',
        nilaiMobil: '',
        lahanLain: '',
        bangunanLain: ''
      };
      if (arr.indexOf('Sepeda Motor') >= 0) {
        clone.aset.sepedaMotor = 1;
        clone.aset.nilaiSepedaMotor = '';
      }
      if (arr.indexOf('Mobil') >= 0) {
        clone.aset.mobil = 1;
        clone.aset.nilaiMobil = '';
      }
      if (arr.indexOf('Kulkas') >= 0) clone.aset.kulkas = 1;
      if (arr.indexOf('AC') >= 0) clone.aset.ac = 1;
    }
    if (clone.anggota && clone.anggota.length > 0) {
      if (clone.nama) clone.anggota[0].nama = clone.nama;
      if (clone.nik) clone.anggota[0].nik = clone.nik;
    }
    return Object.assign(clone, {
      isNew: false,
      desilManual: !!w.desilManual,
      desil: String(w.desil || 5),
      bansos: w.bansos || 'Tidak Ada',
      _openIdx: 0,
      _activeBlok: 'I',
      _showRingkasan: false
    });
  },
  opName() {
    return this.state && this.state.auth && this.state.auth.nama || this.props.namaOperator || 'Budi Santoso';
  }
});

// ---------------------------------------------------------------------------
// Handler layer: navigasi, form FASIH, foto, validasi, simpan, sanggahan.
// Methods dibagi terpisah dari class body utama agar mudah dikelola.
// ---------------------------------------------------------------------------
Object.assign(Component.prototype, {
  nav(key) {
    this.setState({
      view: key,
      form: key === 'form' ? this.state.form : null,
      showSanggahanForm: false,
      processingId: null
    });
  },
  onSearch(e) {
    this.setState({
      search: e.target.value,
      page: 1
    });
  },
  onFilter(e) {
    const k = e.target.getAttribute('data-filter');
    const o = {};
    o[k] = e.target.value;
    o.page = 1;
    this.setState(o);
  },
  onTambah() {
    if (!this.canCrud()) return;
    this.setState({
      form: this.blankForm(),
      editId: null,
      view: 'form'
    });
  },
  mulaiEdit(id) {
    if (!this.canCrud()) return;
    const w = this.state.warga.find(x => x.id === id);
    this.setState({
      form: this.dataToForm(w),
      editId: id,
      view: 'form'
    });
  },
  onBatal() {
    this.setState({
      confirmModal: {
        type: 'batal'
      }
    });
  },
  keluarTanpaSimpan() {
    this.setState({
      form: null,
      editId: null,
      view: this.state.selectedId ? 'riwayat' : 'daftar',
      confirmModal: null
    });
  },
  // -- Handler form FASIH (nested path) ----------------------------------------
  onFormField(e) {
    this.setForm(e.target.getAttribute('data-path'), e.target.value);
  },
  setForm(path, val) {
    this.setState(s => {
      let f = setPath(s.form, path, val);
      if (path === 'nama') f = setPath(f, 'anggota.0.nama', val);
      if (path === 'nik') f = setPath(f, 'anggota.0.nik', val);
      return {
        form: f
      };
    });
  },
  toggleOpenAnggota(i) {
    this.setState(s => ({
      form: setPath(s.form, '_openIdx', s.form._openIdx === i ? -1 : i)
    }));
  },
  tambahAnggota() {
    if (!this.canCrud()) return;
    this.setState(s => {
      const ang = s.form.anggota.slice();
      ang.push(this.mkAnggota({
        no: ang.length + 1,
        hubungan: '3. Anak'
      }));
      let f = setPath(s.form, 'anggota', ang);
      return {
        form: setPath(f, '_openIdx', ang.length - 1)
      };
    });
  },
  hapusAnggota(i) {
    if (!this.canCrud()) return;
    const nm = this.state.form.anggota[i] && this.state.form.anggota[i].nama || 'Anggota ' + (i + 1);
    if (window.confirm && !window.confirm('Hapus "' + nm + '" dari roster anggota? Data yang sudah diisi akan hilang.')) return;
    this.setState(s => {
      let ang = s.form.anggota.slice();
      ang.splice(i, 1);
      ang = ang.map((a, j) => Object.assign({}, a, {
        no: j + 1
      }));
      let f = setPath(s.form, 'anggota', ang);
      return {
        form: setPath(f, '_openIdx', Math.max(0, Math.min(s.form._openIdx, ang.length - 1)))
      };
    });
  },
  setJumlahMeteran(n) {
    n = Math.max(0, Math.min(10, Number(n) || 0));
    const curLen = (this.state.form && this.state.form.meteran || []).length;
    if (n < curLen && window.confirm && !window.confirm('Mengurangi jumlah meteran akan menghapus ' + (curLen - n) + ' kartu pengisian. Lanjutkan?')) return;
    this.setState(s => {
      const cur = s.form.meteran.slice();
      while (cur.length < n) cur.push({
        daya: '',
        jenisId: 'ID Pelanggan',
        idPelanggan: ''
      });
      cur.length = n;
      return {
        form: setPath(s.form, 'meteran', cur)
      };
    });
  },
  // -- Navigasi form (sidebar / blok aktif / modal Ringkasan) ------------------
  goBlok(blok, openIdx, anchorPath) {
    this.setState(s => {
      let f = setPath(s.form, '_activeBlok', blok);
      f = setPath(f, '_showRingkasan', false);
      if (openIdx != null) f = setPath(f, '_openIdx', openIdx);
      return {
        form: f
      };
    });
    if (anchorPath && typeof document !== 'undefined') {
      const id = 'f_' + anchorPath;
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el && el.scrollIntoView) el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 70);
    }
  },
  goIssue(it) {
    let openIdx = null;
    const m = /^anggota\.(\d+)\./.exec(it.path || '');
    if (m) openIdx = Number(m[1]);
    this.goBlok(it.blok, openIdx, it.path);
  },
  toggleRingkasan(v) {
    this.setState(s => ({
      form: setPath(s.form, '_showRingkasan', typeof v === 'boolean' ? v : !s.form._showRingkasan)
    }));
  },
  // Progres pengisian: berapa field wajib (yang berlaku) sudah terisi.
  formProgress(k) {
    let total = 0,
      filled = 0;
    const E = v => !(v == null || String(v).trim() === '');
    const req = v => {
      total++;
      if (E(v)) filled++;
    };
    req(k.nama);
    req(k.nik);
    req(k.noKK);
    req(getPath(k, 'wilayah.kodePos'));
    req(getPath(k, 'wilayah.namaJalan'));
    req(k.alamatSesuaiKK);
    req(k.statusKeluarga);
    BLOK2.concat(BLOK2B).forEach(d => {
      if (d.when && !d.when(k)) return;
      req(getPath(k, d.p));
    });
    req(getPath(k, 'rumah.foto.depan'));
    req(getPath(k, 'rumah.foto.ruangTamu'));
    if (/dengan meteran/.test(getPath(k, 'rumah.sumberPenerangan') || '')) {
      if (!(k.meteran || []).length) {
        total++;
      }
      (k.meteran || []).forEach(m => {
        req(m.daya);
        req(m.idPelanggan);
      });
    }
    ASET22.forEach(a => req(getPath(k, 'aset.' + a[0])));
    ASET23.forEach(a => req(getPath(k, 'aset.' + a[0])));
    if (Number(getPath(k, 'aset.sepedaMotor')) > 0) req(getPath(k, 'aset.nilaiSepedaMotor'));
    if (Number(getPath(k, 'aset.mobil')) > 0) req(getPath(k, 'aset.nilaiMobil'));
    (k.anggota || []).forEach(a => {
      ANGGOTA_FIELDS.forEach(d => {
        if (d.rp === '_tglLahir') return;
        if (d.when && !d.when(k, a)) return;
        req(a[d.rp]);
      });
      req(a.tglLahir);
      req(a.blnLahir);
      req(a.thnLahir);
      DISABILITAS_ITEMS.forEach(it => req(getPath(a, 'disabilitas.' + it[0])));
      KESEHATAN_ITEMS.forEach(it => req(getPath(a, 'kesehatan.' + it[0])));
    });
    return {
      total: total,
      filled: filled,
      pct: total ? Math.round(100 * filled / total) : 0
    };
  },
  hapusFoto(path) {
    this.setState(s => ({
      form: setPath(s.form, path, null)
    }));
  },
  handleFoto(path, e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const before = file.size;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const max = 1024;
        let w = img.width,
          h = img.height;
        if (w >= h) {
          if (w > max) {
            h = Math.round(h * max / w);
            w = max;
          }
        } else {
          if (h > max) {
            w = Math.round(w * max / h);
            h = max;
          }
        }
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        let q = 0.7,
          url = c.toDataURL('image/jpeg', q),
          bytes = Math.round(url.split(',')[1].length * 3 / 4);
        while (bytes > 200000 && q > 0.32) {
          q -= 0.1;
          url = c.toDataURL('image/jpeg', q);
          bytes = Math.round(url.split(',')[1].length * 3 / 4);
        }
        this.setState(s => ({
          form: setPath(s.form, path, {
            src: url,
            before: before,
            after: bytes,
            uploading: this.serverMode()
          })
        }));
        if (this.serverMode()) this.uploadFotoServer(path, url, before, bytes);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  },
  // Unggah foto ke Google Drive (mode server). Pratinjau lokal tampil dahulu,
  // lalu src ditukar ke URL Drive saat sukses. Bila gagal, base64 dipertahankan.
  uploadFotoServer(path, dataUrl, before, after) {
    return this.apiCall('uploadFoto', {
      id: this.state.form && this.state.form.id,
      key: path,
      dataUrl: dataUrl
    }).then(res => {
      if (res && res.ok && res.url) {
        this.setState(s => ({
          form: setPath(s.form, path, {
            src: res.url,
            driveId: res.fileId,
            before: before,
            after: after
          })
        }));
        return true;
      }
      this.setState(s => ({
        form: setPath(s.form, path, {
          src: dataUrl,
          before: before,
          after: after
        }),
        toast: {
          type: 'err',
          msg: 'Gagal unggah foto ke Drive: ' + (res && res.error || 'tidak diketahui') + ' — tersimpan lokal.'
        }
      }));
      this.autoClear();
      return false;
    }).catch(() => {
      this.setState(s => ({
        form: setPath(s.form, path, {
          src: dataUrl,
          before: before,
          after: after
        }),
        toast: {
          type: 'err',
          msg: 'Foto tersimpan lokal — server tak terjangkau.'
        }
      }));
      this.autoClear();
      return false;
    });
  },
  // -- Validasi FASIH: GALAT (blokir finalisasi) / PERINGATAN / KOSONG ----------
  validateKeluarga(k) {
    const galat = [],
      peringatan = [],
      kosong = [];
    const isEmpty = v => v == null || String(v).trim() === '';
    const add = (arr, blok, r, label, path) => arr.push({
      blok: blok,
      rincian: r,
      label: label,
      path: path
    });
    // Blok I
    if (isEmpty(k.statusKeluarga)) add(galat, 'I', '16', 'Status Keberadaan Keluarga', 'statusKeluarga');
    const ditemukan = /^1\. Ditemukan/.test(k.statusKeluarga || '');
    if (ditemukan) {
      if (isEmpty(k.nama)) add(galat, 'I', '1a', 'Nama Kepala Keluarga', 'nama');
      if (!/^\d{16}$/.test(String(k.nik || ''))) add(galat, 'I', '1b', 'NIK Kepala Keluarga harus 16 digit angka', 'nik');
      if (!/^\d{16}$/.test(String(k.noKK || ''))) add(galat, 'I', '1c', 'No. Kartu Keluarga harus 16 digit angka', 'noKK');
      if (isEmpty(getPath(k, 'wilayah.kodePos'))) add(galat, 'I', '3f', 'Kode Pos', 'wilayah.kodePos');
      if (isEmpty(getPath(k, 'wilayah.namaJalan'))) add(galat, 'I', '3j', 'Nama Jalan', 'wilayah.namaJalan');
      if (isEmpty(k.alamatSesuaiKK)) add(galat, 'I', '4', 'Kesesuaian alamat dengan KK', 'alamatSesuaiKK');
      if (isEmpty(getPath(k, 'geotag.lat')) || isEmpty(getPath(k, 'geotag.long'))) add(kosong, 'I', '3l', 'Geotagging lokasi (lat/long)', 'geotag.lat');
    }
    // Blok II
    BLOK2.concat(BLOK2B).forEach(d => {
      if (d.when && !d.when(k)) return;
      const v = getPath(k, d.p);
      if (d.req && isEmpty(v)) add(galat, 'II', d.r, d.label, d.p);else if (d.p === 'rumah.luasLantai' && !isEmpty(v) && Number(v) <= 0) add(galat, 'II', '9', 'Luas lantai harus lebih dari 0', d.p);
    });
    if (!getPath(k, 'rumah.foto.depan')) add(galat, 'II', '21a', 'Foto tampak depan rumah', 'rumah.foto.depan');
    if (!getPath(k, 'rumah.foto.ruangTamu')) add(galat, 'II', '21b', 'Foto ruang tamu', 'rumah.foto.ruangTamu');
    if (!getPath(k, 'rumah.foto.kamarMandi')) add(kosong, 'II', '21c', 'Foto kamar mandi', 'rumah.foto.kamarMandi');
    const pakaiMeteran = /dengan meteran/.test(getPath(k, 'rumah.sumberPenerangan') || '');
    if (pakaiMeteran) {
      if (!(k.meteran && k.meteran.length)) add(galat, 'II', '18a', 'Jumlah meteran listrik minimal 1', 'rumah.sumberPenerangan');
      (k.meteran || []).forEach((m, i) => {
        if (isEmpty(m.daya)) add(galat, 'II', '18b', 'Daya terpasang meteran ke-' + (i + 1), 'meteran.' + i + '.daya');
        const digits = /No Meteran/.test(m.jenisId || '') ? 11 : 12;
        if (isEmpty(m.idPelanggan)) add(galat, 'II', '18c', 'ID Pelanggan/No Meteran ke-' + (i + 1), 'meteran.' + i + '.idPelanggan');else if (!new RegExp('^\\d{' + digits + '}$').test(String(m.idPelanggan))) add(galat, 'II', '18c', 'Meteran ke-' + (i + 1) + ': ' + (/No Meteran/.test(m.jenisId || '') ? 'No Meteran' : 'ID Pelanggan') + ' harus ' + digits + ' digit', 'meteran.' + i + '.idPelanggan');
      });
    }
    // Blok III
    ASET22.forEach(a => {
      if (isEmpty(getPath(k, 'aset.' + a[0]))) add(galat, 'III', '22', 'Jumlah ' + a[1], 'aset.' + a[0]);
    });
    if (Number(getPath(k, 'aset.sepedaMotor')) > 0 && isEmpty(getPath(k, 'aset.nilaiSepedaMotor'))) add(galat, 'III', '22g', 'Total nilai aset sepeda motor', 'aset.nilaiSepedaMotor');
    if (Number(getPath(k, 'aset.mobil')) > 0 && isEmpty(getPath(k, 'aset.nilaiMobil'))) add(galat, 'III', '22h', 'Total nilai aset mobil', 'aset.nilaiMobil');
    ASET23.forEach(a => {
      if (isEmpty(getPath(k, 'aset.' + a[0]))) add(galat, 'III', '23', 'Jumlah ' + a[1], 'aset.' + a[0]);
    });
    // Blok IV
    const ang = k.anggota || [];
    if (!ang.length) add(galat, 'IV', '24', 'Minimal satu anggota keluarga', 'anggota');
    let nKepala = 0;
    ang.forEach((a, i) => {
      const base = 'anggota.' + i + '.';
      const nm = a.nama || 'Anggota ' + (i + 1);
      ANGGOTA_FIELDS.forEach(d => {
        if (d.when && !d.when(k, a)) return;
        const v = a[d.rp];
        if (d.req && isEmpty(v)) add(galat, 'IV', d.r, d.label + ' — ' + nm, base + d.rp);else if (d.digits && !isEmpty(v) && !new RegExp('^\\d{' + d.digits + '}$').test(String(v))) add(galat, 'IV', d.r, nm + ': NIK harus ' + d.digits + ' digit angka', base + d.rp);
      });
      if (isEmpty(a.tglLahir) || isEmpty(a.blnLahir) || isEmpty(a.thnLahir)) add(galat, 'IV', '30', 'Tanggal/Bulan/Tahun lahir — ' + nm, base + 'thnLahir');
      DISABILITAS_ITEMS.forEach(it => {
        if (isEmpty(getPath(a, 'disabilitas.' + it[0]))) add(galat, 'IV', '38', it[1] + ' — ' + nm, base + 'disabilitas.' + it[0]);
      });
      KESEHATAN_ITEMS.forEach(it => {
        if (isEmpty(getPath(a, 'kesehatan.' + it[0]))) add(galat, 'IV', '39', it[1] + ' — ' + nm, base + 'kesehatan.' + it[0]);
      });
      if (/^1\. Kepala Keluarga/.test(a.hubungan || '')) nKepala++;
    });
    if (ang.length) {
      if (nKepala === 0) add(galat, 'IV', '32', 'Harus ada tepat satu Kepala Keluarga', 'anggota.0.hubungan');else if (nKepala > 1) add(galat, 'IV', '32', 'Kepala Keluarga lebih dari satu (' + nKepala + ')', 'anggota.0.hubungan');
      const krt = ang.find(a => /^1\. Kepala/.test(a.hubungan || ''));
      const pas = ang.find(a => /^2\. Istri\/Suami/.test(a.hubungan || ''));
      if (krt && pas && krt.jk && pas.jk && krt.jk === pas.jk) add(galat, 'IV', '29', 'Jenis kelamin Kepala Keluarga & pasangan harus berbeda', 'anggota.' + ang.indexOf(pas) + '.jk');
      if (!isEmpty(k.jumlahAnggotaKK) && Number(k.jumlahAnggotaKK) !== ang.length) add(peringatan, 'IV', '2b', 'Jumlah anggota hasil pendataan (' + ang.length + ') ≠ jumlah di KK (' + k.jumlahAnggotaKK + ')', 'anggota');
    }
    if (isEmpty(k.catatan)) add(kosong, 'V', '-', 'Catatan', 'catatan');
    return {
      galat: galat,
      peringatan: peringatan,
      kosong: kosong
    };
  },
  canFinalize(k) {
    return this.validateKeluarga(k || this.state.form).galat.length === 0;
  },
  konfirmasiSimpan(type) {
    if (!this.canCrud()) return;
    const f = this.state.form;
    if (!f || !f.nama || !f.nama.trim()) {
      this.setState({
        toast: {
          type: 'err',
          msg: 'Nama Kepala Keluarga wajib diisi untuk menyimpan.'
        }
      });
      this.autoClear();
      return;
    }
    if (type === 'final') {
      const v = this.validateKeluarga(f);
      if (v.galat.length > 0) {
        this.setState({
          toast: {
            type: 'err',
            msg: 'Belum bisa difinalisasi: masih ada ' + v.galat.length + ' GALAT yang harus diperbaiki.'
          }
        });
        this.autoClear();
        return;
      }
    }
    this.setState({
      confirmModal: {
        type: type
      }
    });
  },
  batalKonfirmasi() {
    this.setState({
      confirmModal: null
    });
  },
  bukaRiwayat(id) {
    const w = this.state.warga.find(x => x.id === id);
    const last = w.snapshots[w.snapshots.length - 1].tanggal;
    this.setState({
      view: 'riwayat',
      selectedId: id,
      selectedTanggal: last,
      showSanggahanForm: false
    });
  },
  pilihTanggal(t) {
    this.setState({
      selectedTanggal: t,
      showSanggahanForm: false
    });
  },
  onKembali() {
    this.setState({
      view: 'daftar',
      selectedId: null,
      selectedTanggal: null,
      showSanggahanForm: false
    });
  },
  onSort(col) {
    this.setState(s => ({
      sortBy: col,
      sortDir: s.sortBy === col && s.sortDir === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  },
  autoClear() {
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({
      toast: null
    }), 3600);
  },
  // Simpan keluarga. status='draft' selalu boleh (tersimpan langsung ke
  // spreadsheet/lokal); status='final' hanya bila GALAT=0 (gerbang submit).
  simpanKeluarga(status) {
    if (!this.canCrud()) return;
    const f = this.state.form;
    if (!f.nama || !f.nama.trim()) {
      this.setState({
        toast: {
          type: 'err',
          msg: 'Nama Kepala Keluarga wajib diisi untuk menyimpan.'
        }
      });
      this.autoClear();
      return;
    }
    if (status === 'final') {
      const v = this.validateKeluarga(f);
      if (v.galat.length > 0) {
        this.setState({
          toast: {
            type: 'err',
            msg: 'Belum bisa difinalisasi: masih ada ' + v.galat.length + ' GALAT yang harus diperbaiki.'
          }
        });
        this.autoClear();
        return;
      }
    }
    const today = todayWITA(),
      operator = this.opName();
    const fId = f.id || 'w' + Date.now();
    const summary = this.deriveSummary(f);
    const foto = Object.assign({}, f.rumah && f.rumah.foto || this.emptyFoto());
    const struct = JSON.parse(JSON.stringify(f));
    delete struct.isNew;
    delete struct._openIdx;
    delete struct._activeBlok;
    delete struct._showRingkasan;
    const identity = {
      id: fId,
      noKK: f.noKK,
      nik: f.nik,
      nama: f.nama,
      desa: f.desa,
      dusun: f.dusun,
      rt: f.rt,
      rw: f.rw,
      alamat: f.alamat
    };
    const base = Object.assign({}, struct, identity, summary, {
      status: status,
      foto: foto,
      jumlahAnggotaKK: f.jumlahAnggotaKK || summary.jumlahAnggota,
      aset: struct.aset
    });
    this.setState(s => {
      const warga = s.warga.slice();
      const idx = warga.findIndex(w => w.id === fId);
      const baru = idx < 0;
      if (baru) {
        warga.push(Object.assign({}, base, {
          snapshots: [{
            tanggal: today,
            operator: operator,
            data: summary,
            foto: foto,
            fieldYangBerubah: []
          }]
        }));
      } else {
        const w = warga[idx];
        let snaps = w.snapshots.slice();
        // Compare against the most recent snapshot before today; if none (record created today),
        // fall back to today's existing snapshot so same-day edits still produce a diff.
        const prevDay = snaps.filter(x => x.tanggal !== today).sort((a, b) => a.tanggal < b.tanggal ? 1 : -1)[0];
        const before = prevDay || snaps.find(x => x.tanggal === today);
        const diff = before ? this.computeDiff(before.data, summary) : [];
        const snap = {
          tanggal: today,
          operator: operator,
          data: summary,
          foto: foto,
          fieldYangBerubah: diff
        };
        const si = snaps.findIndex(x => x.tanggal === today);
        if (si >= 0) snaps[si] = snap;else snaps.push(snap);
        snaps.sort((a, b) => a.tanggal < b.tanggal ? -1 : 1);
        warga[idx] = Object.assign({}, w, base, {
          snapshots: snaps
        });
      }
      const lab = status === 'final' ? 'difinalisasi (Final)' : 'disimpan sebagai draf';
      const msg = (baru ? 'Keluarga baru ' : 'Perubahan ') + lab + '. Snapshot ' + this.formatTanggal(today) + '.';
      return {
        warga: warga,
        view: 'riwayat',
        selectedId: fId,
        selectedTanggal: today,
        form: null,
        editId: null,
        confirmModal: null,
        toast: {
          type: 'ok',
          msg: msg
        }
      };
    }, () => {
      const w = this.state.warga.find(x => x.id === fId);
      if (w && w.id) this.push('saveWarga', {
        warga: w
      });
    });
    this.autoClear();
  },
  onSanggahanChange(e) {
    const k = e.target.getAttribute('data-sgfield');
    const v = e.target.value;
    this.setState(s => ({
      sanggahanForm: Object.assign({}, s.sanggahanForm, {
        [k]: v
      })
    }));
  },
  onBukaFormSanggahan() {
    if (!this.canCrud()) return;
    this.setState({
      showSanggahanForm: true,
      sanggahanForm: {
        pengaju: '',
        nik: '',
        hubungan: 'Warga Bersangkutan',
        alasan: ''
      }
    });
  },
  onTutupFormSanggahan() {
    this.setState({
      showSanggahanForm: false
    });
  },
  onSubmitSanggahan() {
    if (!this.canCrud()) return;
    const f = this.state.sanggahanForm;
    if (!f.pengaju.trim() || !f.alasan.trim()) {
      this.setState({
        toast: {
          type: 'err',
          msg: 'Nama pengaju dan alasan sanggahan wajib diisi.'
        }
      });
      this.autoClear();
      return;
    }
    const newSg = {
      id: 's' + Date.now(),
      wargaId: this.state.selectedId,
      tanggalSnapshot: this.state.selectedTanggal,
      pengaju: f.pengaju,
      nik: f.nik || '-',
      hubungan: f.hubungan,
      alasan: f.alasan,
      status: 'Diajukan',
      tanggalPengajuan: this.state.today,
      tanggalSelesai: '',
      catatanOperator: ''
    };
    this.setState(s => ({
      sanggahan: [...s.sanggahan, newSg],
      showSanggahanForm: false,
      sanggahanForm: {
        pengaju: '',
        nik: '',
        hubungan: 'Warga Bersangkutan',
        alasan: ''
      },
      toast: {
        type: 'ok',
        msg: 'Sanggahan berhasil diajukan dan masuk antrean proses.'
      }
    }));
    this.push('submitSanggahan', {
      sanggahan: newSg
    });
    this.autoClear();
  },
  updateStatus(id, status) {
    if (!this.canCrud()) return;
    this.setState(s => ({
      sanggahan: s.sanggahan.map(x => x.id === id ? Object.assign({}, x, {
        status: status
      }) : x)
    }));
    this.push('updateSanggahan', {
      id: id,
      status: status
    });
  },
  mulaiProses(id) {
    if (!this.canCrud()) return;
    this.setState({
      processingId: id,
      processCatatan: ''
    });
  },
  selesaikanSanggahan(id, status, catatan) {
    if (!this.canCrud()) return;
    const tgl = this.state.today;
    this.setState(s => ({
      sanggahan: s.sanggahan.map(x => x.id === id ? Object.assign({}, x, {
        status: status,
        catatanOperator: catatan,
        tanggalSelesai: s.today
      }) : x),
      processingId: null,
      processCatatan: ''
    }));
    this.push('updateSanggahan', {
      id: id,
      status: status,
      catatanOperator: catatan,
      tanggalSelesai: tgl
    });
  },
  hapusWarga(id) {
    if (!this.canCrud()) return;
    const w = this.state.warga.find(x => x.id === id);
    if (!w) return;
    if (!window.confirm('Hapus data keluarga "' + w.nama + '"?\nSemua snapshot dan sanggahan terkait akan ikut terhapus permanen.')) return;
    this.setState(s => ({
      warga: s.warga.filter(x => x.id !== id),
      sanggahan: s.sanggahan.filter(x => x.wargaId !== id),
      view: 'daftar',
      selectedId: null,
      selectedTanggal: null,
      toast: {
        type: 'ok',
        msg: '"' + w.nama + '" berhasil dihapus.'
      }
    }));
    this.push('deleteWarga', {
      id: id
    });
    this.autoClear();
  }
});

// Render layer (renderVals, renderLogin, field, yt, renderForm, render).
// Concatenated LAST by build.js — depends on utils.js, schema.js, component.jsx,
// component-data.jsx, component-handlers.jsx.
Object.assign(Component.prototype, {
  renderVals() {
    const st = this.state;
    const auth = st.auth;
    const canCrud = this.canCrud();
    const namaDesa = this.props.namaDesa || 'Kec. Tejakula, Buleleng';
    const namaOperator = this.opName();
    const opInitials = namaOperator.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
    // Lingkup data: Kepala SLS hanya melihat warga & sanggahan di wilayahnya.
    const vWarga = this.visibleWarga();
    const vIds = {};
    vWarga.forEach(w => {
      vIds[w.id] = true;
    });
    const vSanggahan = st.sanggahan.filter(sg => vIds[sg.wargaId]);
    const sanggahanPending = vSanggahan.filter(s => s.status === 'Diajukan' || s.status === 'Diproses').length;
    const titles = {
      dashboard: 'Dashboard',
      daftar: 'Daftar Warga',
      form: st.form && !st.form.isNew ? 'Edit Data' : 'Tambah Data',
      riwayat: 'Riwayat Perubahan',
      sanggahan: 'Usul Sanggah'
    };
    const mkNav = (key, label, badge) => {
      const active = st.view === key || key === 'daftar' && (st.view === 'form' || st.view === 'riwayat');
      return {
        label: label,
        badge: badge || 0,
        active: active,
        onClick: () => this.nav(key),
        style: 'width:100%;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border:none;border-radius:10px;cursor:pointer;font-family:inherit;font-size:13.5px;font-weight:' + (active ? '700' : '500') + ';color:' + (active ? '#fff' : '#3d4152') + ';background:' + (active ? '#1e50d0' : 'transparent') + ';transition:background 0.15s,color 0.15s;'
      };
    };
    const navItems = [mkNav('dashboard', 'Dashboard'), mkNav('daftar', 'Daftar Warga'), mkNav('sanggahan', 'Sanggahan', sanggahanPending)];
    const q = st.search.trim().toLowerCase();
    let list = vWarga.filter(w => {
      if (q && (w.nama + ' ' + w.nik + ' ' + w.noKK).toLowerCase().indexOf(q) < 0) return false;
      if (st.filterDesa !== 'semua' && w.desa !== st.filterDesa) return false;
      if (st.filterRt !== 'semua' && 'RT ' + w.rt + ' / RW ' + w.rw !== st.filterRt) return false;
      if (st.filterDesil !== 'semua') {
        if (st.filterDesil === 'prioritas') {
          if (w.desil > 4) return false;
        } else if (String(w.desil) !== st.filterDesil) return false;
      }
      if (st.filterBansos !== 'semua' && w.bansos !== st.filterBansos) return false;
      return true;
    });
    if (st.sortBy) {
      const sb = st.sortBy,
        sd = st.sortDir;
      list = list.slice().sort((a, b) => {
        let va = a[sb],
          vb = b[sb];
        if (sb === 'desil') {
          va = Number(va);
          vb = Number(vb);
        }
        const c = va < vb ? -1 : va > vb ? 1 : 0;
        return sd === 'asc' ? c : -c;
      });
    }
    const listAll = list;
    const pageSize = 10;
    const rawPage = st.page || 1;
    const jumlahHalaman = Math.max(1, Math.ceil(listAll.length / pageSize));
    const currentPage = Math.min(rawPage, jumlahHalaman);
    const pageSlice = listAll.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const wargaTampil = pageSlice.map(w => {
      const ds = this.getDS(w.desil);
      const bs = this.bansosStyle(w.bansos);
      const draf = w.status === 'draft';
      return {
        id: w.id,
        nama: w.nama,
        nik: 'NIK ' + w.nik,
        dusun: w.dusun,
        snapCount: w.snapshots.length,
        desilLabel: 'Desil ' + w.desil,
        desilBadgeStyle: 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;color:' + ds.text + ';background:' + ds.bg + ';',
        bansos: w.bansos,
        bansosBadgeStyle: 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;color:' + bs.text + ';background:' + bs.bg + ';',
        isDraf: draf,
        statusLabel: draf ? 'Draf' : 'Final',
        statusBadgeStyle: 'display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;color:' + (draf ? '#92400e' : '#166534') + ';background:' + (draf ? '#fef3c7' : '#dcfce7') + ';border:1px solid ' + (draf ? '#fde68a' : '#bbf7d0') + ';',
        onLihat: () => this.bukaRiwayat(w.id),
        onHover: e => {
          e.currentTarget.style.background = '#f9f9f7';
        },
        onLeave: e => {
          e.currentTarget.style.background = '';
        }
      };
    });
    const desaSet = [];
    vWarga.forEach(w => {
      if (w.desa && desaSet.indexOf(w.desa) < 0) desaSet.push(w.desa);
    });
    desaSet.sort();
    const desaOptions = [{
      value: 'semua',
      label: 'Semua Desa'
    }].concat(desaSet.map(v => ({
      value: v,
      label: v
    })));
    const rtSet = [];
    vWarga.forEach(w => {
      const v = 'RT ' + w.rt + ' / RW ' + w.rw;
      if (rtSet.indexOf(v) < 0) rtSet.push(v);
    });
    rtSet.sort();
    const rtOptions = [{
      value: 'semua',
      label: 'Semua RT/RW'
    }].concat(rtSet.map(v => ({
      value: v,
      label: v
    })));
    const desilFilterOpts = [{
      value: 'semua',
      label: 'Semua Desil'
    }, {
      value: 'prioritas',
      label: 'Prioritas (1–4)'
    }];
    for (let d = 1; d <= 10; d++) desilFilterOpts.push({
      value: String(d),
      label: 'Desil ' + d
    });
    const bansosFilterOpts = [{
      value: 'semua',
      label: 'Semua Bansos'
    }, {
      value: 'PKH',
      label: 'PKH'
    }, {
      value: 'BPNT',
      label: 'BPNT'
    }, {
      value: 'PKH + BPNT',
      label: 'PKH + BPNT'
    }, {
      value: 'Tidak Ada',
      label: 'Tidak Ada'
    }];
    const sgFilterOpts = [{
      value: 'semua',
      label: 'Semua Status'
    }, {
      value: 'Diajukan',
      label: 'Diajukan'
    }, {
      value: 'Diproses',
      label: 'Diproses'
    }, {
      value: 'Diterima',
      label: 'Diterima'
    }, {
      value: 'Ditolak',
      label: 'Ditolak'
    }];
    const all = vWarga;
    const statTotal = all.length,
      statPrioritas = all.filter(w => w.desil <= 4).length,
      statBansos = all.filter(w => w.bansos !== 'Tidak Ada').length;
    const counts = [];
    for (let d = 1; d <= 10; d++) counts.push(all.filter(w => w.desil === d).length);
    const maxC = Math.max(1, Math.max.apply(null, counts));
    const desilBars = counts.map((c, i) => {
      const d = i + 1;
      const ds = this.getDS(d);
      const hh = c > 0 ? Math.max(8, Math.round(c / maxC * 148)) : 3;
      return {
        desil: d,
        count: c,
        barStyle: 'width:76%;border-radius:5px 5px 0 0;height:' + hh + 'px;background:' + ds.solid + ';',
        numStyle: 'font-size:11px;font-weight:700;color:' + (d <= 4 ? '#c2410c' : '#9ba2b6') + ';'
      };
    });
    const perubahanList = [];
    all.forEach(w => {
      if (w.snapshots.length >= 2) {
        const a = w.snapshots[w.snapshots.length - 2].data.desil;
        const b = w.snapshots[w.snapshots.length - 1].data.desil;
        if (a !== b) {
          const naik = b > a;
          perubahanList.push({
            nama: w.nama,
            desilText: 'Desil ' + a + ' → ' + b,
            dampak: naik ? 'Berisiko keluar dari daftar bansos' : 'Berpotensi masuk daftar bansos',
            icon: naik ? '↑' : '↓',
            rowStyle: 'display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;background:' + (naik ? '#fff7f5' : '#f0f5ff') + ';border:1px solid ' + (naik ? '#fcd8d0' : '#c9d9f7') + ';',
            iconStyle: 'flex:none;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;background:' + (naik ? '#dc4a35' : '#1e50d0') + ';',
            dampakStyle: 'font-size:11px;font-weight:700;color:' + (naik ? '#b91c1c' : '#1d4ed8') + ';'
          });
        }
      }
    });
    let form = st.form,
      formDesilLabel = '',
      formDesilStyle = '',
      formDesilHint = '',
      validasi = {
        galat: [],
        peringatan: [],
        kosong: []
      },
      canFinalize = false;
    if (form) {
      const fd = form.desilManual ? Number(form.desil || 5) : this.hitungDesil(this.deriveDesilInputs(form));
      const ds = this.getDS(fd);
      formDesilLabel = 'Desil ' + fd;
      formDesilStyle = 'display:inline-flex;align-items:center;padding:8px 18px;border-radius:20px;font-size:18px;font-weight:800;color:' + ds.text + ';background:' + ds.bg + ';';
      formDesilHint = form.desilManual ? '(input manual)' : 'dihitung otomatis dari isian';
      validasi = this.validateKeluarga(form);
      canFinalize = validasi.galat.length === 0;
    }
    let riwayatWarga = null,
      snapshotList = [],
      selectedSnap = null;
    const rw = st.warga.find(w => w.id === st.selectedId);
    if (rw) {
      const ds = this.getDS(rw.desil);
      const bs = this.bansosStyle(rw.bansos);
      riwayatWarga = {
        nama: rw.nama,
        nik: 'NIK ' + rw.nik,
        noKK: 'No. KK ' + rw.noKK,
        rtRw: 'RT ' + rw.rt + ' / RW ' + rw.rw + ' · ' + rw.dusun + (rw.desa ? ' · ' + rw.desa : ''),
        desilLabel: 'Desil ' + rw.desil,
        desilStyle: 'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:700;color:' + ds.text + ';background:' + ds.bg + ';',
        bansosStyle: 'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:600;color:' + bs.text + ';background:' + bs.bg + ';',
        bansos: rw.bansos,
        onEdit: () => this.mulaiEdit(rw.id),
        onHapus: () => this.hapusWarga(rw.id)
      };
      const earliest = rw.snapshots.slice().sort((a, b) => a.tanggal < b.tanggal ? -1 : 1)[0].tanggal;
      const sorted = rw.snapshots.slice().sort((a, b) => a.tanggal < b.tanggal ? 1 : -1);
      snapshotList = sorted.map(sn => {
        const active = sn.tanggal === st.selectedTanggal;
        const ds2 = this.getDS(sn.data.desil);
        const np = sn.fieldYangBerubah.length;
        const awal = sn.tanggal === earliest;
        return {
          tanggalStr: this.formatTanggal(sn.tanggal),
          operator: 'oleh ' + sn.operator,
          desilLabel: 'Desil ' + sn.data.desil,
          desilStyle: 'display:inline-flex;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;color:' + ds2.text + ';background:' + ds2.bg + ';',
          metaStr: awal && np === 0 ? 'Snapshot awal' : np > 0 ? np + ' field berubah' : 'Tidak ada perubahan',
          metaStyle: 'font-size:11.5px;font-weight:700;color:' + (awal && np === 0 ? '#9ba2b6' : np > 0 ? '#b45309' : '#9ba2b6') + ';',
          onClick: () => this.pilihTanggal(sn.tanggal),
          rowStyle: 'display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;border:none;cursor:pointer;padding:12px 14px;border-radius:10px;font-family:inherit;background:' + (active ? '#eef2fc' : 'transparent') + ';border-left:3px solid ' + (active ? '#1e50d0' : 'transparent') + ';transition:background 0.15s,border-color 0.15s;'
        };
      });
      const snap = rw.snapshots.find(s => s.tanggal === st.selectedTanggal) || sorted[0];
      if (snap) {
        const ch = {};
        snap.fieldYangBerubah.forEach(x => {
          ch[x.label] = true;
        });
        const ks = this.diffKeys();
        const dataRows = ks.map(k => {
          const c = !!ch[k[1]];
          return {
            label: k[1],
            value: this.fmtVal(k[0], snap.data[k[0]]),
            cellStyle: 'display:flex;flex-direction:column;gap:3px;padding:11px 13px;background:' + (c ? '#fffbf0' : '#fff') + ';',
            valueStyle: 'font-size:13px;font-weight:' + (c ? '700' : '600') + ';color:' + (c ? '#92400e' : '#2c3442') + ';'
          };
        });
        const sl = [['depan', 'Tampak Depan'], ['ruangTamu', 'Ruang Tamu'], ['kamarMandi', 'Kamar Mandi']];
        const snapFoto = sl.map(s => {
          const ft = snap.foto[s[0]];
          const has = !!(ft && ft.src);
          return {
            label: s[1],
            hasFoto: has,
            kosong: !has,
            src: has ? ft.src : ''
          };
        });
        const sgForSnap = st.sanggahan.filter(sg => sg.wargaId === rw.id && sg.tanggalSnapshot === snap.tanggal);
        const sgForSnapDisplay = sgForSnap.map(sg => {
          const ss = this.sgStatusStyle(sg.status);
          return {
            pengaju: sg.pengaju,
            hubungan: sg.hubungan,
            alasan: sg.alasan,
            status: sg.status,
            tanggalPengajuanStr: this.formatTanggal(sg.tanggalPengajuan),
            statusStyle: 'display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:700;color:' + ss.text + ';background:' + ss.bg + ';',
            snapCardStyle: 'background:#fafaf9;border:1px solid #e8e8e6;border-radius:10px;padding:12px 14px;'
          };
        });
        selectedSnap = {
          tanggalStr: this.formatTanggal(snap.tanggal),
          operator: 'Diubah oleh ' + snap.operator,
          adaPerubahan: snap.fieldYangBerubah.length > 0,
          snapAwal: snap.tanggal === earliest,
          jumlahPerubahan: snap.fieldYangBerubah.length + ' perubahan',
          diffList: snap.fieldYangBerubah,
          dataRows: dataRows,
          snapFoto: snapFoto,
          jumlahSanggahan: sgForSnap.length > 0 ? sgForSnap.length + ' sanggahan' : ''
        };
        Object.defineProperty(selectedSnap, 'sanggahanList', {
          value: sgForSnapDisplay,
          enumerable: true
        });
      }
    }
    const sanggahanForSnap = selectedSnap && selectedSnap.sanggahanList ? selectedSnap.sanggahanList : [];
    const canAjukanSanggahan = !st.showSanggahanForm;
    const sgFiltered = vSanggahan.filter(sg => st.filterSanggahan === 'semua' || sg.status === st.filterSanggahan);
    const sanggahanListDisplay = sgFiltered.map(sg => {
      const wg = st.warga.find(w => w.id === sg.wargaId);
      const ss = this.sgStatusStyle(sg.status);
      const isProcessing = st.processingId === sg.id;
      const canProses = sg.status === 'Diajukan';
      const canSelesai = sg.status === 'Diproses' && !isProcessing;
      const isSelesai = sg.status === 'Diterima' || sg.status === 'Ditolak';
      const showActions = !isSelesai && !isProcessing;
      return {
        id: sg.id,
        wargaNama: wg ? wg.nama : '—',
        tanggalSnapshotStr: this.formatTanggal(sg.tanggalSnapshot),
        tanggalPengajuanStr: this.formatTanggal(sg.tanggalPengajuan),
        tanggalSelesaiStr: sg.tanggalSelesai ? this.formatTanggal(sg.tanggalSelesai) : '',
        pengaju: sg.pengaju,
        nik: sg.nik,
        hubungan: sg.hubungan,
        alasan: sg.alasan,
        status: sg.status,
        catatanOperator: sg.catatanOperator,
        adaCatatan: !!sg.catatanOperator,
        statusStyle: 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;color:' + ss.text + ';background:' + ss.bg + ';',
        isProcessing,
        canProses,
        canSelesai,
        showActions,
        isSelesai,
        processCatatan: isProcessing ? st.processCatatan : '',
        onTandaiProses: () => this.updateStatus(sg.id, 'Diproses'),
        onTolakLangsung: () => this.selesaikanSanggahan(sg.id, 'Ditolak', ''),
        onMulaiSelesai: () => this.mulaiProses(sg.id),
        onBatalProses: () => this.setState({
          processingId: null
        }),
        onTerima: () => this.selesaikanSanggahan(sg.id, 'Diterima', st.processCatatan),
        onTolak: () => this.selesaikanSanggahan(sg.id, 'Ditolak', st.processCatatan),
        onProcessCatatan: e => this.setState({
          processCatatan: e.target.value
        })
      };
    });
    let toastStyle = '';
    if (st.toast) {
      const ok = st.toast.type !== 'err';
      toastStyle = 'position:fixed;right:' + (st.isMobile ? '12px' : '20px') + ';bottom:' + (st.isMobile ? '70px' : '20px') + ';z-index:60;padding:13px 18px;border-radius:12px;font-size:13px;font-weight:600;color:#fff;max-width:' + (st.isMobile ? 'calc(100vw - 24px)' : '380px') + ';box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:tslide 0.25s ease;background:' + (ok ? '#16a34a' : '#dc2626') + ';';
    }
    return {
      auth: auth,
      canCrud: canCrud,
      roleLabel: auth ? auth.role : '',
      wilayahLabel: auth && auth.wilayah ? auth.wilayah : '',
      serverMode: this.serverMode(),
      namaDesa: namaDesa,
      namaOperator: namaOperator,
      opInitials: opInitials,
      pageTitle: titles[st.view],
      tanggalHariIni: this.formatTanggal(st.today),
      navItems: navItems,
      isDashboard: st.view === 'dashboard',
      isDaftar: st.view === 'daftar',
      isForm: st.view === 'form',
      isRiwayat: st.view === 'riwayat',
      isSanggahan: st.view === 'sanggahan',
      search: st.search,
      filterDesa: st.filterDesa,
      filterRt: st.filterRt,
      filterDesil: st.filterDesil,
      filterBansos: st.filterBansos,
      filterSanggahan: st.filterSanggahan,
      onSearch: e => this.onSearch(e),
      onFilter: e => this.onFilter(e),
      onTambah: () => this.onTambah(),
      desaOptions: desaOptions,
      rtOptions: rtOptions,
      desilFilterOpts: desilFilterOpts,
      bansosFilterOpts: bansosFilterOpts,
      sgFilterOpts: sgFilterOpts,
      wargaTampil: wargaTampil,
      kosong: wargaTampil.length === 0,
      jumlahTampil: listAll.length,
      statTotal: statTotal,
      statPrioritas: statPrioritas,
      statBansos: statBansos,
      statPerubahan: perubahanList.length,
      statSanggahan: sanggahanPending,
      desilBars: desilBars,
      perubahanList: perubahanList,
      tidakAdaPerubahan: perubahanList.length === 0,
      form: form,
      formDesilLabel: formDesilLabel,
      formDesilStyle: formDesilStyle,
      formDesilHint: formDesilHint,
      validasi: validasi,
      canFinalize: canFinalize,
      onSimpanDraf: () => this.konfirmasiSimpan('draft'),
      onFinalisasi: () => this.konfirmasiSimpan('final'),
      onBatal: () => this.onBatal(),
      onKeluarTanpaSimpan: () => this.keluarTanpaSimpan(),
      onSort: col => this.onSort(col),
      sortBy: st.sortBy,
      sortDir: st.sortDir,
      loading: st.loading,
      isMobile: st.isMobile,
      jumlahHalaman: jumlahHalaman,
      currentPage: currentPage,
      jumlahTotal: listAll.length,
      onPrevPage: () => this.setState(s => ({
        page: Math.max(1, (s.page || 1) - 1)
      })),
      onNextPage: () => this.setState(s => ({
        page: Math.min(jumlahHalaman, (s.page || 1) + 1)
      })),
      onGoPage: p => this.setState({
        page: p
      }),
      showScrollTop: st.showScrollTop,
      riwayatWarga: riwayatWarga,
      snapshotList: snapshotList,
      selectedSnap: selectedSnap || {
        tanggalStr: '',
        operator: '',
        adaPerubahan: false,
        snapAwal: false,
        jumlahPerubahan: '',
        diffList: [],
        dataRows: [],
        snapFoto: [],
        jumlahSanggahan: ''
      },
      sanggahanForSnap: sanggahanForSnap,
      showSanggahanForm: st.showSanggahanForm,
      sanggahanForm: st.sanggahanForm,
      canAjukanSanggahan: canAjukanSanggahan,
      onBukaFormSanggahan: () => this.onBukaFormSanggahan(),
      onTutupFormSanggahan: () => this.onTutupFormSanggahan(),
      onSanggahanChange: e => this.onSanggahanChange(e),
      onSubmitSanggahan: () => this.onSubmitSanggahan(),
      sanggahanListDisplay: sanggahanListDisplay,
      sgKosong: sanggahanListDisplay.length === 0,
      onKembali: () => this.onKembali(),
      toast: st.toast,
      toastStyle: toastStyle,
      confirmModal: st.confirmModal,
      onBatalKonfirmasi: () => this.batalKonfirmasi(),
      onKonfirmasiOk: () => {
        if (st.confirmModal) this.simpanKeluarga(st.confirmModal.type);
      }
    };
  },
  renderLogin() {
    const lf = this.state.loginForm;
    const isLoading = this.state.loading;
    const inpL = 'width:100%;padding:11px 13px;border:1.5px solid #e0e0de;border-radius:9px;font-family:inherit;font-size:14px;color:#18191f;background:#fafaf9;';
    const labL = 'display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:6px;';
    const demo = [{
      r: 'Kepala Desa',
      u: 'kepaladesa',
      p: 'desa123',
      note: 'CRUD penuh'
    }, {
      r: 'Operator',
      u: 'operator',
      p: 'operator123',
      note: 'CRUD penuh'
    }, {
      r: 'Kepala SLS',
      u: 'sls.tembok',
      p: 'sls123',
      note: 'Hanya-lihat · B.D. Tembok'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: css("min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:#f5f5f2; font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:#18191f;")
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:100%; max-width:400px; display:flex; flex-direction:column; gap:16px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:48px; height:48px; border-radius:13px; background:#1e50d0; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:#fff; letter-spacing:-0.03em;')
    }, "DT"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:19px; font-weight:800; letter-spacing:-0.02em;')
    }, "DTSEN Desa"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px; color:#9ba2b6; margin-top:2px;')
    }, "Masuk untuk mengelola data desa"))), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => this.login(e),
      style: css('background:#fff; border-radius:14px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:14px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(labL)
    }, "Username"), /*#__PURE__*/React.createElement("input", {
      "data-login": "username",
      value: lf.username,
      onChange: e => this.onLoginField(e),
      autoFocus: true,
      placeholder: "mis. operator",
      style: css(inpL)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(labL)
    }, "Kata Sandi"), /*#__PURE__*/React.createElement("input", {
      "data-login": "password",
      type: "password",
      value: lf.password,
      onChange: e => this.onLoginField(e),
      placeholder: "••••••",
      style: css(inpL)
    })), lf.error && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px; font-weight:600; color:#b91c1c; background:#fef2f2; border:1px solid #fca5a5; border-radius:8px; padding:9px 12px;')
    }, lf.error), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      disabled: isLoading,
      style: css('padding:12px; font-family:inherit; font-size:14px; font-weight:700; border:none; background:' + (isLoading ? '#93b4ef' : '#1e50d0') + '; color:#fff; border-radius:9px; cursor:' + (isLoading ? 'not-allowed' : 'pointer') + '; margin-top:2px; display:flex; align-items:center; justify-content:center; gap:8px;')
    }, isLoading && /*#__PURE__*/React.createElement("span", {
      style: css('width:16px;height:16px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block;')
    }), isLoading ? 'Memuat…' : 'Masuk')), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:16px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px;')
    }, "Akun Demo"), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:8px;')
    }, demo.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:12.5px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:1px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-weight:700; color:#18191f;')
    }, d.r), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#9ba2b6;')
    }, d.note)), /*#__PURE__*/React.createElement("span", {
      style: css('font-family:Menlo,monospace; font-size:11.5px; color:#52576b; background:#f5f5f2; padding:4px 9px; border-radius:7px; white-space:nowrap;')
    }, d.u, " / ", d.p))))), /*#__PURE__*/React.createElement("div", {
      style: css('text-align:center; font-size:11px; font-weight:700; color:#92400e; letter-spacing:0.03em;')
    }, "PROTOTYPE · autentikasi demo sisi-klien")));
  },
  // -- Render satu field FASIH (label kiri | kontrol kanan) ---------------------
  field(o) {
    const inp = 'width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;';
    let control;
    if (o.type === 'radio') {
      control = /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-direction:column;gap:6px;')
      }, o.opts.map((opt, i) => {
        const on = o.value === opt;
        return /*#__PURE__*/React.createElement("label", {
          key: i,
          onClick: () => this.setForm(o.p, opt),
          style: css('display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:8px;cursor:pointer;font-size:13px;border:1.5px solid ' + (on ? '#f3cba8' : '#ececea') + ';background:' + (on ? ORANGE_BG : '#fff') + ';color:' + (on ? '#9a4a12' : '#3d4152') + ';font-weight:' + (on ? '700' : '500') + ';transition:background 0.13s,border-color 0.13s,color 0.13s;')
        }, /*#__PURE__*/React.createElement("span", {
          style: css('flex:none;width:16px;height:16px;border-radius:50%;border:2px solid ' + (on ? ORANGE : '#c4c8d4') + ';background:' + (on ? 'radial-gradient(circle, ' + ORANGE + ' 0 4px, #fff 5px)' : '#fff') + ';transition:border-color 0.13s,background 0.13s;')
        }), opt);
      }));
    } else if (o.type === 'select') {
      control = /*#__PURE__*/React.createElement("select", {
        value: o.value || '',
        onChange: e => this.setForm(o.p, e.target.value),
        style: css(inp + 'cursor:pointer;')
      }, /*#__PURE__*/React.createElement("option", {
        value: ""
      }, "— pilih —"), o.opts.map((opt, i) => /*#__PURE__*/React.createElement("option", {
        key: i,
        value: opt
      }, opt)));
    } else {
      const num = o.type === 'number',
        rup = o.type === 'rupiah';
      const setv = v => this.setForm(o.p, String(v).replace(/[^0-9]/g, ''));
      const fmtDisp = v => (num || rup) && v != null && v !== '' ? Number(v).toLocaleString('id-ID') : v == null ? '' : String(v);
      control = /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;align-items:stretch;')
      }, rup && /*#__PURE__*/React.createElement("span", {
        style: css('display:flex;align-items:center;padding:0 11px;border:1.5px solid #e0e0de;border-right:none;border-radius:8px 0 0 8px;background:#f7f7f5;color:#6b7280;font-size:13px;font-weight:600;')
      }, "Rp"), /*#__PURE__*/React.createElement("input", {
        value: fmtDisp(o.value),
        inputMode: num || rup ? 'numeric' : undefined,
        onChange: e => this.setForm(o.p, num || rup ? e.target.value.replace(/[^0-9]/g, '') : e.target.value),
        style: css(inp + 'min-width:0;' + (rup ? 'border-radius:0;' : num ? 'border-radius:8px 0 0 8px;' : ''))
      }), num && /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-direction:column;border:1.5px solid #e0e0de;border-left:none;border-radius:0 8px 8px 0;overflow:hidden;flex:none;')
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setv(Number(o.value || 0) + 1),
        style: css('border:none;border-bottom:1px solid #e0e0de;background:#f7f7f5;cursor:pointer;padding:0 10px;font-size:9px;color:#52576b;flex:1;')
      }, "▲"), /*#__PURE__*/React.createElement("button", {
        onClick: () => setv(Math.max(0, Number(o.value || 0) - 1)),
        style: css('border:none;background:#f7f7f5;cursor:pointer;padding:0 10px;font-size:9px;color:#52576b;flex:1;')
      }, "▼")));
    }
    const mob = this.state.isMobile;
    return /*#__PURE__*/React.createElement("div", {
      key: o.p,
      id: 'f_' + o.p,
      style: css('display:' + (mob ? 'flex' : 'grid') + ';' + (mob ? 'flex-direction:column;gap:8px;' : 'grid-template-columns:minmax(150px,38%) 1fr;gap:18px;') + 'align-items:start;padding:13px 0;border-bottom:1px solid #f4f4f2;animation:fadein 0.18s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;font-weight:600;color:#2c3442;line-height:1.5;' + (mob ? '' : 'padding-top:7px;'))
    }, /*#__PURE__*/React.createElement("span", {
      style: css('color:#b0b5c2;font-weight:700;margin-right:6px;')
    }, o.r, "."), o.label, o.req ? /*#__PURE__*/React.createElement("span", {
      style: css('color:' + ORANGE + ';')
    }, " *") : null, o.hint ? /*#__PURE__*/React.createElement("div", {
      style: css('color:' + ORANGE + ';font-style:italic;font-size:11px;font-weight:600;margin-top:3px;')
    }, o.hint) : null), /*#__PURE__*/React.createElement("div", null, control, o.error && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;color:#b91c1c;font-weight:600;margin-top:5px;padding:4px 9px;background:#fef2f2;border-radius:6px;border-left:3px solid #fca5a5;')
    }, o.error)));
  },
  // Item Ya/Tidak (R38 disabilitas a–f, R39 keluhan kesehatan a–r).
  yt(path, label, value) {
    return /*#__PURE__*/React.createElement("div", {
      key: path,
      style: css('display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;border-bottom:1px solid #f3f3f1;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px;color:#3d4152;flex:1;')
    }, label), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:6px;flex:none;')
    }, ['1. Ya', '2. Tidak'].map(opt => {
      const on = value === opt;
      const ya = /Ya/.test(opt);
      return /*#__PURE__*/React.createElement("button", {
        key: opt,
        onClick: () => this.setForm(path, opt),
        style: css('padding:4px 13px;border-radius:7px;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid ' + (on ? ya ? '#f0b4b4' : '#bfcef8' : '#e0e0de') + ';background:' + (on ? ya ? '#fdecec' : '#eef2fc' : '#fff') + ';color:' + (on ? ya ? '#b91c1c' : '#1e50d0' : '#9ba2b6') + ';transition:background 0.13s,border-color 0.13s,color 0.13s;')
      }, ya ? 'Ya' : 'Tidak');
    })));
  },
  renderForm(V) {
    const k = V.form,
      val = V.validasi;
    const mob = this.state.isMobile;
    const ab = k._activeBlok || 'I';
    const prog = this.formProgress(k);
    const gB = {};
    val.galat.forEach(g => {
      gB[g.blok] = (gB[g.blok] || 0) + 1;
    });
    const errMap = {};
    val.galat.forEach(g => {
      if (g.path && !errMap[g.path]) errMap[g.path] = g.label;
    });
    const lab = 'display:block;font-size:12.5px;font-weight:600;color:#3d4152;margin-bottom:6px;';
    const inp = 'width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;';
    const fld = (d, scope) => this.field({
      p: d.p,
      r: d.r,
      label: d.label,
      type: d.type,
      opts: d.opts,
      req: d.req,
      hint: d.hint,
      value: getPath(scope || k, d.p),
      error: errMap[d.p]
    });
    const fields = arr => arr.filter(d => !d.when || d.when(k)).map(d => fld(d));
    const sub = t => /*#__PURE__*/React.createElement("div", {
      style: css('text-align:center;font-size:12.5px;font-weight:800;color:' + ORANGE + ';text-transform:uppercase;letter-spacing:0.05em;margin:6px 0 10px;')
    }, t);
    const pakaiMeteran = /dengan meteran/.test(getPath(k, 'rumah.sumberPenerangan') || '');
    const NB = [['I', 'Keterangan Identitas Keluarga'], ['II', 'Keterangan Perumahan'], ['III', 'Keterangan Kepemilikan Aset'], ['IV', 'Keterangan Anggota Keluarga'], ['V', 'Catatan']];

    // ---- builders per-blok (hanya blok aktif yang dirender) ----
    const blokI = () => {
      const F = [{
        p: 'nama',
        r: '1a',
        label: 'Nama Kepala Keluarga',
        type: 'text',
        req: true
      }, {
        p: 'nik',
        r: '1b',
        label: 'NIK Kepala Keluarga',
        type: 'text',
        req: true,
        hint: '16 digit angka'
      }, {
        p: 'noKK',
        r: '1c',
        label: 'Nomor Kartu Keluarga',
        type: 'text',
        req: true,
        hint: '16 digit angka'
      }, {
        p: 'jumlahAnggotaKK',
        r: '2a',
        label: 'Jumlah anggota keluarga sesuai KK',
        type: 'number'
      }, {
        p: 'desa',
        r: '3d',
        label: 'Desa/Kelurahan',
        type: 'select',
        opts: ['Desa Sambirenteng', 'Desa Penuktukan', 'Desa Tembok'],
        req: true
      }, {
        p: 'dusun',
        r: '3h',
        label: 'Nama SLS (Banjar Dinas / Dusun)',
        type: 'text',
        req: true
      }, {
        p: 'wilayah.namaJalan',
        r: '3j',
        label: 'Tuliskan Nama Jalan',
        type: 'text',
        req: true
      }, {
        p: 'wilayah.nomorRumah',
        r: '3k',
        label: 'Tuliskan Nomor Rumah (isi "-" bila tidak ada)',
        type: 'text'
      }, {
        p: 'wilayah.kodePos',
        r: '3f',
        label: 'Kode Pos',
        type: 'text',
        req: true
      }, {
        p: 'rt',
        r: '3g',
        label: 'RT',
        type: 'text'
      }, {
        p: 'rw',
        r: '3g',
        label: 'RW',
        type: 'text'
      }, {
        p: 'statusKeluarga',
        r: '16',
        label: 'Status Keberadaan Keluarga',
        type: 'radio',
        opts: KODE.statusKeluarga,
        req: true
      }, {
        p: 'alamatSesuaiKK',
        r: '4',
        label: 'Apakah alamat tersebut sesuai dengan alamat pada Kartu Keluarga?',
        type: 'radio',
        opts: KODE.alamatSesuaiKK,
        req: true
      }];
      return /*#__PURE__*/React.createElement("div", {
        style: css('animation:fadein 0.2s ease;')
      }, sub('Identitas Wilayah & Keluarga'), F.map(d => fld(d)), /*#__PURE__*/React.createElement("div", {
        style: css('display:' + (mob ? 'flex' : 'grid') + ';' + (mob ? 'flex-direction:column;gap:8px;' : 'grid-template-columns:minmax(150px,38%) 1fr;gap:18px;') + 'align-items:start;padding:13px 0;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:13px;font-weight:600;color:#2c3442;' + (mob ? '' : 'padding-top:7px;'))
      }, /*#__PURE__*/React.createElement("span", {
        style: css('color:#b0b5c2;font-weight:700;margin-right:6px;')
      }, "3l."), "Geotagging lokasi (Lat / Long / Akurasi)"), /*#__PURE__*/React.createElement("div", {
        style: css('display:grid;grid-template-columns:' + (mob ? '1fr 1fr' : '1fr 1fr 1fr') + ';gap:8px;')
      }, /*#__PURE__*/React.createElement("input", {
        value: getPath(k, 'geotag.lat') || '',
        onChange: e => this.setForm('geotag.lat', e.target.value),
        placeholder: "Latitude",
        style: css(inp)
      }), /*#__PURE__*/React.createElement("input", {
        value: getPath(k, 'geotag.long') || '',
        onChange: e => this.setForm('geotag.long', e.target.value),
        placeholder: "Longitude",
        style: css(inp)
      }), /*#__PURE__*/React.createElement("input", {
        value: getPath(k, 'geotag.akurasi') || '',
        onChange: e => this.setForm('geotag.akurasi', e.target.value),
        placeholder: "Akurasi (m)",
        style: css(inp)
      }))));
    };
    const blokII = () => {
      const meteran = (k.meteran || []).map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        id: 'sec-meteran-' + i,
        style: css('background:' + ORANGE_BG + ';border:1px solid #f3cba8;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:12.5px;font-weight:800;color:' + ORANGE + ';')
      }, "Meteran ke-", i + 1), this.field({
        p: 'meteran.' + i + '.daya',
        r: '18b',
        label: 'Daya yang terpasang di rumah ini',
        type: 'radio',
        opts: KODE.daya,
        req: true,
        value: m.daya
      }), this.field({
        p: 'meteran.' + i + '.jenisId',
        r: '18c',
        label: 'Jenis nomor',
        type: 'select',
        opts: KODE.jenisIdMeteran,
        req: true,
        value: m.jenisId
      }), this.field({
        p: 'meteran.' + i + '.idPelanggan',
        r: '18c',
        label: /No Meteran/.test(m.jenisId || '') ? 'No Meteran (11 digit)' : 'ID Pelanggan PLN (12 digit)',
        type: 'number',
        req: true,
        value: m.idPelanggan
      })));
      const fotoSlot = (slot, label, req) => {
        const ft = getPath(k, 'rumah.foto.' + slot);
        const has = !!(ft && ft.src);
        return /*#__PURE__*/React.createElement("div", {
          key: slot,
          style: css('display:flex;flex-direction:column;gap:7px;')
        }, /*#__PURE__*/React.createElement("span", {
          style: css('font-size:12px;font-weight:600;color:#52576b;')
        }, label, req ? /*#__PURE__*/React.createElement("span", {
          style: css('color:' + ORANGE + ';')
        }, " *") : /*#__PURE__*/React.createElement("span", {
          style: css('color:#9ba2b6;')
        }, " (opsional)")), has ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          style: css('height:140px;border-radius:10px;overflow:hidden;background:#0c1422;')
        }, /*#__PURE__*/React.createElement("img", {
          src: ft.src,
          style: css('width:100%;height:100%;object-fit:cover;display:block;')
        })), /*#__PURE__*/React.createElement("div", {
          style: css('display:flex;justify-content:space-between;align-items:center;margin-top:6px;')
        }, /*#__PURE__*/React.createElement("span", {
          style: css('font-size:10.5px;font-family:Menlo,monospace;color:' + (ft.uploading ? '#b45309' : ft.driveId ? '#166534' : '#52576b') + ';')
        }, ft.uploading ? '⤓ mengunggah ke Drive…' : ft.driveId ? '✓ tersimpan di Drive' : this.formatBytes(ft.before) + ' → ' + this.formatBytes(ft.after)), /*#__PURE__*/React.createElement("button", {
          onClick: () => this.hapusFoto('rumah.foto.' + slot),
          style: css('font-size:11.5px;color:#dc2626;background:none;border:none;cursor:pointer;font-weight:700;font-family:inherit;padding:0;')
        }, "Hapus"))) : /*#__PURE__*/React.createElement("label", {
          style: css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:140px;border:1.5px dashed #d4d4d0;border-radius:10px;background:repeating-linear-gradient(45deg,#f7f7f5,#f7f7f5 8px,#fafaf9 8px,#fafaf9 16px);cursor:pointer;text-align:center;padding:12px;')
        }, /*#__PURE__*/React.createElement("span", {
          style: css('font-size:13px;font-weight:700;color:#52576b;')
        }, "Unggah Foto"), /*#__PURE__*/React.createElement("span", {
          style: css('font-size:10.5px;color:#9ba2b6;font-family:Menlo,monospace;')
        }, "auto-kompres <200 KB"), /*#__PURE__*/React.createElement("input", {
          type: "file",
          accept: "image/*",
          onChange: e => this.handleFoto('rumah.foto.' + slot, e),
          style: css('display:none;')
        })));
      };
      return /*#__PURE__*/React.createElement("div", {
        style: css('animation:fadein 0.2s ease;')
      }, fields(BLOK2), /*#__PURE__*/React.createElement("div", {
        id: "sec-meteran",
        style: css('background:' + ORANGE_BG + ';border:1px solid #f3cba8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px;margin:14px 0;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:13px;font-weight:800;color:' + ORANGE + ';')
      }, "18a. Roster Meteran Listrik"), /*#__PURE__*/React.createElement("label", {
        style: css('display:flex;align-items:center;gap:8px;font-size:12.5px;color:#3d4152;')
      }, "Jumlah meteran", /*#__PURE__*/React.createElement("input", {
        value: (k.meteran || []).length,
        onChange: e => this.setJumlahMeteran(e.target.value),
        style: css('width:64px;padding:7px 9px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;text-align:center;')
      }))), !pakaiMeteran && /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11.5px;color:#9a4a12;background:#fde9d6;border:1px solid #f3cba8;border-radius:8px;padding:8px 11px;')
      }, "Catatan: sumber penerangan saat ini bukan \"Listrik PLN dengan meteran\", sehingga roster meteran bersifat opsional. Anda tetap dapat mengisinya bila perlu."), (k.meteran || []).length > 0 ? /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-direction:column;gap:12px;')
      }, meteran) : /*#__PURE__*/React.createElement("span", {
        style: css('font-size:12px;color:#9ba2b6;')
      }, "Setel \"Jumlah meteran\" ≥ 1 untuk menambahkan kartu pengisian meteran.")), fields(BLOK2B), /*#__PURE__*/React.createElement("div", {
        style: css('margin-top:8px;')
      }, sub('21. Foto Rumah'), /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11.5px;color:#9ba2b6;text-align:center;margin-bottom:12px;')
      }, "Tampak depan & ruang tamu wajib · dikompres otomatis (≤1024px, <200KB)"), /*#__PURE__*/React.createElement("div", {
        style: css('display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;')
      }, fotoSlot('depan', 'a. Tampak depan (atap & dinding)', true), fotoSlot('ruangTamu', 'b. Ruang tamu (dinding & lantai)', true), fotoSlot('kamarMandi', 'c. Kamar mandi (kloset)', false))));
    };
    const blokIII = () => /*#__PURE__*/React.createElement("div", {
      style: css('animation:fadein 0.2s ease;')
    }, sub('22. Aset Bergerak'), ASET22.map(a => this.field({
      p: 'aset.' + a[0],
      r: '22',
      label: a[1] + ' (' + a[2] + ')',
      type: 'number',
      req: true,
      value: getPath(k, 'aset.' + a[0])
    })), Number(getPath(k, 'aset.sepedaMotor')) > 0 && this.field({
      p: 'aset.nilaiSepedaMotor',
      r: '22g',
      label: 'Total nilai aset sepeda motor',
      type: 'rupiah',
      req: true,
      value: getPath(k, 'aset.nilaiSepedaMotor')
    }), Number(getPath(k, 'aset.mobil')) > 0 && this.field({
      p: 'aset.nilaiMobil',
      r: '22h',
      label: 'Total nilai aset mobil',
      type: 'rupiah',
      req: true,
      value: getPath(k, 'aset.nilaiMobil')
    }), sub('23. Aset Tidak Bergerak'), ASET23.map(a => this.field({
      p: 'aset.' + a[0],
      r: '23',
      label: a[1],
      type: 'number',
      req: true,
      value: getPath(k, 'aset.' + a[0])
    })));
    const blokIV = () => {
      const anggota = (k.anggota || []).map((a, i) => {
        const open = k._openIdx === i;
        const base = 'anggota.' + i + '.';
        const headerRow = /*#__PURE__*/React.createElement("div", {
          style: css('display:flex;align-items:center;justify-content:space-between;gap:10px;')
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => this.toggleOpenAnggota(i),
          style: css('flex:1;text-align:left;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:2px;padding:0;')
        }, /*#__PURE__*/React.createElement("span", {
          style: css('font-size:13.5px;font-weight:800;color:#18191f;')
        }, open ? '▾' : '▸', " ", i + 1, ". ", a.nama || '(anggota baru)'), /*#__PURE__*/React.createElement("span", {
          style: css('font-size:11.5px;color:#9ba2b6;')
        }, a.hubungan || '—', " · ", a.jk || '—')), i > 0 && k.anggota.length > 1 && /*#__PURE__*/React.createElement("button", {
          onClick: () => this.hapusAnggota(i),
          style: css('flex:none;font-size:11.5px;font-weight:700;color:#b91c1c;background:#fef2f2;border:1px solid #f3c9c9;border-radius:7px;padding:5px 10px;cursor:pointer;font-family:inherit;')
        }, "Hapus"));
        if (!open) return /*#__PURE__*/React.createElement("div", {
          key: i,
          id: 'sec-anggota-' + i,
          style: css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;')
        }, headerRow);
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          id: 'sec-anggota-' + i,
          style: css('background:#fff;border:1.5px solid #f3cba8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:6px;')
        }, headerRow, /*#__PURE__*/React.createElement("div", {
          style: css('font-size:11px;color:#9ba2b6;margin-bottom:4px;')
        }, "R24. Nomor Urut Anggota: ", /*#__PURE__*/React.createElement("strong", {
          style: css('color:#52576b;')
        }, a.no || i + 1)), i === 0 && /*#__PURE__*/React.createElement("div", {
          style: css('font-size:11.5px;color:#1e50d0;background:#eef2fc;border:1px solid #c7d7f6;border-radius:8px;padding:8px 12px;margin-bottom:4px;')
        }, "ℹ Nama dan NIK disinkronkan otomatis dari Blok I. Edit di Blok I untuk mengubahnya."), ANGGOTA_FIELDS.filter(d => !d.when || d.when(k, a)).map(d => {
          if (d.rp === '_tglLahir') {
            return /*#__PURE__*/React.createElement("div", {
              key: "_tglLahir",
              style: css('display:' + (mob ? 'flex' : 'grid') + ';' + (mob ? 'flex-direction:column;gap:8px;' : 'grid-template-columns:minmax(150px,38%) 1fr;gap:18px;') + 'align-items:start;padding:13px 0;border-bottom:1px solid #f4f4f2;')
            }, /*#__PURE__*/React.createElement("div", {
              style: css('font-size:13px;font-weight:600;color:#2c3442;' + (mob ? '' : 'padding-top:7px;'))
            }, /*#__PURE__*/React.createElement("span", {
              style: css('color:#b0b5c2;font-weight:700;margin-right:6px;')
            }, "30."), "Tanggal Lahir", /*#__PURE__*/React.createElement("span", {
              style: css('color:' + ORANGE + ';')
            }, " *")), /*#__PURE__*/React.createElement("div", {
              style: css('display:grid;grid-template-columns:' + (mob ? '1fr 1fr' : '1fr 1.4fr 1fr 1fr') + ';gap:8px;')
            }, /*#__PURE__*/React.createElement("input", {
              value: a.tglLahir || '',
              onChange: e => this.setForm(base + 'tglLahir', e.target.value.replace(/[^0-9]/g, '')),
              placeholder: "Tgl",
              style: css(inp)
            }), /*#__PURE__*/React.createElement("select", {
              value: a.blnLahir || '',
              onChange: e => this.setForm(base + 'blnLahir', e.target.value),
              style: css(inp + 'cursor:pointer;')
            }, /*#__PURE__*/React.createElement("option", {
              value: ""
            }, "Bulan"), KODE.bulan.map((b, j) => /*#__PURE__*/React.createElement("option", {
              key: j,
              value: b
            }, b))), /*#__PURE__*/React.createElement("input", {
              value: a.thnLahir || '',
              onChange: e => this.setForm(base + 'thnLahir', e.target.value.replace(/[^0-9]/g, '')),
              placeholder: "Thn",
              style: css(inp)
            }), /*#__PURE__*/React.createElement("input", {
              value: a.umur || '',
              onChange: e => this.setForm(base + 'umur', e.target.value.replace(/[^0-9]/g, '')),
              placeholder: "Umur",
              style: css(inp)
            })));
          }
          if (i === 0 && (d.rp === 'nama' || d.rp === 'nik')) {
            const err = errMap[base + d.rp];
            return /*#__PURE__*/React.createElement("div", {
              key: d.rp,
              style: css('display:' + (mob ? 'flex' : 'grid') + ';' + (mob ? 'flex-direction:column;gap:8px;' : 'grid-template-columns:minmax(150px,38%) 1fr;gap:18px;') + 'align-items:start;padding:13px 0;border-bottom:1px solid #f4f4f2;')
            }, /*#__PURE__*/React.createElement("div", {
              style: css('font-size:13px;font-weight:600;color:#2c3442;' + (mob ? '' : 'padding-top:7px;'))
            }, /*#__PURE__*/React.createElement("span", {
              style: css('color:#b0b5c2;font-weight:700;margin-right:6px;')
            }, d.r, "."), d.label, d.req ? /*#__PURE__*/React.createElement("span", {
              style: css('color:' + ORANGE + ';')
            }, " *") : null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
              style: css('display:flex;align-items:center;gap:8px;padding:9px 11px;background:#f7f7f5;border:1.5px solid #e0e0de;border-radius:8px;')
            }, /*#__PURE__*/React.createElement("span", {
              style: css('font-size:13.5px;color:#3d4152;flex:1;')
            }, a[d.rp] || '—'), /*#__PURE__*/React.createElement("span", {
              style: css('font-size:10.5px;color:#9ba2b6;white-space:nowrap;')
            }, "🔒 Blok I")), err && /*#__PURE__*/React.createElement("div", {
              style: css('font-size:11.5px;color:#b91c1c;font-weight:600;margin-top:5px;padding:4px 9px;background:#fef2f2;border-radius:6px;border-left:3px solid #fca5a5;')
            }, err)));
          }
          return this.field({
            p: base + d.rp,
            r: d.r,
            label: d.label,
            type: d.type,
            opts: d.opts,
            req: d.req,
            value: a[d.rp],
            error: errMap[base + d.rp]
          });
        }), /*#__PURE__*/React.createElement("div", {
          style: css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;margin-top:6px;')
        }, /*#__PURE__*/React.createElement("div", {
          style: css('font-size:12px;font-weight:800;color:' + ORANGE + ';margin-bottom:6px;')
        }, "38. Disabilitas (jangka waktu lama)"), DISABILITAS_ITEMS.map(it => this.yt(base + 'disabilitas.' + it[0], it[1], getPath(a, 'disabilitas.' + it[0])))), /*#__PURE__*/React.createElement("div", {
          style: css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;')
        }, /*#__PURE__*/React.createElement("div", {
          style: css('font-size:12px;font-weight:800;color:' + ORANGE + ';margin-bottom:6px;')
        }, "39. Keluhan kesehatan kronis/menahun"), KESEHATAN_ITEMS.map(it => this.yt(base + 'kesehatan.' + it[0], it[1], getPath(a, 'kesehatan.' + it[0])))));
      });
      return /*#__PURE__*/React.createElement("div", {
        style: css('animation:fadein 0.2s ease;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:12.5px;color:#9ba2b6;')
      }, (k.anggota || []).length, " anggota"), /*#__PURE__*/React.createElement("button", {
        onClick: () => this.tambahAnggota(),
        style: css('font-size:12.5px;font-weight:700;color:#fff;background:' + ORANGE + ';border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-family:inherit;')
      }, "+ Tambah Anggota")), /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-direction:column;gap:10px;')
      }, anggota));
    };
    const blokV = () => /*#__PURE__*/React.createElement("div", {
      style: css('animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("textarea", {
      value: k.catatan || '',
      onChange: e => this.setForm('catatan', e.target.value),
      placeholder: "Catatan pencacah (opsional)…",
      style: css('width:100%;padding:10px 12px;border:1.5px solid #e0e0de;border-radius:9px;font-size:13.5px;color:#18191f;background:#fff;height:80px;resize:vertical;line-height:1.6;font-family:inherit;')
    }), /*#__PURE__*/React.createElement("div", {
      style: css('margin-top:16px;padding-top:14px;border-top:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:800;color:#52576b;margin-bottom:10px;')
    }, "Penetapan Desa (internal — bukan bagian kuesioner)"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;align-items:start;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:10px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:12px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css(V.formDesilStyle)
    }, V.formDesilLabel), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px;color:#9ba2b6;font-style:italic;')
    }, V.formDesilHint)), /*#__PURE__*/React.createElement("label", {
      style: css('display:flex;align-items:center;gap:9px;font-size:13px;color:#3d4152;cursor:pointer;')
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!k.desilManual,
      onChange: e => this.setForm('desilManual', e.target.checked),
      style: css('width:15px;height:15px;accent-color:' + ORANGE + ';cursor:pointer;')
    }), "Override desil manual"), k.desilManual && /*#__PURE__*/React.createElement("select", {
      value: k.desil,
      onChange: e => this.setForm('desil', e.target.value),
      style: css('width:160px;' + inp + 'cursor:pointer;')
    }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => /*#__PURE__*/React.createElement("option", {
      key: d,
      value: String(d)
    }, "Desil ", d)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Status Penerima Bansos"), /*#__PURE__*/React.createElement("select", {
      value: k.bansos || 'Tidak Ada',
      onChange: e => this.setForm('bansos', e.target.value),
      style: css(inp + 'cursor:pointer;')
    }, /*#__PURE__*/React.createElement("option", null, "Tidak Ada"), /*#__PURE__*/React.createElement("option", null, "PKH"), /*#__PURE__*/React.createElement("option", null, "BPNT"), /*#__PURE__*/React.createElement("option", null, "PKH + BPNT"))))));
    const content = ab === 'I' ? blokI() : ab === 'II' ? blokII() : ab === 'III' ? blokIII() : ab === 'IV' ? blokIV() : blokV();
    const activeTitle = (NB.find(x => x[0] === ab) || ['', ''])[1];
    const abIdx = NB.findIndex(x => x[0] === ab);

    // ---- Sidebar ----
    const dot = n => n > 0 ? /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#fef2f2;color:#b91c1c;font-size:10.5px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fbc5c5;')
    }, n) : /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;width:8px;height:8px;border-radius:50%;background:#cbe8cf;')
    });
    const navItem = (romawi, label) => {
      const on = ab === romawi;
      return /*#__PURE__*/React.createElement("button", {
        key: romawi,
        onClick: () => this.goBlok(romawi),
        style: css('width:100%;text-align:left;display:flex;align-items:center;gap:9px;padding:10px 12px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:12.5px;line-height:1.35;font-weight:' + (on ? '700' : '500') + ';color:' + (on ? '#fff' : '#3d4152') + ';background:' + (on ? ORANGE : 'transparent') + ';transition:background 0.15s,color 0.15s;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('flex:1;')
      }, romawi, ". ", label), on ? null : dot(gB[romawi] || 0));
    };
    const meteranNav = (k.meteran || []).map((m, i) => /*#__PURE__*/React.createElement("button", {
      key: 'm' + i,
      onClick: () => this.goBlok('II', null, 'meteran.' + i + '.daya'),
      style: css('width:100%;text-align:left;padding:5px 12px 5px 28px;border:none;background:none;cursor:pointer;font-family:inherit;font-size:11.5px;color:#6b7280;')
    }, "↳ Meteran ke-", i + 1));
    const anggotaNav = (k.anggota || []).map((a, i) => /*#__PURE__*/React.createElement("button", {
      key: 'a' + i,
      onClick: () => this.goBlok('IV', i, 'anggota.' + i + '.nama'),
      style: css('width:100%;text-align:left;padding:5px 12px 5px 28px;border:none;background:none;cursor:pointer;font-family:inherit;font-size:11.5px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
    }, "↳ ", i + 1, ". ", a.nama || '(anggota baru)'));
    const sidebar = /*#__PURE__*/React.createElement("aside", {
      style: css('flex:none;width:248px;align-self:flex-start;position:sticky;top:78px;background:#fff;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);padding:14px;display:flex;flex-direction:column;gap:6px;max-height:calc(100vh - 96px);overflow-y:auto;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('padding:4px 4px 12px;border-bottom:1px solid #f0f0ee;margin-bottom:6px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Progres Pengisian"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px;font-weight:800;color:' + ORANGE + ';')
    }, prog.pct, "%")), /*#__PURE__*/React.createElement("div", {
      style: css('height:8px;border-radius:6px;background:#f0f0ee;overflow:hidden;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('height:100%;width:' + prog.pct + '%;background:' + ORANGE + ';border-radius:6px;transition:width 0.3s ease;')
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#9ba2b6;margin-top:5px;')
    }, prog.filled, " / ", prog.total, " field wajib terisi"), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.toggleRingkasan(true),
      style: css('margin-top:10px;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px;border-radius:9px;border:1.5px solid ' + (val.galat.length ? '#fbc5c5' : '#bbf7d0') + ';background:' + (val.galat.length ? '#fef2f2' : '#f0fdf4') + ';color:' + (val.galat.length ? '#b91c1c' : '#166534') + ';font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:background 0.2s,border-color 0.2s,color 0.2s;')
    }, "Ringkasan ", val.galat.length > 0 ? /*#__PURE__*/React.createElement("span", {
      style: css('background:#b91c1c;color:#fff;border-radius:9px;padding:0 7px;font-size:11px;')
    }, val.galat.length) : '✓')), navItem('I', 'Keterangan Identitas Keluarga'), navItem('II', 'Keterangan Perumahan'), ab === 'II' && meteranNav, navItem('III', 'Keterangan Kepemilikan Aset'), navItem('IV', 'Keterangan Anggota Keluarga'), ab === 'IV' && anggotaNav, navItem('V', 'Catatan'));
    const chip = (label, n, color, bg) => /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:90px;display:flex;flex-direction:column;gap:3px;padding:14px;border-radius:12px;background:' + bg + ';border:1px solid ' + color + '33;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:26px;font-weight:800;color:' + color + ';line-height:1;')
    }, n), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px;font-weight:700;color:' + color + ';text-transform:uppercase;letter-spacing:0.04em;')
    }, label));
    const mobileBlokTabs = /*#__PURE__*/React.createElement("div", {
      style: css('overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:2px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:5px;padding-bottom:4px;')
    }, NB.map(([romawi, lbl]) => {
      const on = ab === romawi;
      const errs = gB[romawi] || 0;
      return /*#__PURE__*/React.createElement("button", {
        key: romawi,
        onClick: () => this.goBlok(romawi),
        style: css('flex:none;padding:7px 13px;border:none;border-radius:20px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:' + (on ? '700' : '600') + ';color:' + (on ? '#fff' : '#3d4152') + ';background:' + (on ? ORANGE : '#f0f0ee') + ';white-space:nowrap;display:inline-flex;align-items:center;gap:5px;')
      }, "Blok ", romawi, errs > 0 && !on && /*#__PURE__*/React.createElement("span", {
        style: css('min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#b91c1c;color:#fff;font-size:10px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;')
      }, errs));
    })));
    return /*#__PURE__*/React.createElement("div", {
      style: css('animation:fadein 0.2s ease;display:flex;' + (mob ? 'flex-direction:column;' : 'gap:18px;align-items:flex-start;flex-wrap:wrap;'))
    }, !mob && sidebar, /*#__PURE__*/React.createElement("section", {
      style: css('flex:1;' + (mob ? '' : 'min-width:300px;') + 'display:flex;flex-direction:column;gap:14px;')
    }, mob && mobileBlokTabs, /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:14px;padding:' + (mob ? '14px 14px 8px' : '22px 22px 8px') + ';box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('text-align:center;margin-bottom:16px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:800;color:' + ORANGE + ';text-transform:uppercase;letter-spacing:0.04em;')
    }, activeTitle), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#9ba2b6;margin-top:3px;')
    }, "Blok ", ab)), content), /*#__PURE__*/React.createElement("div", {
      style: css('position:sticky;bottom:0;background:#f5f5f2;padding:12px 0;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid #e8e8e6;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:8px;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => abIdx > 0 && this.goBlok(NB[abIdx - 1][0]),
      disabled: abIdx <= 0,
      style: css('padding:10px 14px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:' + (abIdx <= 0 ? '#c4c8d4' : '#3d4152') + ';border-radius:9px;cursor:' + (abIdx <= 0 ? 'not-allowed' : 'pointer') + ';')
    }, "‹ Blok"), /*#__PURE__*/React.createElement("button", {
      onClick: () => abIdx < NB.length - 1 && this.goBlok(NB[abIdx + 1][0]),
      disabled: abIdx >= NB.length - 1,
      style: css('padding:10px 14px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:' + (abIdx >= NB.length - 1 ? '#c4c8d4' : '#3d4152') + ';border-radius:9px;cursor:' + (abIdx >= NB.length - 1 ? 'not-allowed' : 'pointer') + ';')
    }, "Blok ›")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onBatal,
      style: css('padding:11px 16px;font-family:inherit;font-size:13.5px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:#3d4152;border-radius:9px;cursor:pointer;')
    }, "Batal"), /*#__PURE__*/React.createElement("button", {
      onClick: V.onSimpanDraf,
      style: css('padding:11px 18px;font-family:inherit;font-size:13.5px;font-weight:700;border:1.5px solid #f3cba8;background:' + ORANGE_BG + ';color:' + ORANGE + ';border-radius:9px;cursor:pointer;')
    }, "Simpan Draf"), /*#__PURE__*/React.createElement("button", {
      onClick: V.canFinalize ? V.onFinalisasi : undefined,
      disabled: !V.canFinalize,
      style: css('padding:11px 22px;font-family:inherit;font-size:13.5px;font-weight:700;border:none;border-radius:9px;color:#fff;background:' + (V.canFinalize ? '#16a34a' : '#cbd5e1') + ';cursor:' + (V.canFinalize ? 'pointer' : 'not-allowed') + ';')
    }, "Submit / Finalisasi")))), V.confirmModal && V.confirmModal.type === 'batal' && /*#__PURE__*/React.createElement("div", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('position:fixed;inset:0;z-index:90;background:rgba(15,18,28,0.45);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: css('background:#fff;border-radius:16px;width:100%;max-width:420px;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:800;color:#18191f;')
    }, "Keluar dari Kuesioner?"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#9ba2b6;margin-top:2px;')
    }, "Perubahan yang belum disimpan akan hilang")), /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('width:30px;height:30px;border-radius:8px;border:none;background:#f3f3f2;color:#52576b;font-size:16px;cursor:pointer;')
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:8px;padding:18px 20px;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('text-align:left;padding:12px 16px;border-radius:10px;border:1.5px solid #e0e0de;background:#fff;font-family:inherit;font-size:13.5px;font-weight:600;color:#3d4152;cursor:pointer;')
    }, "Tetap di sini"), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.simpanKeluarga('draft'),
      style: css('text-align:left;padding:12px 16px;border-radius:10px;border:1.5px solid #f3cba8;background:' + ORANGE_BG + ';font-family:inherit;font-size:13.5px;font-weight:700;color:' + ORANGE + ';cursor:pointer;')
    }, "Simpan sebagai Draf & Keluar"), /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onKeluarTanpaSimpan(),
      style: css('text-align:left;padding:12px 16px;border-radius:10px;border:1.5px solid #fca5a5;background:#fef2f2;font-family:inherit;font-size:13.5px;font-weight:700;color:#b91c1c;cursor:pointer;')
    }, "Keluar Tanpa Menyimpan")))), V.confirmModal && V.confirmModal.type !== 'batal' && /*#__PURE__*/React.createElement("div", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('position:fixed;inset:0;z-index:90;background:rgba(15,18,28,0.45);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: css('background:#fff;border-radius:16px;width:100%;max-width:480px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:800;color:#18191f;')
    }, V.confirmModal.type === 'draft' ? 'Konfirmasi Simpan Draf' : 'Konfirmasi Finalisasi'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#9ba2b6;margin-top:2px;')
    }, prog.filled, " dari ", prog.total, " field wajib terisi")), /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('width:30px;height:30px;border-radius:8px;border:none;background:#f3f3f2;color:#52576b;font-size:16px;cursor:pointer;')
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: css('padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;')
    }, chip('Galat', val.galat.length, '#dc2626', '#fef2f2'), chip('Peringatan', val.peringatan.length, '#d97706', '#fffbeb'), chip('Kosong', val.kosong.length, '#6b7280', '#f3f4f6')), V.confirmModal.type === 'draft' && val.galat.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;padding:9px 12px;')
    }, "⚠ Masih ada ", /*#__PURE__*/React.createElement("strong", null, val.galat.length, " galat"), " — data tersimpan sebagai draf dan dapat diperbaiki sebelum finalisasi."), V.confirmModal.type === 'draft' && val.galat.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:700;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:9px;padding:9px 12px;text-align:center;')
    }, "✓ Tidak ada galat — bisa langsung difinalisasi atau simpan dulu sebagai draf."), V.confirmModal.type === 'final' && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:700;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:9px;padding:9px 12px;text-align:center;')
    }, "✓ Tidak ada galat — data siap difinalisasi dan dikunci."), val.galat.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:5px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Daftar Galat"), val.galat.slice(0, 5).map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('font-size:12px;color:#7f1d1d;background:#fef2f2;border:1px solid #fde0e0;border-radius:7px;padding:7px 10px;')
    }, /*#__PURE__*/React.createElement("strong", null, "Blok ", g.blok, "·R", g.rincian), " — ", g.label)), val.galat.length > 5 && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;color:#9ba2b6;text-align:center;')
    }, "…dan ", val.galat.length - 5, " galat lainnya")), val.peringatan.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:5px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Peringatan"), val.peringatan.map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('font-size:12px;color:#78350f;background:#fffbeb;border:1px solid #fde68a;border-radius:7px;padding:7px 10px;')
    }, /*#__PURE__*/React.createElement("strong", null, "Blok ", g.blok, "·R", g.rincian), " — ", g.label)))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onBatalKonfirmasi(),
      style: css('padding:10px 18px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:#3d4152;border-radius:9px;cursor:pointer;')
    }, "Batal"), /*#__PURE__*/React.createElement("button", {
      onClick: () => V.onKonfirmasiOk(),
      style: css('padding:10px 22px;font-family:inherit;font-size:13.5px;font-weight:700;border:none;border-radius:9px;color:#fff;background:' + (V.confirmModal.type === 'draft' ? ORANGE : '#16a34a') + ';cursor:pointer;')
    }, V.confirmModal.type === 'draft' ? 'Simpan Draf' : 'Ya, Finalisasi')))), k._showRingkasan && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.toggleRingkasan(false),
      style: css('position:fixed;inset:0;z-index:80;background:rgba(15,18,28,0.45);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: css('background:#fff;border-radius:16px;width:100%;max-width:520px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:800;color:#18191f;')
    }, "Ringkasan"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#9ba2b6;margin-top:2px;')
    }, prog.filled, " dari ", prog.total, " field wajib terisi")), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.toggleRingkasan(false),
      style: css('width:30px;height:30px;border-radius:8px;border:none;background:#f3f3f2;color:#52576b;font-size:16px;cursor:pointer;')
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: css('padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;')
    }, chip('Galat', val.galat.length, '#dc2626', '#fef2f2'), chip('Peringatan', val.peringatan.length, '#d97706', '#fffbeb'), chip('Kosong', val.kosong.length, '#6b7280', '#f3f4f6')), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:700;padding:9px 12px;border-radius:9px;text-align:center;' + (V.canFinalize ? 'color:#166534;background:#dcfce7;border:1px solid #bbf7d0;' : 'color:#b91c1c;background:#fef2f2;border:1px solid #fca5a5;'))
    }, V.canFinalize ? '✓ Tidak ada galat — siap difinalisasi' : val.galat.length + ' galat harus diperbaiki sebelum finalisasi'), val.galat.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Daftar Galat — klik untuk menuju"), val.galat.map((g, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => this.goIssue(g),
      style: css('text-align:left;font-size:12px;color:#7f1d1d;background:#fef2f2;border:1px solid #fde0e0;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;font-weight:800;color:#b91c1c;')
    }, "Blok ", g.blok, "·R", g.rincian), /*#__PURE__*/React.createElement("span", {
      style: css('flex:1;')
    }, g.label), /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;color:#b91c1c;')
    }, "›")))), val.peringatan.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Peringatan — klik untuk menuju"), val.peringatan.map((g, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => this.goIssue(g),
      style: css('text-align:left;font-size:12px;color:#78350f;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;font-weight:800;color:#d97706;')
    }, "Blok ", g.blok, "·R", g.rincian), /*#__PURE__*/React.createElement("span", {
      style: css('flex:1;')
    }, g.label), /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;color:#d97706;')
    }, "›")))), val.kosong.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')
    }, "Kosong (Opsional) — klik untuk menuju"), val.kosong.map((g, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => this.goIssue(g),
      style: css('text-align:left;font-size:12px;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;font-weight:800;color:#6b7280;')
    }, "Blok ", g.blok, "·R", g.rincian), /*#__PURE__*/React.createElement("span", {
      style: css('flex:1;')
    }, g.label), /*#__PURE__*/React.createElement("span", {
      style: css('flex:none;color:#6b7280;')
    }, "›"))))))));
  },
  renderKuesioner(rw) {
    if (!rw) return null;
    const r = rw.rumah || {},
      ast = rw.aset || {},
      wil = rw.wilayah || {},
      geo = rw.geotag || {};
    const fmt = v => v == null || v === '' ? '—' : String(v);
    const fmtRp = v => v ? 'Rp' + Number(v).toLocaleString('id-ID') : '—';
    const fmtNum = v => v != null && v !== '' ? Number(v).toLocaleString('id-ID') : '—';
    const fmtField = (d, val) => {
      if (d.type === 'rupiah') return fmtRp(val);
      if (d.type === 'number') return fmtNum(val);
      return fmt(val);
    };
    const cell = (l, v, hi) => /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:2px;padding:8px 11px;border-radius:8px;background:' + (hi ? '#fffbf0' : '#fafaf9') + ';' + (hi ? 'border:1px solid #edd7a3;' : ''))
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px;font-weight:600;color:' + (hi ? '#92400e' : '#9ba2b6') + ';')
    }, l), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px;font-weight:600;color:' + (hi ? '#92400e' : '#2c3442') + ';')
    }, v || '—'));
    const grid = items => /*#__PURE__*/React.createElement("div", {
      style: css('display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:5px;')
    }, items.filter(Boolean).map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, cell(it[0], it[1], it[2]))));
    const sec = t => /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;font-weight:800;color:' + ORANGE + ';text-transform:uppercase;letter-spacing:0.06em;margin:14px 0 6px;padding-bottom:5px;border-bottom:1px solid #f0f0ee;')
    }, t);
    const blokI = [['16. Status Keberadaan', fmt(rw.statusKeluarga)], ['1a. Nama KK', fmt(rw.nama)], ['1b. NIK', fmt(rw.nik)], ['1c. No. KK', fmt(rw.noKK)], ['Provinsi', fmt(wil.provinsi)], ['Kabupaten', fmt(wil.kabupaten)], ['Kecamatan', fmt(wil.kecamatan)], ['Desa', fmt(wil.desa)], ['Klasifikasi', fmt(wil.klasifikasi)], ['Kode SLS', fmt(wil.kodeSls)], ['Nama SLS', fmt(wil.namaSls)], ['Kode Pos', fmt(wil.kodePos)], ['3j. Nama Jalan', fmt(wil.namaJalan)], ['Nomor Rumah', fmt(wil.nomorRumah)], ['4. Alamat sesuai KK', fmt(rw.alamatSesuaiKK)], ['3l. Geotagging', geo.lat && geo.long ? geo.lat + ', ' + geo.long : '—']];
    const blokII = BLOK2.filter(d => !d.when || d.when(rw)).map(d => [d.r + '. ' + d.label, fmtField(d, getPath(rw, d.p))]);
    const blokIIB = BLOK2B.map(d => [d.r + '. ' + d.label, fmtField(d, getPath(rw, d.p))]);
    const blokIII = [...ASET22.map(a => ['22. ' + a[1] + ' (' + a[2] + ')', fmtNum(ast[a[0]])]), ...(Number(ast.sepedaMotor) > 0 ? [['22g. Nilai sepeda motor', fmtRp(ast.nilaiSepedaMotor)]] : []), ...(Number(ast.mobil) > 0 ? [['22h. Nilai mobil', fmtRp(ast.nilaiMobil)]] : []), ...ASET23.map(a => ['23. ' + a[1], fmtNum(ast[a[0]])])];
    return /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:14px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);display:flex;flex-direction:column;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:14px;font-weight:700;color:#18191f;letter-spacing:-0.01em;margin-bottom:2px;')
    }, "Data Kuesioner Lengkap"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;color:#9ba2b6;margin-bottom:4px;')
    }, "kondisi data saat ini"), sec('Blok I — Identitas Keluarga'), grid(blokI), sec('Blok II — Perumahan'), grid(blokII), (rw.meteran || []).map((m, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;font-weight:700;color:#52576b;margin:8px 0 4px;')
    }, "↳ Meteran ke-", i + 1), grid([['18b. Daya Terpasang', fmt(m.daya)], [m.jenisId || 'ID Pelanggan', fmt(m.idPelanggan)]]))), grid(blokIIB), sec('Blok III — Kepemilikan Aset'), grid(blokIII), sec('Blok IV — Anggota Keluarga'), (rw.anggota || []).map((a, i) => {
      const tglLahir = [a.tglLahir, a.blnLahir, a.thnLahir].filter(Boolean).join(' ') + (a.umur ? ' (' + a.umur + ' thn)' : '');
      const af = ANGGOTA_FIELDS.filter(d => d.rp !== '_tglLahir' && (!d.when || d.when(rw, a))).map(d => [d.r + '. ' + d.label, fmtField(d, a[d.rp])]);
      const disAda = DISABILITAS_ITEMS.filter(it => /^1\. Ya/.test(a.disabilitas && a.disabilitas[it[0]] || ''));
      const kesAda = KESEHATAN_ITEMS.filter(it => /^1\. Ya/.test(a.kesehatan && a.kesehatan[it[0]] || ''));
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:13px;margin-top:8px;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:13px;font-weight:700;color:#18191f;margin-bottom:8px;')
      }, i + 1, ". ", a.nama || '—', " ", /*#__PURE__*/React.createElement("span", {
        style: css('font-size:11.5px;font-weight:500;color:#9ba2b6;')
      }, "· ", a.hubungan || '—', " · ", a.jk || '—')), grid([[' 30. Tanggal Lahir', tglLahir || '—'], ...af]), (disAda.length > 0 || kesAda.length > 0) && /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;')
      }, disAda.map(it => /*#__PURE__*/React.createElement("span", {
        key: it[0],
        style: css('font-size:11px;padding:2px 8px;border-radius:6px;font-weight:700;color:#b91c1c;background:#fef2f2;border:1px solid #f3c9c9;')
      }, "⚠ ", it[1])), kesAda.map(it => /*#__PURE__*/React.createElement("span", {
        key: it[0],
        style: css('font-size:11px;padding:2px 8px;border-radius:6px;font-weight:700;color:#92400e;background:#fffbeb;border:1px solid #fde68a;')
      }, it[1]))));
    }), sec('Blok V — Catatan'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;color:#3d4152;padding:10px 12px;background:#fafaf9;border-radius:8px;line-height:1.6;')
    }, rw.catatan || /*#__PURE__*/React.createElement("span", {
      style: css('color:#9ba2b6;font-style:italic;')
    }, "Tidak ada catatan")));
  },
  render() {
    if (!this.state.auth) {
      return this.renderLogin();
    }
    const V = this.renderVals();
    const card = 'background:#fff; border-radius:14px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);';
    const th = 'text-align:left; padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em;';
    const lab = 'display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:6px;';
    const inp = 'width:100%;padding:10px 12px;border:1.5px solid #e0e0de;border-radius:9px;font-family:inherit;font-size:14px;color:#18191f;background:#fafaf9;';
    const inpSel = inp + 'cursor:pointer;';
    const Stat = ({
      title,
      color,
      val,
      sub
    }) => /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px; font-weight:600; color:#9ba2b6;')
    }, title), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:30px; font-weight:800; color:' + color + '; letter-spacing:-0.03em; margin:5px 0 3px;')
    }, val), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px; color:#9ba2b6;')
    }, sub));
    return /*#__PURE__*/React.createElement("div", {
      style: css("min-height:100vh; display:flex; flex-direction:column; background:#f5f5f2; font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:#18191f;")
    }, /*#__PURE__*/React.createElement("header", {
      style: css('position:sticky; top:0; z-index:30; background:#fff; border-bottom:1px solid #e8e8e6; height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 ' + (V.isMobile ? '12px' : '20px') + '; gap:14px; overflow:hidden;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:11px; flex:none; min-width:0;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:34px; height:34px; border-radius:9px; background:#1e50d0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; letter-spacing:-0.03em; flex:none;')
    }, "DT"), !V.isMobile && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px; font-weight:800; color:#18191f; letter-spacing:-0.02em; line-height:1.2;')
    }, "DTSEN Desa"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; font-weight:500; line-height:1.2;')
    }, V.namaDesa)), V.isMobile && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:14px; font-weight:800; color:#18191f; white-space:nowrap;')
    }, "DTSEN Desa")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:' + (V.isMobile ? '8px' : '10px') + '; flex:none;')
    }, !V.isMobile && /*#__PURE__*/React.createElement("span", {
      title: V.serverMode ? 'Tersambung ke Google Sheets' : 'Data tersimpan di perangkat ini',
      style: css('font-size:11px; font-weight:700; padding:5px 10px; border-radius:20px; white-space:nowrap; border:1px solid ' + (V.serverMode ? '#bbf7d0' : '#e0e0de') + '; color:' + (V.serverMode ? '#166534' : '#6b7280') + '; background:' + (V.serverMode ? '#f0fdf4' : '#f6f6f5') + ';')
    }, V.serverMode ? '● Sheets' : '○ Lokal'), !V.canCrud && !V.isMobile && /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#52576b; background:#f0f0ef; border:1px solid #e0e0de; padding:5px 10px; border-radius:20px; white-space:nowrap;')
    }, "Hanya-Lihat"), V.canCrud && !V.isMobile && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.confirm('Pulihkan data contoh? Semua perubahan tersimpan akan dihapus.')) this.resetStore();
      },
      title: "Pulihkan data contoh dan hapus data tersimpan",
      style: css('font-size:12px; font-weight:600; color:#52576b; background:#f3f3f2; border:1px solid #e8e8e6; padding:5px 11px; border-radius:7px; cursor:pointer; white-space:nowrap;')
    }, "Reset data"), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:8px; ' + (V.isMobile ? '' : 'padding-left:10px; border-left:1px solid #e8e8e6;'))
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:32px; height:32px; border-radius:50%; background:#eef2fc; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#1e50d0; flex:none;'),
      title: V.namaOperator
    }, V.opInitials), !V.isMobile && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; line-height:1.25;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px; font-weight:700; color:#18191f; white-space:nowrap;')
    }, V.namaOperator), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px; color:#9ba2b6; white-space:nowrap;')
    }, V.roleLabel, V.wilayahLabel ? ' · ' + V.wilayahLabel : ''))), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.logout(),
      title: "Keluar",
      style: css('font-size:12px; font-weight:600; color:#b91c1c; background:#fff; border:1px solid #f0c9c9; padding:6px ' + (V.isMobile ? '10px' : '11px') + '; border-radius:7px; cursor:pointer; white-space:nowrap;')
    }, "Keluar"))), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1; display:flex; overflow:' + (V.isMobile ? 'visible' : 'hidden') + ';')
    }, !V.isForm && !V.isMobile && /*#__PURE__*/React.createElement("aside", {
      style: css('width:220px; flex:none; position:sticky; top:58px; align-self:flex-start; max-height:calc(100vh - 58px); overflow-y:auto; background:#fff; border-right:1px solid #e8e8e6; padding:14px 12px; display:flex; flex-direction:column; gap:6px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('padding:4px 4px 14px; border-bottom:1px solid #f0f0ee; margin-bottom:4px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:14px; font-weight:800; color:#18191f;')
    }, "DTSEN Desa"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; margin-top:2px;')
    }, V.namaDesa)), V.navItems.map((item, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: item.onClick,
      style: css(item.style)
    }, /*#__PURE__*/React.createElement("span", null, item.label), item.badge > 0 && /*#__PURE__*/React.createElement("span", {
      style: css('background:#dc2626;color:#fff;border-radius:8px;padding:1px 7px;font-size:10px;font-weight:800;min-width:18px;text-align:center;')
    }, item.badge)))), /*#__PURE__*/React.createElement("main", {
      style: css('flex:1; min-width:0; padding:' + (V.isMobile ? '12px' : '24px 20px') + '; max-width:1200px; margin:0 auto; overflow-x:hidden;' + (V.isMobile && !V.isForm ? ' padding-bottom:70px;' : ''))
    }, V.isDashboard && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:20px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px;')
    }, /*#__PURE__*/React.createElement(Stat, {
      title: "Total KK",
      color: "#18191f",
      val: V.statTotal,
      sub: "keluarga terdata"
    }), /*#__PURE__*/React.createElement(Stat, {
      title: "Prioritas Bansos",
      color: "#c2410c",
      val: V.statPrioritas,
      sub: "desil 1–4"
    }), /*#__PURE__*/React.createElement(Stat, {
      title: "Penerima Bansos",
      color: "#166534",
      val: V.statBansos,
      sub: "PKH / BPNT aktif"
    }), /*#__PURE__*/React.createElement(Stat, {
      title: "Perubahan Desil",
      color: "#b45309",
      val: V.statPerubahan,
      sub: "update terbaru"
    }), /*#__PURE__*/React.createElement(Stat, {
      title: "Sanggahan Aktif",
      color: "#d97706",
      val: V.statSanggahan,
      sub: "menunggu proses"
    })), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; align-items:start;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:14px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')
    }, "Distribusi Desil"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#9ba2b6;')
    }, "keluarga per desil")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:flex-end; gap:6px; height:168px;')
    }, V.desilBars.map((bar, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; justify-content:flex-end; height:100%;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11.5px; font-weight:700; color:#18191f;')
    }, bar.count), /*#__PURE__*/React.createElement("div", {
      style: css(bar.barStyle)
    }), /*#__PURE__*/React.createElement("span", {
      style: css(bar.numStyle)
    }, bar.desil)))), /*#__PURE__*/React.createElement("div", {
      style: css('margin-top:14px; padding-top:12px; border-top:1px solid #f0f0ee; font-size:11px; color:#9ba2b6; display:flex; align-items:center; gap:7px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('width:10px;height:10px;border-radius:3px;background:#d8522a;display:inline-block;flex:none;')
    }), "Desil 1–4 = prioritas penerima bantuan sosial")), /*#__PURE__*/React.createElement("div", {
      style: css(card + ' display:flex; flex-direction:column; gap:10px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:14px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')
    }, "Perubahan Desil Terbaru"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#9ba2b6;')
    }, "dampak kelayakan bansos")), V.perubahanList.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css(p.rowStyle)
    }, /*#__PURE__*/React.createElement("div", {
      style: css(p.iconStyle)
    }, p.icon), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; justify-content:space-between; gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; font-weight:700; color:#18191f; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;')
    }, p.nama), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px; font-weight:700; color:#18191f; white-space:nowrap; flex:none;')
    }, p.desilText)), /*#__PURE__*/React.createElement("span", {
      style: css(p.dampakStyle)
    }, p.dampak)))), V.tidakAdaPerubahan && /*#__PURE__*/React.createElement("div", {
      style: css('padding:20px; text-align:center; color:#9ba2b6; font-size:13px;')
    }, "Belum ada perubahan desil dari update terbaru.")))), V.isDaftar && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:14px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-wrap:wrap; gap:9px; align-items:center;')
    }, /*#__PURE__*/React.createElement("input", {
      value: V.search,
      onChange: V.onSearch,
      placeholder: "Cari NIK, Nama, atau No. KK…",
      style: css('flex:1; min-width:220px; padding:10px 14px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13.5px; background:#fafaf9; color:#18191f;')
    }), /*#__PURE__*/React.createElement("select", {
      value: V.filterDesa,
      "data-filter": "filterDesa",
      onChange: V.onFilter,
      style: css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')
    }, V.desaOptions.map((opt, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label))), /*#__PURE__*/React.createElement("select", {
      value: V.filterRt,
      "data-filter": "filterRt",
      onChange: V.onFilter,
      style: css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')
    }, V.rtOptions.map((opt, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label))), /*#__PURE__*/React.createElement("select", {
      value: V.filterDesil,
      "data-filter": "filterDesil",
      onChange: V.onFilter,
      style: css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')
    }, V.desilFilterOpts.map((opt, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label))), /*#__PURE__*/React.createElement("select", {
      value: V.filterBansos,
      "data-filter": "filterBansos",
      onChange: V.onFilter,
      style: css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')
    }, V.bansosFilterOpts.map((opt, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label))), V.canCrud && /*#__PURE__*/React.createElement("button", {
      onClick: V.onTambah,
      style: css('display:inline-flex; align-items:center; gap:6px; padding:10px 16px; font-family:inherit; font-size:13.5px; font-weight:700; background:#1e50d0; color:#fff; border:none; border-radius:9px; cursor:pointer; white-space:nowrap;')
    }, "+ Tambah Data")), (() => {
      const Th = ({
        col,
        label,
        right
      }) => {
        const sorted = V.sortBy === col;
        const asc = V.sortDir === 'asc';
        const base = th + (right ? 'text-align:right;' : '') + 'cursor:pointer;user-select:none;';
        return /*#__PURE__*/React.createElement("th", {
          onClick: () => V.onSort(col),
          style: css(base)
        }, label, " ", /*#__PURE__*/React.createElement("span", {
          style: css('color:' + (sorted ? '#1e50d0' : '#c4c8d4') + ';')
        }, sorted ? asc ? '↑' : '↓' : '↕'));
      };
      return /*#__PURE__*/React.createElement("div", {
        style: css('background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); overflow-x:auto;')
      }, /*#__PURE__*/React.createElement("table", {
        style: css('width:100%; border-collapse:collapse; min-width:500px;')
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
        style: css('background:#fafaf9; border-bottom:1px solid #eeeeed;')
      }, /*#__PURE__*/React.createElement(Th, {
        col: "nama",
        label: "Kepala Keluarga"
      }), /*#__PURE__*/React.createElement(Th, {
        col: "dusun",
        label: "Banjar"
      }), /*#__PURE__*/React.createElement(Th, {
        col: "desil",
        label: "Desil"
      }), /*#__PURE__*/React.createElement(Th, {
        col: "bansos",
        label: "Bansos"
      }), /*#__PURE__*/React.createElement("th", {
        style: css('padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em; text-align:center;')
      }, "Snp"), /*#__PURE__*/React.createElement("th", {
        style: css('padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em;')
      }))), /*#__PURE__*/React.createElement("tbody", null, V.wargaTampil.map((w, i) => /*#__PURE__*/React.createElement("tr", {
        key: w.id,
        style: css('border-top:1px solid #f0f0ee;transition:background 0.12s;'),
        onMouseEnter: w.onHover,
        onMouseLeave: w.onLeave
      }, /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('display:flex; align-items:center; gap:7px;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:13.5px; font-weight:700; color:#18191f;')
      }, w.nama), /*#__PURE__*/React.createElement("span", {
        style: css(w.statusBadgeStyle)
      }, w.statusLabel)), /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11px; color:#9ba2b6; margin-top:2px; font-variant-numeric:tabular-nums;')
      }, w.nik, /*#__PURE__*/React.createElement("span", {
        style: css('margin-left:8px;color:#9ba2b6;')
      }, "· ", w.snapCount, " snp"))), /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:13px; font-weight:600; color:#3d4152;')
      }, w.dusun.replace('Banjar Dinas ', ''))), /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css(w.desilBadgeStyle)
      }, w.desilLabel)), /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css(w.bansosBadgeStyle)
      }, w.bansos)), /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle; text-align:center;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:22px;padding:0 7px;border-radius:20px;font-size:11.5px;font-weight:700;background:#eef2fc;color:#1e50d0;')
      }, w.snapCount)), /*#__PURE__*/React.createElement("td", {
        style: css('padding:12px 16px; vertical-align:middle; text-align:right;')
      }, /*#__PURE__*/React.createElement("button", {
        onClick: w.onLihat,
        title: "Lihat Detail & Riwayat",
        style: css('padding:6px 13px;border:1.5px solid #e0e0de;background:#fff;color:#3d4152;border-radius:8px;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit;white-space:nowrap;')
      }, "Lihat →")))))), V.kosong && /*#__PURE__*/React.createElement("div", {
        style: css('padding:40px; text-align:center; color:#9ba2b6; font-size:13.5px;')
      }, "Tidak ada rumah tangga yang cocok."));
    })(), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6;')
    }, V.jumlahTampil, " rumah tangga · Hal. ", V.currentPage, " dari ", V.jumlahHalaman), V.jumlahHalaman > 1 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:4px;align-items:center;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onPrevPage,
      disabled: V.currentPage <= 1,
      style: css('padding:6px 11px;font-family:inherit;font-size:12.5px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:' + (V.currentPage <= 1 ? '#c4c8d4' : '#3d4152') + ';border-radius:7px;cursor:' + (V.currentPage <= 1 ? 'not-allowed' : 'pointer') + ';')
    }, "‹"), Array.from({
      length: V.jumlahHalaman
    }, (_, i) => i + 1).map(p => /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => V.onGoPage(p),
      style: css('padding:6px 10px;font-family:inherit;font-size:12.5px;font-weight:' + (p === V.currentPage ? '700' : '500') + ';border:1.5px solid ' + (p === V.currentPage ? '#1e50d0' : '#e0e0de') + ';background:' + (p === V.currentPage ? '#1e50d0' : '#fff') + ';color:' + (p === V.currentPage ? '#fff' : '#3d4152') + ';border-radius:7px;cursor:pointer;min-width:32px;')
    }, p)), /*#__PURE__*/React.createElement("button", {
      onClick: V.onNextPage,
      disabled: V.currentPage >= V.jumlahHalaman,
      style: css('padding:6px 11px;font-family:inherit;font-size:12.5px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:' + (V.currentPage >= V.jumlahHalaman ? '#c4c8d4' : '#3d4152') + ';border-radius:7px;cursor:' + (V.currentPage >= V.jumlahHalaman ? 'not-allowed' : 'pointer') + ';')
    }, "›")))), V.isForm && V.form && this.renderForm(V), V.isRiwayat && V.riwayatWarga && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:14px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:8px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onKembali,
      style: css('display:inline-flex; align-items:center; gap:5px; padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')
    }, "‹ Daftar"), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;')
    }), V.canCrud && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: V.riwayatWarga.onEdit,
      style: css('display:inline-flex;align-items:center;gap:5px; padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #c7d7f6; background:#eef2fc; color:#1e50d0; border-radius:8px; cursor:pointer;')
    }, "✏ Edit"), /*#__PURE__*/React.createElement("button", {
      onClick: V.riwayatWarga.onHapus,
      style: css('display:inline-flex;align-items:center;gap:5px; padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #fca5a5; background:#fef2f2; color:#b91c1c; border-radius:8px; cursor:pointer;')
    }, "✕ Hapus"))), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:18px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:19px; font-weight:800; color:#18191f; letter-spacing:-0.02em;')
    }, V.riwayatWarga.nama), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-wrap:wrap; gap:10px; margin-top:5px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6; font-variant-numeric:tabular-nums;')
    }, V.riwayatWarga.nik), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6; font-variant-numeric:tabular-nums;')
    }, V.riwayatWarga.noKK), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6;')
    }, V.riwayatWarga.rtRw))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:9px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css(V.riwayatWarga.desilStyle)
    }, V.riwayatWarga.desilLabel), /*#__PURE__*/React.createElement("span", {
      style: css(V.riwayatWarga.bansosStyle)
    }, V.riwayatWarga.bansos))), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; align-items:start;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; margin-bottom:4px; letter-spacing:-0.01em;')
    }, "Linimasa Snapshot"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; margin-bottom:12px;')
    }, "satu per hari · klik untuk detail"), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:3px;')
    }, V.snapshotList.map((s, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: s.onClick,
      style: css(s.rowStyle)
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; justify-content:space-between; gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; font-weight:700; color:#18191f;')
    }, s.tanggalStr), /*#__PURE__*/React.createElement("span", {
      style: css(s.desilStyle)
    }, s.desilLabel)), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#9ba2b6;')
    }, s.operator), /*#__PURE__*/React.createElement("span", {
      style: css(s.metaStyle)
    }, s.metaStr))))), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:16px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; justify-content:space-between; align-items:center; gap:10px; padding-bottom:14px; border-bottom:1px solid #f0f0ee;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')
    }, V.selectedSnap.tanggalStr), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px; color:#9ba2b6; margin-top:2px;')
    }, V.selectedSnap.operator)), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:5px 12px; border-radius:16px; white-space:nowrap;')
    }, V.selectedSnap.jumlahPerubahan)), V.selectedSnap.adaPerubahan && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em;')
    }, "Field yang berubah"), V.selectedSnap.diffList.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('padding:11px 13px; background:#fffbf0; border:1px solid #edd7a3; border-radius:10px; display:flex; flex-direction:column; gap:5px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.04em;')
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:9px; font-size:13px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('color:#dc2626; text-decoration:line-through; font-weight:500;')
    }, d.dari), /*#__PURE__*/React.createElement("span", {
      style: css('color:#9ba2b6; font-weight:700;')
    }, "→"), /*#__PURE__*/React.createElement("span", {
      style: css('color:#16a34a; font-weight:700;')
    }, d.ke))))), V.selectedSnap.snapAwal && !V.selectedSnap.adaPerubahan && /*#__PURE__*/React.createElement("div", {
      style: css('padding:12px 14px; background:#f7f7f5; border-radius:10px; font-size:12.5px; color:#52576b; line-height:1.5;')
    }, "Snapshot awal — belum ada pembanding sebelumnya."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:9px;')
    }, "Data Lengkap Snapshot"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#f0f0ee; border-radius:10px; overflow:hidden;')
    }, V.selectedSnap.dataRows.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css(r.cellStyle)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#9ba2b6; font-weight:600;')
    }, r.label), /*#__PURE__*/React.createElement("span", {
      style: css(r.valueStyle)
    }, r.value))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:9px;')
    }, "Foto Rumah"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(3,1fr); gap:10px;')
    }, V.selectedSnap.snapFoto.map((f, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('display:flex; flex-direction:column; gap:5px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#52576b; font-weight:600;')
    }, f.label), f.hasFoto && /*#__PURE__*/React.createElement("div", {
      style: css('height:110px; border-radius:9px; overflow:hidden; background:#0c1422;')
    }, /*#__PURE__*/React.createElement("img", {
      src: f.src,
      style: css('width:100%;height:100%;object-fit:cover;display:block;')
    })), f.kosong && /*#__PURE__*/React.createElement("div", {
      style: css('height:110px; border-radius:9px; background:repeating-linear-gradient(45deg,#f5f5f3,#f5f5f3 8px,#fafaf9 8px,#fafaf9 16px); display:flex; align-items:center; justify-content:center; font-size:10.5px; color:#9ba2b6; font-family:Menlo,monospace;')
    }, "belum ada foto"))))), /*#__PURE__*/React.createElement("div", {
      style: css('border-top:1px solid #f0f0ee; padding-top:16px; display:flex; flex-direction:column; gap:12px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; font-weight:700; color:#18191f;')
    }, "Sanggahan Snapshot Ini"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11.5px; color:#9ba2b6; margin-left:8px;')
    }, V.selectedSnap.jumlahSanggahan)), V.canCrud && V.canAjukanSanggahan && /*#__PURE__*/React.createElement("button", {
      onClick: V.onBukaFormSanggahan,
      style: css('padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:700; border:1.5px solid #1e50d0; background:#eef2fc; color:#1e50d0; border-radius:8px; cursor:pointer; white-space:nowrap;')
    }, "+ Ajukan Sanggahan")), V.sanggahanForSnap.map((sg, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css(sg.snapCardStyle)
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:2px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; font-weight:700; color:#18191f;')
    }, sg.pengaju), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11.5px; color:#52576b;')
    }, sg.hubungan, " · ", sg.tanggalPengajuanStr)), /*#__PURE__*/React.createElement("span", {
      style: css(sg.statusStyle)
    }, sg.status)), /*#__PURE__*/React.createElement("p", {
      style: css('font-size:13px; color:#3d4152; line-height:1.6; margin:8px 0 0;')
    }, sg.alasan))), V.showSanggahanForm && /*#__PURE__*/React.createElement("div", {
      style: css('background:#f7f7f5; border:1.5px solid #e0e0de; border-radius:12px; padding:18px; display:flex; flex-direction:column; gap:12px; animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f;')
    }, "Formulir Sanggahan"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')
    }, "Nama Pengaju"), /*#__PURE__*/React.createElement("input", {
      "data-sgfield": "pengaju",
      value: V.sanggahanForm.pengaju,
      onChange: V.onSanggahanChange,
      style: css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;')
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')
    }, "NIK Pengaju"), /*#__PURE__*/React.createElement("input", {
      "data-sgfield": "nik",
      value: V.sanggahanForm.nik,
      onChange: V.onSanggahanChange,
      style: css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;')
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')
    }, "Hubungan dengan KK"), /*#__PURE__*/React.createElement("select", {
      "data-sgfield": "hubungan",
      value: V.sanggahanForm.hubungan,
      onChange: V.onSanggahanChange,
      style: css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;cursor:pointer;')
    }, /*#__PURE__*/React.createElement("option", null, "Warga Bersangkutan"), /*#__PURE__*/React.createElement("option", null, "Keluarga"), /*#__PURE__*/React.createElement("option", null, "RT/RW"), /*#__PURE__*/React.createElement("option", null, "Kepala Desa"), /*#__PURE__*/React.createElement("option", null, "Pendamping")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')
    }, "Alasan Sanggahan"), /*#__PURE__*/React.createElement("textarea", {
      "data-sgfield": "alasan",
      value: V.sanggahanForm.alasan,
      onChange: V.onSanggahanChange,
      style: css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-size:13.5px;color:#18191f;background:#fff;height:80px;resize:vertical;line-height:1.6;')
    })), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; gap:8px; justify-content:flex-end;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onTutupFormSanggahan,
      style: css('padding:9px 16px; font-family:inherit; font-size:13px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')
    }, "Batal"), /*#__PURE__*/React.createElement("button", {
      onClick: V.onSubmitSanggahan,
      style: css('padding:9px 18px; font-family:inherit; font-size:13px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')
    }, "Kirim Sanggahan")))))), this.renderKuesioner(this.state.warga.find(w => w.id === this.state.selectedId))), V.isSanggahan && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:16px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:20px; font-weight:800; color:#18191f; letter-spacing:-0.02em;')
    }, "Daftar Sanggahan"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px; color:#9ba2b6; margin-top:3px;')
    }, "Pengajuan keberatan atas perubahan data warga — diproses oleh Operator Desa")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; gap:9px; align-items:center; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("select", {
      value: V.filterSanggahan,
      "data-filter": "filterSanggahan",
      onChange: V.onFilter,
      style: css('padding:9px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')
    }, V.sgFilterOpts.map((opt, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label))))), V.sanggahanListDisplay.map((sg, i) => /*#__PURE__*/React.createElement("div", {
      key: sg.id,
      style: css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:5px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:10px; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:15px; font-weight:700; color:#18191f;')
    }, sg.wargaNama), /*#__PURE__*/React.createElement("span", {
      style: css(sg.statusStyle)
    }, sg.status)), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px; color:#9ba2b6;')
    }, "Snapshot ", /*#__PURE__*/React.createElement("strong", {
      style: css('color:#52576b;')
    }, sg.tanggalSnapshotStr), " · Diajukan ", sg.tanggalPengajuanStr)), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:2px; text-align:right;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px; font-weight:700; color:#3d4152;')
    }, sg.pengaju), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6;')
    }, sg.hubungan, " · ", sg.nik))), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fafaf9; border-radius:10px; padding:13px 15px; font-size:13.5px; color:#3d4152; line-height:1.65; border:1px solid #f0f0ee;')
    }, sg.alasan), sg.adaCatatan && /*#__PURE__*/React.createElement("div", {
      style: css('background:#f0f5f0; border:1px solid #c6e0c6; border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:3px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#166534; text-transform:uppercase; letter-spacing:0.05em;')
    }, "Catatan Operator · ", sg.tanggalSelesaiStr), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; color:#1c3a1c; line-height:1.6;')
    }, sg.catatanOperator)), V.canCrud && sg.isProcessing && /*#__PURE__*/React.createElement("div", {
      style: css('background:#f7f7f5; border:1.5px solid #e0e0de; border-radius:11px; padding:14px; display:flex; flex-direction:column; gap:10px; animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css('display:block; font-size:12px; font-weight:600; color:#52576b; margin-bottom:5px;')
    }, "Catatan Penyelesaian (opsional)"), /*#__PURE__*/React.createElement("textarea", {
      value: sg.processCatatan,
      onChange: sg.onProcessCatatan,
      style: css('width:100%; padding:9px 11px; border:1.5px solid #e0e0de; border-radius:8px; font-size:13.5px; color:#18191f; background:#fff; height:72px; resize:vertical; line-height:1.6;')
    }), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: sg.onBatalProses,
      style: css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')
    }, "Batal"), /*#__PURE__*/React.createElement("button", {
      onClick: sg.onTolak,
      style: css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #fca5a5; background:#fef2f2; color:#b91c1c; border-radius:8px; cursor:pointer;')
    }, "Tolak Sanggahan"), /*#__PURE__*/React.createElement("button", {
      onClick: sg.onTerima,
      style: css('padding:8px 16px; font-family:inherit; font-size:12.5px; font-weight:700; border:none; background:#16a34a; color:#fff; border-radius:8px; cursor:pointer;')
    }, "Terima Sanggahan"))), V.canCrud && sg.showActions && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding-top:4px; border-top:1px solid #f0f0ee;')
    }, sg.canProses && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: sg.onTandaiProses,
      style: css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #c7d7f6; background:#eef2fc; color:#1e50d0; border-radius:8px; cursor:pointer;')
    }, "Tandai Diproses"), /*#__PURE__*/React.createElement("button", {
      onClick: sg.onTolakLangsung,
      style: css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #fca5a5; background:#fef2f2; color:#b91c1c; border-radius:8px; cursor:pointer;')
    }, "Tolak")), sg.canSelesai && /*#__PURE__*/React.createElement("button", {
      onClick: sg.onMulaiSelesai,
      style: css('padding:8px 16px; font-family:inherit; font-size:12.5px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')
    }, "Proses & Beri Keputusan")))), V.sgKosong && /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:48px; text-align:center; color:#9ba2b6; font-size:13.5px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')
    }, "Tidak ada sanggahan yang cocok dengan filter.")))), !V.isForm && V.isMobile && /*#__PURE__*/React.createElement("nav", {
      style: css('position:fixed;bottom:0;left:0;right:0;z-index:29;background:#fff;border-top:1px solid #e8e8e6;display:flex;height:58px;')
    }, V.navItems.map((item, i) => {
      const icons = ['⊞', '≡', '⚑'];
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: item.onClick,
        style: css('flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:none;background:none;cursor:pointer;font-family:inherit;padding:0;position:relative;border-top:2px solid ' + (item.active ? '#1e50d0' : 'transparent') + ';')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:18px;color:' + (item.active ? '#1e50d0' : '#9ba2b6') + ';line-height:1;')
      }, icons[i]), /*#__PURE__*/React.createElement("span", {
        style: css('font-size:10px;font-weight:' + (item.active ? '700' : '500') + ';color:' + (item.active ? '#1e50d0' : '#9ba2b6') + ';white-space:nowrap;')
      }, item.label === 'Daftar Warga' ? 'Warga' : item.label === 'Sanggahan' ? 'Sanggah' : item.label), item.badge > 0 && /*#__PURE__*/React.createElement("span", {
        style: css('position:absolute;top:6px;right:calc(50% - 18px);min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:#dc2626;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;')
      }, item.badge));
    })), V.toast && /*#__PURE__*/React.createElement("div", {
      style: css(V.toastStyle)
    }, V.toast.msg), V.showScrollTop && /*#__PURE__*/React.createElement("button", {
      onClick: () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      }),
      title: "Kembali ke atas",
      style: css('position:fixed;' + (V.isMobile ? 'bottom:70px;' : 'bottom:24px;') + 'right:' + (V.isMobile ? '14px' : '24px') + ';z-index:28;width:38px;height:38px;border-radius:50%;border:none;background:#1e50d0;color:#fff;font-size:16px;cursor:pointer;box-shadow:0 4px 14px rgba(30,80,208,0.35);display:flex;align-items:center;justify-content:center;')
    }, "↑"), V.loading && /*#__PURE__*/React.createElement("div", {
      style: css('position:fixed;inset:0;z-index:100;background:rgba(15,18,28,0.4);display:flex;align-items:center;justify-content:center;animation:fadein 0.15s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:16px;padding:28px 40px;display:flex;flex-direction:column;align-items:center;gap:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:40px;height:40px;border:4px solid #e8e8e6;border-top-color:#1e50d0;border-radius:50%;animation:spin 0.7s linear infinite;')
    }), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:14px;font-weight:600;color:#52576b;')
    }, "Memuat…"))));
  }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(Component, {
  namaDesa: "Kec. Tejakula, Buleleng",
  namaOperator: "Komang Sutarja"
}));