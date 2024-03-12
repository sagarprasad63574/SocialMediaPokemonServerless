import { Router } from 'express';
import { editProfile, getUser } from '../service/userService.js';
import { ensureLoggedIn } from '../middleware/auth.js';
import { BadRequestError, NotFoundError } from '../util/expressError.js';

const router = Router();

router.post('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.username;
    try {
        const data = await editProfile({username, ...req.body});
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.id;
    try {
        const data = await getUser(user_id);
        if(!data.response) throw new NotFoundError(data.errors);
        return res.status(200).json(data);     
    } catch (error) {
        return next(error);
    }
});

export default router;