try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
        
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/on",
    
    "dojo/dnd/Source",
    
    "dojo/parser",
    "dojo/query",
    
    "dojox/widget/DialogSimple",
    
    "custom/helper/WebServices",
    "custom/helper/ActionSpool",
    "custom/helper/Date",
    "custom/helper/Image",
    "custom/helper/Naming",
    
    "custom/store/JSONStore",
    "custom/widget/AlbumListItemWidget",
    "custom/widget/ListItemImageMiniature",
    "custom/widget/EventEditWidget",
    "custom/model/Event",
    
    "dijit/_WidgetBase",
    "dijit/form/Button",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/ShareZoneView.html", 
    
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare, 
    DO_B_Lang,
    DO_B_Array,
    
    DO_DOM,
    DO_DOM_Style,
    DO_DOM_Construct,
    DO_DOM_Attr,
    DO_On,
    
    DO_D_Source,
    
    DO_Parser,
    DO_Query,
    
    DX_W_DialogSimple,
    
    C_H_WebServices,
    C_H_ActionSpool,
    C_H_Date,
    C_H_Image,
    C_H_Naming,
    
    C_S_JSONStore,
    C_W_AlbumListItemWidget,
    C_W_ListItemImageMiniature,
    C_W_EventEdit,
    C_M_Event,
    
    DI_WidgetBase,
    DI_F_Button,
    
    DI_Registry,
    DI_TemplatedMixin, 
    DI_WidgetsInTemplateMixin,
    
    HTML_template, 

    DO_Ready   
    
){
    return DO_B_Declare([DI_WidgetBase, DI_TemplatedMixin, DI_WidgetsInTemplateMixin ], {
        // Our template - important!
        templateString: HTML_template,
        // A class to be applied to the root node in our template
        baseClass: "ShareZoneView",
        //store de l'album
        dataStore: null,
        
        //donnée de l'album recu par le lien
        album: null,
        
        //donnée recu par l'utilisateur
        author_name: '',
        author_email: '',
        
        actionSpool: null,
        sourceUpload: null,
        
        //variable de chaine internationalisé
        STRING: g_language,
        //variable de stockage des données objet
        data: {},
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
      
        postCreate: function(){
        	var self = this;
        	
			DO_On(window, 'dragover', function(evt) {
		        evt.preventDefault();
		    });
		
		    DO_On(window, 'drop', function(evt) {
		        evt.preventDefault();
		    });
		    
		    //remplissage du titre
		    self.titleAccueil.innerHTML = self.album.titre;
		    self.divAlbumName.innerHTML = self.album.titre;
		    
		    //quand on valide son nom et mail
		    self.btnOk.on('click',function(evt){
		    	//verifier les data de l'accueil
		    	if(self.inputName.get('value') != ''){
		    		self.author_name = self.inputName.get('value');
		    		self.author_email = self.inputEmail.get('value');
		    		
		    		//Création du store
					self.dataStore = new C_S_JSONStore({
			    		file_name: self.album.path
			    	});
			    	
			    	var afterLoad = function(){
			    	    logDebug(self.dataStore);
			    	    //si le store n'existe pas encore sur le serveur
    			    	if(self.dataStore.alreadyExistOnServer == false){
    			    	    //on recuperer les données de l'album original
        			    	var originalName = C_H_Naming.getAlbumNameFromSharezoneName(self.album.path);
        			    	self.dataStore = new C_S_JSONStore({
        			    		file_name: originalName
        			    	});
        			    	//callback: puis on change les données pour en créer un album share
        			    	var afterOrigLoad = function(){
        			    	    //changement du fichier cible
        			    	    self.dataStore.file_name = self.album.path;
        			    	    //on vide les images contenu
        			    	    self.dataStore.setData(null);
        			    	    //on change le type
        			    	    self.dataStore.album_type = 'share';
        			    	    logDebug("le store n'existe pas, on crée une nouvelle sharezone");
        			    	    logDebug(self.dataStore);
        			    	};
        			    	
        			    	self.dataStore.load(afterOrigLoad);
    			    	}
			    	};
			    	//vérifie son existance sur le serveur, et s'il existe charge ses données
			    	self.dataStore.load(afterLoad);
			    	
			    	DO_On(self.dataStore, 'refresh', function(evt) {
			            logDebug('le store provoque un refresh');
			            self.displayData();
			        });
			        
			        //cacher l'accueil
			    	DO_DOM_Style.set(self.divAccueil,"display", "none");
			    	//afficher le reste
			    	DO_DOM_Style.set(self.divPrincipal,"display", "block");
			    
				    g_source = new DO_D_Source(self.holder,{
						accept: ['standard'],
						autoSync: true,
						withHandles: true,
					});
					
					g_source.onDraggingOut(function(){
						alert('drop');
					});

					DO_On(self.albumDropzone, 'drop', function(evt){
				    	logDebug('drop detecté');
				    	self.uploadImages(evt);
						}	
				    );
				    
			    	
		    	}
		    	else{
			    	alert('Veuillez préciser un nom pour continuer');
		    	}
		    	
		    	
		    });
		    
	    	//chargement des données du serveur
	    	//self.dataStore.load();
			
        },
        
        displayData: function(){
        	var self = this;
        	logDebug("appel du Store->getFullData "+self.dataStore.file_name);
		    //Recuperation des données du store actuel
		    var datatab = self.dataStore.getFullData();
		    
			self.divAlbumName.innerHTML = datatab.timeline.headline;	
			
			//Construction de l'interface avec les nouvelles données
			/*template_headline.value = datatab.timeline.headline;
			template_startDate.value = datatab.timeline.startDate;
			template_text.value = datatab.timeline.text;
			template_media.value = datatab.timeline.asset.media;*/
			var elements = datatab.timeline.date;
			//Nettoyage des anciens widget et source
			var widgets = DI_Registry.findWidgets(self.holder);
	        DO_B_Array.forEach(widgets, function(w) {
	            w.destroyRecursive(true);
	        });
	        g_source.clearItems();
	        self.holder.innerHTML = "";
			
			if(elements.length > 0){
				DO_B_Array.forEach(
				    elements.slice(0).reverse(),//inversion des données (sur un clone)
				    function(item,i){
				        this.myMethod(item,i);
				    },
				    {
		                myMethod: function(element,index){
		                    //Création d'un widget pour chaque element du tableau donnee
							var widget = new C_W_ListItemImageMiniature(element);
							widget.dataStore = self.dataStore;
							g_source.insertNodes(false,[widget.domNode]);
							//Placement des actions
							DO_On(widget, "openEventItem", function(data) {
						    	self.loadEvent(element.id);
						    });
						    
						    DO_On(widget, "deleteEventItem", function(data) {
						    	logDebug('deleteEventItem detecté 1');
						    	self.deleteEvent(element.id);
						    });
		                }
		            }
		        );
	        }
	        else{
		        g_source.insertNodes(false,[self.STRING.ALBUM_EMPTY_PHOTO_LIST]);
	        }
	        
        },
        
        emptyEditTemplate: function(){
        	var self = this;
			if( typeof current_edit_template !== 'undefined'){
				current_edit_template.destroyRecursive();
			}
			self.rightZone.innerHTML = "";
			DO_DOM_Style.set(self.rightZone,"display", "none");
		},
        
        loadEvent: function(index){
        	var self = this;
		    logDebug("chargement de l'element "+index);
			
		    if(typeof self.dataStore != null && index > 0){
			    //Selection du bon evenement dans le tableau courant
	            var donnee = self.dataStore.get(index);
			}
			else{
				index = 0;
	            var donnee = new C_M_Event();
			}
			
			logDebug(self.dataStore);
			logDebug(donnee);
			
			//suppression de l'ancien (s'il existe)
			self.emptyEditTemplate();
			
	        current_edit_template = new C_W_EventEdit({ 
	            global_store: self.dataStore,
	            STRING: g_language, 
	            index: index,
	            donnee: donnee 
	        });
	        
			current_edit_template.placeAt(self.rightZone);
			DO_DOM_Style.set(self.rightZone,"display", "block");
		    
		    //a l'enregistrement du formulaire d'edition
		    DO_On(current_edit_template, 'saved', function(evt) {
	            logDebug(' EventEdit est sauvegardé');
	            //Sauvegarge automatique de l'album
	            self.dataStore.save();
	            self.emptyEditTemplate();
	        });
	        
	        
		    DO_On(current_edit_template, "deleteEventItem", function(data) {
		    	logDebug('deleteEventItem detecté venant de EventEdit');
		    	self.deleteEvent(index);
		    });
		},
		
		getNewEvent: function(){
			var donnee = {};
			donnee['id'] = '';
			donnee['startDate'] = '';
			donnee['headline'] = '';
			donnee['text'] = '';
			donnee['asset'] = {}
			donnee['asset']['media'] = '';
			donnee['asset']['credit'] = '';
			donnee['asset']['caption'] = '';
			donnee['author'] = {};
			donnee['author']['name'] = this.author_name;
			donnee['author']['email'] = this.author_email;
			return donnee;
		},
		
		deleteEvent: function(index){
			var self = this;
	        if(typeof index != 'undefined' && index != null && index != '' && index != 0){
	    	    var donnee = self.dataStore.get(index);
	    	    if(confirm('Etes vous sûr de vouloir supprimer "'+donnee.headline+'"')){
	        	    self.dataStore.remove(index);
	        	    DO_DOM_Construct.destroy('event_unit_'+index);
	        	    //loadListe();
	        	    //template_error.innerHTML = "<b style='color:red'>Store modifié</b>";
	        	    self.dataStore.save();//sauvegarde auto
	    	    }
	        }
	        else
	            alert('Index inexistant');
		},
		
		uploadImages: function(evt) {
			logDebug('upload');
			var self = this;
	        var files = evt.dataTransfer.files;
	        
	        //creation de la liste des upload en cours (si inexistante)
	        if(self.sourceUpload == null){
	            self.sourceUpload = new DO_D_Source(self.listeUpload,{
	    			autoSync: true,
	    		});
	        }
	        
	        //création d'un spool d'action si inexistant
	        if(self.actionSpool == null){
	        	self.actionSpool = new C_H_ActionSpool({'modeSynchro': false});
	        }
	        
	        DO_B_Array.forEach(files, function(file) {
	        
	            //ajout d'une noeud a la liste des upload en cours
		        var noeud = DO_DOM_Construct.create('li', { innerHTML: file.name });
		        self.sourceUpload.insertNodes(false, [ noeud ]);        
	        
	        	//preparation du traitement
		        var uploadAction = function(){
		        	var imgObj = new Image();
		        	
		            //Fonction de progression
	        		var cb_progress = function(e) {
	                    if (e.lengthComputable) {
	                      var percentComplete = (e.loaded / e.total) * 100;
	                      noeud.innerHTML = file.name+' '+Math.round(percentComplete)+ '%';
	                    }
	                  };
	
		            //Fonction de retour de l'upload de l'image
		            var cb_onload = function(){
		                if (this.status == 200) {
		                  var retour = JSON.parse(this.response);
		                  //logDebug('Server got:', retour);
		                  if(retour.status == 'ok'){
		                      //enregistrement de l'evenement
		                      var donnee = self.getNewEvent();//new C_M_Event();
		                      donnee.headline = file.name;
		                      
		                      donnee.asset.media = retour.file_path;
		                      if(typeof imgObj.EXIF !== 'undefined'){
		                          donnee.text = imgObj.EXIF['Make']+' '+imgObj.EXIF['Model'];
	                              donnee.asset.caption = 'ISO '+imgObj.EXIF['ISOSpeedRatings']
	                              donnee.asset.credit = imgObj.EXIF['ImageDescription'];
	                              dateT = C_H_Date.dateToArray(imgObj.EXIF['DateTime'],'AAAAMMJJ');
	                              donnee.startDate = dateT['annee']+','+dateT['mois']+','+dateT['jour']+','+dateT['heure'];
		                      }
		                      logDebug(donnee);
		                      
		                      self.dataStore.add(donnee);
		                      
		                      //suppression du noeud dans la liste des upload
		                      DO_DOM_Construct.destroy(noeud.id);
		                      //noeud.destroyRecursive();
		                  }
		                  else{
		                      alert(retour.message);
		                  }
		                  //lancement de l'action suivante dans le spool
		                  self.actionSpool.callNext();
		                };
		              };
		            
		            C_H_Image.compressAndUpload(file, imgObj, self.dataStore.file_name, 0.9, 800, cb_progress, cb_onload);
		        }
		        //ajout au spool
		        self.actionSpool.addAction(uploadAction);
	        
	        });
	        
	        
	        //A la fin des upload j'enregistres les données sur le serveur
	        self.actionSpool.addAction(function(){
		        self.dataStore.save(function(){
		        	self.actionSpool.callNext();
		        }
		        );
	        });
	        
	        //lancement du spool si a l'arret
	        self.actionSpool.launch();
	        evt.preventDefault();
	    }

        
                
    });
});
}
catch(e){
	logDebug(e.message);
}