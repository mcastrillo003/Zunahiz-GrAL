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
  selector: 'publication-edit',
  templateUrl: './publication-edit.html',

  styleUrls: ['../app.component.css','./publication-edit.css'],

  // para injectar el objeto en el componenete, hay que utilizar providers
  providers: [PublicationService, ImageService,UserService,FileService,DutyService]
})

//Clase del componente donde irán
export class PublicationEditComponent implements OnInit {

public errorMessage: any;

//Session
public userMe:User;
public token:String;
public image:Image;


public apiUrl:string;
public publication:Publication;
public firstStep:boolean;
public secondStep:boolean;
public isEginbeharra:boolean;

//fitxategi kudeaketa
public aldaketaGaituta:boolean;
public resultUpload;
public filesToUpload: Array<File>;
public publiFile:File;
public fitxIzen:string;
public publiId:string;
public argitalpena:boolean;
public existsParam:boolean;

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
public type:string;
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
  this.publiId=null;
  this.apiUrl=this._imageService.getApiUrl('get-image/');
  this.publication=new Publication("","",[ ],"","","","","","","","","","","","",[ ],"",[]);
  this.fitxIzen=null;
  this.argitalpena=false;
  this.type=null;
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
    //2.parametroa datorren edo ez ikusi
    this._route.params.forEach((params:Params)=>{
      let mota=params['mota'];
      this.type=mota;
      if(mota!=null){
        this.existsParam=true;
        console.log("parametroa jaso du? "+this.existsParam)
        console.log("parametroa: "+mota)
        if(mota=="argitalpena" || mota=="foroa"){
            this.argitalpena=true;
            console.log("argitalpena da? "+mota)
        }
        if(mota=="eginbeharra"){
          this.isEginbeharra=true;
        }else{
          this.isEginbeharra=false;
        }

      }else{
        console.log("ez du parametroa ondo jasotzen")
      }

    });
    //URLtik datorren argitalpena lortu
    this._route.params.forEach((params: Params) => {
      console.log("params: "+params);
      this.publiId = params['id'];

      if(this.isEginbeharra){
        this._dutyService.getEginbeharra(this.publiId).subscribe(
          result=>{
            this.duty=result.publication;
            console.log("eginbeharra lortzean id: "+this.duty._id)
          },
          error=>{
            this.errorMessage=<any>error;
            if(this.errorMessage!=null){
                console.log(this.errorMessage);
                this._router.navigate(['/main-page']);
            }
          }
        );

      }else{
        this._publicationService.getPublication(this.publiId).subscribe(
          result=>{
            this.publication=result.publication;
            console.log("argitalpena lortzean file: "+this.publication.file)
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
    });

  }
}

onDateChanged(event: IMyDateModel): void {
    // date selected
}

onSubmit(){
  if(this.isEginbeharra){
    if(this.data!=null){
    this.duty.noizkoEguna=this.data.date.day;
    this.duty.noizkoHilabetea=this.data.date.month;
    this.duty.noizkoUrtea=this.data.date.year;
    this.duty.noizko=this.data.date.year+'/'+this.data.date.month+'/'+this.data.date.day;
  }

    this._dutyService.updateEginbeharra(this.duty._id, this.duty).subscribe(
      response => {
        console.log("ondo aldatzen du eginbeharra")
        this.duty=response.publication;
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

  }else{
    console.log("datuak aldatu baino lehen file: "+this.publication.file)
    this._publicationService.updateArgitalpena(this.publication._id, this.publication).subscribe(
      response => {
        console.log("ondo aldatzen du argitalpena")
        console.log("argitalpena eguneratu ondoren file: "+this.publication.file);
        this.publication=response.publication;
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

  hurrengoraIgaro(){
    this.firstStep=false;
    this.secondStep=true;
  }

  amaitu(){
    if(this.argitalpena){
      if(this.type=="argitalpena"){
        this._router.navigate(['/main-page']);
      }
      if(this.type=="foroa"){
        this._router.navigate(['/foroa']);
      }

    }
    if(this.isEginbeharra){
      this._router.navigate(['/duty/',this.duty._id]);
    }
  }


  public logout(){
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }



}
