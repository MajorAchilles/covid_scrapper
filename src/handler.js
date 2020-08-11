const { JSDOM } = require("jsdom");
const axios = require("axios");
const logger = require("./logger");
const cache = require("./cache");

cache.create();

const DEFAULT_CACHE_TTL = 60 * 60 * 1000;

const getHandler = config => (req, res) => {
  const cacheObj = cache.get(parseInt(process.env.CACHE_TTL) || DEFAULT_CACHE_TTL, config.CACHE);
  if (!cacheObj.isStale) {
    res.send(cacheObj.data);
    return;
  }

  axios
    .get(config.URL)
    .then(html => {
      const dom = new JSDOM(html.data);
      const data = {
        ...config.PARSER(dom.window.document.querySelector(config.SELECTOR)),
        source: {
          url: config.URL,
          label: config.SOURCE
        }
      };
      cache.put(data, config.CACHE);
      res.send(data);
    })
    .catch(logger.error);
};

module.exports = getHandler;