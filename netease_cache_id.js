// 网易云 - 缓存歌曲ID (配合酷我换源使用)
// 拦截歌曲详情请求, 把ID存到persistentStore
(function(){
  try{
    const m=$request.url.match(/[?&]id=(\d+)/);
    if(m){
      $persistentStore.write(m[1],'netease_last_song_id');
      console.log('[Kuwo] Cached songId='+m[1]);
    }
  }catch(e){}
  $done({});
})();
