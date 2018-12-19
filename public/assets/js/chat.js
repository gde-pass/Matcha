//Make connection
let socket = io.connect("http://localhost:8080");

//Query DOM
var message = document.getElementById('message'),
  	btn = document.getElementById('send'),
  	output = document.getElementById('output'),
  	feedback = document.getElementById('feedback'),
    img = document.getElementById('profilimg').src,
    Userto = document.getElementById('Userto'),
    contact2 = document.getElementsByClassName('contact');
    contact = document.getElementsByClassName('meta');
    // console.log(document.getElementsByClassName('meta')[0]);
//emit EVENTS

// for(var i=0;i<contact.length;i++){
//     contact[i].addEventListener('click', function (contact) {
//         console.log(contact);
//         // console.log(contact.getElementsByClassName('name'));
//         // contact.srcElement('p.preview').innerText.nextElementSibling.innerText = "New New !";
//
//      document.getElementById("Userto").innerText = contact.srcElement.innerText.trim();
//      socket.emit('getmessage', contact.srcElement.innerText.trim());
//     });
// };


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
    // output.innerHTML += '<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>' + data.message + '</p></li>';
});

socket.on('chat_rep', function (data) {
	feedback.innerHTML = "";
	// output.innerHTML += '<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + data.message + '</p></li>';
    output.innerHTML += '<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>' + data.message + '</p></li>';
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
});

socket.on('typing', function (data) {
	feedback.innerHTML = data;
  $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 500);
});
