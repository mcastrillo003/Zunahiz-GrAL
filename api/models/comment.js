'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var CommentSchema=Schema({
  //_id atributua ere izango du, mongok berez sortzen duelako
  content: String,
  //publication: {type: Schema.ObjectId,ref:'Publication'},
  user: {type: Schema.ObjectId,ref:'User'}
});

module.exports=mongoose.model('Comment',CommentSchema);
