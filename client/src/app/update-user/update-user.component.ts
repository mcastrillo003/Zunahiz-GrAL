// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image'


import {GLOBAL} from '../services/global';

import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker'

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

// Decorador component, indicamos en qué etiqueta se va a cargar la plantilla
@Component({
selector: 'update-user',
templateUrl: './update-user.html',
styleUrls: ['../app.component.css','./update-user.css'],

// para injectar el objeto en el componenete, hay que utilizar providers
providers: [UserService, ImageService]
})

// Clase del componente donde irán
export class UpdateUserComponent implements OnInit {

//Session
public userMe:User;
public token:any;

public errorMessage: any;

public data: any;
public user: User;

public apiUrl:string;
public image:Image;
public portadaUser:Image;
public aldaketaGaituta:boolean;
public aldaketaGaituta2:boolean;
public datuakAldatuta:boolean;

public resultUpload;
public filesToUpload: Array<File>;

// Date
public myOptions: INgxMyDpOptions = {
        dayLabels:	{su: 'ig', mo: 'al', tu: 'as', we: 'az', th: 'os', fr: 'or', sa: 'ig'},
        monthLabels: {1:'urt',2:'ots',3:'mar',4:'api',5:'mai',6:'eka',7:'uzt',8:'abu',9:'ira',10:'urr',11:'aza',12:'abe'},
        dateFormat: 'yyyy-mm-dd',
        sunHighlight:true,
        satHighlight:true,
        todayBtnTxt: 'Gaur',
        monthSelector:true,
        yearSelector:true,
        markCurrentDay:true
    };

constructor(
  private _userService: UserService,
  private _imageService: ImageService,
  private _route: ActivatedRoute,
  private _router: Router
){}

ngOnInit(){
  this.aldaketaGaituta=false;
  this.aldaketaGaituta2=false;
  this.datuakAldatuta=false;
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

    //erabiltzailearen beste detaile danak eskuratzeko
    this._userService.getUserByID(this.userMe._id).subscribe(
      result => {
        this.user = result.user;
        console.log(this.user);

        if(!this.user){
          this._router.navigate(['/main-page']);
        }
        this._imageService.getImage(this.userMe.argazkia).subscribe(
            result=>{//vamos a capturar toda la info que llega de getAlbums
                this.image=result.image;
                if(!this.image){
                    //this._router.navigate(['/']);
                    console.log("Ez dago iD hori duen irudirik");
                }
                this._imageService.getImage(this.userMe.portada).subscribe(
                    result=>{//vamos a capturar toda la info que llega de getAlbums
                        this.portadaUser=result.image;
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
            },
            error=>{
                this.errorMessage=<any>error;

                if(this.errorMessage!=null){
                    console.log(this.errorMessage);
                    this._router.navigate(['/main-page']);
                }

            }
        );
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

onSubmit(){
  this.user.firstName=this.user.firstName.toLowerCase();
  this.user.lastName=this.user.lastName.toLowerCase();
  this.user.lastName2=this.user.lastName2.toLowerCase();

  this._userService.updateUser(this.user).subscribe(
    result => {
      console.log(result);
      this.token = result;
      if(this.token.length <=1){
        alert('Error en el servidor');
      }
      else{
        if(!this.token.status){
          console.log("======TOKEN SAVED =====");
          localStorage.removeItem('token');
          localStorage.setItem('token',JSON.stringify(this.token));
          var temp=this._userService.getUserDetails();
          this.userMe._id=temp._id;
          this.userMe.username=temp.username;
          this.userMe.firstName=temp.firstName;
          this.userMe.argazkia=temp.argazkia;
          this.userMe.portada=temp.portada;
          console.log(this.userMe)
          console.log(JSON.parse(localStorage.getItem('token')))
          this.datuakAldatuta=true;
        }
        //this._router.navigate(['/profile',this.user._id]);
        this._router.navigate(['/update-user']);
      }
    },
    error => {
      this.errorMessage = <any>error;
      if(this.errorMessage != null){
      }
    });
}

AldaketaGaitu(){
  this.aldaketaGaituta=true;
}

AldaketaGaitu2(){
  this.aldaketaGaituta2=true;
}

fileChangeEvent(fileInput:any){
    this.filesToUpload=<Array<File>>fileInput.target.files;

}

makeFileRequest(url:string,params:Array<string>,files:Array<File>){
        return new Promise(function(resolve,reject){
            var formData: any=new FormData();
            var xhr =new XMLHttpRequest();//peticion xml http request-->AJAX clasico de JavaScript

            for(var i=0;i<files.length;i++){
                formData.append('image',files[i],files[i].name);
            }

            xhr.onreadystatechange=function(){//cuando el estado de la peticion AJAX cambie
                if(xhr.readyState==4){
                  if(xhr.status==200){
                      resolve(JSON.parse(xhr.response));
                  }else{
                      reject(xhr.response);
                  }
              }
            }
            xhr.open('POST',url,true);//hacer la peticion AJAX por POST
            xhr.send(formData);//enviar los datos que hay en la formData, es decir, la imagen
        });
    }

//irudiaren aldaketa
onSubmitArgazkia(){
      this._imageService.editImage(this.userMe.argazkia,this.image).subscribe(
          resp=>{
            this.image=resp.image;
            if(!resp.image){
              alert('Errorea zerbitzarian');
            }else{
                if(!this.filesToUpload)
                {
                }else{
                    //Subir la imagen
                    this.makeFileRequest(GLOBAL.url+'upload-image/'+this.userMe.argazkia,[],this.filesToUpload)
                        .then(
                              (result)=>{
                                  this.resultUpload=result;
                                  this.image.picture=this.resultUpload.filename;
                                  //this._router.navigate(['/profile',this.userMe._id]);
                                  //this.userMe.argazkia=this.image._id;
                                  //this._router.navigate(['/update-user/']);
                                  console.log("argazkia ondo aldatu da");
                                  console.log("bueltan datorren argazkiaren izena "+this.image.picture)
                                  //location.reload();
                                  this.aldaketaGaituta2=false;
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
                              },
                              (error)=>{
                                  console.log(error);
                              }
                        );
                }
            }
          },
          error=>{
            this.errorMessage=<any>error;

            if(this.errorMessage!=null){
                console.log(this.errorMessage);
            }
          }
      );
    }


///portadaren aldaketa
onSubmitPortada(){
  console.log("eskatzen den irudiaren id: "+this.userMe.portada);

    this._imageService.editImage(this.userMe.portada,this.portadaUser).subscribe(
        resp=>{
          this.portadaUser=resp.image;

          if(!resp.image){
            alert('Errorea zerbitzarian');
          }else{
              if(!this.filesToUpload)
              {
              }else{
                  //Subir la imagen
                  this.makeFileRequest(GLOBAL.url+'upload-image/'+this.userMe.portada,[],this.filesToUpload)
                      .then(
                            (result)=>{
                                this.resultUpload=result;
                                this.portadaUser.picture=this.resultUpload.filename;
                                console.log("portada ondo aldatu da");
                                //this._router.navigate(['/update-user/']);
                                //location.reload();
                                this.aldaketaGaituta=false;
                                this._imageService.getImage(this.userMe.portada).subscribe(
                                    result=>{//vamos a capturar toda la info que llega de getAlbums
                                        this.portadaUser=result.image;
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
                            },
                            (error)=>{
                                console.log(error);
                            }
                      );
              }
          }
        },
        error=>{
          this.errorMessage=<any>error;

          if(this.errorMessage!=null){
              console.log(this.errorMessage);
          }
        }
    );

}

public logout(){
  localStorage.removeItem('token');
  this._router.navigate(['/']);}

}
