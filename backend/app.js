import express, { json, urlencoded } from 'express';
import cors from 'cors';
import logger from './util/logger.js';
import userRouter from './routes/userRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import tokenRouter from './routes/tokenRoute.js';
import { authenticateJWT } from "./middleware/auth.js";

const app = express();
const PORT = 3001;

app.use(json());
app.use(cors());
app.use(urlencoded());
app.use(authenticateJWT);
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});
app.use('/users', userRouter);
app.use('/teams', teamRouter);
app.use('/comments', commentRouter);
app.use('/profiles', profileRouter);
app.use('/token', tokenRouter)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});