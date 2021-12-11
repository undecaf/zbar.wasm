import compiledWasm from 'zbar';
import ZBar from './ZBar';

let inst: ZBar;

const instPromise = (async () => {
  inst = await compiledWasm();
  if (!inst) {
    throw Error('WASM was not loaded');
  }
  return inst;
})();

export const getInstance = async (): Promise<ZBar> => {
  return await instPromise;
};
