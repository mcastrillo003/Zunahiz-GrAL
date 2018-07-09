import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import {FileService} from '../services/file.service';
import {File} from '../models/file';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image'


@Component({
    selector:'file-detail',
    templateUrl: './file-detail.html',
    styleUrls: ['../app.component.css','./file-detail.css'],
    providers: [FileService, UserService,ImageService]
})

export class FileDetailComponent implements OnInit{
    public file:File;
    public errorMessage:any;
    public loading:boolean;
    public confirmado:any;

    //Session
    public userMe:User;
    public token:String;

    public apiUrl:string;
    public apiFileUrl:SafeUrl;
    public image:Image;
    public url:SafeUrl;

    constructor(
      private _route:ActivatedRoute,
      private _router:Router,
      private _userService: UserService,
      private _imageService: ImageService,
      private _fileService: FileService,
      private sanitizer: DomSanitizer
    ){}

    public getSanitizeUrl(url){
      console.log("getSanitizerrera sartzen den url: "+url)
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    ngOnInit(){
        this.getFile();
        this.apiUrl=this._imageService.getApiUrl('get-image/');

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
        }
    }

    getFile(){
      this.loading=true;
      this._route.params.forEach((params:Params)=>{
        let id=params['id'];
        this._fileService.getFile(id).subscribe(
            result=>{//vamos a capturar toda la info que llega de getAlbums
                this.file=result.file;
                console.log("lortzen den fitxategiaren name: "+this.file.name)
                this.url="get-file/"+this.file.name;
                this.apiFileUrl=this._fileService.getApiUrl((this.url).toString());
                console.log("file url: "+this.apiFileUrl)
                this.url=this.getSanitizeUrl(this.apiFileUrl);
                console.log("file url sanitizied "+this.url);
                if(!this.file){
                    this._router.navigate(['/']);
                }
                this.loading=false;
            },
            error=>{
                this.errorMessage=<any>error;

                if(this.errorMessage!=null){
                    console.log(this.errorMessage);
                    this._router.navigate(['/']);
                }

            }
        );
      });

    }
    public logout(){
      localStorage.removeItem('token');
      this._router.navigate(['/']);
    }

}
