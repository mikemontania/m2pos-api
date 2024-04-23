const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');

const ensureLogDirectoryExists = () => {
  fs.promises.mkdir(logDir, { recursive: true })
    .then(() => console.log(`Log directory ${logDir} created successfully.`))
    .catch((err) => console.error(`Error creating log directory: ${err.message}`));
};

const getLogFileName = () => {
  const now = new Date();
  const dateString = now.toISOString().slice(0, 10); // YYYY-MM-DD format
  return `${dateString}_log.log`;
};

const loggerPos = () => {
  ensureLogDirectoryExists();
  const logFilePath = path.join(logDir, getLogFileName());
  const logFile = fs.createWriteStream(logFilePath, { flags: 'a' });

  const writeLog = (stream, message) => {
    const now = new Date().toISOString();
    const sanitizedMessage = message.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Filtra caracteres especiales
    stream.write(`[${now}] ${sanitizedMessage}\n`);
  };

  process.stdout.write = (message) => writeLog(logFile, message);
  process.stderr.write = (message) => writeLog(logFile, message);
};

module.exports = { loggerPos };