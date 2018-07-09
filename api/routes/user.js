'use strict'

var express=require('express');
var UserController=require('../controllers/user');

var api=express.Router();

api.get('/user/:id',UserController.getUser);
api.get('/users',UserController.getUsers);
api.get('/admin',UserController.getAdmin);
api.get('/usersByName/:sartutakoa',UserController.getByIzena);
api.get('/userexists/:username',UserController.existsUser);
api.post('/user',UserController.saveUser);
api.put('/user/:id',UserController.updateUser);
api.delete('/user/:id',UserController.deleteUser);
module.exports=api;
