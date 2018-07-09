'use strict'

var express=require('express');
var ImageController=require('../controllers/image');

var api=express.Router();

var multipart=require('connect-multiparty');


var multipartMiddleware=multipart({uploadDir: './uploads'});


api.get('/image/:id',ImageController.getImage);
api.get('/images',ImageController.getImages);
api.get('/getUserArgazkia/:id',ImageController.getUserArgazkia);
api.get('/userPortada/:id',ImageController.getUserPortada);
api.post('/image',ImageController.saveImage);
api.post('/upload-image/:id',multipartMiddleware,ImageController.uploadImage);
api.put('/image/:id',ImageController.updateImage);
api.delete('/image/:id',ImageController.deleteImage);
api.get('/get-image/:imageFile',multipartMiddleware,ImageController.getImageFile);
api.get('/getUserImage/:user',multipartMiddleware,ImageController.getUsersImageFile);
api.get('/getUimage/:user',multipartMiddleware,ImageController.getUImage);


module.exports=api;
