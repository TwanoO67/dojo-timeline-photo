<?php

//internationnalisation
$locale = 'fr-fr';
$available_lang = array(
    "fr-fr" => 'Français',
    "en-us" => 'Anglais',
);
$param_lang = $_REQUEST['language'];
if($param_lang != null && $param_lang != '' && isset($available_lang[$param_lang]) ){
    $locale = $param_lang;
}
?>

<!DOCTYPE HTML>
<html>
    <head>
        <meta charset='utf-8'>
        <link rel="stylesheet" type="text/css" href="./css/bo.css" />
        <script src="//ajax.googleapis.com/ajax/libs/dojo/1.9.1/dojo/dojo.js" 
			data-dojo-config="
                parseOnLoad: true,
                cacheBust: true,
                isDebug: true,
                debugAtAllCosts: true,
                async: true,
                locale: '<?php echo $locale; ?>',
                dojoBlankHtmlUrl:'./js/blank.html',
                baseUrl: './js/',
                paths: {
                    custom: 'custom', 
                    library: 'library'
                },
                packages : [{
                        name : 'dbootstrap',
                        location : 'dbootstrap'
                    },{
                        name : 'xstyle',
                        location: 'xstyle'
                    },{
                        name : 'put-selector',
                        location : 'put-selector'   
                    }
                ] 
            " ></script>
            <?php
            //recuperation d'etat de l'url et passage par une globale js
            if(isset($_REQUEST['go']) && $_REQUEST['go'] != ''){
	            echo "<script>GLOBAL_GO_STRING = '".$_REQUEST['go']."'; </script>";
            }
            ?>
            <script src="./js/init.js" ></script>
        
        <link rel="icon" type="image/png" href="./img/timeline.png" />
        <title>TimeLine Editor</title>
	</head>
	<body class='dbootstrap'>
 
<div id='bc_main'data-dojo-type="dijit/layout/BorderContainer" style="width: 100%; height: 100%;">
        <div id="cp_header" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top', splitter: false">
            <a href='/BO/' style="text-decoration: none;">
            <img src="./img/timeline.png" width='40px' style='float:left;padding-right:10px;'/>
            <h1>TimeLine Editor</h1> &nbsp;  
            <h2>"Simple Media Manager"</h2>
            </a>
            <div id='gestion_lang'>
               	<label for='select_lang'>Langue: </label>
               	<select id="select_lang">
                <?php
                    foreach($available_lang as $loc => $name){
                        echo '<option value="'.$loc.'" '.(($loc==$locale)?'selected':'').'>'.$name.'</option>';
                    }
                ?>
                </select>
            </div>
        </div>
     	
     <div 
     	id='cp_center'
     	data-dojo-type="dijit/layout/ContentPane" 
     	data-dojo-props="region:'center', splitter: true" >
     </div>
     
     <div id="cp_footer" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'bottom', splitter: false">
        Copyright 2014 @ <a href='http://www.weberantoine.fr'>WEBER Antoine</a>
     </div>
</div>



	</body>
</html>