'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//crear la variable(de tipo JSON) que va a tener nuestro esquema. Egitura bat da (tipo struct stand)
//JSON denez,egitura barruko edukia {} joan behar da
var FileSchema=Schema({
  //_id atributua ere izango du, mongok berez sortzen duelako
  title: String,
  name: String,//fitxategi izena gordeko da hemen. Adb: irudia.png, aurkezpen.pdf
  //fitxategia eta parte den argitalpena elkarlotzeko
  publication: {type: Schema.ObjectId,ref:'Publication'}//argitalpenaren IDa pasatuko zaio(Schema.ObjectId bitartez)
});

module.exports=mongoose.model('File',FileSchema);
