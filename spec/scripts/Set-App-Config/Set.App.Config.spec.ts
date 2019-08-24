import 'reflect-metadata';
import { IJsonUtil } from '../../../src/Utils/interfaces/IJSon.Util';
import { of } from 'rxjs';
import { SetJsonDefaults } from '../../../src/Set-Json-Defaults/Set.Json.Defaults';

const _root = 'C:\\Github\\post-install-pipeline';
const jsonUtil = {
    getJson: jest.fn().mockImplementation((root, fileName) => {
        expect(root).toBe(_root);
        expect(fileName).toBe('app.config.json');
        return of({});
    }),
    setDefaults: jest.fn().mockImplementation((existing, defaults, overwrite) => {
        expect(existing).toBeDefined();
        expect(defaults).toBeDefined();
        expect(overwrite).toBeFalsy();
        return of(defaults);
    }),
    setJson: jest.fn().mockImplementation((data, root, fileName) => {
        expect(data).toBeDefined();
        expect(root).toBe(_root);
        expect(fileName).toBe('app.config.json');
        return of(undefined);
    })
};

const _defaults = {
    crypto: {
        kms: {
            projectId: "${crypto.kms.projectId}",
            locationId: "${crypto.kms.locationId}",
            keyRingId: "${crytpo.kms.keyRingId}",
            cryptoKeyId: "${crypto.kms.cryptoKeyId}"
        },
        storage: {
            bucket: "${crypto.storage.bucket}",
            localTempDir: "${crypto.storage.localTempDir}",
            remoteDir: "${crypto.storage.remoteDir}",
            fileExtension: "${crypto.storage.fileExtension}"
        }
    }
}

beforeEach(() => {
    jsonUtil.getJson.mockClear();
    jsonUtil.setDefaults.mockClear();
    jsonUtil.setJson.mockClear();
});

test('Set-App.Config', (done) => {
    const setAppConfig = new SetJsonDefaults(<IJsonUtil>(jsonUtil), _root);
    setAppConfig.run(_defaults, false, 'app.config.json')
        .subscribe(() => {
            expect(jsonUtil.getJson).toHaveBeenCalledTimes(1);
            expect(jsonUtil.setDefaults).toHaveBeenCalledTimes(1);
            expect(jsonUtil.setJson).toHaveBeenCalledTimes(1);
            done();
        });
})