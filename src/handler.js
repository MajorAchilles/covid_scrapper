const { JSDOM } = require("jsdom");
const axios = require("axios");
const logger = require("./logger");
const cache = require("./cache");

cache.create();

const getHandler = config => (req, res) => {
  const cacheObj = cache.get(null, config.CACHE);
  if (!cacheObj.stale) {
    return cacheObj.data;
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