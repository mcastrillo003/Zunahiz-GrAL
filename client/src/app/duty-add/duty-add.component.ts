// Importar componente desde el núcleo de Angular
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {PublicationService} from '../services/publication.service';
import {Publication} from '../models/publication';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {FileService} from '../services/file.service';
import {File} from '../models/file';
import {DutyService} from '../services/duty.service';
import {Duty} from '../models/duty';

import {GLOBAL} from '../services/global';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';

@Component({
  selector: 'duty-add',
  templateUrl: './duty-add.html',

  styleUrls: ['../app.component.css','./duty-add.css'],

  // para injectar el objeto en el componenete, hay que utilizar providers
  providers: [PublicationService, ImageService,UserService,FileService, DutyService]
})

//Clase del componente donde irán
export class DutyAddComponent implements OnInit {

public errorMessage: any;

//Session
public userMe:User;
public token:String;
public image:Image;


public apiUrl:string;
public publication:Publication;
public p:Publication;
public firstStep:boolean;
public secondStep:boolean;
public type:string;
public title:string;
public isEginbeharra:boolean;
public eginbeharraId:string;
public erantzuna:boolean;

//fitxategi kudeaketa
public aldaketaGaituta:boolean;
public resultUpload;
public filesToUpload: Array<File>;
public publiFile:File;
public fitxIzen:string;

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
public data:any;

public izenburua:string;
public azalpena:string;
public duty:Duty;

constructor(
  private _publicationService: PublicationService,
  private _imageService: ImageService,
  private _fileService: FileService,
  private _userService: UserService,
  private _dutyService: DutyService,
  private _route: ActivatedRoute,
  private _router: Router
){}

ngOnInit(){
  //hasieratu
  this.firstStep=true;
  this.secondStep=false;
  this.aldaketaGaituta=false;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.publication=new Publication("","",[ ],"","","","","","","","","","","","",[ ],"",[]);
  this.fitxIzen=null;
  this.title=null;
  this.eginbeharraId=null;
  this.erantzuna=false;
  this.izenburua=null;
  this.azalpena=null;
  this.duty=new Duty("","","","","","","","","","","","","",[]);
  this.p=new Publication("","",[ ],"","","","","","","","","","","","",[ ],"",[]);

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

    this._route.params.forEach((params: Params) => {
      console.log("params ikusten da ondoren:");
      this.type=params['mota'];
      console.log("parametrotik jasotako mota: "+this.type)
      this.eginbeharraId=params['eginbeharraId'];
      if(this.eginbeharraId!=null){
        this.erantzuna=true;
      }
      console.log("erantzuna: "+this.erantzuna)
      console.log("parametrotik jasotako eginbeharraId: "+this.eginbeharraId)
      if(this.type=="eginbeharra"){
        this.isEginbeharra=true;
      }else{
        this.isEginbeharra=false;
      }
      console.log("publication type"+this.type)
    });
  }
}

onDateChanged(event: IMyDateModel): void {
    // date selected
}

onSubmit(){
  if(this.type=="eginbeharra"){
    if(this.data!=null){
      this.duty.noizkoEguna=this.data.date.day;
      this.duty.noizkoHilabetea=this.data.date.month;
      this.duty.noizkoUrtea=this.data.date.year;
      this.duty.noizko=this.data.date.year+'/'+this.data.date.month+'/'+this.data.date.day;

      console.log("publicationeko eguna "+this.publication.noizkoEguna)
      console.log("publicationeko hilabetea "+this.publication.noizkoHilabetea)
      console.log("publicationeko urtea "+this.publication.noizkoUrtea)
      console.log("publication data osoa "+this.publication.noizko)
    }
    this.duty.izenburua=this.p.izenburua;
    this.duty.azalpena=this.p.azalpena;

  }else{
    if(this.erantzuna==true){
      this.publication.duty=this.eginbeharraId;
    }
    this.publication.izenburua=this.p.izenburua;
    this.publication.azalpena=this.p.azalpena;
  }


  console.log("type balioa submit sarreran "+this.type)
  if(this.type=="argitalpena"){
    var create=this._publicationService.createArgitalpena(this.userMe._id, this.publication);
  }
  if(this.type=="eginbeharra"){
    var create=this._dutyService.createEginbeharra(this.userMe._id, this.duty);
  }
  else if(this.type=="foroa"){
    var create=this._publicationService.createForoa(this.userMe._id, this.publication);
  }
  console.log("irtetzen den type: "+this.type)

  create.subscribe(
    response => {
      console.log("ondo sortzen du "+this.type)
      if(this.type=="eginbeharra"){
        this.duty=response.publication;
        console.log("jasotako duty file "+response.publication.file)
        console.log("gordetako duty file "+this.duty.file)
        this.p.izenburua="";
        this.p.azalpena="";
      }else{
        this.publication=response.publication;
        this.p.izenburua="";
        this.p.azalpena="";
      }

      this.firstStep=false;
      this.secondStep=true;

    },
    error => {
      this.errorMessage=<any>error;

      if(this.errorMessage!=null){
          console.log(this.errorMessage);
          //this._router.navigate(['/main-page']);
      }
    });

  }

  AldaketaGaitu(){
    this.aldaketaGaituta=true;
  }

  fileChangeEvent(fileInput:any){
      this.filesToUpload=<Array<File>>fileInput.target.files;

  }

  makeFileRequest(url:string,params:Array<string>,files:Array<File>){
          return new Promise(function(resolve,reject){
              var formData: any=new FormData();
              var xhr =new XMLHttpRequest();//peticion xml http request-->AJAX clasico de JavaScript

              for(var i=0;i<files.length;i++){
                  formData.append('file',files[i],files[i].name);
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

      onSubmitFile(){
        //console.log("eskatzen den filearen id: "+this.publication.file);
        let publiFile;
        if(this.type=="eginbeharra"){
          publiFile=this.duty.file;
          console.log("onSubmitFilen eginbeharra, fileId: "+publiFile)
        }else{
          publiFile=this.publication.file;
          console.log("onSubmitFilen EZ eginbeharra, fileId: "+publiFile)
        }
        //file hori eskuratu
        this._fileService.getFile(publiFile).subscribe(
          resp=>{
              this.publiFile=resp.file;
              console.log("ondo eskuratu da ondorengo file "+this.publiFile._id)
              this.publiFile.title=this.fitxIzen;

              this._fileService.editFile(this.publiFile._id,this.publiFile).subscribe(
                  resp=>{
                    this.publiFile=resp.file;


                    if(!resp.file){
                      alert('Errorea zerbitzarian');
                    }else{
                        if(!this.filesToUpload)
                        {
                        }else{
                            //Subir la imagen
                            this.makeFileRequest(GLOBAL.url+'upload-file/'+publiFile,[],this.filesToUpload)
                                .then(
                                      (result)=>{
                                          this.resultUpload=result;
                                          this.publiFile.name=this.resultUpload.filename;
                                          console.log("fitxategia ondo aldatu da");

                                          if(this.type=="argitalpena"){
                                            this._router.navigate(['/main-page']);
                                          }
                                          if(this.type=="eginbeharra"){
                                            this._router.navigate(['/duty',this.duty._id]);
                                          }
                                          if(this.type=="foroa"){
                                            this._router.navigate(['/foroa']);
                                          }

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
          },
          error=>{
            this.errorMessage=<any>error;

            if(this.errorMessage!=null){
                console.log(this.errorMessage);
            }
          }
      );


  }

  amaitu(){
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
