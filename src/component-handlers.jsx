// ---------------------------------------------------------------------------
// Handler layer: navigasi, form FASIH, foto, validasi, simpan, sanggahan.
// Methods dibagi terpisah dari class body utama agar mudah dikelola.
// ---------------------------------------------------------------------------
Object.assign(Component.prototype, {

  nav(key){ this.setState({view:key,form:key==='form'?this.state.form:null,showSanggahanForm:false,processingId:null}); },
  onSearch(e){ this.setState({search:e.target.value}); },
  onFilter(e){ const k=e.target.getAttribute('data-filter'); const o={}; o[k]=e.target.value; this.setState(o); },
  onTambah(){ if(!this.canCrud()) return; this.setState({form:this.blankForm(),editId:null,view:'form'}); },
  mulaiEdit(id){ if(!this.canCrud()) return; const w=this.state.warga.find(x=>x.id===id); this.setState({form:this.dataToForm(w),editId:id,view:'form'}); },
  onBatal(){ this.setState({form:null,editId:null,view:this.state.selectedId?'riwayat':'daftar',confirmModal:null}); },

  // -- Handler form FASIH (nested path) ----------------------------------------
  onFormField(e){ this.setForm(e.target.getAttribute('data-path'), e.target.value); },
  setForm(path,val){ this.setState(s=>({form:setPath(s.form,path,val)})); },
  toggleOpenAnggota(i){ this.setState(s=>({form:setPath(s.form,'_openIdx', s.form._openIdx===i?-1:i)})); },
  tambahAnggota(){ if(!this.canCrud()) return; this.setState(s=>{ const ang=s.form.anggota.slice(); ang.push(this.mkAnggota({no:ang.length+1,hubungan:'3. Anak'})); let f=setPath(s.form,'anggota',ang); return {form:setPath(f,'_openIdx',ang.length-1)}; }); },
  hapusAnggota(i){ if(!this.canCrud()) return;
    const nm=(this.state.form.anggota[i]&&this.state.form.anggota[i].nama)||('Anggota '+(i+1));
    if(window.confirm&&!window.confirm('Hapus "'+nm+'" dari roster anggota? Data yang sudah diisi akan hilang.')) return;
    this.setState(s=>{ let ang=s.form.anggota.slice(); ang.splice(i,1); ang=ang.map((a,j)=>Object.assign({},a,{no:j+1})); let f=setPath(s.form,'anggota',ang); return {form:setPath(f,'_openIdx',Math.max(0,Math.min(s.form._openIdx,ang.length-1)))}; }); },
  setJumlahMeteran(n){ n=Math.max(0,Math.min(10,Number(n)||0));
    const curLen=(this.state.form&&this.state.form.meteran||[]).length;
    if(n<curLen&&window.confirm&&!window.confirm('Mengurangi jumlah meteran akan menghapus '+(curLen-n)+' kartu pengisian. Lanjutkan?')) return;
    this.setState(s=>{ const cur=s.form.meteran.slice(); while(cur.length<n)cur.push({daya:'',jenisId:'ID Pelanggan',idPelanggan:''}); cur.length=n; return {form:setPath(s.form,'meteran',cur)}; }); },

  // -- Navigasi form (sidebar / blok aktif / modal Ringkasan) ------------------
  goBlok(blok,openIdx,anchorPath){
    this.setState(s=>{ let f=setPath(s.form,'_activeBlok',blok); f=setPath(f,'_showRingkasan',false); if(openIdx!=null) f=setPath(f,'_openIdx',openIdx); return {form:f}; });
    if(anchorPath&&typeof document!=='undefined'){ const id='f_'+anchorPath; setTimeout(()=>{ const el=document.getElementById(id); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:'smooth',block:'center'}); },70); }
  },
  goIssue(it){ let openIdx=null; const m=/^anggota\.(\d+)\./.exec(it.path||''); if(m) openIdx=Number(m[1]); this.goBlok(it.blok,openIdx,it.path); },
  toggleRingkasan(v){ this.setState(s=>({form:setPath(s.form,'_showRingkasan',typeof v==='boolean'?v:!s.form._showRingkasan)})); },

  // Progres pengisian: berapa field wajib (yang berlaku) sudah terisi.
  formProgress(k){
    let total=0,filled=0; const E=v=>!(v==null||String(v).trim()===''); const req=v=>{ total++; if(E(v)) filled++; };
    req(k.nama); req(k.nik); req(k.noKK); req(getPath(k,'wilayah.kodePos')); req(getPath(k,'wilayah.namaJalan')); req(k.alamatSesuaiKK); req(k.statusKeluarga);
    BLOK2.concat(BLOK2B).forEach(d=>{ if(d.when&&!d.when(k)) return; req(getPath(k,d.p)); });
    req(getPath(k,'rumah.foto.depan')); req(getPath(k,'rumah.foto.ruangTamu'));
    if(/dengan meteran/.test(getPath(k,'rumah.sumberPenerangan')||'')){ if(!(k.meteran||[]).length){ total++; } (k.meteran||[]).forEach(m=>{ req(m.daya); req(m.idPelanggan); }); }
    ASET22.forEach(a=>req(getPath(k,'aset.'+a[0]))); ASET23.forEach(a=>req(getPath(k,'aset.'+a[0])));
    if(Number(getPath(k,'aset.sepedaMotor'))>0) req(getPath(k,'aset.nilaiSepedaMotor'));
    if(Number(getPath(k,'aset.mobil'))>0) req(getPath(k,'aset.nilaiMobil'));
    (k.anggota||[]).forEach(a=>{ ANGGOTA_FIELDS.forEach(d=>{ if(d.when&&!d.when(k,a)) return; req(a[d.rp]); }); req(a.tglLahir); req(a.blnLahir); req(a.thnLahir);
      DISABILITAS_ITEMS.forEach(it=>req(getPath(a,'disabilitas.'+it[0]))); KESEHATAN_ITEMS.forEach(it=>req(getPath(a,'kesehatan.'+it[0]))); });
    return {total:total, filled:filled, pct: total?Math.round(100*filled/total):0};
  },
  hapusFoto(path){ this.setState(s=>({form:setPath(s.form,path,null)})); },
  handleFoto(path,e){
    const file=e.target.files&&e.target.files[0]; if(!file) return; const before=file.size;
    const reader=new FileReader();
    reader.onload=ev=>{ const img=new Image();
      img.onload=()=>{
        const max=1024; let w=img.width,h=img.height;
        if(w>=h){ if(w>max){h=Math.round(h*max/w);w=max;} } else { if(h>max){w=Math.round(w*max/h);h=max;} }
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        const ctx=c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
        let q=0.7,url=c.toDataURL('image/jpeg',q),bytes=Math.round(url.split(',')[1].length*3/4);
        while(bytes>200000&&q>0.32){q-=0.1;url=c.toDataURL('image/jpeg',q);bytes=Math.round(url.split(',')[1].length*3/4);}
        this.setState(s=>({form:setPath(s.form,path,{src:url,before:before,after:bytes,uploading:this.serverMode()})}));
        if(this.serverMode()) this.uploadFotoServer(path,url,before,bytes);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file); e.target.value='';
  },
  // Unggah foto ke Google Drive (mode server). Pratinjau lokal tampil dahulu,
  // lalu src ditukar ke URL Drive saat sukses. Bila gagal, base64 dipertahankan.
  uploadFotoServer(path,dataUrl,before,after){
    return this.apiCall('uploadFoto',{id:this.state.form&&this.state.form.id,key:path,dataUrl:dataUrl}).then(res=>{
      if(res&&res.ok&&res.url){ this.setState(s=>({form:setPath(s.form,path,{src:res.url,driveId:res.fileId,before:before,after:after})})); return true; }
      this.setState(s=>({form:setPath(s.form,path,{src:dataUrl,before:before,after:after}),toast:{type:'err',msg:'Gagal unggah foto ke Drive: '+((res&&res.error)||'tidak diketahui')+' — tersimpan lokal.'}})); this.autoClear(); return false;
    }).catch(()=>{ this.setState(s=>({form:setPath(s.form,path,{src:dataUrl,before:before,after:after}),toast:{type:'err',msg:'Foto tersimpan lokal — server tak terjangkau.'}})); this.autoClear(); return false; });
  },

  // -- Validasi FASIH: GALAT (blokir finalisasi) / PERINGATAN / KOSONG ----------
  validateKeluarga(k){
    const galat=[],peringatan=[],kosong=[]; const isEmpty=v=>v==null||String(v).trim()==='';
    const add=(arr,blok,r,label,path)=>arr.push({blok:blok,rincian:r,label:label,path:path});
    // Blok I
    if(isEmpty(k.statusKeluarga)) add(galat,'I','16','Status Keberadaan Keluarga','statusKeluarga');
    const ditemukan=/^1\. Ditemukan/.test(k.statusKeluarga||'');
    if(ditemukan){
      if(isEmpty(k.nama)) add(galat,'I','1a','Nama Kepala Keluarga','nama');
      if(!/^\d{16}$/.test(String(k.nik||''))) add(galat,'I','1b','NIK Kepala Keluarga harus 16 digit angka','nik');
      if(!/^\d{16}$/.test(String(k.noKK||''))) add(galat,'I','1c','No. Kartu Keluarga harus 16 digit angka','noKK');
      if(isEmpty(getPath(k,'wilayah.kodePos'))) add(galat,'I','3f','Kode Pos','wilayah.kodePos');
      if(isEmpty(getPath(k,'wilayah.namaJalan'))) add(galat,'I','3j','Nama Jalan','wilayah.namaJalan');
      if(isEmpty(k.alamatSesuaiKK)) add(galat,'I','4','Kesesuaian alamat dengan KK','alamatSesuaiKK');
      if(isEmpty(getPath(k,'geotag.lat'))||isEmpty(getPath(k,'geotag.long'))) add(kosong,'I','3l','Geotagging lokasi (lat/long)','geotag.lat');
    }
    // Blok II
    BLOK2.concat(BLOK2B).forEach(d=>{
      if(d.when&&!d.when(k)) return; const v=getPath(k,d.p);
      if(d.req&&isEmpty(v)) add(galat,'II',d.r,d.label,d.p);
      else if(d.p==='rumah.luasLantai'&&!isEmpty(v)&&Number(v)<=0) add(galat,'II','9','Luas lantai harus lebih dari 0',d.p);
    });
    if(!getPath(k,'rumah.foto.depan')) add(galat,'II','21a','Foto tampak depan rumah','rumah.foto.depan');
    if(!getPath(k,'rumah.foto.ruangTamu')) add(galat,'II','21b','Foto ruang tamu','rumah.foto.ruangTamu');
    if(!getPath(k,'rumah.foto.kamarMandi')) add(kosong,'II','21c','Foto kamar mandi','rumah.foto.kamarMandi');
    const pakaiMeteran=/dengan meteran/.test(getPath(k,'rumah.sumberPenerangan')||'');
    if(pakaiMeteran){
      if(!(k.meteran&&k.meteran.length)) add(galat,'II','18a','Jumlah meteran listrik minimal 1','rumah.sumberPenerangan');
      (k.meteran||[]).forEach((m,i)=>{
        if(isEmpty(m.daya)) add(galat,'II','18b','Daya terpasang meteran ke-'+(i+1),'meteran.'+i+'.daya');
        const digits=/No Meteran/.test(m.jenisId||'')?11:12;
        if(isEmpty(m.idPelanggan)) add(galat,'II','18c','ID Pelanggan/No Meteran ke-'+(i+1),'meteran.'+i+'.idPelanggan');
        else if(!new RegExp('^\\d{'+digits+'}$').test(String(m.idPelanggan))) add(galat,'II','18c','Meteran ke-'+(i+1)+': '+(/No Meteran/.test(m.jenisId||'')?'No Meteran':'ID Pelanggan')+' harus '+digits+' digit','meteran.'+i+'.idPelanggan');
      });
    }
    // Blok III
    ASET22.forEach(a=>{ if(isEmpty(getPath(k,'aset.'+a[0]))) add(galat,'III','22','Jumlah '+a[1],'aset.'+a[0]); });
    if(Number(getPath(k,'aset.sepedaMotor'))>0&&isEmpty(getPath(k,'aset.nilaiSepedaMotor'))) add(galat,'III','22g','Total nilai aset sepeda motor','aset.nilaiSepedaMotor');
    if(Number(getPath(k,'aset.mobil'))>0&&isEmpty(getPath(k,'aset.nilaiMobil'))) add(galat,'III','22h','Total nilai aset mobil','aset.nilaiMobil');
    ASET23.forEach(a=>{ if(isEmpty(getPath(k,'aset.'+a[0]))) add(galat,'III','23','Jumlah '+a[1],'aset.'+a[0]); });
    // Blok IV
    const ang=k.anggota||[]; if(!ang.length) add(galat,'IV','24','Minimal satu anggota keluarga','anggota');
    let nKepala=0;
    ang.forEach((a,i)=>{ const base='anggota.'+i+'.'; const nm=a.nama||('Anggota '+(i+1));
      ANGGOTA_FIELDS.forEach(d=>{ if(d.when&&!d.when(k,a)) return; const v=a[d.rp];
        if(d.req&&isEmpty(v)) add(galat,'IV',d.r,d.label+' — '+nm,base+d.rp);
        else if(d.digits&&!isEmpty(v)&&!new RegExp('^\\d{'+d.digits+'}$').test(String(v))) add(galat,'IV',d.r,nm+': NIK harus '+d.digits+' digit angka',base+d.rp);
      });
      if(isEmpty(a.tglLahir)||isEmpty(a.blnLahir)||isEmpty(a.thnLahir)) add(galat,'IV','30','Tanggal/Bulan/Tahun lahir — '+nm,base+'thnLahir');
      DISABILITAS_ITEMS.forEach(it=>{ if(isEmpty(getPath(a,'disabilitas.'+it[0]))) add(galat,'IV','38',it[1]+' — '+nm,base+'disabilitas.'+it[0]); });
      KESEHATAN_ITEMS.forEach(it=>{ if(isEmpty(getPath(a,'kesehatan.'+it[0]))) add(galat,'IV','39',it[1]+' — '+nm,base+'kesehatan.'+it[0]); });
      if(/^1\. Kepala Keluarga/.test(a.hubungan||'')) nKepala++;
    });
    if(ang.length){
      if(nKepala===0) add(galat,'IV','32','Harus ada tepat satu Kepala Keluarga','anggota.0.hubungan');
      else if(nKepala>1) add(galat,'IV','32','Kepala Keluarga lebih dari satu ('+nKepala+')','anggota.0.hubungan');
      const krt=ang.find(a=>/^1\. Kepala/.test(a.hubungan||'')); const pas=ang.find(a=>/^2\. Istri\/Suami/.test(a.hubungan||''));
      if(krt&&pas&&krt.jk&&pas.jk&&krt.jk===pas.jk) add(galat,'IV','29','Jenis kelamin Kepala Keluarga & pasangan harus berbeda','anggota.'+ang.indexOf(pas)+'.jk');
      if(!isEmpty(k.jumlahAnggotaKK)&&Number(k.jumlahAnggotaKK)!==ang.length) add(peringatan,'IV','2b','Jumlah anggota hasil pendataan ('+ang.length+') ≠ jumlah di KK ('+k.jumlahAnggotaKK+')','anggota');
    }
    if(isEmpty(k.catatan)) add(kosong,'V','-','Catatan','catatan');
    return {galat:galat,peringatan:peringatan,kosong:kosong};
  },
  canFinalize(k){ return this.validateKeluarga(k||this.state.form).galat.length===0; },
  konfirmasiSimpan(type){
    if(!this.canCrud()) return;
    const f=this.state.form;
    if(!f||!f.nama||!f.nama.trim()){ this.setState({toast:{type:'err',msg:'Nama Kepala Keluarga wajib diisi untuk menyimpan.'}}); this.autoClear(); return; }
    if(type==='final'){
      const v=this.validateKeluarga(f);
      if(v.galat.length>0){ this.setState({toast:{type:'err',msg:'Belum bisa difinalisasi: masih ada '+v.galat.length+' GALAT yang harus diperbaiki.'}}); this.autoClear(); return; }
    }
    this.setState({confirmModal:{type:type}});
  },
  batalKonfirmasi(){ this.setState({confirmModal:null}); },
  bukaRiwayat(id){ const w=this.state.warga.find(x=>x.id===id); const last=w.snapshots[w.snapshots.length-1].tanggal; this.setState({view:'riwayat',selectedId:id,selectedTanggal:last,showSanggahanForm:false}); },
  pilihTanggal(t){ this.setState({selectedTanggal:t,showSanggahanForm:false}); },
  onKembali(){ this.setState({view:'daftar',selectedId:null,selectedTanggal:null,showSanggahanForm:false}); },
  autoClear(){ clearTimeout(this._t); this._t=setTimeout(()=>this.setState({toast:null}),3600); },

  // Simpan keluarga. status='draft' selalu boleh (tersimpan langsung ke
  // spreadsheet/lokal); status='final' hanya bila GALAT=0 (gerbang submit).
  simpanKeluarga(status){
    if(!this.canCrud()) return;
    const f=this.state.form;
    if(!f.nama||!f.nama.trim()){ this.setState({toast:{type:'err',msg:'Nama Kepala Keluarga wajib diisi untuk menyimpan.'}}); this.autoClear(); return; }
    if(status==='final'){
      const v=this.validateKeluarga(f);
      if(v.galat.length>0){ this.setState({toast:{type:'err',msg:'Belum bisa difinalisasi: masih ada '+v.galat.length+' GALAT yang harus diperbaiki.'}}); this.autoClear(); return; }
    }
    const today=this.state.today, operator=this.opName();
    const summary=this.deriveSummary(f);
    const foto=Object.assign({},(f.rumah&&f.rumah.foto)||this.emptyFoto());
    const struct=JSON.parse(JSON.stringify(f)); delete struct.isNew; delete struct._openIdx; delete struct._activeBlok; delete struct._showRingkasan;
    const identity={id:f.id,noKK:f.noKK,nik:f.nik,nama:f.nama,desa:f.desa,dusun:f.dusun,rt:f.rt,rw:f.rw,alamat:f.alamat};
    const base=Object.assign({},struct,identity,summary,{status:status,foto:foto,jumlahAnggotaKK:f.jumlahAnggotaKK||summary.jumlahAnggota,aset:struct.aset});
    this.setState(s=>{
      const warga=s.warga.slice(); const idx=warga.findIndex(w=>w.id===f.id); const baru=idx<0;
      if(baru){ warga.push(Object.assign({},base,{snapshots:[{tanggal:today,operator:operator,data:summary,foto:foto,fieldYangBerubah:[]}]})); }
      else {
        const w=warga[idx]; let snaps=w.snapshots.slice();
        const before=snaps.filter(x=>x.tanggal<today).sort((a,b)=>a.tanggal<b.tanggal?1:-1)[0];
        const diff=before?this.computeDiff(before.data,summary):[];
        const snap={tanggal:today,operator:operator,data:summary,foto:foto,fieldYangBerubah:diff};
        const si=snaps.findIndex(x=>x.tanggal===today);
        if(si>=0)snaps[si]=snap; else snaps.push(snap);
        snaps.sort((a,b)=>a.tanggal<b.tanggal?-1:1);
        warga[idx]=Object.assign({},w,base,{snapshots:snaps});
      }
      const lab=status==='final'?'difinalisasi (Final)':'disimpan sebagai draf';
      const msg=(baru?'Keluarga baru ':'Perubahan ')+lab+'. Snapshot '+this.formatTanggal(today)+'.';
      return {warga:warga,view:'riwayat',selectedId:f.id,selectedTanggal:today,form:null,editId:null,confirmModal:null,toast:{type:'ok',msg:msg}};
    },()=>{ const w=this.state.warga.find(x=>x.id===f.id); if(w) this.push('saveWarga',{warga:w}); });
    this.autoClear();
  },

  onSanggahanChange(e){ const k=e.target.getAttribute('data-sgfield'); const v=e.target.value; this.setState(s=>({sanggahanForm:Object.assign({},s.sanggahanForm,{[k]:v})})); },
  onBukaFormSanggahan(){ if(!this.canCrud()) return; this.setState({showSanggahanForm:true,sanggahanForm:{pengaju:'',nik:'',hubungan:'Warga Bersangkutan',alasan:''}}); },
  onTutupFormSanggahan(){ this.setState({showSanggahanForm:false}); },
  onSubmitSanggahan(){
    if(!this.canCrud()) return;
    const f=this.state.sanggahanForm;
    if(!f.pengaju.trim()||!f.alasan.trim()){ this.setState({toast:{type:'err',msg:'Nama pengaju dan alasan sanggahan wajib diisi.'}}); this.autoClear(); return; }
    const newSg={id:'s'+Date.now(),wargaId:this.state.selectedId,tanggalSnapshot:this.state.selectedTanggal,pengaju:f.pengaju,nik:f.nik||'-',hubungan:f.hubungan,alasan:f.alasan,status:'Diajukan',tanggalPengajuan:this.state.today,tanggalSelesai:'',catatanOperator:''};
    this.setState(s=>({sanggahan:[...s.sanggahan,newSg],showSanggahanForm:false,sanggahanForm:{pengaju:'',nik:'',hubungan:'Warga Bersangkutan',alasan:''},toast:{type:'ok',msg:'Sanggahan berhasil diajukan dan masuk antrean proses.'}}));
    this.push('submitSanggahan',{sanggahan:newSg});
    this.autoClear();
  },
  updateStatus(id,status){ if(!this.canCrud()) return; this.setState(s=>({sanggahan:s.sanggahan.map(x=>x.id===id?Object.assign({},x,{status:status}):x)})); this.push('updateSanggahan',{id:id,status:status}); },
  mulaiProses(id){ if(!this.canCrud()) return; this.setState({processingId:id,processCatatan:''}); },
  selesaikanSanggahan(id,status,catatan){ if(!this.canCrud()) return; const tgl=this.state.today; this.setState(s=>({sanggahan:s.sanggahan.map(x=>x.id===id?Object.assign({},x,{status:status,catatanOperator:catatan,tanggalSelesai:s.today}):x),processingId:null,processCatatan:''})); this.push('updateSanggahan',{id:id,status:status,catatanOperator:catatan,tanggalSelesai:tgl}); },

});
