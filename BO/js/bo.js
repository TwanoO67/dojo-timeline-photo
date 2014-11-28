try{
require([
    "dbootstrap",
    "custom/store/JSONStore",
    "custom/widget/EventItemWidget",
    "custom/widget/EventEditWidget",
    "custom/helper/String",
    "custom/helper/Image",
    "custom/helper/Date",
    "custom/helper/ActionSpool",
    "custom/helper/WebServices",
    
    "dojo/dnd/Moveable",
    "dojo/dnd/Source",
    
    "dojo/ready",
    "dojo/i18n",
    "dojo/topic",
    "dojo/store/Observable",
    "dojo/Stateful",
    "dojo/Deferred",
	"dojo/query",
	"dojo/on",
    "dojo/parser",
    "dojo/json",
    "dojo/request",
    
    "dojo/_base/array",
    "dojo/_base/lang",
    'dojo/_base/unload',
    
    "dojo/dom-form", 
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom",
    
    "dojox/dtl",
    "dojox/dtl/Context",
    
    "dijit/registry",
    
    "dojo/domReady!"
], function(
    BOOTSTRAP,
    C_S_JSONStore,
    C_W_EventItem,
    C_W_EventEdit,
    C_H_String,
    C_H_Image,
    C_H_Date,
    C_H_ActionSpool,
    C_H_WebServices,
    
    DO_D_Moveable,
    DO_D_Source,
    
    DO_Ready,
    DO_I18N,
    DO_Topic,
    DO_Observable,
    DO_Stateful,
    DO_Deferred,
	DO_Query,
	DO_On,
    DO_Parser,
    DO_JSON, 
    DO_REQUEST,
    
    DO_B_Array,
    DO_B_Lang,
    DO_B_Unload,
    
    DO_DOM_Form,
    DO_DOM_Construct,
    DO_DOM_Attr,
    DO_DOM,
    
    DX_DTL,
    DX_DTL_Context,
    
    DI_Reg
    
){
	//Element de l'interface necessaire dans les fonctions
	var template_headline = DO_DOM.byId("album_headline");
	var template_startDate = DO_DOM.byId("album_startDate");
	var template_text = DO_DOM.byId("album_text");
	var template_media = DO_DOM.byId("album_media");
	var template_tableau = DO_DOM.byId("tableau");
    var template_error = DO_DOM.byId("error");
    var template_panel_event = DO_DOM.byId("cp_event");
    g_deferred = null;
    global_source_upload_image = null;
    global_act_spool = null;
    mode_debug = true;
    tmp_file_name = 'tmp-new-store';
    
    function logDebug(msg){
	    if(mode_debug){
		    console.log("bo.js -> "+msg);
	    }
    }
    

	function loadListe(){
		logDebug("appel du Store->getFullData");
	    //Recuperation des données du store actuel
	    var datatab = g_storejson.getFullData();
		logDebug("donnée recu, titre: "+datatab.timeline.headline);	
		//Construction de l'interface avec les nouvelles données
		template_headline.value = datatab.timeline.headline;
		template_startDate.value = datatab.timeline.startDate;
		template_text.value = datatab.timeline.text;
		template_media.value = datatab.timeline.asset.media;
		var elements = datatab.timeline.date;
		
		//Nettoyage des anciens widget et source
		var widgets = DI_Reg.findWidgets(template_tableau);
        DO_B_Array.forEach(widgets, function(w) {
            w.destroyRecursive(true);
        });
        g_source.clearItems();
        template_tableau.innerHTML = "";
		
		if(elements.length > 0){
			DO_B_Array.forEach(
			    elements.slice(0).reverse(),//inversion des données (sur un clone)
			    function(item,i){
			        this.myMethod(item,i);
			    },
			    {
	                myMethod: function(element,index){
	                    //Création d'un widget pour chaque element du tableau donnee
						var widget = new C_W_EventItem(element);
						g_source.insertNodes(false,[widget.domNode]);
	                }
	            }
	        );
        }
        else{
	        g_source.insertNodes(false,['&lt; pas de photo dans la liste &gt;']);
        }
        
        
		//parsing des widget dojo s'il y en a dans le template
		DO_Parser.parse(template_tableau);
		
		DO_Query('.event_unit .event_titre').on("click", function(evt) {
        	var index = DO_DOM_Attr.get(evt.target,'data-custom-index');
	    	loadEvent(index);
	    });
	    
	    DO_Query('.event_unit .delete').on("click", function(evt) {
        	var index = DO_DOM_Attr.get(evt.target,'data-custom-index');
	    	deleteEvent(index);
	    });
		
		//chargement de lapartie droite
		loadEvent(0);
	}
	
	function deleteEvent(index){
        if(typeof index != 'undefined' && index != null && index != '' && index != 0){
    	    var donnee = g_storejson.get(index);
    	    if(confirm('Etes vous sûr de vouloir supprimer "'+donnee.headline+'"')){
        	    g_storejson.remove(index);
        	    DO_DOM_Construct.destroy('event_unit_'+index);
        	    //loadListe();
        	    template_error.innerHTML = "<b style='color:red'>Store modifié</b>";
    	    }
        }
        else
            alert('Index inexistant');
	}
	
	function getNewEvent(){
		var donnee = {};
		donnee['startDate'] = '';
		donnee['headline'] = '';
		donnee['text'] = '';
		donnee['asset'] = {}
		donnee['asset']['media'] = '';
		donnee['asset']['credit'] = '';
		donnee['asset']['caption'] = '';
		donnee['id'] = '';
		return donnee;
	}
			
	function loadEvent(index){
	    logDebug("chargement de l'element "+index);
		
	    if(typeof g_storejson !== 'undefined' && index > 0){
		    //Selection du bon evenement dans le tableau courant
            var donnee = g_storejson.get(index);
		}
		else{
			index = 0;
            var donnee = getNewEvent();
		}
		
		//suppression de l'ancien (s'il existe)
		emptyEditTemplate();
		
        current_edit_template = new C_W_EventEdit({ 
            global_store: g_storejson,
            STRING: g_language, 
            index: index,
            donnee: donnee 
        });
        
		current_edit_template.placeAt(template_panel_event);
	    
	    DO_On(current_edit_template, 'saved', function(evt) {
            logDebug(' EventEdit est sauvegarder');
            emptyEditTemplate();
        });	
	}
	
	function emptyEditTemplate(){
		template_panel_event.innerHTML = "";
		if( typeof current_edit_template !== 'undefined'){
			current_edit_template.destroyRecursive();
		}
	}
	
	function prepareStore(nom_album){
		//vider la partie droite
		emptyEditTemplate();
		
    	//creation du store
        g_storejson = /*DO_Observable(*/new C_S_JSONStore({
    		file_name: nom_album
    	});
    	
        DO_On(g_storejson, 'refresh', function(evt) {
            logDebug('le store provoque un refresh');
            loadListe();
        });
        
        //cas 'Nouveau' pas besoin d'attendre le chargement, on relance un affichage direct
        if(nom_album == null || nom_album == '' || nom_album == tmp_file_name){
        	nom_album = '';
            loadListe();
        }
	}
	
	function saveCurrentAlbum(){
    	//recuperation des valeurs du form global
    	var objet  = DO_DOM_Form.toObject('form_album');
    	g_storejson.album_headline = objet["album_headline"];
        g_storejson.album_startDate = objet["album_startDate"];
        g_storejson.album_text = objet["album_text"];
        g_storejson.album_media = objet["album_media"];
        
        //gestion du cas Nouveau
        if(g_storejson.file_name == tmp_file_name && g_storejson.album_headline == ''){
            var reponse = prompt("Merci de donner un titre à votre album", "rentrer votre titre ici");
            if( reponse == null ){
                alert("Enregistrement annulé!");
                return;
            } else {
            	if(reponse != ''){
	            	g_storejson.album_headline = reponse;
            	}
            }
        }

		//enregistrement
	    g_storejson.save().then(function(){
			//MaJ a partir des info du serveur (pour avoir le bon path des media etc..)
			//g_storejson.load();
			//raffraichissement de la liste des albums
			loadFileList(g_storejson.file_name);
	    });
	}
	
	function deleteCurrentAlbum(){
		if(confirm("Etes-vous sûr de vouloir supprimer definitivement tous cet album?")){
			g_storejson.delete().then(function(){
				prepareStore();
				loadFileList();
			});
			
		}
	}
	
	function loadFileList(selectedIndex){
		var list_album = DO_DOM.byId('select_albums');
		//vide la liste
		list_album.innerHTML = '<option value="">Nouveau</option>';
		
		//puis la remplie en ajoutant le contenu du dossier json
		C_H_WebServices.actionAlbum('',"list").then(
            function(donnee){
            	if(donnee.status = 'ok'){
	                DO_B_Array.forEach(
	        		    donnee.data,
	        		    function(item,i){
	        		        this.myMethod(item,i);
	        		    },
	        		    {
	                        myMethod: function(element,index){
	                        	logDebug("ajout d'un json à la liste des fichiers");
	                        	var ligne = '<option value="'+element+'" ';
	                        	if(typeof selectedIndex !== 'undefined' && selectedIndex == element){
		                        	ligne += ' selected=selected ';
	                        	}
	                            ligne += '>'+element+'</option>';
	                            list_album.innerHTML += ligne;
	                            
	                        }
	                    }
	                );
	                DO_Parser.parse(list_album);
                }
                else{
	            	alert(donnee.message);
	            	TOPIC.publish("BO", { 
	                    msg: donnee.message,
	                    code: donnee.status 
	                });
            	}
            },
            function(error){
                TOPIC.publish("BO", { 
                    msg: "Erreur de chargement",
                    code: "error" 
                });
            }
        );
	}
	
	function uploadImages(evt) {
        var files = evt.dataTransfer.files;
        
        //creation de la liste des upload en cours (si inexistante)
        if(global_source_upload_image == null){
            global_source_upload_image = new DO_D_Source('liste_upload',{
    			autoSync: true,
    		});
        }
        
        //création d'un spool d'action si inexistant
        if(global_act_spool == null)
        	global_act_spool = new C_H_ActionSpool({'modeSynchro': false});
        
        DO_B_Array.forEach(files, function(file) {
        
            //ajout d'une noeud a la liste des upload en cours
	        var noeud = DO_DOM_Construct.create('li', { innerHTML: file.name });
	        global_source_upload_image.insertNodes(false, [ noeud ]);        
        
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
	                      var donnee = getNewEvent();
	                      donnee.headline = file.name;
	                      
	                      donnee.asset.media = retour.file_path;
	                      if(typeof imgObj.EXIF !== 'undefined'){
	                        donnee.text = imgObj.EXIF['Make']+' '+imgObj.EXIF['Model'];
                            donnee.asset.caption = 'ISO '+imgObj.EXIF['ISOSpeedRatings']
                            donnee.asset.credit = imgObj.EXIF['ImageDescription'];
                            dateT = C_H_Date.dateToArray(imgObj.EXIF['DateTime'],'AAAAMMJJ');
                            donnee.startDate = dateT['annee']+','+dateT['mois']+','+dateT['jour']+','+dateT['heure'];
	                      }
	                      
	                      g_storejson.add(donnee);
	                      
	                      //suppression du noeud dans la liste des upload
	                      DO_DOM_Construct.destroy(noeud.id);
	                  }
	                  else{
	                      alert(retour.message);
	                  }
	                  //lancement de l'action suivante dans le spool
	                  global_act_spool.callNext();
	                };
	              };
	            
	            C_H_Image.compressAndUpload(file, imgObj, g_storejson.file_name, 0.9, 800, cb_progress, cb_onload);
	        }
	        //ajout au spool
	        global_act_spool.addAction(uploadAction);
        
        });
        
        //lancement du spool si a l'arret
        global_act_spool.launch();
        
        evt.preventDefault();
    }
	
	/*function quitting(){
	    var dont_confirm_leave = 0; //set dont_confirm_leave to 1 when you want the user to be able to leave withou confirmation
        var leave_message = "Êtes-vous sûr de vouloir quitter la page?";//'You sure you want to leave?'
    	
	    if (!validNavigation) {
            if (dont_confirm_leave!==1) {
                if(!e) e = window.event;
                //e.cancelBubble is supported by IE - this will kill the bubbling process.
                e.cancelBubble = true;
                e.returnValue = leave_message;
                //e.stopPropagation works in Firefox.
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                //return works for Chrome and Safari
                return leave_message;
            }
        }
	}*/

	
	//***************
	// DEBUT DU CODE
	//***************
    
    DO_Ready(function(){
    
    
        //TODO: pour tous ce qui bouge, attribué les actions comme tel:
        //dojo.query("body").delegate(selector, eventName, fn);
    
	    g_language = C_H_String.encodeArray(DO_I18N.getLocalization("custom","timeline"));
	    
	    //rechargement de la page au changement de langue
	    DO_On(DO_DOM.byId("select_lang"), "change", function(evt) {
	        location.assign("http://"+location.hostname+location.pathname+'?language='+evt.target.value);
	    });
	    
	    //preparation du changement d'album
	    DO_On(DO_DOM.byId("select_albums"), "change", function(evt) {
	    	
	        prepareStore(evt.target.value);
	        if(evt.target.value != tmp_file_name){
	        	//chargement
		    	g_storejson.load();
		    }
	    });
	    
	    DO_On(DO_DOM.byId('album_open_link'), 'click', function(evt){
	    	var disp = DO_DOM.byId("select_display");
	    	if(g_storejson.file_name != tmp_file_name && g_storejson.file_name != ''){
	    	    window.open("http://"+location.hostname+'/FO/album.php?file_name='+g_storejson.file_name);
	    	}
	    	else{
    	    	alert("Veuillez enregistrer votre album avant de le voir en ligne.");
	    	}
	    });
	    
	    DO_On(DO_DOM.byId('save_full_album'), 'click', function(evt){
	    	saveCurrentAlbum();
	    });
	    
	    DO_On(DO_DOM.byId('delete_album'), 'click', function(evt){
	    	deleteCurrentAlbum();
	    });
	  
	    DO_On(DO_DOM.byId('new_event'), 'click', function(evt){
	        loadEvent(0);
	    });
	    
	    DO_On(window, 'dragover', function(evt) {
	        evt.preventDefault();
	    });
	
	    DO_On(window, 'drop', function(evt) {
	        evt.preventDefault();
	    });
	    
	    DO_On(DO_DOM.byId('album_dropzone'), 'drop', DO_B_Lang.hitch(this, uploadImages));
	    
	    g_source = new DO_D_Source('tableau',{
			accept: ['standard'],
			autoSync: true,
			withHandles: true,
		});
		
		g_source.onDraggingOut(function(){
			alert('drop');
		});
		
		//Chargement du store par défaut (Nouveau)
		prepareStore('');
		//chargement de la liste des fichiers
		loadFileList();
		
		//capture de la sortie
		window.onbeforeunload=function (e) {
		  if(g_storejson.isModifiedSinceLoad){
    		  var e = e || window.event;
    		  var retour = 'Attention, toute modification en cours sera perdue.';
    		  // For IE and Firefox
    		  if (e) {
    		    e.returnValue = retour;
    		  }
    		  // For Safari
    		  return retour;
		  }
		};
		/*DO_B_Unload.addOnWindowUnload(quitting);
		DO_B_Unload.addOnUnload(window,quitting);*/

	});
    
});
}
catch(e){
    console.error(e);
}