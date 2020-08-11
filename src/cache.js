const fs = require("fs");
const path = require("path");

const APP_DIR = process.cwd();
const CACHE_DIR = path.join(APP_DIR, ".cache");

const get = (expiryTime, cachePath) => {
  const cache = {
    stale: false,
    data: null,
    lastScrapedOn: null
  };

  try {
    const cacheFilePath = path.join(CACHE_DIR, cachePath);
    fs.accessSync(cacheFilePath);
    const stat = fs.statSync(cacheFilePath);
    logger.warn(stat.mtime);
  } catch {
    cache.stale = true;
  } finally {
    return cache;
  }
};

const put = (data, cachePath) => {
  const cacheFilePath = path.join(CACHE_DIR, cachePath);
  fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2), { encoding: "utf8"});
}

const create = () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }
}


module.exports = {
  create,
  get,
  put
};
