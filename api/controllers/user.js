'use strict'
var crypto = require('crypto');
var User=require('../models/user');
//var Plan=require('../models/plan');
var Image=require('../models/image');
var Semaphore=require('../models/semaphore');

function getUser(req,res){
  var userId=req.params.id;

  User.findById(userId,(err,user)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user){
        res.status(404).send({message: 'Erabiltzaile hori ez da existitzen'});
      }else{
        user.firstName=user.firstName.charAt(0).toUpperCase()+user.firstName.slice(1);
        user.lastName=user.lastName.charAt(0).toUpperCase()+user.lastName.slice(1);
        user.lastName2=user.lastName2.charAt(0).toUpperCase()+user.lastName2.slice(1);
        res.status(200).send({user});
        }
    }
  });
}

function getUsers(req,res){

  User.find({}).sort('firstName').sort('lastName').sort('lastName2').exec((err,users)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzaileak eskuratzean'});
    }else{
      if(!users){
        res.status(404).send({message: 'Ez dago erabiltzailerik'});
      }else{
            //res.status(200).send({users});
            Image.populate(users,{path: 'argazkia'},(err,users)=>{
                  if(err){
                    res.status(500).send({message: 'Errorea erabiltzailea eta argazkia elkarlotzean'});
                  }else{
                    //res.status(200).send({users});
                    Image.populate(users,{path: 'portada'},(err,users)=>{
                          if(err){
                            res.status(500).send({message: 'Errorea erabiltzailea eta portada elkarlotzean'});
                          }else{

                            for(var i=0;i<users.length;i++){
                              users[i].firstName=users[i].firstName.charAt(0).toUpperCase()+users[i].firstName.slice(1);
                              users[i].lastName=users[i].lastName.charAt(0).toUpperCase()+users[i].lastName.slice(1);
                              users[i].lastName2=users[i].lastName2.charAt(0).toUpperCase()+users[i].lastName2.slice(1);
                            }
                            res.status(200).send({users});
                            }
                        });
                    }
                });
        }

    }
  });
}

function getAdmin(req,res){
  var username="admin";

  User.find({'username':username},(err,user)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea administraria eskuratzean'});
    }else{
      if(!user){
        res.status(404).send({message: 'Ez dago administraririk'});
      }else{
            res.status(200).send({user});
        }

    }
  });
}

function getByIzena(req,res){
    var sartutakoa=req.params.sartutakoa;
    sartutakoa=decodeURIComponent(sartutakoa).toLowerCase();
    var array=sartutakoa.split(' ');
    var izena=[];
    var abizena1=[];
    var abizena2=[];

    for(var i=0;i<array.length;i++){
      if(array[i]!=' ' &&(izena==false|| izena==undefined)){
        izena=array[i];
      }
      else if(array[i]!=' ' &&(abizena1==false||abizena1==undefined)){
        abizena1=array[i];
      }
      else if(array[i]!=' '&&(abizena2==false|| abizena2==undefined)){
        abizena2=array[i];
      }
    }


    console.log("izena "+izena)
    console.log("abizena1 "+abizena1)
    console.log("abizena2 "+abizena2)

    if(izena!=undefined && (abizena1==undefined || abizena1=='')){//abizena1 undefine bada, abizena2 ere
      var find= User.find({'firstName':{$regex: izena}}).sort('firstName');
    }
    if(izena!=undefined && (abizena1!=undefined && abizena1!='') && (abizena2==undefined || abizena2=='')){
      var find= User.find({'firstName':{$regex: izena},'lastName':{$regex: abizena1}}).sort('firstName').sort('lastName');
    }
    if(izena!=undefined && abizena1!=undefined && (abizena2!= undefined && abizena2!='')){
      var find= User.find({'firstName':{$regex: izena},'lastName':{$regex: abizena1},'lastName2':{$regex: abizena2}}).sort('firstName').sort('lastName').sort('lastName2');
    }

    find.exec((err,users)=>{
        if(err){
          res.status(500).send({message: 'Errorea erabiltzaileak eskuratzean'});
        }else{
          if(!users || users==false){
              res.status(404).send({message: 'Ez dago baldintza horietako erabiltzailerik'});
          }else{
              for(var i=0;i<users.length;i++){
                users[i].firstName=users[i].firstName.charAt(0).toUpperCase()+users[i].firstName.slice(1);
                users[i].lastName=users[i].lastName.charAt(0).toUpperCase()+users[i].lastName.slice(1);
                users[i].lastName2=users[i].lastName2.charAt(0).toUpperCase()+users[i].lastName2.slice(1);
              }
              res.status(200).send({users});
          }
        }
    });

}

function saveUser(req,res){
  var user=new User();
  //izena,email,hash eta salt register bitartez lortuko dira
  var params=req.body;
  user.username=params.username;//probarako soilik, parametro hau registerretik lortuko da
  user.firstName=params.firstName;
  user.lastName=params.lastName;
  user.lastName2=params.lastName2;
  user.description=params.description;

  user.save((err,userStored)=>{
    if(err)
    {
      console.log(err);
      res.status(500).send({message: 'Errorea erabiltzailea gordetzerakoan'});
    }else{
      if(!userStored){
        res.status(404).send({message: 'Ezin izan da erabiltzailea gorde'});
      }else{
          //
          var image=new Image();
          image.picture="profileDefault.png";
          image.user=userStored._id;

          image.save((err,imageStored)=>{
            if(err){
              res.status(500).send({message: 'Errorea irudia gordetzean'});
            }else{
              if(!imageStored){
                res.status(404).send({message: 'Ez da irudia gorde'});
              }else{
                console.log('sortutako argazkiaren id: '+imageStored._id);
                //res.status(200).send({user: userStored});
                var image2=new Image();
                image2.picture="portadaDefault.jpg";
                image2.user=userStored._id;

                image2.save((err,imageStored2)=>{
                  if(err){
                    res.status(500).send({message: 'Errorea portada gordetzean'});
                  }else{
                    if(!imageStored2){
                      res.status(404).send({message: 'Ez da portada gorde'});
                    }else{
                      //res.status(200).send({image: imageStored});
                      console.log('sortutako portadaren id: '+imageStored2._id);
                      res.status(200).send({user: userStored});
                    }
                  }

                });
              }
            }

          });
          //
          //res.status(200).send({user: userStored});
        }
    }
  });
}

function existsUser(req,res){
  var username=req.params.username;

  User.find({'username':username},(err,user)=>{
    if(err){
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user|| user==false){//array hutsa = false delako. Hau da, []=false da
        res.status(404).send({message: 'Ez dago username hori erregistratuta'});
      }else{
          //argazkiaren informazioa agertzea beharrezkoa bada, populate egin hemen
          res.status(200).send({user: user});
        }

    }
  });
}

function updateUser(req,res){
  var userId=req.params.id;
  var update=req.body;

  User.findByIdAndUpdate(userId,update,(err,userUpdated)=>{
    if(err)
    {
      res.status(500).send({message: 'Errorea erabiltzailea gaurkotzean'});
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'Ezin izan da erabiltzailea gaurkotu'});
      }else{


        userUpdated.firstName=update.firstName;
        userUpdated.lastName=update.lastName;
        userUpdated.lastName2=update.lastName2;
        userUpdated.description=update.description;
        userUpdated.portada=update.portada;
        userUpdated.argazkia=update.argazkia;

        var token;
        token = userUpdated.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
      }
    }
  });
}

function deleteUser(req,res){
  var userId=req.params.id;
  console.log(userId)




        User.findByIdAndRemove(userId,(err,userRemoved)=>{
          if(err)
          {
            res.status(500).send({message: 'Errorea erabiltzailea ezabatzean'});
          }else{
            console.log(userRemoved)
            if(!userRemoved){
              res.status(404).send({message: 'Ezin da erabiltzailea ezabatu'});
            }else{
              res.status(200).send({user: userRemoved});
            }
          }
        });
    }

module.exports={
  getUser,
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  existsUser,
  getAdmin,
  getByIzena
}
