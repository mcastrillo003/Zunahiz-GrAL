import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Comment} from '../models/comment';
import {GLOBAL} from './global';

@Injectable()
export class CommentService{
    public url:string;

    constructor(private _http:Http){
        this.url=GLOBAL.url;
    }

    getApiUrl(segment=''):string{
      var url=this.url+segment;
      return url;

    }

    createComment(comment:Comment){
        let json=JSON.stringify(comment);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'comment',params,{headers:headers})
                          .map(res=>res.json());
    }

    deleteComment(id){

      return this._http.delete(this.url+'comment/'+id)
                        .map(res=>res.json());
    }
}
