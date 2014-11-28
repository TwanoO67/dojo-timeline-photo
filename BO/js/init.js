try{
require([
    "dbootstrap",
        
    "custom/helper/String",
    
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
    
    C_H_String,
    
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
    
){	//***************
	// DEBUT DU CODE
	//***************
	mode_debug = true;
	globalSitePath = "http://"+location.hostname+location.pathname;
	
	//fonction de changement de page
	oldView = null;
	loadView = function(nom,data){
		require([nom], function(myView){
			//suppression de l'ancienne vue si existante
		   if(oldView != null){
			   oldView.destroyRecursive();
		   }
		   oldView = new myView(data);
		   oldView.placeAt('cp_center');
		});
	};
	
	//fonction de message de debug
	logDebug = function(msg){
	    if(mode_debug){
		    console.log("BO -> "+msg);
	    }
    };
    
    //genere une url permettant de d'acceder directement a une page
    goUrlEncode = function(viewString, data){
    	data['destinationViewPath'] = viewString;
	    var string = DO_JSON.stringify(data);
	    var b64 = btoa(string);
	    var conv = b64.replace(/\+/g,'-').replace(/=/g,'!').replace(/\//g,'_');
	    return globalSitePath+"?go="+conv;
    };
    
    goUrlDecode = function(goString){
	    var b64 = goString.replace(/-/g,'+').replace(/!/g,'=').replace(/_/g,'/');
	    var json = atob(b64);
	    var myArray = DO_JSON.parse(json);
	    //recuperation de la vue de destination
	    var destination = myArray['destinationViewPath'];
	    //suppression de la donnée dans les data cible
	    delete myArray['destinationViewPath'];
	    //appel de la vue
	    loadView(destination, myArray);
    };
    
    DO_Ready(function(){
    
        //TODO: pour tous ce qui bouge, attribué les actions comme tel:
        //dojo.query("body").delegate(selector, eventName, fn);
    
	    g_language = C_H_String.encodeArray(DO_I18N.getLocalization("custom","timeline"));
	    
	    //rechargement de la page au changement de langue
	    DO_On(DO_DOM.byId("select_lang"), "change", function(evt) {
	        location.assign(globalSitePath+'?language='+evt.target.value);
	    });
	    
	    /*dataStore = null;
	    		
		//capture de la sortie
		window.onbeforeunload=function (e) {
		  if(dataStore!= null && dataStore.isModifiedSinceLoad){
    		  var e = e || window.event;
    		  var retour = 'Attention, toute modification en cours sera perdue.';
    		  // For IE and Firefox
    		  if (e) {
    		    e.returnValue = retour;
    		  }
    		  // For Safari
    		  return retour;
		  }
		};*/
		/*DO_B_Unload.addOnWindowUnload(quitting);
		DO_B_Unload.addOnUnload(window,quitting);*/
		
		//si une destination est precisé dans l'url par le parametre go
		if(typeof GLOBAL_GO_STRING != 'undefined' && GLOBAL_GO_STRING != ''){
			goUrlDecode(GLOBAL_GO_STRING);
		}
		//sinon on va a la vue des albums
		else
			loadView('custom/view/AlbumView');

	});
    
});
}
catch(e){
    console.error(e);
}