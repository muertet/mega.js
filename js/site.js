var Site=
{
	init:function()
	{
		Site.runPrompt('Login');
		document.getElementById("fileselect1").addEventListener("change", FileSelectHandler, false);
	},
	createFolder:function()
	{
		var name=$('#newFolderName').val();
		if (name.length < 2)
		{
			console.log("bad folder name" + name);
			return;
		}
		Mega.createFolder(Mega.currentFolderId, name, Site.refreshMain);
	},
	backToRoot:function ()
	{
		Mega.currentFolderId = cRootFolder;
		setTimeout(function(){Mega.refreshMain();},500);
	},
	openFolder:function (ind) {
		Mega.currentFolderId = Mega.fileList[Mega.fileList.length - 1].f[ind].h;
		setTimeout(function(){Mega.refreshMain();},500);
	},
	refreshMain:function(){
		Mega.getFiles(Site.listFiles);
	},
	login:function()
	{
		var mail=$('#login_email').val(),
			password=$('#login_password').val();
			
		Mega.login(mail,password,Site.listFiles);
	},
	runPrompt:function (title, inhtml)
	{
		$('#customPopup').show();
	},
	closePrompt:function()
	{
		$('#customPopup').hide();
	},
	listFiles:function()
	{
		var cont = document.getElementById("fileTable");
		cont.innerHTML = "<tr><th>Filename</th><th>File Id</th><th>Action</th><th>Delete File</th></tr>";
		
		for (var i = 0; i < Mega.fileList[cFileIndex - 1].f.length; i++)
		{
			var tempFile = Mega.fileList[cFileIndex - 1].f[i];

			if (tempFile.p == Mega.currentFolderId && tempFile.name !== undefined && tempFile.name != "") {
				if (tempFile.t == 1) {
					console.log("Loaded Folder: " + tempFile.name);
					cont.innerHTML += "<tr class='fTr'><td>" + tempFile.name + "</td><td>" + tempFile.h + "</td><td><button onclick='Site.openFolder(" + i + ")'>Browse</button></td><td><button onclick='deleteFile(\"" + tempFile.h + "\")'>Delete</button></td></tr>";
				} else if (tempFile.t == 0) {
					console.log("Loaded File: " + tempFile.name);
					cont.innerHTML += "<tr class='fTr'><td>" + tempFile.name + "</td><td>" + tempFile.h + "</td><td><button onclick='Mega.download(" + i + ")'>Download</button></td><td><button onclick='deleteFile(\"" + tempFile.h + "\")'>Delete</button></td></tr>";
				}
			}
		}
	}
}