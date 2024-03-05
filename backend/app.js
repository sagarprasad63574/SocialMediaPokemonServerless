const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});