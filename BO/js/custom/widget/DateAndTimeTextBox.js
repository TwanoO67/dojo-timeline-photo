define([
    "dojo/_base/declare",
    "dijit/form/ValidationTextBox",
    "dijit/_HasDropDown",
    "custom/widget/CalendarTime",
    "custom/helper/Date"
]
,function(
    DO_B_Declare,
    DI_F_ValidationTextBox,
    DI_HasDropDown,
    C_W_CalendarTime,
    C_H_Date
){


   var ModuleDeclaration = DO_B_Declare("custom.widget.DateAndTimeTextBox", 
    [DI_F_ValidationTextBox, DI_HasDropDown], {

        openDropDown: function() {  
        	var self = this;
            if(!this.dropDown) {
                var _s = this;
    
                this.dropDown = new C_W_CalendarTime({
                	value: C_H_Date.timelineToDate(self.value)
                });
                this.dropDown.on('validated', function(val) {
                    _s.closeDropDown();
                    var myFormat = C_H_Date.dateToTimeline(val);
                    _s.attr('value', myFormat);           
                });
            }
            this.inherited(arguments);
        },
        closeDropDown: function() {
            this.inherited(arguments);
            if (this.dropDown) {
                this.dropDown.destroy();
                this.dropDown = null;
            }
        }
    });

    return ModuleDeclaration;
});