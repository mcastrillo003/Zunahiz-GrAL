'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//crear la variable(de tipo JSON) que va a tener nuestro esquema. Egitura bat da (tipo struct stand)
//JSON denez,egitura barruko edukia {} joan behar da
var PublicationSchema=Schema({
  //_id atributua ere izango du, mongok berez sortzen duelako
  izenburua:String,
  iruzkinak:{type: [Schema.ObjectId],ref: 'Comment'},
  gustuko:{type: [Schema.ObjectId],ref: 'User'},
  file:{type: Schema.ObjectId,ref: 'File'},
  azalpena:String,
  urtea:String,
  hilabetea:String,
  eguna:String,
  data:String,
  noizkoUrtea:String,
  noizkoHilabetea:String,
  noizkoEguna:String,
  noizko:String,
  mota:String,//argitalpena,foro edo eginbeharra den desberdintzeko
  duty: {type: Schema.ObjectId,ref: 'Duty'},
  sortzailea: {type: Schema.ObjectId,ref: 'User'},
  semaforoak: {type: [Schema.ObjectId],ref: 'Semaphore'}

});

module.exports=mongoose.model('Publication',PublicationSchema);
