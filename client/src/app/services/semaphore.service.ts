import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Semaphore} from '../models/semaphore';
import {GLOBAL} from './global';

@Injectable()
export class SemaphoreService{
    public url:string;

    constructor(private _http:Http){
        this.url=GLOBAL.url;
    }

    getSemaphore(id){
      return this._http.get(this.url+'semaphore/'+id)
                          .map(res=>res.json());
    }

    getChatSemaphore(){
      return this._http.get(this.url+'chatSemaphore')
                          .map(res=>res.json());
    }

    createChatSemaphore(){
      return this._http.get(this.url+'createChatSemaphore')
                          .map(res=>res.json());
    }

    updateSemaphore(id,semaphore:Semaphore){
        let json=JSON.stringify(semaphore);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'semaphore/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

}
