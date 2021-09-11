const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const fileRotateTransport = new transports.DailyRotateFile({
  filename: `${process.env.LOG_DIR}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

const accessRotateTransport = new transports.DailyRotateFile({
  filename: `${process.env.LOG_DIR}/access-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

const timezoned = () =>
  new Date().toLocaleString('en-US', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour: '2-digit',
    year: 'numeric',
  });

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: timezoned }),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const fileFormat = format.combine(
  format.timestamp({ format: timezoned }),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const logger = new createLogger({
  format: fileFormat,
  transports: [fileRotateTransport],
  exitOnError: false,
});

const accessLogger = new createLogger({
  format: fileFormat,
  transports: [accessRotateTransport],
  exitOnError: false,
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: consoleFormat,
    }),
  );

  accessLogger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: consoleFormat,
    }),
  );
}

accessLogger.stream = {
  write: (message) => {
    accessLogger.info(message.replace(/\n$/, ''));
  },
};

module.exports = { logger, accessLogger };
