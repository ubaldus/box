/* Copyright (c) 2016 by Ubaldo Porcheddu <ubaldo@eja.it> */


var ejaWebTelnetUrl
var ejaWebTelnetCol
var ejaWebTelnetRow
var ejaWebTelnetTerm
var ejaWebTelnetSent=0
var ejaWebTelnetBufferIn=[]
var ejaWebTelnetLoopCount=2;
var ejaWebTelnetLoopTimeout=2;
var ejaWebTelnetLoopStepTime=1000;


function ejaWebTelnet(url, col, row) {
 if (typeof(url) !== 'undefined') { ejaWebTelnetUrl=url } else { ejaWebTelnetUrl=document.location.protocol+'//'+document.location.hostname+':'+document.location.search.slice(1)+'/?' }
 if (typeof(col) !== 'undefined') { ejaWebTelnetCol=col } else { ejaWebTelnetCol=parseInt((document.body.offsetWidth-5)/6.7) } 
 if (typeof(row) !== 'undefined') { ejaWebTelnetRow=row } else { ejaWebTelnetRow=parseInt((document.body.offsetHeight-5)/13) } 
 document.body.innerHTML=""
 Terminal.colors[256]='#ffffff'
 Terminal.colors[257]='#000000'

 ejaWebTelnetTerm = new Terminal({
  cols: ejaWebTelnetCol,
  rows: ejaWebTelnetRow,
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
 });

 ejaWebTelnetTerm.open(document.body);
 ejaWebTelnetTerm.on('data', function(data) { 
  ejaWebTelnetBufferIn.push(data.charCodeAt(0)); 
  ejaWebTelnetLoopCount=ejaWebTelnetLoopTimeout;
  ejaWebTelnetLoop();
 });
 setInterval(ejaWebTelnetLoop,ejaWebTelnetLoopStepTime)
}


function ejaWebTelnetLoop() {
 var data="";
 var l=ejaWebTelnetBufferIn.length;
 if (ejaWebTelnetSent == 0 && ejaWebTelnetLoopCount >= ejaWebTelnetLoopTimeout) { 
  if (l > 0) {
   var a=new Uint8Array(l)
   for (i=0; i<l; i++) { a[i]=ejaWebTelnetBufferIn[i]; }
   ejaWebTelnetBufferIn=[]
   data=ejaArrayHexEncode(a)
  }
  ejaWebTelnetSend(data)
 }
 ejaWebTelnetLoopCount++;
}


function ejaWebTelnetSend(query) {
 var request = new XMLHttpRequest();
 request.open('GET', ejaWebTelnetUrl+query, true); 
 request.onreadystatechange = function () {
  if (request.status === 200 && request.readyState==4) {
   var data=request.responseText;
   if (data) { 
    ejaWebTelnetReceive(ejaArrayHexDecode(data)) 
   }
   ejaWebTelnetSent=0   
  }
 } 
 ejaWebTelnetSent=1
 request.send(null);
}


function ejaWebTelnetReceive(data) {
 while (data.length > 0) { ejaWebTelnetTerm.write(String.fromCharCode(data.shift())) }
}


function ejaArrayHexEncode(a) {
 var v=''
 for (var i=0; i<a.length; i++) { v+=(a[i]+0x100).toString(16).toUpperCase().substr(-2) }
 return v
}


function ejaArrayHexDecode(a) {
 var b=[]
 for (var i=0; i<a.length; i=i+2) { b.push( parseInt(a[i]+a[i+1],16) ) }
 return b
}
