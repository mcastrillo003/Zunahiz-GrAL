import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {File} from '../models/file';
import {GLOBAL} from './global';

@Injectable()
export class FileService{
    public url:string;

    constructor(private _http:Http){
        this.url=GLOBAL.url;
    }

    getApiUrl(segment=''):string{
      var url=this.url+segment;
      return url;

    }
    getIFiles(){
        return this._http.get(this.url+'files')
                          .map(res=>res.json());
    }

    getFile(id){
      return this._http.get(this.url+'file/'+id)
                        .map(res=>res.json());
    }

    getPubliFile(publiId){
      return this._http.get(this.url+'publiFile/'+publiId)
                        .map(res=>res.json());
    }

    getUserFile(id){
      return this._http.get(this.url+'userFile/'+id)
                        .map(res=>res.json());
    }

    getFileFile(name){
      return this._http.get(this.url+'get-file/'+name)
                        .map(res=>res.json());
    }

    editFile(id,file:File){
        let json=JSON.stringify(file);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.put(this.url+'file/'+id,params,{headers:headers})
                          .map(res=>res.json());
    }

    addFile(file:File){
        let json=JSON.stringify(file);
        let params=json;
        let headers=new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'file',params,{headers:headers})
                          .map(res=>res.json());
    }



    deleteFile(id:string){
      return this._http.delete(this.url+'file/'+id)
                        .map(res=>res.json());
    }

}
