try{
define(
    [
        "dojo/Evented",
        "dojo/_base/array",
    	"dojo/dom",
    	"dojo/dom-attr",
        "dojo/Deferred",
        "dojo/store/util/QueryResults", 
        "dojo/_base/declare", 
        "dojo/_base/lang",
        "dojo/store/util/SimpleQueryEngine",
        'custom/helper/WebServices'
    ],
    function(
        DO_Evented,
        DO_B_Array,
    	DOM,
    	ATTR,
        DEFERRED,
        QueryResults, 
        declare,
        LANG,
        SimpleQueryEngine,
        C_H_WebServices
    )
{
 
    //  AW: a modifier pour faire ecrire sur webservice.php
    return declare([DO_Evented], {
        
        isModifiedSinceLoad: false,
        alreadyExistOnServer: false,
        lastGivenId: 0,
        idProperty: "id",
        queryEngine: SimpleQueryEngine,
        defaultStoreName: 'tmp-new-store',
        
        //Parametres par défaut d'un album
        file_name: "",
        album_headline: "",
        album_startDate: "",
        album_text: "",
        album_media: "",
        album_template: "epurate.php",
        album_type: "default",
        
        //donnée par evenement
        data: [],//donnée en vrac
        index: {},//donnée indexé par idProperty
        
 
        constructor: function(options){
            LANG.mixin(this, options || {});//attribue le contenu du tableau otpions au tableau this
            this.setData(this.data || []);//appelle le premier indexage
            if(this.file_name == null || this.file_name == ''){
	            this.file_name = this.defaultStoreName;
            }
        },
        
        //retourne un tableau des données
        getFullData: function(){
            logDebug('custom/store/JSONStore->getFullData item->'+this.data.length);
	        return {
	        	file_name: this.file_name,
        	    timeline: {
            	    headline: this.album_headline,
            	    type: this.album_type,
            	    startDate: this.album_startDate,
            	    text: this.album_text,
            	    template: this.album_template,
            	    asset: {
                	    media: this.album_media
            	    },
            	    date: this.data
        	    }
    		};
        },
        
        //retourne le nombre d'élément
        getCountData: function(){
            return this.data.length; 
        },
        
        //charge le store avec les data fournies en parametres dans un tableau de données
        setFullData: function(data){
        	try{
	            logDebug('custom/store/JSONStore->setFullData');
	            
	            var currentScope = this;
	            if(typeof data.file_name != 'undefined' && data.file_name != '' && data.file_name != this.defaultStoreName){
	            	logDebug('changement du nom dans le store');
		            this.file_name = data.file_name;//au cas où le nom du fichier a changé sur le serveur
	            }
	            else{
		            logDebug('Recupération des données du serveur sans modification du nom');
	            }
	            
	            if(typeof data.timeline != 'undefined'){
	                var donnee_recu = data.timeline;
	                //remplissage du store avec les données contenu
	                if(typeof donnee_recu.headline != 'undefined')
	                    this.album_headline = donnee_recu.headline;
	                if(typeof donnee_recu.text != 'undefined')
	                    this.album_text = donnee_recu.text;
	                if(typeof donnee_recu.type != 'undefined')
	                    this.album_type = donnee_recu.type;
	                if(typeof donnee_recu.startDate != 'undefined')
	                    this.album_startDate = donnee_recu.startDate;
	                if(typeof donnee_recu.asset.media != 'undefined')
	                    this.album_media = donnee_recu.asset.media;
	                if(typeof donnee_recu.asset.template != 'undefined')
	                    this.album_media = donnee_recu.asset.template;
	                if(typeof donnee_recu.date != 'undefined'){
						this.setData(donnee_recu.date);
	                }
	                
	            }
	            else{
		            alert('format de donnée inconnue');
	            }
            }   
            catch(e){
                alert(e.message);
            }
        },
        
        setOrdering: function(ordre){
            logDebug('custom/store/JSONStore->setOrdering');
            var self = this;
            var new_data = [];
            for(index = 0; index < ordre.length; ++index){
                new_data[index] = self.get(ordre[index]);
            }
            self.setData(new_data);
        },
        
        get: function(id){
            return this.index[id];
        },
        getIdentity: function(object){
            return object[this.idProperty];
        },
        getNextId: function(){
	        if(this.lastGivenId > 0){
		        var id = (this.lastGivenId + 1);
	        }
	        else{
		       var date = new Date();
		       var id = (date.getTime()+1);
	        }
	        this.lastGivenId = id;
	        return id;
        },
        put: function(object, options){
            this.isModifiedSinceLoad = true;
            var idProp = this.idProperty;
            var id = options && options.id || object[idProp];
            logDebug('put->'+id);
            object[idProp] = id;//fixe l'id si il n'existait pas
            this.index[id] = object;
            var data = this.data;
            logDebug("put->fin1");
            //modification
            for(var i = 0, l = data.length; i < l; i++){
                if(typeof data[i][idProp] !== 'undefined' && data[i][idProp] == id){
                    data[i] = object;
                    this.trigger();
                    return id;
                }
            }
            //ou insertion
            this.data.push(object);
            this.trigger();
            return id;
        },
        add: function(object, options){
            var id = options && options.id
                || object[this.idProperty];
            if(typeof id == 'undefined' || id == null || id <= 0){
                id = this.getNextId();
                object[this.idProperty] = id;                
            }
            if(this.index[id]){
                logDebug(this.index[id].headline);
                throw new Error("Object '"+id+"' already exists");
            }
            return this.put(object, options);
        },
        remove: function(id){
            delete this.index[id];
            for(var i = 0, l = this.data.length; i < l; i++){
                if(this.data[i][this.idProperty] == id){
                    this.data.splice(i, 1);
                    this.isModifiedSinceLoad = true;
                    this.trigger();
                    return;
                }
            }
        },
        query: function(query, options){
            logDebug('custom/store/JSONStore->query');
            //query avec un objet vide doit renvoyé toutes les données
            return QueryResults(
                (this.queryEngine(query, options))(this.data)
            );
        },
        setData: function(donnee){
            logDebug('custom/store/JSONStore->setData');
            this.index = {};
            this.data = [];
            if(donnee != null && donnee.length > 0){
	            for(var i = 0, l = donnee.length; i < l; i++){
	            	var obj = donnee[i];
	            	//si pas de propriété id on en genere une
	                if(obj.hasOwnProperty(this.idProperty) == false){
	                    obj[this.idProperty] = this.getNextId();
	                }
	                //sinon on verifie que l'id n'est pas supérieur
	                else if(this.lastGivenId < obj[this.idProperty] ){
	                    this.lastGivenId = obj[this.idProperty];
	                }
	                this.index[obj[this.idProperty]] = donnee[i];
	            }
	            this.data = donnee;
            }
            this.trigger();
        },
        
        
        //Enregistrement de l'album sur le serveur
        save: function(callback){
            logDebug('custom/store/JSONStore->save');
            //Enregistrement
            var currentScope = this;
    		return C_H_WebServices.actionAlbum(currentScope.file_name,"save", JSON.stringify(currentScope.getFullData()) ).then(
                function(response){
                	if(response.status == 'ok'){
                		logDebug('custom/store/JSONStore->save Titre recu '+response.data.timeline.headline);
                		currentScope.setFullData(response.data);
                	    this.isModifiedSinceLoad = false;
                	
	                    if(typeof callback == 'function'){
		                    callback();
		                    
	                    }
                	}
                    else{
                    	logDebug('custom/store/JSONStore->save Erreur du webservice');
                    	alert(response.message);
                    }
                    
                },
                function(error){
                        alert(error);
                }
            );
        },
        //Recuperation des données d'un album sur le serveur à partir de son nom 
        load: function(callback){
        	var self = this;
            logDebug('custom/store/JSONStore->load');
            if(this.file_name != ''){
                var currentScope = this;
                C_H_WebServices.actionAlbum(this.file_name,'get_data').then(
                    function(response){
                    	if(response.status == 'ok'){
                    		self.isModifiedSinceLoad = false;
                        	self.alreadyExistOnServer = true;
                        	currentScope.setFullData(response.data);
                        }
                        else{
	                        logDebug(response.message);
                        }
                        
                        if(typeof callback == 'function'){
		                    callback();
	                    }
                    },
                    function(error){
                    	alert(error);
                    }
                );
            }else{
                logDebug("custom/store/JSONStore->load() file_name vide");
            }
            this.trigger();
        },
        
        //Fonction permettant de provoquer une notify (hack)
        trigger: function(){
            logDebug('custom/store/JSONStore->trigger');
            /*logDebug('last Given id : '+this.lastGivenId);
            if(this.lastGivenId > 0)
                this.put(this.get(this.lastGivenId));*/
                
            this.emit("refresh", {});
        },
        
        //suppression du store et de toutes ses informations stoquées
        delete: function(){
	        return C_H_WebServices.actionAlbum(this.file_name,'delete');
        }
        
    });
});
}
catch(e){
	alert(e.message);
}