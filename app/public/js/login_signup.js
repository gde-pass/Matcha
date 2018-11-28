const socket = io.connect('http://localhost:8080');

function cambiar_login() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";

    setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },400);

    setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
    },200);
}

function cambiar_sign_up() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
    document.querySelector('.cont_form_sign_up').style.display = "block";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout(function(){  document.querySelector('.cont_form_sign_up').style.opacity = "1";
    },100);

    setTimeout(function(){   document.querySelector('.cont_form_login').style.display = "none";
    },400);
}

function eventFire(el, etype){
    if (el.fireEvent) {
         el.fireEvent('on' + etype);
    } else {
        let evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function check_email_length(value) {

    if (value.length === 0) {
        swal({
            type: 'error',
            title: 'Oops',
            text: 'You forgot to fill the email field ...',
        });
        return (false);
    } else if (value.length > 254 || value.length < 3) {
        swal({
            type: 'error',
            title: value + ' have a invalid length',
            text: 'The length of your email should be between 3 and 254',
        });
        return (false);
    }
    return (true);
}

function check_user_length(value) {

    if (value.length === 0) {
        swal({
            type: 'error',
            title: 'Oops',
            text: 'You forgot to fill the user field ...',
        });
        return (false);
    } else if (value.length > 50 || value.length < 2) {
        swal({
            type: 'error',
            title: value + ' have a invalid length',
            text: 'The length of your username should be between 2 and 50',
        });
        return (false);
    }
    return (true);
}

function check_password_length(value) {

    if (value.length === 0) {
        swal({
            type: 'error',
            title: 'Oops',
            text: 'You forgot to fill the password field ...',
        });
        return (false);
    } else if (value.length < 6 || value.length > 20) {
        swal({
            type: 'error',
            title: 'Your password have a invalid length',
            text: 'The length of your password should be between 6 and 20',
        });
        return (false);
    }
    return (true);
}

function check_email_pattern(value) {
    const emailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");

    if (!value.match(emailRegex)) {
        swal({
            type: 'error',
            title: value + ' is not a valid email',
            html: 'Please use a correct email syntax: <b>`exemple@domain.com`</b>',
        });
        return (false);
    }
    return (true);
}

function check_user_pattern(value) {
    const userRegex = new RegExp("^[0-9a-zA-Z-]+$");

    if (!value.match(userRegex)) {
        swal({
            type: 'error',
            title: value + ' is not a valid user',
            html: 'Please only use <b>letters</b>, <b>numbers</b> and <b>hyphen</b>',
        });
        return (false);
    }
    return (true);
}

function check_password_pattern(value) {
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (!value.match(passwordRegex)) {
        swal({
            type: 'error',
            title: 'Your password is not a valid',
            html: 'Your password must contain a <b>number</b>, a <b>capital</b> letter and a <b>minimal</b> letter',
        });
        return (false);
    }
    return (true);
}

function check_password_match(password1, password2) {
    if (password1 !== password2) {
        swal({
            type: 'error',
            title: 'Your passwords do not match',
        });
        return (false);
    } else if (password1.length === 0|| password2.length === 0) {
        swal({
            type: 'error',
            title: 'Your must set a password !',
        });
        return (false);
    } else {
        return (true);
    }
}

document.getElementById("sign_up_email").addEventListener("focusout", function (socket) {

    if (check_email_length(this.value) && check_email_pattern(this.value)) {
        // CHECK_EMAIL_VALIDITY ON DB with SOCKET.IO
        this.style.borderColor = null;
        this.style.borderStyle = null;
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("sign_up_user").addEventListener("focusout", function (socket) {

    if (check_user_length(this.value) && check_user_pattern(this.value)) {
        // CHECK_User_VALIDITY ON DB with SOCKET.IO
        this.style.borderColor = null;
        this.style.borderStyle = null;
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("sign_up_password").addEventListener("focusout", function () {

    if (check_password_length(this.value) && check_password_pattern(this.value)) {
        this.style.borderColor = null;
        this.style.borderStyle = null;
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("sign_up_confirm_password").addEventListener("focusout", function () {

    let password = document.getElementById("sign_up_password").value;

    if (check_password_match(this.value, password)) {
        this.style.borderColor = null;
        this.style.borderStyle = null;
    } else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("login_password").addEventListener("focusout", function () {

    if (check_password_length(this.value) && check_password_pattern(this.value)) {
        this.style.borderColor = null;
        this.style.borderStyle = null;
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("login_email").addEventListener("focusout", function (socket) {

    if (check_email_length(this.value) && check_email_pattern(this.value)) {
        // CHECK_EMAIL_VALIDITY ON DB with SOCKET.IO
        this.style.borderColor = null;
        this.style.borderStyle = null;
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});

document.getElementById("subscribeButton").addEventListener("click", function () {
    let email = document.getElementById("sign_up_email").value;
    let user = document.getElementById("sign_up_user").value;
    let password = document.getElementById("sign_up_password").value;
    let confirm_password = document.getElementById("sign_up_confirm_password").value;

    if (check_email_pattern(email) && check_email_length(email) &&
        check_user_pattern(user) && check_user_length(user) &&
        check_password_length(password) && check_password_length(password) &&
        check_password_match(password, confirm_password)) {

        socket.emit("subscribe", {
            email: email,
            user: user,
            password: password,
            confirm_password: confirm_password
        });
    } else {
        swal({
            type: 'error',
            title: 'You must fill each fields !',
        });
    }
});

document.getElementById("loginButton").addEventListener("click", function () {
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;

    if (check_email_pattern(email) && check_email_length(email) &&
        check_password_length(password) && check_password_length(password)) {

        socket.emit("login", {
            email: email,
            password: password,
        });
    } else {
        swal({
            type: 'error',
            title: 'You must fill each fields !',
        });
    }
});