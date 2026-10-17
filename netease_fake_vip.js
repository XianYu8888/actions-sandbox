// 网易云本地VIP伪造 - 重放真VIP响应
// 拦截 vip/info, 返回预存的VIP密文, App解密后看到isVip=true

const VIP_B64 = "Z1oGp0Z9Xll/iN9OP3xhGwiqgG1m9+nFmNjBXWVfpKFMR1oeBg3b23GO5nXEjPlo20eE3SgJ6GBowxxVoACrnuG1vNQSPP3wb8ykcYh6gE9QbzvUqxzu3BneRKKryKclS8/Bg3yTp3a69xaPVXYJRVI69H1dTLYcEvKx2ALXENHq2nSZwCoQgnKqcvi2GYviP10C21UkBJgd7ozMfH1usTWxwrBe5fD3bDYOG63mcFeQQDhb53vPuc6GqdXTKk1pcjtLAAfsOfBmb3wY0ZrQKCISry0F6gXuMr05c68A9apX+wSaEvVZu0rhEFtPzbFhnlEzTD817oMypMMWaFfwl2tSNk1u5bKBJoUXtROjLxmuTyckJW+JsVwBqFAai9Ga3jRdf7GF+V3DXy3jja3cZrv0U5uZZUDqJNdAKDfliUmK12EVCZX9wBddDmptm/S3q4RVuupVTLlGUEpebL2adYXxzTC1KRuBF/FG9uvlx9tws0yrcrrUbnV9PcccX2WfvpwhSg7s50CKqcWmPu7Cn8eaIB3CdCq8Bnpul+PPEzJSqbWCL4ujhVbbDDJHORG1opfiIsP9BQpoThkdUpNGrrSpSV2V20TcI5Ph2lG402QbLcAc0N1ANf3imlPVpmxI4LjoAvItP2TJz9ABVLejaZBUrTO8UtxYgU8bUDd4W4A=";

function b64ToBytes(b64){
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  return arr;
}

// Surge http-response 返回二进制: 用 ({body: bytes})
try{
  const bytes = b64ToBytes(VIP_B64);
  console.log('[VIP] Replaying forged VIP response, '+bytes.length+' bytes');
  ({body: bytes});
}catch(e){
  console.log('[VIP] Error: '+e.message);
  ({});
}
