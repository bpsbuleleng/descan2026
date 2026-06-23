// ---------------------------------------------------------------------------
// css(): parse an inline-style string ("a:b;c:d") into a React style object.
// Keeps the design's style strings usable verbatim as style={css("...")}.
// ---------------------------------------------------------------------------
function css(str){
  const o={};
  if(!str) return o;
  String(str).split(';').forEach(d=>{
    d=d.trim(); if(!d) return;
    const i=d.indexOf(':'); if(i<0) return;
    const k=d.slice(0,i).trim(), v=d.slice(i+1).trim();
    let prop;
    if(k.charAt(0)==='-'){
      prop=k.replace(/^-/,'').replace(/-([a-z])/g,(m,c)=>c.toUpperCase());
      prop=prop.charAt(0).toUpperCase()+prop.slice(1);
    } else {
      prop=k.replace(/-([a-z])/g,(m,c)=>c.toUpperCase());
    }
    o[prop]=v;
  });
  return o;
}

// ---------------------------------------------------------------------------
// Path helpers for the nested FASIH form ("rumah.lantaiBahan",
// "anggota.2.disabilitas.fisik", "meteran.0.idPelanggan"). Immutable setPath
// clones along the path so React state updates stay pure.
// ---------------------------------------------------------------------------
function getPath(obj,path){ var p=String(path).split('.'),c=obj; for(var i=0;i<p.length;i++){ if(c==null) return undefined; c=c[p[i]]; } return c; }
function setPath(obj,path,val){
  var p=String(path).split('.');
  var root=Array.isArray(obj)?obj.slice():Object.assign({},obj); var c=root;
  for(var i=0;i<p.length-1;i++){ var k=p[i]; var nx=c[k]; c[k]=Array.isArray(nx)?nx.slice():Object.assign({},nx||{}); c=c[k]; }
  c[p[p.length-1]]=val; return root;
}
