const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const userRouter = require('./routes/userRoutes');
const teamRouter = require('./routes/teamRoutes');
const commentRouter = require('./routes/commentRoutes');
const profileRouter = require('./routes/profileRoutes');
const tokenRouter = require('./routes/tokenRoute');
<<<<<<< HEAD
const pokemonRouter = require('./routes/myPokemonRoutes');
const postRouter = require('./routes/postRoutes');
=======
const pokemonRouter = require('./routes/pokemonRoute');
const myPokemonRouter = require('./routes/myPokemonRoutes');
>>>>>>> 0061f14e7ca1feebd258e3d86a2044e42fa80357
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
app.use('/token', tokenRouter);
<<<<<<< HEAD
app.use('/posts', postRouter); 
app.use('/myPokemon', pokemonRouter); 
=======
app.use('/pokemon', pokemonRouter);
app.use('/token', tokenRouter)
app.use('/myPokemon', myPokemonRouter); 
>>>>>>> 0061f14e7ca1feebd258e3d86a2044e42fa80357

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