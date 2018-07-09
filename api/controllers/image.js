'use strict'

var path=require('path');
var Image=require('../models/image');
var User=require('../models/user');

function getImage(req,res){
  var imageId=req.params.id;

  Image.findById(imageId,(err,image)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia lortzean'});
    }else{
      if(!image || image==false){
        res.status(404).send({message: 'Irudi hori ez da existitzen'});
      }else{
            res.status(200).send({image});
      }
    }
  });
}

function getImages(req,res){

  Image.find({},(err,images)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!images || images==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({images});
      }
    }
  });
}

function getUserArgazkia(req,res){
  var id=req.params.id;
  var mota="argazkia";

  Image.find({'user':id,'mota':mota},(err,image)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!image || image==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({image});
      }
    }
  });
}

function getUserPortada(req,res){
  var id=req.params.id;

  Image.find({'user':id,'mota':portada},(err,image)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudiak lortzean'});
    }else{
      if(!image || image==false){
        res.status(404).send({message: 'Ez dago irudirik'});
      }else{
            res.status(200).send({image});
      }
    }
  });
}


function saveImage(req,res){
  var imageId=req.params.id;
  var params=req.body;

  var image=new Image();
  image.picture=null;
  image.user=params.user;

  image.save(imageId,(err,imageStored)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia gordetzean'});
    }else{
      if(!imageStored){
        res.status(404).send({message: 'Ez da irudia gorde'});
      }else{
        res.status(200).send({image: imageStored});  }
    }

  });

}
function uploadImage(req,res){
  var imageId=req.params.id;
  var file_name='Ez da igo...';
  if(req.files){

    var file_path=req.files.image.path;
    var file_split=file_path.split('\\');
    var file_name=file_split[1];

    Image.findByIdAndUpdate(imageId,{picture: file_name},(err,imageUpdated)=>{
      if(err){
        res.status(500).send({message: 'Errorea irudia igotzean'});
      }else{
        if(!imageUpdated){
          res.status(404).send({message: 'Ez da irudia eguneratu'});
        }else{
          res.status(200).send({image: imageUpdated});
        }
      }
    });

  }else{
    res.status(200).send({message: 'Ez da irudia igo'});
  }

}

function updateImage(req,res){
  var imageId=req.params.id;
  var update=req.body;

  Image.findByIdAndUpdate(imageId,update,(err,imageUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia eguneratzean'});
    }else{
      if(!imageUpdated){
        res.status(404).send({message: 'Ez da irudia eguneratu'});
      }else{
        res.status(200).send({image: imageUpdated});
        }
    }
  });

}

function deleteImage(req,res){
  var imageId=req.params.id;

  Image.findByIdAndRemove(imageId,(err,imageDeleted)=>{
    if(err){
      res.status(500).send({message: 'Errorea irudia ezabatzean'});
    }else{
      if(!imageDeleted){
        res.status(404).send({message: 'Ezin da irudia ezabatu'});
      }else{
        res.status(200).send({image: imageDeleted});
        }
    }

  });

}

var fs=require('fs');
function getImageFile(req,res){
  var imageFile=req.params.imageFile;
  fs.exists('./uploads/'+imageFile,(exists)=>{
      if(exists)
      {
        res.sendFile(path.resolve('./uploads/'+imageFile));
      }else{
        res.status(200).send({message: 'No existe la imagen'});
      }
    });


}

function getUImage(req,res){
  var userId=req.params.user;
  var mota="argazkia";
  Image.find({'user':userId,'mota':mota},(err,image)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!image){
        res.status(404).send({message: 'Erabiltzaile hori ez da existitzen'});
      }else{
        console.log(image[0].picture)
        fs.exists('./uploads/'+image[0].picture,(exists)=>{
            if(exists)
            {
              res.sendFile(path.resolve('./uploads/'+image[0].picture));
            }else{
              res.status(200).send({message: 'No existe la imagen'});
            }
          });
      }
    }
  });

}

function getUsersImageFile(req,res){
  var userId=req.params.user;
  console.log("sartzen da getUsersImageFile")

  User.findById(userId,(err,user)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user){
        res.status(404).send({message: 'Erabiltzaile hori ez da existitzen'});
      }else{
            //res.status(200).send({user});
            console.log("lortzen den userizena: "+user.argazkia)
            Image.findById(user.argazkia,(err,image)=>{
              if(err){
                res.status(500).send({message: 'Errorea irudia lortzean'});
              }else{
                if(!image || image==false){
                  res.status(404).send({message: 'Irudi hori ez da existitzen'});
                }else{
                      //res.status(200).send({image});
                      console.log("lortzen den user argazki id "+image._id)
                      fs.exists('./uploads/'+image.picture,(exists)=>{
                          if(exists)
                          {
                            res.sendFile(path.resolve('./uploads/'+image.picture));
                          }else{
                            res.status(200).send({message: 'No existe la imagen'});
                          }
                        });
                }
              }
            });
        }
    }
  });
}

module.exports={
  getImage,
  getImages,
  saveImage,
  updateImage,
  deleteImage,
  getImageFile,
  getUserArgazkia,
  getUserPortada,
  uploadImage,
  getUsersImageFile,
  getUImage
}
