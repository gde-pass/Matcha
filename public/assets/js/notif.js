var el = document.querySelector('.notification');
var box = document.querySelector('.notif_box');


// document.querySelector('button').addEventListener('click', function(){
//     var count = Number(el.getAttribute('data-count')) || 0;
//     el.setAttribute('data-count', count + 1);
//     el.classList.remove('notify');
//     el.offsetWidth = el.offsetWidth;
//     el.classList.add('notify');
//     if(count === 0){
//         el.classList.add('show-count');
//     }
// }, false);



el.addEventListener('click', function(){
    box.classList.toggle('on')

});

// $(document).ready(function () {
//   $(".notificationicon").click(function () {
//     $(this).toggleClass("open");
//     $("#notificationMenu").toggleClass("open");
//   });
// });
socket.on('notification_box', function () {
    var count = Number(el.getAttribute('data-count')) || 0;
    el.setAttribute('data-count', count + 1);
    el.classList.remove('notify');
    el.offsetWidth = el.offsetWidth;
    el.classList.add('notify');
    if(count === 0){
        el.classList.add('show-count');
    }
}, false);
