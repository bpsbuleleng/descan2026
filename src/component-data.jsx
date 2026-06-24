// ---------------------------------------------------------------------------
// Data layer: FASIH struct factories, seed warga, form state factories.
// Methods dibagi terpisah dari class body utama agar mudah dikelola.
// ---------------------------------------------------------------------------
Object.assign(Component.prototype, {

  // -- FASIH: faktori anggota, pemetaan ringkasan, & pembangkit struktur seed --
  emptyDisabilitas(){ const o={}; DISABILITAS_ITEMS.forEach(it=>{o[it[0]]='2. Tidak';}); return o; },
  emptyKesehatan(){ const o={}; KESEHATAN_ITEMS.forEach(it=>{o[it[0]]='2. Tidak';}); return o; },
  mkAnggota(over){
    over=over||{};
    return {no:over.no||1, nama:over.nama||'', nik:over.nik||'', hp:over.hp||'-',
      keberadaan:over.keberadaan||'1. Tinggal di rumah/tempat tinggal ini', domisili:over.domisili||'1. Sesuai KK dan KTP',
      jk:over.jk||'1. Laki-laki', tglLahir:over.tglLahir||'', blnLahir:over.blnLahir||'', thnLahir:over.thnLahir||'', umur:over.umur||'',
      statusKawin:over.statusKawin||'2. Kawin/nikah', hubungan:over.hubungan||'1. Kepala Keluarga',
      partisipasiSekolah:over.partisipasiSekolah||'2. Tidak bersekolah lagi', pendidikan:over.pendidikan||'1. SD/sederajat',
      pendapatanKerja:over.pendapatanKerja||'2. Tidak', nilaiKerja:over.nilaiKerja||'', pendapatanUsaha:over.pendapatanUsaha||'2. Tidak', nilaiUsaha:over.nilaiUsaha||'', pendapatanLain:over.pendapatanLain||'2. Tidak', nilaiLain:over.nilaiLain||'',
      profesi:over.profesi||'', statusKerja:over.statusKerja||'6. Pekerja keluarga/tidak dibayar',
      disabilitas:Object.assign(this.emptyDisabilitas(),over.disabilitas||{}), kesehatan:Object.assign(this.emptyKesehatan(),over.kesehatan||{}),
      rekening:over.rekening||'4. Tidak ada'};
  },
  kepalaKeluarga(k){ const a=(k&&k.anggota)||[]; return a.find(x=>String(x.hubungan||'').indexOf('1.')===0)||a[0]||null; },
  totalPendapatan(k){ let s=0; (k&&k.anggota||[]).forEach(a=>{ s+=Number(a.nilaiKerja||0)+Number(a.nilaiUsaha||0)+Number(a.nilaiLain||0); }); return s; },
  pendidikanProxy(p){ p=String(p||''); if(/^0\./.test(p))return 'Tidak Sekolah'; if(/^1\./.test(p))return 'SD'; if(/^2\./.test(p))return 'SMP'; if(/^3\./.test(p))return 'SMA'; if(/^4\./.test(p))return 'D3'; return 'S1'; },
  pendidikanProxyInv(old){ old=String(old||''); const m={'Tidak Sekolah':'0. Tidak punya ijazah','SD':'1. SD/sederajat','SMP':'2. SMP/sederajat','SMA':'3. SMA/sederajat','D3':'4. D1/D2/D3','S1':'5. D4/S1'}; return m[old]||'1. SD/sederajat'; },
  statusRumahProxy(r){ const s=String((r&&r.statusKepemilikan)||''); if(/Milik sendiri/.test(s))return 'Milik Sendiri'; if(/Kontrak|sewa/.test(s)&&!/Bebas/.test(s))return 'Sewa/Kontrak'; return 'Numpang'; },
  defaultWilayah(meta){
    const kodeDesa={'Desa Sambirenteng':'[008]','Desa Penuktukan':'[009]','Desa Tembok':'[010]'};
    return {provinsi:'[51] BALI',kabupaten:'[08] BULELENG',kecamatan:'[090] TEJAKULA',
      desa:(kodeDesa[meta.desa]||'[010]')+' '+String(meta.desa||'').replace('Desa ','').toUpperCase(),
      klasifikasi:'2. Perdesaan', kodeSls:'0003'+String(meta.rt||'01').slice(-2), namaSls:meta.dusun||'', kodePos:'81173',
      namaJalan:meta.alamat||'', nomorRumah:'-'};
  },
  // Pemetaan struktur FASIH -> input lama hitungDesil() (dipertahankan apa adanya).
  deriveDesilInputs(k){
    const r=k.rumah||{}, as=k.aset||{}, krt=this.kepalaKeluarga(k)||{};
    const lantai=/Tanah/.test(r.lantaiBahan)?'Tanah':/Semen|Bambu|Kayu|papan/.test(r.lantaiBahan)?'Semen':'Keramik/Ubin';
    const dinding=(/^1\. Tembok/.test(r.dindingBahan))?'Tembok':/Plesteran|Kayu|Papan|Gypsum/.test(r.dindingBahan)?'Setengah Tembok':'Bambu/Kayu';
    const atap=/Beton|Genteng/.test(r.atapBahan)?'Genteng/Beton':/Seng|Asbes/.test(r.atapBahan)?'Seng/Asbes':'Daun/Rumbia';
    const air=/kemasan|isi ulang|Leding|bor|pompa/.test(r.sumberAirMinum)?'PDAM/Ledeng':/Sumur|Mata air/.test(r.sumberAirMinum)?'Sumur':'Sungai/Hujan';
    const daya=(k.meteran&&k.meteran[0]&&k.meteran[0].daya)||'';
    const pen=/Bukan listrik|Non-PLN/.test(r.sumberPenerangan)?'Non-PLN':/^1\. 450/.test(daya)?'PLN 450 VA':'PLN 900+ VA';
    const aset=[]; if(Number(as.sepedaMotor)>0)aset.push('Sepeda Motor'); if(Number(as.mobil)>0)aset.push('Mobil'); if(Number(as.kulkas)>0)aset.push('Kulkas'); if(Number(as.ac)>0)aset.push('AC');
    return {penghasilan:this.totalPendapatan(k), lantai:lantai, dinding:dinding, atap:atap, sumberAir:air, penerangan:pen, aset:aset, pekerjaan:krt.profesi||'Tidak Bekerja', pendidikan:this.pendidikanProxy(krt.pendidikan)};
  },
  // Ringkasan datar yang dipakai dashboard/daftar/riwayat/desil/snapshot.
  deriveSummary(k){
    const inp=this.deriveDesilInputs(k);
    const desil=k.desilManual?Number(k.desil||5):this.hitungDesil(inp);
    const disab=(k.anggota||[]).some(a=>DISABILITAS_ITEMS.some(it=>/^1\. Ya/.test((a.disabilitas&&a.disabilitas[it[0]])||'')))?'Ada':'Tidak Ada';
    return Object.assign({}, inp, {desil:desil, bansos:k.bansos||'Tidak Ada', jumlahAnggota:(k.anggota||[]).length, disabilitas:disab, statusRumah:this.statusRumahProxy(k.rumah)});
  },
  // Bangun blok terstruktur FASIH dari satu "state" ekonomi lama (untuk seed).
  stateToStruct(state,meta){
    const invLantai={'Tanah':'8. Tanah','Semen':'6. Semen/bata merah','Keramik/Ubin':'2. Keramik'};
    const invDinding={'Bambu/Kayu':'6. Bambu','Setengah Tembok':'2. Plesteran anyaman bambu/kawat','Tembok':'1. Tembok'};
    const invAtap={'Daun/Rumbia':'7. Jerami/ijuk/daun daunan/rumbia','Seng/Asbes':'3. Seng','Genteng/Beton':'2. Genteng'};
    const invAir={'Sungai/Hujan':'9. Air permukaan (sungai/danau/waduk/kolam/irigasi)','Sumur':'5. Sumur terlindung','PDAM/Ledeng':'3. Leding'};
    const invStatus={'Milik Sendiri':'1. Milik sendiri','Sewa/Kontrak':'2. Kontrak/sewa','Numpang':'3. Bebas sewa'};
    const penToDaya={'PLN 450 VA':'1. 450 watt','PLN 900+ VA':'3. 1.300 watt'};
    const daya=penToDaya[state.penerangan]||null;
    const penerangan=state.penerangan==='Non-PLN'?'3. Listrik Non-PLN':'1. Listrik PLN dengan meteran';
    const rumah={ jumlahKeluarga:1, jenisBangunan:'1. Rumah tinggal tunggal',
      statusKepemilikan:invStatus[state.statusRumah]||'1. Milik sendiri', buktiMilik:'1. SHM',
      nilaiSewa:state.statusRumah==='Milik Sendiri'?500000:800000, luasLantai:36+Number(state.jumlahAnggota||1)*8,
      lantaiBahan:invLantai[state.lantai]||'8. Tanah', lantaiKondisi:'1. Baik',
      dindingBahan:invDinding[state.dinding]||'6. Bambu', dindingKondisi:'1. Baik',
      atapBahan:invAtap[state.atap]||'3. Seng', atapKondisi:'1. Baik',
      fasilitasBAB:'1. Ada, digunakan oleh anggota keluarga dalam satu rumah', jenisKloset:'1. Leher angsa',
      pembuanganTinja:'1. Tangki septik', sumberAirMinum:invAir[state.sumberAir]||'5. Sumur terlindung',
      sumberPenerangan:penerangan, pengeluaranListrik:state.penerangan==='Non-PLN'?0:(daya&&/450/.test(daya)?75000:250000),
      pengeluaranPulsa:100000, pengeluaranInternet:Number(state.penghasilan||0)>3000000?150000:0, foto:this.seedFoto() };
    const meteran=daya?[{daya:daya, jenisId:'ID Pelanggan', idPelanggan:(String(meta.noKK)+'00').slice(0,12)}]:[];
    const A=state.aset||[]; const has=n=>A.indexOf(n)>=0;
    const aset={ tabungGas3:1, tabungGas55:0, kulkas:has('Kulkas')||has('TV')?1:0, ac:has('AC')?1:0, emas:has('Mobil')?20:0,
      komputer:0, sepedaMotor:has('Sepeda Motor')?1:0, nilaiSepedaMotor:has('Sepeda Motor')?15000000:0,
      mobil:has('Mobil')?1:0, nilaiMobil:has('Mobil')?120000000:0, lahanLain:0, bangunanLain:0 };
    const names=(meta.anggota&&meta.anggota.length?meta.anggota:[meta.nama]);
    const dis=state.disabilitas==='Ada';
    const anggota=names.map((nm,i)=>{
      const hub=i===0?'1. Kepala Keluarga':i===1?'2. Istri/Suami':'3. Anak';
      const jk=i===0?'1. Laki-laki':i===1?'2. Perempuan':(i%2?'1. Laki-laki':'2. Perempuan');
      const thn=1990-i*3;
      return this.mkAnggota({ no:i+1, nama:nm, nik:i===0?meta.nik:String(meta.nik).slice(0,-2)+String(20+i).slice(-2),
        hp:i===0?('0812'+String(meta.noKK).slice(-8)):'-', jk:jk, hubungan:hub,
        tglLahir:String(5+i), blnLahir:'05 - Mei', thnLahir:String(thn), umur:String(2026-thn),
        statusKawin:i<2?'2. Kawin/nikah':'1. Belum kawin',
        partisipasiSekolah:i>=2?'1. Masih sekolah':'2. Tidak bersekolah lagi',
        pendidikan:this.pendidikanProxyInv(state.pendidikan),
        pendapatanKerja:i===0&&!/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan)?'1. Ya':'2. Tidak',
        pendapatanUsaha:(i===0&&/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan))?'1. Ya':'2. Tidak',
        nilaiKerja:i===0&&!/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan)?Number(state.penghasilan||0):'',
        nilaiUsaha:i===0&&/wiraswasta|pedagang|usaha|dagang/i.test(state.pekerjaan)?Number(state.penghasilan||0):'',
        profesi:i===0?state.pekerjaan:(i===1?'Mengurus rumah tangga':'Pelajar/Mahasiswa'),
        statusKerja:i===0?'1. Berusaha sendiri':'6. Pekerja keluarga/tidak dibayar',
        disabilitas:(dis&&i===0)?{fisik:'1. Ya'}:{} });
    });
    return {rumah:rumah, meteran:meteran, aset:aset, anggota:anggota};
  },

  mkWarga(meta,states){
    const snaps=[]; let prev=null;
    for(let i=0;i<states.length;i++){ const st=states[i];
      const data={pekerjaan:st.pekerjaan,pendidikan:st.pendidikan,penghasilan:st.penghasilan,jumlahAnggota:st.jumlahAnggota,disabilitas:st.disabilitas,statusRumah:st.statusRumah,lantai:st.lantai,dinding:st.dinding,atap:st.atap,sumberAir:st.sumberAir,penerangan:st.penerangan,aset:st.aset.slice(),bansos:st.bansos};
      data.desil=this.hitungDesil(data); const diff=prev?this.computeDiff(prev,data):[];
      snaps.push({tanggal:st.tanggal,operator:st.operator,data:data,foto:this.emptyFoto(),fieldYangBerubah:diff}); prev=data;
    }
    const last=snaps[snaps.length-1];
    const struct=this.stateToStruct(states[states.length-1],meta);
    return Object.assign({},meta,last.data,{foto:last.foto,snapshots:snaps,
      anggota:struct.anggota, rumah:struct.rumah, meteran:struct.meteran, aset:struct.aset,
      wilayah:this.defaultWilayah(meta), statusKeluarga:'1. Ditemukan',
      geotag:{mode:'2. Input Manual',lat:'',long:'',akurasi:''}, catatan:'', status:'final',
      jumlahAnggotaKK:struct.anggota.length, alamatSesuaiKK:'1. Ya, Sesuai KK', desilManual:false});
  },

  // Data dummy: Kecamatan Tejakula, Kabupaten Buleleng — Desa Sambirenteng,
  // Penuktukan, dan Tembok. SLS = banjar dinas. Dirancang menutup semua kasus:
  // desil 1–10, semua status bansos, perubahan desil naik & turun, disabilitas,
  // beragam kondisi rumah/pekerjaan, serta rumah tangga 1 & 2 snapshot.
  seedWarga(){
    const W=[]; const mk=(m,s)=>W.push(this.mkWarga(m,s));

    // === Desa Sambirenteng =================================================
    mk({id:'w01',noKK:'5108150101010001',nik:'5108150101800001',nama:'I Wayan Sukra',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Sambirenteng',rt:'001',rw:'001',alamat:'Jl. Air Sanih Gg. Melati',anggota:['I Wayan Sukra','Ni Ketut Rinjin','Kadek Adi']},[
      {tanggal:'2026-06-15',operator:'Komang Sutarja',pekerjaan:'Buruh Tani',pendidikan:'Tidak Sekolah',penghasilan:600000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Numpang',lantai:'Tanah',dinding:'Bambu/Kayu',atap:'Daun/Rumbia',sumberAir:'Sungai/Hujan',penerangan:'Non-PLN',aset:[],bansos:'PKH + BPNT'}
    ]);
    mk({id:'w02',noKK:'5108150101010002',nik:'5108154208650002',nama:'Ni Nengah Rauh',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Sambirenteng',rt:'002',rw:'001',alamat:'Jl. Air Sanih No. 8',anggota:['Ni Nengah Rauh','I Gede Bagia']},[
      {tanggal:'2025-09-10',operator:'Komang Sutarja',pekerjaan:'Buruh Harian',pendidikan:'SD',penghasilan:1500000,jumlahAnggota:2,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['TV','Sepeda'],bansos:'PKH'},
      {tanggal:'2026-06-15',operator:'Komang Sutarja',pekerjaan:'Tidak Bekerja',pendidikan:'SD',penghasilan:700000,jumlahAnggota:2,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['TV'],bansos:'PKH'}
    ]);
    mk({id:'w03',noKK:'5108150102010003',nik:'5108150703700003',nama:'I Ketut Murta',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Penyumbahan',rt:'001',rw:'002',alamat:'Br. Penyumbahan Kaja',anggota:['I Ketut Murta','Ni Wayan Sari','Putu Eka','Kadek Dwi']},[
      {tanggal:'2026-06-16',operator:'Putu Ariani',pekerjaan:'Nelayan',pendidikan:'SD',penghasilan:1700000,jumlahAnggota:4,disabilitas:'Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['Perahu','Sepeda Motor'],bansos:'BPNT'}
    ]);
    mk({id:'w04',noKK:'5108150102010004',nik:'5108151511780004',nama:'I Putu Gde Astawa',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Penyumbahan',rt:'002',rw:'002',alamat:'Br. Penyumbahan Kelod',anggota:['I Putu Gde Astawa','Ni Made Asih','Gede Surya']},[
      {tanggal:'2025-08-01',operator:'Putu Ariani',pekerjaan:'Pedagang',pendidikan:'SMP',penghasilan:2300000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','TV'],bansos:'BPNT'},
      {tanggal:'2026-06-16',operator:'Putu Ariani',pekerjaan:'Wiraswasta',pendidikan:'SMP',penghasilan:4200000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','Mobil','Kulkas','TV'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w05',noKK:'5108150103010005',nik:'5108151009820005',nama:'I Gede Suardika',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Bantes',rt:'001',rw:'003',alamat:'Br. Bantes',anggota:['I Gede Suardika','Ni Luh Putri','Komang Tri']},[
      {tanggal:'2026-06-17',operator:'Komang Sutarja',pekerjaan:'PNS',pendidikan:'S1',penghasilan:6500000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Mobil','Sepeda Motor','Kulkas','TV','AC'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w06',noKK:'5108150103010006',nik:'5108154506880006',nama:'Ni Made Sari',desa:'Desa Sambirenteng',dusun:'Banjar Dinas Bantes',rt:'002',rw:'003',alamat:'Br. Bantes Gg. II',anggota:['Ni Made Sari','I Ketut Lanus','Putu Ayu']},[
      {tanggal:'2026-06-17',operator:'Komang Sutarja',pekerjaan:'Buruh Tani',pendidikan:'SD',penghasilan:1100000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Bambu/Kayu',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['TV'],bansos:'PKH'}
    ]);

    // === Desa Penuktukan ===================================================
    mk({id:'w07',noKK:'5108150201010007',nik:'5108150201750007',nama:'I Nyoman Reta',desa:'Desa Penuktukan',dusun:'Banjar Dinas Penuktukan',rt:'001',rw:'001',alamat:'Jl. Singaraja-Amlapura',anggota:['I Nyoman Reta','Ni Ketut Kerti','Wayan Sukasta','Made Sukasti']},[
      {tanggal:'2026-06-18',operator:'Made Sukerta',pekerjaan:'Nelayan',pendidikan:'Tidak Sekolah',penghasilan:700000,jumlahAnggota:4,disabilitas:'Tidak Ada',statusRumah:'Numpang',lantai:'Tanah',dinding:'Bambu/Kayu',atap:'Daun/Rumbia',sumberAir:'Sungai/Hujan',penerangan:'PLN 450 VA',aset:['Perahu'],bansos:'PKH + BPNT'}
    ]);
    mk({id:'w08',noKK:'5108150201010008',nik:'5108151203800008',nama:'I Kadek Yasa',desa:'Desa Penuktukan',dusun:'Banjar Dinas Penuktukan',rt:'002',rw:'001',alamat:'Jl. Pantai Penuktukan',anggota:['I Kadek Yasa','Ni Putu Eni','Gede Restu']},[
      {tanggal:'2025-11-12',operator:'Made Sukerta',pekerjaan:'Tukang Bangunan',pendidikan:'SMP',penghasilan:2000000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor'],bansos:'BPNT'},
      {tanggal:'2026-06-18',operator:'Made Sukerta',pekerjaan:'Tukang Bangunan',pendidikan:'SMP',penghasilan:2400000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','TV'],bansos:'BPNT'}
    ]);
    mk({id:'w09',noKK:'5108150202010009',nik:'5108151807790009',nama:'I Gede Parwata',desa:'Desa Penuktukan',dusun:'Banjar Dinas Kanginan',rt:'001',rw:'002',alamat:'Br. Kanginan',anggota:['I Gede Parwata','Ni Nengah Wari','Kadek Sania','Komang Tris']},[
      {tanggal:'2026-06-19',operator:'Putu Ariani',pekerjaan:'Pedagang',pendidikan:'SMA',penghasilan:2700000,jumlahAnggota:4,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['Sepeda Motor'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w10',noKK:'5108150202010010',nik:'5108152208770010',nama:'I Putu Mertayasa',desa:'Desa Penuktukan',dusun:'Banjar Dinas Kanginan',rt:'002',rw:'002',alamat:'Br. Kanginan Gg. III',anggota:['I Putu Mertayasa','Ni Wayan Rai','Gede Adnyana']},[
      {tanggal:'2025-07-05',operator:'Putu Ariani',pekerjaan:'Sopir',pendidikan:'SMA',penghasilan:2600000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','TV'],bansos:'BPNT'},
      {tanggal:'2026-06-19',operator:'Putu Ariani',pekerjaan:'Wiraswasta',pendidikan:'SMA',penghasilan:5000000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Mobil','Sepeda Motor','Kulkas','TV','AC'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w11',noKK:'5108150203010011',nik:'5108154811900011',nama:'Ni Luh Sukerti',desa:'Desa Penuktukan',dusun:'Banjar Dinas Kawanan',rt:'001',rw:'003',alamat:'Br. Kawanan',anggota:['Ni Luh Sukerti','I Wayan Tama']},[
      {tanggal:'2026-06-19',operator:'Made Sukerta',pekerjaan:'Buruh Tani',pendidikan:'SD',penghasilan:850000,jumlahAnggota:2,disabilitas:'Tidak Ada',statusRumah:'Numpang',lantai:'Tanah',dinding:'Bambu/Kayu',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:[],bansos:'PKH'}
    ]);
    mk({id:'w12',noKK:'5108150203010012',nik:'5108150512720012',nama:'I Komang Wirawan',desa:'Desa Penuktukan',dusun:'Banjar Dinas Kawanan',rt:'002',rw:'003',alamat:'Br. Kawanan No. 1',anggota:['I Komang Wirawan','Ni Kadek Mertini','Gede Bagus','Putu Indah']},[
      {tanggal:'2026-06-19',operator:'Putu Ariani',pekerjaan:'PNS',pendidikan:'S1',penghasilan:8500000,jumlahAnggota:4,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Mobil','Sepeda Motor','Kulkas','TV','AC'],bansos:'Tidak Ada'}
    ]);

    // === Desa Tembok =======================================================
    mk({id:'w13',noKK:'5108150301010013',nik:'5108150301680013',nama:'I Wayan Repot',desa:'Desa Tembok',dusun:'Banjar Dinas Tembok',rt:'001',rw:'001',alamat:'Jl. Tembok-Tejakula',anggota:['I Wayan Repot','Ni Ketut Sari']},[
      {tanggal:'2026-06-20',operator:'Komang Sutarja',pekerjaan:'Buruh Tani',pendidikan:'Tidak Sekolah',penghasilan:650000,jumlahAnggota:2,disabilitas:'Ada',statusRumah:'Numpang',lantai:'Tanah',dinding:'Bambu/Kayu',atap:'Daun/Rumbia',sumberAir:'Sungai/Hujan',penerangan:'PLN 450 VA',aset:[],bansos:'PKH'}
    ]);
    mk({id:'w14',noKK:'5108150301010014',nik:'5108151404810014',nama:'I Nengah Kerti',desa:'Desa Tembok',dusun:'Banjar Dinas Tembok',rt:'002',rw:'001',alamat:'Jl. Tembok No. 22',anggota:['I Nengah Kerti','Ni Wayan Sukern','Kadek Riska']},[
      {tanggal:'2025-10-10',operator:'Made Sukerta',pekerjaan:'Pengrajin',pendidikan:'SMP',penghasilan:1900000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Genteng/Beton',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','TV'],bansos:'BPNT'},
      {tanggal:'2026-06-20',operator:'Made Sukerta',pekerjaan:'Buruh Harian',pendidikan:'SMP',penghasilan:1200000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Setengah Tembok',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:['TV'],bansos:'BPNT'}
    ]);
    mk({id:'w15',noKK:'5108150302010015',nik:'5108154909860015',nama:'Ni Ketut Lasia',desa:'Desa Tembok',dusun:'Banjar Dinas Dukuh',rt:'001',rw:'002',alamat:'Br. Dukuh',anggota:['Ni Ketut Lasia','I Gede Mara','Putu Sentana']},[
      {tanggal:'2026-06-20',operator:'Putu Ariani',pekerjaan:'Tidak Bekerja',pendidikan:'SD',penghasilan:500000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Numpang',lantai:'Tanah',dinding:'Bambu/Kayu',atap:'Seng/Asbes',sumberAir:'Sumur',penerangan:'PLN 450 VA',aset:[],bansos:'PKH + BPNT'}
    ]);
    mk({id:'w16',noKK:'5108150302010016',nik:'5108152610830016',nama:'I Made Suarjana',desa:'Desa Tembok',dusun:'Banjar Dinas Dukuh',rt:'002',rw:'002',alamat:'Br. Dukuh Kaja',anggota:['I Made Suarjana','Ni Luh Armini','Gede Pasek','Kadek Lina']},[
      {tanggal:'2026-06-21',operator:'Putu Ariani',pekerjaan:'Wiraswasta',pendidikan:'SMA',penghasilan:4500000,jumlahAnggota:4,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Mobil','Sepeda Motor','Kulkas','TV'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w17',noKK:'5108150303010017',nik:'5108151712880017',nama:'I Putu Adi',desa:'Desa Tembok',dusun:'Banjar Dinas Ngis',rt:'001',rw:'003',alamat:'Br. Ngis',anggota:['I Putu Adi','Ni Made Yuni','Komang Bayu']},[
      {tanggal:'2026-06-21',operator:'Komang Sutarja',pekerjaan:'Guru Honorer',pendidikan:'S1',penghasilan:2300000,jumlahAnggota:3,disabilitas:'Tidak Ada',statusRumah:'Sewa/Kontrak',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','Kulkas','TV'],bansos:'Tidak Ada'}
    ]);
    mk({id:'w18',noKK:'5108150303010018',nik:'5108150208730018',nama:'I Gede Mangku',desa:'Desa Tembok',dusun:'Banjar Dinas Ngis',rt:'002',rw:'003',alamat:'Br. Ngis Kelod',anggota:['I Gede Mangku','Ni Ketut Warti','Putu Gunawan','Made Lestari','Kadek Ari']},[
      {tanggal:'2025-06-12',operator:'Made Sukerta',pekerjaan:'Petani',pendidikan:'SMA',penghasilan:3000000,jumlahAnggota:5,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Semen',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'Sumur',penerangan:'PLN 900+ VA',aset:['Sepeda Motor','Ternak','TV'],bansos:'Tidak Ada'},
      {tanggal:'2026-06-21',operator:'Made Sukerta',pekerjaan:'Wiraswasta',pendidikan:'SMA',penghasilan:5500000,jumlahAnggota:5,disabilitas:'Tidak Ada',statusRumah:'Milik Sendiri',lantai:'Keramik/Ubin',dinding:'Tembok',atap:'Genteng/Beton',sumberAir:'PDAM/Ledeng',penerangan:'PLN 900+ VA',aset:['Mobil','Sepeda Motor','Ternak','Kulkas','TV','AC'],bansos:'Tidak Ada'}
    ]);

    return W;
  },

  seedSanggahan(){
    return [
      // Diajukan — menunggu diproses
      {id:'s1',wargaId:'w02',tanggalSnapshot:'2026-06-15',pengaju:'Ni Nengah Rauh',nik:'5108154208650002',hubungan:'Warga Bersangkutan',alasan:'Saya memang sudah tidak bekerja tetap, namun masih menerima kiriman dari anak. Mohon ditinjau agar status PKH tetap sesuai kondisi sebenarnya.',status:'Diajukan',tanggalPengajuan:'2026-06-16',tanggalSelesai:'',catatanOperator:''},
      {id:'s2',wargaId:'w13',tanggalSnapshot:'2026-06-20',pengaju:'Kelian Banjar Dinas Tembok',nik:'-',hubungan:'RT/RW',alasan:'Pak I Wayan Repot menyandang disabilitas dan tinggal menumpang. Mohon diprioritaskan untuk bantuan tambahan selain PKH.',status:'Diajukan',tanggalPengajuan:'2026-06-21',tanggalSelesai:'',catatanOperator:''},
      // Diproses
      {id:'s3',wargaId:'w04',tanggalSnapshot:'2026-06-16',pengaju:'I Putu Gde Astawa',nik:'5108151511780004',hubungan:'Warga Bersangkutan',alasan:'Penghasilan usaha saya tercatat naik, namun tahun ini sebenarnya menurun karena sepi pembeli. Mohon verifikasi ulang sebelum status bansos dicabut.',status:'Diproses',tanggalPengajuan:'2026-06-18',tanggalSelesai:'',catatanOperator:''},
      // Diterima
      {id:'s4',wargaId:'w08',tanggalSnapshot:'2026-06-18',pengaju:'I Kadek Yasa',nik:'5108151203800008',hubungan:'Warga Bersangkutan',alasan:'Atap rumah sudah diganti genteng dari hasil bantuan, namun kondisi ekonomi belum membaik. Mohon BPNT tetap dipertahankan.',status:'Diterima',tanggalPengajuan:'2026-06-19',tanggalSelesai:'2026-06-22',catatanOperator:'Hasil verifikasi lapangan menunjukkan kondisi ekonomi keluarga masih layak menerima BPNT. Sanggahan diterima dan status bansos dipertahankan.'},
      // Ditolak
      {id:'s5',wargaId:'w10',tanggalSnapshot:'2026-06-19',pengaju:'I Putu Mertayasa',nik:'5108152208770010',hubungan:'Warga Bersangkutan',alasan:'Mobil yang tercatat adalah kendaraan operasional pinjaman, bukan milik pribadi. Mohon dikeluarkan dari aset agar desil tidak naik.',status:'Ditolak',tanggalPengajuan:'2026-06-20',tanggalSelesai:'2026-06-22',catatanOperator:'Pengecekan STNK menunjukkan kendaraan atas nama yang bersangkutan. Sanggahan ditolak sesuai bukti dokumen.'},
    ];
  },

  // Kritik & saran contoh yang sudah masuk — hanya terlihat oleh Admin di Kotak Saran.
  seedKritik(){
    return [
      {id:'k1',nama:'I Nyoman Lestari',organisasi:'BPD Sambirenteng',isi:'Mohon ditambahkan fitur ekspor daftar warga ke Excel agar memudahkan rekap musyawarah desa.',tanggal:'2026-06-22'},
      {id:'k2',nama:'Karang Taruna Tembok',organisasi:'Karang Taruna',isi:'Tampilan di HP sudah bagus, namun tombol "Ajukan Sanggahan" agak susah ditemukan. Mohon dibuat lebih jelas.',tanggal:'2026-06-21'},
      {id:'k3',nama:'Anonim',organisasi:'-',isi:'Terima kasih, proses sanggah sekarang lebih transparan. Lanjutkan!',tanggal:'2026-06-20'},
    ];
  },

  blankForm(){
    const id='w'+Date.now();
    return { id:id, isNew:true, status:'draft',
      noKK:'', nik:'', nama:'', desa:'Desa Sambirenteng', dusun:'Banjar Dinas Sambirenteng', rt:'', rw:'', alamat:'',
      wilayah:{provinsi:'[51] BALI',kabupaten:'[08] BULELENG',kecamatan:'[090] TEJAKULA',desa:'',klasifikasi:'2. Perdesaan',kodeSls:'',namaSls:'',kodePos:'',namaJalan:'',nomorRumah:''},
      statusKeluarga:'1. Ditemukan', jumlahAnggotaKK:'', alamatSesuaiKK:'',
      geotag:{mode:'2. Input Manual',lat:'',long:'',akurasi:''},
      rumah:{ jumlahKeluarga:'', jenisBangunan:'', statusKepemilikan:'', buktiMilik:'', nilaiSewa:'', luasLantai:'',
        lantaiBahan:'', lantaiKondisi:'', dindingBahan:'', dindingKondisi:'', atapBahan:'', atapKondisi:'',
        fasilitasBAB:'', jenisKloset:'', pembuanganTinja:'', sumberAirMinum:'', sumberPenerangan:'',
        pengeluaranListrik:'', pengeluaranPulsa:'', pengeluaranInternet:'', foto:this.emptyFoto() },
      meteran:[], aset:{tabungGas3:'',tabungGas55:'',kulkas:'',ac:'',emas:'',komputer:'',sepedaMotor:'',nilaiSepedaMotor:'',mobil:'',nilaiMobil:'',lahanLain:'',bangunanLain:''},
      anggota:[this.mkAnggota({no:1,hubungan:'1. Kepala Keluarga'})],
      catatan:'', bansos:'Tidak Ada', desilManual:false, desil:'5', _openIdx:0, _activeBlok:'I', _showRingkasan:false };
  },
  dataToForm(w){
    const clone=JSON.parse(JSON.stringify(w));
    if(!clone.id) clone.id='w'+Date.now();
    // Migrate: if aset was corrupted to an array by an earlier save, rebuild object from array
    if(Array.isArray(clone.aset)){
      const arr=clone.aset;
      clone.aset={tabungGas3:'',tabungGas55:'',kulkas:'',ac:'',emas:'',komputer:'',
        sepedaMotor:'',nilaiSepedaMotor:'',mobil:'',nilaiMobil:'',lahanLain:'',bangunanLain:''};
      if(arr.indexOf('Sepeda Motor')>=0){clone.aset.sepedaMotor=1;clone.aset.nilaiSepedaMotor='';}
      if(arr.indexOf('Mobil')>=0){clone.aset.mobil=1;clone.aset.nilaiMobil='';}
      if(arr.indexOf('Kulkas')>=0) clone.aset.kulkas=1;
      if(arr.indexOf('AC')>=0) clone.aset.ac=1;
    }
    if(clone.anggota&&clone.anggota.length>0){ if(clone.nama) clone.anggota[0].nama=clone.nama; if(clone.nik) clone.anggota[0].nik=clone.nik; }
    return Object.assign(clone,{isNew:false, desilManual:!!w.desilManual, desil:String(w.desil||5), bansos:w.bansos||'Tidak Ada', _openIdx:0, _activeBlok:'I', _showRingkasan:false});
  },
  opName(){ return (this.state&&this.state.auth&&this.state.auth.nama)||this.props.namaOperator||'Budi Santoso'; },

});
