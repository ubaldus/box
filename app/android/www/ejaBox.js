/* Copyright (C) 2007-2020 by Ubaldo Porcheddu <ubaldo@eja.it> */

var eja={}
eja.opt={}
eja.path=null;
eja.opt.logLevel=4;
eja.editor={}

document.addEventListener("deviceready", ejaInit, false);


function ejaError(v)	{ if (eja.opt.logLevel >= 1) { return ejaLog("E",v); } }
function ejaWarn(v)	{ if (eja.opt.logLevel >= 2) { return ejaLog("W",v); } }
function ejaInfo(v)	{ if (eja.opt.logLevel >= 3) { return ejaLog("I",v); } }
function ejaDebug(v)	{ if (eja.opt.logLevel >= 4) { return ejaLog("D",v); } }
function ejaTrace(v)	{ if (eja.opt.logLevel >= 5) { return ejaLog("T",v); } }


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
 ejaInfo("System init");
 eja.path=cordova.file.dataDirectory.replace("file://","");
 document.getElementById('cmdBoxInit').addEventListener('touchstart', ejaBoxInit, false); 
 document.getElementById('cmdUpdate').addEventListener('touchstart', ejaUpdate, false); 
 document.getElementById('cmdEditor').addEventListener('touchstart', ejaEditor, false); 
 document.getElementById('cmdEditorSave').addEventListener('touchstart', ejaEditorSave, false); 
 document.getElementById('cmdExit').addEventListener('touchstart', ejaExit, false); 
 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"/bin", ejaStart, ejaInstall); 
}


function ejaInstall() {
 ejaInfo("Installing server");
 new FileTransfer().download(location.href.replace("/index.html", "")+"/ejaBox.zip", eja.path+"/tmp/ejaBox.zip", function() {
  window.zip.unzip(eja.path+"/tmp/ejaBox.zip",eja.path+"/tmp/", function() {
   ejaExecute("/system/bin/sh "+eja.path+"/tmp/zip/ejaBoxInstall.sh");
   ejaInfo("Server Installed");
   ejaStart();
  });
 })
}


function ejaReset() {
 document.getElementById("cmdBoxInit").style.display="inline";
 document.getElementById("cmdEditor").style.display="inline";
 document.getElementById("cmdUpdate").style.display="inline";
 document.getElementById("cmdEditorSave").style.display="none";
 document.getElementById("log").style.display="block";
 document.getElementById("editor").style.display="none";
}


function ejaStart() {
 ejaReset();
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


function ejaBoxInitCmd() {
 setTimeout(function() { 
  window.ShellExec.exec(eja.path+"/usr/bin/killall -9 eja", function() {
   ejaExecute(eja.path+"/usr/bin/eja --init");
  })
 }, 1000);
}


function ejaBoxInit() {
 document.getElementById("cmdBoxInit").style.display="none";
 document.getElementById("cmdEditor").style.display="none";
 document.getElementById("cmdUpdate").style.display="none";
 ejaInfo("Starting server")
 networkinterface.getIPAddress(function (ip) { 
  ejaInfo('Network access:\n    http://'+ip+':35248\n    telnet://'+ip+':35223'); 
  ejaBoxInitCmd();
 });
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
 document.getElementById("cmdUpdate").style.display="none";
 document.getElementById("cmdEditor").style.display="none";
 document.getElementById("cmdEditorSave").style.display="inline";
 document.getElementById("log").style.display="none";
 document.getElementById("editor").style.display="block";
 document.getElementById("editor").style.width=document.body.offsetWidth-20;
 document.getElementById("editor").style.height=document.body.offsetHeight/2;
 eja.editor=ace.edit("editor")
 eja.editor.setShowPrintMargin(false)
 eja.editor.getSession().setUseWrapMode(true);
 eja.editor.getSession().setMode("ace/mode/lua");

 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"etc/eja/eja.init", 
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
 window.resolveLocalFileSystemURL(cordova.file.dataDirectory+"etc/eja/",
  function(dir) {
   dir.getFile("eja.init", { create: true }, 
    function(file) {
     file.createWriter( 
      function(fileWrite) { 
       fileWrite.write(eja.editor.getSession().getValue())
       ejaInfo("Init file updated.");
       ejaReset();
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


function ejaUpdate() {
 document.getElementById("library").style.display="block";
 var library=document.getElementById("library").value;
 if (library != "") {
  document.getElementById("cmdUpdate").style.display="none"; 
  document.getElementById("library").style.display="none"; 
  document.getElementById("library").value="";
  ejaInfo("Installing library: "+library);
  ejaExecute(eja.path+"/usr/bin/eja --update "+library);
 }
}
