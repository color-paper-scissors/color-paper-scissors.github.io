


$(function(doc) {

    initColorBarView();

});




function initColorBarView(){

    //measure widths
    var width = $('body').width();
    var barWidth = width/posters.length;


    //create color bar for each poster
    posters.forEach(function(poster){

        var c = poster.rgb;

        var color = c.r+','+ c.g+','+ c.b;

        var $colorBar = $('<div></div>')

            .data('filename', poster.filename)
            .css({
                    width: barWidth+"px",
                    height: '100vh',
                    backgroundColor: 'rgb(' + color + ')'
            })
            .addClass('colorbar');


        $colorBar.appendTo('#colorbars');

    });

    //bind event handler for colorbars: show preview of poster
    $('body').on('mouseenter', '.colorbar', function(){

        var $bar = $(this);
        var $image = $('<img/>').attr('src', "poster_archive/" + $bar.data( 'filename' ));

        var $container = $('<div></div>').addClass('posterPreviewContainer').append( $image ).data( 'filename',  $bar.data('filename') );

        $container.css({
            'position': 'absolute',
            'top': $bar.offset().top + 25 + 'px',
            'left': $bar.offset().left+'px',
            'width': $image.width() + 'px',
            'height': $bar.height() + 'px'
        });

        $container.appendTo($bar);
    });

    $('body').on('mouseleave', '.colorbar', function(){

        var $bar = $(this);
        $bar.find('.posterPreviewContainer').remove();

    });


}


function loadThumbs(){

    var $imgs = $();
    posters.forEach (function(img) {

        var filename = img.filename;
        var hue = img.hsb.h;

        var $container = $('<div></div>').addClass('filename').data('hue', hue);
        var imgpath = "poster_archive/thumbnails/"+filename;
        $('<img>').attr('src', imgpath).appendTo( $container );

        $imgs = $imgs.add($container);

    });

    return $imgs;
}

