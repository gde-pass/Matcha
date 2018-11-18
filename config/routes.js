"use strict";

module.exports = function(app, fs) {

    app.get("/", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(fs.readFileSync("../app/public/views/index.html"));
        res.end();
    });
};
