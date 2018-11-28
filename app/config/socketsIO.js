"use strict";

module.exports = function(io)
{
    io.on('connection', function (socket)
    {
       socket.on('subscribe', function (data) {
            console.log(data);
       });

       socket.on('login', function (data) {
           console.log(data);
        });
    });
};