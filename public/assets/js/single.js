const socket = io.connect("http://localhost:8080");

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
            // location.reload();
            if (data.bloqued) {
                btn.text("Unblock");
            } else {
                btn.text("Bloquer");
            }
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.error === "token") {
                window.location = "/";
            }
        }
    })
});

$("#report").click(function() {
    let cookie = Cookies.get("token");
    let reported = window.location.search;

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

