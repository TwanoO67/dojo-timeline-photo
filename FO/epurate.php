<?php

//TODO: gérer les url de page au format http://photos.weberantoine.fr/album/anniv-anicee/4

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
    
    //retournement du tableau
    //$donnee['timeline']['date'] = array_reverse($donnee['timeline']['date']);
    
    $url = $_SERVER['REQUEST_URI'];
    
    //selection de la page (diapo) 
    $page = 0;
    if(isset($_REQUEST['page'])){
	    $page = $_REQUEST['page'];
    }

    if(isset($donnee['timeline']['date'][$page])){
	    $cur_diapo = $donnee['timeline']['date'][$page];
	    
	    //selection de la diapo precedent si elle existe
	    $prev_diapo = null;
	    $prev_diapo_pagenum = $page-1;
	    if($page > 0 && isset($donnee['timeline']['date'][$prev_diapo_pagenum]) ){
		    $prev_diapo = $donnee['timeline']['date'][$prev_diapo_pagenum];
	    }
	    
	    //selection de la diapo suivante si elle existe
	    $next_diapo = null;
	    $next_diapo_pagenum = $page+1;
	    if( isset($donnee['timeline']['date'][$next_diapo_pagenum]) ){
		    $next_diapo = $donnee['timeline']['date'][$next_diapo_pagenum];
	    }
	    
	    //calcul des urls suivantes
	    $base_url = "/album/".$album;
        $next_url = $base_url.'/'.$next_diapo_pagenum;
        if($prev_diapo_pagenum != 0){
		    $prev_url = $base_url.'/'.$prev_diapo_pagenum;
        }
        else{
            $prev_url = $base_url;
        }

	    
    }
    else{
	   echo "La page voulue n'existe pas.";
	   exit; 
    }
    
    //variable de taille pour modifier la CSS à la volée
    $cadre_largeur = 800;
    $cadre_hauteur = 534;
    
    $ruban_top = 50;
    
    $rond_diam = 90;//diametre du rond
    $rond_marge = 15;//marge du rond
    $rond_border = 5;//taille de la border du rond
    $desc_largeur = 200;//cadre de description du lien
    $ruban_color = "#ABC8E2";/*#e2ecee;*/
    $hauteur_bulle = "250px";//40%
    //$cadre_height = 110;
    
    function dateToFR($dateTimeline){
        $visuel = "";
        $tab = explode(",", $dateTimeline);
        if(isset($tab[0]) && $tab[0] != '')
            $visuel .= $tab[0];
        if(isset($tab[1]) && $tab[1] != '')
            $visuel .= "/".$tab[1];
        if(isset($tab[2]) && $tab[2] != '')
            $visuel .= "/".$tab[2];
        if(isset($tab[3]) && $tab[3] != '')
            $visuel .= ' '.$tab[3];
        if(isset($tab[4]) && $tab[4] != '')
            $visuel .= 'h'.$tab[4];
        return $visuel;
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
		
        #image_centrale{
        	position: relative;
	        width: <?php echo $cadre_largeur; ?>px;
	        border-radius: 5px;
			box-shadow: 0px 0px 8px rgba(0,0,0,0.3);
			z-index: 10;
        }
        
        .ruban {
			background-color: <?php echo $ruban_color; ?>; 
			box-shadow: 0px 0px 4px rgba(0,0,0,0.55);
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
		}
		
		#ruban_fond{
			z-index: 1;
			position: absolute;
			top: 185px;
			width: 100%;
			height: 40px;
		}
		
		#fond{
			position: relative;
			width: <?php echo $cadre_largeur; ?>px;
			margin: auto;
			z-index: 10;
		}
		
		.ruban h2 {
			font-size: 25px;
			color: white;
			text-shadow: 1px 1px 2px rgba(0,0,0,1);
			text-align: center;
			margin:10px;
		}
		
		#ruban_top {
			position: absolute;
			height: 50px;
			width: <?php echo $cadre_largeur+30; ?>px;
			left:-15px;
			top: 65px;
			z-index: 100;
		}
		
		#description{
			background: white;
			border-radius: 5px;
			box-shadow: 0px 0px 8px rgba(0,0,0,0.3);
			z-index: 10;
			margin-top: 15px;
			min-height: 50px;
			padding: 10px;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
			
		}
		
		#ruban_gauche {
			border-color: transparent #375D81 transparent transparent;
			border-style:solid;
			border-width:10px;
			#height:0px;
			#width:0px;
			position: absolute;
			left: -10px;
			top: 105px;
			z-index: -1;  
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
			
			-webkit-transform:rotate(135deg);
			-moz-transform:rotate(135deg);
			-o-transform:rotate(135deg);
			-ms-transform:rotate(135deg);
		}
		 
		#ruban_droit {
			border-color: transparent transparent transparent #375D81;
			border-style:solid;
			border-width:10px;
			#height:0px;
			#width:0px;
			position: absolute;
			right: -10px;
			top: 105px;
			z-index: -1;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
			
			-webkit-transform:rotate(225deg);
			-moz-transform:rotate(225deg);
			-o-transform:rotate(225deg);
			-ms-transform:rotate(225deg);
		}
		
		
		#triangle_droite{
			display:none;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: 20px 0 20px 34.6px;
			border-color: transparent transparent transparent white;
			margin: auto;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
		}
		
		#triangle_gauche{
			display:none;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: 20px 34.6px 20px 0;
			border-color: transparent white transparent transparent;
			margin: auto;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
		}
		
		.shadow{
			#ombre
		    -moz-box-shadow: 0px 0px 10px #343434;
			-webkit-box-shadow: 0px 0px 10px #343434;
			-o-box-shadow: 0px 0px 10px #343434;
			box-shadow: 0px 0px 10px #343434;
		}
		
		.roundedImage{
		    overflow:hidden;
		    -webkit-border-radius: 50%;
		    -moz-border-radius: 50%;
		    border-radius: 50%;
		    background: white;
		    width:<?php echo $rond_diam; ?>px;
		    height:<?php echo $rond_diam; ?>px;
			border: <?php echo $rond_border;?>px solid white;
			z-index: 20;
			cursor: pointer;
		}
		
		.link_desc{
			height: <?php echo $rond_diam;?>px ; 
			width: <?php echo $desc_largeur;?>px;
			background-color: black;
			color: white;
			z-index: 15;
			border: <?php echo $rond_border;?>px solid white;
			opacity: 0.8;
			filter:alpha(opacity=80);
			vertical-align: middle;
			padding: auto;
		}
		
		#previous_link{
			position: absolute;
			left: -<?php echo ($rond_diam+(2*$rond_marge)); ?>px;
			top: <?php echo $hauteur_bulle; ?>;
			text-decoration: none;
		}
		
		#page_previous{
			background: white;
			background:url(<?php echo $prev_diapo['asset']['media']; ?>);
			background-size: auto 100% ;
			background-position: center;
			position: relative;
		}
		
		#desc_previous{
		    position: absolute;
		    top: -0px;
		    left: <?php echo ($rond_diam/2); ?>px;
			padding-left: <?php echo ($rond_diam/2); ?>px;
		}
		
		#next_link{
			position: absolute;
			right: -<?php echo ($rond_diam+(2*$rond_marge)); ?>px;
			top: <?php echo $hauteur_bulle; ?>;
			text-decoration: none;
		}
		
		#page_next{
			background: white;
			background:url(<?php echo $next_diapo['asset']['media']; ?>);
			background-size: auto 100% ;
			background-position: center; 
			position: relative;
		}
		
		#desc_next{
		    position: absolute;
		    top: -0px;
		    left: -<?php echo $desc_largeur; ?>px;
			padding-right: <?php echo ($rond_diam/2); ?>px;
		}
		
		/*style plein ecran*/
		#fleche_droite{
			border-style: solid;
			border-width: 20px 0 20px 34.6px;
			border-color: transparent transparent transparent white;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
			
			position: absolute;
			bottom: 50px;
			right: 50px;
		}
		
		#fleche_gauche{
			border-style: solid;
			border-width: 20px 34.6px 20px 0;
			border-color: transparent white transparent transparent;
			
			#transparence
			-moz-opacity:0.8;
			opacity: 0.8;
			filter:alpha(opacity=80);
			
			position: absolute;
			bottom: 50px;
			left: 50px;
		}
		
		#fleche_gauche:hover{
		    border-color: transparent <?php echo $ruban_color; ?> transparent transparent;
		} 
        
        #fleche_droite:hover{
    		border-color: transparent transparent transparent <?php echo $ruban_color; ?>;
		}
		
		#plein_ecran{
			display:none;
			position: relative;
		}
		
		#dl_link{
    		position: fixed;
    		top:0;
    		right:0;
		}
		
		#dl_link a{
    		color: white;
		}
		
		#dl_link a:visited{
    		color: white;
		}
 
	</style>
  </head>
  <body>
  
    <div id='header' >
        <div id='home_link'>
            <a href="/FO/" >Albums</a>
        </div>
        
        <div id="ariane"></div>
        
        <h1><?php echo $donnee['timeline']['headline']; ?></h1>
        
        <div id='dl_link'><a href='/zip/<?php echo $album ?>'>Télécharger l'album</a></div>
    </div>
  
    <div id='page_centrale'>
    	<!--h1 ><?php echo $donnee['timeline']['headline']; ?></h1-->
    	
    	<div class="ruban" id='ruban_fond'>&nbsp;</div>
    	
    	<!--<a href='<?php echo $cur_diapo['asset']['media']; ?>'>-->
    	
    	<div id="fond"> 
    		
    		<?php 
    		
    		//si le média est une video
    		if (strpos($cur_diapo['asset']['media'], 'youtu') !== false){ ?>
        		<div id='image_centrale'><div id='oembed_container'></div></div>
        		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>  
                <script type="text/javascript" src="/static/jquery.oembed.min.js"></script>
        		<script type="text/javascript">
                    $(document).ready(function() {
                        $("#oembed_container").oembed("<?php echo $cur_diapo['asset']['media']; ?>");
                    });
                </script>
        		
    		<?php
    		}
    		else{
    		
    		//sinon si c'est des images
    		?>
    		
    		<img src='<?php echo $cur_diapo['asset']['media']; ?>' id='image_centrale'/>
    	<?php } ?>
    		<div class="ruban" id='ruban_top' >     
    			<h2><?php echo $cur_diapo['headline']; ?></h2>     
    		</div>     
    		<div id="ruban_gauche"></div>
    		<div id="ruban_droit"></div>
    		
    	
    		<?php if($prev_diapo != null){ ?>
    		<a id='previous_link' href="<?php echo $prev_url; ?>">
    			<div class="roundedImage shadow" id="page_previous" >
    				&nbsp;
    				<div id="triangle_gauche"></div>
    			</div>
    			<div class="link_desc shadow" id="desc_previous" style='display:none'>
    				<?php echo $prev_diapo['headline']; ?>
    			</div>
    		</a>
    		<?php } ?>
    		
    		<?php if($next_diapo != null){ ?>
    		<a id='next_link' href="<?php echo $next_url; ?>" >
    			<div class="roundedImage shadow" id="page_next" >
    				&nbsp;
    				<div id="triangle_droite"></div>
    			</div>
    			<div class="link_desc shadow" id="desc_next" style='display:none'>
    				<?php echo $next_diapo['headline']; ?>
    			</div>
    		</a>
    		<?php } ?>
    		
    		<?php if( $cur_diapo['text'] != ''){ ?>
    		<div id="description"> 
				<?php 
				if($cur_diapo['text'] != "")
    				echo "<p>".$cur_diapo['text']."</p>";
				if($cur_diapo['startDate'] != "")
    				echo "<i>Date: ".dateToFR($cur_diapo['startDate'])."</i><br/>";
				?>
			</div>
			<?php } ?>
    	
    	</div>
    	<!--</a>-->
    	
    	<button onclick="fullscreenImg();"> Plein écran </button>
	
    </div>
	
	<!-- ICI BLOC plein écran -->
	<div id='plein_ecran'>
		
		<a id='full_link_prev' href="<?php echo $prev_url; ?>" onclick="prevFullImg(); return false;" <?php if($prev_diapo == null){ echo "style='display:none;'";} ?> >
			<div id="fleche_gauche"></div>
		</a>
		<a id='full_link_next' href="<?php echo $next_url; ?>" onclick="nextFullImg(); return false;" <?php if($next_diapo == null){ echo "style='display:none;'";} ?> >
			<div id="fleche_droite"></div>
		</a>
		<img id='img_full' src='<?php echo $cur_diapo['asset']['media']; ?>' alt='plein ecran' onclick='fullscreenImg(this);' style='max-width:100%; max-height: 100%;'/>
		<img id='img_data_loader_next' src='<?php echo $next_diapo['asset']['media']; ?>' style="display:none" />
		<img id='img_data_loader_prev' src='<?php echo $prev_diapo['asset']['media']; ?>' style="display:none" />
	</div>
	   
  	<script>
		var rond_prev = document.getElementById('page_previous');
		var desc_prev = document.getElementById('desc_previous');
		var triangle_prev = document.getElementById('triangle_gauche');
    	//ajout du hover sur les ronds
    	if(rond_prev != null){
        	rond_prev.onmouseover = function(){
            	desc_prev.style.display = 'block';
            	triangle_prev.style.display = 'block';
        	};
        	rond_prev.onmouseout = function(){
            	desc_prev.style.display = 'none';
            	triangle_prev.style.display = 'none';
        	};
    	}
    	
    	var rond_next = document.getElementById('page_next');
		var desc_next = document.getElementById('desc_next');
		var triangle_next = document.getElementById('triangle_droite');
    	//ajout du hover sur les ronds
    	if(rond_next != null){
        	rond_next.onmouseover = function(){
            	desc_next.style.display = 'block';
            	triangle_next.style.display = 'block';
        	};
        	rond_next.onmouseout = function(){
            	desc_next.style.display = 'none';
            	triangle_next.style.display = 'none';
        	};
    	}
    	
    	img_tab = {};
    	<?php
    	$i = 0;
    	foreach( $donnee['timeline']['date'] as $evenement){
	    	echo "	img_tab[".$i."] = '".$evenement['asset']['media']."'; \n ";
	    	$i++;
    	}
    	?>
    	
    	current_full_page = <?php echo $page; ?>;
    	loader_n = document.getElementById('img_data_loader_next');
		loader_p = document.getElementById('img_data_loader_prev');
		link_n = document.getElementById('full_link_next');
		link_p = document.getElementById('full_link_prev');
		img_full = document.getElementById('img_full');
		
    	function nextFullImg(){
	    	var next_url = loader_n.src;
	    	var cur_url  = img_full.src;
	    	var prev_url = loader_p.src;
	    	
	    	img_full.src = img_tab[ current_full_page +1];
	    	if( typeof img_tab[current_full_page+2] !== 'undefined'){
	    		loader_n.src = img_tab[ current_full_page +2];
	    		link_p.style.display = 'block';
	    		
	    	}
	    	else{
		    	link_n.style.display = 'none';
	    	}
	    	loader_p.src = img_tab[ current_full_page ];
	    	current_full_page++;
    	}
    	
    	function prevFullImg(){
	    	var next_url = loader_n.src;
	    	var cur_url  = img_full.src;
	    	var prev_url = loader_p.src;
	    	
	    	img_full.src = img_tab[ current_full_page -1];
	    	if( typeof img_tab[current_full_page-2] !== 'undefined'){
	    		loader_p.src = img_tab[ current_full_page -2];
	    		link_n.style.display = 'block';
	    	}
	    	else{
		    	link_p.style.display = 'none';
	    	}
	    	loader_n.src = img_tab[ current_full_page];
	    	current_full_page--;
    	}
    	
    	var fullscreenImg = function(){
    		var idfs = 'plein_ecran';//img_full';
    	    var img_full = document.getElementById(idfs);
    	    
    	    img_full.style.display='block';
        	if ( screenfull ) {
                screenfull.toggle( document.getElementById(idfs) );
                if (screenfull.enabled) {
                    document.addEventListener(screenfull.raw.fullscreenchange, function () {
                        if( ! screenfull.isFullscreen ){
                            img_full.style.display='none';
                            var url = "<?php echo $base_url; ?>";
                            if(url.indexOf('?') == -1){
                                url += '?';
                            }
                            else{
                                url += '&';
                            }
                            url += "page="+current_full_page;
                            window.location = url;
                        }
                    });
                }
            }
            else{
                alert('Votre navigateur ne gère pas la fonction plein écran. Pensez à le mettre à jour.');
            }
    	}
    	
	</script>
  </body>
</html>
