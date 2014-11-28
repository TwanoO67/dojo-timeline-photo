try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    
    "dojo/Evented",
    "dojo/Stateful",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    
    "dojo/fx/Toggler",
    
    "dojox/widget/Dialog",
    
    "dojo/dnd/Source",
    
    "custom/helper/String",
    "custom/helper/WebServices",
    "custom/helper/Image",
    
    "custom/widget/DateAndTimeTextBox",
    
    "dijit/_WidgetBase", 
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/DateTextBox",
    "dijit/Editor",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/EventEditWidget.html", 
    
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare, 
    DO_B_Lang,
    DO_B_Array,
    
    DO_Evented,
    DO_Stateful,
    DO_DOM,
    DO_DOM_Style,
    DO_DOM_Construct,
    DO_On,
    
    DO_FX_Toggler,
    
    DX_W_Dialog,
    
    DO_D_Source,
    
    C_H_String,
    C_H_WebServices,
    C_H_Image,
    
    C_W_DateAndTimeTextBox,
    
    DI_WidgetBase,
    DI_F_TextBox,
    DI_F_TextArea,
    DI_F_DateTextBox,
    DI_Editor,
    
    DI_Registry,
    DI_TemplateMixin, 
    DI_WidgetInTemplateMixin,
    
    HTML_template, 

    DO_Ready   
    
){
    return DO_B_Declare([DI_WidgetBase, DO_Evented, DI_TemplateMixin, DI_WidgetInTemplateMixin ], {
        //lien vers le contexte appelant
        global_store: null,
        //variable de chaine internationalisé
        STRING: {},
        //variable de stockage des données objet
        donnee: {},
        index: 0,

        // Our template - important!
        templateString: HTML_template,

        // A class to be applied to the root node in our template
        baseClass: "EventEditWidget",
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
        
        postCreate: function(){
        	this.inherited(arguments);
			var self = this;
			
			this.updateDisplay();
			
			//tout ce qui est fait ici sera détruit avec le widget (donc gestion des évenements)
			this.own(
    			//A chaque modification du template, maj des données interne
    			self.attach_startDate.on("change", function(value){
    				self.donnee.startDate = self.attach_startDate.get('value');
    			}),
    			self.attach_headline.on("change", function(value){
    				self.donnee.headline = self.attach_headline.get('value');
    			}),
    			self.attach_text.on("change", function(value){
    				self.donnee.text = self.attach_text.get('value');
    			}),
    			self.attach_media.on("change", function(value){
    				self.donnee.asset.media = self.attach_media.get('value');
    			}),
    			self.attach_credit.on("change", function(value){
    				self.donnee.asset.credit = self.attach_credit.get('value');
    			}),
    			self.attach_caption.on("change", function(value){
    				self.donnee.asset.caption = self.attach_caption.get('value');
    			}),
    			
    			DO_On(self.attach_save,"click", function(evt) {
                	self.saveData();
        	    }),
        	    
        	    /*DO_On(self.attach_new, 'click', function(evt){
        	        loadEvent(0);
        	    }),*/
        	    
        	    DO_On(self.attach_delete, 'click', function(evt){
        	        self.deleteImage(self.attach_media.get('value'),self);
        	    })
        	    
        	    //DO_On(self.attach_dropzone, 'drop', DO_B_Lang.hitch(this, self.uploadImage))
    			
            );
            
        },
        
        //remplir le formulaire avec les données du tableau 'donnee'
        updateDisplay: function(){
	        this.attach_startDate.set('value', this.donnee.startDate);
	        this.attach_headline.set('value', this.donnee.headline);
	        this.setMediaImage(this.donnee.asset.media);
	        this.attach_text.set('value', this.donnee.text);
	        this.attach_credit.set('value', this.donnee.asset.credit);
	        this.attach_caption.set('value', this.donnee.asset.caption);
        },
        
        //affiche le contenu du media selon son type
        setMediaImage: function(valeur){
        	var self = this;
        	this.donnee.asset.media = valeur;
	        this.attach_media.set('value', valeur);
	        
	        //si commence par / ou ./ (alors image)
	        if(valeur.indexOf('/') != -1 && valeur.indexOf('/') < 2){
		        this.attach_media_img.src = valeur;
		        DO_DOM_Style.set(this.attach_media_img,{display:'block'});
		        
		        
		        
		        //ajout d'un bouton de suppression
		        var nom_fichier = valeur;
		        var tab = valeur.split('/');
		        nom_fichier = tab[tab.length - 1];
		        
		        /*var noeud = DO_DOM_Construct.create('li', { innerHTML: nom_fichier +' <img src="./img/delete_red.png" style="width:15px;cursor:pointer;" />' });
	            DO_On(noeud,'click', function(){ self.deleteImage(valeur,noeud); } );
	            console.log(noeud);
	            console.log(self.attach_media_img_liste);
	            //self.attach_media_img_liste.innerHTML = noeud;
	            self.attach_media_img_liste.insertNodes(false, [ noeud ]);
	            */
	            
	            
	        }
	        else if(valeur.indexOf('youtu') != -1){
		        //TODO que faire en cas de video youtube
	        }
        },
        
        deleteImage: function(imgPath,noeud){
            var self = this;
			if(confirm("Etes vous sûr de vouloir supprimer cette image définitivement?")){
				//Appel du webservice
				C_H_WebServices.deleteImage(imgPath).then(
		            function(data){
		                logDebug('Server got:', data);
		            	if(data.status=='ok'){
		            		//préviens la liste de supprimer l'element du noeud
		            		self.emit('deleteEventItem');
							logDebug("envoi de l'evenement deleteEventItem");
		            	    DO_DOM_Construct.destroy(noeud.id);
		            	    //self.attach_media_img_liste.getAllNodes().query(noeud.id).orphan();
			            	//self.attach_media_img_liste.sync();
			            	//TODO: on peut aussi prevoir la construction de la source dans le updateDisplay et rafraichir a la suppresion
		            	}
		            	else
		                	alert(data.message);
		            },
		            function(error){
		            	alert(error);
		            }
		        );
	        }
		},
        
        saveData: function(){
    		if(this.index > 0){
    		    this.global_store.put(this.donnee);
            }else{
    		    this.global_store.add(this.donnee);
            }
            this.emit("saved", {});
        },
        
    });
});
}
catch(e){
	console.log(e.message);
}