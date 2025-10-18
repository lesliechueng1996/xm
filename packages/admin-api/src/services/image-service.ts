import fs from 'node:fs';
import path from 'node:path';
import { formatDate, generateUUID } from '@repo/server-common';

export const saveImage = async (file: File) => {
  const staticDir = process.env.STATIC_DIR;
  if (!staticDir) {
    throw new Error('STATIC_DIR is not set in environment variables');
  }

  const today = formatDate(new Date(), 'yyyyMMdd');
  const adminStaticDir = path.join(staticDir, 'admin', today);
  if (!fs.existsSync(adminStaticDir)) {
    fs.mkdirSync(adminStaticDir, { recursive: true });
  }

  const fileExt = path.extname(file.name);
  const fileName = `${generateUUID()}${fileExt}`;
  const imagePath = path.join(adminStaticDir, fileName);
  fs.writeFileSync(imagePath, Buffer.from(await file.arrayBuffer()));
  return imagePath.replace(staticDir, '');
};
