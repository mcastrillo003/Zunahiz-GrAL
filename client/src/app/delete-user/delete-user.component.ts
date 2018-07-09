// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'delete-user',
templateUrl: './delete-user.html',

styleUrls: ['../app.component.css','./delete-user.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService, ImageService]
})

// Clase del componente donde irán
export class DeleteUserComponent implements OnInit {

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

public isAdmin:boolean;
public admin:User;
public image:Image;
public apiUrl:string;

constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _route: ActivatedRoute,
  private _router: Router
){}

ngOnInit(){
  this.isAdmin=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  //Session
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
  }


  this._route.params.forEach((params: Params) => {
    console.log("params ikusten da ondoren:");
    console.log(params);
    this.user_id = params['user._id'];

    //Is my profile?
    if(this.user_id==this.userMe._id){
      this.isme=true;
    }
    else{this.isme=false}

    this._userService.getUserByID(this.user_id).subscribe(
      result => {
        this.user = result.user;  //aquí están guardados nuestros objetos en JSON
        console.log(this.user);
        if(!this.user){
          console.log("ez dago id hori duen erabiltzailerik");
          this._router.navigate(['/main-page']);
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
  //administrariaren datuak lortu konprobaketak egiteko

      this.admin=new User("","","","","","","","","","");
      this._userService.getAdmin().subscribe(
        result => {
          this.admin = result.user[0];
          /*if(this.userMe._id==this.admin._id){
            this.isAdmin=true;
            console.log("Administraria da");
          }else{
            this.isAdmin=false;
            console.log("Ez da administraria");
            console.log("nire id: "+this.userMe._id)
            console.log("admin id: "+this.admin._id)
          }*/
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

Delete(){
  console.log("deletean sartu da");
  console.log("ezabatzera noan id: "+this.user._id)
  //irakasleak erabiltzailea ezabatu
  this._userService.deleteUser(this.user._id).subscribe(
    result => {
      console.log("Erabiltzailea ondo ezabatu da!");
      //localStorage.removeItem('token');
      this._router.navigate(['/students']);
      },
    error => {
      this.errorMessage = <any>error;
      if(this.errorMessage != null){
        console.log(this.errorMessage);
     }
   }
 );

}

Cancel(){
  console.log("cancel-ean sartu da");
  this._router.navigate(['/students']);
}


public logout(){
  localStorage.removeItem('token');
  this._router.navigate(['/']);
}

}
