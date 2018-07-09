'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var SemaphoreSchema=Schema({
  image: String,
  whose: String ,//argitalpenena edo iruzkinena
  description: String
});

module.exports=mongoose.model('Semaphore',SemaphoreSchema);
