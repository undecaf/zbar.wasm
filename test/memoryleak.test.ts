import { getImageData } from './utils';
import { getInstance, scanImageData } from 'index.cjs';

test('Multiple Scan Test', async () => {
  const inst = await getInstance();
  const dir = __dirname + '/../test/';
  let res;
  const img4 = await getImageData(dir + 'test4.png');
  res = await scanImageData(img4);
  expect(res).toHaveLength(2);
  const b = inst.HEAP8.buffer;

  for (let i = 0; i < 100; ++i) {
    res = await scanImageData(img4);
    expect(res).toHaveLength(2);
    expect(inst.HEAP8.buffer).toBe(b);
  }
});
