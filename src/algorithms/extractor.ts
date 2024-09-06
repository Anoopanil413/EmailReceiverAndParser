// extractor.ts

import fs from 'fs';
import path from 'path';
import unzipper, { Extract } from 'unzipper';
// import { Extractor } from 'unrar-js';
import { createExtractorFromData } from 'node-unrar-js';




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

const getUniqueFolderPath = (filename: string) => {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const folderName = path.basename(filename, '.rar'); // Remove .rar extension
  const rootDir = path.resolve(__dirname, '../', 'extracted'); // Root directory (one level above src)
  return path.join(rootDir, currentDate, folderName); // Folder structure: root/extracted/2024-09-06/attachmentName
};


export const extractRarAttachment = async (rarBuffer: Buffer, rarFilename: string): Promise<void> => {
  try {
    console.log('Extracting RAR file:', rarFilename);

    // Create extraction directory based on the filename (without .rar extension)
    // const extractDir = path.join(__dirname, 'extracted', path.basename(rarFilename, '.rar'));
    const extractDir = getUniqueFolderPath(rarFilename);

    await fs.promises.mkdir(extractDir, { recursive: true });

    // Create an extractor instance with the RAR buffer
    const extractor = await createExtractorFromData({ data: rarBuffer });

    // Get the list of files inside the RAR archive
    const list = extractor.getFileList();
    const fileHeaders = [...list.fileHeaders]; // File headers contain details of all files

    console.log(`Found ${fileHeaders.length} files in the RAR archive`);

    // Extract all the files from the archive
    const extracted = extractor.extract({ files: fileHeaders.map(header => header.name) });

    // Iterate over the extracted files and write them to disk
    for (const file of extracted.files) {
      const filePath = path.join(extractDir, file.fileHeader.name);

      // If it's a directory, create it
      if (file.fileHeader.flags.directory) {
        await fs.promises.mkdir(filePath, { recursive: true });
      } else {
        if (file.extraction) {
          const fileContent = Buffer.from(file.extraction);
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await fs.promises.writeFile(filePath, fileContent);
          console.log(`Extracted: ${file.fileHeader.name}`);
        } else {
          console.warn(`File extraction for ${file.fileHeader.name} returned undefined.`);
        }
      }

      console.log(`Extracted: ${file.fileHeader.name}`);
    }

    console.log(`RAR file extracted to: ${extractDir}`);
  } catch (error) {
    console.error(`Error extracting RAR file ${rarFilename}:`, error);
  }
};