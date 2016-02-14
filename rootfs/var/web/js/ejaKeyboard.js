/* Copyright (c) 2016 by Ubaldo Porcheddu <ubaldo@eja.it> */


var ejaKeyboardMode=0
var ejaKeyboardPosition=0


function ejaKeyboardClick(o) {
 if (o.name == "kbd") { ejaKeyboard(1); return; }
 if (o.name == "uArr;") { 
  if (ejaKeyboardMode==0) { ejaKeyboard(1); return; }
  if (ejaKeyboardMode==1) { ejaKeyboard(2); return; }
  if (ejaKeyboardMode==2) { ejaKeyboard(3); return; }
  if (ejaKeyboardMode==3) { ejaKeyboard(4); return; }
  if (ejaKeyboardMode==4) { 
   ejaKeyboard(1); 
   return; 
  }
 }
 if (o.name=="move") {
  if (ejaKeyboardPosition==0) {
   document.getElementById('ejaKeyboard').style.top=0
   document.getElementById('ejaKeyboard').style.bottom=""
   ejaKeyboardPosition=1;
  } else {
   document.getElementById('ejaKeyboard').style.top=""
   document.getElementById('ejaKeyboard').style.bottom=0
   ejaKeyboardPosition=0;
  }
  return;
 }
 if (o.name=="hide") {
  document.getElementById('ejaKeyboard').style.display="none"
  return;
 }
 var c=o.value.charCodeAt(0)
 if (o.name == 'crarr;')	{ c=13;	} 
 if (o.name == 'rArr;')		{ c=9;	} 
 if (o.name == 'lArr;')		{ c=8;	} 
 if (o.name == 'uArr;')		{ c=0; 	} 
 if (o.name == 'ctrl')		{ c=17;	} 
 if (o.name == 'alt')		{ c=18;	} 
 if (o.name == 'uarr;')		{ c=38;	} 
 if (o.name == 'darr;')		{ c=40;	} 
 if (o.name == 'larr;')		{ c=37;	} 
 if (o.name == 'rarr;')		{ c=39;	} 
 if (o.name == 'quot;')		{ c=34;	} 
 if (o.name == 'esc')		{ c=27;	} 
 if (o.name == 'home')		{ c=36;	} 
 if (o.name == 'end')		{ c=35;	} 
 if (o.name == 'up')		{ c=33;	} 
 if (o.name == 'down')		{ c=34;	} 
 if (c > 0) {
  ejaWebTelnetBufferIn.push(c);
  console.log(c)
 }
}


function ejaKeyboardHtml(value) {
 return '<input type="button" name="'+value.replace("&","")+'" value="'+value+'" onclick="ejaKeyboardClick(this)">';
}


function ejaKeyboard(mode) {
 ejaKeyboardMode=mode
 var kb=[]
 kb[0]=[["kbd","hide"]]
 kb[1]=[
  ["esc","q","w","e","r","t","y","u","i","o","p","&lArr;"],
  ["&rArr;","&uArr;","a","s","d","f","g","h","j","k","l","&crarr;"],
  ["ctrl","alt","z","x","c","v","b","n","m",",","."," "],
 ]
 kb[2]=[
  ["esc","Q","W","E","R","T","Y","U","I","O","P","&lArr;"],
  ["&rArr;","&uArr;","A","S","D","F","G","H","J","K","L","&crarr;"],
  ["ctrl","alt","Z","X","C","V","B","N","M","!","?"," "],
 ]
 kb[3]=[
  ["esc","1","2","3","4","5","6","7","8","9","0","&lArr;"],
  ["&rArr;","&uArr;","(",")","[","]","{","}","<",">","=","&crarr;"],
  ["ctrl","alt","+","-","*","/","%","~","&",":",";"," "],
 ]
 kb[4]=[
  ["esc","`","'","&quot;","@","#","¡","^","_","|","\\","&lArr;"],
  ["&rArr;","&uArr;","$","€","£","°","¿","≠"," ","hide","move","&crarr;"],
  ["ctrl","alt","&larr;","&uarr;","&darr;","&rarr;"," ","home","end","up","down"," "],
 ]
 
 var out=''
 for (var r in kb[mode]) {
  for (var c in kb[mode][r]) {
   out+=ejaKeyboardHtml(kb[mode][r][c]);
  }
  out+="<br>"
 }
 
 document.getElementById("ejaKeyboard").innerHTML=out;
}
