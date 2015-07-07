var pageH = window.innerHeight;
var pageW = window.innerWidth;
var ratio = 1.40;
var originalColWidth;
var previewHeight = 9 * pageH / 10;
var containerWith = previewHeight / ratio;
var fullscreen = null;

var currentViewGallery;

var opts = {
      lines: 20 // The number of lines to draw
    , length: 30 // The length of each line
    , width: 5 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.2 // Scales overall size of the gallery.spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'gallery.spinner' // The CSS class to assign to the gallery.spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}


function windowResize(){
    pageH = window.innerHeight;
    pageW = window.innerWidth;
    previewHeight = 9 * pageH / 10;
    containerWith = previewHeight / ratio;
}


$(function(doc) {
    fullscreen = new Fullscreen();

    mockupPosterData();


    var BarGallery = barViewGallery();
    var gridGallery = gridViewGallery();
    var nav = Navigator();


    $(window).resize( windowResize );
});


function mockupPosterData(){
    posters.forEach( function( poster, i ){
        var di = Math.floor( Math.random()*designers.length );
        var gi = Math.floor ( Math.random()*graduates.length );
        posters[i]["designer"] = designers[di];
        posters[i]["graduate"] = graduates[gi];
    });
}



function FILTERKEY( elem ){
    return {
        cat: $(elem).attr('cat'),
        key: $(elem).val()
    }
}


function parseRgb( c ){
    return c.r+','+ c.g+','+ c.b;
}


function Fullscreen(){
    var self = this;
    self.wrapper = $('<div class="fullscreen-wrapper">');

    self.goOn = function( targetElem ){
        if( self.wrapper.hasClass('on') ){
            return;
        }
        var data =   targetElem.parent().data();
        var previewX = targetElem.position().left;
        var barX =     targetElem.parent().position().left;
        var poster = targetElem.clone(true);

        var infoWrapper =  $('<div class="infoWrapper vertical-center">');
        var designerElem = $('<strong class="label" id="designer">');
        var graduateElem = $('<span class="label" id="graduate">');

        var leftStart, leftEnd;

        if( barX > pageW/2 ){
            leftStart = previewX;
            leftEnd = previewX-200;
        }
        else{
            leftStart = previewX+containerWith-200;
            leftEnd = previewX+containerWith+30;
        }

        poster.css({
            left: previewX * 100 / pageW + '%',
        })


        designerElem.text( data.designer )
        graduateElem.text( data.graduate )
        infoWrapper
            .append( designerElem, graduateElem )
            .css('left', leftStart)

        self.wrapper
            .append( infoWrapper, poster )
            .show()
            .addClass('on')
            .click( self.goOff )
            .animate({opacity: 1}, 500, function(){
                poster.addClass('vertical-center');
                infoWrapper.animate({
                    left: leftEnd,
                    opacity: 1
                }, 500);
            })
    }

    self.goOff = function(){
        if( !self.wrapper.hasClass('on') ){
            return;
        }
        self.wrapper
        .removeClass('on')
        .animate({opacity: 0}, 500, function(){
            $(this).hide().empty();
        });
    }

    //initilize
    self.wrapper.appendTo( $('body') );
}




function Navigator(){
    var self = this;

    self.handlers = {
        grid:   $('.view-handler#grid'),
        bar:    $('.view-handler#bar'),
        search: $('.filter-handler#search')
    }

    self.searchInput = $('.search input');

    var setValue = function(){
        var that = $(this).siblings('input')[0];
            that.value = "look for " + $(that).attr('cat') + "...";
            $(that).removeClass('on');

        // if user did not type anything 
        // or it did not match the database
        if( this.value.length == 0 || this.value == "no match!" ){
            this.value = "look for " + $(this).attr('cat') + "...";
            $(this).removeClass('on');
        }
        // else input has right value to send to filter function
        else{
            $(this).addClass( "on" );
        }
    }


    var ac_open = function (e, ui) {
        /*
            once suggestion list is opened
            we highlight the macthed strings
        */

        var matchTemplate = '<span class="key-match">$1</span>';
        var acData = $(this).data('ui-autocomplete');

        var highlightMatch = function () {
            var keywords = acData.term.split(' ').join('|');
            var regex = new RegExp("(" + keywords + ")", "gi");
            var regex = $(this).text().replace( regex, matchTemplate )
            $(this).html( regex );
        }

        acData.menu.element.find('li').each( highlightMatch );
    }


    var ac_highlight = function( event, ui ) {
        /*
            highlight selected item in menu 
            class ".highlight"
        */

        $(event.currentTarget).addClass('highlight')
    }

    var handelInputsOnEnter = function(event){
        /*
            validate the user input if it is good to go
        */


        // if event was a key press but not enter
        if( event.keyCode && event.keyCode !== 13 ){
            return;
        }

        // select the right input
        // and if the string did not exist in database
        // Nomatch is given as feedback
        var input = self.searchInput.filter('.on');
        if( !input.data('ui-autocomplete').selectedItem ){
            input[0].value = "no match!";
            return;
        }

        // here string is validate and good to go for filter
        currentViewGallery.filter( new FILTERKEY ( input ) );
    }

    self.init = function(){
        /*
            initilize all elements and attach their events
            in nav section
        */

        self.searchInput
            .focusin( setValue )
            .focusout( setValue )
            .keyup( handelInputsOnEnter );

        self.searchInput.each(function(){
            $(this).autocomplete({
                source: $(this).attr('cat') == "designer"? designers:graduates,
                focus: ac_highlight,
                open: ac_open
            })
        })


        self.handlers.search.click( handelInputsOnEnter )
    }

    self.init();

    return self;
}




function barViewGallery(){

    var self = this;
    self.gallery = $('#colorbars');

    //************* dom elements ************ //

    var ColorBar = function( barData ){

        var color = parseRgb( barData.rgb );
        return $('<div class="colorbar">')
                    .data('filename', barData.filename)
                    .data('designer', barData.designer)
                    .data('graduate', barData.graduate)
                    .css('backgroundColor', 'rgb(' + color + ')' )
                    .hover( showPreview, hidePreview )
    }

    var PreviewContainer = function( barElem ){

        var x = $(barElem).position().left,
            left = x > pageW/2 ? (x-containerWith) : x;
        
        var spine =  new Spinner(opts).spin();

        var img = new Image();
            img.src = "poster_archive/" + $(barElem).data('filename')

        // hide the spiner once the image is loaded
        img.onload = function(){
            spine.stop();                
        }

        return $('<div class="previewContainer">')
                    .append( img, spine.el )
                    .css({
                        left: left,
                        width: containerWith
                    })
                    .click( showPosterInfullScrenn )
    }


    //************* events ************ //

    // hover in
    var showPreview = function(){
        var container = new PreviewContainer( this );
        $(this).append( container );
    }

    // hover out
    var hidePreview = function(){

        $(this).find('.previewContainer').remove();
    }

    // click
    var showPosterInfullScrenn = function(){
        fullscreen.goOn( $(this) );
    }


    //************* methods ************ //

    self.filter = function( match ){

        if( self.gallery.hasClass('on') )
            self.resetView();

        self.gallery.addClass('on');


        var toShow = self.gallery.find('.colorbar').filter(function(){
            return $(this).data( match.cat ) == match.key;
        })

        console.log( match.cat + ' & ' + match.key + ' returns ', toShow.size(), 'resaults!' )

        self.gallery.find('.colorbar').not(toShow).each(function(i){
            $(this).delay(i*5).hide(200);
        })

        toShow.each(function(){
            $(this).animate({
                width: 100 / toShow.size() + '%'
            }, 1000)
        })
    }

    self.resetView = function(){
        self.gallery.find('.colorbar').each(function(){
            $(this)
                .show()
                .animate({
                    width: originalColWidth + '%'
                }, 1000)
        })
    }

    var init = function(){

        // calculate initial measurements
        originalColWidth = 100/posters.length;
        updateStyleSheet( '.colorbar{width:'+ originalColWidth +'%}' );

        //create color bar for each poster
        posters.forEach(function(posterData){
            var bar = new ColorBar( posterData );
                bar.appendTo('#colorbars');
        });

        currentViewGallery = self;
    }

    init();
}


function gridViewGallery(){
    var self = this;
    self.wrapper = $('.galleryWrapper#gridview');
    var width = getItemWidth('.posterWrapper');
    var height = width * ratio;

    var spineOptions = $.extend({}, opts, {
                                            position: "relative", 
                                            top: height / 2 + 'px',
                                            scale: 0.15
                        });

    var showPosterInfullScrenn = function(){
        fullscreen.goOn( $(this) );
    }


    var InfoWrapper = function( designer, graduate ){
        return $('<div class="infoWrapper vertical-center">')
                    .append( 
                        $('<strong class="label" id="designer">').text( designer ), 
                        $('<span class="label" id="graduate">').text( graduate )
                    );
    }

    var PosterWrapper = function( posterData , addImage ){
        var info =  new InfoWrapper( posterData.designer, posterData.graduate );
        var _wrapper = $('<div class="posterWrapper">');

        if( addImage ){
            var spine = new Spinner( spineOptions ).spin();
            var posterImg = new Image();
            posterImg.src =  "poster_archive/" + posterData.filename;
            posterImg.onload = function(){
                spine.stop();
            }
            _wrapper.append( spine.el, posterImg )
        }

        return _wrapper
                    .append( info )
                    .data('designer', posterData.designer)
                    .data('graduate', posterData.graduate)
                    .css('backgroundColor', 'rgb(' + parseRgb( posterData.rgb ) + ')' )
                    .hover( toggleHighlight )
                    .click( showPosterInfullScrenn );
    }


    var toggleHighlight = function(){
        var poster = $(this);
        $(this).toggleClass('highlight');
    }

    self.filter = function( match ){

        self.resetView();

        self.gallery.addClass('on');

        var toShow = self.wrapper.find('.posterWrapper').filter(function(){
            return $(this).data( match.cat ) == match.key;
        })

        console.log( match.cat + ' & ' + match.key + ' returns ', toShow.size(), 'resaults!' )
        
        if( toShow.size == 0 )
            return;


        self.wrapper.find('.posterWrapper').not(toShow).each(function(i){
            $(this).delay(i*5).addClass('hide');
        })

    }

    self.resetView = function(){
        self.wrapper.find('.posterWrapper').each(function(i){
            $(this)
                .removeClass('hide');
        })
    }

    self.init = function(){
        //create poster cell for each poster
        counter = 0;
        var sw = getScrollbarWidth();
            sw = sw * 100 / pageW;

        currentViewGallery = self;
        self.wrapper.css('width', (100+sw)+"%");

        var counter = 0;

        posters.forEach(function(posterData){
            if( counter < 30 )
                self.wrapper.append( new PosterWrapper( posterData, true ) )
            else
                self.wrapper.append( new PosterWrapper( posterData, false ) )

            counter++;
        });
    }


}




