import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { IJsonUtil } from '../Utils/interfaces/IJSon.Util';
import { PipelineRunner } from '../Pipeline.Runner';

interface SetAppConfigOptions {
    overwrite?: boolean;
}

interface SetAppConfigSettings {
    overwrite: boolean;
}

export class SetJsonDefaults implements PipelineRunner {
    private root: string;
    private options: SetAppConfigSettings;

    public constructor(
        private jsonUtil: IJsonUtil,
        private defaultJson: any,
        options?: SetAppConfigOptions
    ) {
        this.options = {
            overwrite: false,
            ...options
        };
    }

    public run(root: string, ...path: string[]): Observable<string> {
        this.root = root;
        return this.jsonUtil.getJson(this.root, ...path)
            .pipe(
                map(json => this.jsonUtil.setDefaults(json, this.defaultJson, this.options.overwrite)),
                mergeMap(json => this.jsonUtil.setJson(json, this.root, ...path)),
                map(() => this.root)
            );
    }
}