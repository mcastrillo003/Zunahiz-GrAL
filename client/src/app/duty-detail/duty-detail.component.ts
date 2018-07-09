// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication'
import {SemaphoreService} from '../services/semaphore.service';
import {Semaphore} from '../models/semaphore';
import {DutyService} from '../services/duty.service';
import {Duty} from '../models/duty';

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'duty-detail',
templateUrl: './duty-detail.html',

styleUrls: ['../app.component.css','./duty-detail.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService,ImageService, PublicationService,SemaphoreService,DutyService]
})

// Clase del componente donde irán
export class DutyDetailComponent implements OnInit {

//Session
public userMe:User;
public token:String;


public user: User;
public errorMessage: any;

public apiUrl:string;
public userArgazkiaUrl:string;
public image:Image;
public portadaUser:Image;
public isAdmin:boolean;
public admin:User;

public publications:Publication[];
public publication:Publication;
public publiDisplay:Publication;
public publiComes:Publication;
public bist:boolean;
public publiId:string;
public existsParam:boolean;
public responses:Publication[]=[];

//semaforo aldaketak egiteko
public koloreak=[{name:"gorria"},{name:"horia"},{name:"berdea"},{name:"grisa"}];
public kolorea:string;
public description:string;
public description2:string;
public aldatu:boolean;
public urlSemaphore:string;
public type:string;
public typeToSend:string;
public paramsId:string;

constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _publicationService: PublicationService,
  private _semaphoreService: SemaphoreService,
  private _dutyService: DutyService,
  private _route: ActivatedRoute,
  private _router: Router
){
}

ngOnInit(){
  this.isAdmin=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.bist=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.userArgazkiaUrl=this._imageService.getApiUrl('getUserImage/');
  this.urlSemaphore="../../assets/images/";
  this.aldatu=false;
  this.existsParam=false;
  this.type="eginbeharra";
  this.paramsId=null;
  this.typeToSend="argitalpena";

  window.scrollTo(0, 0);

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

        //parametroa datorren edo ez ikusi
        this._route.params.forEach((params:Params)=>{
          let id=params['id'];
          this.paramsId=id;
          if(id!=null){
            this.existsParam=true;
            console.log("parametroa jaso du? "+this.existsParam)
            this._dutyService.getEginbeharraWithoutFileData(id).subscribe(
                result=>{
                    this.publiComes=result.publication;
                    console.log("lortzen den argitalpena: "+this.publiComes._id)
                    console.log("publiComes file"+this.publiComes.file)
                    this._publicationService.getPublicationsOfDuty(this.publiComes._id).subscribe(
                      result=>{
                        this.responses=result.publications;
                        console.log("lortzen diren argitalpen kop: "+this.responses.length)
                      },
                      error=>{
                        console.log("errorea eginbehar horren erantzunak lortzen edo ez daude")

                      }
                    );
                },
                error=>{
                    this.errorMessage=<any>error;

                    if(this.errorMessage!=null){
                        console.log(this.errorMessage);
                        //this._router.navigate(['/']);
                        console.log("errorea publiComes lortzean")
                    }

                }
            );

          }

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

      this.getEginbeharrak();
    }

    getEginbeharrak(){
      this._dutyService.getEginbeharrak().subscribe(
        result=>{
          this.publications=result.publications;
          console.log("eginbeharrak ondo lortu dira. zenbat eginbehar: "+this.publications.length)

        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }

    getPubliDisplay(){
      this._dutyService.getEginbeharraWithoutFileData(this.paramsId).subscribe(
        result=>{
          this.publiDisplay=result.publication;
          console.log("eginbeharra ondo lortu da. zenbat eginbehar: "+this.publiDisplay._id)
          console.log("noizko data: "+this.publiDisplay.noizko)
        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }

    getPubliComes(){
      this._dutyService.getEginbeharraWithoutFileData(this.paramsId).subscribe(
        result=>{
          this.publiComes=result.publication;
          console.log("eginbeharra ondo lortu da. zenbat eginbehar: "+this.publiComes._id)
          console.log("noizko data: "+this.publiComes.noizko)
        },
        error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
        }
      );
    }

  eginbeharraEzabatu(){
    console.log(this.publiDisplay.izenburua+" izenburudun eginbeharra ezabatzera sartzen da")
    this._dutyService.deleteEginbeharra(this.publiDisplay._id).subscribe(
      result=>{
          console.log("ondo ezabatu da eginbeharra: "+this.publiDisplay._id)
          //location.reload();
          this.getEginbeharrak();
      },
      error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );
  }

  public bistaratu(publi){
    this.existsParam=false;
    this.bist=true;
    this.publiId=publi;
    this.publiDisplay=publi;
    console.log("publiDislpay duty "+this.publiDisplay.duty)

    this._publicationService.getPublicationsOfDuty(this.publiDisplay._id).subscribe(
      result=>{
        this.responses=result.publications;
        console.log("lortzen diren argitalpen kop: "+this.responses.length)
      },
      error=>{
        console.log("errorea eginbehar horren erantzunak lortzen edo ez daude")

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

  public semaforoaAldatzen(num,semaphoreId,publiId){
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
    console.log("semaforoa aldatzen sartzen da")

    this._semaphoreService.getSemaphore(semaphoreId).subscribe(
      result=>{
        var sem=result.semaphore;
          sem.image=izena;
          this._semaphoreService.updateSemaphore(semaphoreId,sem).subscribe(
            result=>{
                //location.reload()
                this.kolorea="";
                this.paramsId=publiId;
                this.getEginbeharrak();
                this.getPubliDisplay();
                this.getPubliComes();
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

  semaforoDesAldatu(num,semaphoreId,publiId){
    var des;
    if(num==0){
      des=this.description;
    }

    console.log("aldatuko den argitalpenaren id: "+semaphoreId)
    this._semaphoreService.getSemaphore(semaphoreId).subscribe(
      result=>{
        var sem=result.semaphore;
          sem.description=des;
          this._semaphoreService.updateSemaphore(semaphoreId,sem).subscribe(
            result=>{
                console.log("bueltako semaforo description: "+result.semaphore.description)
                this.paramsId=publiId;
                this.description="";
                this.getEginbeharrak();
                this.getPubliDisplay();
                this.getPubliComes();
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

  public logout(){
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

}
