"use strict";

module.exports = function(io)
{
    io.on('connection', function (socket)
    {
       socket.on('subscribe', function (NewUser) {
         console.log(NewUser);
       })
    });
};