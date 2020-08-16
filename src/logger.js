const fs = require("fs");
const config = require("./config");

const logToDisk = message => {
  const stream = fs.createWriteStream("covidscraper.log", { flags:'a' });
  stream.write(`${Date.now()}\t${message}\n`);
  stream.end();
};

const shouldLog = () => {
  return config.DEV;
};

const info = text => {
  if (shouldLog()) {
    console.info(text);
  }
  logToDisk(`INFO ${text}`);
}

const log = text => {
  if (shouldLog()) {
    console.log(text);
  }
  logToDisk(`LOG ${text}`);
}

const warn = text => {
  console.warn(text);
  logToDisk(`WARN ${text}`);
}

const error = text => {
  console.error(text);
  logToDisk(`ERROR ${text}`);
}

const logger = {
  log,
  error,
  info,
  warn
};

module.exports = logger;