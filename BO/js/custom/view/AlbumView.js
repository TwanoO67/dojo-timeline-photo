try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
        
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    
    "custom/helper/WebServices",
    
    "custom/widget/AlbumListItemWidget",
    
    "dijit/_WidgetBase",
    "dijit/form/Button",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/AlbumView.html", 
    
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
    
    C_H_WebServices,
    
    C_W_AlbumListItemWidget,
    
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
        baseClass: "AlbumView",
        
        //variable de chaine internationalisé
        STRING: g_language,
        //variable de stockage des données objet
        data: {},
        //representation des données en widgets
        affichage: "polaroid",
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
        
        changeDisplayType: function(){
        	var self = this;
        	if(self.affichage == 'polaroid'){
	        	self.affichage = 'liste';
				self.btnDisplayAlbum.set('label', self.STRING.ALBUM_DISPLAY_IMAGES);
	        }
	        else{
		        self.affichage = 'polaroid';
		        self.btnDisplayAlbum.set('label', self.STRING.ALBUM_DISPLAY_LIST);
	        }
	        self.displayData();
        },
        
        postCreate: function(){
        	var self = this;
        	
        	self.btnNewAlbum.on('click',function(){
	        	loadView('custom/view/AlbumPropView');
        	});
        	
        	self.btnDisplayAlbum.on('click', function(){
        		self.changeDisplayType();
        	});
        	
        	self.loadDataFromServer();
			
        },
        
        displayData: function(){
        	var self = this;
        	logDebug('AlbumView:displayData');
	        if(this.data.length < 1){
        	    DO_DOM_Style.set(self.emptyList,"display", "block");
        	    DO_DOM_Style.set(self.holder,"display", "none");
    	    }
    	    else{
        	    DO_DOM_Style.set(self.emptyList, "display", "none");
        	    self.holder.innerHTML = '';
        	    DO_DOM_Style.set(self.holder, "display", "block");
        	    
				//Parcours de la liste
                DO_B_Array.forEach(
        		    self.data,
        		    function(item,i){
        		        this.myMethod(item,i);
        		    },
        		    {
                        myMethod: function(element,index){
                            var data = {
	                            album: element,
	                            affichage: self.affichage,
	                            parent: self
                            };
                            
                        	var li = new C_W_AlbumListItemWidget(data);
                        	
                            DO_DOM_Construct.place(li.domNode,self.holder,'last');
                        }
                    }
                );
            
            }
        },
        
        loadDataFromServer: function(){
        	logDebug('AlbumView:loadDataFromServer');
            var self = this;
            //puis la remplie en ajoutant le contenu du dossier json
    		C_H_WebServices.actionAlbum('',"list").then(
                function(donnee){
                	if(donnee.status = 'ok'){
                	    self.data = donnee.data;
                	    self.displayData();
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
                        msg: self.STRING.ERROR_LOADING,
                        code: "error" 
                    });
                }
            );
        
        }
        
                
    });
});
}
catch(e){
	logDebug(e.message);
}