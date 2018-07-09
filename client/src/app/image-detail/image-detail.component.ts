import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {UserService} from '../services/user.service';
import {User} from '../models/user';


@Component({
    selector:'image-detail',
    templateUrl: './image-detail.html',
    styleUrls: ['../app.component.css','./image-detail.css'],
    providers: [ImageService, UserService]
})

export class ImageDetailComponent implements OnInit{
    public imageZoom:Image;
    public errorMessage:any;
    public loading:boolean;
    public confirmado:any;

    //Session
    public userMe:User;
    public token:String;

    public apiUrl:string;
    public image:Image;

    constructor(
      private _route:ActivatedRoute,
      private _router:Router,
      private _imageService: ImageService,
      private _userService: UserService,
    ){}


    ngOnInit(){
        this.getImage();
        window.scrollTo(0, 235);
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

    getImage(){
      this._route.params.forEach((params:Params)=>{
        let id=params['id'];
        this._imageService.getImage(id).subscribe(
            result=>{//vamos a capturar toda la info que llega de getAlbums
                this.imageZoom=result.image;
                if(!this.imageZoom){
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
