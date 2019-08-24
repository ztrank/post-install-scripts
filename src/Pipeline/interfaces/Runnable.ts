import { Observable } from 'rxjs';

export interface Runnable {
    run(...args: any[]): Observable<void>;
}

export type RunnableConstructor = new (...args:any[]) => Runnable;
