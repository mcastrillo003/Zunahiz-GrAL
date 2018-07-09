'use strict'

var path=require('path');
var Publication=require('../models/publication');
var comment=require('../models/comment');
var User=require('../models/user');
var Semaphore=require('../models/semaphore');
var Filee=require('../models/file');
var Duty=require('../models/duty');


function getEginbeharra(req,res){
  var publiId=req.params.id;

  Duty.findById(publiId,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharra eskuratzean'});
    }else{
      if(!publication){
        res.status(404).send({message: 'Ez da eginbehar hori existitzen'});
      }else{
        Semaphore.populate(publication,{path: 'semaforoak'},(err,publication)=>{
              if(err){
                res.status(500).send({message: 'Errorea eginbeharra eta semaforoak elkarlotzean'});
              }else{
                res.status(200).send({publication});
                /*Filee.populate(publication,{path: 'file'},(err,publication)=>{
                      if(err){
                        res.status(500).send({message: 'Errorea eginbeharra eta fitxategia elkarlotzean'});
                      }else{
                        res.status(200).send({publication});
                        }
                    });
                    */
                }
            });
      }
    }
  });
}

function getEginbeharraWithFileData(req,res){
  var publiId=req.params.id;

  Duty.findById(publiId,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharra eskuratzean'});
    }else{
      if(!publication){
        res.status(404).send({message: 'Ez da eginbehar hori existitzen'});
      }else{
        Semaphore.populate(publication,{path: 'semaforoak'},(err,publication)=>{
              if(err){
                res.status(500).send({message: 'Errorea eginbeharra eta semaforoak elkarlotzean'});
              }else{
                //res.status(200).send({publication});
                Filee.populate(publication,{path: 'file'},(err,publication)=>{
                      if(err){
                        res.status(500).send({message: 'Errorea eginbeharra eta fitxategia elkarlotzean'});
                      }else{
                        res.status(200).send({publication});
                        }
                    });
                }
            });
      }
    }
  });
}

function createEginbeharra(req,res){
  var publi=new Duty();
  var user=req.params.id;
  var params=req.body;


  publi.izenburua=params.izenburua;
  publi.azalpena=params.azalpena;
  publi.sortzailea=user;
  //
  publi.noizkoUrtea=params.noizkoUrtea;
  publi.noizkoHilabetea=params.noizkoHilabetea;
  publi.noizkoEguna=params.noizkoEguna;
  publi.noizko=params.noizko;
  //

  //ordua lortu
  var data=new Date();
  var hour=data.getHours();
  var min=data.getMinutes();
  var sec=data.getSeconds();
  if(hour<10)
  {
    hour='0'+data.getHours();
  }
  if(min<10)
  {
    min='0'+data.getMinutes();
  }
  if(sec<10)
  {
    sec='0'+data.getSeconds();
  }
  publi.data = data.toISOString().substr(0, 11).replace('T', ' ')+hour+':'+min+':'+sec;

  //fitxategia Sortu
  var file=new Filee();
  file.title="";
  file.name="";
  file.publication=publi._id;

//semaforo biak sortu eta publicationean sartu
var semaphore=new Semaphore();
semaphore.image="semaforoGrisa.png";
semaphore.whose="publication";
semaphore.description="";

var semaphore2=new Semaphore();
semaphore2.image="semaforoGrisa.png";
semaphore2.whose="iruzkinak";
semaphore2.description="";

semaphore.save((err,semaphoreStored)=>{
  if(err)
  {
    res.status(500).send({message: 'Errorea argitalpenaren semaforoa sortzean'});
  }else{
    if(!semaphoreStored){
      res.status(404).send({message: 'Ezin izan da argitalpenaren semaforoa sortu'});
    }else{
        publi.semaforoak.push(semaphoreStored._id);
        semaphore2.save((err,semaphoreStored2)=>{
          if(err)
          {
            res.status(500).send({message: 'Errorea iruzkinen semaforoa sortzean'});
          }else{
            if(!semaphoreStored2){
              res.status(404).send({message: 'Ezin izan da iruzkinen semaforoa sortu'});
            }else{
                publi.semaforoak.push(semaphoreStored2._id);

                file.save((err,fileStored)=>{
                  if(err){
                      res.status(500).send({message: 'Errorea argitalpenaren fitxategia sortzean'});
                  }else{
                    if(!fileStored){
                      res.status(404).send({message: 'Ezin izan da argitalpenaren fitxategia sortu'});
                    }else{
                      publi.file=fileStored._id;
                      //argitalpena sortu
                      publi.save((err,publiStored)=>{
                        if(err)
                        {
                          res.status(500).send({message: 'Errorea argitalpena gordetzerakoan'});
                        }else{
                          if(!publiStored){
                            res.status(404).send({message: 'Ezin izan da argitalpena gorde'});
                          }else{
                              res.status(200).send({publication: publiStored});
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

function getEginbeharrak(req,res){
  Duty.find().sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharrak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da eginbeharrik existitzen'});
      }else{
        //res.status(200).send({publications});
        Semaphore.populate(publications,{path: 'semaforoak'},(err,publications)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta semaforoak elkarlotzean'});
              }else{
                //res.status(200).send({publications});
                Filee.populate(publications,{path: 'file'},(err,publications)=>{
                      if(err){
                        res.status(500).send({message: 'Errorea argitalpena eta fitxategia elkarlotzean'});
                      }else{
                        res.status(200).send({publications});
                        }
                    });
                }
            });
      }
    }
  });
}

function getEginbeharrakByMonth(req,res){
  var urtea=req.params.urtea;
  var hilabetea=req.params.hilabetea;

  console.log("jasotako noizkoUrtea"+urtea)
  console.log("jasotako noizkoHilabetea"+hilabetea)

  Duty.find({'noizkoUrtea':urtea,'noizkoHilabetea':hilabetea}).sort('noizkoUrtea').sort('noizkoHilabetea').sort('noizkoEguna').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharrak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da eginbeharrik existitzen'});
      }else{
        res.status(200).send({publications});
      }
    }
  });
}

function updateEginbeharra(req,res){
  var id=req.params.id;
  var update=req.body;

  Duty.findByIdAndUpdate(id,update,(err,publiUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharra eskuratzean'});
    }else{
      if(!publiUpdated){
        res.status(404).send({message: 'Ezin izan da eginbeharra eguneratu'});
      }else{
        res.status(200).send({publication: publiUpdated});
      }
    }
  });
}

function deleteEginbeharra(req,res){
  var id=req.params.id;

  Duty.findByIdAndRemove(id,(err,publiUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea eginbeharra eskuratzean'});
    }else{
      if(!publiUpdated){
        res.status(404).send({message: 'Ezin izan da eginbeharra ezabatu'});
      }else{
        res.status(200).send({publication: publiUpdated});
      }
    }
  });
}

module.exports={
  createEginbeharra,
  getEginbeharrak,
  getEginbeharrakByMonth,
  updateEginbeharra,
  deleteEginbeharra,
  getEginbeharra,
  getEginbeharraWithFileData
}
