// 网易云音乐 - 酷我音源替换 (Surge http-response 脚本)
// 拦截 /player/url 响应, URL 为空时自动从酷我取 128k MP3 替换

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
    // 1. 网易取歌名/歌手
    const detailUrl = `https://music.163.com/api/song/detail/?id=${neteaseId}&ids=[${neteaseId}]`;
    const detail = await httpGet(detailUrl);
    if (!detail) return null;
    const title = extractJsonStr(detail, '"name":"');
    if (!title) return null;
    // 歌手 (取第一个)
    let artist = extractJsonStr(detail, '"artists":[{"name":"');
    if (!artist) artist = '';

    // 2. 酷我搜索
    const query = encodeURIComponent(title + ' ' + artist);
    const searchUrl = `http://search.kuwo.cn/r.s?all=${query}&ft=music&itemset=web_2013&client=kt&pn=0&rn=1&rformat=json&encoding=utf8`;
    const searchResult = await httpGet(searchUrl);
    if (!searchResult) return null;
    const musicRid = extractJsonStr(searchResult, '"MUSICRID":"');
    if (!musicRid) return null;

    // 3. 取 128k MP3 地址
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
    const body = JSON.parse($response.body);
    if (!body.data || !body.data[0]) { $done({}); return; }
    const item = body.data[0];
    if (item.url) { $done({}); return; } // 有 URL, 不用换

    // 提取歌曲 ID
    const urlMatch = $request.url.match(/ids=%5B(\d+)%5D|ids=\[(\d+)\]/);
    const songId = urlMatch ? (urlMatch[1] || urlMatch[2]) : null;
    if (!songId) { $done({}); return; }

    const kuwoUrl = await fetchKuwoUrl(songId);
    if (!kuwoUrl) { $done({}); return; }

    item.url = kuwoUrl;
    item.code = 200;
    item.br = 128000;
    item.type = 'mp3';
    item.size = 0;
    item.md5 = null;
    item.level = 'standard';

    $done({body: JSON.stringify(body)});
  } catch (e) {
    $done({});
  }
})();
