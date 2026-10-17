// 网易云酷我换源 - 硬编码测试版
// 不管什么歌, 统一返回酷我《稻香》128k, 验证替换机制是否生效
(async()=>{
  try{
    console.log('[Kuwo] TEST: replacing with fixed Kuwo URL');
    const kuwoUrl='https://kw-er.kuwo.cn/185faca481a620944917f34e53e8af2a/6ad3831f/resource/30106/trackmedia/M500004PbtOD3b2whF.mp3';
    // xeapi响应是加密的, 直接返回明文JSON测试App是否接受
    // 如果App能播出声(哪怕是稻香), 说明替换机制通了
    const fakeBody=JSON.stringify({code:200,data:[{id:0,url:kuwoUrl,br:128000,type:'mp3',code:200,level:'standard'}]});
    console.log('[Kuwo] TEST: returning fake body len='+fakeBody.length);
    $done({body:fakeBody});
  }catch(e){
    console.log('[Kuwo] TEST Error: '+e.message);
    $done({});
  }
})();
