import { IFileUtil } from '../interfaces/IFile.Util';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IJsonUtil } from '../interfaces/IJSon.Util';
import { injectable } from 'inversify';

export interface IJSON {
    [key: string]:any;
}

@injectable()
export class JsonUtil implements IJsonUtil {

    public constructor(private fileUtil: IFileUtil) {}

    public setDefaults(result: IJSON, defaults: IJSON, overwrite: boolean = false): IJSON {
        Object.getOwnPropertyNames(defaults).forEach(key => {
            
            if(typeof defaults[key] === 'object') {
                if(Array.isArray(defaults[key])) {
                    result[key] = Array.isArray(result[key]) ? result[key] : [];
                    const maxIndex = result[key].length - 1;
                    defaults[key].forEach((value: any, index: number) => {
                        if(index > maxIndex) {
                            result[key].push(value);
                        } else if(overwrite) {
                            result[key][index] = typeof value === 'object' ? this.setDefaults(result[key][index], value, overwrite) : value;
                        }
                    });
                } else {
                    result[key] = result[key] || {};
                    result[key] = this.setDefaults(result[key], defaults[key], overwrite);
                }
                
            } else {
                result[key] = result[key] && !overwrite ? result[key] : defaults[key];
            }
        });

        return result;
    }

    public getJson(root: string, ...paths: string[]): Observable<IJSON> {
        return this.fileUtil.getFile(root, ...paths)
            .pipe(
                map(file => <IJSON>JSON.parse(file)),
                catchError(() => of({}))
            );
    }

    public setJson(content: IJSON, root: string, ...paths: string[]): Observable<void> {
        return this.fileUtil.saveFile(JSON.stringify(content, null, 4), root, ...paths);
    }
}