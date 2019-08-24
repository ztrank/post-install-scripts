import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { IJsonUtil } from '../Utils/interfaces/IJSon.Util';
import { inject, injectable } from 'inversify';
import { PipelineSymbols } from '../symbols';

@injectable()
export class SetJsonDefaults {

    public constructor(
        @inject(PipelineSymbols.JSONUtil) private jsonUtil: IJsonUtil,
        @inject(PipelineSymbols.ProjectRoot) private root: string
    ) {}

    public run(defaults: any, overwrite: boolean, ...path: string[]): Observable<void> {
        return this.jsonUtil.getJson(this.root, ...path)
            .pipe(
                map(json => this.jsonUtil.setDefaults(json, defaults, overwrite)),
                mergeMap(json => this.jsonUtil.setJson(json, this.root, ...path))
            );
    }
}