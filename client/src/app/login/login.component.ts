// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {Credential} from '../models/credential';

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'login',
templateUrl: './login.html',
styleUrls: ['../app.component.css','./login.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService]
})

// Clase del componente donde irán
export class LoginComponent implements OnInit {
  public errorMessage: any;

  //Session
  public cred:Credential;
  public noUser:boolean;
  public user:User;
  public token:any;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){}

  ngOnInit(){
    if(this._userService.getToken()!=null){
      this._router.navigate(['/main-page']);
    }
    this.noUser=false;
    this.cred=new Credential("","","","","","","","")
      console.log(JSON.parse(localStorage.getItem('token')));
  }

  onSubmit(){
    console.log(this.cred.username);
    console.log(this.cred.password);
    this._userService.login(this.cred.username,this.cred.password).subscribe(
      response => {
        console.log(response)
        this.token = response;
        if(this.token.length <=1){
          alert('Error en el servidor');
        }{
          if(!this.token.status){
            localStorage.setItem('token',JSON.stringify(this.token));
            console.log(JSON.parse(localStorage.getItem('token')));
          }
        }
        this._router.navigate(['/main-page']);
      },
      error => {
        this.errorMessage = <any>error;

        if(this.errorMessage.status == 401){
          this.noUser=true;
        }
        else if(this.errorMessage != null){
          console.log(this.errorMessage);
          alert('Error en la petición');
        }
      });
  }
}
