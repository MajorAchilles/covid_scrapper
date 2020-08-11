const fs = require("fs");
const path = require("path");

const get = (expiryTime, cachePath) => {
  const cache = {
    stale: false,
    data: null,
    lastScrapedOn: null
  };

  try {
    const cacheFilePath = path.join(__dirname, cachePath);
    fs.accessSync(cacheFilePath);
    const stat = fs.statSync(cacheFilePath);
    logger.log(stat.mtime);
  } catch {
    cache.stale = true;
  } finally {
    return cache;
  }
};

const put = (data, cachePath) => {
  const cacheFilePath = path.join(__dirname, cachePath);
  fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2), { encoding: "utf8"});
}


module.exports = {
  get,
  put
};
