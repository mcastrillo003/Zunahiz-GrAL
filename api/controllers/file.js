'use strict'

var path=require('path');
var file=require('../models/file');

function getFile(req,res){
  var fileId=req.params.id;

  file.findById(fileId,(err,file)=>{
    if(err){
      res.status(500).send({message: 'Errorea fitxategia lortzean'});
    }else{
      if(!file || file==false){
        res.status(404).send({message: 'Fitxategi hori ez da existitzen'});
      }else{
            res.status(200).send({file});
      }
    }
  });
}

function getPublicationsFile(req,res){
  var publiId=req.params.id;

  file.find({'publication':publiId},(err,file)=>{
    if(err){
      res.status(500).send({message: 'Errorea fitxategia lortzean'});
    }else{
      if(!file || file==false){
        res.status(404).send({message: 'Fitxategi hori ez da existitzen'});
      }else{
            console.log("bidalitako File: "+file)
            res.status(200).send({file});
      }
    }
  });
}

function getFiles(req,res){

  file.find({},(err,files)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!files || files==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({files});
      }
    }
  });
}

function getUserFile(req,res){
  var id=req.params.id;

  file.find({'user':id},(err,file)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!file || file==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({file});
      }
    }
  });
}

function getPublicationsFile(req,res){
  var id=req.params.id;

  file.find({'publication':id},(err,file)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!file || file==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({file});
      }
    }
  });
}


function saveFile(req,res){
  var fileId=req.params.id;
  var params=req.body;

  var file=new file();
  file.name=null;
  file.user=params.user;

  file.save(fileId,(err,fileStored)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia gordetzean'});
    }else{
      if(!fileStored){
        res.status(404).send({message: 'Ez da irudia gorde'});
      }else{
        res.status(200).send({file: fileStored});  }
    }

  });

}
function uploadFile(req,res){
  var fileId=req.params.id;
  var file_name='Ez da igo...';
  if(req.files){

    var file_path=req.files.file.path;
    var file_split=file_path.split('\\');
    var file_name=file_split[1];

    file.findByIdAndUpdate(fileId,{name: file_name},(err,fileUpdated)=>{
      if(err){
        res.status(500).send({message: 'Errorea irudia igotzean'});
      }else{
        if(!fileUpdated){
          res.status(404).send({message: 'Ez da irudia eguneratu'});
        }else{
          res.status(200).send({file: fileUpdated});
        }
      }
    });

  }else{
    res.status(200).send({message: 'Ez da irudia igo'});
  }

}

function updateFile(req,res){
  var fileId=req.params.id;
  var update=req.body;

  file.findByIdAndUpdate(fileId,update,(err,fileUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia eguneratzean'});
    }else{
      if(!fileUpdated){
        res.status(404).send({message: 'Ez da irudia eguneratu'});
      }else{
        res.status(200).send({file: fileUpdated});
        }
    }
  });

}

function deleteFile(req,res){
  var fileId=req.params.id;

  file.findByIdAndRemove(fileId,(err,fileDeleted)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia ezabatzean'});
    }else{
      if(!fileDeleted){
        res.status(404).send({message: 'Ezin da irudia ezabatu'});
      }else{
        res.status(200).send({file: fileDeleted});
        }
    }

  });

}

var fs=require('fs');
function getfileFile(req,res){
  var fileFile=req.params.fileFile;
  fs.exists('./uploads/'+fileFile,(exists)=>{
      if(exists)
      {
        res.sendFile(path.resolve('./uploads/'+fileFile));
      }else{
        res.status(200).send({message: 'Jadanik ez da fitxategi hori existitzen'});
      }
    });


}
module.exports={
  getFile,
  getFiles,
  saveFile,
  updateFile,
  deleteFile,
  getfileFile,
  getUserFile,
  uploadFile,
  getPublicationsFile
}
