import 'reflect-metadata';
import { IFileUtil } from '../../../src/Utils/interfaces/IFile.Util';
import { JsonUtil } from '../../../src/Utils/implementations/JSON.Util';
import { of, throwError } from 'rxjs';

const spy = jest.spyOn(global.console, 'error');

const _fileUtil = {
    getFile: jest.fn(),
    saveFile: jest.fn()
};

beforeEach(() => {
    _fileUtil.getFile.mockReset();
    _fileUtil.saveFile.mockReset();
    spy.mockClear();
});

afterAll(() => {
    spy.mockRestore();
});

function newJsonUtil(): JsonUtil {
    return new JsonUtil(<IFileUtil><any>_fileUtil);
}

test('Construct', () => {
    const ju = newJsonUtil();
    expect(ju).toBeDefined();
});

test('Get Json', (done) => {
    const root = 'C:\\Projects\\nebula-shell';
    const path1 = 'src';
    const path2 = 'app.config.json';

    _fileUtil.getFile.mockImplementation((r, p1, p2) => {
        expect(r).toBe(root);
        expect(p1).toBe(path1);
        expect(p2).toBe(path2);
        return of(JSON.stringify({
            crypto: "cryptoSetting"
        }));
    });

    const ju = newJsonUtil();
    ju.getJson(root, path1, path2)
        .subscribe(js => {
            expect(js).toBeDefined();
            expect(js.crypto).toBeDefined();
            expect(js.crypto).toBe('cryptoSetting');
            done();
        });
});

test('Get Json: Error', (done) => {
    const root = 'C:\\Projects\\nebula-shell';
    const path1 = 'src';
    const path2 = 'app.config.json';

    _fileUtil.getFile.mockImplementation((r, p1, p2) => {
        expect(r).toBe(root);
        expect(p1).toBe(path1);
        expect(p2).toBe(path2);
        return throwError('Oops');
    });

    const ju = newJsonUtil();
    ju.getJson(root, path1, path2)
        .subscribe(js => {
            expect(js).toBeDefined();
            done();
        });
});

test('Set Json', (done) => {
    const root = 'C:\\Projects\\nebula-shell';
    const path1 = 'src';
    const path2 = 'app.config.json';
    const json = {
        crypto: "cryptoSetting"
    };

    _fileUtil.saveFile.mockImplementation((c, r, p1, p2) => {
        expect(c).toBeDefined();
        expect(c).toBe(JSON.stringify(json, null, 4));
        expect(r).toBe(root);
        expect(p1).toBe(path1);
        expect(p2).toBe(path2);
        return of(undefined);
    });

    const ju = newJsonUtil();
    ju.setJson(json, root, path1, path2)
        .subscribe(() => {
            expect(_fileUtil.saveFile).toHaveBeenCalled();
            done();
        });
});

test('Set Defaults: No Overwrite', () => {
    const current = {
        feature: 'feature',
        crypto: 'crypto',
        storage: {},
        array1: [
            '1',
            '2', 
            {db: 'not-bucket'}
        ],
        array2: [
            '1',
            '2'
        ]
    };

    const defaults = {
        crypto: 'CRYPTO',
        auth: 'auth',
        storage: {
            db: {
                bucket: 'bucket'
            }
        },
        kms: {
            db: {
                bucket: 'bucket'
            }
        },
        array1: [
            '1',
            '2', 
            {db: 'not-bucket'}
        ],
        array2: [
            '1',
            '2',
            {db: 'bucket'}
        ],
        array3: [
            '1',
            '2',
            {db: 'bucket'}
        ]
    };

    const expected = {
        feature: 'feature',
        crypto: 'crypto',
        auth: 'auth',
        storage: {
            db: {
                bucket: 'bucket'
            }
        },
        kms: {
            db: {
                bucket: 'bucket'
            }
        },
        array1: [
            '1',
            '2', 
            {db: 'bucket'}
        ],
        array2: [
            '1',
            '2', 
            {db: 'bucket'}
        ]
    };

    const ju = newJsonUtil();
    const actual = ju.setDefaults(current, defaults);
    expect(actual).toBeDefined();
    expect(actual.crypto).toBe(expected.crypto);
    expect(actual.auth).toBe(expected.auth);
    expect(actual.feature).toBe(expected.feature);
    expect(actual.storage).toBeDefined();
    expect(actual.storage.db).toBeDefined();
    expect(actual.storage.db.bucket).toBe(expected.storage.db.bucket);
    expect(actual.kms).toBeDefined();
    expect(actual.kms.db).toBeDefined();
    expect(actual.kms.db.bucket).toBe(expected.kms.db.bucket);
    expect(actual.array1).toHaveLength(3);
    expect(actual.array2).toHaveLength(3);
    expect(actual.array3).toHaveLength(3);
    expect(actual.array1[2].db).toBe('not-bucket');
    expect(actual.array2[2].db).toBe('bucket');
});


test('Set Defaults: Overwrite', () => {
    const current = {
        feature: 'feature',
        crypto: 'crypto',
        storage: {
            db: {
                bucket: 'not-bucket'
            }
        },
        array1: [
            '1',
            '2', 
            {db: 'not-bucket'}
        ]
    };

    const defaults = {
        crypto: 'CRYPTO',
        auth: 'auth',
        storage: {
            db: {
                bucket: 'bucket'
            }
        },
        kms: {
            db: {
                bucket: 'bucket'
            }
        },
        array1: [
            '1',
            '2', 
            {db: 'bucket'}
        ],
        array2: [
            '1',
            '2', 
            {db: 'bucket'}
        ]
    };

    const expected = {
        feature: 'feature',
        crypto: 'CRYPTO',
        auth: 'auth',
        storage: {
            db: {
                bucket: 'bucket'
            }
        },
        kms: {
            db: {
                bucket: 'bucket'
            }
        },
        array1: [
            '1',
            '2', 
            {db: 'bucket'}
        ],
        array2: [
            '1',
            '2', 
            {db: 'bucket'}
        ]
    };

    const ju = newJsonUtil();
    const actual = ju.setDefaults(current, defaults, true);
    expect(actual).toBeDefined();
    expect(actual.crypto).toBe(expected.crypto);
    expect(actual.auth).toBe(expected.auth);
    expect(actual.feature).toBe(expected.feature);
    expect(actual.storage).toBeDefined();
    expect(actual.storage.db).toBeDefined();
    expect(actual.storage.db.bucket).toBe(expected.storage.db.bucket);
    expect(actual.kms).toBeDefined();
    expect(actual.kms.db).toBeDefined();
    expect(actual.kms.db.bucket).toBe(expected.kms.db.bucket);
    expect(actual.array1[2].db).toBe('bucket');
});