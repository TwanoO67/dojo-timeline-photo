<?php
	$json_path = '../DATA/json/'.$_REQUEST['file_name'];
    	
    $data = file_get_contents($json_path);
    if($data === false){
	    echo "Fichier JSON non accessible";
	    exit;
    }
    $donnee = json_decode($data);
    if( !isset($donnee->timeline) || $donnee->timeline == null ){
    	echo "Le fichier JSON n'a pas le bon format";
	    exit;
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title><?php echo $donnee->timeline->headline; ?></title>
		<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>    
		<script type='text/javascript' src='http://photos.weberantoine.fr/infinite/rotator.js'></script>
    <style>
    h1{
	    font-size: 1.3em;
    }
    h2{
	    font-size: 1.1em;
	    font-style: italic;
	    font-weight: normal;
    }
    .operator{
	    color: grey;
    }
    #main{
	    height: 100%;
    }
    #rotating-item-wrapper {
		position: relative;
	}
	.rotating-item {
		display: none;
		margin-left: auto;
		margin-right: auto;
		text-align: auto;
		height: 100%;
	}
	.description{
		display: inline-block;
		vertical-align: top;
		padding: 20px;
	}
	.image{
	 	max-height: 80%;
	}
	body{
		text-align: center;
		color:white;
		background-color: black;
		font-family: 'Helvetica Neue Light', HelveticaNeue-Light, 'Helvetica Neue', Helvetica, Arial, sans-serif; /* "Helvetica Neue", Helvetica, Arial, sans-serif; */
	}
    </style>
    <script>
    	function next(){
	    	pause();
	    	InfiniteRotator.next();
    	}
    	
    	function pause(){
	    	InfiniteRotator.setPause(true);
	    	$("#pause").hide();
	    	$("#play").show();
    	}
    	
    	function play(){
	    	InfiniteRotator.setPause(false);
	    	$("#pause").show();
	    	$("#play").hide();
	    	
    	}
    	
    	function previous(){
    		pause();
	    	InfiniteRotator.previous();
    	}
    	
    	$(window).load(function() {
    		InfiniteRotator.itemInterval = 8000;
    		InfiniteRotator.init();
    	});
    	
    </script>
  </head>
  <body>
  	<div id='main'>
	    <h1><?php echo $donnee->timeline->headline; ?></h1>
	    <div id="rotating-item-wrapper">
	    
	    	<?php
		    	foreach($donnee->timeline->date as $event){
		    		echo "<div class='rotating-item' >";
		    		echo "<h2>".$event->headline."</h2>";
			    	echo "<img class='image' src='".$event->asset->media."' alt='".$event->text."'   />";
			    	echo "<div class='description'>".$event->text."</div>";
			    	echo "</div>";
		    	}
	    	?>
	    </div>
	    <a onclick='previous();' id='previous' style='cursor:pointer;' class='operator'>Précédent</a>&nbsp;&nbsp;&nbsp;
	    <a onclick='pause()' id='pause' style='cursor:pointer;' class='operator'>Pause</a>
	    <a onclick='play()' id='play' style='display:none;cursor:pointer;' class='operator'>Lecture</a>&nbsp;&nbsp;&nbsp;
	    <a onclick='next();' id='next' style='cursor:pointer;' class='operator'>Suivant</a>
  	</div>
  </body>
</html>
