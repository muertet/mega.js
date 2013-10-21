/* 
=============
@TODO: This is the original file. Its functions are begin moved to mega.JS for the real API implementation and on site.js for demo
================

*/

/* not being used?*/
function fileSelected(e) {
	FileSelectHandler(e);
}

/*
Start Upload Functions
*/

function onUploadStart(id) {
	ul_queue[id]['starttime'] = new Date().getTime();
	runProgress("File Upload", "Uploading File: " + name, "Upload Progress");
}



function onUploadSuccess(id, handle, key) {
	console.log("File Upload Success!");
	Site.closePrompt();
	setTimeout(function(){Mega.refreshMain();},500);
}

function onUploadProgress(fileid, bytesloaded, bytestotal) {
	var eltime = (new Date().getTime() - ul_queue[fileid]['starttime']) / 1000;
	var bps = Math.round(bytesloaded / eltime);
	var retime = (bytestotal - bytesloaded) / bps;

	document.getElementById("cfProgress").value = Math.floor(bytesloaded / bytestotal * 100);

}


function onUploadError(fileid, error) {
	console.log("FILE " + fileid + " - ERROR: " + error);
}

/*
File Download Functions Below
*/


function cDlStart(id, name, filesize) {
	console.log('OnDownloadStart ' + id);
	dl_queue[dl_queue_num].starttime = new Date().getTime();
	runProgress("File Download", "Downloading File: " + name, "Download Progress");
}

function cDlError(id, error) {
	console.log("Error: " + error + "\nDownloading File: " + id);
}

function cDlProgress(fileid, bytesloaded, bytestotal) {
	var eltime = (new Date().getTime() - dl_queue[dl_queue_num].starttime) / 1000;
	var bps = Math.round(bytesloaded / eltime);
	var retime = (bytestotal - bytesloaded) / bps;
	document.getElementById("cfProgress").value = Math.floor(bytesloaded / bytestotal * 100);
}

function cDlAlmost() {
	console.log("Almost Done!");
}

function cDlComplete(id) {
	console.log("Done Downloading File: " + id);
	Site.closePrompt();
}

