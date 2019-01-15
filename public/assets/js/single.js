const socket = io.connect("http://localhost:8080");

var   like = document.querySelector("#like_btn");



// ============ FRONT EVENTS ===========

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

$("#like_btn").click(function () {
    const btn = $("#like_btn");

    let target = window.location.search.replace("?", "");

    $.ajax({
        url: "/api/single/toggle_like",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {token: getCookie("token"), target: target},
        success: function (data, status, xhr) {

            location.reload();
            if (data.liked) {
                btn.text("Dislike");
            } else {
                btn.text("Like");
            }
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.error === "token") {
                window.location = "/";
            }
        }
    })
});

$("#bloque_btn").click(function (e) {
    const btn = $("#bloque_btn");

    let target = window.location.search.replace("?", "");
    $.ajax({
        url: "/api/single/toggle_bloque",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {token: getCookie("token"), target: target},
        success: function (data, status, xhr) {
            if (data.bloqued) {
                btn.text("Unblock");
            } else {
                btn.text("Bloquer");
            }
        },
        error: function (xhr) {
            if (xhr.responseJSON.error === "token") {
                window.location = "/";
            }
        }
    })
});

$("#report").click(function() {
    let cookie = Cookies.get("token");
    let reported = window.location.search.slice(1);

    socket.emit("report", {
        cookie: cookie,
        reported: reported.slice(1)
    });


});

socket.on("reportFalse", function () {
    swal({
        type: "error",
        title: "Hey !",
        html: "You already report this user !",
    });
});

socket.on("reportTrue", function () {
    swal({
        type: "success",
        title: "Thank You !",
        html: "We will have a look on this profil",
    });
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
if(like){
    like.addEventListener('click' , function(){
        var url = window.location.href;
        var lastPart = url.split("?").pop();
        // console.log('word :', lastPart );
        socket.emit('create_notif', {
            user: lastPart,
            type: 1,
            like:like.innerHTML
        });
    });
};
socket.emit("visite", {
    token: getCookie("token"),
    username: window.location.search.slice(1),
    type: 5
});

// ============ /SOCKET EVENTS ===========
