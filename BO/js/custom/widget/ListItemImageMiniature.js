define([
    "dojo/_base/declare",
    "dijit/_WidgetBase", 
    "dojo/text!./templates/ListItemImageMiniature.html",
    "dojox/dtl",
    "dojox/dtl/Context",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare,
    DI_WidgetBase,
    HTML_template,
    DX_DTL,
    DX_DTL_Context,
    DO_DOM_Construct,
    DO_B_Lang,
    DO_On,
    DI_TemplatedMixin, 
    DI_WidgetsInTemplateMixin,
    DO_Evented,
    DO_Ready
){
    return DO_B_Declare([DI_WidgetBase, DI_TemplatedMixin, DI_WidgetsInTemplateMixin, DO_Evented], {
    	// Our template - important!
        templateString: HTML_template,
        // A class to be applied to the root node in our template
        baseClass: "ListItemImageMiniature",
        //variable de chaine internationalisé
        STRING: g_language,
    
    	dataStore: "",
        startDate: "",
        headline: "",
        asset: {
	        media: ''
        },
        id: 0,
        /*avatar: require.toUrl("./images/defaultAvatar.png"),
        // Our template - important!
        templateString: template,
        // A class to be applied to the root node in our template
        baseClass: "EventItemWidget",*/
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
        
        /*deleteAction: function(){
	        var self = this;
	        if(self.id != 0){
	    	    var donnee = self.dataStore.get(self.id);
	    	    if(confirm('Etes vous sûr de vouloir supprimer "'+donnee.headline+'"')){
	        	    self.dataStore.remove(self.id);
	        	    DO_DOM_Construct.destroy('event_unit_'+self.id);
	    	    }
	        }
	        else
	            alert('Index inexistant');
        },*/
        
        postCreate: function(){
        	var self = this;
	        /*DO_On(self.btnDelete, 'click', function(){
		        //self.deleteAction();
		        self.emit('deleteEventItem',{ id : self.id});
	        });
	        self.placeStartDate.innerHTML = self.startDate;*/
	        DO_On(self.placeTitle, 'click', function(){
		        self.emit('openEventItem',{ id : self.id});
	        });
	        
	        self.placeHeadLine.innerHTML = self.headline;
	        self.placeImage.src = self.asset.media;
        }
        
    });
});