// ============ FRONT EVENTS ===========

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

if (window.location.search === '?email') {
    swal({
        type: "success",
        title: "Confirmation email",
        text: "Good job ! You just receive a email with a activation link please check your maibox."
    });
}

// ============ /FRONT EVENTS ===========