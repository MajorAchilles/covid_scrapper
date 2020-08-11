const shouldLog = () => {
  return !!process.env.DEV;
};

const info = text => {
  if (shouldLog()) {
    console.info(text);
  }
}

const log = text => {
  if (shouldLog()) {
    console.log(text);
  }
}

const warn = text => {
  console.warn(text);
}

const error = text => {
  console.error(text);
}

const logger = {
  log,
  error,
  info,
  warn
};

module.exports = logger;