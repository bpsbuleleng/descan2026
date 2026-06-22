/* AUTO-GENERATED from src/app.jsx by build.js — do not edit directly. */
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
      nama: 'H. Sutrisno',
      role: 'Kepala Desa',
      wilayah: null
    }, {
      username: 'operator',
      password: 'operator123',
      nama: 'Budi Santoso',
      role: 'Operator',
      wilayah: null
    }, {
      username: 'sls.krajan',
      password: 'sls123',
      nama: 'Sarno',
      role: 'Kepala SLS',
      wilayah: 'Dusun Krajan'
    }, {
      username: 'sls.ngasem',
      password: 'sls123',
      nama: 'Yatmin',
      role: 'Kepala SLS',
      wilayah: 'Dusun Ngasem'
    }, {
      username: 'sls.sukamulya',
      password: 'sls123',
      nama: 'Marni',
      role: 'Kepala SLS',
      wilayah: 'Dusun Sukamulya'
    }];
    this.state = this.initState();
  }

  // -- Sesi login --------------------------------------------------------------
  static get AUTH_KEY() {
    return 'dtsen-desa-auth-v1';
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
  login(e) {
    if (e && e.preventDefault) e.preventDefault();
    const f = this.state.loginForm;
    const u = (f.username || '').trim().toLowerCase();
    const acc = this.ACCOUNTS.find(a => a.username === u && a.password === f.password);
    if (!acc) {
      this.setState(s => ({
        loginForm: Object.assign({}, s.loginForm, {
          error: 'Username atau kata sandi salah.'
        })
      }));
      return;
    }
    const auth = {
      username: acc.username,
      nama: acc.nama,
      role: acc.role,
      wilayah: acc.wilayah
    };
    try {
      window.localStorage.setItem(Component.AUTH_KEY, JSON.stringify(auth));
    } catch (e2) {}
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
        msg: 'Selamat datang, ' + acc.nama + '.'
      }
    });
    this.autoClear();
  }
  logout() {
    try {
      window.localStorage.removeItem(Component.AUTH_KEY);
    } catch (e) {}
    this.setState({
      auth: null,
      view: 'dashboard',
      form: null,
      editId: null,
      selectedId: null,
      selectedTanggal: null,
      showSanggahanForm: false,
      processingId: null,
      toast: null
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
      toast: null,
      today: '2026-06-19'
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
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.warga !== this.state.warga || prevState.sanggahan !== this.state.sanggahan) {
      this.saveStore(this.state);
    }
  }
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
    return Object.assign({}, meta, last.data, {
      foto: last.foto,
      snapshots: snaps,
      anggota: meta.anggota || []
    });
  }
  seedWarga() {
    const W = [];
    W.push(this.mkWarga({
      id: 'w1',
      noKK: '3204150607080001',
      nik: '3204151005780002',
      nama: 'Slamet Riyadi',
      dusun: 'Dusun Krajan',
      rt: '002',
      rw: '001',
      alamat: 'Jl. Melati No. 12',
      anggota: ['Slamet Riyadi', 'Wagiyem', 'Andi Saputra', 'Rina', 'Dewi']
    }, [{
      tanggal: '2025-09-10',
      operator: 'Budi Santoso',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'SD',
      penghasilan: 1500000,
      jumlahAnggota: 5,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'TV'],
      bansos: 'PKH'
    }, {
      tanggal: '2026-06-19',
      operator: 'Budi Santoso',
      pekerjaan: 'Tidak Bekerja',
      pendidikan: 'SD',
      penghasilan: 800000,
      jumlahAnggota: 5,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['TV'],
      bansos: 'PKH'
    }]));
    W.push(this.mkWarga({
      id: 'w2',
      noKK: '3204150607080002',
      nik: '3204154208600003',
      nama: 'Sukinem',
      dusun: 'Dusun Ngasem',
      rt: '001',
      rw: '001',
      alamat: 'Jl. Mawar No. 4',
      anggota: ['Sukinem', 'Bagas Setiawan']
    }, [{
      tanggal: '2025-08-05',
      operator: 'Siti Aminah',
      pekerjaan: 'Tidak Bekerja',
      pendidikan: 'SD',
      penghasilan: 600000,
      jumlahAnggota: 2,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH + BPNT'
    }, {
      tanggal: '2026-03-12',
      operator: 'Siti Aminah',
      pekerjaan: 'Tidak Bekerja',
      pendidikan: 'SD',
      penghasilan: 700000,
      jumlahAnggota: 2,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Numpang',
      lantai: 'Semen',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH + BPNT'
    }]));
    W.push(this.mkWarga({
      id: 'w3',
      noKK: '3204150607080003',
      nik: '3204150803750004',
      nama: 'Bambang Wijaya',
      dusun: 'Dusun Krajan',
      rt: '003',
      rw: '002',
      alamat: 'Jl. Anggrek No. 21',
      anggota: ['Bambang Wijaya', 'Lestari', 'Putri Maharani', 'Galih']
    }, [{
      tanggal: '2025-07-20',
      operator: 'Budi Santoso',
      pekerjaan: 'Pedagang',
      pendidikan: 'SMP',
      penghasilan: 2500000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Kulkas', 'TV'],
      bansos: 'Tidak Ada'
    }, {
      tanggal: '2026-02-18',
      operator: 'Budi Santoso',
      pekerjaan: 'Wiraswasta',
      pendidikan: 'SMP',
      penghasilan: 4500000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Keramik/Ubin',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'PDAM/Ledeng',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Mobil', 'Kulkas', 'TV', 'AC'],
      bansos: 'Tidak Ada'
    }]));
    W.push(this.mkWarga({
      id: 'w4',
      noKK: '3204150607080004',
      nik: '3204152107700005',
      nama: 'Tukijan',
      dusun: 'Dusun Ngasem',
      rt: '002',
      rw: '001',
      alamat: 'Jl. Kenanga No. 7',
      anggota: ['Tukijan', 'Sumarni', 'Adi Nugroho', 'Nia']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Budi Santoso',
      pekerjaan: 'Petani',
      pendidikan: 'SD',
      penghasilan: 1800000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor', 'Ternak'],
      bansos: 'BPNT'
    }]));
    W.push(this.mkWarga({
      id: 'w5',
      noKK: '3204150607080005',
      nik: '3204156504880006',
      nama: 'Sri Wahyuni',
      dusun: 'Dusun Sukamulya',
      rt: '001',
      rw: '003',
      alamat: 'Jl. Dahlia No. 3',
      anggota: ['Sri Wahyuni', 'Hendra', 'Kiki Amelia']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Siti Aminah',
      pekerjaan: 'Guru Honorer',
      pendidikan: 'S1',
      penghasilan: 2200000,
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
    }]));
    W.push(this.mkWarga({
      id: 'w6',
      noKK: '3204150607080006',
      nik: '3204155512650007',
      nama: 'Painem',
      dusun: 'Dusun Ngasem',
      rt: '003',
      rw: '001',
      alamat: 'Jl. Flamboyan No. 9',
      anggota: ['Painem', 'Joko', 'Sari']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Siti Aminah',
      pekerjaan: 'Buruh Harian',
      pendidikan: 'Tidak Sekolah',
      penghasilan: 900000,
      jumlahAnggota: 3,
      disabilitas: 'Ada',
      statusRumah: 'Numpang',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sungai/Hujan',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'PKH'
    }]));
    W.push(this.mkWarga({
      id: 'w7',
      noKK: '3204150607080007',
      nik: '3204151809820008',
      nama: 'Wagiyo',
      dusun: 'Dusun Krajan',
      rt: '002',
      rw: '002',
      alamat: 'Jl. Melati No. 30',
      anggota: ['Wagiyo', 'Tini', 'Bayu', 'Dika', 'Eka']
    }, [{
      tanggal: '2026-06-19',
      operator: 'Budi Santoso',
      pekerjaan: 'Tukang Bangunan',
      pendidikan: 'SMP',
      penghasilan: 2000000,
      jumlahAnggota: 5,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['Sepeda Motor'],
      bansos: 'BPNT'
    }]));
    W.push(this.mkWarga({
      id: 'w8',
      noKK: '3204150607080008',
      nik: '3204156011790009',
      nama: 'Ngatini',
      dusun: 'Dusun Sukamulya',
      rt: '002',
      rw: '003',
      alamat: 'Jl. Dahlia No. 15',
      anggota: ['Ngatini', 'Parto', 'Wati', 'Sinta']
    }, [{
      tanggal: '2025-10-02',
      operator: 'Siti Aminah',
      pekerjaan: 'Pengrajin',
      pendidikan: 'SD',
      penghasilan: 1200000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: ['TV'],
      bansos: 'PKH'
    }, {
      tanggal: '2026-05-30',
      operator: 'Siti Aminah',
      pekerjaan: 'Pengrajin',
      pendidikan: 'SD',
      penghasilan: 1600000,
      jumlahAnggota: 4,
      disabilitas: 'Tidak Ada',
      statusRumah: 'Milik Sendiri',
      lantai: 'Semen',
      dinding: 'Setengah Tembok',
      atap: 'Genteng/Beton',
      sumberAir: 'Sumur',
      penerangan: 'PLN 900+ VA',
      aset: ['TV', 'Kulkas'],
      bansos: 'PKH'
    }]));
    return W;
  }
  seedSanggahan() {
    return [{
      id: 's1',
      wargaId: 'w1',
      tanggalSnapshot: '2026-06-19',
      pengaju: 'Slamet Riyadi',
      nik: '3204151005780002',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Data pekerjaan saya tercatat "Tidak Bekerja" namun saya masih aktif bekerja sebagai tenaga serabutan. Mohon diperbaiki agar desil tidak berubah dan saya tetap berhak mendapat PKH.',
      status: 'Diajukan',
      tanggalPengajuan: '2026-06-19',
      tanggalSelesai: '',
      catatanOperator: ''
    }, {
      id: 's2',
      wargaId: 'w2',
      tanggalSnapshot: '2026-03-12',
      pengaju: 'Ketua RT 001 / RW 001',
      nik: '-',
      hubungan: 'RT/RW',
      alasan: 'Kondisi lantai rumah Ibu Sukinem belum sepenuhnya berubah menjadi semen. Sebagian ruang masih berlantai tanah. Perlu dilakukan verifikasi lapangan ulang sebelum data dikunci.',
      status: 'Diproses',
      tanggalPengajuan: '2026-04-02',
      tanggalSelesai: '',
      catatanOperator: ''
    }, {
      id: 's3',
      wargaId: 'w3',
      tanggalSnapshot: '2026-02-18',
      pengaju: 'Bambang Wijaya',
      nik: '3204150803750004',
      hubungan: 'Warga Bersangkutan',
      alasan: 'Aset mobil yang tercatat adalah kendaraan pinjaman milik saudara, bukan milik keluarga saya. Mohon dihapus dari daftar aset agar desil saya tidak naik ke angka yang tidak akurat.',
      status: 'Ditolak',
      tanggalPengajuan: '2026-02-25',
      tanggalSelesai: '2026-03-05',
      catatanOperator: 'Telah dilakukan verifikasi lapangan dan pengecekan STNK. Kendaraan terdaftar atas nama Bambang Wijaya. Sanggahan ditolak sesuai hasil verifikasi dokumen.'
    }];
  }
  blankForm() {
    return {
      id: 'w' + Date.now(),
      isNew: true,
      noKK: '',
      nik: '',
      nama: '',
      dusun: 'Dusun Krajan',
      rt: '',
      rw: '',
      alamat: '',
      anggotaStr: '',
      jumlahAnggota: '1',
      disabilitas: 'Tidak Ada',
      pekerjaan: 'Buruh Tani',
      pendidikan: 'SD',
      penghasilan: '',
      statusRumah: 'Milik Sendiri',
      lantai: 'Tanah',
      dinding: 'Bambu/Kayu',
      atap: 'Seng/Asbes',
      sumberAir: 'Sumur',
      penerangan: 'PLN 450 VA',
      aset: [],
      bansos: 'Tidak Ada',
      desilManual: false,
      desil: '5',
      foto: this.emptyFoto()
    };
  }
  dataToForm(w) {
    return {
      id: w.id,
      isNew: false,
      noKK: w.noKK,
      nik: w.nik,
      nama: w.nama,
      dusun: w.dusun,
      rt: w.rt,
      rw: w.rw,
      alamat: w.alamat,
      anggotaStr: (w.anggota || []).join(', '),
      jumlahAnggota: String(w.jumlahAnggota),
      disabilitas: w.disabilitas,
      pekerjaan: w.pekerjaan,
      pendidikan: w.pendidikan,
      penghasilan: String(w.penghasilan),
      statusRumah: w.statusRumah,
      lantai: w.lantai,
      dinding: w.dinding,
      atap: w.atap,
      sumberAir: w.sumberAir,
      penerangan: w.penerangan,
      aset: (w.aset || []).slice(),
      bansos: w.bansos,
      desilManual: false,
      desil: String(w.desil),
      foto: Object.assign({}, w.foto)
    };
  }
  formToData(f) {
    const base = {
      pekerjaan: f.pekerjaan,
      pendidikan: f.pendidikan,
      penghasilan: Number(f.penghasilan || 0),
      jumlahAnggota: Number(f.jumlahAnggota || 0),
      disabilitas: f.disabilitas,
      statusRumah: f.statusRumah,
      lantai: f.lantai,
      dinding: f.dinding,
      atap: f.atap,
      sumberAir: f.sumberAir,
      penerangan: f.penerangan,
      aset: f.aset.slice(),
      bansos: f.bansos
    };
    base.desil = f.desilManual ? Number(f.desil) : this.hitungDesil(base);
    return base;
  }
  opName() {
    return this.state && this.state.auth && this.state.auth.nama || this.props.namaOperator || 'Budi Santoso';
  }
  nav(key) {
    this.setState({
      view: key,
      form: key === 'form' ? this.state.form : null,
      showSanggahanForm: false,
      processingId: null
    });
  }
  onSearch(e) {
    this.setState({
      search: e.target.value
    });
  }
  onFilter(e) {
    const k = e.target.getAttribute('data-filter');
    const o = {};
    o[k] = e.target.value;
    this.setState(o);
  }
  onTambah() {
    if (!this.canCrud()) return;
    this.setState({
      form: this.blankForm(),
      editId: null,
      view: 'form'
    });
  }
  mulaiEdit(id) {
    if (!this.canCrud()) return;
    const w = this.state.warga.find(x => x.id === id);
    this.setState({
      form: this.dataToForm(w),
      editId: id,
      view: 'form'
    });
  }
  onBatal() {
    this.setState({
      form: null,
      editId: null,
      view: this.state.selectedId ? 'riwayat' : 'daftar'
    });
  }
  onFormChange(e) {
    const k = e.target.getAttribute('data-field');
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState(s => ({
      form: Object.assign({}, s.form, {
        [k]: v
      })
    }));
  }
  toggleAset(n) {
    this.setState(s => {
      const a = s.form.aset.slice();
      const i = a.indexOf(n);
      if (i >= 0) a.splice(i, 1);else a.push(n);
      return {
        form: Object.assign({}, s.form, {
          aset: a
        })
      };
    });
  }
  hapusFoto(slot) {
    this.setState(s => ({
      form: Object.assign({}, s.form, {
        foto: Object.assign({}, s.form.foto, {
          [slot]: null
        })
      })
    }));
  }
  handleFoto(slot, e) {
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
          form: Object.assign({}, s.form, {
            foto: Object.assign({}, s.form.foto, {
              [slot]: {
                src: url,
                before: before,
                after: bytes
              }
            })
          })
        }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  bukaRiwayat(id) {
    const w = this.state.warga.find(x => x.id === id);
    const last = w.snapshots[w.snapshots.length - 1].tanggal;
    this.setState({
      view: 'riwayat',
      selectedId: id,
      selectedTanggal: last,
      showSanggahanForm: false
    });
  }
  pilihTanggal(t) {
    this.setState({
      selectedTanggal: t,
      showSanggahanForm: false
    });
  }
  onKembali() {
    this.setState({
      view: 'daftar',
      selectedId: null,
      selectedTanggal: null,
      showSanggahanForm: false
    });
  }
  autoClear() {
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({
      toast: null
    }), 3600);
  }
  simpan() {
    if (!this.canCrud()) return;
    const f = this.state.form;
    if (!f.nama.trim() || !f.nik.trim()) {
      this.setState({
        toast: {
          type: 'err',
          msg: 'Nama dan NIK wajib diisi.'
        }
      });
      this.autoClear();
      return;
    }
    const data = this.formToData(f);
    const today = this.state.today;
    const operator = this.opName();
    const identity = {
      id: f.id,
      noKK: f.noKK,
      nik: f.nik,
      nama: f.nama,
      dusun: f.dusun,
      rt: f.rt,
      rw: f.rw,
      alamat: f.alamat,
      anggota: f.anggotaStr.split(',').map(x => x.trim()).filter(Boolean)
    };
    const foto = Object.assign({}, f.foto);
    this.setState(s => {
      const warga = s.warga.slice();
      const idx = warga.findIndex(w => w.id === f.id);
      const baru = idx < 0;
      if (baru) {
        warga.push(Object.assign({}, identity, data, {
          foto: foto,
          snapshots: [{
            tanggal: today,
            operator: operator,
            data: data,
            foto: foto,
            fieldYangBerubah: []
          }]
        }));
      } else {
        const w = warga[idx];
        let snaps = w.snapshots.slice();
        const before = snaps.filter(x => x.tanggal < today).sort((a, b) => a.tanggal < b.tanggal ? 1 : -1)[0];
        const diff = before ? this.computeDiff(before.data, data) : [];
        const snap = {
          tanggal: today,
          operator: operator,
          data: data,
          foto: foto,
          fieldYangBerubah: diff
        };
        const si = snaps.findIndex(x => x.tanggal === today);
        if (si >= 0) snaps[si] = snap;else snaps.push(snap);
        snaps.sort((a, b) => a.tanggal < b.tanggal ? -1 : 1);
        warga[idx] = Object.assign({}, w, identity, data, {
          foto: foto,
          snapshots: snaps
        });
      }
      const msg = baru ? 'Data warga baru tersimpan.' : 'Perubahan tersimpan. Snapshot ' + this.formatTanggal(today) + ' diperbarui.';
      return {
        warga: warga,
        view: 'riwayat',
        selectedId: f.id,
        selectedTanggal: today,
        form: null,
        editId: null,
        toast: {
          type: 'ok',
          msg: msg
        }
      };
    });
    this.autoClear();
  }
  onSanggahanChange(e) {
    const k = e.target.getAttribute('data-sgfield');
    const v = e.target.value;
    this.setState(s => ({
      sanggahanForm: Object.assign({}, s.sanggahanForm, {
        [k]: v
      })
    }));
  }
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
  }
  onTutupFormSanggahan() {
    this.setState({
      showSanggahanForm: false
    });
  }
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
    this.autoClear();
  }
  updateStatus(id, status) {
    if (!this.canCrud()) return;
    this.setState(s => ({
      sanggahan: s.sanggahan.map(x => x.id === id ? Object.assign({}, x, {
        status: status
      }) : x)
    }));
  }
  mulaiProses(id) {
    if (!this.canCrud()) return;
    this.setState({
      processingId: id,
      processCatatan: ''
    });
  }
  selesaikanSanggahan(id, status, catatan) {
    if (!this.canCrud()) return;
    this.setState(s => ({
      sanggahan: s.sanggahan.map(x => x.id === id ? Object.assign({}, x, {
        status: status,
        catatanOperator: catatan,
        tanggalSelesai: s.today
      }) : x),
      processingId: null,
      processCatatan: ''
    }));
  }
  renderVals() {
    const st = this.state;
    const auth = st.auth;
    const canCrud = this.canCrud();
    const namaDesa = this.props.namaDesa || 'Desa Sukamaju';
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
    const mkNav = (key, label) => {
      const active = st.view === key || key === 'daftar' && (st.view === 'form' || st.view === 'riwayat');
      return {
        label: label,
        onClick: () => this.nav(key),
        style: 'padding:0 18px;height:46px;font-family:inherit;font-size:13.5px;font-weight:' + (active ? '700' : '500') + ';border:none;border-bottom:2px solid ' + (active ? '#1e50d0' : 'transparent') + ';background:transparent;cursor:pointer;color:' + (active ? '#1e50d0' : '#52576b') + ';white-space:nowrap;'
      };
    };
    const sanggahanLabel = 'Sanggahan' + (sanggahanPending > 0 ? ' (' + sanggahanPending + ')' : '');
    const navItems = [mkNav('dashboard', 'Dashboard'), mkNav('daftar', 'Daftar Warga'), mkNav('sanggahan', sanggahanLabel)];
    const q = st.search.trim().toLowerCase();
    let list = vWarga.filter(w => {
      if (q && (w.nama + ' ' + w.nik + ' ' + w.noKK).toLowerCase().indexOf(q) < 0) return false;
      if (st.filterRt !== 'semua' && 'RT ' + w.rt + ' / RW ' + w.rw !== st.filterRt) return false;
      if (st.filterDesil !== 'semua') {
        if (st.filterDesil === 'prioritas') {
          if (w.desil > 4) return false;
        } else if (String(w.desil) !== st.filterDesil) return false;
      }
      if (st.filterBansos !== 'semua' && w.bansos !== st.filterBansos) return false;
      return true;
    });
    const wargaTampil = list.map(w => {
      const ds = this.getDS(w.desil);
      const bs = this.bansosStyle(w.bansos);
      const last = w.snapshots[w.snapshots.length - 1];
      const pt = last.fieldYangBerubah.length;
      return {
        id: w.id,
        nama: w.nama,
        nik: 'NIK ' + w.nik,
        rtRw: 'RT ' + w.rt + ' / RW ' + w.rw,
        dusun: w.dusun,
        pekerjaan: w.pekerjaan,
        penghasilan: this.rupiah(w.penghasilan) + ' /bln',
        desilLabel: 'Desil ' + w.desil,
        desilBadgeStyle: 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;color:' + ds.text + ';background:' + ds.bg + ';',
        bansos: w.bansos,
        bansosBadgeStyle: 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;color:' + bs.text + ';background:' + bs.bg + ';',
        jumlahTanggal: w.snapshots.length,
        adaPerubahanTerakhir: pt > 0,
        perubahanTerakhirStr: pt + ' field berubah',
        onLihat: () => this.bukaRiwayat(w.id),
        onEdit: () => this.mulaiEdit(w.id),
        onHover: e => {
          e.currentTarget.style.background = '#f9f9f7';
        },
        onLeave: e => {
          e.currentTarget.style.background = '';
        }
      };
    });
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
      asetList = [],
      fotoSlots = [];
    if (form) {
      const fd = form.desilManual ? Number(form.desil) : this.hitungDesil({
        penghasilan: Number(form.penghasilan || 0),
        lantai: form.lantai,
        dinding: form.dinding,
        atap: form.atap,
        sumberAir: form.sumberAir,
        penerangan: form.penerangan,
        aset: form.aset,
        pekerjaan: form.pekerjaan,
        pendidikan: form.pendidikan
      });
      const ds = this.getDS(fd);
      formDesilLabel = 'Desil ' + fd;
      formDesilStyle = 'display:inline-flex;align-items:center;padding:8px 18px;border-radius:20px;font-size:18px;font-weight:800;color:' + ds.text + ';background:' + ds.bg + ';';
      formDesilHint = form.desilManual ? '(input manual)' : 'dihitung otomatis';
      asetList = this.ASET.map(n => {
        const ch = form.aset.indexOf(n) >= 0;
        return {
          name: n,
          checked: ch,
          onToggle: () => this.toggleAset(n),
          labelStyle: 'display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid ' + (ch ? '#bfcef8' : '#e0e0de') + ';background:' + (ch ? '#eef2fc' : '#fafaf9') + ';color:' + (ch ? '#1e50d0' : '#3d4152') + ';'
        };
      });
      const sl = [['depan', 'Tampak Depan Rumah'], ['ruangTamu', 'Ruang Tamu'], ['kamarMandi', 'Kamar Mandi']];
      fotoSlots = sl.map(s => {
        const ft = form.foto[s[0]];
        const has = !!(ft && ft.src);
        return {
          key: s[0],
          label: s[1],
          hasFoto: has,
          kosong: !has,
          src: has ? ft.src : '',
          beforeStr: has ? this.formatBytes(ft.before) : '',
          afterStr: has ? this.formatBytes(ft.after) : '',
          ratio: has ? Math.round((1 - ft.after / ft.before) * 100) + '%' : '',
          onUpload: e => this.handleFoto(s[0], e),
          onHapus: () => this.hapusFoto(s[0])
        };
      });
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
        rtRw: 'RT ' + rw.rt + ' / RW ' + rw.rw + ' · ' + rw.dusun,
        desilLabel: 'Desil ' + rw.desil,
        desilStyle: 'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:700;color:' + ds.text + ';background:' + ds.bg + ';',
        bansosStyle: 'display:inline-flex;align-items:center;padding:6px 13px;border-radius:20px;font-size:13px;font-weight:600;color:' + bs.text + ';background:' + bs.bg + ';',
        bansos: rw.bansos,
        onEdit: () => this.mulaiEdit(rw.id)
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
          metaStr: awal ? 'Snapshot awal' : np > 0 ? np + ' field berubah' : 'Tidak ada perubahan',
          metaStyle: 'font-size:11.5px;font-weight:700;color:' + (awal ? '#9ba2b6' : np > 0 ? '#b45309' : '#9ba2b6') + ';',
          onClick: () => this.pilihTanggal(sn.tanggal),
          rowStyle: 'display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;border:none;cursor:pointer;padding:12px 14px;border-radius:10px;font-family:inherit;background:' + (active ? '#eef2fc' : 'transparent') + ';border-left:3px solid ' + (active ? '#1e50d0' : 'transparent') + ';'
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
      toastStyle = 'position:fixed;right:20px;bottom:20px;z-index:60;padding:13px 18px;border-radius:12px;font-size:13px;font-weight:600;color:#fff;max-width:380px;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:tslide 0.25s ease;background:' + (ok ? '#16a34a' : '#dc2626') + ';';
    }
    return {
      auth: auth,
      canCrud: canCrud,
      roleLabel: auth ? auth.role : '',
      wilayahLabel: auth && auth.wilayah ? auth.wilayah : '',
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
      filterRt: st.filterRt,
      filterDesil: st.filterDesil,
      filterBansos: st.filterBansos,
      filterSanggahan: st.filterSanggahan,
      onSearch: e => this.onSearch(e),
      onFilter: e => this.onFilter(e),
      onTambah: () => this.onTambah(),
      rtOptions: rtOptions,
      desilFilterOpts: desilFilterOpts,
      bansosFilterOpts: bansosFilterOpts,
      sgFilterOpts: sgFilterOpts,
      wargaTampil: wargaTampil,
      kosong: wargaTampil.length === 0,
      jumlahTampil: wargaTampil.length,
      jumlahTotal: vWarga.length,
      statTotal: statTotal,
      statPrioritas: statPrioritas,
      statBansos: statBansos,
      statPerubahan: perubahanList.length,
      statSanggahan: sanggahanPending,
      desilBars: desilBars,
      perubahanList: perubahanList,
      tidakAdaPerubahan: perubahanList.length === 0,
      form: form || {
        noKK: '',
        nik: '',
        nama: '',
        dusun: '',
        rt: '',
        rw: '',
        alamat: '',
        anggotaStr: '',
        jumlahAnggota: '',
        disabilitas: 'Tidak Ada',
        pekerjaan: '',
        pendidikan: '',
        penghasilan: '',
        statusRumah: '',
        lantai: '',
        dinding: '',
        atap: '',
        sumberAir: '',
        penerangan: '',
        aset: [],
        bansos: '',
        desilManual: false,
        desil: '',
        foto: this.emptyFoto()
      },
      formDesilLabel: formDesilLabel,
      formDesilStyle: formDesilStyle,
      formDesilHint: formDesilHint,
      asetList: asetList,
      fotoSlots: fotoSlots,
      onFormChange: e => this.onFormChange(e),
      onSimpan: () => this.simpan(),
      onBatal: () => this.onBatal(),
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
      toastStyle: toastStyle
    };
  }
  renderLogin() {
    const lf = this.state.loginForm;
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
      u: 'sls.krajan',
      p: 'sls123',
      note: 'Hanya-lihat · Dusun Krajan'
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
      style: css('padding:12px; font-family:inherit; font-size:14px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:9px; cursor:pointer; margin-top:2px;')
    }, "Masuk")), /*#__PURE__*/React.createElement("div", {
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
  }
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
      style: css('position:sticky; top:0; z-index:30; background:#fff; border-bottom:1px solid #e8e8e6; height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; gap:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:11px; flex:none;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:34px; height:34px; border-radius:9px; background:#1e50d0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; letter-spacing:-0.03em; flex:none;')
    }, "DT"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px; font-weight:800; color:#18191f; letter-spacing:-0.02em; line-height:1.2;')
    }, "DTSEN Desa"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; font-weight:500; line-height:1.2;')
    }, V.namaDesa))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:10px; flex:none;')
    }, !V.canCrud && /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; font-weight:700; color:#52576b; background:#f0f0ef; border:1px solid #e0e0de; padding:5px 10px; border-radius:20px; white-space:nowrap;')
    }, "Hanya-Lihat"), V.canCrud && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.confirm('Pulihkan data contoh? Semua perubahan tersimpan akan dihapus.')) this.resetStore();
      },
      title: "Pulihkan data contoh dan hapus data tersimpan",
      style: css('font-size:12px; font-weight:600; color:#52576b; background:#f3f3f2; border:1px solid #e8e8e6; padding:5px 11px; border-radius:7px; cursor:pointer; white-space:nowrap;')
    }, "Reset data"), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:8px; padding-left:10px; border-left:1px solid #e8e8e6;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('width:32px; height:32px; border-radius:50%; background:#eef2fc; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#1e50d0; flex:none;'),
      title: V.namaOperator
    }, V.opInitials), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; line-height:1.25;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px; font-weight:700; color:#18191f; white-space:nowrap;')
    }, V.namaOperator), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px; color:#9ba2b6; white-space:nowrap;')
    }, V.roleLabel, V.wilayahLabel ? ' · ' + V.wilayahLabel : ''))), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.logout(),
      title: "Keluar",
      style: css('font-size:12px; font-weight:600; color:#b91c1c; background:#fff; border:1px solid #f0c9c9; padding:6px 11px; border-radius:7px; cursor:pointer; white-space:nowrap;')
    }, "Keluar"))), /*#__PURE__*/React.createElement("div", {
      style: css('position:sticky; top:58px; z-index:29; background:#fff; border-bottom:1px solid #e8e8e6; overflow-x:auto; -webkit-overflow-scrolling:touch;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; min-width:max-content; padding:0 20px;')
    }, V.navItems.map((item, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: item.onClick,
      style: css(item.style)
    }, item.label)))), /*#__PURE__*/React.createElement("main", {
      style: css('flex:1; padding:24px 20px; max-width:1200px; width:100%; margin:0 auto;')
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
    }, "+ Tambah Data")), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); overflow-x:auto;')
    }, /*#__PURE__*/React.createElement("table", {
      style: css('width:100%; border-collapse:collapse; min-width:720px;')
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: css('background:#fafaf9; border-bottom:1px solid #eeeeed;')
    }, /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Kepala Keluarga"), /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Alamat"), /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Pekerjaan"), /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Desil"), /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Bansos"), /*#__PURE__*/React.createElement("th", {
      style: css(th)
    }, "Riwayat"), /*#__PURE__*/React.createElement("th", {
      style: css('text-align:right; padding:12px 16px; font-size:11px; font-weight:700; color:#9ba2b6; text-transform:uppercase; letter-spacing:0.06em;')
    }, "Aksi"))), /*#__PURE__*/React.createElement("tbody", null, V.wargaTampil.map((w, i) => /*#__PURE__*/React.createElement("tr", {
      key: w.id,
      style: css('border-top:1px solid #f0f0ee;'),
      onMouseEnter: w.onHover,
      onMouseLeave: w.onLeave
    }, /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f;')
    }, w.nama), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; margin-top:2px; font-variant-numeric:tabular-nums;')
    }, w.nik)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px; font-weight:600; color:#3d4152;')
    }, w.rtRw), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; margin-top:2px;')
    }, w.dusun)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px; font-weight:600; color:#3d4152;')
    }, w.pekerjaan), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#9ba2b6; margin-top:2px; font-variant-numeric:tabular-nums;')
    }, w.penghasilan)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css(w.desilBadgeStyle)
    }, w.desilLabel)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css(w.bansosBadgeStyle)
    }, w.bansos)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px; font-weight:600; color:#3d4152;')
    }, w.jumlahTanggal, " snapshot"), w.adaPerubahanTerakhir && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px; color:#b45309; font-weight:700; margin-top:2px;')
    }, w.perubahanTerakhirStr)), /*#__PURE__*/React.createElement("td", {
      style: css('padding:13px 16px; vertical-align:middle;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; gap:6px; justify-content:flex-end;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: w.onLihat,
      style: css('padding:7px 12px; font-family:inherit; font-size:12px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')
    }, "Riwayat"), V.canCrud && /*#__PURE__*/React.createElement("button", {
      onClick: w.onEdit,
      style: css('padding:7px 12px; font-family:inherit; font-size:12px; font-weight:600; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')
    }, "Edit"))))))), V.kosong && /*#__PURE__*/React.createElement("div", {
      style: css('padding:40px; text-align:center; color:#9ba2b6; font-size:13.5px;')
    }, "Tidak ada rumah tangga yang cocok.")), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6;')
    }, "Menampilkan ", V.jumlahTampil, " dari ", V.jumlahTotal, " rumah tangga")), V.isForm && /*#__PURE__*/React.createElement("div", {
      style: css('max-width:880px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:flex-start; gap:8px; background:#eef2fc; border:1px solid #c7d7f6; border-radius:10px; padding:12px 15px; margin-bottom:18px; font-size:12.5px; color:#1a3f99; line-height:1.5;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-weight:700; white-space:nowrap;')
    }, "Snapshot:"), /*#__PURE__*/React.createElement("span", null, "Simpan akan membuat / menimpa snapshot tanggal ", /*#__PURE__*/React.createElement("strong", null, V.tanggalHariIni), ". Perbedaan dengan hari sebelumnya tercatat otomatis di Riwayat.")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; display:block; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f0ee;')
    }, "1 · Identitas Keluarga"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "No. Kartu Keluarga"), /*#__PURE__*/React.createElement("input", {
      "data-field": "noKK",
      value: V.form.noKK,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "NIK Kepala Keluarga"), /*#__PURE__*/React.createElement("input", {
      "data-field": "nik",
      value: V.form.nik,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", {
      style: css('grid-column:1/-1;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Nama Kepala Keluarga"), /*#__PURE__*/React.createElement("input", {
      "data-field": "nama",
      value: V.form.nama,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Dusun"), /*#__PURE__*/React.createElement("select", {
      "data-field": "dusun",
      value: V.form.dusun,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Dusun Krajan"), /*#__PURE__*/React.createElement("option", null, "Dusun Ngasem"), /*#__PURE__*/React.createElement("option", null, "Dusun Sukamulya"))), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid;grid-template-columns:1fr 1fr;gap:12px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "RT"), /*#__PURE__*/React.createElement("input", {
      "data-field": "rt",
      value: V.form.rt,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "RW"), /*#__PURE__*/React.createElement("input", {
      "data-field": "rw",
      value: V.form.rw,
      onChange: V.onFormChange,
      style: css(inp)
    }))), /*#__PURE__*/React.createElement("div", {
      style: css('grid-column:1/-1;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Alamat"), /*#__PURE__*/React.createElement("input", {
      "data-field": "alamat",
      value: V.form.alamat,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Jumlah Anggota"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      "data-field": "jumlahAnggota",
      value: V.form.jumlahAnggota,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Status Disabilitas"), /*#__PURE__*/React.createElement("select", {
      "data-field": "disabilitas",
      value: V.form.disabilitas,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Tidak Ada"), /*#__PURE__*/React.createElement("option", null, "Ada"))), /*#__PURE__*/React.createElement("div", {
      style: css('grid-column:1/-1;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Nama Anggota (pisahkan koma)"), /*#__PURE__*/React.createElement("input", {
      "data-field": "anggotaStr",
      value: V.form.anggotaStr,
      onChange: V.onFormChange,
      style: css(inp)
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Pekerjaan"), /*#__PURE__*/React.createElement("select", {
      "data-field": "pekerjaan",
      value: V.form.pekerjaan,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Tidak Bekerja"), /*#__PURE__*/React.createElement("option", null, "Buruh Tani"), /*#__PURE__*/React.createElement("option", null, "Buruh Harian"), /*#__PURE__*/React.createElement("option", null, "Petani"), /*#__PURE__*/React.createElement("option", null, "Pedagang"), /*#__PURE__*/React.createElement("option", null, "Nelayan"), /*#__PURE__*/React.createElement("option", null, "Tukang Bangunan"), /*#__PURE__*/React.createElement("option", null, "Pengrajin"), /*#__PURE__*/React.createElement("option", null, "Sopir"), /*#__PURE__*/React.createElement("option", null, "Guru Honorer"), /*#__PURE__*/React.createElement("option", null, "Wiraswasta"), /*#__PURE__*/React.createElement("option", null, "PNS"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Pendidikan Terakhir"), /*#__PURE__*/React.createElement("select", {
      "data-field": "pendidikan",
      value: V.form.pendidikan,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Tidak Sekolah"), /*#__PURE__*/React.createElement("option", null, "SD"), /*#__PURE__*/React.createElement("option", null, "SMP"), /*#__PURE__*/React.createElement("option", null, "SMA"), /*#__PURE__*/React.createElement("option", null, "D3"), /*#__PURE__*/React.createElement("option", null, "S1"))), /*#__PURE__*/React.createElement("div", {
      style: css('grid-column:1/-1;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Estimasi Penghasilan Bulanan (Rp)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      "data-field": "penghasilan",
      value: V.form.penghasilan,
      onChange: V.onFormChange,
      style: css(inp)
    })))), /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; display:block; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f0ee;')
    }, "2 · Kondisi Rumah"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Status Kepemilikan"), /*#__PURE__*/React.createElement("select", {
      "data-field": "statusRumah",
      value: V.form.statusRumah,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Milik Sendiri"), /*#__PURE__*/React.createElement("option", null, "Sewa/Kontrak"), /*#__PURE__*/React.createElement("option", null, "Numpang"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Lantai"), /*#__PURE__*/React.createElement("select", {
      "data-field": "lantai",
      value: V.form.lantai,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Tanah"), /*#__PURE__*/React.createElement("option", null, "Semen"), /*#__PURE__*/React.createElement("option", null, "Keramik/Ubin"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Dinding"), /*#__PURE__*/React.createElement("select", {
      "data-field": "dinding",
      value: V.form.dinding,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Bambu/Kayu"), /*#__PURE__*/React.createElement("option", null, "Setengah Tembok"), /*#__PURE__*/React.createElement("option", null, "Tembok"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Atap"), /*#__PURE__*/React.createElement("select", {
      "data-field": "atap",
      value: V.form.atap,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Daun/Rumbia"), /*#__PURE__*/React.createElement("option", null, "Seng/Asbes"), /*#__PURE__*/React.createElement("option", null, "Genteng/Beton"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Sumber Air Minum"), /*#__PURE__*/React.createElement("select", {
      "data-field": "sumberAir",
      value: V.form.sumberAir,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Sungai/Hujan"), /*#__PURE__*/React.createElement("option", null, "Sumur"), /*#__PURE__*/React.createElement("option", null, "PDAM/Ledeng"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Penerangan"), /*#__PURE__*/React.createElement("select", {
      "data-field": "penerangan",
      value: V.form.penerangan,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Non-PLN"), /*#__PURE__*/React.createElement("option", null, "PLN 450 VA"), /*#__PURE__*/React.createElement("option", null, "PLN 900+ VA"))))), /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; display:block; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f0ee;')
    }, "3 · Kepemilikan Aset"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:9px;')
    }, V.asetList.map((a, i) => /*#__PURE__*/React.createElement("label", {
      key: i,
      style: css(a.labelStyle)
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: a.checked,
      onChange: a.onToggle,
      style: css('width:14px;height:14px;accent-color:#1e50d0;cursor:pointer;flex:none;')
    }), a.name)))), /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; display:block; margin-bottom:5px;')
    }, "4 · Foto Rumah"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6; display:block; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f0ee;')
    }, "3 foto wajib · dikompres otomatis di perangkat (≤1024px, target <200KB)"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px;')
    }, V.fotoSlots.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: css('display:flex; flex-direction:column; gap:8px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; font-weight:600; color:#52576b;')
    }, s.label), s.hasFoto && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('height:148px; border-radius:10px; overflow:hidden; background:#0c1422;')
    }, /*#__PURE__*/React.createElement("img", {
      src: s.src,
      style: css('width:100%;height:100%;object-fit:cover;display:block;')
    })), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; justify-content:space-between; align-items:center; margin-top:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px; color:#52576b; font-family:Menlo,monospace;')
    }, s.beforeStr, " → ", s.afterStr), /*#__PURE__*/React.createElement("button", {
      onClick: s.onHapus,
      style: css('font-size:11.5px; color:#dc2626; background:none; border:none; cursor:pointer; font-weight:700; font-family:inherit; padding:0;')
    }, "Hapus")), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:11px; color:#16a34a; font-weight:700; display:block; margin-top:3px;')
    }, "Hemat ", s.ratio)), s.kosong && /*#__PURE__*/React.createElement("label", {
      style: css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;height:148px;border:1.5px dashed #d4d4d0;border-radius:10px;background:repeating-linear-gradient(45deg,#f7f7f5,#f7f7f5 8px,#fafaf9 8px,#fafaf9 16px);cursor:pointer;text-align:center;padding:12px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13px; font-weight:700; color:#52576b;')
    }, "Unggah Foto"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10.5px; color:#9ba2b6; font-family:Menlo,monospace;')
    }, "auto-kompres <200 KB"), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      onChange: s.onUpload,
      style: css('display:none;')
    })))))), /*#__PURE__*/React.createElement("div", {
      style: css(card)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('font-size:13.5px; font-weight:700; color:#18191f; display:block; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid #f0f0ee;')
    }, "5 · Desil Ekonomi & Status Bansos"), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:20px; align-items:start;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:12px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; align-items:center; gap:12px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css(V.formDesilStyle)
    }, V.formDesilLabel), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12px; color:#9ba2b6; font-style:italic;')
    }, V.formDesilHint)), /*#__PURE__*/React.createElement("label", {
      style: css('display:flex; align-items:center; gap:9px; font-size:13px; color:#3d4152; cursor:pointer;')
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "data-field": "desilManual",
      checked: V.form.desilManual,
      onChange: V.onFormChange,
      style: css('width:15px;height:15px;accent-color:#1e50d0;cursor:pointer;')
    }), "Override desil manual"), V.form.desilManual && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Desil Manual"), /*#__PURE__*/React.createElement("select", {
      "data-field": "desil",
      value: V.form.desil,
      onChange: V.onFormChange,
      style: css('width:180px;padding:10px 12px;border:1.5px solid #e0e0de;border-radius:9px;font-family:inherit;font-size:14px;color:#18191f;background:#fafaf9;cursor:pointer;')
    }, /*#__PURE__*/React.createElement("option", {
      value: "1"
    }, "Desil 1"), /*#__PURE__*/React.createElement("option", {
      value: "2"
    }, "Desil 2"), /*#__PURE__*/React.createElement("option", {
      value: "3"
    }, "Desil 3"), /*#__PURE__*/React.createElement("option", {
      value: "4"
    }, "Desil 4"), /*#__PURE__*/React.createElement("option", {
      value: "5"
    }, "Desil 5"), /*#__PURE__*/React.createElement("option", {
      value: "6"
    }, "Desil 6"), /*#__PURE__*/React.createElement("option", {
      value: "7"
    }, "Desil 7"), /*#__PURE__*/React.createElement("option", {
      value: "8"
    }, "Desil 8"), /*#__PURE__*/React.createElement("option", {
      value: "9"
    }, "Desil 9"), /*#__PURE__*/React.createElement("option", {
      value: "10"
    }, "Desil 10")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: css(lab)
    }, "Status Penerima Bansos"), /*#__PURE__*/React.createElement("select", {
      "data-field": "bansos",
      value: V.form.bansos,
      onChange: V.onFormChange,
      style: css(inpSel)
    }, /*#__PURE__*/React.createElement("option", null, "Tidak Ada"), /*#__PURE__*/React.createElement("option", null, "PKH"), /*#__PURE__*/React.createElement("option", null, "BPNT"), /*#__PURE__*/React.createElement("option", null, "PKH + BPNT")))))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; justify-content:flex-end; gap:10px; margin-top:18px; padding-top:16px;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onBatal,
      style: css('padding:11px 20px; font-family:inherit; font-size:13.5px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:9px; cursor:pointer;')
    }, "Batal"), /*#__PURE__*/React.createElement("button", {
      onClick: V.onSimpan,
      style: css('padding:11px 24px; font-family:inherit; font-size:13.5px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:9px; cursor:pointer;')
    }, "Simpan & Buat Snapshot"))), V.isRiwayat && V.riwayatWarga && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-direction:column; gap:14px; animation:fadein 0.2s ease;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: V.onKembali,
      style: css('align-self:flex-start; display:inline-flex; align-items:center; gap:5px; padding:8px 14px; font-family:inherit; font-size:13px; font-weight:600; border:1.5px solid #e0e0de; background:#fff; color:#3d4152; border-radius:8px; cursor:pointer;')
    }, "‹ Kembali ke Daftar"), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff; border-radius:14px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.05); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:20px; font-weight:800; color:#18191f; letter-spacing:-0.02em;')
    }, V.riwayatWarga.nama), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex; flex-wrap:wrap; gap:12px; margin-top:6px;')
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
    }, V.riwayatWarga.bansos), V.canCrud && /*#__PURE__*/React.createElement("button", {
      onClick: V.riwayatWarga.onEdit,
      style: css('padding:9px 16px; font-family:inherit; font-size:13px; font-weight:700; border:none; background:#1e50d0; color:#fff; border-radius:8px; cursor:pointer;')
    }, "Edit Data"))), /*#__PURE__*/React.createElement("div", {
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
    }, d.ke))))), V.selectedSnap.snapAwal && /*#__PURE__*/React.createElement("div", {
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
    }, "Kirim Sanggahan"))))))), V.isSanggahan && /*#__PURE__*/React.createElement("div", {
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
    }, "Tidak ada sanggahan yang cocok dengan filter."))), V.toast && /*#__PURE__*/React.createElement("div", {
      style: css(V.toastStyle)
    }, V.toast.msg));
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(Component, {
  namaDesa: "Desa Sukamaju",
  namaOperator: "Budi Santoso"
}));