import { Router } from 'express';
import healthRoutes from './healthRoutes';

const router = Router();

// Mount health routes
router.use('/', healthRoutes);

// Example: Add more routes here as needed
// router.use('/users', userRoutes);
// router.use('/qr', qrRoutes);

export default router;