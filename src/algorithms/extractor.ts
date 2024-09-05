// extractor.ts

import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

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
