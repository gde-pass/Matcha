const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

addEventListener("load", function() {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar(){
    window.scrollTo(0,1);
}

$('form').submit(false);

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

    if (checkEmailPattern(email) && checkPasswordPattern(password)) {

        socket.emit("login", {
            email: email,
            password: password,
        });
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

// ============ /SOCKET EVENTS =============