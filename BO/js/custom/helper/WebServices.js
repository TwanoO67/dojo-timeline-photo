/*
    AW 18/06/13
    Helper WebServices: Contient les communications avec le serveur
*/
try{
define([
	"dojo/request"
],function(
	DO_Request
){
    //variable static? TODO verifier si la valeur de la variable est conservé dans 2 module séparé
    //var privateValue = 0;
    return {
    	upload_url: "/BO/upload.php",
    	webservice_url: '/BO/webservice.php',
    	
        //upload à partir d'un fichier droppé
        uploadImage: function(file,album_name,cb_progress,cb_onload){
       		var xhr = new XMLHttpRequest(),
            fd = new FormData();
            
            fd.append( 'fichier', file );
            fd.append('album', album_name);
            xhr.open( 'POST', this.upload_url, true );
            xhr.upload.onprogress = cb_progress;
            xhr.onload = cb_onload;
            xhr.send( fd );
	       
       },
       
       deleteImage: function(imgPath){
       		return DO_Request.post(this.upload_url, {
	            data: { 
	                mode : "delete",
	                file_path: imgPath,
	            },
	            //timeout: 2000,// Wait 2 seconds max for a response
	            handleAs:"json"
	        });
       },
       
       //upload à partir d'un blob
       upload: function(imgBlob, filename, album_name, cb_progress, cb_onload){
    
       			var type= 'image/jpeg';
       			
                //ADD sendAsBinary compatibilty to older browsers
                if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                    XMLHttpRequest.prototype.sendAsBinary = function(string) {
                        var bytes = Array.prototype.map.call(string, function(c) {
                            return c.charCodeAt(0) & 0xff;
                        });
                        this.send(new Uint8Array(bytes).buffer);
                    };
                }

                var xhr = new XMLHttpRequest();
                
                fd = new FormData();
	            fd.append('fichier', imgBlob, filename );
	            fd.append('file_name', filename);
	            fd.append('album', album_name);
	            fd.append('mode', 'upload');
	            xhr.open( 'POST', this.upload_url, true );
	            xhr.upload.onprogress = cb_progress;
	            xhr.onload = cb_onload;
	            xhr.send( fd );
                
        },
		
		actionAlbum: function(album_name,mode,mydata){
			return DO_Request.post(this.webservice_url, {
                data: { 
                    mode : mode,
                    album: album_name,
                    donnee: mydata
                },
                //timeout: 2000,// Wait 2 seconds max for a response
                handleAs:"json"
            });
		},
       
        
    };
});
}catch(e){
	console.error(e);
}