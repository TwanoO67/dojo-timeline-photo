<?php
	$json_path = '../DATA/json/'.$_REQUEST['file_name'];
    	
    $data = file_get_contents($json_path);
    if($data === false){
	    echo "Fichier JSON non accessible";
	    exit;
    }
    $donnee = json_decode($data,true);
    if( !isset($donnee['timeline']) || $donnee['timeline'] == null ){
    	echo "Le fichier JSON n'a pas le bon format";
	    exit;
    }
    
    if(isset($donnee['timeline']['template']) && is_file($donnee['timeline']['template'])){
        include($donnee['timeline']['template']);
    }
    else{
        include('epurate.php');
    }
    ////
    
    ?>
