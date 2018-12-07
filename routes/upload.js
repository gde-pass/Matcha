const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

    const storage = multer.diskStorage({
        destination: './public/assets/img/',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))//todo faire en sorte que le nom de limage sois relier a 'ID de la personne pour que l'on puisse la retrouver
        }
    });

    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
        fileFilter: function (req, file, callback) {
            checkFileType(file, callback);
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

router.post("/", function (req, res) {
    upload(req, res, (err) => {
        if(err){
         res.render('profil',{
             msg: err
         });
        }
        else{
            if(req.file == undefined){
                // res.render('profil',{
                //     msg: 'Error: No file selected'
                // });
                res.end('Error: No file selected'); //todo trouver comment envoyer se message a l'HTML
            }else{
                // res.render('profil',{
                //     msg: 'File Uploaded',
                //     file: `assets/img/${req.file.filename}`,
                //
                // });
                console.log('oui');
                res.end("success");
            }
        }
    })

});
module.exports = router;