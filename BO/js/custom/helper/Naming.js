/*
    AW 18/06/13
    Helper Naming: Contient les fonctions permettant de généré des noms de fichiers
*/
define([
	"dojox/lang/functional"
], function(
	DX_L_Functional
){
    //variable static
    var sharePrefix = 'share-';
    
    
    return {
        //Fonction statiques
        
        getSharezoneNameFromAlbumName: function(albumName){
           return sharePrefix+albumName; 
        },
        
        getAlbumNameFromSharezoneName: function(shareName){
            return shareName.replace(sharePrefix,'');
        }
                
    };
});