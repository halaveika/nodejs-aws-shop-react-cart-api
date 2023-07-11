import * as fs from 'fs';
import * as archiver from 'archiver';
import * as path from 'path';

function zipDirectory(sourceDir: string, outputZip: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputZip);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log('Successfully zipped the directory.');
      resolve();
    });

    archive.on('error', (err: any) => {
      console.error('Failed to zip the directory:', err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, 'nodejs' );
    archive.finalize();
  });
}

const sourceDir = path.resolve(__dirname, '../layer/node_modules');
const outputZip =  path.resolve(__dirname,'../layer/layer.zip');

zipDirectory(sourceDir, outputZip)
  .then(() => {
    console.log('Directory zipping completed.');
  })
  .catch((error) => {
    console.error('Failed to zip the directory:', error);
  });