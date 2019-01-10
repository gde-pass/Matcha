const socket = io.connect("http://localhost:8080");
var   like = document.querySelector("#like_btn")
// ============ FRONT EVENTS ===========

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

$("#like_btn").click(function (e) {
    const btn = $("#like_btn");

    let target = window.location.search.replace("?", "");

    $.ajax({
        url: "/api/single/toggle_like",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {token: getCookie("token"), target: target},
        success: function (data, status, xhr) {
            location.reload();
            if (data.liked) {// todo recupere si matched, if matched donne enlever la class hide
                btn.text("Dislike");
                // msg.toggleClass('hide');
            } else {
                btn.text("Like");
                // msg.toggleClass('hide');
            }
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.error === "token") {
                window.location = "/";
            }
        }
    })
});

$(window).on('load', function () {
    $("#flexiselDemo1").flexisel({
        visibleItems: 3,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: {
            portrait: {
                changePoint: 480,
                visibleItems: 2
            },
            landscape: {
                changePoint: 640,
                visibleItems: 3
            },
            tablet: {
                changePoint: 768,
                visibleItems: 4
            }
        }
    });
});


$(window).on('load', function () {

    $("#flexiselDemo3").flexisel({
        visibleItems: 3,
        animationSpeed: 1000,
        autoPlay: true,
        autoPlaySpeed: 3000,
        pauseOnHover: true,
        enableResponsiveBreakpoints: true,
        responsiveBreakpoints: {
            portrait: {
                changePoint: 480,
                visibleItems: 2
            },
            landscape: {
                changePoint: 640,
                visibleItems: 3
            },
            tablet: {
                changePoint: 768,
                visibleItems: 4
            }
        }
    });

});

// ============ /FRONT EVENTS ===========

// ============ /SOCKET EVENTS ===========

like.addEventListener('click' , function(){
    var url = window.location.href;
    var lastPart = url.split("?").pop();
    console.log('word :', lastPart );
    socket.emit('create_notif', {
        user: lastPart,
        type: 1,
        like:like.innerHTML
    });
});











// ============ /SOCKET EVENTS ===========
