/*
    AW 05/09/13
    Helper actionSpool: permet de chainer des actions
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang"
    
], function(
    DO_B_Declare,
    DO_B_Lang
){
    return DO_B_Declare([], {
        //Variable de config
        timeOutDelay: 10000,
        modeSynchro: true,
        
        //Variable utile
		actionTab: new Array(),
		isRunning: false,
		lastActionTime: 0,
		
		constructor: function(options){
			console.log('initialisation du nouveau ActionSpool');
			this.actionTab = new Array();
			this.isRunning = false;
			this.lastActionTime = 0;
			this.modeSynchro = true;
			DO_B_Lang.mixin(this, options || {});
		},
		
		addAction: function(fct){
			console.log("ajout d'une action");
			this.actionTab.push(fct);
		},
		
		callNext: function(){
			console.log("appel de l'action suivante");
			this.lastActionTime = new Date().getTime();
			if(this.actionTab.length > 0){
				logDebug("encore a traiter");
    			var fonction = this.actionTab.shift();
    			if(typeof fonction !== 'undefined'){
    				fonction();
    			}
    			else{
	    			logDebug("je depile mais fait rien");
    			}
    			if(this.modeSynchro){
        			this.callNext();
    			}
			}
			else{
			    this.isRunning = false;
			    logDebug("plus rien à traiter");
			}
			
		},
		
		launch: function(){
		    if(!this.isRunning) {
    		    this.isRunning = true;
    		    this.callNext();
		    }
		    else{
			    logDebug("Spool deja entrain de tourner");
		    }
		}
					
	});
});