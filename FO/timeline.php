<?php
	$data_dir = '/DATA/';
?>
<html>
<head>
    <title>ALBUM PHOTOS</title>
    <meta name="description" content="WEBER Antoine">
    <meta charset="utf-8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <link rel="icon" type="image/png" href="/static/favicon.ico"> 
    <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico">
    
    <!-- Style-->
    <style>
      html, body {
          height:100%;
          padding:0;
          margin:0;
      }
    </style>
    <!-- HTML5 shim, for IE6-8 support of HTML elements-->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  
  <body>
    <!-- BEGIN Timeline Embed -->
    <div id="timeline-embed"></div>
    
    <script type="text/javascript">
      var config = {
       width: "100%",
       height: "95%",
       hash_bookmark: true,
       start_zoom_adjust: -4,
       source: '<?php echo $data_dir.'json/'.$_REQUEST['file_name'];?>',
       font:	'Pacifico-Arimo'
      };
      var timeline_config = config;
      
      config.i18n = {
				date: {
					month: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"],
					month_abbr: ["Jan.", "Fev.", "Mars", "Avr.", "Mai", "Juin", "Juil", "Août", "Sept.", "Oct.", "Nov.", "Dec."],
					day: ["Dimanche","Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
					day_abbr: ["Di.","Lu.", "Ma.", "Me.", "Je.", "Ve.", "Sa."]
				},
				dateformats: {
					year: "yyyy",
					month_short: "mmm",
					month: "mmmm yyyy",
					full_short: "d. mmm",
					full: "d. mmmm yyyy",
					time_no_seconds_short: "HH:MM",
					time_no_seconds_small_date: "HH:MM'<br/><small>'d. mmmm yyyy'</small>'",
					full_long: "dddd',' d. mmm yyyy 'um' HH:MM",
					full_long_small_date: "HH:MM'<br/><small>'dddd',' d. mmm yyyy'</small>'"
				},
				messages: {
					loading_timeline: "Chargement du site...",
					return_to_title: "Retour au titre",
					expand_timeline: "Etendre la chronologie",
					contract_timeline: "Réduire la chronologie"	,
					unsupported_ie7: "Internet Explorer 7 n'est pas supporté. Merci d'installer un <a href='http://www.google.com/chrome?hl=fr'>VRAI</a> navigateur. "
				}
			};
    </script>
    <!--<script type="text/javascript" src="http://timeline.verite.co/lib/timeline/js/storyjs-embed.js"></script>-->
    <script type="text/javascript" src="http://photos.weberantoine.fr/timelinejs/storyjs-embed.js"></script>
    <!-- END Timeline Embed-->
    <!-- Analytics-->
    <script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-38412007-1']);
      _gaq.push(['_trackPageview']);
      (function() {
       var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
       ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
    
    
    
    <div id="disqus_thread"></div>
    <script type="text/javascript">
        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
        var disqus_shortname = 'weberantoine'; // required: replace example with your forum shortname

        /* * * DON'T EDIT BELOW THIS LINE * * */
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
    <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
    
    
    
</body>
</html>