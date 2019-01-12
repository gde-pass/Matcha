const socket = io.connect("http://localhost:8080");

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

document.getElementById("forgot_email").addEventListener("focusout", function () {

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

document.getElementById("forgotButton").addEventListener("click", function () {
    let email = document.getElementById("forgot_email").value;

    if (checkEmailPattern(email)) {
        socket.emit("forgot", {
            email: email,
        });
    } else if (!checkEmailPattern(email)) {
        swal({
            type: "error",
            title: "`" + email + "` is not a valid email",
            html: "Please use a correct email syntax: <b>`exemple@domain.com`</b>",
        });
    }
});

socket.on("forgotSend", function (token) {
    Cookies.set('token', token, {expires: 7});
    window.location.href = 'http://localhost:8080/login?reset';

});