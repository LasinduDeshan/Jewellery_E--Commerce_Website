import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file, filename } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file data provided in request body.',
      });
    }

    let base64Data = file;
    let detectedExt = 'png';

    // Parse Data URL format e.g. data:image/jpeg;base64,... or data:video/mp4;base64,...
    const matches = file.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      base64Data = matches[2];
      const mimeExtMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/quicktime': 'mov',
        'video/ogg': 'ogv',
      };
      if (mimeExtMap[mimeType]) {
        detectedExt = mimeExtMap[mimeType];
      }
    }

    if (filename && filename.includes('.')) {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov'].includes(ext)) {
        detectedExt = ext === 'jpeg' ? 'jpg' : ext;
      }
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeBaseName = (filename ? path.parse(filename).name : 'media')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 30);
    const uniqueName = `${safeBaseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${detectedExt}`;
    const targetFilePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(targetFilePath, buffer);

    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}/uploads/${uniqueName}`;

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fullUrl,
      filename: uniqueName,
    });
  } catch (error: any) {
    next(error);
  }
};

