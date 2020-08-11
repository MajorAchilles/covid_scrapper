const express = require('express');
const logger = require("./src/logger");
const getHandler = require("./src/handler");

const app = express();
const port = process.env.PORT || 443;

const CONFIG = {
  CASES: {
    SELECTOR: "#covid19-container > table",
    URL: "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/India_medical_cases_by_state_and_union_territory",
    CACHE: "cases.json",
    SOURCE: "Wikipedia"
  },
  HISTORY: {
    SELECTOR: "#mw-content-text > div.mw-parser-output > div.barbox.tright > div > table",
    URL: "https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data/India_medical_cases_chart",
    CACHE: "history.json",
    SOURCE: "Wikipedia"
  }
};

app.get('/cases', getHandler(CONFIG.CASES));
app.get('/history', getHandler(CONFIG.HISTORY));

app.listen(port, () => {
  logger.log(`Covid Scrapper running at port: ${port}`)
});