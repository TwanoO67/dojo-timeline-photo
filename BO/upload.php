<?php
error_reporting(E_ALL);
$front_upload_path = '/DATA/upload/';
$absolute_path_prefixe = '..';
$absolute_upload_dir = $absolute_path_prefixe.$front_upload_path;


function up($file,$album = ''){
	global $front_upload_path, $absolute_path_prefixe, $absolute_upload_dir;
	$reponse = array();
	$reponse['status'] = 'erreur';
	
	$fichier = basename($file['name']);
	$taille_maxi = 2000000;//2mo
	$taille = filesize($file['tmp_name']);
	$extensions = array('.png', '.gif', '.jpg', '.jpeg');
	$extension = strrchr($file['name'], '.'); 
	if(($fichier == 'blob' || $fichier == '') && $_REQUEST['file_name'] != ''){
		$fichier = basename($_REQUEST['file_name']);
		$extension = strrchr($fichier, '.'); 
	}
	$reponse['file_basename'] = $fichier;
	//Début des vérifications de sécurité...
	if(!in_array(strtolower($extension), $extensions)) //Si l'extension n'est pas dans le tableau
	{
	     $reponse['message'] = 'Vous devez uploader un fichier de type png, gif, jpg, jpeg';
	}
	elseif($taille>$taille_maxi)
	{
	     $reponse['message'] = 'Le fichier est trop gros... '.$taille;
	}
	else //S'il n'y a pas d'erreur, on upload
	{
	     //On formate le nom du fichier ici...
	     $reponse['message'] = 'Echec de l\'upload !';
	     $fichier = strtr($fichier, 
	          'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
	          'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
	     $fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
	     $nouveau_path = $absolute_upload_dir. $fichier;
	     if($album != ''){
		     $nomdossier = preg_replace('/([^.a-z0-9]+)/i', '-', $album);
		     $dossier_album = $absolute_upload_dir.$nomdossier;
		     $nouveau_path_bo = $dossier_album.'/'.$fichier;
			 $nouveau_path_fo = $front_upload_path.$nomdossier.'/'.$fichier;
			 //echo $dossier_album;exit;
			 
		     if( (is_dir($dossier_album) && is_writable($dossier_album)) || mkdir($dossier_album) ){
			     if(move_uploaded_file($file['tmp_name'], $nouveau_path_bo)) //Si la fonction renvoie TRUE, c'est que ça a fonctionné...
			     {
			          if($extension == '.jpg' || $extension == '.jpeg'){
				          $im = imagecreatefromjpeg($nouveau_path_bo);
						  imageinterlace($im, 1);
						  imagejpeg($im, $nouveau_path_bo, 100);
						  imagedestroy($im);
					  }
					  
					  $reponse['message'] = 'Upload effectué avec succès !';
			          $reponse['status'] = 'ok';
					  $reponse['file_path'] = $nouveau_path_fo;//$nouveau_path_bo;
			     }
		     }
	     }
	     
	     
	     
	}
	return $reponse;
}

$retour = array();
$mode = $_REQUEST['mode'];
if($mode == 'delete'){
	
	$file_path = $absolute_path_prefixe.$_REQUEST['file_path'];
	if(strpos($file_path,$front_upload_path) !== false){
		$retour['status'] = 'ok';
		if(file_exists($file_path) && unlink($file_path) ){
			$retour['message'] = 'La suppression est faite';
		}
		else{
			$retour['message'] = "Le fichier n'existe pas";
		}
	}
	else{
		$retour['message'] = 'Suppression non autorisée';
	}
}
else{
	$album = $_REQUEST['album'];
	//fichier multiple
	if(count($_FILES) > 1){
		foreach($_FILES as $data){
			$retour[] = up($data,$album);
		}
		
	}
	//fichier unique
	elseif(isset($_FILES['fichier'])){
		$retour = up($_FILES['fichier'],$album);
	}
}
if(count($retour)==0){
	$retour['status'] = 'erreur';
	$retour['message'] = "Aucune action n'a été faite. Mauvais paramètre d'envoi?";

}

echo json_encode($retour);

?>