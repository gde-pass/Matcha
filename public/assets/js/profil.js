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
function checkAgePattern(value) {

    if (value < 18 || value > 100 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkDistancePattern(value) {

    if (value < 5 || value > 50 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkTagsPattern(value) {
    const tagsRegex = new RegExp("^(#+[a-zA-Z]{2,20}\\s?){1,10}");

    if (!value.match(tagsRegex)) {
        return (false);
    } else {
        return (true);
    }

}

/**
 * @return {boolean}
 */
function checkBioPattern(value) {
    //const bioRegex = new RegExp("");

    if (value.length < 50 || value.length > 500) {
        return (false);
    } else {
        return (true);
    }
}


/**
 * @return {boolean}
 */
function checkSexPattern(value) {
    const sexRegex = new RegExp("^([OFM])$");

    if (value.length !== 1 || !value.match(sexRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkSexOrientationPattern(value) {
    const sexOrientationRegex = new RegExp("^(Ho|He|Bi)$");

    if (value.length !== 2 || !value.match(sexOrientationRegex)) {
        return (false);
    } else {
        return (true);
    }
}

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
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let username = document.getElementById("username").value;
    let sex = document.getElementById("sex").value;
    let orientation = document.getElementById("orientation").value;
    let age = document.getElementById("age").value;
    let email = document.getElementById("email").value;
    let tags = document.getElementById("tags").value;
    let distance = document.getElementById("distance").value;
    let bio = document.getElementById("bio").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;

    if (first_name.length !== 0 && !checkName(first_name)) {
        document.getElementById("first_name").style.borderColor = "red";
        document.getElementById("first_name").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + first_name + "` is not a valid first name",
            html: "Please use a correct first name syntax: only <b>alphabetic characters</b> with the first one <b>uppercase</b>",
        });
    } else if (last_name.length !== 0 && !checkName(last_name)) {
        document.getElementById("last_name").style.borderColor = "red";
        document.getElementById("last_name").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + last_name + "` is not a valid last name",
            html: "Please use a correct last name syntax: only <b>alphabetic characters</b> with the first one <b>uppercase</b>",
        });
    } else if (username.length !== 0 && !checkUserPattern(username)) {
        document.getElementById("username").style.borderColor = "red";
        document.getElementById("username").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + username + "` is not a valid username",
            html: "Your username must contain between <b>2</b> and <b>15</b> characters with <b>alphabet</b> and <b>numbers</b> only."
        });
    } else if (email.length !== 0 && !checkEmailPattern(email)) {
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("email").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "`" + email + "` is not a valid email",
            html: "Please use a correct email syntax: <b>`exemple@domain.com`</b>",
        });
    } else if (orientation.length !== 0 && !checkSexOrientationPattern(orientation)) {
        swal({
            type: "error",
            title: "WTF ?",
            html: "Don't try to glitch bro",
        });
    } else if (sex.length !== 0 && !checkSexPattern(sex)) {
        swal({
            type: "error",
            title: "WTF ?",
            html: "Don't try to glitch bro",
        });
    } else if (bio.length !== 0 && !checkBioPattern(bio)) {
        document.getElementById("bio").style.borderColor = "red";
        document.getElementById("bio").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Invalid bio",
            html: "Your bio must contain between <b>50</b> and <b>500</b> characters."
        });
    } else if (tags.length !== 0 && !checkTagsPattern(tags)) {
        document.getElementById("bio").style.borderColor = "red";
        document.getElementById("bio").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Invalid tags",
            html: "Your tags must begin by a <b>'#'</b> they have to contain between <b>2</b> and <b>20</b> characters only and must be separate by a <b>space</b>."
        });
    } else if (!checkDistancePattern(distance)) {
        swal({
            type: "error",
            title: "Invalid distance",
            html: "Your tags must be between <b>5</b> and <b>50</b> Km."
        });
    } else if (!checkAgePattern(age)) {
        swal({
            type: "error",
            title: "Invalid age",
            html: "Your age must be between <b>18</b> and <b>100</b> years old."
        });
    } else if (!checkPasswordPattern(password)) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("password").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your password is not valid",
            html: "Your password must contain between <b>6</b> and <b>20 characters</b> with a <b>number</b>, a <b>capital</b> and <b>minimal</b> letter"
        });
    } else if (!checkPasswordMatch(password, password2)) {
        document.getElementById("password2").style.borderColor = "red";
        document.getElementById("password2").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your passwords do not match !"
        });
    } else {
        socket.emit("parametre", {
            first_name: first_name,
            last_name: last_name,
            email: email,
            sex: sex,
            orientation: orientation,
            age: age,
            tags: tags,
            distance: distance,
            bio: bio,
            password: password,
            password2: password2,
        });
    }
});
// ============ /SOCKET EVENTS =============