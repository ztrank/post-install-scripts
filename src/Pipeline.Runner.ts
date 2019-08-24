import { Observable } from 'rxjs';

export interface PipelineRunner {
    run(root: string, ...options: any[]): Observable<string>;
}