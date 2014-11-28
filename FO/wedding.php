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
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>A&M</title>

    <meta name="viewport" content="initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/static/reset.css">
    <link rel="stylesheet" type="text/css" href="/static/style.css">
    <link rel="stylesheet" type="text/css" href="/static/color.css">

    <link href='http://fonts.googleapis.com/css?family=Arizonia' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Paytone+One' rel='stylesheet' type='text/css'>

    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script type="text/javascript" src="/static/jquery.galleriffic.js"></script>

    <!-- We only want the thunbnails to display when javascript is disabled -->
    <script type="text/javascript">
        document.write('<style>.noscript { display: none; }</style>');
    </script>
</head>
<body>
    <div class="main">
        <section class="left infos">
            <h1><span>Marine</span> & <span>Antoine</span></h1>

            <div class="date">13 Septembre 2014</div>

            <div class="photo">
                <img src="<?php echo $donnee['timeline']['asset']['media']; ?>" alt="Marine & Antoine" />
            </div>

            <div class="deco"></div>
        </section>

        <section class="right album">
            <div class="slideshow-container">
                <div id="controls" class="controls"></div>
                <div id="loading" class="loader"></div>
                <div id="slideshow" class="slideshow"></div>

                <div id="caption" class="caption-container"></div>
            </div>
            
            <div class="navigation-container">
                <div id="thumbs" class="navigation">
                    <ul class="thumbs noscript">
                    <?php
				    	foreach( $donnee['timeline']['date'] as $evenement){ ?>
				    	<li>
				            <a class="thumb" name="leaf" href="<?php echo $evenement['asset']['media']; ?>" title="Title #0"></a>
				            <div class="caption">
				                <div class="hide-caption"></div>
				                <div class="image-title"><?php echo $evenement['text']; ?></div>
				                <div class="image-desc"><?php echo $evenement['asset']['caption']; ?></div>
				                <div class="download">
				                    <a href="<?php echo $evenement['asset']['media']; ?>">Download Original</a>
				                </div>
				            </div>
				            <div class="image" style="background-image:url('<?php echo $evenement['asset']['media']; ?>')"></div>
				        </li>
				    	<?php }
				    	?>
					</ul>
                </div>
            </div>
        </section>
    </div>

    <div class="control">
        <div class="main">
            <div class="pagination right">
                <a class="pageLink prev" style="visibility: hidden;" href="#" title="Précédents">Précédents</a>

                <div id="caption2" class="caption-container">
                    <div class="photo-index"></div>
                </div>

                <a class="pageLink next" style="visibility: hidden;" href="#" title="Suivants">Suivants</a>
            </div>
        </div>
    </div>
    
    <footer>
        <p>Copyright 2014 <a href="http://www.taniaha.fr/">Tania Hantz</a></p>
    </footer>

    <script type="text/javascript" src="/static/script.js"></script>
</body>
</html>