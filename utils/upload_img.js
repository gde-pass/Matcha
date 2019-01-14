const multer = require('multer');
const path = require('path');
let jwtUtils = require("./jwt.utils");
const glob = require('glob');

function up_img(req,res,file) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.email < 0) {
        res.render('profil');
    } else if (data.type < 0 || data.type != "login") {
        res.render('profil');
    }
    else {
        function checkFileNb(file, callback) {
            glob(`*/assets/images/${data.Id}img*`, function (err, files) {
                if (files.length >= 5) {
                    callback('Error: To many images! 4 images max');
                }
            });
        }
        const storage = multer.diskStorage({
            destination: './public/assets/images/',
            filename: function (req, file, callback) {
                callback(null,data.Id + 'img' + "-" + Date.now() + path.extname(file.originalname))//todo faire en sorte que le nom de limage sois relier a 'ID de la personne pour que l'on puisse la retrouver
                // callback(null, data.username + data.Id + 'profil' +'-' + Date.now() + path.extname(file.originalname))//todo faire en sorte que le nom de limage sois relier a 'ID de la personne pour que l'on puisse la retrouver
            }
        });

        const upload = multer({
            storage: storage,
            limits: {fileSize: 1000000000},
            fileFilter: function (req, file, callback) {
                checkFileType(file, callback);
                checkFileNb(file, callback);
            }
        }).single('upload'); // on peut mettre "Array()" pour uploade plusieur image

        function checkFileType(file, callback) {
            const fileTypes = /jpeg|jpg|png/;
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);

            if (mimeType && extName) {
                return callback(null, true);
            } else {
                callback('Error: images Only!');
            }
        }

        upload(req, res, (err) => {
            if (err) {
                res.send(err); //todo trouver comment envoyer se message a l'HTML
            }
            else {
                if (req.file == undefined) {
                    // res.render('profil',{
                    //     msg: 'Error: No file selected'
                    // });
                    res.send('Error: No file selected'); //todo trouver comment envoyer se message a l'HTML
                } else {
                    res.redirect("profil");
                }
            }
        })
    }
}
module.exports = up_img;