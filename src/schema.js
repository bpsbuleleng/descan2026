// ---------------------------------------------------------------------------
// FASIH "Pemutakhiran DTSEN PBI 2026" (moda Aplikasi) — daftar kode jawaban,
// persis seperti kuesioner. Nilai tersimpan = string berkode ("1. ...") agar
// jelas & mudah divalidasi. Dipakai untuk render form & mesin validasi.
// ---------------------------------------------------------------------------
var ORANGE='#e0701f';     // aksen oranye ala FASIH (dipakai di form kuesioner)
var ORANGE_BG='#fff6ee';
var KODE={
  statusKeluarga:['0. Tidak Ditemukan (STOP)','1. Ditemukan','3. Meninggal','4. Tidak Eligible','5. Tidak dapat ditemui sampai akhir pendataan'],
  alamatSesuaiKK:['1. Ya, Sesuai KK','2. Tidak Sesuai KK'],
  geotagMode:['1. Geotagging langsung','2. Input Manual'],
  jenisBangunan:['1. Rumah tinggal tunggal','2. Apartemen','3. Rumah Susun','4. Rumah Deret','5. Kos'],
  statusKepemilikan:['1. Milik sendiri','2. Kontrak/sewa','3. Bebas sewa','4. Dinas','5. Lainnya'],
  buktiMilik:['1. SHM','2. Sertifikat selain SHM (SHGB, SHSRS)','3. Surat bukti lainnya (Girik, Letter C, dll)','4. Tidak Punya'],
  lantaiBahan:['1. Marmer/granit','2. Keramik','3. Parket/vinil/permadani','4. Ubin/tegel/teraso','5. Kayu/papan','6. Semen/bata merah','7. Bambu','8. Tanah','9. Lainnya'],
  kondisi:['1. Baik','2. Rusak ringan','3. Rusak sedang','4. Rusak berat'],
  dindingBahan:['1. Tembok','2. Plesteran anyaman bambu/kawat','3. Kayu/Papan/Gypsum/GRC/Calciboard','4. Anyaman bambu','5. Batang kayu','6. Bambu','7. Lainnya'],
  atapBahan:['1. Beton','2. Genteng','3. Seng','4. Asbes','5. Bambu','6. Kayu/sirap','7. Jerami/ijuk/daun daunan/rumbia','8. Lainnya'],
  fasilitasBAB:['1. Ada, digunakan oleh anggota keluarga dalam satu rumah','2. Ada, digunakan bersama oleh anggota keluarga dari beberapa rumah','3. Ada, di MCK komunal','4. Ada, di MCK umum/siapapun menggunakan','5. Ada, anggota keluarga tidak menggunakan','6. Tidak Ada'],
  jenisKloset:['1. Leher angsa','2. Plengsengan dengan tutup','3. Plengsengan tanpa tutup','4. Cemplung/cubluk'],
  pembuanganTinja:['1. Tangki septik','2. IPAL','3. Kolam/sawah/sungai/danau/laut','4. Lubang tanah','5. Pantai/tanah lapang/kebun','6. Lainnya'],
  sumberAirMinum:['1. Air kemasan bermerk','2. Air isi ulang','3. Leding','4. Sumur bor/pompa','5. Sumur terlindung','6. Sumur tak terlindung','7. Mata air terlindung','8. Mata air tak terlindung','9. Air permukaan (sungai/danau/waduk/kolam/irigasi)','10. Air hujan','11. Lainnya'],
  sumberPenerangan:['1. Listrik PLN dengan meteran','2. Listrik PLN tanpa meteran','3. Listrik Non-PLN','4. Bukan listrik'],
  daya:['1. 450 watt','2. 900 watt','3. 1.300 watt','4. 2.200 watt','5. > 2.200 watt'],
  jenisIdMeteran:['ID Pelanggan','No Meteran'],
  keberadaan:['1. Tinggal di rumah/tempat tinggal ini','2. Meninggal','3. Tidak tinggal bersama keluarga/pindah ke wilayah (daerah lain di Indonesia)','4. Tidak tinggal bersama keluarga/pindah ke luar negeri','6. Sudah pisah KK','7. Tidak ditemukan/Tidak dikenal'],
  domisili:['1. Sesuai KK dan KTP','2. Hanya Sesuai KK','3. Hanya Sesuai KTP','4. Tidak sesuai dengan KK dan KTP'],
  jk:['1. Laki-laki','2. Perempuan'],
  bulan:['01 - Januari','02 - Februari','03 - Maret','04 - April','05 - Mei','06 - Juni','07 - Juli','08 - Agustus','09 - September','10 - Oktober','11 - November','12 - Desember'],
  statusKawin:['1. Belum kawin','2. Kawin/nikah','3. Cerai hidup','4. Cerai mati'],
  hubungan:['1. Kepala Keluarga','2. Istri/Suami','3. Anak','4. Menantu','5. Cucu','6. Orang Tua','7. Mertua','8. Famili Lain','9. Lainnya'],
  partisipasiSekolah:['0. Tidak/belum pernah sekolah','1. Masih sekolah','2. Tidak bersekolah lagi'],
  pendidikan:['0. Tidak punya ijazah','1. SD/sederajat','2. SMP/sederajat','3. SMA/sederajat','4. D1/D2/D3','5. D4/S1','6. S2/S3'],
  yaTidakTT:['1. Ya','2. Tidak','9. Tidak Tahu'],
  yaTidak:['1. Ya','2. Tidak'],
  statusKerja:['1. Berusaha sendiri','2. Berusaha dibantu buruh','3. Buruh/karyawan/pegawai swasta','4. ASN/TNI/Polri/BUMN/BUMD/pejabat negara/kades','5. Pekerja bebas','6. Pekerja keluarga/tidak dibayar','9. Tidak tahu'],
  rekening:['1. Ya untuk usaha','2. Ya untuk pribadi','3. Ya untuk usaha dan pribadi','4. Tidak ada','9. Tidak tahu']
};
// Blok IV R38 (a–f) & R39 (a–r): item Ya/Tidak per anggota.
var DISABILITAS_ITEMS=[['fisik','Disabilitas Fisik'],['mental','Disabilitas Mental'],['intelektual','Disabilitas Intelektual'],['netra','Disabilitas Sensorik Netra'],['rungu','Disabilitas Sensorik Rungu'],['wicara','Disabilitas Sensorik Wicara']];
var KESEHATAN_ITEMS=[['hipertensi','Hipertensi (tekanan darah tinggi)'],['rematik','Rematik'],['asma','Asma'],['jantung','Masalah jantung'],['diabetes','Diabetes (kencing manis)'],['tbc','Tuberkulosis (TBC)'],['stroke','Stroke'],['kanker','Kanker atau tumor ganas'],['ginjal','Gagal ginjal'],['hemofilia','Hemofilia'],['hiv','HIV/AIDS'],['kolesterol','Kolestrol'],['sirosis','Sirosis hati'],['talasemia','Talasemia'],['leukemia','Leukemia'],['alzheimer','Alzheimer'],['lainnya','Lainnya'],['tidakTahu','Tidak tahu']];
// Blok III R22 aset bergerak (key,label,satuan) & R23 aset tidak bergerak.
var ASET22=[['tabungGas3','Tabung gas 3 kg','unit'],['tabungGas55','Tabung gas 5,5 kg atau lebih','unit'],['kulkas','Lemari es/kulkas','unit'],['ac','AC','unit'],['emas','Emas/perhiasan','gram'],['komputer','Komputer/laptop/tablet','unit'],['sepedaMotor','Sepeda motor','unit'],['mobil','Mobil','unit']];
var ASET23=[['lahanLain','Jumlah lahan di tempat lain'],['bangunanLain','Jumlah rumah/bangunan di tempat lain']];

// Skema field Blok II (Perumahan). `when(k)` = skip-logic; tanpa `when` selalu berlaku.
var BLOK2=[
  {p:'rumah.jumlahKeluarga',r:'5a',label:'Jumlah keluarga yang tinggal dalam 1 rumah/tempat tinggal',type:'number',req:true},
  {p:'rumah.jenisBangunan',r:'6a',label:'Jenis bangunan tempat tinggal yang ditempati',type:'radio',opts:KODE.jenisBangunan,req:true},
  {p:'rumah.statusKepemilikan',r:'7a',label:'Status kepemilikan bangunan tempat tinggal',type:'radio',opts:KODE.statusKepemilikan,req:true},
  {p:'rumah.buktiMilik',r:'7b',label:'Jenis bukti kepemilikan tanah bangunan tempat tinggal',type:'radio',opts:KODE.buktiMilik,req:true,when:k=>/Milik sendiri/.test(getPath(k,'rumah.statusKepemilikan')||'')},
  {p:'rumah.nilaiSewa',r:'8',label:'Perkiraan nilai sewa/kontrak sebulan',type:'rupiah',req:true,when:k=>/Milik sendiri|Bebas sewa|Kontrak\/sewa/.test(getPath(k,'rumah.statusKepemilikan')||'')},
  {p:'rumah.luasLantai',r:'9',label:'Luas lantai bangunan tempat tinggal (m²)',type:'number',req:true},
  {p:'rumah.lantaiBahan',r:'10a',label:'Bahan bangunan utama lantai rumah terluas',type:'radio',opts:KODE.lantaiBahan,req:true},
  {p:'rumah.lantaiKondisi',r:'10b',label:'Kondisi lantai',type:'radio',opts:KODE.kondisi,req:true},
  {p:'rumah.dindingBahan',r:'11a',label:'Bahan bangunan utama dinding rumah terluas',type:'radio',opts:KODE.dindingBahan,req:true},
  {p:'rumah.dindingKondisi',r:'11b',label:'Kondisi dinding',type:'radio',opts:KODE.kondisi,req:true},
  {p:'rumah.atapBahan',r:'12a',label:'Bahan bangunan utama atap rumah terluas',type:'radio',opts:KODE.atapBahan,req:true},
  {p:'rumah.atapKondisi',r:'12b',label:'Kondisi atap',type:'radio',opts:KODE.kondisi,req:true},
  {p:'rumah.fasilitasBAB',r:'13',label:'Fasilitas tempat buang air besar & siapa yang menggunakan',type:'radio',opts:KODE.fasilitasBAB,req:true},
  {p:'rumah.jenisKloset',r:'14',label:'Jenis kloset yang digunakan',type:'radio',opts:KODE.jenisKloset,req:true},
  {p:'rumah.pembuanganTinja',r:'15',label:'Tempat pembuangan akhir tinja',type:'radio',opts:KODE.pembuanganTinja,req:true},
  {p:'rumah.sumberAirMinum',r:'16',label:'Sumber air utama yang digunakan keluarga untuk minum',type:'radio',opts:KODE.sumberAirMinum,req:true},
  {p:'rumah.sumberPenerangan',r:'17',label:'Sumber penerangan utama rumah ini',type:'radio',opts:KODE.sumberPenerangan,req:true}
];
// Blok II lanjutan (setelah roster Meteran R18).
var BLOK2B=[
  {p:'rumah.pengeluaranListrik',r:'19',label:'Nilai pengeluaran listrik sebulan',type:'rupiah',req:true},
  {p:'rumah.pengeluaranPulsa',r:'20a',label:'Pengeluaran pulsa seluruh anggota keluarga sebulan',type:'rupiah',req:true},
  {p:'rumah.pengeluaranInternet',r:'20b',label:'Pengeluaran internet seluruh anggota keluarga sebulan',type:'rupiah',req:true}
];
// Skema field per anggota (Blok IV). `rp` = path relatif di objek anggota.
// `when(k,a)` = skip-logic; `digits` = panjang digit wajib (NIK).
var ANGGOTA_FIELDS=[
  {rp:'nama',r:'25',label:'Nama Anggota Keluarga',type:'text',req:true},
  {rp:'nik',r:'26a',label:'Nomor Induk Kependudukan (NIK)',type:'text',req:true,digits:16},
  {rp:'hp',r:'26b',label:'Nomor telepon/HP (isi "-" bila tidak ada)',type:'text',req:true},
  {rp:'keberadaan',r:'27a',label:'Keberadaan anggota keluarga',type:'radio',opts:KODE.keberadaan,req:true},
  {rp:'domisili',r:'27b',label:'Alamat Domisili',type:'radio',opts:KODE.domisili,req:true},
  {rp:'jk',r:'29',label:'Jenis Kelamin',type:'radio',opts:KODE.jk,req:true},
  {rp:'statusKawin',r:'31',label:'Status Perkawinan',type:'radio',opts:KODE.statusKawin,req:true},
  {rp:'hubungan',r:'32',label:'Hubungan dengan Kepala Keluarga',type:'radio',opts:KODE.hubungan,req:true},
  {rp:'partisipasiSekolah',r:'33',label:'Partisipasi sekolah',type:'radio',opts:KODE.partisipasiSekolah,req:true},
  {rp:'pendidikan',r:'34',label:'Pendidikan tertinggi yang ditamatkan',type:'radio',opts:KODE.pendidikan,req:true},
  {rp:'pendapatanKerja',r:'35a',label:'Pendapatan dari pekerjaan (gaji/upah/honor)',type:'radio',opts:KODE.yaTidakTT,req:true},
  {rp:'pendapatanUsaha',r:'35b',label:'Pendapatan dari usaha (offline/online)',type:'radio',opts:KODE.yaTidakTT,req:true},
  {rp:'nilaiUsaha',r:'35b',label:'Total pendapatan dari usaha sebulan',type:'rupiah',req:true,when:(k,a)=>/^1\. Ya/.test(a.pendapatanUsaha||'')},
  {rp:'pendapatanLain',r:'35c',label:'Penerimaan pendapatan lain (transfer/pemberian/passive income)',type:'radio',opts:KODE.yaTidakTT,req:true},
  {rp:'profesi',r:'36',label:'Profesi/Pekerjaan Utama',type:'text',req:true},
  {rp:'statusKerja',r:'37',label:'Status Kedudukan dalam Pekerjaan Utama',type:'radio',opts:KODE.statusKerja,req:true},
  {rp:'rekening',r:'40',label:'Memiliki rekening aktif atau dompet digital?',type:'radio',opts:KODE.rekening,req:true}
];
