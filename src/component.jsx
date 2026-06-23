// ---------------------------------------------------------------------------
// Component: ported from the DTSEN Desa design. DCLogic ≈ React.Component
// (state / setState / props), so the original logic is reused verbatim and
// renderVals() feeds a JSX translation of the design template.
// ---------------------------------------------------------------------------
class Component extends React.Component {
  constructor(props){
    super(props);
    this.ASET=['Sepeda','Sepeda Motor','Mobil','Kulkas','TV','AC','Perahu','Ternak'];
    this.BULAN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    // Akun demo (prototipe — autentikasi sisi-klien). Hanya Operator & Kepala Desa
    // yang dapat CRUD; Kepala SLS bersifat hanya-lihat dan dibatasi ke wilayahnya.
    this.ACCOUNTS=[
      {username:'kepaladesa',     password:'desa123',     nama:'I Gusti Ngurah Rai',  role:'Kepala Desa', wilayah:null},
      {username:'operator',       password:'operator123', nama:'Komang Sutarja',      role:'Operator',    wilayah:null},
      {username:'sls.sambirenteng',password:'sls123',     nama:'I Nyoman Lestari',    role:'Kepala SLS',  wilayah:'Banjar Dinas Sambirenteng'},
      {username:'sls.penyumbahan', password:'sls123',     nama:'I Ketut Wirya',       role:'Kepala SLS',  wilayah:'Banjar Dinas Penyumbahan'},
      {username:'sls.penuktukan',  password:'sls123',     nama:'I Wayan Sudiarta',    role:'Kepala SLS',  wilayah:'Banjar Dinas Penuktukan'},
      {username:'sls.tembok',      password:'sls123',     nama:'I Made Astawan',      role:'Kepala SLS',  wilayah:'Banjar Dinas Tembok'},
      {username:'sls.ngis',        password:'sls123',     nama:'I Gede Mariana',      role:'Kepala SLS',  wilayah:'Banjar Dinas Ngis'}
    ];
    // Konfigurasi server opsional. Bila window.DTSEN_CONFIG.apiUrl diisi (lihat
    // config.js), aplikasi memakai Google Sheets via Apps Script sebagai database;
    // bila kosong, aplikasi berjalan murni lokal (localStorage) seperti semula.
    var CFG=(typeof window!=='undefined'&&window.DTSEN_CONFIG)||{};
    this.apiUrl=String(CFG.apiUrl||'').trim();
    this._cred=null; // kredensial di memori untuk dilampirkan ke tiap permintaan
    this.state=this.initState();
  }

  // -- Lapisan server (Google Sheets via Apps Script) --------------------------
  serverMode(){ return !!this.apiUrl; }
  apiCall(action,payload){
    return window.fetch(this.apiUrl,{
      method:'POST',
      // text/plain agar tidak memicu CORS preflight ke Apps Script.
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:action,auth:this._cred||null,payload:payload||{}})
    }).then(function(r){ return r.json(); });
  }
  bootstrap(){
    if(!this.serverMode()) return;
    this.setState({loading:true});
    this.apiCall('bootstrap',{}).then(res=>{
      this.setState({loading:false});
      if(res&&res.ok){ this.setState({warga:res.warga||[],sanggahan:res.sanggahan||[]}); }
      else { this.setState({toast:{type:'err',msg:'Gagal memuat data dari server. Menampilkan data lokal.'}}); this.autoClear(); }
    }).catch(()=>{ this.setState({loading:false,toast:{type:'err',msg:'Gagal memuat data dari server. Menampilkan data lokal.'}}); this.autoClear(); });
  }
  // Dorong perubahan ke server (no-op di mode lokal). Kegagalan tidak memblokir
  // state lokal — hanya memunculkan notifikasi.
  push(action,payload){
    if(!this.serverMode()) return;
    this.apiCall(action,payload).then(res=>{
      if(!res||!res.ok){ this.setState({toast:{type:'err',msg:'Sinkron server gagal: '+((res&&res.error)||'tidak diketahui')}}); this.autoClear(); }
    }).catch(()=>{ this.setState({toast:{type:'err',msg:'Server tidak terjangkau — perubahan tersimpan lokal.'}}); this.autoClear(); });
  }

  // -- Sesi login --------------------------------------------------------------
  static get AUTH_KEY(){ return 'dtsen-desa-auth-v1'; }
  loadAuth(){
    try{ const raw=window.localStorage.getItem(Component.AUTH_KEY); if(!raw) return null;
      const a=JSON.parse(raw); if(a&&a.role&&a.nama) return a; }catch(e){}
    return null;
  }
  canCrud(){ const a=this.state.auth; return !!a&&(a.role==='Operator'||a.role==='Kepala Desa'); }
  // Warga yang boleh dilihat: Kepala SLS dibatasi ke wilayahnya, lainnya melihat semua.
  visibleWarga(){ const a=this.state.auth; const w=this.state.warga; return (a&&a.wilayah)?w.filter(x=>x.dusun===a.wilayah):w; }
  onLoginField(e){ const k=e.target.getAttribute('data-login'); const v=e.target.value; this.setState(s=>({loginForm:Object.assign({},s.loginForm,{[k]:v,error:''})})); }
  loginOk(auth,persist){
    if(persist){ try{ window.localStorage.setItem(Component.AUTH_KEY,JSON.stringify(auth)); }catch(e2){} }
    this.setState({auth:auth,view:'dashboard',loginForm:{username:'',password:'',error:''},toast:{type:'ok',msg:'Selamat datang, '+auth.nama+'.'}}); this.autoClear();
  }
  loginFail(msg){ this.setState(s=>({loginForm:Object.assign({},s.loginForm,{error:msg||'Username atau kata sandi salah.'})})); }
  login(e){ if(e&&e.preventDefault) e.preventDefault();
    const f=this.state.loginForm; const u=(f.username||'').trim().toLowerCase();
    if(this.serverMode()){
      // Mode server: validasi & ambil data dari Google Sheets.
      this.setState({loading:true});
      this._cred={username:u,password:f.password};
      this.apiCall('login',{username:u,password:f.password}).then(res=>{
        this.setState({loading:false});
        if(!res||!res.ok){ this._cred=null; this.loginFail(res&&res.error); return; }
        this.loginOk(res.user,false); // sesi server tidak dipersist (butuh login tiap sesi)
        this.bootstrap();
      }).catch(()=>{ this.setState({loading:false}); this._cred=null; this.loginFail('Server tidak terjangkau. Periksa koneksi / URL.'); });
      return;
    }
    // Mode lokal: akun demo bawaan.
    const acc=this.ACCOUNTS.find(a=>a.username===u&&a.password===f.password);
    if(!acc){ this.loginFail(); return; }
    this.loginOk({username:acc.username,nama:acc.nama,role:acc.role,wilayah:acc.wilayah},true);
  }
  logout(){ try{ window.localStorage.removeItem(Component.AUTH_KEY); }catch(e){} this._cred=null;
    this.setState({auth:null,view:'dashboard',form:null,editId:null,selectedId:null,selectedTanggal:null,showSanggahanForm:false,processingId:null,confirmModal:null,toast:null,loading:false,sortBy:null,sortDir:'asc'}); }

  initState(){
    const saved=this.loadStore();
    return {auth:this.loadAuth(), loginForm:{username:'',password:'',error:''},
      view:'dashboard',search:'',filterDesa:'semua',filterRt:'semua',filterDesil:'semua',filterBansos:'semua',filterSanggahan:'semua',
      warga:saved?saved.warga:this.seedWarga(), sanggahan:saved?saved.sanggahan:this.seedSanggahan(),
      form:null, editId:null, selectedId:null, selectedTanggal:null,
      showSanggahanForm:false, sanggahanForm:{pengaju:'',nik:'',hubungan:'Warga Bersangkutan',alasan:''},
      processingId:null, processCatatan:'',
      confirmModal:null, loading:false, sortBy:null, sortDir:'asc',
      isMobile:typeof window!=='undefined'&&window.innerWidth<768,
      page:1, showScrollTop:false,
      toast:null, today:typeof todayWITA==='function'?todayWITA():new Date().toISOString().slice(0,10)};
  }

  // -- Persistensi data (localStorage) -----------------------------------------
  static get STORE_KEY(){ return 'dtsen-desa-v1'; }
  loadStore(){
    try{ const raw=window.localStorage.getItem(Component.STORE_KEY); if(!raw) return null;
      const d=JSON.parse(raw); if(d&&Array.isArray(d.warga)&&Array.isArray(d.sanggahan)) return d; }catch(e){}
    return null;
  }
  saveStore(state){
    try{ window.localStorage.setItem(Component.STORE_KEY, JSON.stringify({warga:state.warga,sanggahan:state.sanggahan})); }catch(e){}
  }
  resetStore(){
    if(!this.canCrud()) return;
    if(this.serverMode()){ this.apiCall('reset',{}).then(res=>{ if(res&&res.ok){ this.bootstrap(); this.setState({view:'dashboard',toast:{type:'ok',msg:'Data contoh di server dipulihkan.'}}); this.autoClear(); } else { this.push('reset',{}); } }).catch(()=>{ this.setState({toast:{type:'err',msg:'Server tidak terjangkau.'}}); this.autoClear(); }); return; }
    try{ window.localStorage.removeItem(Component.STORE_KEY); }catch(e){}
    this.setState({warga:this.seedWarga(),sanggahan:this.seedSanggahan(),view:'dashboard',selectedId:null,selectedTanggal:null,form:null,editId:null,toast:{type:'ok',msg:'Data contoh dipulihkan.'}});
    this.autoClear();
  }
  componentDidMount(){
    this._onResize=()=>this.setState({isMobile:window.innerWidth<768});
    window.addEventListener('resize',this._onResize);
    this._onScroll=()=>this.setState({showScrollTop:window.scrollY>300});
    window.addEventListener('scroll',this._onScroll,{passive:true});
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this._onResize);
    window.removeEventListener('scroll',this._onScroll);
  }
  componentDidUpdate(_prevProps, prevState){
    if(prevState.warga!==this.state.warga || prevState.sanggahan!==this.state.sanggahan){
      this.saveStore(this.state);
    }
  }

  // -- Formatters & utilitas tampilan ------------------------------------------
  rupiah(n){ n=Number(n||0); return 'Rp'+n.toLocaleString('id-ID'); }
  formatBytes(b){ b=Number(b||0); if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(0)+' KB'; return (b/1048576).toFixed(2)+' MB'; }
  formatTanggal(s){ if(!s) return '-'; const p=s.split('-'); return Number(p[2])+' '+this.BULAN[Number(p[1])-1]+' '+p[0]; }
  getDS(d){ d=Math.max(1,Math.min(10,Number(d)||1)); const hue=25+(d-1)/9*125; return {text:'oklch(0.46 0.14 '+hue+')',bg:'oklch(0.955 0.04 '+hue+')',solid:'oklch(0.63 0.15 '+hue+')'}; }
  bansosStyle(b){ if(b==='Tidak Ada') return {bg:'#f0f0ef',text:'#6b7280'}; if(b==='PKH') return {bg:'#ebf1fd',text:'#1d4ed8'}; if(b==='BPNT') return {bg:'#eaf5ee',text:'#166534'}; return {bg:'#f0edfb',text:'#5b21b6'}; }
  sgStatusStyle(s){ if(s==='Diajukan') return {bg:'#fffbeb',text:'#92400e'}; if(s==='Diproses') return {bg:'#eef2fc',text:'#1e50d0'}; if(s==='Diterima') return {bg:'#eaf5ee',text:'#166534'}; return {bg:'#f3f3f2',text:'#52576b'}; }

  hitungDesil(d){
    let s=0; const p=Number(d.penghasilan)||0;
    if(p<800000)s+=0; else if(p<1500000)s+=1.5; else if(p<2500000)s+=3; else if(p<4000000)s+=4.5; else s+=6;
    s+= d.lantai==='Tanah'?0:d.lantai==='Semen'?1:2;
    s+= d.dinding==='Bambu/Kayu'?0:d.dinding==='Setengah Tembok'?1:2;
    s+= d.atap==='Daun/Rumbia'?0:d.atap==='Seng/Asbes'?1:2;
    s+= d.sumberAir==='Sungai/Hujan'?0:d.sumberAir==='Sumur'?1:2;
    s+= d.penerangan==='Non-PLN'?0:d.penerangan==='PLN 450 VA'?1:2;
    s+= (d.aset?d.aset.length:0)*0.8;
    const low=['Tidak Bekerja','Buruh Tani','Buruh Harian']; s+= low.indexOf(d.pekerjaan)>=0?0:1.5;
    s+= (d.pendidikan==='Tidak Sekolah'||d.pendidikan==='SD')?0:(d.pendidikan==='SMP'||d.pendidikan==='SMA')?1:2;
    return Math.max(1,Math.min(10,Math.round(s/23*9)+1));
  }

  diffKeys(){ return [['pekerjaan','Pekerjaan'],['pendidikan','Pendidikan'],['penghasilan','Penghasilan'],['jumlahAnggota','Jumlah Anggota'],['disabilitas','Disabilitas'],['statusRumah','Status Rumah'],['lantai','Lantai'],['dinding','Dinding'],['atap','Atap'],['sumberAir','Sumber Air'],['penerangan','Penerangan'],['aset','Aset'],['desil','Desil'],['bansos','Status Bansos']]; }
  fmtVal(k,v){ if(k==='penghasilan') return this.rupiah(v); if(k==='desil') return 'Desil '+v; if(k==='aset') return (v&&v.length)?v.join(', '):'—'; return (v===''||v==null)?'—':String(v); }
  computeDiff(prev,next){ const out=[]; const ks=this.diffKeys(); for(let i=0;i<ks.length;i++){ const k=ks[i][0],lab=ks[i][1]; const a=prev[k],b=next[k]; const eq=Array.isArray(a)?JSON.stringify(a||[])===JSON.stringify(b||[]):a===b; if(!eq) out.push({label:lab,dari:this.fmtVal(k,a),ke:this.fmtVal(k,b)}); } return out; }
  emptyFoto(){ return {depan:null,ruangTamu:null,kamarMandi:null}; }
  // Foto contoh (placeholder 1px) agar data seed lolos validasi foto wajib.
  seedFoto(){ const ph={src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',before:48000,after:30000}; return {depan:Object.assign({},ph),ruangTamu:Object.assign({},ph),kamarMandi:null}; }
}
