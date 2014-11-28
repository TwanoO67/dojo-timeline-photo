try{
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    
    "dojo/Evented",
    
    "custom/helper/Date",
    
    "dijit/_WidgetBase", 
    "dijit/form/ValidationTextBox",
    "dijit/Calendar",
    
    "dijit/registry",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/CalendarTime.html", 
    
    "dojo/ready",
    "dojo/domReady!"
    
], function(
    DO_B_Declare, 
    DO_B_Lang,
    DO_B_Array,
    
    DO_Evented,
    
    C_H_Date,
    
    DI_WidgetBase,
    DI_F_ValidationTextBox,
    DI_Calendar,
    
    DI_Registry,
    DI_TemplateMixin, 
    DI_WidgetInTemplateMixin,
    
    HTML_template, 

    DO_Ready   
    
){
    return DO_B_Declare([DI_WidgetBase, DO_Evented, DI_TemplateMixin, DI_WidgetInTemplateMixin ], {
        value: new Date(''),
        
        // Our template - important!
        templateString: HTML_template,

        // A class to be applied to the root node in our template
        baseClass: "CalendarTime",
        
        constructor: function(options){
            DO_B_Lang.mixin(this, options || {});
        },
        
        //postMixInProperties: function(){},
        
        postCreate: function(){
        	var self = this;
        	
        	//au lancement recuperation de la date fournie par le constructeur
        	self.heures.set('value', 
        		C_H_Date.twoDigits(self.value.getHours())
        	);
        	self.minutes.set('value', 
        		C_H_Date.twoDigits(self.value.getMinutes())
        	);
        	self.calendar.set('value', self.value);
        	
        	//lors du clic sur Ok on recupere les données dans l'affichage
        	self.btn.on('click',function(){
        		var dateResult = self.calendar.get('value');
        		if(self.heures.validator(self.heures.get('value'))){
        			dateResult.setHours(self.heures.get('value'));
        		}
        		else{
	        		alert("Format d'heure invalide.");
	        		return false;
        		}
        		if(self.minutes.validator(self.minutes.get('value'))){
        			dateResult.setMinutes(self.minutes.get('value'));
        			self.value = dateResult;
					self.emit("validated", dateResult);
        		}
        		else{
	        		alert("Format de minute invalide.");
	        		return false;
        		}
        	});
        },
                
    });
});
}
catch(e){
	console.log(e.message);
}