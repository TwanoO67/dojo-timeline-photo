<?php

//config
$front_upload_path = '/DATA/upload/';
$absolute_path_prefixe = '..';
$absolute_upload_dir = $absolute_path_prefixe.$front_upload_path;
$json_dir = $absolute_path_prefixe.'/DATA/json/';

if($dossier = opendir($json_dir))
{
    $tab_data = array();
    //préparation des données
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
            //si il n'y a pas de date de debut, on recuperer la plus petite date dans les images
            if( $album['date'] == ''){
                foreach( $data['timeline']['date'] as $event){
                    if( $event['startDate'] != '' 
                    && ( $album['date'] == '' || $event['startDate'] < $album['date'] ) ){
                        $album['date'] = $event['startDate'];
                    }
                }
            }
            $album['image'] = $data['timeline']['asset']['media'];
            $tab_data[] = $album;

        }
            
    }
    
    //fonction de trie du tableau par date
    function cmp($a, $b) {
        if ($a['date'] == $b['date']) {
            return 0;
        }
        return ($a['date'] > $b['date']) ? -1 : 1;
    }
    uasort($tab_data, 'cmp');
    
}
else{
    echo "dossier inexistant";
}
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/static/favicon.ico" type="image/x-icon">
    <title><?php echo $donnee['timeline']['headline']; ?></title>
		<!--script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script-->
    <link href="http://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" type="text/css">
    <!--link href="http://fonts.googleapis.com/css?family=Arimo" rel="stylesheet" type="text/css"-->
    <link href='http://fonts.googleapis.com/css?family=Roboto+Slab:400,700,300,100' rel='stylesheet' type='text/css'>
    <script src="/static/screenfull.js"></script>
	<style>
	    /* Partie commune du site*/
	    html{
			text-align: center;
			/*font: 400 16px/1.6 'Arimo', Verdana, Helvetica, sans-serif;*/
			font-family: 'Roboto Slab', "Helvetica Neue", Helvetica, Arial, sans-serif;
			background-color: #e9e9e9;
			color: black;
			margin: 0;
			padding: 0;
		}
		
		body{
    		margin: 0;
			padding: 0;
		}
		
		#page_centrale{
    		padding-top: 95px;
    		padding-bottom: 30px; /*pour que la derniere ligne puisse avoir un scale*/
    		padding-left: 30px;
    		padding-right: 30px;
    		width: auto;
		}
		
		#home_link{
    		background-color: black;
    		color: white;
    		float: left;
    		left: 0;
    		height: 75px;
    		color: white;
		}
		
		#home_link a{
    		color: white;
    		vertical-align: middle;
    		font: 400 45px/1.6 'Pacifico', Georgia, serif;
    		margin: 0;
    		text-decoration: none;
            padding-left: 10px;
		}
		
		#ariane{
    		width: 0px;
            height: 0px;
            border-style: solid;
            border-width: 37.5px 0 37.5px 30px;
            border-color: transparent transparent transparent black;
            float: left;
            margin-right: 15px;
		}
		
		#header{
    		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
            background-color: #3f4657;
            margin-bottom: 20px;
            z-index: 200;
            border-width: 0 0 1px;
            right: 0;
            left: 0;
            text-align: left;
            position:fixed;
            margin: 0;
        }
        
        #header h1{
            font: 400 45px/1.6 'Pacifico', Georgia, serif;
            color: white; /* #84989b;#ABC8E2; #e2ecee;*/
            padding-bottom: 5px;
            margin: 0;
        }
	    /*fin de la partir commune*/
	
	
	
	    .AlbumView figure, .AlbumView figcaption {
            height: 180px;
            display: block;
        }
        .AlbumView .polaroid{
            width:100%;
            overflow:hidden;
        }
        .AlbumView .polaroid figure{
            float:left;
            position:relative;
            width:200px;
            margin:10px 20px;
            padding: 6px 8px 10px 8px;
            -webkit-box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, .75);
            -moz-box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, .75);
            box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, .75);
            background: #eee6d8;
            background: -webkit-linear-gradient(top, #ede1c9, #fef8e2 20%, #f2ebde 60%);
            background: -moz-linear-gradient(top, #ede1c9, #fef8e2 20%, #f2ebde 60%);
            background: -o-linear-gradient(top, #ede1c9, #fef8e2 20%, #f2ebde 60%);
            background: -ms-linear-gradient(top, #ede1c9, #fef8e2 20%, #f2ebde 60%);
            background: linear-gradient(top, #ede1c9, #fef8e2 20%, #f2ebde 60%);
            -webkit-transform:rotate(-1deg);
            -moz-transform: rotate(-1deg);
            -o-transform: rotate(-1deg);
            -ms-transform: rotate(-1deg);
            transform: rotate(-1deg);
            -webkit-backface-visibility:hidden; /*prevent rotated text being jagged in Chrome and Safari*/
        }
        .AlbumView .polaroid figure:nth-child(even) {
            -webkit-transform:rotate(2deg);
            -moz-transform: rotate(2deg);
            -o-transform: rotate(2deg);
            -ms-transform: rotate(2deg);
            transform: rotate(2deg);
            -webkit-backface-visibility:hidden; /*prevent rotated text being jagged in Chrome and Safari*/
            -webkit-box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, .75);
            -moz-box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, .75);
            box-shadow: -4px 4px 8px -4px rgba(0, 0, 0, .75);
        }
        
        .AlbumView .polaroid figure:before {
            content: '';
            display: block;
            position: absolute;
            
            /*left:5px;
            top: -15px;
            width: 75px;
            height: 25px;
            background-color: rgba(222,220,198,0.7);*/
            
            left: -20px;
            top: -10px;
            width: 100px;
            height: 23px;
            background: url('/static/scotch.png');
            
            -webkit-transform: rotate(-12deg);
            -moz-transform: rotate(-12deg);
            -o-transform: rotate(-12deg);
            -ms-transform: rotate(-12deg);
        }
        
        .AlbumView .polaroid figure:hover:before{
            background: none;
        }
        
        .AlbumView .polaroid figure:nth-child(even):before {
            left:150px;
            top: -15px;
            width: 55px;
            height: 25px;
            -webkit-transform: rotate(12deg);
            -moz-transform: rotate(12deg);
            -o-transform: rotate(12deg);
            -ms-transform: rotate(12deg);
        }
        .AlbumView .polaroid figcaption{
            text-align:center;
            font-family: 'Reenie Beanie', cursive; /*Reenie Beanie is available through Google Webfonts http://code.google.com/webfonts/specimen/Reenie+Beanie*/
            font-size:1.3em;
            color:#454f40;
            letter-spacing:0.09em;
        }
        /**IE Hacks - see http://css3pie.com/ for more info on how to use CS3Pie and to download the latest version**/
        .AlbumView .polaroid figure{
            -pie-background: linear-gradient(#ede1c9, #fef8e2 20%, #f2ebde 60%);
            behavior: url(assets/pie/PIE.htc);
            position:relative; /*required to make PIE work*/
            padding-top:10px\9;
            padding-right:10px\9;
        }
        .polaroid figure:hover {
            -webkit-transform: scale(1.25);
            -moz-transform: scale(1.25);
            position: relative;
            z-index: 5;
        }
        .polaroidDisplay{
            margin: auto;
        }
        
        .AlbumView .polaroid img:before{
            z-index: -1;
            position: absolute;
            content: "";
            bottom: 15px;
            left: 10px;
            width: 50%;
            top: 80%;
            max-width: 300px;
            background: #999999;
            -webkit-box-shadow: 0 15px 10px #999999;
            -moz-box-shadow: 0 15px 10px #999999;
            box-shadow: 0 15px 10px #999999;
            -webkit-transform: rotate(-2deg);
            -moz-transform: rotate(-2deg);
            -ms-transform: rotate(-2deg);
            -o-transform: rotate(-2deg);
            transform: rotate(-2deg);
        }
        
	</style>
  </head>
  <body class="AlbumView">
  
    <div id='header' >
        <div id='home_link'>
            <a href="/" >
            Weber Antoine .fr</a>
        </div>
        
        <div id="ariane"></div>
        
        <h1> Tous les albums</h1>
    </div>
  
  <div class="polaroid" id='page_centrale'>
<?php
    //affichage
    foreach( $tab_data as $album){
    
        $album_lien = '/album/'.substr($album['path'],0,strpos($album['path'],'.') );
    
    
     ?>
        <div style='cursor:pointer;' title="<?php echo $album['date'].' - '.$album['titre'];?>" onclick="window.location='<?php echo $album_lien; ?>'" class='polaroidDisplay'>
            	    <figure>
            	        <img src='<?php echo $album['image'];?>' width='200' style="max-height: 150px;" alt='' />
            	    	<figcaption style="text-overflow:ellipsis; height: 25px; overflow: hidden; white-space: nowrap;" ><?php echo $album['titre'];?></figcaption>
            	    </figure>
            	</div>
<?php
    }
?>
  </div>

<div id='footer' style="">
Copyright 2014 - WEBER Antoine
</div>
<style>
    #footer{
        position: absolute;
    	bottom: 0px;
    	height: 30px;
    	width: 100%;
    	background:#f2f2f2;
    	border-top: 1px solid #e4e4e4;
    	color:#222;
    	font-size:14px;
    	font-weight:normal;
    	-webkit-tap-highlight-color:rgba(0,0,0,0);
    }
</style>



  </body>
</html>