import { Router } from 'express';
import { ensureLoggedIn } from '../middleware/auth.js';

const router = Router();

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user = res.locals.user
    if (user) {
        return res.status(200).json(user);
    }
    throw new UnauthorizedError;
});

export default router;