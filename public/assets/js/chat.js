//Make connection
let socket = io.connect("http://localhost:8080");

//Query DOM
var message = document.getElementById('message'),
  	btn = document.getElementById('send'),
  	output = document.getElementById('output'),
  	feedback = document.getElementById('feedback'),
    img = document.getElementById('profilimg').src,
    Userto = document.getElementById('Userto'),
    contact = document.getElementsByClassName('contact');
    // console.log(contact);
//emit EVENTS

for(var i=0;i<contact.length;i++){
    contact[i].addEventListener('click', function (contact) {
        console.log(contact);
     document.getElementById("Userto").innerText = contact.srcElement.innerText.trim();
     socket.emit('getmessage', contact.srcElement.innerText.trim());
    });
};

btn.addEventListener('click', function () {
    console.log("click");
	socket.emit('chat', {
		message: message.value,
        to: Userto.innerHTML,
        img: img
	});
});

message.addEventListener('keypress', function () {
    console.log("typing");
    feedback.value = '<p><em>she/he\'s typing a message...</em></p>';
	socket.emit('typing', feedback.value);
})

//listen for events

socket.on('getmessage', function (data) {
    for(var i=0;i<data.message.length;i++){
        if (data.message[i].from_user_id == data.from_user_id) {
            output.innerHTML += '<li class="sent"><img src="" alt="" /><p>' + data.message[i].message + '</p></li>';
        }else {
            output.innerHTML += '<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>' + data.message[i].message + '</p></li>';
        }
    }

})
socket.on('chat', function (data) {
	feedback.innerHTML = "";
	output.innerHTML += '<li class="sent"><img src="' + data.img + '" alt="" /><p>' + data.message + '</p></li>';
    // output.innerHTML += '<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>' + data.message + '</p></li>';
});
socket.on('chat_rep', function (data) {
	feedback.innerHTML = "";
	// output.innerHTML += '<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + data.message + '</p></li>';
    output.innerHTML += '<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>' + data.message + '</p></li>';
});

socket.on('typing', function (data) {
	feedback.innerHTML = data;
});
