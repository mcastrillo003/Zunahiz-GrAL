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
import {INgxMyDpOptions,IMyDateModel} from 'ngx-mydatepicker';

//Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

//Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
  selector: 'foroa',
  templateUrl: './foroa.html',

  styleUrls: ['../app.component.css','./foroa.css'],

  // para injectar el objeto en el componenete, hay que utilizar providers
  providers: [UserService, ImageService,PublicationService,CommentService, SemaphoreService,UserService]
})

//Clase del componente donde irán
export class ForoaComponent implements OnInit {

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
public currentday:string;
public placeid: string;
public calendar: Publication[]=[];
//Future PLAN
public egunaPublication: string;
public hilabeteaPublication: string;
public urteaPublication: string;

//bestelakoak
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
public users:User[];
public ngxmydatepicker:string;

//semaforo aldaketak egiteko
public koloreak=[{name:"gorria"},{name:"horia"},{name:"berdea"},{name:"grisa"}];
public kolorea:string;
public kolorea2:string;
public description:string;
public description2:string;
public aldatu:boolean;

//admnistraria kudeatzeko
public isAdmin:boolean;
public admin:User;
public user: User;




constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _publicationService: PublicationService,
  private _commentService: CommentService,
  private _semaphoreService: SemaphoreService,
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
  this.type="foroa";

  window.scrollTo(0, 0);

  //Session;
  this.userMe=new User("","","","","","","","","","");
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

    //Calendar
  this.currentmonth = new Date().toISOString().slice(5,7);
  this.hilabetea = this.currentmonth;
  this.currentyear = new Date().toISOString().slice(0,4);
  this.urtea = this.currentyear;
  this.getEginbeharrakByMonth(this.urtea,this.hilabetea);

  //View future plans
  this.urteaPublication = this.currentyear;
  this.hilabeteaPublication = this.currentmonth;
  this.egunaPublication= new Date().toISOString().slice(8,10);

    this.apiUrl=this._imageService.getApiUrl('get-image/');
    this.userArgazkiaUrl=this._imageService.getApiUrl('getUserImage/');
    this._route.params.forEach((params:Params)=>{
          //let id=params['id'];
          this._imageService.getImage(this.userMe.argazkia).subscribe(
              result=>{//vamos a capturar toda la info que llega de getAlbums
                  this.image=result.image;
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

        this.getForoak();
        this.getUsers();

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
  console.log("currentyear"+this.currentyear)
  this.urtea = this.currentyear;

  //View future plans
  this.urteaPublication = this.currentyear;
  this.hilabeteaPublication = this.currentmonth;
  this.egunaPublication= new Date().toISOString().slice(8,10);

}

onDateChanged(event: IMyDateModel): void {
//console.log(event.formatted);
}

public getEginbeharrakByMonth(urtea: string, hilabetea: string){
  var hilabeteaN=Number(hilabetea)
  if(hilabeteaN<10){
    hilabetea=hilabetea.slice(1,2);
  }
    console.log(hilabetea)


  this._publicationService.getEginbeharrakByMonth(urtea,hilabetea).subscribe(
    result => {
      console.log("GetPlansByMonth eginik...");
      console.log(result);

      var calendar2:Publication[] = [];
      this.calendar = [];
      calendar2 = result.publications;  //aquí están guardados nuestros objetos en JSON
      var lengthplans=calendar2.length;
      for (var i = 0; i < lengthplans; i++){
        if((Number(calendar2[i].noizkoUrtea)>Number(this.urteaPublication)) ||
          ((Number(calendar2[i].noizkoUrtea)==Number(this.urteaPublication)) && (Number(calendar2[i].noizkoHilabetea)>Number(this.hilabeteaPublication))) ||
          ((Number(calendar2[i].noizkoUrtea)==Number(this.urteaPublication)) && (Number(calendar2[i].noizkoHilabetea)==Number(this.hilabeteaPublication)) && (Number(calendar2[i].noizkoEguna)>=Number(this.egunaPublication)))){
            this.calendar.push(calendar2[i]);
          }
      }
      console.log("calendarren tamaina "+this.calendar.length)
    },
    error => {
      console.log("errorea getEginbeharrakByMonths-en")
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
      }
    }
  );
}

public getEginbeharrak(){
  this._publicationService.getEginbeharrak().subscribe(
    result=>{
        this.eginbeharrak=result.publications;
        console.log("dauzen eginbehar kop: "+this.eginbeharrak.length);
    },
    error=>{
      this.errorMessage = <any>error;

      if(this.errorMessage != null){
        console.log(this.errorMessage);
    }
  });
}


getUsers(){
  var pos=null;
  this._userService.getUsers().subscribe(
    result=>{
      this.users=result.users;
      console.log("erabiltzaileak ondo lortu dira. zenbat erabiltzaile: "+this.users.length)
      //admin kendu
      for(var i=0;i<this.users.length;i++){
          if(this.users[i]._id==this.admin._id){
            pos=i;
          }
      }

        this.users.splice(pos,1);
        this.users=result.users;
        console.log("erabiltzaileak admin kendu ondoren, zenbat erabiltzaile: "+this.users.length)
    },
    error=>{
      this.errorMessage = <any>error;
      if(this.errorMessage != null){
        console.log(this.errorMessage);
      }
    }
  );
}


public getForoak(){
  this._publicationService.getForoak().subscribe(
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

public nextMonth(){
  this.calendar=[];
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
  this.getEginbeharrakByMonth(this.urtea,this.hilabetea);
}
public prevMonth(){
  this.calendar=[];
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
    this.getEginbeharrakByMonth(this.urtea,this.hilabetea);
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
                this.getForoak();
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
            this.getForoak();
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
                  this.getForoak();
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
                  this.getForoak();
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
            this.getForoak();
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
            this.getForoak();
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
          this.getForoak();
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
