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

document.getElementById("clickmoi").addEventListener("click", initSocket);
function initSocket() {
    const socket = io.connect('http://localhost:8080');

    document.getElementById("subscribeButton").addEventListener("click", subscribe);
}


function fill_array(NewUser) {
    NewUser.push(document.getElementById("sign_up_email").value);
    NewUser.push(document.getElementById("sign_up_user").value);
    NewUser.push(document.getElementById("sign_up_password").value);
    NewUser.push(document.getElementById("sign_up_confirm_password").value);

    return (NewUser);
}

function check_patterns(NewUser) {
    const emailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
    const userRegex = new RegExp("^[0-9a-zA-Z'-]+$");
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (!NewUser[0].match(emailRegex)) {
        swal({
            type: 'error',
            title: NewUser[0] + ' is not a valid email',
            text: 'Please use a correct email syntax `exemple@domain.com`',
        });
        return (false);
    } else if (!NewUser[1].match(userRegex)) {
        swal({
            type: 'error',
            title: NewUser[1] + ' is not a valid user',
            text: 'Please use a valid user syntax',
        });
        return (false);
    } else if (!NewUser[2].match(passwordRegex)) {
        swal({
            type: 'error',
            title: 'Invalid password !',
            html: 'Your password must contain a <b>special character</b>, a <b>number</b>, a <b>capital</b> letter and a <b>minimal</b> letter',

        });
        return (false);
    } else if (!NewUser[2].match(passwordRegex)) {
        swal({
            type: 'error',
            title: 'Invalid password !',
            html: 'Your password must contain a <b>special character</b>, a <b>number</b>, a <b>capital</b> letter and a <b>minimal</b> letter',
        });
        return (false);
    }
    return (true);
}

function check_lenght(NewUser) {
    if (NewUser[0].length > 254 || NewUser[0].length < 3) {
        if (NewUser[0].length === 0) {
            swal({
                type: 'error',
                title: 'Oops',
                text: 'You forgot to fill the email field ...',
            });
            return (false);
        }
        swal({
            type: 'error',
            title: NewUser[0] + ' have a invalid lenght',
            text: 'The lenght of your email should be between 3 and 254',
        });
        return (false);
    } else if (NewUser[1].length > 30 || NewUser[1].length < 2) {
        if (NewUser[1].length === 0) {
            swal({
                type: 'error',
                title: 'Oops',
                text: 'You forgot to fill the user field ...',
            });
            return (false);
        }
        swal({
            type: 'error',
            title: NewUser[1] + ' have a invalid lenght',
            text: 'The lenght of your username should be between 2 and 30',
        });
        return (false);
    } else if (NewUser[2].length > 20 || NewUser[2].length < 6) {
        if (NewUser[2].length === 0) {
            swal({
                type: 'error',
                title: 'Oops',
                text: 'You forgot to fill the password field ...',
            });
            return (false);
        }
        swal({
            type: 'error',
            title: 'Your password have a invalid lenght',
            text: 'The lenght of your password should be between 6 and 20',
        });
        return (false);
    } else if (NewUser[3].length > 20 || NewUser[3].length < 6) {
        if (NewUser[3].length === 0) {
            swal({
                type: 'error',
                title: 'Oops',
                text: 'You forgot to fill the confirm password field ...',
            });
            return (false);
        }
        swal({
            type: 'error',
            title: 'Your confirm password have a invalid lenght',
            text: 'The lenght of your password should be between 6 and 20',
        });
        return (false);
    }
    return (true);
}

function subscribe() {
    let NewUser = [];
    NewUser = fill_array(NewUser);
    if (check_lenght(NewUser)) {
        check_patterns(NewUser);
    }

}