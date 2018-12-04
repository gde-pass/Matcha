const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

function cambiarLogin() {
    document.querySelector(".cont_forms").className = "cont_forms cont_forms_active_login";
    document.querySelector(".cont_form_login").style.display = "block";
    document.querySelector(".cont_form_sign_up").style.opacity = "0";

    setTimeout(function () {
        document.querySelector(".cont_form_login").style.opacity = "1";
    }, 400);

    setTimeout(function () {
        document.querySelector(".cont_form_sign_up").style.display = "none";
    }, 200);
}

function cambiarSignUp() {
    document.querySelector(".cont_forms").className = "cont_forms cont_forms_active_sign_up";
    document.querySelector(".cont_form_sign_up").style.display = "block";
    document.querySelector(".cont_form_login").style.opacity = "0";

    setTimeout(function () {
        document.querySelector(".cont_form_sign_up").style.opacity = "1";
    }, 100);

    setTimeout(function () {
        document.querySelector(".cont_form_login").style.display = "none";
    }, 400);
}

function eventFire(el, etype) {
    let evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
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

// ============ SIGN UP EVENTS ===========

document.getElementById("sign_up_email").addEventListener("focusout", function () {

    if (checkEmailPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
        socket.emit("focusOutEmailSignUp", this.value);
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }

});

document.getElementById("sign_up_user").addEventListener("focusout", function () {

    if (checkUserPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("sign_up_password").addEventListener("focusout", function () {

    if (checkPasswordPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("sign_up_confirm_password").addEventListener("focusout", function () {

    let password = document.getElementById("sign_up_password").value;

    if (checkPasswordMatch(this.value, password)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

// ============ /SIGN UP EVENTS ===========

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

document.getElementById("subscribeButton").addEventListener("click", function () {
    let email = document.getElementById("sign_up_email").value;
    let user = document.getElementById("sign_up_user").value;
    let password = document.getElementById("sign_up_password").value;
    let confirmPassword = document.getElementById("sign_up_confirm_password").value;

    if (checkEmailPattern(email) &&
        checkUserPattern(user) &&
        checkPasswordPattern(password) &&
        checkPasswordMatch(password, confirmPassword)) {

        socket.emit("subscribe", {
            email: email,
            user: user,
            password: password,
            confirmPassword: confirmPassword
        });

    } else if (!checkEmailPattern(email)) {
        document.getElementById("sign_up_email").style.borderColor = "red";
        document.getElementById("sign_up_email").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + email + "` is not a valid email",
            html: "Please use a correct email syntax: <b>`exemple@domain.com`</b>",
        });
    } else if (!checkUserPattern(user)) {
        document.getElementById("sign_up_user").style.borderColor = "red";
        document.getElementById("sign_up_user").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + user + "` is not a valid username",
            html: "Your username must contain between <b>2</b> and <b>15</b> characters with <b>alphabet</b> and <b>numbers</b> only."
        });
    } else if (!checkPasswordPattern(password)) {
        document.getElementById("sign_up_password").style.borderColor = "red";
        document.getElementById("sign_up_password").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your password is not valid",
            html: "Your password must contain between <b>6</b> and <b>20 characters<b/> with a <b>number</b>, a <b>capital</b> letter and a <b>minimal</b> letter"
        });
    } else if (!checkPasswordMatch(password, confirmPassword)) {
        document.getElementById("sign_up_confirm_password").style.borderColor = "red";
        document.getElementById("sign_up_confirm_password").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your passwords do not match !"
        });
    }
});

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

socket.on("focusOutEmailSignUpFalse", function (email) {
    document.getElementById("sign_up_email").style.borderColor = "red";
    document.getElementById("sign_up_email").style.borderStyle = "inset";

    swal({
        type: "error",
        title: "Email already existed",
        text: email + " is already taken !"
    });

});

socket.on("subscribeError", function () {
    swal({
        type: "error",
        title: "Oops ...",
        text: "A error occurred"
    });
});

socket.on("tokenCreate", function (token) {

});
// ============ /SOCKET EVENTS =============