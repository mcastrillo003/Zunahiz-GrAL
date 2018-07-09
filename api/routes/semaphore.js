'use strict'
var express=require('express');
var SemaphoreController=require('../controllers/semaphore');

var api=express.Router();

api.get('/semaphore/:id',SemaphoreController.getSemaphore);
api.get('/chatSemaphore',SemaphoreController.getChatSemaphore);
api.post('/semaphore',SemaphoreController.createPublicationSemaphore);
api.get('/createChatSemaphore',SemaphoreController.createChatSemaphore);
api.put('/semaphore/:id',SemaphoreController.updateSemaphore);



module.exports=api;
