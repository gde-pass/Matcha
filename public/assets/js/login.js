const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

addEventListener("load", function() {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar(){
    window.scrollTo(0,1);
}

$('form').submit(false);

if (window.location.search === '?email') {
    swal({
        type: "success",
        title: "Confirmation email",
        text: "Good job ! You just receive a email with a activation link please check your maibox."
    });
}
if (window.location.search === '?reset') {
    swal({
        type: "success",
        title: "Confirmation email",
        text: "You just receive a email with link the reset your password please check your maibox."
    });
}

if (window.location.search === '?token') {
    swal({
        type: "error",
        title: "Invalid token",
        text: "Your token is not valide."
    });
}

if (window.location.search === '?success') {
    swal({
        type: "success",
        title: "Reset password",
        text: "Your password as been changed with success."
    });
}

if (window.location.search === '?updated') {
    swal({
        type: "success",
        title: "Your settings have been updated",
        text: "Please login to see changes"
    });
}
// ============ /FRONT EVENTS ===========

// =========== CHECK FUNCTIONS ===========

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
function checkPasswordPattern(value) {
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (value.length === 0 || value.length < 6 ||
        value.length > 20 || !value.match(passwordRegex)) {
        return (false);
    } else {
        return (true);
    }
}

// ============ LOGIN EVENTS ===========

document.getElementById("login_password").addEventListener("focusout", function () {

    if (checkPasswordPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("login_email").addEventListener("focusout", function () {

    if (checkEmailPattern(this.value)) {
        socket.emit("focusOutEmailLogIn", this.value);
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

// ============ /LOGIN EVENTS ===========

// ============= BUTTONS =============

document.getElementById("loginButton").addEventListener("click", function () {
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;

    function location(lat, lgn)
    {
        socket.emit("login", {
            email: email,
            password: password,
            lat: lat,
            lng: lgn
        });
    }

    if (checkEmailPattern(email) && checkPasswordPattern(password)) {
        navigator.geolocation.getCurrentPosition(function (position) {
            location(position.coords.latitude, position.coords.longitude)
        }, function (err) {
            $.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD9oJ7wV_M2Q1U-xcU71D-SSEiPHqiozIE", (res) => {
                location(res.location.lat, res.location.lng)
            })
        }, { enableHighAccuracy: true, timeout: 5000 })
    } else if (!checkEmailPattern(email)) {
        swal({
            type: "error",
            title: "`" + email + "` is not a valid email",
            html: "Please use a correct email syntax: <b>`exemple@domain.com`</b>",
        });
    } else if (!checkPasswordPattern(password)) {
        swal({
            type: "error",
            title: "Your password is not valid",
            html: "Your password must contain between <b>6</b> and <b>20 characters<b/> with a <b>number</b>, a <b>capital</b> letter and a <b>minimal</b> letter"
        });
    }
});

// ============= /BUTTONS =============

// ============ SOCKET EVENTS =============
socket.on("tokenLogin", function (token) {
    Cookies.set('token', token, {expires: 7});
    window.location = "profil";

});

socket.on("loginError", function () {
    swal({
        type: "error",
        title: "Invalid password or email",
        text: "The combination of email/password you type doesn't match with any user "
    });
});

socket.on("loginActivatedError", function () {
    swal({
        type: "warning",
        title: "Account not activated",
        text: "You must activate your account to login, please check your mails"
    });
});
// ============ /SOCKET EVENTS =============