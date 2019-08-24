import { Observable } from 'rxjs';
import { Container } from 'inversify';
import { Runnable, RunnableConstructor } from './Runnable';

export interface Pipeline {
    register(container: Container, runnable: Runnable | RunnableConstructor, ...args: any[]): Pipeline;
    run(container: Container): Observable<void>;
}