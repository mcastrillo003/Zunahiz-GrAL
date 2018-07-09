import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Publication} from '../models/publication';
import {File} from '../models/file';
import {User} from '../models/user';
import {GLOBAL} from './global';

@Injectable()
export class PublicationService{
    public url:string;

    constructor(private _http:Http){
        this.url=GLOBAL.url;
    }

    getApiUrl(segment=''):string{
      var url=this.url+segment;
      return url;

    }
    getPublication(id){
      return this._http.get(this.url+'publication/'+id)
                          .map(res=>res.json());
    }

    getPublicationsOfDuty(id){
      return this._http.get(this.url+'publicationsOfDuty/'+id)
                          .map(res=>res.json());
    }

    getArgitalpenak(){
      return this._http.get(this.url+'argitalpenak/')
                        .map(res=>res.json());
    }

    getUsersArgitalpenak(user){
      return this._http.get(this.url+'usersArgitalpenak/'+user)
                        .map(res=>res.json());
    }

    getUsersArgitalpenak2(user){
      return this._http.get(this.url+'usersArgitalpenak2/'+user)
                        .map(res=>res.json());
    }

    getPubliForo(){
      return this._http.get(this.url+'publiforo/')
                        .map(res=>res.json());
    }
    getEginbeharrak(){
      return this._http.get(this.url+'eginbeharrak/')
                        .map(res=>res.json());
    }
    getForoak(){
      return this._http.get(this.url+'foroak/')
                        .map(res=>res.json());
    }

    getPublicationsComments(id){
      return this._http.get(this.url+'comments/'+id)
                          .map(res=>res.json());
    }

    getEginbeharrakByMonth(urtea,hilabetea){

        return this._http.get(this.url+'getEginbeharrakByMonth/'+urtea+'&'+hilabetea)
                          .map(res=>res.json());
    }

    createArgitalpena(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'argitalpena/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    createForoa(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'foroa/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    createEginbeharra(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'eginbeharra/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }



    updateArgitalpena(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'argitalpena/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    updateEginbeharra(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'eginbeharra/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    updateForoa(id,publication:Publication){
        let json=JSON.stringify(publication);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'foroa/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    addGustukoDut(id,user:User){
        let json=JSON.stringify(user);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'gustukoDut/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    addFile(id,file:File){
        let json=JSON.stringify(file);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'addFile/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    deleteGustukoDut(publicationId,userId){

      return this._http.delete(this.url+'gustukoDut/'+publicationId+'&'+userId)
                        .map(res=>res.json());
    }

    deletePublication(publicationId){

      return this._http.delete(this.url+'publication/'+publicationId)
                        .map(res=>res.json());
    }

    addComment(id,comment){
        let json=JSON.stringify(comment);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'addComment/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

}
