// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication';
import {CommentService} from '../services/comment.service';
import {Comment} from '../models/comment';
import {SemaphoreService} from '../services/semaphore.service';
import {Semaphore} from '../models/semaphore';
import {DutyService} from '../services/duty.service';
import {Duty} from '../models/duty';

//Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

//Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
  selector: 'main-page',
  templateUrl: './main-page.html',

  styleUrls: ['../app.component.css','./main-page.css'],

  // para injectar el objeto en el componenete, hay que utilizar providers
  providers: [UserService, ImageService,PublicationService,CommentService, SemaphoreService,UserService,DutyService]
})

//Clase del componente donde irán
export class MainPageComponent implements OnInit {

public errorMessage: any;

//Session
public userMe:User;
public token:String;

//Calendar
//public calendar:Plan[] = [];
public hilabetea:string;
public currentmonth:string;
public urtea:string;
public currentyear:string;
public eguna:string;
public currentday:string;

public image:Image;
public apiUrl:string;
public fileUrl:string;
public userArgazkiaUrl:string;
public urlSemaphore:string;
public publications:Publication[];
public comment:Comment;
public publication:Publication;
public aukeraGaituta:boolean;
public type:string;
public eginbeharrak:Publication[];
public eginbeharra="eginbeharra";
public ikaslea:User
public finding:boolean;
public ikasleak:User[];
public bilaketaErakutsi:boolean;

//semaforo aldaketak egiteko
public koloreak=[{name:"gorria"},{name:"horia"},{name:"berdea"},{name:"grisa"}];
public kolorea:string;
public kolorea2:string;
public description:string;
public description2:string;
public aldatu:boolean;
//chat semaforoa
public chatSemaphore:Semaphore;

//admnistraria kudeatzeko
public isAdmin:boolean;
public admin:User;
public user: User;
public plataformaGidaId:string;


constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _publicationService: PublicationService,
  private _commentService: CommentService,
  private _semaphoreService: SemaphoreService,
  private _dutyService: DutyService,
  private _route: ActivatedRoute,
  private _router: Router
){}

ngOnInit(){
  //hasieratu
  this.comment=new Comment("","","","");
  this.urlSemaphore="../../assets/images/";
  this.kolorea=null;
  this.kolorea2=null;
  this.description=null;
  this.description2=null;
  this.isAdmin=false;
  this.aldatu=false;
  this.fileUrl="assets/images/";
  this.aukeraGaituta=false;
  this.type="argitalpena";
  this.finding=false;
  this.ikasleak=[];
  this.bilaketaErakutsi=false;
  this.eginbeharrak=[];
  this.plataformaGidaId="5b221d30ee77fe28d0696295";

  //Calendar
this.currentmonth = new Date().toISOString().slice(5,7);
this.hilabetea = this.currentmonth;
this.currentyear = new Date().toISOString().slice(0,4);
this.urtea = this.currentyear;
this.currentday=new Date().toISOString().slice(8,10);
this.eguna=this.currentday;
if(this.eguna[0]=='0'){
  this.eguna=this.eguna[1];
}
console.log("gaurko eguna "+this.eguna)

  //Session;
  this.userMe=new User("","","","","","","","","","");
  this.ikaslea=new User("","","","","","","","","","");
  if(this._userService.getToken()==null){
    this._router.navigate(['/']);
  }else
  {
    var temp=this._userService.getUserDetails();
    this.userMe._id=temp._id;
    this.userMe.username=temp.username;
    this.userMe.firstName=temp.firstName;
    this.userMe.portada=temp.portada;
    this.userMe.argazkia=temp.argazkia;
    console.log("userMe:"+this.userMe)
    console.log(JSON.parse(localStorage.getItem('token')))

    this.apiUrl=this._imageService.getApiUrl('get-image/');
    //this.userArgazkiaUrl=this._imageService.getApiUrl('getUserImage/');
    this.userArgazkiaUrl=this._imageService.getApiUrl('getUimage/');

    this._route.params.forEach((params:Params)=>{
          //let id=params['id'];
          this._imageService.getImage(this.userMe.argazkia).subscribe(
              result=>{//vamos a capturar toda la info que llega de getAlbums
                  this.image=result.image;
                    this.userArgazkiaUrl=this._imageService.getApiUrl('getUimage/');
                  this.getPublications();
                  //location.reload();
                  this.getEginbeharrak();
                  this.getChatSemaphore();
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
        });



        //administrariaren datuak lortu konprobaketak egiteko
            this.admin=new User("","","","","","","","","","");
            this._userService.getAdmin().subscribe(
              result => {
                this.admin = result.user[0];
                if(this.userMe._id==this.admin._id){
                    this.isAdmin=true;
                  }else{
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
      }


  //Calendar
  this.currentmonth = new Date().toISOString().slice(5,7);
  this.hilabetea = this.currentmonth;
  this.currentyear = new Date().toISOString().slice(0,4);
  this.urtea = this.currentyear;

}

koloreaSortu(){
  console.log("koloreakSortun sartzen da!!!!!!!!!!!!!!!!!")
}

bilatu(){
  this.finding=true;
  console.log("bilatura sartzen da honako balioaz: "+this.ikaslea.firstName);

  if(this.ikaslea.firstName==""){
    this.finding=false;
  }else{
    var sartutakoa=this.ikaslea.firstName.toLowerCase();
    console.log("sartutakoa "+sartutakoa)

    this._userService.getUsersByName(sartutakoa).subscribe(
      result=>{
          this.ikasleak=result.users;
          //for(var i=0;i)
      },
      error=>{
        this.ikasleak=[];
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );
  }
}

public findingAldatu(){
  console.log("finding sartzean "+this.finding)
  if(this.finding==true){
    this.finding=false;
    console.log("finding irtetzean "+this.finding)
  }
  else if(this.finding==false){
    this.finding=true;
    console.log("finding irtetzean "+this.finding)
  }
}

public getPublications(){
  //this._publicationService.getArgitalpenak().subscribe(
  this._publicationService.getPubliForo().subscribe(
    result=>{
        this.publications=result.publications;
        console.log("dauzen publicationak: "+this.publications);
    },
    error=>{
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
    }
  });
}

public getEginbeharrak(){
  this._dutyService.getEginbeharrak().subscribe(
    result=>{
        var eginbeharrak2=result.publications;
        console.log("dauzen eginbehar kop: "+eginbeharrak2.length);
        for(var i=0;i<eginbeharrak2.length;i++){
          if((Number(eginbeharrak2[i].noizkoUrtea)>Number(this.currentyear)) ||
            ((Number(eginbeharrak2[i].noizkoUrtea)==Number(this.currentyear)) && (Number(eginbeharrak2[i].noizkoHilabetea)>Number(this.currentmonth))) ||
            ((Number(eginbeharrak2[i].noizkoUrtea)==Number(this.currentyear)) && (Number(eginbeharrak2[i].noizkoHilabetea)==Number(this.currentmonth)) && (Number(eginbeharrak2[i].noizkoEguna)>=Number(this.currentday)))){
              this.eginbeharrak.push(eginbeharrak2[i]);
            }
        }
    },
    error=>{
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
    }
  });
}

public nextMonth(){
  if(this.hilabetea!="12")
  {
    console.log(this.hilabetea)
    var hilabeteaN=Number(this.hilabetea)+1;
    if(hilabeteaN<10){
      this.hilabetea="0".concat(hilabeteaN.toString());
      console.log(this.hilabetea)
    }
    else{
      this.hilabetea=hilabeteaN.toString()
    }
  }
  else
  {
    this.hilabetea="01";

    var urteaN=Number(this.urtea)+1;
    this.urtea=urteaN.toString();
  }
}
public prevMonth(){
  console.log("hilabetea"+this.hilabetea)
  console.log("currentmonth"+this.currentmonth)
  if(this.hilabetea==this.currentmonth && this.urtea==this.currentyear){}
  else
  {
    if(this.hilabetea!="01")
    {
      var hilabeteaN=Number(this.hilabetea)-1;
      if(hilabeteaN<10){
        this.hilabetea="0".concat(hilabeteaN.toString());
        console.log(this.hilabetea)
      }
      else{
        this.hilabetea=hilabeteaN.toString()
      }
    }
    else{
      this.hilabetea="12";
      var urteaN=Number(this.urtea)-1;
      this.urtea=urteaN.toString();
    }
  }
  }

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
                this.getPublications();
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
            this.getPublications();
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
      }if(this.kolorea2=="grisa"){
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
                  this.getPublications();
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
                  this.getPublications();
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

    public getChatSemaphore(){
      this._semaphoreService.getChatSemaphore().subscribe(
      result=>{
        this.chatSemaphore=result.semaphore[0];
        console.log("badago chatSemaphore sortuta")
        console.log("chatSemaphore image "+this.chatSemaphore.image)
      },
      error=>{
        //ez badago, sortu
        console.log("ez dago chatSemaphore sortuta")
        this._semaphoreService.createChatSemaphore().subscribe(
        result=>{
          console.log("sortu da chatSemaphore")
          this.chatSemaphore=result.semaphore;
        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );

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
            this.getPublications();
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
            this.getPublications();
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
          this.getPublications();
        },error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }

  public logout(){
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

}
