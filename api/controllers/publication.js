'use strict'

var path=require('path');
var Publication=require('../models/publication');
var comment=require('../models/comment');
var User=require('../models/user');
var Semaphore=require('../models/semaphore');
var Filee=require('../models/file');
var Duty=require('../models/duty');

function getPublication(req,res){
  var publiId=req.params.id;

  Publication.findById(publiId,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publication){
        res.status(404).send({message: 'Ez da argitalpen hori existitzen'});
      }else{
        comment.populate(publication,{path: 'iruzkinak'},(err,publication)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
              }else{
                Semaphore.populate(publication,{path: 'semaforoak'},(err,publication)=>{
                      if(err){
                        res.status(500).send({message: 'Errorea argitalpena eta semaforoak elkarlotzean'});
                      }else{
                        res.status(200).send({publication});
                      /*  Filee.populate(publication,{path: 'file'},(err,publication)=>{
                              if(err){
                                res.status(500).send({message: 'Errorea argitalpena eta fitxategia elkarlotzean'});
                              }else{
                                res.status(200).send({publication});
                                }
                            });
                            */
                        }
                    });
              }
            });
      }
    }
  });
}

function getPublicationsOfDuty(req,res){
  var dutyId=req.params.id;

  Publication.find({'duty':dutyId},(err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publications){
        res.status(404).send({message: 'Ez da argitalpen hori existitzen'});
      }else{
        User.populate(publications,{path: 'sortzailea'},(err,publications)=>{
          if(err){
            res.status(500).send({message: 'Errorea argitalpena eta sortzailea elkarlotzean'});
          }else{
            res.status(200).send({publications});
            }
        });
      }
    }
  });
}

function getPubliForo(req,res){
  var mota="argitalpena";
  var mota2="foroa";
  Publication.find({}).sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpenak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
          for(var i=0;i<publications.length;i++){
              if(publications[i].mota=="eginbeharra")
              {
                publications.splice(i,1);
                i=i-1
              }
            }

              comment.populate(publications,{path: 'iruzkinak'},(err,publications)=>{
                    if(err){
                      res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
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
                                      //res.status(200).send({publications});
                                      Duty.populate(publications,{path: 'duty'},(err,publications)=>{
                                            if(err){
                                              res.status(500).send({message: 'Errorea argitalpena eta eginbeharra elkarlotzean'});
                                            }else{
                                              res.status(200).send({publications});
                                              }
                                          });
                                      }
                                  });
                              }
                          });
                      }
                  });
      }
    }
  });
}

function getArgitalpenak(req,res){
  var mota="argitalpena";
  Publication.find({'mota':mota}).sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpenak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
        comment.populate(publications,{path: 'iruzkinak'},(err,publications)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
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
                                //res.status(200).send({publications});
                                Duty.populate(publications,{path: 'duty'},(err,publications)=>{
                                      if(err){
                                        res.status(500).send({message: 'Errorea argitalpena eta eginbeharra elkarlotzean'});
                                      }else{
                                        res.status(200).send({publications});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
      }
    }
  });
}

function getUsersArgitalpenak(req,res){
  var user=req.params.user;
  var mota="argitalpena";
  Publication.find({'mota':mota,'sortzailea':user}).sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpenak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
        comment.populate(publications,{path: 'iruzkinak'},(err,publications)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
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
                                //res.status(200).send({publications});
                                Duty.populate(publications,{path: 'duty'},(err,publications)=>{
                                      if(err){
                                        res.status(500).send({message: 'Errorea argitalpena eta eginbeharra elkarlotzean'});
                                      }else{
                                        res.status(200).send({publications});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
      }
    }
  });
}

function getUsersArgitalpenak2(req,res){
  var user=req.params.user;
  var mota="argitalpena";
  Publication.find({'mota':mota,'sortzailea':user}).sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpenak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
        comment.populate(publications,{path: 'iruzkinak'},(err,publications)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
              }else{
                //res.status(200).send({publications});
                Filee.populate(publications,{path: 'file'},(err,publications)=>{
                      if(err){
                        res.status(500).send({message: 'Errorea argitalpena eta fitxategia elkarlotzean'});
                      }else{
                        //res.status(200).send({publications});
                        Duty.populate(publications,{path: 'duty'},(err,publications)=>{
                              if(err){
                                res.status(500).send({message: 'Errorea argitalpena eta eginbeharra elkarlotzean'});
                              }else{
                                res.status(200).send({publications});
                                }
                            });
                        }
                    });
                }
            });
      }
    }
  });
}


function getForoak(req,res){
  var mota="foroa";
  Publication.find({'mota':mota}).sort('-data').exec((err,publications)=>{
    if(err){
      res.status(500).send({message: 'Errorea foroko argitalpenak eskuratzean'});
    }else{
      if(!publications || publications==false){
        res.status(404).send({message: 'Ez da foroko argitalpenik existitzen'});
      }else{
        //res.status(200).send({publications});
        comment.populate(publications,{path: 'iruzkinak'},(err,publications)=>{
              if(err){
                res.status(500).send({message: 'Errorea argitalpena eta iruzkinak elkarlotzean'});
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
            });
      }
    }
  });
}

function createArgitalpena(req,res){
  var publi=new Publication();
  var user=req.params.id;
  var params=req.body;


  publi.izenburua=params.izenburua;
  console.log("izenburua publi "+publi.izenburua)
  publi.azalpena=params.azalpena;
  publi.mota="argitalpena";
  publi.sortzailea=user;
  if(params.duty){
    console.log("sartzen den eginbeharra "+params.duty)
    publi.duty=params.duty;
    console.log("eginbeharra publi "+publi.duty)
  }

  //sorrera data
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

console.log("semaphore sortu baino lehen publi "+publi)
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
                          console.log(err);
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

function createForoa(req,res){
  var publi=new Publication();
  var user=req.params.id;
  var params=req.body;


  publi.izenburua=params.izenburua;
  publi.azalpena=params.azalpena;
  publi.mota="foroa";
  publi.sortzailea=user;

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

function updateArgitalpena(req,res){
  var id=req.params.id;
  var update=req.body;


  Publication.findByIdAndUpdate(id,update,(err,publiUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publiUpdated){
        res.status(404).send({message: 'Ezin izan da argitalpena eguneratu'});
      }else{
        console.log("bidaltzen dena: "+publiUpdated.semaforoak[0].whose)
        res.status(200).send({publication: publiUpdated});
      }
    }
  });
}

function updateForoa(req,res){
  var id=req.params.id;
  var update=req.body;

  Publication.findByIdAndUpdate(id,update,(err,publiUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea foroko argitalpena eskuratzean'});
    }else{
      if(!publiUpdated){
        res.status(404).send({message: 'Ezin izan da foroko argitalpena eguneratu'});
      }else{
        res.status(200).send({publication: publiUpdated});
      }
    }
  });
}

function deletePublication(req,res){
  var id=req.params.id;

  Publication.findByIdAndRemove(id,(err,publiUpdated)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publiUpdated){
        res.status(404).send({message: 'Ezin izan da argitalpena ezabatu'});
      }else{
        res.status(200).send({publication: publiUpdated});
      }
    }
  });
}


//GUSTUKO DUT KUDEAKETA

function addGustukoDut(req,res){
  var id=req.params.id;//argitalpenarenIDa
  var params=req.body;
  var user=params._id;
  var badago=false;

  Publication.findById(id,(err,publi)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publi){
        res.status(404).send({message: 'Ezin izan da argitalpena lortu'});
      }else{
          for(var i=0;i<publi.gustuko.length;i++){
            if(publi.gustuko[i]==user){
                badago=true;
            }
          }
          if(badago==false){
              publi.gustuko.push(user);
              Publication.findByIdAndUpdate(id,publi,(err,publiUpdated)=>{
                  if(err){
                      res.status(500).send({message: 'Errorea foroko argitalpena eskuratzean'});
                  }else{
                    if(!publiUpdated){
                      res.status(404).send({message: 'Ezin izan da argitalpenan gustukoa gehitu'});
                    }else{
                      res.status(200).send({publication: publiUpdated});
                    }
                  }
              });
          }else{
              res.status(404).send({message: 'Erabiltzaile hori jadanik bazegoen'});
          }



      }
    }
  });
}

function deleteGustukoDut(req,res){
  var id=req.params.id;//argitalpenarenIDa
  var user=req.params.user;
  var badago=false;

  var planb;

  Publication.findById(id,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publication){
        res.status(404).send({message: 'Ezin izan da argitalpen hori eskuratu'});
      }else{
        //komprobaketa egin beharko da jadanik erabiltzailea apuntatuta dagoen ikusteko
        var badago=false;
        var j=null;
        for(var i=0;i<publication.gustuko.length;i++){
            if(publication.gustuko[i]==user){
              badago=true;
              j=i;
            }
        }
        if(badago==true){
            publication.gustuko.splice(j,1);

            Publication.findByIdAndUpdate(id,publication,(err,publicationUpdated)=>{
            if(err){
              res.status(500).send({message: 'Errorea erabiltzailea ezabatzean'});
            }if(!publicationUpdated){
              res.status(404).send({message: 'Ezin izan da erabiltzailea ezabatu argitalpenetik'});
            }else{
              res.status(200).send({publication: publication});
            }
          });
        }else{
            res.status(404).send({message: 'Erabiltzailea jadanik ez dago argitalpenean'});
        }


        }
    }

  });

}

//IRUZKIN KUDEAKETA

function getPublicationsComments(req,res){
  var id=req.params.id;

  comment.find({'publication':id},(err,comments)=>{
    if(err){
      res.status(500).send({message: 'Errorea iruzkinak lortzean'});
    }else{
      if(!comments || comments==false){
        res.status(404).send({message: 'Ez dago iruzkinik'});
      }else{
            res.status(200).send({comments});
      }
    }
  });
}

function addComment(req,res){
  var id=req.params.id;//publicationId
  var params=req.body;
  var com=params._id;//iruzkinaren IDa
  var badago=false;

  console.log("heltzen den comment id: "+id)
  console.log("heltzen den ")
  Publication.findById(id,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publication || publication==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
        for(var i=0;i<publication.iruzkinak.length;i++){
          if(publication.iruzkinak[i]==com){
              badago=true;
          }
        }
        if(badago==false){
          publication.iruzkinak.push(com);
          Publication.findByIdAndUpdate(id,publication,(err,publiUpdated)=>{
            if(err){
              res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
            }else{
              if(!publiUpdated){
                res.status(404).send({message: 'Ezin izan da argitalpena eguneratu'});
              }else{
                res.status(200).send({publication: publiUpdated});
              }
            }
          });
        }
        else{
          res.status(404).send({message: 'Iruzkin hori jadanik argitalpenean dago'});
        }
      }
    }
  });

}

function deleteComment(req,res){
  var id=req.params.id;
  var com=req.params.comment;//iruzkinaren IDa

  Publication.findById(id,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publication || publication==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
        var badago=false;
        var j=null;
        for(var i=0;i<publication.iruzkinak.length;i++){
            if(String(publication.iruzkinak[i])==String(com)){
              badago=true;
              j=i;
            }
        }

        if(badago==true){
          publication.iruzkinak.splice(j,1);
          Publication.findByIdAndUpdate(id,publication,(err,publiUpdated)=>{
            if(err){
              res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
            }else{
              if(!publiUpdated){
                res.status(404).send({message: 'Ezin izan da argitalpena eguneratu'});
              }else{
                res.status(200).send({publication: publiUpdated});
              }
            }
          });
        }
      }
    }
  });

}

function addFileToPublication(req,res){
  var id=req.params.id;//publicationId
  var params=req.body;
  var fileId=params._id;//filearen IDa

  console.log("heltzen den publi id: "+id)
  console.log("heltzen den file id: "+fileId)
  Publication.findById(id,(err,publication)=>{
    if(err){
      res.status(500).send({message: 'Errorea argitalpena eskuratzean'});
    }else{
      if(!publication || publication==false){
        res.status(404).send({message: 'Ez da argitalpenik existitzen'});
      }else{
          publication.file.push(fileId);
          Publication.findByIdAndUpdate(id,publication,(err,publiUpdated)=>{
            if(err){
              res.status(500).send({message: 'Errorea argitalpena eskuratzean2'});
            }else{
              if(!publiUpdated){
                res.status(404).send({message: 'Ezin izan da argitalpena eguneratu2'});
              }else{
                res.status(200).send({publication: publiUpdated});
              }
            }
          });
      }
    }
  });

}


module.exports={
  getPublication,
  getArgitalpenak,
  getForoak,
  getUsersArgitalpenak,
  createArgitalpena,
  createForoa,
  updateArgitalpena,
  updateForoa,
  addGustukoDut,
  deleteGustukoDut,
  getPublicationsComments,
  addComment,
  addFileToPublication,
  deletePublication,
  getPubliForo,
  getPublicationsOfDuty,
  getUsersArgitalpenak2
}
