


$(function(doc) {
    var colWidth = 100/posters.length;
    updateStyleSheet( '.colorbar{width:'+ colWidth +'%}' );

    mockupPosterData();
    initColorBarView();
});


function mockupPosterData(){

    posters.forEach( function( poster, i ){
        var di = Math.floor( Math.random()*designers.length );
        var gi = Math.floor ( Math.random()*graduates.length );
        posters[i]["designer"] = designers[di];
        posters[i]["graduate"] = graduates[gi];
    });

}

function initColorBarView(){

    //measure widths
    var width = $('body').width();
    var barWidth = width/posters.length;

    //create color bar for each poster
    posters.forEach(function(poster){

        var c = poster.rgb;

        var color = c.r+','+ c.g+','+ c.b;

        var colorBar = $('<div></div>')

            .data('filename', poster.filename)
            .data('designer', poster.designer)
            .data('graduate', poster.graduate)
            .css({
                    backgroundColor: 'rgb(' + color + ')'
            })
            .addClass('colorbar');


        colorBar.appendTo('#colorbars');

    });

    // show and hide posters on hover
    $('body').on('mouseenter', '.colorbar', function(){
            var $bar = $(this);
            var $image = $('<img/>').attr('src', "poster_archive/" + $bar.data('filename'));

            var $container = $('<div></div>').addClass('posterPreviewContainer').append($image);

            $container.css({
                'position': 'absolute',
                'top': $bar.offset().top + 25 + 'px',
                'left': $bar.offset().left + 'px',
                'height': $bar.height() + 'px'
            });

            $container.appendTo($bar);
    });

    // hide
    $('body').on('mouseleave', '.colorbar', function(){

        var $bar = $(this);
        $bar.find('.posterPreviewContainer').remove();

    });

    // create showcase with poster
    $('body').on('click', '.posterPreviewContainer', function(){

        var $img =  $('<div></div>').addClass('imgwrapper').append( $(this).find( 'img') );
        var $showcasecontent = $('<div></div>').addClass( 'showcasecontent' )
            .append( $img );


        var $caption = $('<div></div>').addClass('imgcaption');
        var designer = $(this).parent('.colorbar').data('designer');
        var graduate = $(this).parent('.colorbar').data('graduate');
        $caption.append( $('<div></div>').text("By: " + designer ) );
        if(graduate) $caption.append( $('<div></div>').text("For: " + graduate ));
        $caption.appendTo($showcasecontent);


        $('<div></div>').addClass('showcase').appendTo( "body" ).fadeIn( 500, function(){
            $showcasecontent.hide().appendTo( $(this) );
            $showcasecontent.fadeIn(250);
        });

    });

    $('body').on('click', '.showcase', function(){
        $(this).fadeOut( 500, function(){
            $(this).remove();
        });
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

