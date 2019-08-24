import { Observable } from 'rxjs';

export interface IFileUtil {
    getFile(root: string, ...paths: string[]): Observable<string>;
    saveFile(content: string, root: string, ...paths: string[]): Observable<void>;
    makeDir(parent: string, dirName: string): Observable<string>;
    containsFile(directory: string, fileName: string | string[], allOrNone?: boolean): Observable<boolean>;
    traverseBackUntil(directory: string, indicators: string | string[], allOrNone?: boolean): Observable<string>;
}