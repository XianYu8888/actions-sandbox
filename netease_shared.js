// 网易云共享会员 (Surge版, 转自Loon插件)
// Cookie等从 $persistentStore 读取, 在Surge脚本编辑器里设置
// 键名: 163_Cookie, 163_User-Agent, 163_MConfig-Info
// 另需 x-music-u: 163_MUSIC_U (从Cookie里提MUSIC_U值即可)

var headers = $request.headers;

var ck = $persistentStore.read("163_Cookie");
var ua = $persistentStore.read("163_User-Agent");
var mi = $persistentStore.read("163_MConfig-Info");
var mu = $persistentStore.read("163_MUSIC_U");

if (!ck) {
  console.log('[Shared] No 163_Cookie in persistentStore, passthrough');
  $done({});
} else {
  if (headers['Cookie'] != undefined) {
    headers['Cookie'] = ck;
  } else {
    headers['cookie'] = ck;
  }
  if (ua) {
    if (headers['User-Agent'] != undefined) {
      headers['User-Agent'] = ua;
    } else {
      headers['user-agent'] = ua;
    }
  }
  if (mi) {
    if (headers['MConfig-Info'] != undefined) {
      headers['MConfig-Info'] = mi;
    } else {
      headers['mconfig-info'] = mi;
    }
  }
  if (mu) {
    headers['x-music-u'] = mu;
    headers['X-Music-U'] = mu;
  }
  $done({ 'headers': headers });
}
