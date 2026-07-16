import { Router, Request, Response, NextFunction } from 'express';
import { authRoutes, postRoutes, userRoutes } from '../routes';

const router: Router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/users', userRoutes);

router.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
        message: 'Successful',
        data: {
            message: 'Server is up and running...'
        }
    });
});

export default router;
