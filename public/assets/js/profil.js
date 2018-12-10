const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}

$('form').submit(false);


function updateTextDistance(val) {
    document.getElementById('distanceText').innerHTML = "Distance: " + val + " (Km)";
}

function updateTextAge(val) {
    document.getElementById('ageText').innerHTML = "Age: " + val + " ans";
}


// ============ /FRONT EVENTS ===========

// ============ CHECK FUNCTIONS ===========

/**
 * @return {boolean}
 */
function checkEmailPattern(value) {
    const emailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");

    if (value.length === 0 || value.length > 254 ||
        value.length < 3 || !value.match(emailRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkUserPattern(value) {
    const userRegex = new RegExp("^[0-9a-zA-Z]+$");

    if (value.length === 0 || value.length > 15 ||
        value.length < 2 || !value.match(userRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkName(value) {
    const NameRegex = new RegExp("^(?=.{2,40}$)[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");

    if (value.length === 0 || value.length > 40 ||
        value.length < 2 || !value.match(NameRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkPasswordPattern(value) {
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (value.length === 0 || value.length < 6 ||
        value.length > 20 || !value.match(passwordRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkPasswordMatch(password1, password2) {
    if (password1 !== password2 || password1.length === 0 || password2.length === 0) {
        return (false);
    } else {
        return (true);
    }
}

// ============ /CHECK FUNCTIONS =============



// ============ SOCKET EVENTS =============
socket.emit("getCookie", Cookies.get("token"));


document.getElementById("save").addEventListener("click", function () {
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
});
// ============ /SOCKET EVENTS =============