import { Component } from '@angular/core';
import { Router,ActivatedRoute,Params} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title:string;
  public description:string;

  constructor(){
    this.title = 'ZUNAHIZ';
    this.description='2017/2018 ikasturtea';
  }
}
