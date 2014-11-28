try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
        
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/query",
    
    "dojo/store/Memory",
    
    "custom/helper/Date",
    "custom/helper/WebServices",
    "custom/store/JSONStore",
    "custom/widget/AlbumListItemWidget",
    "custom/widget/DateAndTimeTextBox",
    
    "dijit/_WidgetBase",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/form/ComboBox",
    "dijit/Editor",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/json",
    "dojo/text!./templates/AlbumPropView.html", 
    
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare, 
    DO_B_Lang,
    DO_B_Array,
    
    DO_DOM,
    DO_DOM_Style,
    DO_DOM_Construct,
    DO_On,
    DO_Query,
    
    DO_S_Memory,
    
    C_H_Date,
    C_H_WebServices,
    C_S_JSONStore,
    C_W_AlbumListItemWidget,
    C_W_DateAndTimeTB,
    
    DI_WidgetBase,
    DI_F_Button,
    DI_F_Textbox,
    DI_F_Combobox,
    DI_Editor,
    DI_L_BorderContainer,
    DI_L_ContentPane,
    
    DI_Registry,
    DI_TemplatedMixin, 
    DI_WidgetsInTemplateMixin,
    
    DO_JSON,
    HTML_template,

    DO_Ready   
    
){
    return DO_B_Declare([DI_WidgetBase, DI_TemplatedMixin, DI_WidgetsInTemplateMixin ], {
        // Our template - important!
        templateString: HTML_template,
        // A class to be applied to the root node in our template
        baseClass: "AlbumView",
        mode: 'existing_album',
        
        //lien vers le contexte appelant
        dataStore: null,
        stateStore: null,
        //variable de chaine internationalisé
        STRING: g_language,
        //variable de stockage des données objet de l'album
        datatab: {},
        //representation des données en widgets
        affichage: "polaroid",
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
                
        postCreate: function(){
        	var self = this;
        	
        	//remplir les valeurs disponible pour les templates
        	self.templateStore = new DO_S_Memory({});
        	
        	self.templateStore.put({name:"epurate.php", path:"epurate.php", id:"epurate.php"});
        	self.templateStore.put({name:"timeline.php", path:"timeline.php", id:"timeline.php"});
        	self.templateStore.put({name:"wedding.php", path:"wedding.php", id:"wedding.php"});
		    self.attach_album_template._setStoreAttr(self.templateStore);
        	
        	self.btnSaveAlbum.on('click',function(){
	        	self.dataStore.album_headline = self.attach_album_headline.value ;
				self.dataStore.album_startDate = self.attach_album_startDate.value ;
				self.dataStore.album_text = self.attach_album_text.value ;
				self.dataStore.album_media = self.attach_album_media.value ;
				self.dataStore.album_template = self.attach_album_template.value ;
				if(self.dataStore.album_headline == ''){
					alert(self.STRING.ALBUM_TITLE_EMPTY_ERROR);
				}
				else{
					var afterSaveCallback = function(){
						if(self.mode == 'new_album'){
						    loadView('custom/view/EventsView',{
	        	        		dataStore: self.dataStore
	                		});
						}
						else{
	    					alert(self.STRING.ALBUM_PROPERTIES_SAVED);
						}
					};
					self.dataStore.save(afterSaveCallback);		
				}
        	});
        	
        	//modification d'un existant
        	if(self.dataStore != null){
	        	self.attach_album_headline.set('value',self.dataStore.album_headline);
				self.attach_album_startDate.set('value',self.dataStore.album_startDate);
				self.attach_album_text.set('value',self.dataStore.album_text);
				self.attach_album_media.set('value',self.dataStore.album_media);
				self.attach_album_template.set('value',self.dataStore.album_template);
			}
			//creation d'un nouveau
			else{
				self.dataStore = new C_S_JSONStore();
				self.mode = 'new_album';
				
				var now = C_H_Date.dateToTimeline(new Date());
				self.attach_album_startDate.set('value',now);
				
				self.attach_album_template.set('epurate');
			}
			
			
			//si c'est un nouvel album, le bouton back retourne a la page des albums
			if(self.mode == 'new_album'){
			    self.btnBackAlbums.set('label',self.STRING.ALBUM_CANCEL);
        	    self.btnBackAlbums.on('click',function(){
            		loadView('custom/view/AlbumView');
            	});
            	self.btnSaveAlbum.set('label',self.STRING.ALBUM_VALIDATE);
        	}
        	//sinon le bouton back raméne à l'album en cours
        	else{
            	self.btnBackAlbums.on('click',function(){
            		loadView('custom/view/EventsView',{
    	        		dataStore: self.dataStore
            		});
            	});
        	}
			
			/*
    			GESTION DE L'ILLUSTRATION
			*/
			self.stateStore = new DO_S_Memory({});
			//Remplissage d'un store avec la liste des images
			DO_B_Array.forEach(self.dataStore.data, function(event) {
				if(event.asset.media != ''){
					self.stateStore.put({name:event.headline, path:event.asset.media, id:event.id});
				}
		    });
		    if(self.stateStore.data.length == 0){
		    	self.attach_zoneMedia.style.display = "none";
		    }
		    else{
		    	console.log("chargement des miniatures");
		    	self.attach_album_media_img.src = self.dataStore.album_media;
    		    self.attach_album_img_list._setStoreAttr(self.stateStore);
    		    //au changement de la combo, on change l'image
    		    self.attach_album_img_list.on('change',function(){
    		        self.attach_album_media_img.src = self.attach_album_img_list.item.path;
    		    });
    		    
    		    //bouton de validation
    		    self.btnAlbumValid.on('click', function(){
        		    if(self.attach_album_media.value == '' || confirm('Ecraser le media existant?') ){
        		        self.attach_album_media.set('value',self.attach_album_img_list.item.path);
        		        self.attach_album_media_img.src = '';
    		        }
    		    });
		    }
			
        }        
                
    });
});
}
catch(e){
	console.log(e.message);
}