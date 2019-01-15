var el = document.querySelector('.notification'),
    box = document.querySelector('.notif_box'),
    // match_success = document.querySelector('.alert'),
    output_notif = document.getElementById('output_notif');


//--------------------- JAVASCRIPT EVENT/EMIT---------------------------------------------

el.addEventListener('click', function(){
    box.classList.toggle('on');
    socket.emit('read');
    socket.emit('getnotif');
});

// ---------------SOCKET EVENT------------------------------

// ------------ EMIT---------------

socket.emit('unread');

// -------------- ON --------------------

socket.on('notification_box', function () {
    let count = Number(el.getAttribute('data-count')) || 0;
    el.setAttribute('data-count', count + 1);
    el.classList.remove('notify');
    el.offsetWidth = el.offsetWidth;
    el.classList.add('notify');
    // console.log('COUNT :', count);
    if(count === 0){
        el.classList.add('show-count');
    }
}, false);

socket.on('getunread', function (data) {
    if(data > 0){
        el.setAttribute('data-count', data);
        el.classList.remove('notify');
        el.offsetWidth = el.offsetWidth;
        el.classList.add('notify');
        el.classList.add('show-count');
    }
});

socket.on('read', function () {
    el.setAttribute('data-count', 0);
    el.classList.remove('show-count');
});

socket.on('getnotif',function (data) {
    // console.log('notif data', data);
    output_notif.innerHTML = "<li class='inside title'>NOTIFICATIONS</li>";
    for(var i=0;i<data.length;i++){
        if(data[i].type == 1){
            output_notif.innerHTML += '<li class="inside"><a class="font_not" href="./single?' + data[i].from_username + '">' + data[i].from_username + '</a> a liké votre profile <p class="dateformat">(' + data[i].date + ')</p></li>';
        }else if (data[i].type == 2) {
            output_notif.innerHTML += '<li class="inside">' + data[i].from_username + ' vous a envoyé un <a class="font_not" href="./chat?' + data[i].from_username + '">message</a> <p class="dateformat">(' + data[i].date + ')</p></li>';
        }else if (data[i].type == 3) {
            output_notif.innerHTML += '<li class="inside"> Vous avez match avec <a class="font_not" href="./single?' + data[i].from_username + '">' + data[i].from_username + '</a> <p class="dateformat">(' + data[i].date + ')</p></li>';
        }else if (data[i].type == 4) {
            output_notif.innerHTML += '<li class="inside"><a class="font_not" href="./single?' + data[i].from_username + '">' + data[i].from_username + '</a> ne vous like plus , donc fin du game ! NEXT ! <p class="dateformat">(' + data[i].date + ')</p></li>';
        }else if (data[i].type == 5) {
            output_notif.innerHTML += '<li class="inside"><a class="font_not" href="./single?' + data[i].from_username + '">' + data[i].from_username + '</a> a visité votre profile <p class="dateformat">(' + data[i].date + ')</p></li>';
        }
    }
});
