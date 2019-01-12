// ============ FRONT EVENTS ===========
const socket = io.connect("http://localhost:8080");

new WOW().init();

addEventListener("load", function() {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar(){
    window.scrollTo(0,1);
}


$(window).on('load', function () {
    $('.flexslider').flexslider({
        animation: "slide",
        start: function(slider){
            $('body').removeClass('loading');
        }
    });
});

// ============ /FRONT EVENTS ===========
