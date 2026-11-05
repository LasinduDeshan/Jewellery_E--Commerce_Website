import { Router } from 'express';
import { uploadFileController } from '../controllers/upload.controller.js';

const router = Router();

router.post('/', uploadFileController);

export default router;

