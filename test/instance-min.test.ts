import { JSDOM } from 'jsdom';

let zbar;

beforeAll(() => {
    return JSDOM.fromFile('test/instance-min.test.html', {
        runScripts: 'dangerously',
        resources: 'usable'
    }).then(dom => {
        return new Promise<void>(resolve => { 
            // Wait until the HTML page has been loaded
            dom.window.addEventListener('load', ev => {
                zbar = dom.window.zbar;
                resolve();
            });
        });
    });
});


test('zbar variable exists', () => {
    expect(typeof zbar).toEqual('object');
    expect(typeof zbar.getInstance).toEqual('function');
});


test('WASM instance', async () => {
    const inst = await zbar.getInstance();
    for (let i = 0; i < 100; ++ i) {
        const ptr = inst._malloc(1000);
        const HEAP8 = inst.HEAP8;
        for (let j = 0; j < 1000; ++ j) {
            HEAP8[ptr + j] = 127;
        }
    }
});
