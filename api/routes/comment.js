'use strict'
var express=require('express');
var CommentController=require('../controllers/comment');

var api=express.Router();

api.post('/comment',CommentController.createComment);
api.delete('/comment/:id',CommentController.deleteComment);

module.exports=api;
