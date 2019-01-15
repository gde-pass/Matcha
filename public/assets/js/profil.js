const socket = io.connect("http://localhost:8080");

// ============ FRONT EVENTS ===========

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}


function updateTextDistance(val) {
    document.getElementById('distanceText').innerHTML = "Distance: " + val + " (Km)";
}

function updateTextAge(val) {
    document.getElementById('ageText').innerHTML = "Age: " + val;
}

function updateTextAgeRangeMin(val) {
    document.getElementById('ageTextRangeMin').innerHTML = "Age Range Minimal: " + val;
    document.getElementById('ageRangeMax').min = val;
}

function updateTextAgeRangeMax(val) {
    document.getElementById('ageTextRangeMax').innerHTML = "Age Range Maximal: " + val;
    document.getElementById('ageRangeMin').max = val;
}

function updateTextLongitude(val) {
    document.getElementById('longitudeText').innerHTML = "Longitude: " + val;
}

function updateTextLatitude(val) {
    document.getElementById('latitudeText').innerHTML = "Latitude: " + val;
}
// ============ /FRONT EVENTS ===========

// ============ CHECK FUNCTIONS ===========



/**
 * @return {boolean}
 */
function checkLatitude(value) {

    if (value < -90 || value > 90 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkLongitude(value) {

    if (value < -180 || value > 180 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}

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

    if (value.length < 50 || value.length > 500) {
        return (false);
    } else {
        return (true);
    }
}


/**
 * @return {boolean}
 */
function checkGenderPattern(value) {
    const genderRegex = new RegExp("^(Female|Male)$");

    if (!value.match(genderRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkSexOrientationPattern(value) {
    const sexOrientationRegex = new RegExp("^(Homosexual|Heterosexual|Bisexual)$");

    if (!value.match(sexOrientationRegex)) {
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

// ============ SIGN UP EVENTS ===========

document.getElementById("first_name").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkName(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkName(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }

});

document.getElementById("last_name").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkName(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkName(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }

});

document.getElementById("email").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkEmailPattern(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
        socket.emit("focusOutEmailSignUp", this.value);
    } else if (this.value.length !== 0 && checkEmailPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
        socket.emit("focusOutEmailSignUp", this.value);
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }

});

document.getElementById("username").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkUserPattern(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
        socket.emit("focusOutUsernameSignUp", this.value);
    } else if (this.value.length !== 0 && checkUserPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
        socket.emit("focusOutUsernameSignUp", this.value);
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }
});

document.getElementById("bio").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkBioPattern(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkBioPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }
});

document.getElementById("tags").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkTagsPattern(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkTagsPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }
});

document.getElementById("password").addEventListener("focusout", function () {

    if (this.value.length !== 0 && !checkPasswordPattern(this.value)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkPasswordPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }
});

document.getElementById("password2").addEventListener("focusout", function () {

    let password = document.getElementById("password").value;

    if (this.value.length !== 0 && !checkPasswordMatch(this.value, password)) {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    } else if (this.value.length !== 0 && checkPasswordMatch(this.value, password)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    } else {
        this.style.borderColor = "#ccc";
        this.style.borderStyle = "solid";
    }
});

// ============ /SIGN UP EVENTS ===========



// ============ SOCKET EVENTS =============
socket.emit("getCookie", Cookies.get("token"));


document.getElementById("save").addEventListener("click", function () {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let username = document.getElementById("username").value;
    let gender = document.getElementById("gender").value;
    let orientation = document.getElementById("orientation").value;
    let age = document.getElementById("age").value;
    let email = document.getElementById("email").value;
    let tags = document.getElementById("tags").value;
    let distance = document.getElementById("distance").value;
    let bio = document.getElementById("bio").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let ageRangeMin = document.getElementById("ageRangeMin").value;
    let ageRangeMax = document.getElementById("ageRangeMax").value;
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;

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
    } else if (gender.length !== 0 && !checkGenderPattern(gender)) {
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
        document.getElementById("tags").style.borderColor = "red";
        document.getElementById("tags").style.borderStyle = "inset";
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
    } else if (password.length !== 0 && !checkPasswordPattern(password)) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("password").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your password is not valid",
            html: "Your password must contain between <b>6</b> and <b>20 characters</b> with a <b>number</b>, a <b>capital</b> and <b>minimal</b> letter"
        });
    } else if (password2.length !== 0 && !checkPasswordMatch(password, password2)) {
        document.getElementById("password2").style.borderColor = "red";
        document.getElementById("password2").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your passwords do not match !"
        });
    } else if (!checkAgePattern(ageRangeMin)) {
        swal({
            type: "error",
            title: "Your age-range-minimal field have to be between 18 and 100 !"
        });

    } else if (!checkAgePattern(ageRangeMax)) {
        swal({
            type: "error",
            title: "Your age-range-maximal field have to be between 18 and 100 !"
        });

    } else if (ageRangeMin < ageRangeMin) {
        swal({
            type: "warning",
            title: "Your minimal range field have a bigger value than the maximal range field ... are you dumb ? "
        });

    } else if (!checkLatitude(latitude)) {
        swal({
            type: "error",
            title: "Your latitude field have strange value ... "
        });

    } else if (!checkLongitude(longitude)) {
        swal({
            type: "error",
            title: "Your longitude field have strange value ... "
        });

    } else {
        socket.emit("parametre", {
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            gender: gender,
            orientation: orientation,
            age: age,
            tags: tags,
            distance: distance,
            bio: bio,
            password: password,
            password2: password2,
            ageRangeMin: ageRangeMin,
            ageRangeMax: ageRangeMax,
            latitude: latitude,
            longitude: longitude,
            cookie: Cookies.get("token"),
        });
        Cookies.remove("token");
    }
});

socket.on("focusOutEmailSignUpFalse", function (email) {
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("email").style.borderStyle = "inset";

    swal({
        type: "error",
        title: "Email already existed",
        text: email + " is already taken !"
    });

});

socket.on("focusOutUsernameSignUpFalse", function (username) {
    document.getElementById("username").style.borderColor = "red";
    document.getElementById("username").style.borderStyle = "inset";

    swal({
        type: "error",
        title: "Username already existed",
        text: username + " is already taken !"
    });

});

socket.on("settingsUpdateTrue", function () {
    swal({
        type: "success",
        title: "Well done !",
        text: "Your settings have been successfully updated !"
    });

    window.location.href = "http://localhost:8080/login?updated";
});

socket.on("settingsUpdateFalse", function () {
    swal({
        type: "error",
        title: "Oops ...",
        text: "A error occurred !"
    });
});

// ============ /SOCKET EVENTS =============
