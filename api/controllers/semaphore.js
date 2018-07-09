'use strict'

var path=require('path');
var Semaphore=require('../models/semaphore');

function getSemaphore(req,res){
  var id=req.params.id;

  Semaphore.findById(id,(err,semaphore)=>{
    if(err){
      res.status(500).send({message: 'Errorea sefamoroa eskuratzean'});
    }else{
      if(!semaphore){
        res.status(404).send({message: 'Ez da semaforo hori existitzen'});
      }else{
        res.status(200).send({semaphore});
      }
    }
  });
}

function getChatSemaphore(req,res){
  var whose="chat";

  Semaphore.find({'whose':whose},(err,semaphore)=>{
    if(err){
      res.status(500).send({message: 'Errorea sefamoroa eskuratzean'});
    }else{
      if(!semaphore || semaphore==false){
        res.status(404).send({message: 'Ez da semaforo hori existitzen'});
      }else{
        console.log("chatSempahore lortzen da apian, whose: "+semaphore)
        res.status(200).send({semaphore});
      }
    }
  });
}

function createChatSemaphore(req,res){
  var semaphore=new Semaphore();

  semaphore.image="semaforoGrisa.png";
  semaphore.whose="chat";

  semaphore.save((err,semaphore)=>{
    if(err){
      res.status(500).send({message: 'Errorea chat-semaforoa sortzerakoan'});
    }else{
      if(!semaphore){
          res.status(404).send({message: 'Ezin izan da chat-semaoforoa sortu'});
      }else{
        console.log("ondo sortzen da chatSemaphore apian")
        res.status(200).send({semaphore: semaphore});
      }
    }

  });
}


function createPublicationSemaphore(req,res){
  var semaphore=new Semaphore();

  semaphore.image="semaforoGrisa.png";
  semaphore.whose="publication";

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

function updateSemaphore(req,res){
  var id=req.params.id;
  var update=req.body;
console.log("datorren semaforo image: "+update.image)
  Semaphore.findByIdAndUpdate(id,update,(err,semUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!semUpdated){
        res.status(404).send({message: 'Ezin izan da argitalpena eguneratu'});
      }else{
        console.log("bidaltzen den semaforo image: "+semUpdated.image)
        res.status(200).send({semaphore: semUpdated});
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
  getSemaphore,
  createPublicationSemaphore,
  updateSemaphore,
  deleteComment,
  createChatSemaphore,
  getChatSemaphore
}
