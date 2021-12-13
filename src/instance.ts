import compiledWasm from 'zbar';
import ZBarInstance from './ZBarInstance';

let inst: ZBarInstance;

const instPromise = (async () => {
  inst = await compiledWasm();
  if (!inst) {
    throw Error('WASM was not loaded');
  }
  return inst;
})();

export const getInstance = async (): Promise<ZBarInstance> => {
  return await instPromise;
};
