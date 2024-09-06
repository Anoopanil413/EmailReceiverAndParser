// extractor.ts

import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { Extractor } from 'unrar-js';


export const extractZipAttachment = async (zipBuffer: Buffer, zipFilename: string): Promise<void> => {
  try {
    const extractDir = path.join(__dirname, 'extracted', path.basename(zipFilename, '.zip'));

    await fs.promises.mkdir(extractDir, { recursive: true }); 

    const directory = await unzipper.Open.buffer(zipBuffer);

    for (const fileEntry of directory.files) {
      const filePath = path.join(extractDir, fileEntry.path);

      if (fileEntry.type === 'Directory') {
        await fs.promises.mkdir(filePath, { recursive: true });
      } else {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

        const writable = fs.createWriteStream(filePath);
        fileEntry.stream().pipe(writable);

        await new Promise((resolve, reject) => {
          writable.on('finish', resolve);
          writable.on('error', reject);
        });
      }
    }

    console.log(`Zip file extracted to: ${extractDir}`);
  } catch (error) {
    console.error(`Error extracting zip file ${zipFilename}:`, error);
  }
};


export const extractRarAttachment = async (rarBuffer: Buffer, rarFilename: string): Promise<void> => {
  try {
    const extractDir = path.join(__dirname, 'extracted', path.basename(rarFilename, '.rar'));

    await fs.promises.mkdir(extractDir, { recursive: true });

    // Extract RAR file using unrar-js
    const extracted = Extractor.extract(rarBuffer);

    for (const file of extracted.files) {
      const filePath = path.join(extractDir, file.fileName);
      
      if (file.fileName.endsWith('/')) {
        await fs.promises.mkdir(filePath, { recursive: true });
      } else {
        const writable = fs.createWriteStream(filePath);
        writable.write(Buffer.from(file.extract()[1])); // file.extract() returns the file's content as Uint8Array

        await new Promise((resolve, reject) => {
          writable.on('finish', resolve);
          writable.on('error', reject);
        });
      }
    }

    console.log(`RAR file extracted to: ${extractDir}`);
  } catch (error) {
    console.error(`Error extracting RAR file ${rarFilename}:`, error);
  }
};
