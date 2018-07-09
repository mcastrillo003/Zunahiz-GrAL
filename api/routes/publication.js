'use strict'
var express=require('express');
var PubliController=require('../controllers/publication');

var api=express.Router();

api.get('/publication/:id',PubliController.getPublication);
api.get('/publicationsOfDuty/:id',PubliController.getPublicationsOfDuty);
api.get('/argitalpenak',PubliController.getArgitalpenak);
api.get('/foroak',PubliController.getForoak);
api.get('/comments/:id',PubliController.getPublicationsComments);
api.get('/publiforo',PubliController.getPubliForo);
api.get('/usersArgitalpenak/:user',PubliController.getUsersArgitalpenak);
api.get('/usersArgitalpenak2/:user',PubliController.getUsersArgitalpenak2);
api.post('/argitalpena/:id',PubliController.createArgitalpena);
api.post('/foroa/:id',PubliController.createForoa);
api.put('/argitalpena/:id',PubliController.updateArgitalpena);
api.put('/foroa/:id',PubliController.updateForoa);
api.put('/gustukoDut/:id',PubliController.addGustukoDut);
api.put('/addComment/:id',PubliController.addComment);
api.put('/addFile/:id',PubliController.addFileToPublication);
api.delete('/gustukoDut/:id&:user',PubliController.deleteGustukoDut);
api.delete('/publication/:id',PubliController.deletePublication);




module.exports=api;
