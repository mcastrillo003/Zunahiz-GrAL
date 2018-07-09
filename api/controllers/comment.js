'use strict'

var path=require('path');
var comment=require('../models/comment');

function createComment(req,res){
  var com=new comment();
  var params=req.body;

  com.content=params.content;
  //com.publication=params.publication;
  com.user=params.user;

  com.save((err,comment)=>{
    if(err){
      res.status(500).send({message: 'Errorea iruzkina sortzerakoan'});
    }else{
      if(!comment){
          res.status(404).send({message: 'Ezin izan da iruzkina sortu'});
      }else{
        res.status(200).send({comment: comment});
      }
    }

  });
}

function deleteComment(req,res){
  var com=req.params.id;

  comment.findByIdAndRemove(com,(err,commentDeleted)=>{
    if(err){
      res.status(500).send({message: 'Errorea iruzkina ezabatzean'});
    }else{
      if(!commentDeleted){
        res.status(404).send({message: 'Ezin izan da iruzkina ezabatu'});
      }else{
        res.status(200).send({comment: commentDeleted});
        }
    }
  });

}


module.exports={
  createComment,
  deleteComment
}
