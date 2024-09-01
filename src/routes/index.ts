import express, { Request, Response, Router } from 'express';
// import { handleIncomingEmail } from '../controllers/emailController';

const router: Router = express.Router();

class EmailController {
    // Assuming EmailController is a class with an 'on' method
    on(event: string, callback: (result: any) => void) {
        // Implementation of the 'on' method
    }
}

const emailController = new EmailController();

emailController.on('imageProcessed', (result: any) => {
    console.log('Image processed:', result);
    // Broadcast result to WebSocket clients
    // global.io.emit('imageProcessed', result);
});

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Node.js Backend');
});

export default router;
