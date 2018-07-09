import {Injectable} from '@angular/core';
//objeto que nos permite injectar clases, así podemos tener una instancia de un objeto sin hacer new

import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';               //nos permite mapear las respuestas de los servicios
import {Observable} from 'rxjs/Observable';

import {User} from '../models/user';
import {Credential} from '../models/credential';


@Injectable()  // sin ;
export class UserService{
  public url: string;
  public token: string;

//cuando creemos un objeto, se ejecuta el método constructor,
// y de esta forma, a _http le asigna un valor que le llega
// automáticamente, sin tener que definirlo fuera

  constructor(private _http: Http){
    this.url = 'http://192.168.0.24:3000/zunahiz/';
  }

  public login(username:String, password:String){
    let json = JSON.stringify({'username':username, 'password':password});  //parsea objeto plan y lo convierte a string json
    let params = json;
    let headers = new Headers({'Content-Type':'application/json'});

    return this._http.post(this.url+'login',params,{headers: headers})
                     .map(res => res.json());  //convertimos el texto del json en un objeto json
  }
  public register(credentials: Credential){
    let json = JSON.stringify(credentials);  //parsea objeto plan y lo convierte a string json
    let params = json;
    let headers = new Headers({'Content-Type':'application/json'});

    return this._http.post(this.url+'register',params,{headers: headers})
                     .map(res => res.json());  //convertimos el texto del json en un objeto json
  }
  public getToken(){
    let token= JSON.parse(localStorage.getItem('token'));
    if (token == "undefined"){
      token = null;
    }
    return token;
  }

  public getUsers(){
    return this._http.get(this.url+'users')
                     .map(res => res.json());
  }

  public getUserDetails(){
    const token:string = this.getToken().token;
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public getUserByID(id: string){
    return this._http.get(this.url+'user/'+id)
                     .map(res => res.json());  //convertimos el texto del json en un objeto json
  }

  public getAdmin(){
    return this._http.get(this.url+'admin')
                     .map(res => res.json());  //convertimos el texto del json en un objeto json
  }

  public getUsersByName(sartutakoa){
    return this._http.get(this.url+'usersByName/'+sartutakoa)
                     .map(res => res.json());
  }

  public deleteUser(id: string){
    return this._http.delete(this.url+'user/'+id)
                     .map(res => res.json());
  }

  public updateUser(user: User){
    var id = user._id;
    let json = JSON.stringify(user);  //parsea objeto plan y lo convierte a string json
    let params = json;
    let headers = new Headers({'Content-Type':'application/json'});

    return this._http.put(this.url+'user/'+id,params,{headers: headers})
                     .map(res => res.json());  //convertimos el texto del json en un objeto json
  }
}
