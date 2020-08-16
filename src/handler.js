const { JSDOM } = require("jsdom");
const axios = require("axios");
const logger = require("./logger");
const cache = require("./cache");
const config = require("./config");

cache.create();

const getHandler = config => (_req, res) => {
  const cacheObj = cache.get(config.CACHE_TTL, config.CACHE);
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