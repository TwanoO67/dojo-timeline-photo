try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
        
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    
    "custom/view/EventsView",
    
    "dijit/_WidgetBase",
    "dijit/form/Button",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/AlbumListItemWidget.html", 
    
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare, 
    DO_B_Lang,
    DO_B_Array,
    
    DO_DOM,
    DO_DOM_Style,
    DO_DOM_Construct,
    DO_DOM_Style,
    DO_On,
    
    C_V_EventsView,
    
    DI_WidgetBase,
    DI_F_Button,
    
    DI_Registry,
    DI_TemplatedMixin, 
    DI_WidgetsInTemplateMixin,
    
    HTML_template, 

    DO_Ready   
    
){
    return DO_B_Declare([DI_WidgetBase, DI_TemplatedMixin, DI_WidgetsInTemplateMixin ], {
        //lien vers le contexte appelant
        global_store: null,
        //variable de chaine internationalisé
        STRING: {},
        affichage: 'polaroid',
        //variable de stockage des données objet
        album: {
	        titre: '',
	        path: '',
	        image: '',
	        count: 0
        },
        index: 0,

        // Our template - important!
        templateString: HTML_template,

        // A class to be applied to the root node in our template
        baseClass: "AlbumListItemWidget",
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
        
        postMixInProperties: function(){
            //this.donnee = this.encodeArray(this.donnee);
            //this.STRING = this.encodeArray(this.STRING);
        },
        
        postCreate: function(){
        	var self = this;
        	if(self.affichage == 'liste'){
        		DO_DOM_Style.set(self.listeDisplay,"display", "block");
        		DO_DOM_Style.set(self.polaroidDisplay,"display", "none");
    		}
    		else{
        		DO_DOM_Style.set(self.polaroidDisplay,"display", "block");
        		DO_DOM_Style.set(self.listeDisplay,"display", "none");
    		}
    		DO_On(self.domNode,'click',function(){
	    		loadView('custom/view/EventsView',{
	    			album: self.album
	    		});
    		});
        },
        
        
                
    });
});
}
catch(e){
	console.log(e.message);
}