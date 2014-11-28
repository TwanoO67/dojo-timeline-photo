try{
define(
    [
        "dojo/_base/lang",
        "dojo/_base/declare",
    ],
    function(
        DO_B_Lang,
        DO_B_Declare
    )
{
    return DO_B_Declare(null, {

        id: null,
        startDate: null,
        headline: null,
        text: null,
        asset: null,
 
        constructor: function(options){
        	var self = this;
			self.asset = {};
        	self.asset.media = '';
        	self.asset.credit = '';
        	self.asset.caption = '';
        	self.id = '';
        	self.startDate = '';
        	self.headline = '';
        	self.text = '';
            DO_B_Lang.mixin(this, options || {});//attribue le contenu du tableau options au tableau this
        },

        
    });
});
}
catch(e){
	alert(e.message);
}