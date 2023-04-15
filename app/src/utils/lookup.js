const worldCoverMapping = {
  10: "Trees",
  20: "Shrubland",
  30: "Grassland",
  40: "Cropland",
  50: "Built-up",
  60: "Barren / sparse vegetation",
  70: "Snow and ice",
  80: "Open water",
  90: "Herbaceous wetland",
  95: "Mangroves",
  100: "Moss and lichen",
};

const landCoverLookup = (results) => {
  return Object.keys(results).reduce((all, key) => {
    if (key !== "null") {
      landcoverName = worldCoverMapping[key];
      const resultsObj = {
        resultType: "areaHectares",
        className: landcoverName,
        classVal: key,
        result: results[key],
      };
      all.push(resultsObj);
    }
    return all;
  }, []);
};

module.exports = { landCoverLookup };
