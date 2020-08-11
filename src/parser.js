const localeStringToInt = value => {
  return parseInt(value.split(",").join(""));
};

const parseCasesTable = table => {
  const items = table.split("\n\n\n")
    .map(row => row.split("\n").filter(item => !!item))
    .filter(row => row.length >= 5)
    .filter((_, index) => index > 1);
  
  return {
    states: items.map(item => {
      return {
        territory: item[0],
        total: localeStringToInt(item[1]),
        deaths: localeStringToInt(item[2]),
        recoveries: localeStringToInt(item[3]),
        active: localeStringToInt(item[4])
      }
    })
  };
};

const getDeltaString = value => {
  if (value === "n.a." || value === "=") {
    return 0;
  } else {
    return value.match(/[^\+\%]*/g)[1];
  }
}

const parseHistoryTable = table => {
  const parsedRows = [];
  let check = true;

  for(let index = 2; index < table.rows.length - 1; index++) {
    const rowData = table.rows[index].textContent.split("\n");

    if (check && rowData[1] === "2020-03-02") {
      check = false;
    }

    if(!check) {
      const caseStrings = rowData[rowData.length - 3].split("(");
      const caseDelta = caseStrings[1].split(")")[0];
      const deathStrings = rowData[rowData.length - 2].split("(");
      const deathDelta = deathStrings[1].split(")")[0];

      parsedRows.push({
        date: rowData[1],
        cases: {
          count: localeStringToInt(caseStrings[0]),
          delta: getDeltaString(caseDelta)
        },
        deaths: {
          count: localeStringToInt(deathStrings[0]),
          delta: getDeltaString(deathDelta)
        }
      });
    }
  }

  return {
    history: parsedRows
  };
};

module.exports = {
  cases: parseCasesTable,
  history: parseHistoryTable
};
