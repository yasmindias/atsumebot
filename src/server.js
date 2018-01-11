var dotenv = require('dotenv');
dotenv.config({path: '../.env'})
dotenv.load();

var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require(path.join(__dirname, 'config.js'));
var T = new Twit(config);


fs.readdir('images', function(err) {
    if (err){
        console.log(err);
    } else {
        var images = require(path.join(__dirname, 'images.js'));

        setInterval(function(){
            uploadImage(images);
        }, 360000);
    }
});

function uploadImage(images){
    var image = randomImage(images);
    var image_path = path.join('images/'+image.file);
    var b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    T.post('media/upload', { media_data: b64content }, function (err, data) {
        if (err){
            console.log('ERROR: ',err);
        } else {
            T.post('statuses/update', {
                    media_ids: new Array(data.media_id_string),
                    status: image.file.replace('.png', '')+" says 'miau'. "
                },
                function(err) {
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

function randomImage(images){
    return images[Math.floor(Math.random() * images.length)];
}
