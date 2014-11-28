/********** GALLERIFFIC **********/
$(document).ready(function() {
    var showCaption
    var hideCaption

    // We only want these styles applied when javascript is enabled
    $('div.content').css('display', 'block');
    
    // Initialize Advanced Galleriffic Gallery
    var gallery = $('#thumbs').galleriffic({
        delay:                     2500,
        numThumbs:                 15,
        preloadAhead:              15,
        enableTopPager:            false,
        enableBottomPager:         false,
        imageContainerSel:         '#slideshow',
        controlsContainerSel:      '#controls',
        captionContainerSel:       '#caption',
        loadingContainerSel:       '#loading',
        renderSSControls:          false,
        renderNavControls:         true,
        playLinkText:              'Play Slideshow',
        pauseLinkText:             'Pause Slideshow',
        prevLinkText:              '&lsaquo; Previous Photo',
        nextLinkText:              'Next Photo &rsaquo;',
        nextPageLinkText:          'Next &rsaquo;',
        prevPageLinkText:          '&lsaquo; Prev',
        enableHistory:             true,
        autoStart:                 false,
        syncTransitions:           true,
        defaultTransitionDuration: 500,
        onSlideChange:             function(prevIndex, nextIndex) {
            clearTimeout(showCaption);
            clearTimeout(hideCaption);
        },
        onPageTransitionOut:       function(callback) {
            this.fadeTo('fast', 0.0, callback);
        },
        onPageTransitionIn:        function() {
            var prevPageLink = $('.control').find('a.prev').css('visibility', 'hidden');
            var nextPageLink = $('.control').find('a.next').css('visibility', 'hidden');
            
            // Show appropriate next / prev page links
            if (this.displayedPage > 0)
                prevPageLink.css('visibility', 'visible');

            var lastPage = this.getNumPages() - 1;
            if (this.displayedPage < lastPage)
                nextPageLink.css('visibility', 'visible');

            this.fadeTo('fast', 1.0);

            $('#caption2').find('div.photo-index')
                .html((this.displayedPage +1) +'<span> / '+ this.getNumPages() +'</span>');
        }
    });

    // Show and hide the first caption on page refresh
    setTimeout("var b = $('#caption .image-caption').outerHeight();",750);
    setTimeout("$('#caption .image-caption').css('bottom', '-'+b+'px');",760);
    showCaption = setTimeout("$('.image-caption').animate({bottom: '0'}, 500).addClass('display');",800);
    hideCaption = setTimeout("$('.image-caption').animate({bottom: '-'+b+'px'}, 500).removeClass('display');",2000);

    /**************** Event handlers for custom next / prev page links **********************/

    $('.control').find('a.prev').click(function(e) {
        gallery.previousPage();
        e.preventDefault();
    });

    $('.control').find('a.next').click(function(e) {
        gallery.nextPage();
        e.preventDefault();
    });

    /****************************************************************************************/
});

/********** HIDE / SHOW CAPTIONS **********/
$(document).ready(function () {
    $(document).on("click", "#caption .hide-caption", function() {
        var p = $(this).parents(".image-caption");
        var h = p.outerHeight();

        if(p.hasClass("display")) {
            p.stop().animate({bottom: "-"+h+"px"}, 500).removeClass("display");
        } else {
            p.css("bottom", "-"+h+"px");
            p.stop().animate({bottom: "0"}, 500).addClass("display");
        }
    });
});
