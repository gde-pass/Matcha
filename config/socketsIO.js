"use strict";

module.exports = function(io)
{
    io.sockets.on('connection', function (socket)
    {
        console.log("ZIZI");
    });
};