import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ChatService} from '../services/chat.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {Mezua} from '../models/mezua';
import {SemaphoreService} from '../services/semaphore.service';
import {Semaphore} from '../models/semaphore';

// Para utilizar jQuery...
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'chat',
  templateUrl: './chat.html',
  styleUrls: ['../app.component.css','./chat.css'],
  providers: [UserService, ImageService, SemaphoreService]
})
export class ChatComponent {
    message:string;
    messages:string[]=[];
    public errorMessage: any;
    public user: User;
    public userDisplay: User;
    public mezuak:Mezua[]=[];
    public userId:string;
    public userArgazkiaUrl:string;
    public badago:boolean;
    public online:String[]=[];
    public username:String;
    public aldatu:boolean;
    public admin:User;
    public isAdmin:boolean;

    //semaforo aldaketak egiteko
    public koloreak=[{name:"gorria"},{name:"horia"},{name:"berdea"},{name:"grisa"}];
    public kolorea:string;
    public chatSemaphore:Semaphore;
    public urlSemaphore:string;
    public description:string;

    //Session
    public userMe:User;
    public token:String;
    public image:Image;
    public apiUrl:string;


  constructor(
    private chatService: ChatService,
    private _userService: UserService,
    private _imageService: ImageService,
    private _semaphoreService: SemaphoreService,
    private _route: ActivatedRoute,
    private _router: Router
  ){}

  sendMessage() {
    //
    var mezua=new Mezua("","","","","",[]);
    mezua.content=this.message;
    mezua.user=this.userMe._id;
    mezua.name=this.user.firstName;
    mezua.lastName=this.user.lastName;
    mezua.username=this.username;
    this.aldatu=false;
    this.isAdmin=false;
    //
    if(mezua.content!="Chat-era gehitu naiz"){
    mezua.users=this.online;
    }


    //this.chatService.sendMessage(this.message);
    this.chatService.sendMessage(mezua);
    console.log("bidaltzen den mezua "+this.message)
    this.message = '';
  }

  ngOnInit() {
    window.scrollTo(0, 260);
    this.badago=false;
    this.userArgazkiaUrl=this._imageService.getApiUrl('getUimage/');
    this.urlSemaphore="../../assets/images/";

    //mezuak lortu
      this.chatService
        .getMessages()
        .subscribe((message) => {
          console.log("jasotzen den mezua "+message.user)
          this.mezuak.push(message);
        /*  if(message.content!="Chat-era gehitu naiz"){
            this.online=message.users;
          }
          var badago=false;
          for(var i=0;i<this.online.length;i++){
            if(this.online[i]==message.username){
                badago=true;
            }
          }
          if(badago==false){
            this.online.push(message.username);
          }*/

          //jquery bidez scroll-aren posizioa amaierara mugitu
          $("#chat-box").animate({ scrollTop: $('#chat-box')[0].scrollHeight}, 1000);
        });

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
        this.username=this.userMe.username;


        this._imageService.getImage(this.userMe.argazkia).subscribe(
            result=>{//vamos a capturar toda la info que llega de getAlbums
                this.image=result.image;

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
        //nire datu gehiago lortu bistaratzeko
        this._userService.getUserByID(this.userMe._id).subscribe(
          result => {
            this.user = result.user;
            this.message="Chat-era gehitu naiz";
            this.username=this.userMe.username;
            this.online.push(this.username);
            this.sendMessage();

            //semaforoa lortu eta existitzen ez bada sortu
              this.getChatSemaphore();
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

  aldaketaGaitu(){
    console.log("sartzen da aldatzera horrela "+this.aldatu)
    if(this.aldatu==true){
      console.log("sartzen da truera")
      this.aldatu=false;
      console.log("aldaturen balioa1 "+this.aldatu)
    }
    else if(this.aldatu==false){
      this.aldatu=true;
      console.log("aldaturen balioa2 "+this.aldatu)
    }
  }

  public getChatSemaphore(){
    this._semaphoreService.getChatSemaphore().subscribe(
    result=>{
      this.chatSemaphore=result.semaphore[0];
      console.log("badago chatSemaphore sortuta")
      console.log("chatSemaphore image "+this.chatSemaphore.image)
    },
    error=>{
      //ez badago, sortu
      console.log("ez dago chatSemaphore sortuta")
      this._semaphoreService.createChatSemaphore().subscribe(
      result=>{
        console.log("sortu da chatSemaphore")
        this.chatSemaphore=result.semaphore;
      },
      error=>{
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
        }
      }
    );

    }
  );
  }

  public semaforoaAldatzen(){

    console.log("semaforoa aldatzen sartzen da")
    var izena;
    if(this.kolorea=="gorria"){
      izena="semaforoGorria.png";
    }
    if(this.kolorea=="horia"){
      izena="semaforoHoria.png";
    }if(this.kolorea=="berdea"){
      izena="semaforoBerdea.png";
    }if(this.kolorea=="grisa"){
      izena="semaforoGrisa.png";
    }

    this.chatSemaphore.image=izena;

    this._semaphoreService.updateSemaphore(this.chatSemaphore._id,this.chatSemaphore).subscribe(
      result=>{
          //location.reload()
          this.kolorea="";
          this.getChatSemaphore();
      },
      error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
      }
    );


  }

  semaforoDesAldatu(num,semaphoreId,publiId){

    console.log("aldatuko den argitalpenaren id: "+this.chatSemaphore._id)
    this.chatSemaphore.description=this.description;
    this._semaphoreService.updateSemaphore(this.chatSemaphore._id,this.chatSemaphore).subscribe(
      result=>{
          console.log("bueltako semaforo description: "+result.semaphore.description)
          this.description="";
          this.getChatSemaphore();
      },
      error=>{
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            console.log(this.errorMessage);
          }
      }
    );
  }

  ngOnDestroy(){
    console.log("irtetzean sartzen da");
    this.message="AGUR";
    this.sendMessage();
  }

  public logout(){
    localStorage.removeItem('token');
    this.message="AGUR";
    this.sendMessage();
    this._router.navigate(['/']);
  }

}
