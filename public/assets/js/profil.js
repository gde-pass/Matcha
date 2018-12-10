const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}

// ============ /FRONT EVENTS ===========


// ============ SOCKET EVENTS =============
socket.emit("getCookie", Cookies.get("token"));


document.getElementById("save").addEventListener("click", function () {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let sex = document.getElementById("sex").value;
    let orientation = document.getElementById("orientation").value;
    let age = document.getElementById("age").value;
    let email = document.getElementById("email").value;
    let tags = document.getElementById("tags").value;
    let location = document.getElementById("location").value;
    let bio = document.getElementById("bio").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;


    socket.emit("parametre", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        sex: sex,
        orientation: orientation,
        age: age,
        tags: tags,
        location: location,
        bio: bio,
        password: password,
        password2: password2,
    });
});
// ============ /SOCKET EVENTS =============