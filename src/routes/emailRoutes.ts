import express, { Request, Response, Router } from 'express';
import { handleIncomingEmail } from '../controllers/emailController';

const router: Router = express.Router();

router.post('/receive', (req: Request, res: Response) => {
  handleIncomingEmail(req, res);
});

export default router;
