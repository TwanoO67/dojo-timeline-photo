/*
    AW 05/09/13
    Helper date: Contient les fonctions de traitement de date
*/
define(function(){
	return {
		//format peut prendre AAAAMMJJ ou JJMMAAAA
		dateToArray: function(dateString,format){
			retour = {};
			if(format == null){
				format = 'AAAAMMJJ';
			}
			dateTime = dateString.split(' ');
			
			dateTab = dateTime[0].split(':');
			if(dateTab.length < 3){
				dateTab = dateTime[0].split('-');
			}
			if(dateTab.length < 3){
				dateTab = dateTime[0].split('/');
			}
			
			if(format == 'AAAAMMJJ'){
				retour['annee'] = dateTab[0];
				retour['mois'] = dateTab[1];
				retour['jour'] = dateTab[2];
			}
			else if(format == 'JJMMAAAA'){
				retour['annee'] = dateTab[2];
				retour['mois'] = dateTab[1];
				retour['jour'] = dateTab[0];
			}
			
			timeTab = dateTime[1].split(':');
			retour['heure'] = timeTab[0];
			retour['minute'] = timeTab[1];
			retour['seconde'] = timeTab[2];
			
			return retour;
		},
		
		twoDigits: function(number){
		    if(number < 10 && (number+'').length<2 ){
    		    return '0'+number;
		    }
		    else{
    		    return number;
		    }
		},
		
		timelineToDate: function(stringDate){
		    var maDate = new Date();
		    maDate.setTime(0);
		    var tab = stringDate.split(',');
            if( typeof tab[0] != 'undefined' && !isNaN(tab[0]) ){
                maDate.setFullYear(tab[0]);
            }
		    if( typeof tab[1] != 'undefined' && !isNaN(tab[1]) ){
                maDate.setMonth(tab[1]-1 );
            }
            if( typeof tab[2] != 'undefined' && !isNaN(tab[2]) ){
                maDate.setDate(tab[2]);
            }
		    if( typeof tab[3] != 'undefined' && !isNaN(tab[3]) ){
                maDate.setHours(tab[3]);
            }
            if( typeof tab[4] != 'undefined' && !isNaN(tab[4]) ){
                maDate.setMinutes(tab[4]);
            }
            if( typeof tab[5] != 'undefined' && !isNaN(tab[5]) ){
                maDate.setSeconds(tab[5]);
            }
		    return maDate;
		},
		
		dateToTimeline: function(inputDate){
			var maString = "";
			//pour chaque valeur on construit la string seulement si plus grand que zero, ou si un enfant est plus grand que zero
			if(inputDate.getFullYear() > 0
			    || inputDate.getMonth() > 0
			    || inputDate.getDate() > 0
			    || inputDate.getHours() > 0
			    || inputDate.getMinutes() > 0
			    || inputDate.getSeconds() > 0
			    
			){
    			maString += inputDate.getFullYear();
    			maString += ','+this.twoDigits(inputDate.getMonth()+1);
    			maString += ','+this.twoDigits(inputDate.getDate());
        			    
                if(inputDate.getHours() > 0
                    || inputDate.getMinutes() > 0
                    || inputDate.getSeconds() > 0
                ){
                    maString += ','+this.twoDigits(inputDate.getHours());
                    
                    if(inputDate.getMinutes() > 0
                        || inputDate.getSeconds() > 0
                    ){
                	    maString += ','+this.twoDigits(inputDate.getMinutes());
                	    
                	    if(inputDate.getSeconds() > 0){
                		    maString += ','+this.twoDigits(inputDate.getSeconds());
                	    }
                    }
                }
			}
			
			return maString;
		},
		
		
			
	};
});