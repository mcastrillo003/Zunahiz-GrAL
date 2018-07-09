'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var DutySchema=Schema({
  izenburua: String,
  file:{type: Schema.ObjectId,ref: 'File'},
  azalpena: String,
  urtea:String,
  hilabetea:String,
  eguna:String,
  data:String,
  noizkoUrtea:String,
  noizkoHilabetea:String,
  noizkoEguna:String,
  noizko:String,
  sortzailea: {type: Schema.ObjectId,ref: 'User'},
  semaforoak: {type: [Schema.ObjectId],ref: 'Semaphore'}
});

module.exports=mongoose.model('Duty',DutySchema);
