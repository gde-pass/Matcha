//Make connection
let socket = io.connect("http://localhost:8080");

//Query DOM
var message = document.getElementById('message'),
  	btn = document.getElementById('send'),
  	output = document.getElementById('output'),
  	feedback = document.getElementById('feedback'),
    // img = document.getElementById('profilimg').src,
    Userto = document.getElementById('Userto'),
    contact2 = document.getElementsByClassName('contact'),
    contact = document.getElementsByClassName('meta'),
    el = document.querySelector('.notification');

    // console.log(document.getElementsByClassName('meta')[0]);
//emit EVENTS

for(var i= 0; i < contact.length; i++){
    let index = i;
    contact[i].addEventListener('click', function(){

      // console.log('test', contact[index].getElementsByClassName('preview')[0].innerText);
      document.getElementById("Userto").innerText = contact[index].getElementsByClassName('name')[0].innerText;
      socket.emit('getmessage', contact[index].getElementsByClassName('name')[0].innerText.trim());
      contact[index].getElementsByClassName('preview')[0].innerText = '';
        for(var y= 0; y < contact2.length; y++){
          contact2[y].classList.remove('active');
        }
        contact2[index].classList.add('active')
    });
};
if (Userto.innerText != undefined){
    socket.emit('getmessage', Userto.innerText);
}

btn.addEventListener('click', function () {
    var url = window.location.href;
    var lastPart = url.split("?").pop();
    //console.log("click");
    if (message.value) {
        socket.emit('chat', {
        	message: message.value,
            to: Userto.innerHTML,
            // img: img
        });
        socket.emit('create_notif', {
            user: lastPart,
            type: 2
        });
    }
});



//listen for events

socket.on('getmessage', function (data) {
    output.innerHTML = "";

    for(var i=0;i<data.message.length;i++){
        if (data.message[i].from_user_id == data.from_user_id) {
            output.innerHTML += '<li class="sent"><img src="" alt="" /><p class="answer">' + data.message[i].message + '</p></li>';
        }else {
            output.innerHTML += '<li class="replies"><img src="" alt="" /><p class="answer">' + data.message[i].message + '</p></li>';
        }
    }
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, "fast");
})

socket.on('notifnew', function (data) {
      for(var i= 0;i < contact.length; i++){
        if (contact[i].getElementsByClassName('name')[0].innerText.trim() == data){
           contact[i].getElementsByClassName('preview')[0].innerText = 'Nouveaux messages !';
         }
      }
});

socket.on('chat', function (data) {
    feedback.innerHTML = "";
	output.innerHTML += '<li class="sent"><img src="' + data.img + '" alt="" /><p>' + data.message + '</p></li>';
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
    $('.message-input input').val(null);
});

socket.on('chat_rep', function (data) {
	feedback.innerHTML = "";
    output.innerHTML += '<li class="replies"><img src="" alt="" /><p>' + data.message + '</p></li>';
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
});

socket.on('chatnomatch', function (data) {
    feedback.innerHTML = "";
	output.innerHTML += '<li class="sent nomatch"><img src="' + data.img + '" alt="" /><p>Vous ne matché pas avec cette personne</p></li>';
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
    $('.message-input input').val(null);
});

socket.on('chatblock', function (data) {
    feedback.innerHTML = "";
	output.innerHTML += '<li class="sent nomatch"><img src="' + data.img + '" alt="" /><p>Cette personne vous a bloqué !</p></li>';
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
    $('.message-input input').val(null);
});
