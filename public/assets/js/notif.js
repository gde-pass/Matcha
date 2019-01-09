var el = document.querySelector('.notification');
var box = document.querySelector('.notif_box');

//--------------------- JAVASCRIPT EVENT/EMIT---------------------------------------------

el.addEventListener('click', function(){
    box.classList.toggle('on');
    socket.emit('read');
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
    console.log('COUNT :', count);
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
})
