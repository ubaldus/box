/* Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it> */

var eja={}
eja.opt={}
eja.path="/data/user/0/it.eja.box/files/";
eja.pathBin=eja.path+"/bin/";
eja.opt.logLevel=4;
eja.url=''
eja.editor={}


document.addEventListener("deviceready", ejaInit, false);


function ejaError(v)	{ if (eja.opt.logLevel > 0) { return ejaLog("E",v); } }
function ejaWarn(v)	{ if (eja.opt.logLevel > 1) { return ejaLog("W",v); } }
function ejaInfo(v)	{ if (eja.opt.logLevel > 2) { return ejaLog("I",v); } }
function ejaDebug(v)	{ if (eja.opt.logLevel > 3) { return ejaLog("D",v); } }
function ejaTrace(v)	{ if (eja.opt.logLevel > 4) { return ejaLog("T",v); } }


function ejaLog(level,message) {
 if (! level) { level="I"; }
 document.getElementById("log").innerHTML+=" "+level+" "+message+"\n"
 return true
}


function ejaExecute(cmd) {
 ejaTrace("Execute")
 window.ShellExec.exec(cmd, function(res) { 
  ejaTrace(cmd+":\n"+res.output) 
 })
}


function ejaInit() {
 ejaInfo("System init")
 document.getElementById('cmdBoxInit').addEventListener('touchstart', ejaBoxInit, false); 
 document.getElementById('cmdAdmin').addEventListener('touchstart', ejaAdmin, false); 
 document.getElementById('cmdConsole').addEventListener('touchstart', ejaConsole, false); 
 document.getElementById('cmdEditor').addEventListener('touchstart', ejaEditor, false); 
 document.getElementById('cmdEditorSave').addEventListener('touchstart', ejaEditorSave, false); 
 document.getElementById('cmdExit').addEventListener('touchstart', ejaExit, false); 
 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"/bin", ejaStart, ejaInstall) 
}


function ejaInstall() {
 ejaDebug("Installing server")
 ejaFileCopy(location.href.replace("/index.html", "")+"/"+"bin/eja", cordova.file.dataDirectory+"bin/eja") 
 ejaFileCopy(location.href.replace("/index.html", "")+"/"+"bin/ejaBox.lua", cordova.file.dataDirectory+"bin/ejaBox.lua")
 ejaFileCopy(location.href.replace("/index.html", "")+"/"+"bin/ejaBox.tar", cordova.file.dataDirectory+"bin/ejaBox.tar")
 ejaExecute("chmod 755 "+eja.pathBin+"/eja")
 window.setTimeout(ejaStart,5000)
 ejaDebug("Server installed") 
}


function ejaStart() {
 ejaInfo('System ready.')
}


function ejaAdmin() {
 ejaDebug("Admin")
 cordova.exec(function(){}, function(){}, "InAppBrowser", "open", ['http://127.0.0.1:35248/admin/', '_blank', 'location=no,hardwareback=yes,zoom=no']);
}


function ejaConsole() {
 ejaDebug("Console")
 cordova.exec(function(){}, function(){}, "InAppBrowser", "open", ['http://127.0.0.1:35248/telnet/', '_blank', 'location=no,hardwareback=yes,zoom=no']);
}


function ejaBoxInit() {
 document.getElementById("cmdBoxInit").style.display="none";
 document.getElementById("cmdEditor").style.display="none";
 document.getElementById("cmdAdmin").style.display="inline";
 document.getElementById("cmdConsole").style.display="inline";
 ejaInfo("Starting server")
 networkinterface.getIPAddress(function (ip) { 
  ejaInfo('Network access:\n    http://'+ip+':35248\n    telnet://'+ip+':35223'); 
 });
 ejaExecute(eja.pathBin+"/eja "+eja.pathBin+"/ejaBox.lua")                
 ejaInfo("Server ready")
}


function ejaFileCopy(fileIn, fileOut) {
 ejaTrace("File copy")
 var ft = new FileTransfer();
 ft.download(
  fileIn,
  fileOut,
  function(entry) {
   ejaTrace("copy: "+fileIn+" "+fileOut);
  },
  function(error){
   ejaError("copy: "+error+" "+fileIn+" "+fileOut);
  }
 );
}

function ejaEditor() {
 document.getElementById("cmdBoxInit").style.display="none";
 document.getElementById("cmdEditor").style.display="none";
 document.getElementById("cmdEditorSave").style.display="inline";
 document.getElementById("log").style.display="none";
 document.getElementById("editor").style.width=document.body.offsetWidth-20;
 document.getElementById("editor").style.height=document.body.offsetHeight/2;
 eja.editor=ace.edit("editor")
 eja.editor.setShowPrintMargin(false)
 eja.editor.getSession().setUseWrapMode(true);
 eja.editor.getSession().setMode("ace/mode/lua");

 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"bin/ejaBox.lua", 
  function(fd) {
   fd.file( 
    function(fd) {
     var fileRead=new FileReader();
     fileRead.onloadend = function(e) { 
      eja.editor.getSession().setValue(this.result)
     }
     fileRead.readAsText(fd);
    }
   )
  },
  function(e) {
   ejaError("File read.");
  }
 );
}


function ejaEditorSave() {
 alert("save")
 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"bin",
  function(dir) {
   dir.getFile("ejaBox.lua", { create: true }, 
    function(file) {
     file.createWriter( 
      function(fileWrite) { 
       fileWrite.write(eja.editor.getSession().getValue())
      }
     )
    }
   )
  },
  function(e) {
   ejaError("File write.");
  }
 )
}


function ejaExit() {
 navigator.app.exitApp();
}
