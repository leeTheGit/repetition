import { createLogger, format, transports } from 'winston'

const fileTransport = new transports.File({
    filename: 'dev.log',
    format: format.prettyPrint(),
})

const consoleTransport = new transports.Console({
    format: format.prettyPrint(),
})

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        // format.splat(),
        // format.printf(({ timestamp, level, message }) => {
        //     return `${timestamp} ${level}: ${message}`;
        // }),
        format.json()
    ),
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(fileTransport)
    logger.add(consoleTransport)
} else {
    logger.add(consoleTransport)
}
