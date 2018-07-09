// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker'

import {Credential} from '../models/credential';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: './src/register',
templateUrl: './register.html',

styleUrls: ['../app.component.css','./register.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService, ImageService]
})

// Clase del componente donde irán
export class RegisterComponent implements OnInit {

//Session
public token:any;


  public errorMessage: any;
  public credentials: Credential;
  public data: any;
  public noUser:boolean;

  public userMe:User;
  public image:Image;
  public apiUrl:string;

  constructor(
    private _userService: UserService,
    private _imageService: ImageService,
    private _route: ActivatedRoute,
    private _router: Router
  ){}

  ngOnInit(){
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
      this.userMe.portada=temp.portada;
      this.userMe.argazkia=temp.argazkia;

      this._imageService.getImage(this.userMe.argazkia).subscribe(
          result=>{
              this.image=result.image;
              if(!this.image){
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

    this.credentials=new Credential("","","","","","","","")
      console.log(JSON.parse(localStorage.getItem('token')));

  }

  onSubmit(){
    this._userService.register(this.credentials).subscribe(
      response => {
        this.token = response;
        console.log("tokena: "+response)
        if(this.token.length <=1){
          alert('Error en la petición');
        }
        this._router.navigate(['/students']);

      },
      error => {
        this.errorMessage = <any>error;

        if(this.errorMessage != null){
          this.noUser=true;
        }
      });
    }

    public logout(){
      localStorage.removeItem('token');
      this._router.navigate(['/']);
    }
}
