const socket = io.connect("http://localhost:8080");

function checkPasswordPattern(value) {
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (value.length === 0 || value.length < 6 ||
        value.length > 20 || !value.match(passwordRegex)) {
        return (false);
    } else {
        return (true);
    }
}

document.getElementById("reset_password").addEventListener("focusout", function () {

    if (checkPasswordPattern(this.value)) {
        this.style.borderColor = "green";
        this.style.borderStyle = "solid";
    }
    else {
        this.style.borderColor = "red";
        this.style.borderStyle = "inset";
    }
});


document.getElementById("resetButton").addEventListener("click", function () {
    let password = document.getElementById("reset_password").value;
    let token = window.location;

    if (checkPasswordPattern(password)) {
        socket.emit("reset", {
            token: token.pathname.replace("/reset/", ""),
            password: password,
        });
    } else if (!checkPasswordPattern(password)) {
        document.getElementById("reset_password").style.borderColor = "red";
        document.getElementById("reset_password").style.borderStyle = "inset";
        swal({
            type: "error",
            title: "Your password is not valid",
            html: "Your password must contain between <b>6</b> and <b>20 characters</b> with a <b>number</b>, a <b>capital</b> and <b>minimal</b> letter"
        });
    }
});

socket.on("ResetSuccess", function (token) {
    window.location.href = 'http://localhost:8080/login?success';
});

socket.on("ResetError", function (token) {
    window.location.href = 'http://localhost:8080/login?token';
});

socket.on("resetOK", function (data) {
    window.location.href = 'http://localhost:8080/login?email';
});