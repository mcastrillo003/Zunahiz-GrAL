// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image'
import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication';
import {CommentService} from '../services/comment.service';
import {Comment} from '../models/comment';
import {SemaphoreService} from '../services/semaphore.service';
import {Semaphore} from '../models/semaphore';


// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'view-user',
templateUrl: './view-user.html',

styleUrls: ['../app.component.css','./view-user.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService,ImageService, PublicationService, CommentService, SemaphoreService]
})

// Clase del componente donde irán
export class ViewUserComponent implements OnInit {

//Session
public userMe:User;
public token:String;


//Future PLAN
public egunaPlan: string;
public hilabeteaPlan: string;
public urteaPlan: string;

public isme: boolean;
public user_id: any;

public user: User;
public errorMessage: any;
public modalOptions:any;
public createView: boolean;

public apiUrl:string;
public imageUrl:string;
public image:Image;
public portadaUser:Image;
public imageUser:Image;
public isAdmin:boolean;
public admin:User;
public type:string;
public datuak:boolean;

//argitalpena kudeatzeko
public nirepublications:Publication[];
public comment:Comment;
public aukeraGaituta:boolean;
public userArgazkiaUrl:string;

//semaforo aldaketak egiteko
public koloreak=[{name:"gorria"},{name:"horia"},{name:"berdea"},{name:"grisa"}];
public kolorea:string;
public kolorea2:string;
public description:string;
public description2:string;
public aldatu:boolean;
public urlSemaphore:string;


constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _publicationService: PublicationService,
  private _commentService: CommentService,
  private _semaphoreService: SemaphoreService,
  private _route: ActivatedRoute,
  private _router: Router
){
}

ngOnInit(){
  //hasieratu
this.comment=new Comment("","","","");
  this.isAdmin=false;
  this.isme=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.userArgazkiaUrl=this._imageService.getApiUrl('getUserImage/');
  this.urlSemaphore="../../assets/images/";
  this.kolorea=null;
  this.kolorea2=null;
  this.description=null;
  this.description2=null;
  this.aldatu=false;
  this.aukeraGaituta=false;
  this.type="argitalpena";
  this.datuak=true;
  this.nirepublications=new Array<Publication>();

  window.scrollTo(0, 235);

  //Session
  //nire datuak lortu
  this.userMe=new User("","","","","","","","","","");
  if(this._userService.getToken()==null){
    this._router.navigate(['/']);
  }else
  {
    var temp=this._userService.getUserDetails();
    this.userMe._id=temp._id;
    this.userMe.username=temp.username;
    this.userMe.firstName=temp.firstName;
    this.userMe.argazkia=temp.argazkia;
    this.userMe.portada=temp.portada;
    console.log(this.userMe)
    console.log(JSON.parse(localStorage.getItem('token')))
  //}
  }

    this._imageService.getImage(this.userMe.argazkia).subscribe(
        result=>{//vamos a capturar toda la info que llega de getAlbums
            this.image=result.image;
            //administrariaren datuak lortu konprobaketak egiteko

                this.admin=new User("","","","","","","","","","");
                this._userService.getAdmin().subscribe(
                  result => {
                    this.admin = result.user[0];
                    if(this.userMe._id==this.admin._id){
                        this.isAdmin=true;
                      }
                      else{
                        this.isAdmin=false;
                      }
                    console.log("administrariaren balioa: "+this.isAdmin)

                  },
                  error => {
                    this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                      console.log(this.errorMessage);
                    }
                  }
                );
            if(!this.image){
                //this._router.navigate(['/']);
                console.log("Ez dago iD hori duen irudirik");
            }
        },
        error=>{
            this.errorMessage=<any>error;

            if(this.errorMessage!=null){
                console.log(this.errorMessage);
                this._router.navigate(['/main-page']);
            }

        }
    );


//bizitatzen ari naizen erabiltzailearen datuak lortu
  this._route.params.forEach((params: Params) => {
    this.user_id = params['user._id'];
    console.log("params: "+this.user_id);

    //Is my profile
    if(this.user_id==this.userMe._id){
      this.isme=true;
    }
    else{this.isme=false}
    console.log("ni naiz? "+this.isme)

    this._userService.getUserByID(this.user_id).subscribe(
      result => {
        this.user = result.user;  //aquí están guardados nuestros objetos en JSON
        console.log("bisitatzen ari naizen erabiltzailea: "+this.user._id);
        console.log("bisitatzen ari naizen argazkia: "+this.user.argazkia);
        console.log("bisitatzen ari naizen portada: "+this.user.portada);
        if(!this.user){
          this._router.navigate(['/main-page']);
        }else{
          //erabiltzailearen argazkia lortu
          this._imageService.getImage(this.user.argazkia).subscribe(
              result=>{//vamos a capturar toda la info que llega de getAlbums
                  this.imageUser=result.image;
                  console.log("imageUser.picture balioa: "+this.imageUser.picture);
                  if(!this.imageUser){
                      //this._router.navigate(['/']);
                      console.log("Ez dago iD hori duen irudirik");
                  }

                  //erabiltzailearen portada lortu
                  this._imageService.getImage(this.user.portada).subscribe(
                      result=>{
                          this.portadaUser=result.image;
                          console.log("portadaUser.picture balioa: "+this.portadaUser.picture);
                          if(!this.portadaUser){
                              //this._router.navigate(['/']);
                              console.log("Ez dago iD hori duen irudirik");
                          }
                      },
                      error=>{
                          this.errorMessage=<any>error;

                          if(this.errorMessage!=null){
                              console.log(this.errorMessage);
                          }

                      }
                  );
              },
              error=>{
                  this.errorMessage=<any>error;

                  if(this.errorMessage!=null){
                      console.log(this.errorMessage);
                  }

              }
          );

          //bisitatzen ari naizen erabiltzailearen argitalpenak
          this.getUserArgitalpenak(this.user_id);
        }
      },
      error => {
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );
      });

}

public getUserArgitalpenak(userId){
  //this._publicationService.getArgitalpenak().subscribe(
  this._publicationService.getUsersArgitalpenak(userId).subscribe(
    result=>{
        this.nirepublications=result.publications;
        console.log("dauzen publicationak: "+this.nirepublications.length);
    },
    error=>{
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
    }
  });
}

ngOnChanges(){
  console.log("changesen sartzen da");
  this.ngOnInit();
}

Delete(){
  this._router.navigate(['/delete-user']);

}

/*CreateViewChange(){
  if(this.createView){
    this.createView=false;
  }
  else{
    this.createView=true;
  }
}
*/

Confirm(){
  console.log("ezabatzen sartu naiz")
  this._userService.deleteUser(this.user._id).subscribe(
    result => {
      console.log("Erabiltzailea ondo ezabatu da!");
      //localStorage.removeItem('token');
      this._router.navigate(['/main-page']);
      },
    error => {
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
     }
   }
   );
}

//argitalpenak
public addComment(publicationId){

  this.comment.user=this.userMe._id;
  this.comment.publication=publicationId;

  this._commentService.createComment(this.comment).subscribe(
    result=>{
        this.comment=result.comment;
        this._publicationService.addComment(publicationId,this.comment).subscribe(
          result=>{
                //this._router.navigate(['/main-page/']);
              //location.reload();
              this.comment.content="";
              this.getUserArgitalpenak(this.user_id);
          },
          error=>{
            this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
            }
          });
    },
    error=>{
      this.errorMessage = <any>error;
      if(this.errorMessage != null){
        console.log(this.errorMessage);
      }
    });
  }

  public deleteComment(id){
      console.log("ezabatu beharreko comment id: "+id)
      this._commentService.deleteComment(id).subscribe(
        result=>{
          console.log("comment ondo ezabatuta")
          //location.reload();
          this.getUserArgitalpenak(this.user_id);
        },error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        });
  }

  public semaforoaAldatzen(num,semaphoreId){
  //id publicationekoa
  //nume=0 publication, num=1 comment
  var izena;
  console.log("num "+num)
  if(num==0){
    console.log("0ra sartu")
  if(this.kolorea=="gorria"){
    izena="semaforoGorria.png";
  }
  if(this.kolorea=="horia"){
    izena="semaforoHoria.png";
  }if(this.kolorea=="berdea"){
    izena="semaforoBerdea.png";
  }if(this.kolorea=="grisa"){
    izena="semaforoGrisa.png";
  }

}
if(num==1){
  console.log("1ra sartu")
  if(this.kolorea2=="gorria"){
    izena="semaforoGorria.png";
  }
  if(this.kolorea2=="horia"){
    izena="semaforoHoria.png";
  }if(this.kolorea2=="berdea"){
    izena="semaforoBerdea.png";
  }if(this.kolorea=="grisa"){
    izena="semaforoGrisa.png";
  }
}

  console.log("semaforoa aldatzen sartzen da")

  this._semaphoreService.getSemaphore(semaphoreId).subscribe(
    result=>{
      var sem=result.semaphore;
        sem.image=izena;
        this._semaphoreService.updateSemaphore(semaphoreId,sem).subscribe(
          result=>{
              //location.reload()
              this.kolorea="";
              this.kolorea2="";
              this.getUserArgitalpenak(this.user_id);
          },
          error=>{
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                console.log(this.errorMessage);
              }
          }
        );
    },
    error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
    }
  );
}

semaforoDesAldatu(num,semaphoreId){
  var des;
  if(num==0){
    des=this.description;
  }
  if(num==1){
    des=this.description2;
  }

  console.log("aldatuko den argitalpenaren id: "+semaphoreId)
  this._semaphoreService.getSemaphore(semaphoreId).subscribe(
    result=>{
      var sem=result.semaphore;
        sem.description=des;
        this._semaphoreService.updateSemaphore(semaphoreId,sem).subscribe(
          result=>{
              console.log("bueltako semaforo description: "+result.semaphore.description)
              //location.reload()
              this.description="";
              this.description2="";
              this.getUserArgitalpenak(this.user_id);
          },
          error=>{
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                console.log(this.errorMessage);
              }
          }
        );
    },
    error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
    }
  );
}

aldaketaGaitu(){
    console.log("sartzen da aldatzera horrela "+this.aldatu)
    if(this.aldatu==true){
      console.log("sartzen da truera")
      this.aldatu=false;
      console.log("aldaturen balioa1 "+this.aldatu)
    }
    else if(this.aldatu==false){
      this.aldatu=true;
      console.log("aldaturen balioa2 "+this.aldatu)
    }
  }

  gustuko(publication){
    var badago=false;
    for(var i=0;i<publication.gustuko.length;i++){
        if(publication.gustuko[i]==this.userMe._id){
          badago=true;
        }
    }

    if(badago==false){
      console.log("erabiltzaile honen gustukoa ez dago")
      console.log("publication: "+publication._id)
      console.log("user: "+this.userMe._id)
      this._publicationService.addGustukoDut(publication._id,this.userMe).subscribe(
        result=>{
          console.log("ondo gehitu da gustukoa")
          //location.reload();
          this.getUserArgitalpenak(this.user_id);
        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }else if(badago==true){
      console.log("erabiltzaile honen gustukoa jadanik badago")
      this._publicationService.deleteGustukoDut(publication._id,this.userMe._id).subscribe(
        result=>{
          console.log("ondo kendu da gustukoa")
          //location.reload();
          this.getUserArgitalpenak(this.user_id);
        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }

  }

  aukeraGaitu(){
    if(this.aukeraGaituta==true){
      this.aukeraGaituta=false;
    }else if(this.aukeraGaituta==false){
      this.aukeraGaituta=true;
    }
  }

  deletePublication(publicationId){
    console.log("deletePublicationera sartzen da "+publicationId)
    this._publicationService.deletePublication(publicationId).subscribe(
      result=>{
        console.log("ondo ezabatu da argitalpena")
        //location.reload();
        this.getUserArgitalpenak(this.user_id);
      },error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );
  }

  datuakBistaratu(){
    this.datuak=true;
  }

  argitalpenakBistaratu(){
    this.datuak=false;
  }

  eguneratu(user){
    console.log("sartzen da eguneratzera");
    this.datuak=true;
    this.nirepublications=[];
  }


public logout(){
  localStorage.removeItem('token');
  this._router.navigate(['/']);
}

}
