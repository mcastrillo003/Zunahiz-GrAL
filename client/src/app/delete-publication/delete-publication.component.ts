// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication';
import {DutyService} from '../services/duty.service';
import {Duty} from '../models/duty';

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'delete-publication',
templateUrl: './delete-publication.html',

styleUrls: ['../app.component.css','./delete-publication.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService, ImageService, PublicationService,DutyService]
})


// Clase del componente donde irán
export class DeletePublicationComponent implements OnInit {

//Session
public userMe:User;
public token:String;


//Future PLAN
public egunaPlan: string;
public hilabeteaPlan: string;
public urteaPlan: string;

public isme: boolean;
public publi_id: string;

public publication: Publication;
public duty:Duty;
public errorMessage: any;

public isAdmin:boolean;
public admin:User;
public image:Image;
public apiUrl:string;
public type:string;
public isEginbeharra:boolean;

constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _publicationService: PublicationService,
  private _dutyService: DutyService,
  private _route: ActivatedRoute,
  private _router: Router
){}

ngOnInit(){
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.isEginbeharra=false;
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
    this.publi_id = params['id'];
    this.type=params['mota'];
    console.log("jaso den type params "+params['mota'])
    console.log("typen gorde den type "+this.type)

    if(this.type=="eginbeharra"){
      this.isEginbeharra=true;
      console.log("eginbeharra? "+this.isEginbeharra)
      this._dutyService.getEginbeharra(this.publi_id).subscribe(
        result => {
          this.duty = result.publication;
          console.log(this.duty);
          if(!this.duty){
            console.log("ez dago id hori duen eginbeharra");
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

    }else{
      this.isEginbeharra=false;
      console.log("eginbeharra? "+this.isEginbeharra)
      this._publicationService.getPublication(this.publi_id).subscribe(
        result => {
          this.publication = result.publication;
          console.log(this.publication);
          if(!this.publication){
            console.log("ez dago id hori duen argitalpenik");
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
    }
  });
}

Delete(){
  console.log("deletean sartu da");

  if(this.type=="eginbeharra"){
    console.log("ezabatzera noan eginbehar id: "+this.duty._id)
    this._dutyService.deleteEginbeharra(this.duty._id).subscribe(
      result => {
        console.log("Eginbeharra ondo ezabatu da!");
            this._router.navigate(['/duties']);
        },
      error => {
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
       }
     }
   );
 }else{
   console.log("ezabatzera noan argitalpen id: "+this.publication._id)
   this._publicationService.deletePublication(this.publication._id).subscribe(
     result => {
         if(this.type=="argitalpena"){
           console.log("Argitalpena ondo ezabatu da!");
           this._router.navigate(['/main-page']);
         }
         if(this.type=="foroa"){
           console.log("Foroa ondo ezabatu da!");
           this._router.navigate(['/foroa']);
         }

       },
     error => {
       this.errorMessage = <any>error;
       if(this.errorMessage != null){
         console.log(this.errorMessage);
      }
    }
  );
 }
}

Cancel(){
  console.log("cancel-ean sartu da");
  if(this.type=="argitalpena"){
    this._router.navigate(['/main-page']);
  }
  if(this.type=="eginbeharra"){
    this._router.navigate(['/duty',this.duty._id]);
  }
  if(this.type=="foroa"){
    this._router.navigate(['/foroa']);
  }
}


public logout(){
  localStorage.removeItem('token');
  this._router.navigate(['/']);
}

}
