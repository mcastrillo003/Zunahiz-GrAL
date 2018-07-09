import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Publication} from '../models/publication';
import {File} from '../models/file';
import {User} from '../models/user';
import {Duty} from '../models/duty';
import {GLOBAL} from './global';

@Injectable()
export class DutyService{
    public url:string;

    constructor(private _http:Http){
        this.url=GLOBAL.url;
    }

    getApiUrl(segment=''):string{
      var url=this.url+segment;
      return url;

    }
    getEginbeharra(id){

        return this._http.get(this.url+'eginbeharra/'+id)
                          .map(res=>res.json());
    }
    getEginbeharraWithoutFileData(id){
      return this._http.get(this.url+'getEginbeharraWithoutFileData/'+id)
                        .map(res=>res.json());
    }

    getEginbeharrak(){
      return this._http.get(this.url+'eginbeharrak/')
                        .map(res=>res.json());
    }

    getEginbeharrakByMonth(urtea,hilabetea){

        return this._http.get(this.url+'getEginbeharrakByMonth/'+urtea+'&'+hilabetea)
                          .map(res=>res.json());
    }

    createEginbeharra(id,duty:Duty){
        let json=JSON.stringify(duty);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'eginbeharra/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    updateEginbeharra(id,duty:Duty){
        let json=JSON.stringify(duty);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'eginbeharra/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    deleteEginbeharra(eginbeharraId){

      return this._http.delete(this.url+'eginbeharra/'+eginbeharraId)
                        .map(res=>res.json());
    }

}
