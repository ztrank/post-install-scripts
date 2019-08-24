import { Observable } from 'rxjs';

export interface IJSON {
    [key: string]:any;
}

export interface IJsonUtil {
    setDefaults(result: IJSON, defaults: IJSON, overwrite?: boolean): IJSON;
    getJson(root: string, ...paths: string[]): Observable<IJSON>;
    setJson(content: IJSON, root: string, ...paths: string[]): Observable<void>;
}