
import { ParsedMail } from 'mailparser';
import fs from 'fs';
import path from 'path';
import { extractZipAttachment } from './extractor';

export const parseEmail = async (parsedEmail: ParsedMail): Promise<void> => {
  console.log('Parsing email with subject:', parsedEmail.subject);

  if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
    console.log('No attachments found in the email.');
    return;
  }

  for (const attachment of parsedEmail.attachments) {
    const { filename, contentType, content } = attachment;

    if (!filename || !contentType || !content) {
      console.log(`Attachment is missing necessary properties.`);
      continue;
    }

    const attachmentsDir = path.join(__dirname, 'attachments');
    await fs.promises.mkdir(attachmentsDir, { recursive: true });
    const filePath = path.join(attachmentsDir, filename);

    await fs.promises.writeFile(filePath, content);
    console.log(`Attachment saved: ${filePath}`);

    if (contentType === 'application/zip' || filename.endsWith('.zip')) {
      console.log(`Extracting zip file: ${filename}`);
      await extractZipAttachment(content, filename);
    } else {
      console.log(`Attachment ${filename} is not a zip file.`);
    }
  }
};
