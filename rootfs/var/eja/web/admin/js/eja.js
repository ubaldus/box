/* Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it> */


var ejaScript="do.eja"

var eja={ id: 0, ip: '', time: 0,  hash: '', auth: 0, language: 'en', cmd: {}, fields: {}, module: {}, result: 0, menu: {}, data: {}, i18n: {}, licence: {} }			


function ejaHtmlBar(label,max,val,text,mode) {
 var x=parseInt(parseFloat(val)*(100/parseFloat(max)))
 if (!ejaCheck(mode)) {
  mode='success'
  if (x > 50) { mode='warning' }
  if (x > 75) { mode='danger' }
 }
 if (!text || text=='') { text=val+' / '+max }
 return '<div class="form-group"><label for="'+label+'" class="col-sm-2 control-label">'+label+'</label><div class="col-sm-10"><div class="progress"><div class="progress-bar progress-bar-'+mode+'" role="progressbar" aria-valuenow="'+x+'" aria-valuemin="0" aria-valuemax="100" style="width: '+x+'%;min-width: 10%">'+text+'</div></div></div></div>'
}


function ejaHtmlBar2(label1,max1,val1,text1,label2,max2,val2,text2,mode) {
 var out=''
 var x1=parseInt(parseFloat(val1)*(100/parseFloat(max1)))
 var x2=parseInt(parseFloat(val2)*(100/parseFloat(max2)))
 var mode1='success'
 var mode2='success'
 if (x1 > 50) { mode1='warning' }
 if (x1 > 75) { mode1='danger' }
 if (x2 > 50) { mode2='warning' }
 if (x2 > 75) { mode2='danger' }
 if (!text1 || text1=='') { text1=val1+' / '+max1 } 
 if (!text2 || text2=='') { text2=val2+' / '+max2 }
 if (ejaCheck(mode)) { mode1=mode; mode2=mode; }
 out+='<div class="form-group"><label for="'+label1+'" class="col-sm-2 control-label">'+label1+'</label>'
 out+='<div class="col-sm-4"><div class="progress"><div class="progress-bar progress-bar-'+mode1+'" role="progressbar" aria-valuenow="'+x1+'" aria-valuemin="0" aria-valuemax="100" style="width: '+x1+'%;">'+text1+'</div></div></div>'
 out+='<label for="'+label1+'" class="col-sm-2 control-label">'+label2+'</label>'
 out+='<div class="col-sm-4"><div class="progress"><div class="progress-bar progress-bar-'+mode2+'" role="progressbar" aria-valuenow="'+x2+'" aria-valuemin="0" aria-valuemax="100" style="width: '+x2+'%;">'+text2+'</div></div></div>'
 out+='</div>'
 return out
}


function ejaHtmlField(fieldType,fieldName,fieldValue,fieldLabel,fieldHelp) {
 var out=''
 var txt=''
 
 if (fieldType=='label') {
  txt='<p>'+fieldValue+'</p>'
 } else if (fieldType=='textarea') {
  txt='<textarea name="'+fieldName+'" rows="5" class="form-control" id="'+fieldName+'" aria-describedby="help_'+fieldName+'">'+fieldValue+'</textarea>'
 } else {
  txt='<input type="'+fieldType+'" name="'+fieldName+'" class="form-control" id="'+fieldName+'" value="'+fieldValue+'" aria-describedby="help_'+fieldName+'">'
 }
 out+='<div class="form-group">'
 out+='<label for="'+fieldName+'" class="col-sm-2 control-label">'+fieldLabel+'</label>'
 out+='<div class="col-sm-10">'+txt+'<span id="help_'+fieldName+'" class="help-block">'+fieldHelp+'</span></div>'
 out+='</div>'

 return out
}


function ejaField(module,mode,field) {
 var out=''
 var o=eja.module[module]
 value=ejaCheck(o,'data.'+field) || ejaCheck(o,'fields.'+field+'.auto') || ''
 if (o.fields[field].type=='select') {
  out='<select name="'+field+'" id="'+field+'" class="form-control" aria-describedby="help_'+field+'">'
  for (k in o.fields[field].opts) {
   v=o.fields[field].opts[k]
   if (v == value) { selected='selected="selected"' } else { selected='' }
   out+='<option value="'+v+'" '+selected+'>'+ejaTranslate('opts',module,field,v)+'</option>"' 
  }
  out+='</select>'
 } else  if (o.fields[field].type=='textarea') {
  out='<textarea name="'+field+'" rows="5" class="form-control" id="'+field+'" aria-describedby="help_'+field+'">'+value+'</textarea>'
 } else {
  out='<input type="'+o.fields[field].type+'" name="'+field+'" class="form-control" id="'+field+'" value="'+value+'" aria-describedby="help_'+field+'">'
 }

 if (o.fields[field].type != 'hidden') {
  var s='<div class="form-group">'
  s+='<label for="'+field+'" class="col-sm-2 control-label">'+ejaTranslate(mode,module,field)+'</label>'
  s+='<div class="col-sm-10">'+out+'<span id="help_'+field+'" class="help-block">'+ejaTranslate('help',module,field)+'</span></div>'
  s+='</div>'
  out=s
 } 
 return out
}


function ejaCommand(module,name) {
 var o=eja.cmd[name]
 if (eja.module[module].cmd && eja.module[module].cmd[name]) { o=eja.module[module].cmd[name] }
 return '<button id="cmd_'+name+'" onclick="ejaLoad(\''+module+'\',\''+name+'\',\'\');" name="'+name+'" value="1" class="btn btn-'+o.type+'">'+ejaTranslate('command',module,name)+'</button>'
}


function ejaInfo(module) {
 var out=''
 var result=eja.module[module].result || 0 
 var message=ejaTranslate('info',module,result)
 if (result >= 0)   { mode="info",	timeout=4  }
 if (result >= 10) { mode="success",	timeout=3  }
 if (result < 0)    { mode="warning",	timeout=5  }
 if (result < 10)  { mode="danger",	timeout=10 }
 if (message!='') { 
  window.setTimeout(function() { $(".alert-"+mode).alert('close') }, timeout*1000);
  out='<div class="alert alert-'+mode+' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></button>'+message+'</div>'
 }
 return out
}


function ejaTable(module,mode) {
 var o=eja.module[module]
 var out=''
 var l=0

 out+='<table class="ejaTable table table-hover table-striped table-bordered"><tbody class="sortable"><thead><tr><th width="10px"></th>'
 for (i in o[mode].fields) { out+='<th>'+ejaTranslate(mode,module,o[mode].fields[i])+'</th>' }
 out+='</tr></thead>'
 
 for (x in o.data) {
  l++
  out+='<tr ondblclick="ejaLoad(\''+module+'\',\'\','+x+')" onclick="$(this).children(\':first\').children(\':first\').prop(\'checked\',\'true\');" ><td><input type="radio" name="id" value="'+x+'"></td>'
  for (i in o[mode].fields) { 
   var k=o[mode].fields[i]
   var v=o.data[x][k]
   if (!ejaCheck(v)) { v='' }
   if (o.fields[k] && o.fields[k].type == 'select') { 
    v=ejaTranslate('opts',module,k,v)
   } 
   out+='<td>'+v+'</td>' 
  }
  out+='</tr>'
 }
 out+='</tbody></table>'
 
 if (l==0) { out='' }

 return out
}


function ejaHtml(url) {
 $.get('var/'+url)
  .done(function(data) { $("#ejaForm").html(data) })
  .fail(function() { console.log("html include error") })
}


function ejaMenuLoop(o,module) {
 var out=''
 var language=''
 var parent=0
 $.each(o, function (k,v) {
  if (v == module) {
   active='class="active"'
   document.title=ejaTranslate('menu',module,v) 
  } else { 
   active="" 
  }
  if (ejaCheck(eja,'licence.'+v)!==0) {
   if (ejaCheck(eja,'menu.items.'+v+'.list')) { 
    out+='<li><a href="#" data-toggle="collapse" data-target="#menu_'+v+'">'+ejaTranslate('menu',module,v)+'<span class="fa fa-fw fa-caret-down"></span></a>'
    out+='<ul id="menu_'+v+'" class="collapse">'+ejaMenuLoop(eja.menu.items[v].list,module)+'</ul></li>'
   } else {
    var lib="ejaLoad(\'"+v+"\')"
    if (ejaCheck(eja,'menu.items.'+v+'.url')) { lib="ejaHtml(\'"+eja.menu.items[v].url+"\')" }
    out+='<li id="menu_'+v+'" '+active+'><a href="#" onclick="'+lib+'">'+ejaTranslate('menu',module,v)+'</a></li>'
   }
  }
 });
 
 if (ejaCheck(eja.languages)) {
  language='<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-language"></i></a><ul class="dropdown-menu alert-dropdown">'
  $.each(eja.languages, function(k,v){ 
   language+='<li><a href="#" onclick="eja.language=\''+v+'\';ejaLoad(\''+module+'\');">'+eja.i18n.languages[v]+'</a></li>' 
  })
  language+='</ul></li>'
 }
  
 var navbar=document.title+language
 navbar+='<li><a href="#" onclick="$(\'.help-block\').toggle()">?</a></li>'
 navbar+='<li id="cmd_logout"><a href="#" onclick="document.location.href=\'?\'"><i class="fa fa-sign-out"></i></a></a></li>'
 $('.navbar-right').html('<li class="navbar-text">'+navbar+'</li>')

 return out
}


function ejaMenu(module) {
 $('.side-nav').html(ejaMenuLoop(eja.menu.list,module));
 $("#menu_"+module).closest("ul.collapse").toggle()
 $("ul.collapse:empty").parent().remove()
 if (! ejaCheck(eja.auth) || eja.auth < 2) { $("#cmd_logout").hide(); }
}


function ejaPost(module,action,id) {
 var script=ejaScript
 var o={}
 o.data=eja.module[module].data || {}
 o.module=module || ''
 o.action=action || ''
 o.id=id || ''

 if ("#edit#delete#".search(action) > 0 && (!ejaCheck(o.id) || o.id=='')) { o.id=$('input[name=id]:checked').val() } 

 if ("#save#copy#apply#delete#login#search#".search(action) > 0) { 
  if (!ejaCheck(o.id) || o.id=='') { o.id=eja.module[module].id }
  o.data={}; 
  $.each($("#ejaForm").serializeArray(),function(){ o.data[this.name]=this.value || '' }) 
  if (action=='login') { 
   eja.hash=ejaSha256(o.data.username+o.data.password); 
   o.data={} 
  }
 }

 if (ejaCheck(eja,'hash')) { script=ejaAuthPath(document.location.pathname+ejaScript) }

 $.ajax({
  url: script,
  data: JSON.stringify(o),
  cache: false,
  contentType: 'multipart/form-data',
  processData: false,
  type: 'POST',
  success: function(data,status) { 
   var post=data
   eja.module[module].data=post.data;
   eja.module[module].result=post.result;
   if (post.licence) { eja.licence=post.licence }
   if (ejaCheck(post.id)) { eja.module[module].id=post.id }
   if (module == 'login' && ejaCheck(eja,'hash')) { eja.auth=1 }
  },
  statusCode: {
   401: function() {
    eja.hash=''
    eja.module[module].result=-1
   }
  },
  error: function() {
   console.log("generic error")
  }
 }).fail(function(){ 
  eja.module[module].result=-2
  console.log('ajax post error') 
 })
}


function ejaForm(module, action, id) {
 var out=''
 var mode='search'
 
 ejaPost(module,action,id)

 eja.module[module].help=0
 
 if (eja.auth == 1) {
  $("#ejaMenu").show();
  $("#cmd_logout").show();
  action='list'
  eja.auth=2
 }
 if ("#edit#save#copy#apply#new#".search(action) > 0) { mode="edit" }
 if ("#search#list#delete#".search(action) > 0)  { 
  mode="list" 
  eja.module[module].id=null
 }
  
 
 out+='<div class="form-group"><div class="col-sm-2"></div><div class="col-sm-10 help-block" id="help">'+ejaTranslate('help',module) +'</div></div>'
 
 if (mode == "edit" || mode == "search") {
  for (i in eja.module[module][mode].fields) { out+=ejaField(module,mode,eja.module[module][mode].fields[i]) }
  if (mode=="edit" && eja.module[module].data) { eja.module[module].data.id=id }
 }
 
 if (mode == "list") { out+=ejaTable(module,mode) }

 out+=ejaInfo(module)
 
 out+='<div class="ejaCommands">'
 for (i in eja.module[module][mode].cmd) { out+=ejaCommand(module,eja.module[module][mode].cmd[i]) }
 out+='</div>'
 
 $('#ejaForm').html(out)
 
 $(".help-block").hide()
 $(".sortable").disableSelection();
 $(".ejaTable").tablesorter();
 if (ejaCheck(eja,'module.'+module+'.script')) {
  $.getScript(eja.module[module].script)
 }
 $("#cmd_help").removeAttr("onclick");
 $('#cmd_help').click(function(){ $('.help-block').toggle() })
}


function ejaLoad(module, action, id) {
 document.title=''
 ejaMenu(module)  
 if (ejaCheck(action)==='' && parseInt(ejaCheck(id))>=0) { action="edit"; }
 if (ejaCheck(module)) {
  if (!ejaCheck(eja.hash) || eja.hash=='') { module="login"; }
  if (!ejaCheck(eja.module)) { eja.module={} }
  if (!ejaCheck(eja.module[module])) {
   $.getJSON('var/'+module+'.json').done(function(data) { 
    eja.module[module]=data
   }).fail(function() { alert("json error"); }); 
  }
  if (ejaCheck(eja.module[module])) {
   if (!ejaCheck(action)) {
    if (eja.module[module].search.fields.length <= 1) {
     if (eja.module[module].list.fields.length > 1) { 
      action='search' 
     } else { 
      action='edit'; 
      id=0; 
     }
    } 
   } 
   ejaForm(module, action, id)
  } 
 }
 $('form:first *:input[type=text]:first').focus();
}


function ejaTranslate(mode, module, value, sub) {	//mode: menu, command, opts, help, search, list, edit
 var out=false
 var icon=false

 // menu
 // eja.menu.items[values].i18n[language]
 // eja.i18n.menu[value][language]
 if (mode=='menu') {
  out=ejaCheck(eja,'menu.items.'+value+'.i18n.'+eja.language) || ejaCheck(eja,'i18n.menu.'+value+'.'+eja.language) || value
  icon=ejaCheck(eja,'menu.items.'+value+'.i18n.icon') || ejaCheck(eja,'i18n.menu.'+value+'.icon')
 }
 // command
 // eja.module[module].i18n.cmd[value][language]
 // eja.cmd[value].i18n[language]
 // eja.i18n.cmd[value][language]
 if (mode=="command") { 
  out=ejaCheck(eja,'module.'+module+'.i18n.cmd.'+value+'.'+eja.language) || ejaCheck(eja,'cmd.'+value+'.i18n.'+eja.language) || ejaCheck(eja,'i18n.cmd.'+value+'.'+eja.language) || value
  icon=ejaCheck(eja,'module.'+module+'.i18n.cmd.'+value+'.icon') || ejaCheck(eja,'cmd.'+value+'.i18n.icon') || ejaCheck(eja,'i18n.cmd.'+value+'.icon')
 }
 // info
 // eja.module.i18n.info[value][language]
 // eja.i18n.info[value][language]
 if (mode=="info") {
  if (ejaCheck(eja,'module.'+module+'.i18n.info.'+value+'.'+eja.language)) {
   out=eja.module[module].i18n.info[value][eja.language]
  } else if (ejaCheck(eja,'i18n.info.'+value+'.'+eja.language)){
   out=eja.i18n.info[value][eja.language]
  } else {
   out=''
  }
 }
 // help
 // eja.module[module].i18n.help
 // eja.module[module].fields[value].i18[language].help
 if (mode=="help") {
  if (ejaCheck(value)) {
   out=ejaCheck(eja,'module.'+module+'.fields.'+value+'.i18n.'+eja.language+'.help') || ''
  } else {
  out=ejaCheck(eja,'module.'+module+'.i18n.help.'+eja.language) || ''
  }
  if (out!='') { eja.module[module].help=1; }
 }
 // label
 // eja.module[module].fields[value].i18[language].label
 if ('#search#list#edit#'.search(mode) > 0) {
  out=ejaCheck(eja,'module.'+module+'.fields.'+value+'.i18n.'+eja.language+'.label') || value
 }
 // opts
 // eja.module[module].fields[value].i18n[language].opts[sub]
 if (mode=='opts') {
  if (ejaCheck(eja,'module.'+module+'.fields.'+value+'.i18n.'+eja.language+'.opts')) {
   out=eja.module[module].fields[value].i18n[eja.language].opts[sub] || sub
  }
  out=out || value
 }

 if (out===false) { out="{"+value+"}" }
 if (icon!==false) { out='<i class="fa '+icon+'"></i> '+out }
 return out
}


function ejaCheck(value,path) { 
 if (typeof value === 'undefined' || value == 'undefined') {
  return false
 } else {
  var o=value
  if (path && path != '') {
   var a=path.split('.')
   for (var i=0;i<a.length; i++) {
    var step=a[i]
    if (typeof o[step] != 'undefined') {
     o=o[step]
    } else {
     return false
    }
   }
  } 
  return o   
 }
}


function ejaTime() {
 return Math.floor((new Date).getTime()/1000)
}


function ejaSha256(data) {
 var shaObj = new jsSHA(data,"TEXT");
 return shaObj.getHash("SHA-256", "HEX");
}


function ejaAuthPath(p) {
 return '/'+ejaSha256(eja.hash+eja.ip+String(parseInt(ejaTime())+parseInt(eja.time)).substring(0,7)+p)+p
}


function ejaInit() {
 $.ajaxSetup({ async: false });

 $.getJSON('var/eja.json').done(
  function(data) {
  eja=data
  $.getJSON(ejaScript).done(function(data) {
   eja.ip=data.ip
   eja.time=data.time-ejaTime()
   eja.licence=data.licence

   ejaLoad('login')

   $('#ejaForm').submit(function( event ) { event.preventDefault() });

  });
 });
}

