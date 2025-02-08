import winston from 'winston';

// Konfiguracja formatu logów
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// Utworzenie loggera
const logger = winston.createLogger({
  level: 'info', // Minimalny poziom logowania (możesz zmienić na 'debug' lub inny)
  format: logFormat,
  transports: [
    // Logowanie do konsoli
    new winston.transports.Console(),
    // Logowanie do pliku (ścieżka może być zmieniona)
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;