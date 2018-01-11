var dotenv = require('dotenv');
dotenv.config({path: '../.env'})
dotenv.load();

var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

function randomImage(images){
    return images[Math.floor(Math.random() * images.length)];
}

function uploadImage(images){
    var image = randomImage(images);
    var image_path = path.join('../images/'+image.file),
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err){
            console.log('ERROR: ',err);
        } else {
            T.post('statuses/update', {
                    media_ids: new Array(data.media_id_string),
                    status: image.file.replace('.png', '')+" says 'miau'. "
                },
                function(err, data, response) {
                    if (err){
                        console.log('ERROR: ',err);
                    } else {
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
}

fs.readdir('../images', function(err, files) {
    if (err){
        console.log(err);
    } else {
        var images = require(path.join(__dirname, 'images.js'));

        setInterval(function(){
            uploadImage(images);
        }, 5000);
    }
});