const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const userRouter = require('./routes/userRoutes');
const teamRouter = require('./routes/teamRoutes');
const commentRouter = require('./routes/commentRoutes');
const profileRouter = require('./routes/profileRoutes');
const tokenRouter = require('./routes/tokenRoute');
<<<<<<< HEAD
const pokemonRouter = require('./routes/pokemonRoute');
=======
const pokemonRouter = require('./routes/myPokemonRoutes');
>>>>>>> 11b814fa7b331361f17799b8f602dcbf2b6d71b3
const { authenticateJWT } = require("./middleware/auth");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use(authenticateJWT);
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});
app.use('/users', userRouter);
app.use('/teams', teamRouter);
app.use('/comments', commentRouter);
app.use('/profiles', profileRouter);
<<<<<<< HEAD
app.use('/token', tokenRouter);
app.use('/pokemon', pokemonRouter);
=======
app.use('/token', tokenRouter)
app.use('/myPokemon', pokemonRouter); 
>>>>>>> 11b814fa7b331361f17799b8f602dcbf2b6d71b3

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