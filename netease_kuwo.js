// 网易云酷我换源 v5 - 正式版
// 机制已验证: App接受明文JSON替换xeapi加密响应
// TODO: songId从加密body解密, 目前先用URL参数尝试

function httpGet(url){
  return new Promise((resolve)=>{
    $httpClient.get({url:url,timeout:8},(err,resp,data)=>{
      if(err||!data){resolve(null);return;}
      resolve(typeof data==='string'?data:String(data));
    });
  });
}
function extractJsonStr(json,key){
  const idx=json.indexOf(key);
  if(idx<0)return null;
  const start=idx+key.length;
  const end=json.indexOf('"',start);
  if(end<0)return null;
  return json.substring(start,end).replace(/\\"/g,'"');
}
async function fetchKuwoUrl(neteaseId){
  try{
    const detail=await httpGet(`https://music.163.com/api/song/detail/?id=${neteaseId}&ids=[${neteaseId}]`);
    if(!detail)return null;
    const title=extractJsonStr(detail,'"name":"');
    if(!title)return null;
    let artist=extractJsonStr(detail,'"artists":[{"name":"')||'';
    console.log(`[Kuwo] Search: ${title} - ${artist}`);
    const query=encodeURIComponent(title+' '+artist);
    const sr=await httpGet(`http://search.kuwo.cn/r.s?all=${query}&ft=music&itemset=web_2013&client=kt&pn=0&rn=1&rformat=json&encoding=utf8`);
    if(!sr)return null;
    const rid=extractJsonStr(sr,'"MUSICRID":"');
    if(!rid)return null;
    console.log(`[Kuwo] RID: ${rid}`);
    const mp3=await httpGet(`http://antiserver.kuwo.cn/anti.s?type=convert_url&rid=${rid}&format=mp3`);
    if(!mp3||!mp3.trim().startsWith('http'))return null;
    return mp3.trim();
  }catch(e){console.log('[Kuwo] fetch error: '+e.message);return null;}
}
(async()=>{
  try{
    // 尝试从URL获取songId (部分接口带明文参数)
    let songId=null;
    const um=$request.url.match(/ids?=%5B(\d+)%5D|ids?=\[(\d+)\]|id=(\d+)/);
    if(um)songId=um[1]||um[2]||um[3];
    // 尝试从请求体获取 (如果是明文)
    if(!songId&&$request.body){
      const bm=$request.body.match(/"ids?":"?\[?(\d+)/);
      if(bm)songId=bm[1];
    }
    if(!songId){
      console.log('[Kuwo] No songId, passthrough');
      $done({});
      return;
    }
    console.log('[Kuwo] songId='+songId);
    const kuwoUrl=await fetchKuwoUrl(songId);
    if(!kuwoUrl){
      console.log('[Kuwo] Kuwo lookup failed');
      $done({});
      return;
    }
    console.log('[Kuwo] Replacing with: '+kuwoUrl.substring(0,50));
    const fakeBody=JSON.stringify({code:200,data:[{id:parseInt(songId),url:kuwoUrl,br:128000,type:'mp3',code:200,level:'standard'}]});
    $done({body:fakeBody});
  }catch(e){
    console.log('[Kuwo] Error: '+e.message);
    $done({});
  }
})();
