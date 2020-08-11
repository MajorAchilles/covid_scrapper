const fs = require("fs");
const path = require("path");
const logger = require("./logger");

const APP_DIR = process.cwd();
const CACHE_DIR = path.join(APP_DIR, ".cache");


const getCacheObject = (data = null, lastScrapedOn = null, isStale = true) => ({
  isStale,
  data,
  lastScrapedOn
});

const isStale = (cacheTime, milisecondsToLive) => {
  return Date.now() - cacheTime > milisecondsToLive;
};

const getMemoryCache = (milisecondsToLive, cachePath) => {
  const cacheMetaData = global.cache.metadata[cachePath];
  if (cacheMetaData) {
    if (!isStale(milisecondsToLive, cacheMetaData.mtimeMs)) {
      return getCacheObject(
        global.cache.data[cachePath],
        global.cache.metadata[cachePath].mtimeMs,
        false
      );
    } else {
      logger.warn(`Memory cache for "${cachePath}" is stale.`);
      return getCacheObject();
    }
  }
  logger.warn(`No memory cache found for "${cachePath}"!`);
  return getCacheObject();
}

const getStorageCache = (milisecondsToLive, cachePath) => {
  try {
    const cacheFilePath = path.join(CACHE_DIR, cachePath);
    fs.accessSync(cacheFilePath);
    const stat = fs.statSync(cacheFilePath);
    if (!isStale(milisecondsToLive, parseInt(stat.mtimeMs))) {
      return getCacheObject(
        JSON.parse(
          fs.readFileSync(
            cacheFilePath,
            { encoding: "utf8"}
          ).toString()
        ),
        stat.mtimeMs,
        false
      );
    }
    logger.warn(`Storage cache for "${cachePath}" is stale.`);
  } catch (error) {
    logger.warn(`No storage cache found for "${cachePath}"!`);
  } finally {
    return getCacheObject();
  }
}

const get = (milisecondsToLive, cachePath) => {
  const cache = getMemoryCache(milisecondsToLive, cachePath);

  if (!cache.isStale) {
    return cache;
  }

  return getStorageCache(milisecondsToLive, cachePath);
};

const put = (data, cachePath) => {
  logger.warn(`Creating memory and storage cache for "${cachePath}"...`);

  global.cache.data[cachePath] = data;
  global.cache.metadata[cachePath] = {
    mtimeMs: Date.now()
  };

  const cacheFilePath = path.join(CACHE_DIR, cachePath);
  fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2), { encoding: "utf8"});
};

const create = () => {
  global.cache = {
    data: {},
    metadata: {}
  };

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }
};

module.exports = {
  create,
  get,
  put
};
