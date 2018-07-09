var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Image=require('../models/image');
var Semaphore=require('../models/semaphore');

//var Image=require('../models/image');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//Register

module.exports.register = function(req, res) {
  if(!req.body.firstName || !req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "Eremu guztiak bete behar dituzu"
    });
    return;
  }

  User.find({'username':req.body.username},(err,user)=>{
    if(err){
      res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user|| user==false){//array hutsa = false delako. Hau da, []=false da
        var userN = new User();
        userN.firstName = req.body.firstName.toLowerCase();
        userN.username = req.body.username.toLowerCase();
        userN.lastName=req.body.lastName.toLowerCase();
        userN.lastName2=req.body.lastName2.toLowerCase();
        //userN.description=req.body.description.toLowerCase();

        console.log(req.body.password)
        userN.setPassword(req.body.password);
        console.log(userN)

          //erabiltzailearen argazkia sortu
          var image=new Image();
          image.picture="profileDefault.jpg";
          image.user=userN._id;
          image.mota="argazkia";

          //hiru semaforoak sortu eta publicationean sartu
          var semaphore=new Semaphore();
          semaphore.image="semaforoGrisa.png";
          semaphore.whose="argazkia";
          semaphore.description="";

          var semaphore2=new Semaphore();
          semaphore2.image="semaforoGrisa.png";
          semaphore2.whose="portada";
          semaphore2.description="";

          var semaphore3=new Semaphore();
          semaphore3.image="semaforoGrisa.png";
          semaphore3.whose="deskribapena";
          semaphore3.description="";

          semaphore.save((err,semaphoreStored)=>{
            if(err)
            {
              res.status(500).send({message: 'Errorea userraren semaforoa sortzean'});
            }else{
              if(!semaphoreStored){
                res.status(404).send({message: 'Ezin izan da userraren semaforoa sortu'});
              }else{
                  userN.semaforoak.push(semaphoreStored._id);
                  semaphore2.save((err,semaphoreStored2)=>{
                    if(err)
                    {
                      res.status(500).send({message: 'Errorea userraren 2.semaforoa sortzean'});
                    }else{
                      if(!semaphoreStored2){
                        res.status(404).send({message: 'Ezin izan da userraren 2.semaforoa sortu'});
                      }else{
                          userN.semaforoak.push(semaphoreStored2._id);
                          semaphore3.save((err,semaphoreStored3)=>{
                            if(err)
                            {
                              res.status(500).send({message: 'Errorea userraren 3.semaforoa sortzean'});
                            }else{
                              if(!semaphoreStored3){
                                res.status(404).send({message: 'Ezin izan da userraren 3.semaforoa sortu'});
                              }else{
                                  userN.semaforoak.push(semaphoreStored3._id);
                                  image.save((err,imageStored)=>{
                                    if(err){
                                      res.status(500).send({message: 'Errorea irudia gordetzean'});
                                    }else{
                                      if(!imageStored){
                                        res.status(404).send({message: 'Ez da irudia gorde'});
                                      }else{
                                        console.log('sortutako argazkiaren id: '+imageStored._id);
                                        userN.argazkia=imageStored._id;
                                        //erabiltzailearen portada sortu
                                        var image2=new Image();
                                        image2.picture="portadaDefault.jpg";
                                        image2.user=userN._id;
                                        image2.mota="portada";

                                        image2.save((err,imageStored2)=>{
                                          if(err){
                                            res.status(500).send({message: 'Errorea portada gordetzean'});
                                          }else{
                                            if(!imageStored2){
                                              res.status(404).send({message: 'Ez da portada gorde'});
                                            }else{
                                              userN.portada=imageStored2._id;
                                              console.log('sortutako portadaren id: '+imageStored2._id);
                                              userN.save(function(err) {
                                                console.log("===userBerria===");
                                                console.log(userN);



                                          });
                                          var token;
                                          token = userN.generateJwt();
                                          res.status(200);
                                          res.json({
                                            "token" : token
                                          });
                                        }
                                      }

                                    });
                                  }
                                }

                                  });

                                }
                            }
                          });

                        }
                    }
                  });
                }
            }
          });

      }else{
        res.status(404);
        res.json(err);
      }
    }
  });
};



//Login
module.exports.login = function(req, res) {


  //Authenticate
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
