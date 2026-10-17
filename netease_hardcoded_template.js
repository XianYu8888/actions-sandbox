// 网易云SVIP换头 (硬编码版模板)
// 使用方法: 把下面 __FILL_YOUR_COOKIE__ 替换成你的 Cookie 整串, 保存后托管使用
// Cookie格式: MUSIC_U=xxx; __csrf=yyy; ...

var headers = $request.headers;

var MY_COOKIE = "__FILL_YOUR_COOKIE__";
var MY_UA = "__FILL_YOUR_UA__";
var MY_MCONFIG = '__FILL_YOUR_MCONFIG__';

// 从Cookie里提MUSIC_U给x-music-u
var mu = "";
var m = MY_COOKIE.match(/MUSIC_U=([^;]+)/);
if (m) mu = m[1];

if (headers['Cookie'] !== undefined) {
  headers['Cookie'] = MY_COOKIE;
} else {
  headers['cookie'] = MY_COOKIE;
}
if (headers['User-Agent'] !== undefined) {
  headers['User-Agent'] = MY_UA;
} else {
  headers['user-agent'] = MY_UA;
}
if (headers['MConfig-Info'] !== undefined) {
  headers['MConfig-Info'] = MY_MCONFIG;
} else {
  headers['mconfig-info'] = MY_MCONFIG;
}
if (mu) {
  headers['x-music-u'] = mu;
  headers['X-Music-U'] = mu;
}

$done({headers: headers});
