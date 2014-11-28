<?php

    $album = substr($_REQUEST['file_name'], 0, strpos($_REQUEST['file_name'],'.')) ;
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
    
    //creation d'archive
    $zip = new ZipArchive();
    $archive_file_name = tempnam('.','');
    if ($zip->open($archive_file_name, ZIPARCHIVE::CREATE )!==TRUE) {
        exit("cannot open <$archive_file_name>\n");
    }
    
    foreach($donnee['timeline']['date'] as $date){
        $image_path = "..".$date['asset']['media'];
        if(is_file($image_path)){
            //echo "ajout du fichier ".$date['asset']['media']." \n";
            $info = pathinfo($image_path);
            $zip->addFile($image_path, $info['filename'].'.'.strtolower($info['extension']) );
        }
    }
    $zip->close();
    
    header("Content-type: application/zip"); 
    header("Content-Disposition: attachment; filename=$album"); 
    header("Pragma: no-cache"); 
    header("Expires: 0"); 
    readfile("$archive_file_name");
    
    unlink($archive_file_name);
    
    ?>
    
