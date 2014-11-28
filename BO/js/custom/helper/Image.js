/*
    AW 18/06/13
    Helper Image: Contient les fonctions de traitement d'image
*/
define([
	'custom/helper/WebServices',
	'custom/helper/String',
	'library/BinaryFile',
	'library/ExifDojo',
	'library/MinifyJpegDojo',
	"dojo/Deferred",
	
],function(
	C_H_WebServices,
	C_H_String,
	Lib_BinaryFile,
	Lib_Exif,
	Lib_MinifyJpeg,
	DO_Deferred
){
    //variable static? TODO verifier si la valeur de la variable est conservé dans 2 module séparé
    //var privateValue = 0;
    return {
        //Fonction statiques
        TO_RADIANS: (Math.PI/180), 
        
        //basé sur https://github.com/brunobar79/J-I-C + algo AW + orientation(exif)
        compress: function(sourceImgObject, jpgQuality, newSize, orientation){
        	var precisionNoQuality = false;
        	
        	console.log('ancienne largeur: '+sourceImgObject.width);
			console.log('ancienne hauteur: '+sourceImgObject.height);
        	
        	//Algo pour faire un resize de taille precis, mais de qualité moyenne
        	if(precisionNoQuality){
	        	//Mode portrait
	            if(sourceImgObject.height > sourceImgObject.width){
	            	var new_height = newSize;
	                var new_width = Math.round(sourceImgObject.width * (new_height/sourceImgObject.height));
				}
				else{
				    var new_width = newSize;
	                var new_height = Math.round(sourceImgObject.height * (new_width/sourceImgObject.width));
				}
			}
			//Algo permettant de ne pas perdre de qualité, mais on divise seulement les tailles par des multiples de 2
			else{
				var new_height = sourceImgObject.height;
				var new_width = sourceImgObject.width;
				
				while( (new_height/2)>newSize && (new_width/2)>newSize ){
					new_height = Math.round(new_height/2);
					new_width = Math.round(new_width/2);
				}
			
			}
			
			var rotation = false;
			var angle = 0;
			if(orientation == 3){
				console.log('Rotation 180°');
				rotation = true;
				angle = 180;
			}
			else if(orientation == 6){
				console.log('Rotation 90°');
				rotation = true;
				angle = 90;
			}
			else if(orientation == 8){
				console.log('Rotation 270°');
				rotation = true;
				angle = 270;
			}
			
            var cvs = document.createElement('canvas');
            if(angle == 90 || angle == 270){
            	cvs.width = new_height;
	            cvs.height = new_width;
            }
            else{
	            cvs.width = new_width;
				cvs.height = new_height;
            }
            var ctx = cvs.getContext("2d");
            console.log('nouvelle largeur: '+cvs.width);
			console.log('nouvelle hauteur: '+cvs.height);
            
            //si l'image est dans le sens voulue
            if(!rotation){
	            ctx.drawImage(sourceImgObject, 0, 0, new_width, new_height);
            }
            //si une rotation est nécessaire
            else{
	            ctx.save();
				// move to the middle of where we want to draw our image
				ctx.translate(cvs.width/2, cvs.height/2);
				ctx.rotate(angle * this.TO_RADIANS);
				// draw it up and to the left by half the width and height of the image 
				ctx.drawImage(sourceImgObject, -(new_width/2), -(new_height/2), new_width, new_height );
				// and restore the co-ords to how they were when we began
				ctx.restore(); 
            }
            
            var newImageData = cvs.toDataURL("image/jpeg", jpgQuality);
            return newImageData;
        },
        		    
	    //lecture des données exif dans un fichier local, format lisible par l'homme, envoyé sur la console
	    readExifFromFile: function(file, deferred){
            var temp_reader = new FileReader();
            temp_reader.onload = function(event){
            	var oFile = new Lib_BinaryFile(event.target.result,0,event.target.result.length);
	            var exifData = Lib_Exif.findEXIFinJPEG(oFile);
	            deferred.resolve(exifData);
            };
            temp_reader.readAsBinaryString(file);
	    },
	    
	    readExifFromBS: function(imageBS){
		    //var imageBS = this.dataURItoByteString(imgB64);
            var oFile = new Lib_BinaryFile(imageBS,0,imageBS.length);
	        var exifDataTab = Lib_Exif.findEXIFinJPEG(oFile);
	        return exifDataTab
	    },
		
		//insert les données exif de la source b64, dans la dest b64 et renvoi le resultat
        replaceExif: function(imageStrSource, imageStrDest){
	        var rawImage = Lib_MinifyJpeg.decode64(imageStrSource.replace("data:image/jpeg;base64,", ""));
	        var segments = Lib_MinifyJpeg.slice2Segments(rawImage);
	        var newImageStrBuffer = Lib_MinifyJpeg.exifManipulation(imageStrDest, segments);
	        /*var exifArray = Lib_MinifyJpeg.getExifArray(segments);
            var newImageArray = Lib_MinifyJpeg.insertExif(imageStrDest, exifArray);
            var newImageStrBuffer = new Uint8Array(newImageArray);
	        */
	        
	        var newImageStr = "data:image/jpeg;base64," + Lib_MinifyJpeg.encode64(newImageStrBuffer);
		    return newImageStr;   
	    },
	    
	    dataURItoBlob: function(dataURI) {
		    'use strict'
		    var mimestring; 
		
		    var byteString = this.dataURItoByteString(dataURI);
		
		    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]
		
		    var content = new Array();
		    for (var i = 0; i < byteString.length; i++) {
		        content[i] = byteString.charCodeAt(i)
		    }
		
		    return new Blob([new Uint8Array(content)], {type: mimestring});
		},
		
		dataURItoByteString: function(dataURI) {
		    'use strict'
		    var byteString;
		
		    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
		        byteString = atob(dataURI.split(',')[1])
		    } else {
		        byteString = decodeURI(dataURI.split(',')[1])
		    }
		
		    return byteString;
		},
		
		ByteStringToDataURI: function(byteString){
			return "data:image/jpeg;base64," + btoa(byteString);
		},
	    
	    //compresse une image en conservant sa qualité et ses données exif, puis l'upload
	    compressAndUpload: function(file, imgObjDest, album, jpegQuality, minSizeOfBiggerSide, callback_progress, callback_onload){
	    	var isValidJpegWithEXIF = false;
	    	var self = this;
		    var reader = new FileReader();
            reader.onload = function(event) {
                
                var originalImageB64 = event.target.result;
                
                //lecture de l'orientation dans les tags exif (+ verification si le jpeg est valide)
                var originalImageBS = self.dataURItoByteString(originalImageB64);
                
	            var exifDataTab = self.readExifFromBS(originalImageBS);
	            if(exifDataTab != false){
		            isValidJpegWithEXIF = true;
	            }
	            
	            if(isValidJpegWithEXIF){
	            	//place les données EXIF dans l'objet image (pour eventuellement les recuperer plus tard)
	            	imgObjDest.EXIF = exifDataTab;
	            	console.log(exifDataTab);
					var orientationEXIForig = exifDataTab['Orientation'];
					console.log("EXIF Orientation -> "+orientationEXIForig);
                
	                //remplacement des données EXIF Orientation (si on va retourner la photo)
	                if( orientationEXIForig==3 || orientationEXIForig==6 || orientationEXIForig==8 ){
	                	console.log("modification de l'orientation EXIF");
		                var iOffset = exifDataTab['Orientation-param'].iEntryOffset;
		                var bBigEnd = exifDataTab['Orientation-param'].bBigEnd;
		                var charIndex = iOffset+8+1;
		                console.log('valeur originale = '+originalImageBS.charCodeAt(charIndex));
		                var modifiedBS = C_H_String.replaceAt(originalImageBS, charIndex, String.fromCharCode(1));
		                console.log('valeur nouvelle = '+modifiedBS.charCodeAt(charIndex));
		                //remplacement de l'image b64 par celle au nouvelle valeur EXIF
		                originalImageB64 = self.ByteStringToDataURI(modifiedBS);
	                }
                                	
					console.log("DateTime: "+exifDataTab['DateTime']);
				}
				
				//1) cree un objet img avec les données en base64 (possiblement modifié)
                var img_temp = new Image();
                img_temp.onload = function(){
                	//2) Appel le processus de compression
                	var newImageB64 = self.compress(img_temp,jpegQuality,minSizeOfBiggerSide,orientationEXIForig);//.src;
                	//3) remplace les donnés exif
                	if(isValidJpegWithEXIF){
                    	newImageB64 = self.replaceExif(originalImageB64, newImageB64);
                    }             	
                    //4) va placer le resultat dans media_img 
                    imgObjDest.src = newImageB64;
                    //5) on convertie en blob pour l'upload
                    var imgBlob = self.dataURItoBlob(newImageB64);
                    C_H_WebServices.upload(imgBlob, file.name, album, callback_progress, callback_onload);
                  
                };
                img_temp.src = originalImageB64;
                
            }
            reader.readAsDataURL(file);
	    }    
        
                
    };
});