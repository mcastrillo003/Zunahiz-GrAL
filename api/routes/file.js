'use strict'

var express=require('express');
var FileController=require('../controllers/file');

var api=express.Router();

var multipart=require('connect-multiparty');


var multipartMiddleware=multipart({uploadDir: './uploads'});


api.get('/file/:id',FileController.getFile);
api.get('/files',FileController.getFiles);
api.get('/userFile/:id',FileController.getUserFile);
api.get('/publiFile/:id',FileController.getPublicationsFile);
api.post('/file',FileController.saveFile);
api.post('/upload-file/:id',multipartMiddleware,FileController.uploadFile);
api.put('/file/:id',FileController.updateFile);
api.delete('/file/:id',FileController.deleteFile);
api.get('/get-file/:fileFile',multipartMiddleware,FileController.getfileFile);



module.exports=api;
