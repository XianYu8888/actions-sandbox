// ncm_vip.js - 网易云共享会员 9.6+适配版
// 从 Loon [Argument] 读取: 163_Cookie / 163_User-Agent / 163_MConfig-Info
// 兼容 xeapi 路径与 x-music-u 请求头

var headers = $request.headers;

// Loon Argument 读取 (兼容 $argument 与 $persistentStore)
function getArg(key) {
  try {
    if (typeof $argument !== 'undefined' && $argument[key]) return $argument[key];
  } catch(e) {}
  try {
    var v = $persistentStore.read(key);
    if (v) return v;
  } catch(e) {}
  return "";
}

var ck = getArg("163_Cookie");
var ua = getArg("163_User-Agent");
var mi = getArg("163_MConfig-Info");

if (!ck) {
  console.log('[NCM] No 163_Cookie, passthrough');
  $done({});
} else {
  // Cookie (大小写兼容)
  if (headers['Cookie'] !== undefined) {
    headers['Cookie'] = ck;
  } else {
    headers['cookie'] = ck;
  }
  // User-Agent
  if (ua) {
    if (headers['User-Agent'] !== undefined) {
      headers['User-Agent'] = ua;
    } else {
      headers['user-agent'] = ua;
    }
  }
  // MConfig-Info
  if (mi) {
    if (headers['MConfig-Info'] !== undefined) {
      headers['MConfig-Info'] = mi;
    } else {
      headers['mconfig-info'] = mi;
    }
  }
  // x-music-u (9.6+ 独立头, 从Cookie提取MUSIC_U)
  var m = ck.match(/MUSIC_U=([^;]+)/);
  if (m) {
    headers['x-music-u'] = m[1];
    headers['X-Music-U'] = m[1];
  }
  $done({headers: headers});
}
