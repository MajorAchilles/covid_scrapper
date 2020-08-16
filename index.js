const express = require('express');
const logger = require("./src/logger");
const getHandler = require("./src/handler");
const dotenv = require("dotenv");
const parser = require("./src/parser");
const config = require("./src/config");

dotenv.config();

const app = express();

const CONFIG = {
  CASES: {
    SELECTOR: "#covid19-container > table",
    URL: "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/India_medical_cases_by_state_and_union_territory",
    CACHE: "cases.json",
    SOURCE: "Wikipedia",
    PARSER: parser.cases
  },
  HISTORY: {
    SELECTOR: "#mw-content-text > div.mw-parser-output > div.barbox.tright > div > table",
    URL: "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/India_medical_cases_chart",
    CACHE: "history.json",
    SOURCE: "Wikipedia",
    PARSER: parser.history
  }
};

app.get('/cases', getHandler(CONFIG.CASES));
app.get('/history', getHandler(CONFIG.HISTORY));

app.listen(config.PORT, () => {
  logger.warn(`Covid Scrapper running at port: ${config.PORT}`)
  if (config.CACHE_TTL) {
    logger.warn(`Cache time to live (in miliseconds): ${config.CACHE_TTL}`)
  }
});
