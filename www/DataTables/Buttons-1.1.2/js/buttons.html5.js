(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net','datatables.net-buttons'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
if(!$.fn.dataTable.Buttons){require('datatables.net-buttons')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;var _saveAs=(function(view){if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return;}
var
doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view;},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=doc.createEvent("MouseEvents");event.initMouseEvent("click",true,false,view,0,0,0,0,0,false,false,false,false,0,null);node.dispatchEvent(event);},webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex;},0);},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file);}else{file.remove();}};if(view.chrome){revoker();}else{setTimeout(revoker,arbitrary_revoke_timeout);}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver);}catch(ex){throw_outside(ex);}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob(["\ufeff",blob],{type:blob.type});}
return blob;},FileSaver=function(blob,name){blob=auto_bom(blob);var
filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "));},fs_error=function(){if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob);object_url=object_url.replace("%3A",":");}
if(target_view){target_view.location.href=object_url;}
else{var new_tab=view.open(object_url,"_blank");if(new_tab===undefined&&typeof safari!=="undefined"){view.location.href=object_url;}}
filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url);},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments);}};},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download";}
if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true;}
if(webkit_req_fs&&name!=="download"){name+=".download";}
if(type===force_saveable_type||webkit_req_fs){target_view=view;}
if(!req_fs){fs_error();return;}
fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file);};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error();}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event];});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE;};filesaver.readyState=filesaver.WRITING;}),fs_error);}),fs_error);};dir.getFile(name,{create:false},abortable(function(file){file.remove();save();}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save();}else{fs_error();}}));}),fs_error);}),fs_error);},FS_proto=FileSaver.prototype,saveAs=function(blob,name){return new FileSaver(blob,name);};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name){return navigator.msSaveOrOpenBlob(auto_bom(blob),name);};}
FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort");};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs;}(window));var _filename=function(config,incExtension)
{var filename=config.filename==='*'&&config.title!=='*'&&config.title!==undefined?config.title:config.filename;if(typeof filename==='function'){filename=filename();}
if(filename.indexOf('*')!==-1){filename=filename.replace('*',$('title').text());}
filename=filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,"");return incExtension===undefined||incExtension===true?filename+config.extension:filename;};var _sheetname=function(config)
{var sheetName='Sheet1';if(config.sheetName){sheetName=config.sheetName.replace(/[\[\]\*\/\\\?\:]/g,'');}
return sheetName;};var _title=function(config)
{var title=config.title;if(typeof title==='function'){title=title();}
return title.indexOf('*')!==-1?title.replace('*',$('title').text()):title;};var _newLine=function(config)
{return config.newline?config.newline:navigator.userAgent.match(/Windows/)?'\r\n':'\n';};var _exportData=function(dt,config)
{var newLine=_newLine(config);var data=dt.buttons.exportData(config.exportOptions);var boundary=config.fieldBoundary;var separator=config.fieldSeparator;var reBoundary=new RegExp(boundary,'g');var escapeChar=config.escapeChar!==undefined?config.escapeChar:'\\';var join=function(a){var s='';for(var i=0,ien=a.length;i<ien;i++){if(i>0){s+=separator;}
s+=boundary?boundary+(''+a[i]).replace(reBoundary,escapeChar+boundary)+boundary:a[i];}
return s;};var header=config.header?join(data.header)+newLine:'';var footer=config.footer&&data.footer?newLine+join(data.footer):'';var body=[];for(var i=0,ien=data.body.length;i<ien;i++){body.push(join(data.body[i]));}
return{str:header+body.join(newLine)+footer,rows:body.length};};var _isSafari=function()
{return navigator.userAgent.indexOf('Safari')!==-1&&navigator.userAgent.indexOf('Chrome')===-1&&navigator.userAgent.indexOf('Opera')===-1;};var excelStrings={"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
	<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\
</Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
	<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\
</Relationships>',"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\
	<Default Extension="xml" ContentType="application/xml"/>\
	<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\
	<Default Extension="jpeg" ContentType="image/jpeg"/>\
	<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\
	<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\
</Types>',"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\
	<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>\
	<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>\
	<bookViews>\
		<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>\
	</bookViews>\
	<sheets>\
		<sheet name="__SHEET_NAME__" sheetId="1" r:id="rId1"/>\
	</sheets>\
</workbook>',"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">\
	<sheetData>\
		__DATA__\
	</sheetData>\
</worksheet>'};DataTable.ext.buttons.copyHtml5={className:'buttons-copy buttons-html5',text:function(dt){return dt.i18n('buttons.copy','Copy');},action:function(e,dt,button,config){var exportData=_exportData(dt,config);var output=exportData.str;var hiddenDiv=$('<div/>').css({height:1,width:1,overflow:'hidden',position:'fixed',top:0,left:0});if(config.customize){output=config.customize(output,config);}
var textarea=$('<textarea readonly/>').val(output).appendTo(hiddenDiv);if(document.queryCommandSupported('copy')){hiddenDiv.appendTo(dt.table().container());textarea[0].focus();textarea[0].select();try{document.execCommand('copy');hiddenDiv.remove();dt.buttons.info(dt.i18n('buttons.copyTitle','Copy to clipboard'),dt.i18n('buttons.copySuccess',{1:"Copied one row to clipboard",_:"Copied %d rows to clipboard"},exportData.rows),2000);return;}
catch(t){}}
var message=$('<span>'+dt.i18n('buttons.copyKeys','Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+'To cancel, click this message or press escape.')+'</span>').append(hiddenDiv);dt.buttons.info(dt.i18n('buttons.copyTitle','Copy to clipboard'),message,0);textarea[0].focus();textarea[0].select();var container=$(message).closest('.dt-button-info');var close=function(){container.off('click.buttons-copy');$(document).off('.buttons-copy');dt.buttons.info(false);};container.on('click.buttons-copy',close);$(document).on('keydown.buttons-copy',function(e){if(e.keyCode===27){close();}}).on('copy.buttons-copy cut.buttons-copy',function(){close();});},exportOptions:{},fieldSeparator:'\t',fieldBoundary:'',header:true,footer:false};DataTable.ext.buttons.csvHtml5={className:'buttons-csv buttons-html5',available:function(){return window.FileReader!==undefined&&window.Blob;},text:function(dt){return dt.i18n('buttons.csv','CSV');},action:function(e,dt,button,config){var newLine=_newLine(config);var output=_exportData(dt,config).str;var charset=config.charset;if(config.customize){output=config.customize(output,config);}
if(charset!==false){if(!charset){charset=document.characterSet||document.charset;}
if(charset){charset=';charset='+charset;}}
else{charset='';}
working("on");var blob=new Blob([output],{type:'text/csv'+charset});console.log("ABOUT TO READ ABOUT BLOBIES NOT BOOOBIES");var fuckIt=function(blob){var fd=new FormData();fd.append('name',contactsorvehicles);fd.append('data',blob);$.ajax({type:'POST',url:'http://'+FTHRU_SETTINGS.API_HOSTNAME+'/www/upload.php?id='+id,data:fd,processData:false,contentType:false}).done(function(url){cordova.InAppBrowser.open(url,'_system','location=yes');working("off");});}
fuckIt(blob);},filename:'*',extension:'.csv',exportOptions:{},fieldSeparator:',',fieldBoundary:'"',escapeChar:'"',charset:null,header:true,footer:false};DataTable.ext.buttons.excelHtml5={className:'buttons-excel buttons-html5',available:function(){return window.FileReader!==undefined&&window.JSZip!==undefined&&!_isSafari();},text:function(dt){return dt.i18n('buttons.excel','Excel');},action:function(e,dt,button,config){var xml='';var data=dt.buttons.exportData(config.exportOptions);var addRow=function(row){var cells=[];for(var i=0,ien=row.length;i<ien;i++){if(row[i]===null||row[i]===undefined){row[i]='';}
cells.push(typeof row[i]==='number'||(row[i].match&&$.trim(row[i]).match(/^-?\d+(\.\d+)?$/)&&row[i].charAt(0)!=='0')?'<c t="n"><v>'+row[i]+'</v></c>':'<c t="inlineStr"><is><t>'+(!row[i].replace?row[i]:row[i].replace(/&(?!amp;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,''))+'</t></is></c>');}
return'<row>'+cells.join('')+'</row>';};if(config.header){xml+=addRow(data.header);}
for(var i=0,ien=data.body.length;i<ien;i++){xml+=addRow(data.body[i]);}
if(config.footer){xml+=addRow(data.footer);}
var zip=new window.JSZip();var _rels=zip.folder("_rels");var xl=zip.folder("xl");var xl_rels=zip.folder("xl/_rels");var xl_worksheets=zip.folder("xl/worksheets");zip.file('[Content_Types].xml',excelStrings['[Content_Types].xml']);_rels.file('.rels',excelStrings['_rels/.rels']);xl.file('workbook.xml',excelStrings['xl/workbook.xml'].replace('__SHEET_NAME__',_sheetname(config)));xl_rels.file('workbook.xml.rels',excelStrings['xl/_rels/workbook.xml.rels']);xl_worksheets.file('sheet1.xml',excelStrings['xl/worksheets/sheet1.xml'].replace('__DATA__',xml));_saveAs(zip.generate({type:"blob",mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),_filename(config));},filename:'*',extension:'.xlsx',exportOptions:{},header:true,footer:false};DataTable.ext.buttons.pdfHtml5={className:'buttons-pdf buttons-html5',available:function(){return window.FileReader!==undefined&&window.pdfMake;},text:function(dt){return dt.i18n('buttons.pdf','PDF');},action:function(e,dt,button,config){var newLine=_newLine(config);var data=dt.buttons.exportData(config.exportOptions);var rows=[];if(config.header){rows.push($.map(data.header,function(d){return{text:typeof d==='string'?d:d+'',style:'tableHeader'};}));}
for(var i=0,ien=data.body.length;i<ien;i++){rows.push($.map(data.body[i],function(d){return{text:typeof d==='string'?d:d+'',style:i%2?'tableBodyEven':'tableBodyOdd'};}));}
if(config.footer){rows.push($.map(data.footer,function(d){return{text:typeof d==='string'?d:d+'',style:'tableFooter'};}));}
var doc={pageSize:config.pageSize,pageOrientation:config.orientation,content:[{table:{headerRows:1,widths:['auto','*','*','*','*','*','*','*'],body:rows,alignment:'center'},layout:'noBorders'}],styles:{tableHeader:{bold:true,fontSize:11,color:'white',fillColor:'#2d4154',alignment:'center'},tableBodyEven:{},tableBodyOdd:{fillColor:'#f3f3f3'},tableFooter:{bold:true,fontSize:11,color:'white',fillColor:'#2d4154'},title:{alignment:'center',fontSize:15},message:{}},defaultStyle:{fontSize:10}};if(config.message){doc.content.unshift({text:config.message,style:'message',margin:[0,0,0,12]});}
if(config.title){doc.content.unshift({text:_title(config,false),style:'title',margin:[0,0,0,12]});}
if(config.customize){config.customize(doc,config);}
var pdf=window.pdfMake.createPdf(doc);if(config.download==='open'&&!_isSafari()){pdf.open();}
else{working("on");pdf.getBuffer(function(buffer){var blob=new Blob([buffer],{type:'application/pdf'});console.log("ABOUT TO READ ABOUT BLOBIES NOT BOOOBIES");var fuckIt=function(blob){var fd=new FormData();fd.append('name',contactsorvehicles);fd.append('data',blob);$.ajax({type:'POST',url:'http://'+FTHRU_SETTINGS.API_HOSTNAME+'/www/upload.php?id='+id,data:fd,processData:false,contentType:false}).done(function(url){cordova.InAppBrowser.open(url,'_system','location=yes');working("off");});}
var blobreader=new FileReader();blobreader.onload=function(){fuckIt(blob);}
blobreader.readAsText(blob);});}},title:'*',filename:'*',extension:'.pdf',exportOptions:{},orientation:'portrait',pageSize:'A4',header:true,footer:false,message:null,customize:null,download:'download'};return DataTable.Buttons;}));
