function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "1000px";
    document.body.appendChild(outer);
    
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    
    var widthWithScroll = inner.offsetWidth;
    
    // remove divs
    outer.parentNode.removeChild(outer);
    
    return widthNoScroll - widthWithScroll;
}


function range( a, b ){
    var temp =[];
    for( i = 0 ;  i < b - a; i++ ){
        temp.push( i );
    }
    return temp;
}


Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}
