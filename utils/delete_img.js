const fs = require("fs");


function delete_img(req, res) {

    fs.unlinkSync(`./public${req.body.img_to_del}`);
    res.redirect("profil")

}

module.exports = delete_img;