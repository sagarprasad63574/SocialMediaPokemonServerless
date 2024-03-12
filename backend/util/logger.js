const {createLogger, format, transports} = require('winston');
const logger = createLogger({
    level: "info", 
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp}, [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({filename: "app.log"}),
        new transports.Console()
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

module.exports = logger;