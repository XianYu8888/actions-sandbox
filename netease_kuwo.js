// 网易云音乐 - 酷我音源替换 (Surge http-response 脚本)
// v2: 不解密响应, 直接按歌曲ID从酷我取源替换 (测试版)

function httpGet(url) {
  return new Promise((resolve) => {
    $httpClient.get({url: url, timeout: 8}, (err, resp, data) => {
      if (err || !data) { resolve(null); return; }
      resolve(typeof data === 'string' ? data : String(data));
    });
  });
}

function extractJsonStr(json, key) {
  const idx = json.indexOf(key);
  if (idx < 0) return null;
  const start = idx + key.length;
  const end = json.indexOf('"', start);
  if (end < 0) return null;
  return json.substring(start, end).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

async function fetchKuwoUrl(neteaseId) {
  try {
    const detailUrl = `https://music.163.com/api/song/detail/?id=${neteaseId}&ids=[${neteaseId}]`;
    const detail = await httpGet(detailUrl);
    if (!detail) return null;
    const title = extractJsonStr(detail, '"name":"');
    if (!title) return null;
    let artist = extractJsonStr(detail, '"artists":[{"name":"');
    if (!artist) artist = '';
    const query = encodeURIComponent(title + ' ' + artist);
    const searchUrl = `http://search.kuwo.cn/r.s?all=${query}&ft=music&itemset=web_2013&client=kt&pn=0&rn=1&rformat=json&encoding=utf8`;
    const searchResult = await httpGet(searchUrl);
    if (!searchResult) return null;
    const musicRid = extractJsonStr(searchResult, '"MUSICRID":"');
    if (!musicRid) return null;
    const antiUrl = `http://antiserver.kuwo.cn/anti.s?type=convert_url&rid=${musicRid}&format=mp3`;
    const mp3Url = await httpGet(antiUrl);
    if (!mp3Url || !mp3Url.trim().startsWith('http')) return null;
    return mp3Url.trim();
  } catch (e) {
    return null;
  }
}

(async () => {
  try {
    // 从请求URL提取歌曲ID (xeapi的body是加密的, 从URL参数取)
    // xeapi的songId在加密body里, 取不到, 尝试从其他地方获取
    // 先直接返回, 记录日志确认脚本触发
    console.log('[Kuwo] Script triggered for: ' + $request.url);
    $done({});
  } catch (e) {
    console.log('[Kuwo] Error: ' + e.message);
    $done({});
  }
})();
