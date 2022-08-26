import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    console.log(
      'remove database start, path: ',
      __dirname,
      '..',
      'test.sqlite',
    );
    await rm(join(__dirname, '..', 'test.sqlite'));
    console.log('remove database end');
  } catch (err) {
    console.log('remove database err: ', err);
  }
});

global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
