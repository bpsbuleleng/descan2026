// Render layer (renderVals, renderLogin, field, yt, renderForm, render).
// Concatenated LAST by build.js — depends on utils.js, schema.js, component.jsx,
// component-data.jsx, component-handlers.jsx.
Object.assign(Component.prototype, {
  renderVals(){
    const st=this.state;
    const auth=st.auth;
    const canCrud=this.canCrud();
    const namaDesa=this.props.namaDesa||'Kec. Tejakula, Buleleng';
    const namaOperator=this.opName();
    const opInitials=namaOperator.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    // Lingkup data: Kepala SLS hanya melihat warga & sanggahan di wilayahnya.
    const vWarga=this.visibleWarga();
    const vIds={}; vWarga.forEach(w=>{vIds[w.id]=true;});
    const vSanggahan=st.sanggahan.filter(sg=>vIds[sg.wargaId]);
    const sanggahanPending=vSanggahan.filter(s=>s.status==='Diajukan'||s.status==='Diproses').length;
    const titles={dashboard:'Dashboard',daftar:'Daftar Warga',form:(st.form&&!st.form.isNew)?'Edit Data':'Tambah Data',riwayat:'Riwayat Perubahan',sanggahan:'Usul Sanggah'};

    const mkNav=(key,label)=>{ const active=st.view===key||(key==='daftar'&&(st.view==='form'||st.view==='riwayat')); return {label:label,onClick:()=>this.nav(key),style:'padding:0 18px;height:46px;font-family:inherit;font-size:13.5px;font-weight:'+(active?'700':'500')+';border:none;border-bottom:2px solid '+(active?'#1e50d0':'transparent')+';background:transparent;cursor:pointer;color:'+(active?'#1e50d0':'#52576b')+';white-space:nowrap;'}; };
    const sanggahanLabel='Sanggahan'+(sanggahanPending>0?' ('+sanggahanPending+')':'');
    const navItems=[mkNav('dashboard','Dashboard'),mkNav('daftar','Daftar Warga'),mkNav('sanggahan',sanggahanLabel)];

    const q=st.search.trim().toLowerCase();
    let list=vWarga.filter(w=>{
      if(q&&(w.nama+' '+w.nik+' '+w.noKK).toLowerCase().indexOf(q)<0) return false;
      if(st.filterDesa!=='semua'&&w.desa!==st.filterDesa) return false;
      if(st.filterRt!=='semua'&&('RT '+w.rt+' / RW '+w.rw)!==st.filterRt) return false;
      if(st.filterDesil!=='semua'){ if(st.filterDesil==='prioritas'){if(w.desil>4)return false;} else if(String(w.desil)!==st.filterDesil)return false; }
      if(st.filterBansos!=='semua'&&w.bansos!==st.filterBansos) return false;
      return true;
    });
    const wargaTampil=list.map(w=>{ const ds=this.getDS(w.desil); const bs=this.bansosStyle(w.bansos); const last=w.snapshots[w.snapshots.length-1]; const pt=last.fieldYangBerubah.length;
      const draf=w.status==='draft';
      return {id:w.id,nama:w.nama,nik:'NIK '+w.nik,rtRw:'RT '+w.rt+' / RW '+w.rw,dusun:w.dusun,desa:w.desa||'',pekerjaan:w.pekerjaan,penghasilan:this.rupiah(w.penghasilan)+' /bln',
        desilLabel:'Desil '+w.desil, desilBadgeStyle:'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;color:'+ds.text+';background:'+ds.bg+';',
        bansos:w.bansos, bansosBadgeStyle:'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;color:'+bs.text+';background:'+bs.bg+';',
        isDraf:draf, statusLabel:draf?'Draf':'Final', statusBadgeStyle:'display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;color:'+(draf?'#92400e':'#166534')+';background:'+(draf?'#fef3c7':'#dcfce7')+';border:1px solid '+(draf?'#fde68a':'#bbf7d0')+';',
        jumlahTanggal:w.snapshots.length, adaPerubahanTerakhir:pt>0, perubahanTerakhirStr:pt+' field berubah',
        onLihat:()=>this.bukaRiwayat(w.id), onEdit:()=>this.mulaiEdit(w.id), onHover:(e)=>{e.currentTarget.style.background='#f9f9f7';}, onLeave:(e)=>{e.currentTarget.style.background='';}}; });
    const desaSet=[]; vWarga.forEach(w=>{ if(w.desa&&desaSet.indexOf(w.desa)<0)desaSet.push(w.desa); }); desaSet.sort();
    const desaOptions=[{value:'semua',label:'Semua Desa'}].concat(desaSet.map(v=>({value:v,label:v})));
    const rtSet=[]; vWarga.forEach(w=>{const v='RT '+w.rt+' / RW '+w.rw; if(rtSet.indexOf(v)<0)rtSet.push(v);}); rtSet.sort();
    const rtOptions=[{value:'semua',label:'Semua RT/RW'}].concat(rtSet.map(v=>({value:v,label:v})));
    const desilFilterOpts=[{value:'semua',label:'Semua Desil'},{value:'prioritas',label:'Prioritas (1–4)'}]; for(let d=1;d<=10;d++) desilFilterOpts.push({value:String(d),label:'Desil '+d});
    const bansosFilterOpts=[{value:'semua',label:'Semua Bansos'},{value:'PKH',label:'PKH'},{value:'BPNT',label:'BPNT'},{value:'PKH + BPNT',label:'PKH + BPNT'},{value:'Tidak Ada',label:'Tidak Ada'}];
    const sgFilterOpts=[{value:'semua',label:'Semua Status'},{value:'Diajukan',label:'Diajukan'},{value:'Diproses',label:'Diproses'},{value:'Diterima',label:'Diterima'},{value:'Ditolak',label:'Ditolak'}];

    const all=vWarga;
    const statTotal=all.length, statPrioritas=all.filter(w=>w.desil<=4).length, statBansos=all.filter(w=>w.bansos!=='Tidak Ada').length;
    const counts=[]; for(let d=1;d<=10;d++) counts.push(all.filter(w=>w.desil===d).length);
    const maxC=Math.max(1,Math.max.apply(null,counts));
    const desilBars=counts.map((c,i)=>{ const d=i+1; const ds=this.getDS(d); const hh=c>0?Math.max(8,Math.round(c/maxC*148)):3;
      return {desil:d,count:c,barStyle:'width:76%;border-radius:5px 5px 0 0;height:'+hh+'px;background:'+ds.solid+';',numStyle:'font-size:11px;font-weight:700;color:'+(d<=4?'#c2410c':'#9ba2b6')+';'}; });
    const perubahanList=[];
    all.forEach(w=>{ if(w.snapshots.length>=2){ const a=w.snapshots[w.snapshots.length-2].data.desil; const b=w.snapshots[w.snapshots.length-1].data.desil; if(a!==b){ const naik=b>a;
      perubahanList.push({nama:w.nama,desilText:'Desil '+a+' → '+b,dampak:naik?'Berisiko keluar dari daftar bansos':'Berpotensi masuk daftar bansos',icon:naik?'↑':'↓',
        rowStyle:'display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;background:'+(naik?'#fff7f5':'#f0f5ff')+';border:1px solid '+(naik?'#fcd8d0':'#c9d9f7')+';',
        iconStyle:'flex:none;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;background:'+(naik?'#dc4a35':'#1e50d0')+';',
        dampakStyle:'font-size:11px;font-weight:700;color:'+(naik?'#b91c1c':'#1d4ed8')+';'}); } } });

    let form=st.form, formDesilLabel='', formDesilStyle='', formDesilHint='', validasi={galat:[],peringatan:[],kosong:[]}, canFinalize=false;
    if(form){
      const fd=form.desilManual?Number(form.desil||5):this.hitungDesil(this.deriveDesilInputs(form));
      const ds=this.getDS(fd); formDesilLabel='Desil '+fd;
      formDesilStyle='display:inline-flex;align-items:center;padding:8px 18px;border-radius:20px;font-size:18px;font-weight:800;color:'+ds.text+';background:'+ds.bg+';';
      formDesilHint=form.desilManual?'(input manual)':'dihitung otomatis dari isian';
      validasi=this.validateKeluarga(form); canFinalize=validasi.galat.length===0;
    }

    let riwayatWarga=null, snapshotList=[], selectedSnap=null;
    const rw=st.warga.find(w=>w.id===st.selectedId);
    if(rw){ const ds=this.getDS(rw.desil); const bs=this.bansosStyle(rw.bansos);
      riwayatWarga={nama:rw.nama,nik:'NIK '+rw.nik,noKK:'No. KK '+rw.noKK,rtRw:'RT '+rw.rt+' / RW '+rw.rw+' · '+rw.dusun+(rw.desa?' · '+rw.desa:''),
        desilLabel:'Desil '+rw.desil, desilStyle:'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:700;color:'+ds.text+';background:'+ds.bg+';',
        bansosStyle:'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:600;color:'+bs.text+';background:'+bs.bg+';', bansos:rw.bansos, onEdit:()=>this.mulaiEdit(rw.id)};
      const earliest=rw.snapshots.slice().sort((a,b)=>a.tanggal<b.tanggal?-1:1)[0].tanggal;
      const sorted=rw.snapshots.slice().sort((a,b)=>a.tanggal<b.tanggal?1:-1);
      snapshotList=sorted.map(sn=>{ const active=sn.tanggal===st.selectedTanggal; const ds2=this.getDS(sn.data.desil); const np=sn.fieldYangBerubah.length; const awal=sn.tanggal===earliest;
        return {tanggalStr:this.formatTanggal(sn.tanggal),operator:'oleh '+sn.operator,desilLabel:'Desil '+sn.data.desil,
          desilStyle:'display:inline-flex;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;color:'+ds2.text+';background:'+ds2.bg+';',
          metaStr:awal?'Snapshot awal':(np>0?np+' field berubah':'Tidak ada perubahan'),
          metaStyle:'font-size:11.5px;font-weight:700;color:'+(awal?'#9ba2b6':(np>0?'#b45309':'#9ba2b6'))+';',
          onClick:()=>this.pilihTanggal(sn.tanggal),
          rowStyle:'display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;border:none;cursor:pointer;padding:12px 14px;border-radius:10px;font-family:inherit;background:'+(active?'#eef2fc':'transparent')+';border-left:3px solid '+(active?'#1e50d0':'transparent')+';transition:background 0.15s,border-color 0.15s;'}; });
      const snap=rw.snapshots.find(s=>s.tanggal===st.selectedTanggal)||sorted[0];
      if(snap){
        const ch={}; snap.fieldYangBerubah.forEach(x=>{ch[x.label]=true;}); const ks=this.diffKeys();
        const dataRows=ks.map(k=>{ const c=!!ch[k[1]]; return {label:k[1],value:this.fmtVal(k[0],snap.data[k[0]]),cellStyle:'display:flex;flex-direction:column;gap:3px;padding:11px 13px;background:'+(c?'#fffbf0':'#fff')+';',valueStyle:'font-size:13px;font-weight:'+(c?'700':'600')+';color:'+(c?'#92400e':'#2c3442')+';'}; });
        const sl=[['depan','Tampak Depan'],['ruangTamu','Ruang Tamu'],['kamarMandi','Kamar Mandi']];
        const snapFoto=sl.map(s=>{ const ft=snap.foto[s[0]]; const has=!!(ft&&ft.src); return {label:s[1],hasFoto:has,kosong:!has,src:has?ft.src:''}; });
        const sgForSnap=st.sanggahan.filter(sg=>sg.wargaId===rw.id&&sg.tanggalSnapshot===snap.tanggal);
        const sgForSnapDisplay=sgForSnap.map(sg=>{ const ss=this.sgStatusStyle(sg.status); return {pengaju:sg.pengaju,hubungan:sg.hubungan,alasan:sg.alasan,status:sg.status,tanggalPengajuanStr:this.formatTanggal(sg.tanggalPengajuan),statusStyle:'display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:700;color:'+ss.text+';background:'+ss.bg+';',snapCardStyle:'background:#fafaf9;border:1px solid #e8e8e6;border-radius:10px;padding:12px 14px;'}; });
        selectedSnap={tanggalStr:this.formatTanggal(snap.tanggal),operator:'Diubah oleh '+snap.operator,adaPerubahan:snap.fieldYangBerubah.length>0,snapAwal:snap.tanggal===earliest,jumlahPerubahan:snap.fieldYangBerubah.length+' perubahan',diffList:snap.fieldYangBerubah,dataRows:dataRows,snapFoto:snapFoto,jumlahSanggahan:sgForSnap.length>0?sgForSnap.length+' sanggahan':''};
        Object.defineProperty(selectedSnap,'sanggahanList',{value:sgForSnapDisplay,enumerable:true});
      }
    }

    const sanggahanForSnap=selectedSnap&&selectedSnap.sanggahanList ? selectedSnap.sanggahanList : [];
    const canAjukanSanggahan=!st.showSanggahanForm;

    const sgFiltered=vSanggahan.filter(sg=>st.filterSanggahan==='semua'||sg.status===st.filterSanggahan);
    const sanggahanListDisplay=sgFiltered.map(sg=>{ const wg=st.warga.find(w=>w.id===sg.wargaId); const ss=this.sgStatusStyle(sg.status); const isProcessing=st.processingId===sg.id; const canProses=sg.status==='Diajukan'; const canSelesai=sg.status==='Diproses'&&!isProcessing; const isSelesai=sg.status==='Diterima'||sg.status==='Ditolak'; const showActions=!isSelesai&&!isProcessing;
      return {id:sg.id,wargaNama:wg?wg.nama:'—',tanggalSnapshotStr:this.formatTanggal(sg.tanggalSnapshot),tanggalPengajuanStr:this.formatTanggal(sg.tanggalPengajuan),tanggalSelesaiStr:sg.tanggalSelesai?this.formatTanggal(sg.tanggalSelesai):'',pengaju:sg.pengaju,nik:sg.nik,hubungan:sg.hubungan,alasan:sg.alasan,status:sg.status,catatanOperator:sg.catatanOperator,adaCatatan:!!sg.catatanOperator,statusStyle:'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;color:'+ss.text+';background:'+ss.bg+';',isProcessing,canProses,canSelesai,showActions,isSelesai,processCatatan:isProcessing?st.processCatatan:'',
        onTandaiProses:()=>this.updateStatus(sg.id,'Diproses'),onTolakLangsung:()=>this.selesaikanSanggahan(sg.id,'Ditolak',''),onMulaiSelesai:()=>this.mulaiProses(sg.id),onBatalProses:()=>this.setState({processingId:null}),onTerima:()=>this.selesaikanSanggahan(sg.id,'Diterima',st.processCatatan),onTolak:()=>this.selesaikanSanggahan(sg.id,'Ditolak',st.processCatatan),onProcessCatatan:(e)=>this.setState({processCatatan:e.target.value})}; });

    let toastStyle='';
    if(st.toast){ const ok=st.toast.type!=='err'; toastStyle='position:fixed;right:20px;bottom:20px;z-index:60;padding:13px 18px;border-radius:12px;font-size:13px;font-weight:600;color:#fff;max-width:380px;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:tslide 0.25s ease;background:'+(ok?'#16a34a':'#dc2626')+';'; }

    return {
      auth:auth, canCrud:canCrud, roleLabel:auth?auth.role:'', wilayahLabel:auth&&auth.wilayah?auth.wilayah:'', serverMode:this.serverMode(),
      namaDesa:namaDesa, namaOperator:namaOperator, opInitials:opInitials, pageTitle:titles[st.view], tanggalHariIni:this.formatTanggal(st.today),
      navItems:navItems, isDashboard:st.view==='dashboard', isDaftar:st.view==='daftar', isForm:st.view==='form', isRiwayat:st.view==='riwayat', isSanggahan:st.view==='sanggahan',
      search:st.search, filterDesa:st.filterDesa, filterRt:st.filterRt, filterDesil:st.filterDesil, filterBansos:st.filterBansos, filterSanggahan:st.filterSanggahan,
      onSearch:(e)=>this.onSearch(e), onFilter:(e)=>this.onFilter(e), onTambah:()=>this.onTambah(),
      desaOptions:desaOptions, rtOptions:rtOptions, desilFilterOpts:desilFilterOpts, bansosFilterOpts:bansosFilterOpts, sgFilterOpts:sgFilterOpts,
      wargaTampil:wargaTampil, kosong:wargaTampil.length===0, jumlahTampil:wargaTampil.length, jumlahTotal:vWarga.length,
      statTotal:statTotal, statPrioritas:statPrioritas, statBansos:statBansos, statPerubahan:perubahanList.length, statSanggahan:sanggahanPending,
      desilBars:desilBars, perubahanList:perubahanList, tidakAdaPerubahan:perubahanList.length===0,
      form:form,
      formDesilLabel:formDesilLabel, formDesilStyle:formDesilStyle, formDesilHint:formDesilHint,
      validasi:validasi, canFinalize:canFinalize,
      onSimpanDraf:()=>this.konfirmasiSimpan('draft'), onFinalisasi:()=>this.konfirmasiSimpan('final'), onBatal:()=>this.onBatal(),
      riwayatWarga:riwayatWarga, snapshotList:snapshotList,
      selectedSnap:selectedSnap||{tanggalStr:'',operator:'',adaPerubahan:false,snapAwal:false,jumlahPerubahan:'',diffList:[],dataRows:[],snapFoto:[],jumlahSanggahan:''},
      sanggahanForSnap:sanggahanForSnap, showSanggahanForm:st.showSanggahanForm, sanggahanForm:st.sanggahanForm, canAjukanSanggahan:canAjukanSanggahan,
      onBukaFormSanggahan:()=>this.onBukaFormSanggahan(), onTutupFormSanggahan:()=>this.onTutupFormSanggahan(), onSanggahanChange:(e)=>this.onSanggahanChange(e), onSubmitSanggahan:()=>this.onSubmitSanggahan(),
      sanggahanListDisplay:sanggahanListDisplay, sgKosong:sanggahanListDisplay.length===0,
      onKembali:()=>this.onKembali(), toast:st.toast, toastStyle:toastStyle,
      confirmModal:st.confirmModal, onBatalKonfirmasi:()=>this.batalKonfirmasi(), onKonfirmasiOk:()=>{ if(st.confirmModal) this.simpanKeluarga(st.confirmModal.type); }
    };
  },

  renderLogin(){
    const lf=this.state.loginForm;
    const inpL='width:100%;padding:11px 13px;border:1.5px solid #e0e0de;border-radius:9px;font-family:inherit;font-size:14px;color:#18191f;background:#fafaf9;';
    const labL='display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:6px;';
    const demo=[
      {r:'Kepala Desa',u:'kepaladesa',p:'desa123',note:'CRUD penuh'},
      {r:'Operator',u:'operator',p:'operator123',note:'CRUD penuh'},
      {r:'Kepala SLS',u:'sls.tembok',p:'sls123',note:'Hanya-lihat · B.D. Tembok'}
    ];
    return (
      <div style={css("min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:#f5f5f2; font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:#18191f;")}>
        <div style={css('width:100%; max-width:400px; display:flex; flex-direction:column; gap:16px;')}>
          <div style={css('display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center;')}>
            <div style={css('width:48px; height:48px; border-radius:13px; background:#1e50d0; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:#fff; letter-spacing:-0.03em;')}>DT</div>
            <div>
              <div style={css('font-size:19px; font-weight:800; letter-spacing:-0.02em;')}>DTSEN Desa</div>
              <div style={css('font-size:12.5px; color:#9ba2b6; margin-top:2px;')}>Masuk untuk mengelola data desa</div>
            </div>
          </div>
          <form onSubmit={(e)=>this.login(e)} style={css('background:#fff; border-radius:14px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:14px;')}>
            <div><label style={css(labL)}>Username</label><input data-login="username" value={lf.username} onChange={(e)=>this.onLoginField(e)} autoFocus placeholder="mis. operator" style={css(inpL)} /></div>
            <div><label style={css(labL)}>Kata Sandi</label><input data-login="password" type="password" value={lf.password} onChange={(e)=>this.onLoginField(e)} placeholder="••••••" style={css(inpL)} /></div>
            {lf.error && (
              <div style={css('font-size:12.5px; font-weight:600; color:#b91c1c; background:#fef2f2; border:1px solid #fca5a5; border-radius:8px; padding:9px 12px;')}>{lf.error}</div>
            )}
            <button type="submit" style={css('padding:12px; font-family:inherit; font-size:14px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:9px; cursor:pointer; margin-top:2px;')}>Masuk</button>
          </form>
          <div style={css('background:#fff; border-radius:14px; padding:16px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')}>
            <div style={css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px;')}>Akun Demo</div>
            <div style={css('display:flex; flex-direction:column; gap:8px;')}>
              {demo.map((d,i)=>(
                <div key={i} style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:12.5px;')}>
                  <div style={css('display:flex; flex-direction:column; gap:1px;')}>
                    <span style={css('font-weight:700; color:#18191f;')}>{d.r}</span>
                    <span style={css('font-size:11px; color:#9ba2b6;')}>{d.note}</span>
                  </div>
                  <span style={css('font-family:Menlo,monospace; font-size:11.5px; color:#52576b; background:#f5f5f2; padding:4px 9px; border-radius:7px; white-space:nowrap;')}>{d.u} / {d.p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={css('text-align:center; font-size:11px; font-weight:700; color:#92400e; letter-spacing:0.03em;')}>PROTOTYPE · autentikasi demo sisi-klien</div>
        </div>
      </div>
    );
  },

  // -- Render satu field FASIH (label kiri | kontrol kanan) ---------------------
  field(o){
    const inp='width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;';
    let control;
    if(o.type==='radio'){
      control=(<div style={css('display:flex;flex-direction:column;gap:6px;')}>
        {o.opts.map((opt,i)=>{ const on=o.value===opt; return (
          <label key={i} onClick={()=>this.setForm(o.p,opt)} style={css('display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:8px;cursor:pointer;font-size:13px;border:1.5px solid '+(on?'#f3cba8':'#ececea')+';background:'+(on?ORANGE_BG:'#fff')+';color:'+(on?'#9a4a12':'#3d4152')+';font-weight:'+(on?'700':'500')+';transition:background 0.13s,border-color 0.13s,color 0.13s;')}>
            <span style={css('flex:none;width:16px;height:16px;border-radius:50%;border:2px solid '+(on?ORANGE:'#c4c8d4')+';background:'+(on?'radial-gradient(circle, '+ORANGE+' 0 4px, #fff 5px)':'#fff')+';transition:border-color 0.13s,background 0.13s;')}></span>{opt}
          </label>); })}
      </div>);
    } else if(o.type==='select'){
      control=(<select value={o.value||''} onChange={e=>this.setForm(o.p,e.target.value)} style={css(inp+'cursor:pointer;')}><option value="">— pilih —</option>{o.opts.map((opt,i)=>(<option key={i} value={opt}>{opt}</option>))}</select>);
    } else {
      const num=o.type==='number', rup=o.type==='rupiah';
      const setv=v=>this.setForm(o.p, String(v).replace(/[^0-9]/g,''));
      control=(<div style={css('display:flex;align-items:stretch;')}>
        {rup&&<span style={css('display:flex;align-items:center;padding:0 11px;border:1.5px solid #e0e0de;border-right:none;border-radius:8px 0 0 8px;background:#f7f7f5;color:#6b7280;font-size:13px;font-weight:600;')}>Rp</span>}
        <input value={o.value==null?'':o.value} inputMode={(num||rup)?'numeric':undefined} onChange={e=>this.setForm(o.p, (num||rup)?e.target.value.replace(/[^0-9]/g,''):e.target.value)} style={css(inp+'min-width:0;'+(rup?'border-radius:0;':num?'border-radius:8px 0 0 8px;':''))} />
        {num&&<div style={css('display:flex;flex-direction:column;border:1.5px solid #e0e0de;border-left:none;border-radius:0 8px 8px 0;overflow:hidden;flex:none;')}>
          <button onClick={()=>setv(Number(o.value||0)+1)} style={css('border:none;border-bottom:1px solid #e0e0de;background:#f7f7f5;cursor:pointer;padding:0 10px;font-size:9px;color:#52576b;flex:1;')}>▲</button>
          <button onClick={()=>setv(Math.max(0,Number(o.value||0)-1))} style={css('border:none;background:#f7f7f5;cursor:pointer;padding:0 10px;font-size:9px;color:#52576b;flex:1;')}>▼</button>
        </div>}
      </div>);
    }
    return (<div key={o.p} id={'f_'+o.p} style={css('display:grid;grid-template-columns:minmax(150px,38%) 1fr;gap:18px;align-items:start;padding:13px 0;border-bottom:1px solid #f4f4f2;animation:fadein 0.18s ease;')}>
      <div style={css('font-size:13px;font-weight:600;color:#2c3442;line-height:1.5;padding-top:7px;')}><span style={css('color:#b0b5c2;font-weight:700;margin-right:6px;')}>{o.r}.</span>{o.label}{o.req?<span style={css('color:'+ORANGE+';')}> *</span>:null}{o.hint?<div style={css('color:'+ORANGE+';font-style:italic;font-size:11px;font-weight:600;margin-top:3px;')}>{o.hint}</div>:null}</div>
      <div>{control}</div>
    </div>);
  },
  // Item Ya/Tidak (R38 disabilitas a–f, R39 keluhan kesehatan a–r).
  yt(path,label,value){
    return (<div key={path} style={css('display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;border-bottom:1px solid #f3f3f1;')}>
      <span style={css('font-size:12.5px;color:#3d4152;flex:1;')}>{label}</span>
      <div style={css('display:flex;gap:6px;flex:none;')}>
        {['1. Ya','2. Tidak'].map(opt=>{ const on=value===opt; const ya=/Ya/.test(opt); return (
          <button key={opt} onClick={()=>this.setForm(path,opt)} style={css('padding:4px 13px;border-radius:7px;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid '+(on?(ya?'#f0b4b4':'#bfcef8'):'#e0e0de')+';background:'+(on?(ya?'#fdecec':'#eef2fc'):'#fff')+';color:'+(on?(ya?'#b91c1c':'#1e50d0'):'#9ba2b6')+';transition:background 0.13s,border-color 0.13s,color 0.13s;')}>{ya?'Ya':'Tidak'}</button>); })}
      </div>
    </div>);
  },
  renderForm(V){
    const k=V.form, val=V.validasi;
    const ab=k._activeBlok||'I';
    const prog=this.formProgress(k);
    const gB={}; val.galat.forEach(g=>{ gB[g.blok]=(gB[g.blok]||0)+1; });
    const lab='display:block;font-size:12.5px;font-weight:600;color:#3d4152;margin-bottom:6px;';
    const inp='width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;';
    const fld=(d,scope)=>this.field({p:d.p,r:d.r,label:d.label,type:d.type,opts:d.opts,req:d.req,hint:d.hint,value:getPath(scope||k,d.p)});
    const fields=(arr)=>arr.filter(d=>!d.when||d.when(k)).map(d=>fld(d));
    const sub=(t)=>(<div style={css('text-align:center;font-size:12.5px;font-weight:800;color:'+ORANGE+';text-transform:uppercase;letter-spacing:0.05em;margin:6px 0 10px;')}>{t}</div>);
    const pakaiMeteran=/dengan meteran/.test(getPath(k,'rumah.sumberPenerangan')||'');
    const NB=[['I','Keterangan Identitas Keluarga'],['II','Keterangan Perumahan'],['III','Keterangan Kepemilikan Aset'],['IV','Keterangan Anggota Keluarga'],['V','Catatan']];

    // ---- builders per-blok (hanya blok aktif yang dirender) ----
    const blokI=()=>{
      const F=[
        {p:'nama',r:'1a',label:'Nama Kepala Keluarga',type:'text',req:true},
        {p:'nik',r:'1b',label:'NIK Kepala Keluarga',type:'text',req:true,hint:'16 digit angka'},
        {p:'noKK',r:'1c',label:'Nomor Kartu Keluarga',type:'text',req:true,hint:'16 digit angka'},
        {p:'jumlahAnggotaKK',r:'2a',label:'Jumlah anggota keluarga sesuai KK',type:'number'},
        {p:'desa',r:'3d',label:'Desa/Kelurahan',type:'select',opts:['Desa Sambirenteng','Desa Penuktukan','Desa Tembok'],req:true},
        {p:'dusun',r:'3h',label:'Nama SLS (Banjar Dinas / Dusun)',type:'text',req:true},
        {p:'wilayah.namaJalan',r:'3j',label:'Tuliskan Nama Jalan',type:'text',req:true},
        {p:'wilayah.nomorRumah',r:'3k',label:'Tuliskan Nomor Rumah (isi "-" bila tidak ada)',type:'text'},
        {p:'wilayah.kodePos',r:'3f',label:'Kode Pos',type:'text',req:true},
        {p:'rt',r:'3g',label:'RT',type:'text'},
        {p:'rw',r:'3g',label:'RW',type:'text'},
        {p:'statusKeluarga',r:'16',label:'Status Keberadaan Keluarga',type:'radio',opts:KODE.statusKeluarga,req:true},
        {p:'alamatSesuaiKK',r:'4',label:'Apakah alamat tersebut sesuai dengan alamat pada Kartu Keluarga?',type:'radio',opts:KODE.alamatSesuaiKK,req:true}
      ];
      return (<div style={css('animation:fadein 0.2s ease;')}>{sub('Identitas Wilayah & Keluarga')}{F.map(d=>fld(d))}
        <div style={css('display:grid;grid-template-columns:minmax(150px,38%) 1fr;gap:18px;align-items:start;padding:13px 0;')}>
          <div style={css('font-size:13px;font-weight:600;color:#2c3442;padding-top:7px;')}><span style={css('color:#b0b5c2;font-weight:700;margin-right:6px;')}>3l.</span>Geotagging lokasi (Lat / Long / Akurasi)</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;')}>
            <input value={getPath(k,'geotag.lat')||''} onChange={e=>this.setForm('geotag.lat',e.target.value)} placeholder="Latitude" style={css(inp)} />
            <input value={getPath(k,'geotag.long')||''} onChange={e=>this.setForm('geotag.long',e.target.value)} placeholder="Longitude" style={css(inp)} />
            <input value={getPath(k,'geotag.akurasi')||''} onChange={e=>this.setForm('geotag.akurasi',e.target.value)} placeholder="Akurasi (m)" style={css(inp)} />
          </div>
        </div></div>);
    };
    const blokII=()=>{
      const meteran=(k.meteran||[]).map((m,i)=>(
        <div key={i} id={'sec-meteran-'+i} style={css('background:'+ORANGE_BG+';border:1px solid #f3cba8;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;')}>
          <div style={css('font-size:12.5px;font-weight:800;color:'+ORANGE+';')}>Meteran ke-{i+1}</div>
          {this.field({p:'meteran.'+i+'.daya',r:'18b',label:'Daya yang terpasang di rumah ini',type:'radio',opts:KODE.daya,req:true,value:m.daya})}
          {this.field({p:'meteran.'+i+'.jenisId',r:'18c',label:'Jenis nomor',type:'select',opts:KODE.jenisIdMeteran,req:true,value:m.jenisId})}
          {this.field({p:'meteran.'+i+'.idPelanggan',r:'18c',label:(/No Meteran/.test(m.jenisId||'')?'No Meteran (11 digit)':'ID Pelanggan PLN (12 digit)'),type:'number',req:true,value:m.idPelanggan})}
        </div>));
      const fotoSlot=(slot,label,req)=>{ const ft=getPath(k,'rumah.foto.'+slot); const has=!!(ft&&ft.src); return (
        <div key={slot} style={css('display:flex;flex-direction:column;gap:7px;')}>
          <span style={css('font-size:12px;font-weight:600;color:#52576b;')}>{label}{req?<span style={css('color:'+ORANGE+';')}> *</span>:<span style={css('color:#9ba2b6;')}> (opsional)</span>}</span>
          {has?(<div><div style={css('height:140px;border-radius:10px;overflow:hidden;background:#0c1422;')}><img src={ft.src} style={css('width:100%;height:100%;object-fit:cover;display:block;')} /></div><div style={css('display:flex;justify-content:space-between;align-items:center;margin-top:6px;')}><span style={css('font-size:10.5px;font-family:Menlo,monospace;color:'+(ft.uploading?'#b45309':(ft.driveId?'#166534':'#52576b'))+';')}>{ft.uploading?'⤓ mengunggah ke Drive…':(ft.driveId?'✓ tersimpan di Drive':this.formatBytes(ft.before)+' → '+this.formatBytes(ft.after))}</span><button onClick={()=>this.hapusFoto('rumah.foto.'+slot)} style={css('font-size:11.5px;color:#dc2626;background:none;border:none;cursor:pointer;font-weight:700;font-family:inherit;padding:0;')}>Hapus</button></div></div>)
          :(<label style={css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:140px;border:1.5px dashed #d4d4d0;border-radius:10px;background:repeating-linear-gradient(45deg,#f7f7f5,#f7f7f5 8px,#fafaf9 8px,#fafaf9 16px);cursor:pointer;text-align:center;padding:12px;')}><span style={css('font-size:13px;font-weight:700;color:#52576b;')}>Unggah Foto</span><span style={css('font-size:10.5px;color:#9ba2b6;font-family:Menlo,monospace;')}>auto-kompres &lt;200 KB</span><input type="file" accept="image/*" onChange={e=>this.handleFoto('rumah.foto.'+slot,e)} style={css('display:none;')} /></label>)}
        </div>); };
      return (<div style={css('animation:fadein 0.2s ease;')}>
        {fields(BLOK2)}
        <div id="sec-meteran" style={css('background:'+ORANGE_BG+';border:1px solid #f3cba8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px;margin:14px 0;')}>
          <div style={css('display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;')}>
            <span style={css('font-size:13px;font-weight:800;color:'+ORANGE+';')}>18a. Roster Meteran Listrik</span>
            <label style={css('display:flex;align-items:center;gap:8px;font-size:12.5px;color:#3d4152;')}>Jumlah meteran<input value={(k.meteran||[]).length} onChange={e=>this.setJumlahMeteran(e.target.value)} style={css('width:64px;padding:7px 9px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;text-align:center;')} /></label>
          </div>
          {!pakaiMeteran && <div style={css('font-size:11.5px;color:#9a4a12;background:#fde9d6;border:1px solid #f3cba8;border-radius:8px;padding:8px 11px;')}>Catatan: sumber penerangan saat ini bukan "Listrik PLN dengan meteran", sehingga roster meteran bersifat opsional. Anda tetap dapat mengisinya bila perlu.</div>}
          {(k.meteran||[]).length>0
            ? <div style={css('display:flex;flex-direction:column;gap:12px;')}>{meteran}</div>
            : <span style={css('font-size:12px;color:#9ba2b6;')}>Setel "Jumlah meteran" ≥ 1 untuk menambahkan kartu pengisian meteran.</span>}
        </div>
        {fields(BLOK2B)}
        <div style={css('margin-top:8px;')}>
          {sub('21. Foto Rumah')}
          <div style={css('font-size:11.5px;color:#9ba2b6;text-align:center;margin-bottom:12px;')}>Tampak depan &amp; ruang tamu wajib · dikompres otomatis (≤1024px, &lt;200KB)</div>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;')}>
            {fotoSlot('depan','a. Tampak depan (atap & dinding)',true)}
            {fotoSlot('ruangTamu','b. Ruang tamu (dinding & lantai)',true)}
            {fotoSlot('kamarMandi','c. Kamar mandi (kloset)',false)}
          </div>
        </div>
      </div>);
    };
    const blokIII=()=>(<div style={css('animation:fadein 0.2s ease;')}>
      {sub('22. Aset Bergerak')}
      {ASET22.map(a=>this.field({p:'aset.'+a[0],r:'22',label:a[1]+' ('+a[2]+')',type:'number',req:true,value:getPath(k,'aset.'+a[0])}))}
      {Number(getPath(k,'aset.sepedaMotor'))>0&&this.field({p:'aset.nilaiSepedaMotor',r:'22g',label:'Total nilai aset sepeda motor',type:'rupiah',req:true,value:getPath(k,'aset.nilaiSepedaMotor')})}
      {Number(getPath(k,'aset.mobil'))>0&&this.field({p:'aset.nilaiMobil',r:'22h',label:'Total nilai aset mobil',type:'rupiah',req:true,value:getPath(k,'aset.nilaiMobil')})}
      {sub('23. Aset Tidak Bergerak')}
      {ASET23.map(a=>this.field({p:'aset.'+a[0],r:'23',label:a[1],type:'number',req:true,value:getPath(k,'aset.'+a[0])}))}
    </div>);
    const blokIV=()=>{
      const anggota=(k.anggota||[]).map((a,i)=>{
        const open=k._openIdx===i; const base='anggota.'+i+'.';
        const headerRow=(
          <div style={css('display:flex;align-items:center;justify-content:space-between;gap:10px;')}>
            <button onClick={()=>this.toggleOpenAnggota(i)} style={css('flex:1;text-align:left;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:2px;padding:0;')}>
              <span style={css('font-size:13.5px;font-weight:800;color:#18191f;')}>{open?'▾':'▸'} {i+1}. {a.nama||'(anggota baru)'}</span>
              <span style={css('font-size:11.5px;color:#9ba2b6;')}>{a.hubungan||'—'} · {a.jk||'—'}</span>
            </button>
            {(k.anggota.length>1)&&(<button onClick={()=>this.hapusAnggota(i)} style={css('flex:none;font-size:11.5px;font-weight:700;color:#b91c1c;background:#fef2f2;border:1px solid #f3c9c9;border-radius:7px;padding:5px 10px;cursor:pointer;font-family:inherit;')}>Hapus</button>)}
          </div>);
        if(!open) return (<div key={i} id={'sec-anggota-'+i} style={css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;')}>{headerRow}</div>);
        return (
          <div key={i} id={'sec-anggota-'+i} style={css('background:#fff;border:1.5px solid #f3cba8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:6px;')}>
            {headerRow}
            <div style={css('font-size:11px;color:#9ba2b6;margin-bottom:4px;')}>R24. Nomor Urut Anggota: <strong style={css('color:#52576b;')}>{a.no||i+1}</strong></div>
            {ANGGOTA_FIELDS.filter(d=>!d.when||d.when(k,a)).map(d=>this.field({p:base+d.rp,r:d.r,label:d.label,type:d.type,opts:d.opts,req:d.req,value:a[d.rp]}))}
            <div style={css('display:grid;grid-template-columns:minmax(150px,38%) 1fr;gap:18px;align-items:start;padding:13px 0;border-bottom:1px solid #f4f4f2;')}>
              <div style={css('font-size:13px;font-weight:600;color:#2c3442;padding-top:7px;')}><span style={css('color:#b0b5c2;font-weight:700;margin-right:6px;')}>30.</span>Tanggal Lahir<span style={css('color:'+ORANGE+';')}> *</span></div>
              <div style={css('display:grid;grid-template-columns:1fr 1.4fr 1fr 1fr;gap:8px;')}>
                <input value={a.tglLahir||''} onChange={e=>this.setForm(base+'tglLahir',e.target.value.replace(/[^0-9]/g,''))} placeholder="Tgl" style={css(inp)} />
                <select value={a.blnLahir||''} onChange={e=>this.setForm(base+'blnLahir',e.target.value)} style={css(inp+'cursor:pointer;')}><option value="">Bulan</option>{KODE.bulan.map((b,j)=>(<option key={j} value={b}>{b}</option>))}</select>
                <input value={a.thnLahir||''} onChange={e=>this.setForm(base+'thnLahir',e.target.value.replace(/[^0-9]/g,''))} placeholder="Thn" style={css(inp)} />
                <input value={a.umur||''} onChange={e=>this.setForm(base+'umur',e.target.value.replace(/[^0-9]/g,''))} placeholder="Umur" style={css(inp)} />
              </div>
            </div>
            <div style={css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;margin-top:6px;')}>
              <div style={css('font-size:12px;font-weight:800;color:'+ORANGE+';margin-bottom:6px;')}>38. Disabilitas (jangka waktu lama)</div>
              {DISABILITAS_ITEMS.map(it=>this.yt(base+'disabilitas.'+it[0],it[1],getPath(a,'disabilitas.'+it[0])))}
            </div>
            <div style={css('background:#fafaf9;border:1px solid #ececea;border-radius:10px;padding:12px 14px;')}>
              <div style={css('font-size:12px;font-weight:800;color:'+ORANGE+';margin-bottom:6px;')}>39. Keluhan kesehatan kronis/menahun</div>
              {KESEHATAN_ITEMS.map(it=>this.yt(base+'kesehatan.'+it[0],it[1],getPath(a,'kesehatan.'+it[0])))}
            </div>
          </div>);
      });
      return (<div style={css('animation:fadein 0.2s ease;')}>
        <div style={css('display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;')}>
          <span style={css('font-size:12.5px;color:#9ba2b6;')}>{(k.anggota||[]).length} anggota</span>
          <button onClick={()=>this.tambahAnggota()} style={css('font-size:12.5px;font-weight:700;color:#fff;background:'+ORANGE+';border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-family:inherit;')}>+ Tambah Anggota</button>
        </div>
        <div style={css('display:flex;flex-direction:column;gap:10px;')}>{anggota}</div>
      </div>);
    };
    const blokV=()=>(<div style={css('animation:fadein 0.2s ease;')}>
      <textarea value={k.catatan||''} onChange={e=>this.setForm('catatan',e.target.value)} placeholder="Catatan pencacah (opsional)…" style={css('width:100%;padding:10px 12px;border:1.5px solid #e0e0de;border-radius:9px;font-size:13.5px;color:#18191f;background:#fff;height:80px;resize:vertical;line-height:1.6;font-family:inherit;')}></textarea>
      <div style={css('margin-top:16px;padding-top:14px;border-top:1px solid #f0f0ee;')}>
        <div style={css('font-size:12.5px;font-weight:800;color:#52576b;margin-bottom:10px;')}>Penetapan Desa (internal — bukan bagian kuesioner)</div>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;align-items:start;')}>
          <div style={css('display:flex;flex-direction:column;gap:10px;')}>
            <div style={css('display:flex;align-items:center;gap:12px;')}><span style={css(V.formDesilStyle)}>{V.formDesilLabel}</span><span style={css('font-size:12px;color:#9ba2b6;font-style:italic;')}>{V.formDesilHint}</span></div>
            <label style={css('display:flex;align-items:center;gap:9px;font-size:13px;color:#3d4152;cursor:pointer;')}><input type="checkbox" checked={!!k.desilManual} onChange={e=>this.setForm('desilManual',e.target.checked)} style={css('width:15px;height:15px;accent-color:'+ORANGE+';cursor:pointer;')} />Override desil manual</label>
            {k.desilManual&&(<select value={k.desil} onChange={e=>this.setForm('desil',e.target.value)} style={css('width:160px;'+inp+'cursor:pointer;')}>{[1,2,3,4,5,6,7,8,9,10].map(d=>(<option key={d} value={String(d)}>Desil {d}</option>))}</select>)}
          </div>
          <div><label style={css(lab)}>Status Penerima Bansos</label><select value={k.bansos||'Tidak Ada'} onChange={e=>this.setForm('bansos',e.target.value)} style={css(inp+'cursor:pointer;')}><option>Tidak Ada</option><option>PKH</option><option>BPNT</option><option>PKH + BPNT</option></select></div>
        </div>
      </div>
    </div>);
    const content = ab==='I'?blokI():ab==='II'?blokII():ab==='III'?blokIII():ab==='IV'?blokIV():blokV();
    const activeTitle=(NB.find(x=>x[0]===ab)||['',''])[1];
    const abIdx=NB.findIndex(x=>x[0]===ab);

    // ---- Sidebar ----
    const dot=(n)=>n>0?<span style={css('flex:none;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#fef2f2;color:#b91c1c;font-size:10.5px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fbc5c5;')}>{n}</span>:<span style={css('flex:none;width:8px;height:8px;border-radius:50%;background:#cbe8cf;')}></span>;
    const navItem=(romawi,label)=>{ const on=ab===romawi; return (
      <button key={romawi} onClick={()=>this.goBlok(romawi)} style={css('width:100%;text-align:left;display:flex;align-items:center;gap:9px;padding:10px 12px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:12.5px;line-height:1.35;font-weight:'+(on?'700':'500')+';color:'+(on?'#fff':'#3d4152')+';background:'+(on?ORANGE:'transparent')+';transition:background 0.15s,color 0.15s;')}>
        <span style={css('flex:1;')}>{romawi}. {label}</span>{on?null:dot(gB[romawi]||0)}
      </button>); };
    const meteranNav=(k.meteran||[]).map((m,i)=>(<button key={'m'+i} onClick={()=>this.goBlok('II',null,'meteran.'+i+'.daya')} style={css('width:100%;text-align:left;padding:5px 12px 5px 28px;border:none;background:none;cursor:pointer;font-family:inherit;font-size:11.5px;color:#6b7280;')}>↳ Meteran ke-{i+1}</button>));
    const anggotaNav=(k.anggota||[]).map((a,i)=>(<button key={'a'+i} onClick={()=>this.goBlok('IV',i,'anggota.'+i+'.nama')} style={css('width:100%;text-align:left;padding:5px 12px 5px 28px;border:none;background:none;cursor:pointer;font-family:inherit;font-size:11.5px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')}>↳ {i+1}. {a.nama||'(anggota baru)'}</button>));

    const sidebar=(
      <aside style={css('flex:none;width:248px;align-self:flex-start;position:sticky;top:78px;background:#fff;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);padding:14px;display:flex;flex-direction:column;gap:6px;max-height:calc(100vh - 96px);overflow-y:auto;')}>
        <div style={css('padding:4px 4px 12px;border-bottom:1px solid #f0f0ee;margin-bottom:6px;')}>
          <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;')}><span style={css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Progres Pengisian</span><span style={css('font-size:12px;font-weight:800;color:'+ORANGE+';')}>{prog.pct}%</span></div>
          <div style={css('height:8px;border-radius:6px;background:#f0f0ee;overflow:hidden;')}><div style={css('height:100%;width:'+prog.pct+'%;background:'+ORANGE+';border-radius:6px;transition:width 0.3s ease;')}></div></div>
          <div style={css('font-size:11px;color:#9ba2b6;margin-top:5px;')}>{prog.filled} / {prog.total} field wajib terisi</div>
          <button onClick={()=>this.toggleRingkasan(true)} style={css('margin-top:10px;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px;border-radius:9px;border:1.5px solid '+(val.galat.length?'#fbc5c5':'#bbf7d0')+';background:'+(val.galat.length?'#fef2f2':'#f0fdf4')+';color:'+(val.galat.length?'#b91c1c':'#166534')+';font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:background 0.2s,border-color 0.2s,color 0.2s;')}>Ringkasan {val.galat.length>0?<span style={css('background:#b91c1c;color:#fff;border-radius:9px;padding:0 7px;font-size:11px;')}>{val.galat.length}</span>:'✓'}</button>
        </div>
        {navItem('I','Keterangan Identitas Keluarga')}
        {navItem('II','Keterangan Perumahan')}
        {ab==='II'&&meteranNav}
        {navItem('III','Keterangan Kepemilikan Aset')}
        {navItem('IV','Keterangan Anggota Keluarga')}
        {ab==='IV'&&anggotaNav}
        {navItem('V','Catatan')}
      </aside>);

    const chip=(label,n,color,bg)=>(<div style={css('flex:1;min-width:90px;display:flex;flex-direction:column;gap:3px;padding:14px;border-radius:12px;background:'+bg+';border:1px solid '+color+'33;')}><span style={css('font-size:26px;font-weight:800;color:'+color+';line-height:1;')}>{n}</span><span style={css('font-size:11px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:0.04em;')}>{label}</span></div>);

    return (
      <div style={css('animation:fadein 0.2s ease;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;')}>
        {sidebar}
        <section style={css('flex:1;min-width:300px;display:flex;flex-direction:column;gap:14px;')}>
          <div style={css('background:#fff;border-radius:14px;padding:22px 22px 8px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')}>
            <div style={css('text-align:center;margin-bottom:16px;')}>
              <div style={css('font-size:16px;font-weight:800;color:'+ORANGE+';text-transform:uppercase;letter-spacing:0.04em;')}>{activeTitle}</div>
              <div style={css('font-size:11px;color:#9ba2b6;margin-top:3px;')}>Blok {ab}</div>
            </div>
            {content}
          </div>

          <div style={css('position:sticky;bottom:0;background:#f5f5f2;padding:12px 0;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid #e8e8e6;')}>
            <div style={css('display:flex;gap:8px;')}>
              <button onClick={()=>abIdx>0&&this.goBlok(NB[abIdx-1][0])} disabled={abIdx<=0} style={css('padding:10px 14px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:'+(abIdx<=0?'#c4c8d4':'#3d4152')+';border-radius:9px;cursor:'+(abIdx<=0?'not-allowed':'pointer')+';')}>‹ Blok</button>
              <button onClick={()=>abIdx<NB.length-1&&this.goBlok(NB[abIdx+1][0])} disabled={abIdx>=NB.length-1} style={css('padding:10px 14px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:'+(abIdx>=NB.length-1?'#c4c8d4':'#3d4152')+';border-radius:9px;cursor:'+(abIdx>=NB.length-1?'not-allowed':'pointer')+';')}>Blok ›</button>
            </div>
            <div style={css('display:flex;gap:10px;flex-wrap:wrap;')}>
              <button onClick={V.onBatal} style={css('padding:11px 16px;font-family:inherit;font-size:13.5px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:#3d4152;border-radius:9px;cursor:pointer;')}>Batal</button>
              <button onClick={V.onSimpanDraf} style={css('padding:11px 18px;font-family:inherit;font-size:13.5px;font-weight:700;border:1.5px solid #f3cba8;background:'+ORANGE_BG+';color:'+ORANGE+';border-radius:9px;cursor:pointer;')}>Simpan Draf</button>
              <button onClick={V.canFinalize?V.onFinalisasi:undefined} disabled={!V.canFinalize} style={css('padding:11px 22px;font-family:inherit;font-size:13.5px;font-weight:700;border:none;border-radius:9px;color:#fff;background:'+(V.canFinalize?'#16a34a':'#cbd5e1')+';cursor:'+(V.canFinalize?'pointer':'not-allowed')+';')}>Submit / Finalisasi</button>
            </div>
          </div>
        </section>

        {/* Modal Konfirmasi Simpan */}
        {V.confirmModal && (
          <div onClick={()=>V.onBatalKonfirmasi()} style={css('position:fixed;inset:0;z-index:90;background:rgba(15,18,28,0.45);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein 0.15s ease;')}>
            <div onClick={(e)=>e.stopPropagation()} style={css('background:#fff;border-radius:16px;width:100%;max-width:480px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);')}>
              <div style={css('display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f0f0ee;')}>
                <div>
                  <div style={css('font-size:16px;font-weight:800;color:#18191f;')}>{V.confirmModal.type==='draft'?'Konfirmasi Simpan Draf':'Konfirmasi Finalisasi'}</div>
                  <div style={css('font-size:12px;color:#9ba2b6;margin-top:2px;')}>{prog.filled} dari {prog.total} field wajib terisi</div>
                </div>
                <button onClick={()=>V.onBatalKonfirmasi()} style={css('width:30px;height:30px;border-radius:8px;border:none;background:#f3f3f2;color:#52576b;font-size:16px;cursor:pointer;')}>×</button>
              </div>
              <div style={css('padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;')}>
                <div style={css('display:flex;gap:10px;')}>
                  {chip('Galat',val.galat.length,'#dc2626','#fef2f2')}
                  {chip('Peringatan',val.peringatan.length,'#d97706','#fffbeb')}
                  {chip('Kosong',val.kosong.length,'#6b7280','#f3f4f6')}
                </div>
                {V.confirmModal.type==='draft' && val.galat.length>0 && (
                  <div style={css('font-size:12.5px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;padding:9px 12px;')}>⚠ Masih ada <strong>{val.galat.length} galat</strong> — data tersimpan sebagai draf dan dapat diperbaiki sebelum finalisasi.</div>
                )}
                {V.confirmModal.type==='draft' && val.galat.length===0 && (
                  <div style={css('font-size:12.5px;font-weight:700;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:9px;padding:9px 12px;text-align:center;')}>✓ Tidak ada galat — bisa langsung difinalisasi atau simpan dulu sebagai draf.</div>
                )}
                {V.confirmModal.type==='final' && (
                  <div style={css('font-size:12.5px;font-weight:700;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:9px;padding:9px 12px;text-align:center;')}>✓ Tidak ada galat — data siap difinalisasi dan dikunci.</div>
                )}
                {val.galat.length>0 && (<div style={css('display:flex;flex-direction:column;gap:5px;')}>
                  <span style={css('font-size:10.5px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Daftar Galat</span>
                  {val.galat.slice(0,5).map((g,i)=>(<div key={i} style={css('font-size:12px;color:#7f1d1d;background:#fef2f2;border:1px solid #fde0e0;border-radius:7px;padding:7px 10px;')}><strong>Blok {g.blok}·R{g.rincian}</strong> — {g.label}</div>))}
                  {val.galat.length>5&&<div style={css('font-size:11.5px;color:#9ba2b6;text-align:center;')}>…dan {val.galat.length-5} galat lainnya</div>}
                </div>)}
                {val.peringatan.length>0 && (<div style={css('display:flex;flex-direction:column;gap:5px;')}>
                  <span style={css('font-size:10.5px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Peringatan</span>
                  {val.peringatan.map((g,i)=>(<div key={i} style={css('font-size:12px;color:#78350f;background:#fffbeb;border:1px solid #fde68a;border-radius:7px;padding:7px 10px;')}><strong>Blok {g.blok}·R{g.rincian}</strong> — {g.label}</div>))}
                </div>)}
              </div>
              <div style={css('display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:1px solid #f0f0ee;')}>
                <button onClick={()=>V.onBatalKonfirmasi()} style={css('padding:10px 18px;font-family:inherit;font-size:13px;font-weight:600;border:1.5px solid #e0e0de;background:#fff;color:#3d4152;border-radius:9px;cursor:pointer;')}>Batal</button>
                <button onClick={()=>V.onKonfirmasiOk()} style={css('padding:10px 22px;font-family:inherit;font-size:13.5px;font-weight:700;border:none;border-radius:9px;color:#fff;background:'+(V.confirmModal.type==='draft'?ORANGE:'#16a34a')+';cursor:pointer;')}>{V.confirmModal.type==='draft'?'Simpan Draf':'Ya, Finalisasi'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ringkasan */}
        {k._showRingkasan && (
          <div onClick={()=>this.toggleRingkasan(false)} style={css('position:fixed;inset:0;z-index:80;background:rgba(15,18,28,0.45);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein 0.15s ease;')}>
            <div onClick={(e)=>e.stopPropagation()} style={css('background:#fff;border-radius:16px;width:100%;max-width:520px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);')}>
              <div style={css('display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f0f0ee;')}>
                <div><div style={css('font-size:16px;font-weight:800;color:#18191f;')}>Ringkasan</div><div style={css('font-size:12px;color:#9ba2b6;margin-top:2px;')}>{prog.filled} dari {prog.total} field wajib terisi</div></div>
                <button onClick={()=>this.toggleRingkasan(false)} style={css('width:30px;height:30px;border-radius:8px;border:none;background:#f3f3f2;color:#52576b;font-size:16px;cursor:pointer;')}>×</button>
              </div>
              <div style={css('padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;')}>
                <div style={css('display:flex;gap:10px;')}>
                  {chip('Galat',val.galat.length,'#dc2626','#fef2f2')}
                  {chip('Peringatan',val.peringatan.length,'#d97706','#fffbeb')}
                  {chip('Kosong',val.kosong.length,'#6b7280','#f3f4f6')}
                </div>
                <div style={css('font-size:12.5px;font-weight:700;padding:9px 12px;border-radius:9px;text-align:center;'+(V.canFinalize?'color:#166534;background:#dcfce7;border:1px solid #bbf7d0;':'color:#b91c1c;background:#fef2f2;border:1px solid #fca5a5;'))}>{V.canFinalize?'✓ Tidak ada galat — siap difinalisasi':val.galat.length+' galat harus diperbaiki sebelum finalisasi'}</div>
                {val.galat.length>0 && (<div style={css('display:flex;flex-direction:column;gap:6px;')}>
                  <span style={css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Daftar Galat — klik untuk menuju</span>
                  {val.galat.map((g,i)=>(<button key={i} onClick={()=>this.goIssue(g)} style={css('text-align:left;font-size:12px;color:#7f1d1d;background:#fef2f2;border:1px solid #fde0e0;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')}><span style={css('flex:none;font-weight:800;color:#b91c1c;')}>Blok {g.blok}·R{g.rincian}</span><span style={css('flex:1;')}>{g.label}</span><span style={css('flex:none;color:#b91c1c;')}>›</span></button>))}
                </div>)}
                {val.peringatan.length>0 && (<div style={css('display:flex;flex-direction:column;gap:6px;')}>
                  <span style={css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Peringatan — klik untuk menuju</span>
                  {val.peringatan.map((g,i)=>(<button key={i} onClick={()=>this.goIssue(g)} style={css('text-align:left;font-size:12px;color:#78350f;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')}><span style={css('flex:none;font-weight:800;color:#d97706;')}>Blok {g.blok}·R{g.rincian}</span><span style={css('flex:1;')}>{g.label}</span><span style={css('flex:none;color:#d97706;')}>›</span></button>))}
                </div>)}
                {val.kosong.length>0 && (<div style={css('display:flex;flex-direction:column;gap:6px;')}>
                  <span style={css('font-size:11px;font-weight:700;color:#9ba2b6;text-transform:uppercase;letter-spacing:0.05em;')}>Kosong (Opsional) — klik untuk menuju</span>
                  {val.kosong.map((g,i)=>(<button key={i} onClick={()=>this.goIssue(g)} style={css('text-align:left;font-size:12px;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;')}><span style={css('flex:none;font-weight:800;color:#6b7280;')}>Blok {g.blok}·R{g.rincian}</span><span style={css('flex:1;')}>{g.label}</span><span style={css('flex:none;color:#6b7280;')}>›</span></button>))}
                </div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },

  render(){
    if(!this.state.auth){ return this.renderLogin(); }
    const V=this.renderVals();
    const card='background:#fff; border-radius:14px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);';
    const th='text-align:left; padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em;';
    const lab='display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:6px;';
    const inp='width:100%;padding:10px 12px;border:1.5px solid #e0e0de;border-radius:9px;font-family:inherit;font-size:14px;color:#18191f;background:#fafaf9;';
    const inpSel=inp+'cursor:pointer;';
    const Stat=({title,color,val,sub})=>(
      <div style={css('background:#fff; border-radius:14px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')}>
        <div style={css('font-size:11.5px; font-weight:600; color:#9ba2b6;')}>{title}</div>
        <div style={css('font-size:30px; font-weight:800; color:'+color+'; letter-spacing:-0.03em; margin:5px 0 3px;')}>{val}</div>
        <div style={css('font-size:11.5px; color:#9ba2b6;')}>{sub}</div>
      </div>
    );

    return (
      <div style={css("min-height:100vh; display:flex; flex-direction:column; background:#f5f5f2; font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:#18191f;")}>

        <header style={css('position:sticky; top:0; z-index:30; background:#fff; border-bottom:1px solid #e8e8e6; height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; gap:14px;')}>
          <div style={css('display:flex; align-items:center; gap:11px; flex:none;')}>
            <div style={css('width:34px; height:34px; border-radius:9px; background:#1e50d0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; letter-spacing:-0.03em; flex:none;')}>DT</div>
            <div>
              <div style={css('font-size:15px; font-weight:800; color:#18191f; letter-spacing:-0.02em; line-height:1.2;')}>DTSEN Desa</div>
              <div style={css('font-size:11px; color:#9ba2b6; font-weight:500; line-height:1.2;')}>{V.namaDesa}</div>
            </div>
          </div>
          <div style={css('display:flex; align-items:center; gap:10px; flex:none;')}>
            <span title={V.serverMode?'Tersambung ke Google Sheets':'Data tersimpan di perangkat ini'} style={css('font-size:11px; font-weight:700; padding:5px 10px; border-radius:20px; white-space:nowrap; border:1px solid '+(V.serverMode?'#bbf7d0':'#e0e0de')+'; color:'+(V.serverMode?'#166534':'#6b7280')+'; background:'+(V.serverMode?'#f0fdf4':'#f6f6f5')+';')}>{V.serverMode?'● Sheets':'○ Lokal'}</span>
            {!V.canCrud && (
              <span style={css('font-size:11px; font-weight:700; color:#52576b; background:#f0f0ef; border:1px solid #e0e0de; padding:5px 10px; border-radius:20px; white-space:nowrap;')}>Hanya-Lihat</span>
            )}
            {V.canCrud && (
              <button onClick={()=>{ if(window.confirm('Pulihkan data contoh? Semua perubahan tersimpan akan dihapus.')) this.resetStore(); }} title="Pulihkan data contoh dan hapus data tersimpan" style={css('font-size:12px; font-weight:600; color:#52576b; background:#f3f3f2; border:1px solid #e8e8e6; padding:5px 11px; border-radius:7px; cursor:pointer; white-space:nowrap;')}>Reset data</button>
            )}
            <div style={css('display:flex; align-items:center; gap:8px; padding-left:10px; border-left:1px solid #e8e8e6;')}>
              <div style={css('width:32px; height:32px; border-radius:50%; background:#eef2fc; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#1e50d0; flex:none;')} title={V.namaOperator}>{V.opInitials}</div>
              <div style={css('display:flex; flex-direction:column; line-height:1.25;')}>
                <span style={css('font-size:12.5px; font-weight:700; color:#18191f; white-space:nowrap;')}>{V.namaOperator}</span>
                <span style={css('font-size:10.5px; color:#9ba2b6; white-space:nowrap;')}>{V.roleLabel}{V.wilayahLabel?' · '+V.wilayahLabel:''}</span>
              </div>
            </div>
            <button onClick={()=>this.logout()} title="Keluar" style={css('font-size:12px; font-weight:600; color:#b91c1c; background:#fff; border:1px solid #f0c9c9; padding:6px 11px; border-radius:7px; cursor:pointer; white-space:nowrap;')}>Keluar</button>
          </div>
        </header>

        <div style={css('position:sticky; top:58px; z-index:29; background:#fff; border-bottom:1px solid #e8e8e6; overflow-x:auto; -webkit-overflow-scrolling:touch;')}>
          <div style={css('display:flex; min-width:max-content; padding:0 20px;')}>
            {V.navItems.map((item,i)=>(<button key={i} onClick={item.onClick} style={css(item.style)}>{item.label}</button>))}
          </div>
        </div>

        <main style={css('flex:1; padding:24px 20px; max-width:1200px; width:100%; margin:0 auto;')}>

          {V.isDashboard && (
            <div style={css('display:flex; flex-direction:column; gap:20px; animation:fadein 0.2s ease;')}>
              <div style={css('display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px;')}>
                <Stat title="Total KK" color="#18191f" val={V.statTotal} sub="keluarga terdata" />
                <Stat title="Prioritas Bansos" color="#c2410c" val={V.statPrioritas} sub="desil 1–4" />
                <Stat title="Penerima Bansos" color="#166534" val={V.statBansos} sub="PKH / BPNT aktif" />
                <Stat title="Perubahan Desil" color="#b45309" val={V.statPerubahan} sub="update terbaru" />
                <Stat title="Sanggahan Aktif" color="#d97706" val={V.statSanggahan} sub="menunggu proses" />
              </div>

              <div style={css('display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; align-items:start;')}>
                <div style={css(card)}>
                  <div style={css('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px;')}>
                    <span style={css('font-size:14px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')}>Distribusi Desil</span>
                    <span style={css('font-size:11px; color:#9ba2b6;')}>keluarga per desil</span>
                  </div>
                  <div style={css('display:flex; align-items:flex-end; gap:6px; height:168px;')}>
                    {V.desilBars.map((bar,i)=>(
                      <div key={i} style={css('flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; justify-content:flex-end; height:100%;')}>
                        <span style={css('font-size:11.5px; font-weight:700; color:#18191f;')}>{bar.count}</span>
                        <div style={css(bar.barStyle)}></div>
                        <span style={css(bar.numStyle)}>{bar.desil}</span>
                      </div>
                    ))}
                  </div>
                  <div style={css('margin-top:14px; padding-top:12px; border-top:1px solid #f0f0ee; font-size:11px; color:#9ba2b6; display:flex; align-items:center; gap:7px;')}>
                    <span style={css('width:10px;height:10px;border-radius:3px;background:#d8522a;display:inline-block;flex:none;')}></span>
                    Desil 1–4 = prioritas penerima bantuan sosial
                  </div>
                </div>

                <div style={css(card+' display:flex; flex-direction:column; gap:10px;')}>
                  <div style={css('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;')}>
                    <span style={css('font-size:14px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')}>Perubahan Desil Terbaru</span>
                    <span style={css('font-size:11px; color:#9ba2b6;')}>dampak kelayakan bansos</span>
                  </div>
                  {V.perubahanList.map((p,i)=>(
                    <div key={i} style={css(p.rowStyle)}>
                      <div style={css(p.iconStyle)}>{p.icon}</div>
                      <div style={css('flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;')}>
                        <div style={css('display:flex; align-items:center; justify-content:space-between; gap:8px;')}>
                          <span style={css('font-size:13px; font-weight:700; color:#18191f; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;')}>{p.nama}</span>
                          <span style={css('font-size:12.5px; font-weight:700; color:#18191f; white-space:nowrap; flex:none;')}>{p.desilText}</span>
                        </div>
                        <span style={css(p.dampakStyle)}>{p.dampak}</span>
                      </div>
                    </div>
                  ))}
                  {V.tidakAdaPerubahan && (
                    <div style={css('padding:20px; text-align:center; color:#9ba2b6; font-size:13px;')}>Belum ada perubahan desil dari update terbaru.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {V.isDaftar && (
            <div style={css('display:flex; flex-direction:column; gap:14px; animation:fadein 0.2s ease;')}>
              <div style={css('display:flex; flex-wrap:wrap; gap:9px; align-items:center;')}>
                <input value={V.search} onChange={V.onSearch} placeholder="Cari NIK, Nama, atau No. KK…" style={css('flex:1; min-width:220px; padding:10px 14px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13.5px; background:#fafaf9; color:#18191f;')} />
                <select value={V.filterDesa} data-filter="filterDesa" onChange={V.onFilter} style={css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')}>
                  {V.desaOptions.map((opt,i)=>(<option key={i} value={opt.value}>{opt.label}</option>))}
                </select>
                <select value={V.filterRt} data-filter="filterRt" onChange={V.onFilter} style={css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')}>
                  {V.rtOptions.map((opt,i)=>(<option key={i} value={opt.value}>{opt.label}</option>))}
                </select>
                <select value={V.filterDesil} data-filter="filterDesil" onChange={V.onFilter} style={css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')}>
                  {V.desilFilterOpts.map((opt,i)=>(<option key={i} value={opt.value}>{opt.label}</option>))}
                </select>
                <select value={V.filterBansos} data-filter="filterBansos" onChange={V.onFilter} style={css('padding:10px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')}>
                  {V.bansosFilterOpts.map((opt,i)=>(<option key={i} value={opt.value}>{opt.label}</option>))}
                </select>
                {V.canCrud && (
                  <button onClick={V.onTambah} style={css('display:inline-flex; align-items:center; gap:6px; padding:10px 16px; font-family:inherit; font-size:13.5px; font-weight:700; background:#1e50d0; color:#fff; border:none; border-radius:9px; cursor:pointer; white-space:nowrap;')}>+ Tambah Data</button>
                )}
              </div>

              <div style={css('background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); overflow-x:auto;')}>
                <table style={css('width:100%; border-collapse:collapse; min-width:720px;')}>
                  <thead>
                    <tr style={css('background:#fafaf9; border-bottom:1px solid #eeeeed;')}>
                      <th style={css(th)}>Kepala Keluarga</th>
                      <th style={css(th)}>Alamat</th>
                      <th style={css(th)}>Pekerjaan</th>
                      <th style={css(th)}>Desil</th>
                      <th style={css(th)}>Bansos</th>
                      <th style={css(th)}>Riwayat</th>
                      <th style={css('text-align:right; padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em;')}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {V.wargaTampil.map((w,i)=>(
                      <tr key={w.id} style={css('border-top:1px solid #f0f0ee;transition:background 0.12s;')} onMouseEnter={w.onHover} onMouseLeave={w.onLeave}>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}>
                          <div style={css('display:flex; align-items:center; gap:7px;')}><span style={css('font-size:13.5px; font-weight:700; color:#18191f;')}>{w.nama}</span><span style={css(w.statusBadgeStyle)}>{w.statusLabel}</span></div>
                          <div style={css('font-size:11px; color:#9ba2b6; margin-top:2px; font-variant-numeric:tabular-nums;')}>{w.nik}</div>
                        </td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}>
                          <div style={css('font-size:13px; font-weight:600; color:#3d4152;')}>{w.rtRw}</div>
                          <div style={css('font-size:11px; color:#9ba2b6; margin-top:2px;')}>{w.dusun}</div>
                          <div style={css('font-size:11px; color:#9ba2b6; margin-top:1px;')}>{w.desa}</div>
                        </td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}>
                          <div style={css('font-size:13px; font-weight:600; color:#3d4152;')}>{w.pekerjaan}</div>
                          <div style={css('font-size:11px; color:#9ba2b6; margin-top:2px; font-variant-numeric:tabular-nums;')}>{w.penghasilan}</div>
                        </td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}><span style={css(w.desilBadgeStyle)}>{w.desilLabel}</span></td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}><span style={css(w.bansosBadgeStyle)}>{w.bansos}</span></td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}>
                          <div style={css('font-size:12px; font-weight:600; color:#3d4152;')}>{w.jumlahTanggal} snapshot</div>
                          {w.adaPerubahanTerakhir && (
                            <div style={css('font-size:11px; color:#b45309; font-weight:700; margin-top:2px;')}>{w.perubahanTerakhirStr}</div>
                          )}
                        </td>
                        <td style={css('padding:13px 16px; vertical-align:middle;')}>
                          <div style={css('display:flex; gap:6px; justify-content:flex-end;')}>
                            <button onClick={w.onLihat} style={css('padding:7px 12px; font-family:inherit; font-size:12px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')}>Riwayat</button>
                            {V.canCrud && (
                              <button onClick={w.onEdit} style={css('padding:7px 12px; font-family:inherit; font-size:12px; font-weight:600; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')}>Edit</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {V.kosong && (
                  <div style={css('padding:40px; text-align:center; color:#9ba2b6; font-size:13.5px;')}>Tidak ada rumah tangga yang cocok.</div>
                )}
              </div>
              <span style={css('font-size:12px; color:#9ba2b6;')}>Menampilkan {V.jumlahTampil} dari {V.jumlahTotal} rumah tangga</span>
            </div>
          )}

          {V.isForm && V.form && this.renderForm(V)}

          {V.isRiwayat && V.riwayatWarga && (
            <div style={css('display:flex; flex-direction:column; gap:14px; animation:fadein 0.2s ease;')}>
              <button onClick={V.onKembali} style={css('align-self:flex-start; display:inline-flex; align-items:center; gap:5px; padding:8px 14px; font-family:inherit; font-size:13px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')}>‹ Kembali ke Daftar</button>
              <div style={css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px;')}>
                <div>
                  <div style={css('font-size:20px; font-weight:800; color:#18191f; letter-spacing:-0.02em;')}>{V.riwayatWarga.nama}</div>
                  <div style={css('display:flex; flex-wrap:wrap; gap:12px; margin-top:6px;')}>
                    <span style={css('font-size:12px; color:#9ba2b6; font-variant-numeric:tabular-nums;')}>{V.riwayatWarga.nik}</span>
                    <span style={css('font-size:12px; color:#9ba2b6; font-variant-numeric:tabular-nums;')}>{V.riwayatWarga.noKK}</span>
                    <span style={css('font-size:12px; color:#9ba2b6;')}>{V.riwayatWarga.rtRw}</span>
                  </div>
                </div>
                <div style={css('display:flex; align-items:center; gap:9px; flex-wrap:wrap;')}>
                  <span style={css(V.riwayatWarga.desilStyle)}>{V.riwayatWarga.desilLabel}</span>
                  <span style={css(V.riwayatWarga.bansosStyle)}>{V.riwayatWarga.bansos}</span>
                  {V.canCrud && (
                    <button onClick={V.riwayatWarga.onEdit} style={css('padding:9px 16px; font-family:inherit; font-size:13px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')}>Edit Data</button>
                  )}
                </div>
              </div>

              <div style={css('display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; align-items:start;')}>
                <div style={css('background:#fff; border-radius:14px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')}>
                  <div style={css('font-size:13.5px; font-weight:700; color:#18191f; margin-bottom:4px; letter-spacing:-0.01em;')}>Linimasa Snapshot</div>
                  <div style={css('font-size:11px; color:#9ba2b6; margin-bottom:12px;')}>satu per hari · klik untuk detail</div>
                  <div style={css('display:flex; flex-direction:column; gap:3px;')}>
                    {V.snapshotList.map((s,i)=>(
                      <button key={i} onClick={s.onClick} style={css(s.rowStyle)}>
                        <div style={css('display:flex; align-items:center; justify-content:space-between; gap:8px;')}>
                          <span style={css('font-size:13px; font-weight:700; color:#18191f;')}>{s.tanggalStr}</span>
                          <span style={css(s.desilStyle)}>{s.desilLabel}</span>
                        </div>
                        <span style={css('font-size:11px; color:#9ba2b6;')}>{s.operator}</span>
                        <span style={css(s.metaStyle)}>{s.metaStr}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:16px;')}>
                  <div style={css('display:flex; justify-content:space-between; align-items:center; gap:10px; padding-bottom:14px; border-bottom:1px solid #f0f0ee;')}>
                    <div>
                      <div style={css('font-size:16px; font-weight:700; color:#18191f; letter-spacing:-0.01em;')}>{V.selectedSnap.tanggalStr}</div>
                      <div style={css('font-size:12px; color:#9ba2b6; margin-top:2px;')}>{V.selectedSnap.operator}</div>
                    </div>
                    <span style={css('font-size:12px; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:5px 12px; border-radius:16px; white-space:nowrap;')}>{V.selectedSnap.jumlahPerubahan}</span>
                  </div>
                  {V.selectedSnap.adaPerubahan && (
                    <div style={css('display:flex; flex-direction:column; gap:8px;')}>
                      <span style={css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em;')}>Field yang berubah</span>
                      {V.selectedSnap.diffList.map((d,i)=>(
                        <div key={i} style={css('padding:11px 13px; background:#fffbf0; border:1px solid #edd7a3; border-radius:10px; display:flex; flex-direction:column; gap:5px;')}>
                          <span style={css('font-size:10.5px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.04em;')}>{d.label}</span>
                          <div style={css('display:flex; align-items:center; gap:9px; font-size:13px; flex-wrap:wrap;')}>
                            <span style={css('color:#dc2626; text-decoration:line-through; font-weight:500;')}>{d.dari}</span>
                            <span style={css('color:#9ba2b6; font-weight:700;')}>→</span>
                            <span style={css('color:#16a34a; font-weight:700;')}>{d.ke}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {V.selectedSnap.snapAwal && (
                    <div style={css('padding:12px 14px; background:#f7f7f5; border-radius:10px; font-size:12.5px; color:#52576b; line-height:1.5;')}>Snapshot awal — belum ada pembanding sebelumnya.</div>
                  )}
                  <div>
                    <span style={css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:9px;')}>Data Lengkap Snapshot</span>
                    <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#f0f0ee; border-radius:10px; overflow:hidden;')}>
                      {V.selectedSnap.dataRows.map((r,i)=>(
                        <div key={i} style={css(r.cellStyle)}>
                          <span style={css('font-size:11px; color:#9ba2b6; font-weight:600;')}>{r.label}</span>
                          <span style={css(r.valueStyle)}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span style={css('font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:9px;')}>Foto Rumah</span>
                    <div style={css('display:grid; grid-template-columns:repeat(3,1fr); gap:10px;')}>
                      {V.selectedSnap.snapFoto.map((f,i)=>(
                        <div key={i} style={css('display:flex; flex-direction:column; gap:5px;')}>
                          <span style={css('font-size:11px; color:#52576b; font-weight:600;')}>{f.label}</span>
                          {f.hasFoto && (
                            <div style={css('height:110px; border-radius:9px; overflow:hidden; background:#0c1422;')}><img src={f.src} style={css('width:100%;height:100%;object-fit:cover;display:block;')} /></div>
                          )}
                          {f.kosong && (
                            <div style={css('height:110px; border-radius:9px; background:repeating-linear-gradient(45deg,#f5f5f3,#f5f5f3 8px,#fafaf9 8px,#fafaf9 16px); display:flex; align-items:center; justify-content:center; font-size:10.5px; color:#9ba2b6; font-family:Menlo,monospace;')}>belum ada foto</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={css('border-top:1px solid #f0f0ee; padding-top:16px; display:flex; flex-direction:column; gap:12px;')}>
                    <div style={css('display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;')}>
                      <div>
                        <span style={css('font-size:13px; font-weight:700; color:#18191f;')}>Sanggahan Snapshot Ini</span>
                        <span style={css('font-size:11.5px; color:#9ba2b6; margin-left:8px;')}>{V.selectedSnap.jumlahSanggahan}</span>
                      </div>
                      {V.canCrud && V.canAjukanSanggahan && (
                        <button onClick={V.onBukaFormSanggahan} style={css('padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:700; border:1.5px solid #1e50d0; background:#eef2fc; color:#1e50d0; border-radius:8px; cursor:pointer; white-space:nowrap;')}>+ Ajukan Sanggahan</button>
                      )}
                    </div>

                    {V.sanggahanForSnap.map((sg,i)=>(
                      <div key={i} style={css(sg.snapCardStyle)}>
                        <div style={css('display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;')}>
                          <div style={css('display:flex; flex-direction:column; gap:2px;')}>
                            <span style={css('font-size:13px; font-weight:700; color:#18191f;')}>{sg.pengaju}</span>
                            <span style={css('font-size:11.5px; color:#52576b;')}>{sg.hubungan} · {sg.tanggalPengajuanStr}</span>
                          </div>
                          <span style={css(sg.statusStyle)}>{sg.status}</span>
                        </div>
                        <p style={css('font-size:13px; color:#3d4152; line-height:1.6; margin:8px 0 0;')}>{sg.alasan}</p>
                      </div>
                    ))}

                    {V.showSanggahanForm && (
                      <div style={css('background:#f7f7f5; border:1.5px solid #e0e0de; border-radius:12px; padding:18px; display:flex; flex-direction:column; gap:12px; animation:fadein 0.15s ease;')}>
                        <div style={css('font-size:13.5px; font-weight:700; color:#18191f;')}>Formulir Sanggahan</div>
                        <div style={css('display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px;')}>
                          <div><label style={css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')}>Nama Pengaju</label><input data-sgfield="pengaju" value={V.sanggahanForm.pengaju} onChange={V.onSanggahanChange} style={css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;')} /></div>
                          <div><label style={css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')}>NIK Pengaju</label><input data-sgfield="nik" value={V.sanggahanForm.nik} onChange={V.onSanggahanChange} style={css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;')} /></div>
                          <div><label style={css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')}>Hubungan dengan KK</label><select data-sgfield="hubungan" value={V.sanggahanForm.hubungan} onChange={V.onSanggahanChange} style={css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-family:inherit;font-size:13.5px;color:#18191f;background:#fff;cursor:pointer;')}><option>Warga Bersangkutan</option><option>Keluarga</option><option>RT/RW</option><option>Kepala Desa</option><option>Pendamping</option></select></div>
                        </div>
                        <div><label style={css('display:block;font-size:12px;font-weight:600;color:#52576b;margin-bottom:5px;')}>Alasan Sanggahan</label><textarea data-sgfield="alasan" value={V.sanggahanForm.alasan} onChange={V.onSanggahanChange} style={css('width:100%;padding:9px 11px;border:1.5px solid #e0e0de;border-radius:8px;font-size:13.5px;color:#18191f;background:#fff;height:80px;resize:vertical;line-height:1.6;')}></textarea></div>
                        <div style={css('display:flex; gap:8px; justify-content:flex-end;')}>
                          <button onClick={V.onTutupFormSanggahan} style={css('padding:9px 16px; font-family:inherit; font-size:13px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')}>Batal</button>
                          <button onClick={V.onSubmitSanggahan} style={css('padding:9px 18px; font-family:inherit; font-size:13px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')}>Kirim Sanggahan</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {V.isSanggahan && (
            <div style={css('display:flex; flex-direction:column; gap:16px; animation:fadein 0.2s ease;')}>
              <div style={css('display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;')}>
                <div>
                  <div style={css('font-size:20px; font-weight:800; color:#18191f; letter-spacing:-0.02em;')}>Daftar Sanggahan</div>
                  <div style={css('font-size:12.5px; color:#9ba2b6; margin-top:3px;')}>Pengajuan keberatan atas perubahan data warga — diproses oleh Operator Desa</div>
                </div>
                <div style={css('display:flex; gap:9px; align-items:center; flex-wrap:wrap;')}>
                  <select value={V.filterSanggahan} data-filter="filterSanggahan" onChange={V.onFilter} style={css('padding:9px 12px; border:1.5px solid #e0e0de; border-radius:9px; font-family:inherit; font-size:13px; background:#fafaf9; color:#18191f; cursor:pointer;')}>
                    {V.sgFilterOpts.map((opt,i)=>(<option key={i} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
              </div>

              {V.sanggahanListDisplay.map((sg,i)=>(
                <div key={sg.id} style={css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:14px;')}>
                  <div style={css('display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;')}>
                    <div style={css('display:flex; flex-direction:column; gap:5px;')}>
                      <div style={css('display:flex; align-items:center; gap:10px; flex-wrap:wrap;')}>
                        <span style={css('font-size:15px; font-weight:700; color:#18191f;')}>{sg.wargaNama}</span>
                        <span style={css(sg.statusStyle)}>{sg.status}</span>
                      </div>
                      <div style={css('font-size:12px; color:#9ba2b6;')}>Snapshot <strong style={css('color:#52576b;')}>{sg.tanggalSnapshotStr}</strong> · Diajukan {sg.tanggalPengajuanStr}</div>
                    </div>
                    <div style={css('display:flex; flex-direction:column; gap:2px; text-align:right;')}>
                      <span style={css('font-size:12.5px; font-weight:700; color:#3d4152;')}>{sg.pengaju}</span>
                      <span style={css('font-size:12px; color:#9ba2b6;')}>{sg.hubungan} · {sg.nik}</span>
                    </div>
                  </div>

                  <div style={css('background:#fafaf9; border-radius:10px; padding:13px 15px; font-size:13.5px; color:#3d4152; line-height:1.65; border:1px solid #f0f0ee;')}>{sg.alasan}</div>

                  {sg.adaCatatan && (
                    <div style={css('background:#f0f5f0; border:1px solid #c6e0c6; border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:3px;')}>
                      <span style={css('font-size:11px; font-weight:700; color:#166534; text-transform:uppercase; letter-spacing:0.05em;')}>Catatan Operator · {sg.tanggalSelesaiStr}</span>
                      <span style={css('font-size:13px; color:#1c3a1c; line-height:1.6;')}>{sg.catatanOperator}</span>
                    </div>
                  )}

                  {V.canCrud && sg.isProcessing && (
                    <div style={css('background:#f7f7f5; border:1.5px solid #e0e0de; border-radius:11px; padding:14px; display:flex; flex-direction:column; gap:10px; animation:fadein 0.15s ease;')}>
                      <label style={css('display:block; font-size:12px; font-weight:600; color:#52576b; margin-bottom:5px;')}>Catatan Penyelesaian (opsional)</label>
                      <textarea value={sg.processCatatan} onChange={sg.onProcessCatatan} style={css('width:100%; padding:9px 11px; border:1.5px solid #e0e0de; border-radius:8px; font-size:13.5px; color:#18191f; background:#fff; height:72px; resize:vertical; line-height:1.6;')}></textarea>
                      <div style={css('display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;')}>
                        <button onClick={sg.onBatalProses} style={css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')}>Batal</button>
                        <button onClick={sg.onTolak} style={css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #fca5a5; background:#fef2f2; color:#b91c1c; border-radius:8px; cursor:pointer;')}>Tolak Sanggahan</button>
                        <button onClick={sg.onTerima} style={css('padding:8px 16px; font-family:inherit; font-size:12.5px; font-weight:700; border:none; background:#16a34a; color:#fff; border-radius:8px; cursor:pointer;')}>Terima Sanggahan</button>
                      </div>
                    </div>
                  )}

                  {V.canCrud && sg.showActions && (
                    <div style={css('display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding-top:4px; border-top:1px solid #f0f0ee;')}>
                      {sg.canProses && (
                        <React.Fragment>
                          <button onClick={sg.onTandaiProses} style={css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #c7d7f6; background:#eef2fc; color:#1e50d0; border-radius:8px; cursor:pointer;')}>Tandai Diproses</button>
                          <button onClick={sg.onTolakLangsung} style={css('padding:8px 14px; font-family:inherit; font-size:12.5px; font-weight:600; border:1.5px solid #fca5a5; background:#fef2f2; color:#b91c1c; border-radius:8px; cursor:pointer;')}>Tolak</button>
                        </React.Fragment>
                      )}
                      {sg.canSelesai && (
                        <button onClick={sg.onMulaiSelesai} style={css('padding:8px 16px; font-family:inherit; font-size:12.5px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')}>Proses &amp; Beri Keputusan</button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {V.sgKosong && (
                <div style={css('background:#fff; border-radius:14px; padding:48px; text-align:center; color:#9ba2b6; font-size:13.5px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05);')}>Tidak ada sanggahan yang cocok dengan filter.</div>
              )}
            </div>
          )}

        </main>

        {V.toast && (
          <div style={css(V.toastStyle)}>{V.toast.msg}</div>
        )}
      </div>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Component namaDesa="Kec. Tejakula, Buleleng" namaOperator="Komang Sutarja" />);

