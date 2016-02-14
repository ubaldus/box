/* Copyright (c) 2016 by Ubaldo Porcheddu <ubaldo@eja.it> */

var ejaKeyboardMode=0


function ejaKeyboardClick(o) {
 if (o.name == "kbd") {
  ejaKeyboard(1)
  return;
 }
 if (o.name == "uArr;") {
  if (ejaKeyboardMode==2) {
   ejaKeyboard(1)
  } else {
   ejaKeyboard(2)
  }
 }
 var c=o.value.charCodeAt(0)
 if (o.name == 'crarr;')	{ c=13;	} 
 if (o.name == 'rArr;')		{ c=9;	} 
 if (o.name == 'lArr;')		{ c=8;	} 
 if (o.name == 'uArr;')		{ c=0; 	} //shift
 if (o.name == 'ctrl')		{ c=17;	} 
 if (o.name == 'alt')		{ c=18;	} 
 if (o.name == 'uarr;')		{ c=38;	} 
 if (o.name == 'darr;')		{ c=40;	} 
 if (o.name == 'larr;')		{ c=37;	} 
 if (o.name == 'rarr;')		{ c=39;	} 
 if (o.name == 'quot;')		{ c=34;	} 
 if (o.name == 'esc')		{ c=27;	} 
 if (c > 0) {
  ejaWebTelnetBufferIn.push(c);
 }
}


function ejaKeyboardHtml(value) {
 return '<input type="button" name="'+value.replace("&","")+'" value="'+value+'" onclick="ejaKeyboardClick(this)">';
}


function ejaKeyboard(mode) {
 ejaKeyboardMode=mode
 var kb=[]
 kb[0]=[["kbd"]]
 kb[1]=[
  ["`","1","2","3","4","5","6","7","8","9","0","-","=","&lArr;"],
  ["&rArr;","q","w","e","r","t","y","u","i","o","p","[","]","&uarr;"],
  ["&uArr;","a","s","d","f","g","h","j","k","l",";","'","\\","&darr;"],
  ["ctrl","alt","z","x","c","v","b","n","m",",",".","/","___","&crarr;"],
 ]
 kb[2]=[
  ["~","!","@","#","$","%","^","&","*","(",")","_","+","&lArr;"],
  ["esc","Q","W","E","R","T","Y","U","I","O","P","{","}","&larr;"],
  ["&uArr;","A","S","D","F","G","H","J","K","L",":","&quot;","|","&rarr;"],
  ["ctrl","alt","Z","X","C","V","B","N","M","<",">","?","___","&crarr;"],
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
