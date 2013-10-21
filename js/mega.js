Mega={
	isLogged:false,	
	user:{
		type:0,
	},
	fileList:[],
	currentFolderId:undefined,
	createFolder:function(parentId, name, afterCallBack)
	{
		if (!Mega.isLogged) return false;
		
		if(parentId===undefined){
			parentId=Mega.currentFolderId;
		}
		
		var attrs = {
			n: name
		};
		var mkat = enc_attr(attrs, []);
		var req = {
			a: 'p',
			t: parentId,
			n: [{
				h: 'xxxxxxxx',
				t: 1,
				a: ab_to_base64(mkat[0]),
				k: a32_to_base64(encrypt_key(u_k_aes, mkat[1]))
			}],
			i: requesti
		};
		api_req([req], {
			ulparams: false,
			callback: function (json, params) {
				Mega.fileList[cFileIndex] = new Object;
				Mega.fileList[cFileIndex].f = json[0].f;
				process_f(cFileIndex, true, {
					fn: function () {}
				});
				cFileIndex++;
				if (afterCallBack) afterCallBack();
			}
		});
	},
	download:function(arrayInd)
	{
		var disFiles = Mega.fileList[Mega.fileList.length - 1].f;
		if (disFiles[arrayInd].s == -1) {
			console.log("Tried to Download Folder");
			return;
		}
		var fileid=disFiles[arrayInd].h, 
			filekey=disFiles[arrayInd].key, 
			filename=disFiles[arrayInd].name;
		
		dl_queue.push({
			id: fileid,
			key: filekey,
			n: filename,
			onDownloadProgress: cDlProgress,
			onDownloadComplete: cDlComplete,
			onBeforeDownloadComplete: cDlAlmost,
			onDownloadError: cDlError,
			onDownloadStart: cDlStart
		});
		startdownload();	
	},
	login:function(mail,password,callback)
	{
		var remember=true,
			uh='';
		
		if(mail=='' || password=='' || password.length<3){
			return false;
		}
		
		mail=mail.toLowerCase();
		passwordEncrypted = new sjcl.cipher.aes(prepare_key_pw(password));
		
		uh = stringhash(mail, passwordEncrypted);
		return u_login(
		{
					
		 checkloginresult:function(ctx, r){			

				if (r == EBLOCKED) {
					console.log("Account Suspended");
					Mega.isLogged = false;
				} else if (r) {
					u_type = r;
					console.log("Login Success");				
					Mega.isLogged=true;
					Site.closePrompt();
					Mega.getFiles(callback);
				} else {
					console.log("Login Failed");
					Mega.isLogged = false;					
					alert('Invalid mail / Password');
				}
			}
			
		}, mail, password, uh, remember);
	},
	getFiles:function(readyCallback)
	{
		if (!Mega.isLogged) return false;
		api_req([{
			a: 'f',
			c: 1
		}], {
			start_ul: false,
			callback: function (json, res) {
				json = json[0];
				maxaction = json.sn;
				var callback = new Object;
				if (json.cr) callback.cr = json.cr;
				if (json.sr) callback.sr = json.sr;
				callback.fn = function (cb) {
					if (cb.cr) crypto_procmcr(cb.cr);
					if (cb.sr) crypto_procsr(cb.sr);
					getsc();
					ul_completepending();
					crypto_share_rsa2aes();
					crypto_sendrsa2aes();
				}
				Mega.fileList[cFileIndex] = new Object;
				Mega.fileList[cFileIndex].f = json.f;
				process_f(cFileIndex, false, callback);
				if (Mega.currentFolderId === undefined) Mega.currentFolderId = cRootFolder;
				cFileIndex++;
				if (readyCallback) {
					console.log("File System Refreshed!");
					readyCallback(cFileIndex - 1);
				}
			}
		});
	}
	
}