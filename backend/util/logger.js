import winston from 'winston';
const logger = winston.createLogger({
    level: "info", 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({timestamp, level, message}) => {
            return `${timestamp}, [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({filename: "app.log"}),
        new winston.transports.Console()
    ]
});

process.on("uncaughtException", err => {
    logger.error(`Uncaught Exception: ${err}`);
    if(err == "Error: No available storage method found.")
    {

    }
    else
    {
        process.exit(1);
    }
});

export default logger;