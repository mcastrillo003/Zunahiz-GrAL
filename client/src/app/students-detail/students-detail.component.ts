// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image'
import {SemaphoreService} from '../services/semaphore.service';
import {Semaphore} from '../models/semaphore';
import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication';

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'students-detail',
templateUrl: './students-detail.html',

styleUrls: ['../app.component.css','./students-detail.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService,ImageService,SemaphoreService, PublicationService]
})

// Clase del componente donde irán
export class StudentsDetailComponent implements OnInit {

//Session
public userMe:User;
public token:String;


public user: User;
public errorMessage: any;

public apiUrl:string;
public image:Image;
public portadaUser:Image;
public isAdmin:boolean;
public admin:User;

public users:User[];
public userDisplay:User;
public bist:boolean;

public nirepublications:Publication[]=[];
public argitalpenKop:Number;
public gorriKop:number;
public horiKop:number;
public berdeKop:number;
public grisKop:number;
public estatistika:boolean;

constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _semaphoreService: SemaphoreService,
  private _publicationService: PublicationService,
  private _route: ActivatedRoute,
  private _router: Router
){
}

ngOnInit(){
  this.isAdmin=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.bist=false;
  this.estatistika=false;
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

    //administrariaren datuak lortu konprobaketak egiteko

        this.admin=new User("","","","","","","","","","");
        this._userService.getAdmin().subscribe(
          result => {
            this.admin = result.user[0];
            if(this.userMe._id==this.admin._id){
                this.isAdmin=true;
            }else{
                this.isAdmin=false;
                this._router.navigate(['/main-page']);
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

      this.getUsers();
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

  erabiltzaileaEzabatu(){
    console.log(this.userDisplay.firstName+" erabiltzailea ezabatzera sartzen da")
    this._userService.deleteUser(this.userDisplay._id).subscribe(
      result=>{
          console.log("ondo ezabatu da erabiltzailea: "+this.userDisplay.firstName)
          //location.reload();
          this.getUsers();
      },
      error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );
  }
  public getUserArgitalpenak(userId){
    this.argitalpenKop=0;
    this.gorriKop=0;
    this.berdeKop=0;
    this.horiKop=0;
    this.grisKop=0;

    this._publicationService.getUsersArgitalpenak2(userId).subscribe(
      result=>{
          this.nirepublications=result.publications;
          console.log("dauzen publicationak: "+this.nirepublications.length);
          this.argitalpenKop=this.nirepublications.length;
          for(var i=0;i<this.nirepublications.length;i++){
            console.log("nirepublications.semaoforoak "+this.nirepublications[i].semaforoak[0])
            this._semaphoreService.getSemaphore(this.nirepublications[i].semaforoak[0]).subscribe(
              result=>{
                console.log("result image: "+result.semaphore.image)
                if(result.semaphore.image=="semaforoGorria.png"){
                  this.gorriKop=this.gorriKop+Number(1);
                }
                else if(result.semaphore.image=="semaforoHoria.png"){
                  this.horiKop=this.horiKop+1;
                }
                else if(result.semaphore.image=="semaforoBerdea.png"){
                  this.berdeKop=this.berdeKop+1;
                }
                else if(result.semaphore.image=="semaforoGrisa.png"){
                  this.grisKop=this.grisKop+1;
                }
                console.log("gorriKop "+this.gorriKop)
                console.log("horiiKop "+this.horiKop)
                console.log("berdeKop "+this.berdeKop)
                console.log("grisKop "+this.grisKop)
              },
              error=>{
                console.log("errorea userraren argitalpenen semaforoa lortzean")
              }
            );
          }

      },
      error=>{
        this.errorMessage = <any>error;

        if(this.errorMessage != null){
          console.log(this.errorMessage);
      }
    });
  }

  public bistaratu(user){
    this.bist=true;
    this.userDisplay=user;
    console.log("argazkia.picture: "+user.argazkia.picture)
    this.getUserArgitalpenak(user._id);
    this.estatistika=true;
  }
  public logout(){
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

}
