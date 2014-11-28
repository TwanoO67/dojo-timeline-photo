<?php

//config
$front_upload_path = '/DATA/upload/';
$absolute_path_prefixe = '..';
$absolute_upload_dir = $absolute_path_prefixe.$front_upload_path;
$json_dir = $absolute_path_prefixe.'/DATA/json/';
$archive_dir = $absolute_path_prefixe.'/DATA/archive/';

$img_tmp_name = 'tmp-new-store';

$retour_tab['status'] = 'error';
$retour_tab['message'] = 'pas de mode selectionné';
$retour_tab['data'] = '';


//recuperation des paramétres
$album_name = strtolower($_REQUEST['album']);

function getJSONPath(){
	global $album_name,$json_dir;
	$json_path = $json_dir.$album_name;
	if(strpos($json_path,'json') === false){
	    $json_path .= '.json';
	}
	return $json_path;
}

function generateFileName($titre){
	$fichier = strtr($titre, 
	          'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
	          'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
	return strtolower(preg_replace('/([^.a-z0-9]+)/i', '-', $fichier).'.json');
}

$mode = $_REQUEST['mode'];

//mode de recuperation de donnée en ajax
if($mode == 'get_data'){
	if($album_name != $img_tmp_name && $album_name != ''){
	    //ouverture du fichier
	    if(file_exists(getJSONPath())){
		    $file = fopen(getJSONPath(), "r+");
		    $contenu_fichier = @fread($file, filesize(getJSONPath()));
		    $retour_tab['status'] = 'ok';
			$retour_tab['message'] = 'contenu du fichier';
			$retour_tab['data'] = json_decode($contenu_fichier);
		    fclose($file);
	    }
	    else{
		    $retour_tab['status'] = 'error';
			$retour_tab['message'] = 'fichier inexistant';
	    }
	    
    }
    else{
	    $retour_tab['message'] = 'pas de nom de fichier transmis';
    }
}
elseif($mode == 'delete'){
	if(getJSONPath() != ''){
		//copie des fichiers dans les archives
		$date = date('Y-m-d');
		$album_archive_dir = $archive_dir.$date.'_'.$album_name;
		mkdir($album_archive_dir);
		/*deplacement des données dans les archives*/
		rename(getJSONPath(),$album_archive_dir.'/'.$album_name);
		rename($absolute_upload_dir.$album_name,$album_archive_dir.'/img_'.$album_name);
		$retour_tab['status'] = 'ok';
		$retour_tab['message'] = 'suppression faite';
		$retour_tab['data'] = '';
	}
	else{
		$retour_tab['status'] = 'error';
		$retour_tab['message'] = "nom de l'album vide";
		$retour_tab['data'] = '';
	}
}
elseif($mode=="save"){
    //ecriture (ou creation d'un nouveau)
    $data = $_REQUEST['donnee'];
    $donnee = json_decode($data);
    
    $retour_tab['message'] = 'sauvegarde du fichier';
    $retour_tab['status'] = 'ok';
    
    //deplacement dans un json fixe
    if($album_name == $img_tmp_name || $album_name == ''){
	    $album_name = generateFileName($donnee->timeline->headline);
	    $donnee->file_name = $album_name;
    }
    
    //deplacement des photos temporaire
    //pour chaque image
    if(isset($donnee->timeline->date)){
	    foreach($donnee->timeline->date as $event){
	    	//si elle est dans le dossier temporaire
		    if(strpos($event->asset->media ,$img_tmp_name) !== false){
		    
		    	$source = $absolute_path_prefixe.$event->asset->media;
		    	$chemin = explode('/',$source);
		    	$nom_fichier = array_pop($chemin);
		    	$dossier_album = $absolute_upload_dir.$album_name;
		    	$newdest = $dossier_album.'/'.$nom_fichier;
		    	$newdest_fo = $front_upload_path.$album_name.'/'.$nom_fichier;
		    	
		    	//on test le dossier
		    	if(!is_dir($dossier_album)){
			    	if(!mkdir($dossier_album) ){
			    		$retour_tab['status'] = 'error';
						$retour_tab['message'] = "error de creation du dossier album \n";
						$retour_tab['data'] = '';
	    		    	break;
			    	}
		    	}
		    	else if(!is_writable($dossier_album)){
			    	$retour_tab['status'] = 'error';
					$retour_tab['message'] = "'".$dossier_album."' n'est pas en mode ecriture \n";
					$retour_tab['data'] = '';
			    	break;
		    	}
		    	else if(!file_exists($source)){
					$retour_tab['message'] .= "le fichier image: '".$source."' n'existe pas \n";
			    	continue;
		    	}
		    	
		    	//si le dossier d'arrivée existe ou est crée, on sort l'image du dossier temp
		    	if( rename($source,$newdest) ) {
				  //unlink($source);
				  //et on place dans le json le chemin permettant de recuperer l'image sur le front
				  $event->asset->media = $newdest_fo;//$newdest;
				}
				else{
    				$retour_tab['message'] .= "Erreur de copy du fichier image: '".$source."'  \n";
				}
		    }
	    }
    }
    
    //ecriture des nouvelles données
    $retour_tab['data'] = $donnee;
    
    $file = fopen(getJSONPath(), "w+");
    fputs($file,$data);
    fclose($file);
}
//recuperation de la liste des albums (et non des share)
elseif($mode=='list'){
    if($dossier = opendir($json_dir))
    {
        $tab_data = array();
        while(false !== ($fichier = readdir($dossier)))
        {
            if(strpos($fichier,'.json') !== false && strpos($fichier,'share') === false){
	            //$tab_nom[] = $fichier;
	            $album = array();
	            $album['path'] = $fichier;
	            $filename = $json_dir.'/'.$fichier;
	            $file = fopen($filename, "r+");
	            $contenu_fichier = fread($file, filesize($filename));
	            $data = json_decode($contenu_fichier,true);
	            $album['titre'] = $data['timeline']['headline'];
	            $album['date'] = $data['timeline']['startDate'];
	            $album['image'] = $data['timeline']['asset']['media'];
	            $album['count'] = count($data['timeline']['date']);
	            $tab_data[] = $album;
            }
                
        }
        $retour_tab['status'] = 'ok';
		$retour_tab['message'] = "contenu du dossier";
		$retour_tab['data'] = $tab_data;
    }
    else{
	    $retour_tab['status'] = 'error';
		$retour_tab['message'] = "dossier inexistant";
		$retour_tab['data'] = '';
    }
}

echo json_encode($retour_tab);
exit();
