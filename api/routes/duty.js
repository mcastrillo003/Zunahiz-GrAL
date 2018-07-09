'use strict'
var express=require('express');
var DutyController=require('../controllers/duty');

var api=express.Router();

api.get('/eginbeharra/:id',DutyController.getEginbeharra);
api.get('/eginbeharrak',DutyController.getEginbeharrak);
api.get('/getEginbeharraWithoutFileData/:id',DutyController.getEginbeharraWithFileData);
api.get('/getEginbeharrakByMonth/:urtea&:hilabetea',DutyController.getEginbeharrakByMonth);
api.post('/eginbeharra/:id',DutyController.createEginbeharra);
api.put('/eginbeharra/:id',DutyController.updateEginbeharra);
api.delete('/eginbeharra/:id',DutyController.deleteEginbeharra);



module.exports=api;
