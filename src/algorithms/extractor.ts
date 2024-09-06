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
    // Directory for extracted files based on the rar file's name
    const extractDir = path.join(__dirname, 'extracted', path.basename(rarFilename, '.rar'));

    // Ensure the directory exists (recursive allows nested directories)
    await fs.promises.mkdir(extractDir, { recursive: true });

    // Extract files from the rar buffer using unrar-js
    const extractor = Extractor.extract(rarBuffer);

    // Process each file and directory inside the rar archive
    for (const file of extractor.files) {
      const filePath = path.join(extractDir, file.name); // Get the path for the extracted file or directory

      if (file.isDirectory) {
        // Create directories recursively
        await fs.promises.mkdir(filePath, { recursive: true });
      } else {
        // Ensure the parent directory exists
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

        // Read the file's content
        const data = await file.read();

        // Write the extracted file to the server's file system
        await fs.promises.writeFile(filePath, data);
      }
    }

    console.log(`Rar file extracted to: ${extractDir}`);
  } catch (error) {
    console.error(`Error extracting rar file ${rarFilename}:`, error);
  }
};

