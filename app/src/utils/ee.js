const circle = require("@turf/circle");
const polygonBuffer = require("@turf/buffer");

const squareMetersToHectares = (value) => value / 10000;

const squareMetersToAcres = (value) => value / 4046.8564224;

const classAggregation = ["percentage", "hectares", "acres"];

const hasClasses = (type) => classAggregation.includes(type);

// Makes evaluate a promise
const getInfo = (instance) =>
  new Promise((resolve, reject) =>
    instance.evaluate((data, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  );

// Combine multiple aggregation types/reducers
// unweighted means that centroids are used for each grid cell
// https://developers.google.com/earth-engine/guides/reducers_intro
// https://developers.google.com/earth-engine/guides/reducers_reduce_region#pixels-in-the-region
const combineReducers = (ee) => (types) =>
  types.reduce(
    (r, t, i) =>
      i === 0
        ? r[t]().unweighted()
        : r.combine({
            reducer2: ee.Reducer[t]().unweighted(),
            sharedInputs: true,
          }),
    ee.Reducer
  );

// Returns the linear scale in meters of the units of this projection
const getScale = (image) => image.select(0).projection().nominalScale();

// Returns visualisation params from legend
getParamsFromLegend = (legend) => {
  const keys = legend.map((l) => l.id);
  const min = Math.min(...keys);
  const max = Math.max(...keys);
  const palette = legend.map((l) => l.color).join(",");

  return { min, max, palette };
};

// Returns histogram data (e.g. landcover) in percentage, hectares or acres
const getHistogramStatistics = ({ data, scale, aggregationType, legend }) =>
  data.features.reduce((obj, { id, properties }) => {
    const { histogram } = properties;
    const sum = Object.values(histogram).reduce((a, b) => a + b, 0);

    obj[id] = legend.reduce((values, { id }) => {
      const count = histogram[id] || 0;
      const sqMeters = count * (scale * scale);
      let value;

      switch (aggregationType) {
        case "hectares":
          value = Math.round(squareMetersToHectares(sqMeters));
          break;
        case "acres":
          value = Math.round(squareMetersToAcres(sqMeters));
          break;
        default:
          value = (count / sum) * 100; // percentage
      }

      values[id] = value;

      return values;
    }, {});

    return obj;
  }, {});

// Reduce a feature collection to an object of properties
const getFeatureCollectionProperties = (data) =>
  data.features.reduce(
    (obj, f) => ({
      ...obj,
      [f.id]: f.properties,
    }),
    {}
  );

// Classify image according to legend
const getClassifiedImage = (eeImage, { legend = [], params }) => {
  if (!params) {
    // Image has classes (e.g. landcover)
    return { eeImage, params: getParamsFromLegend(legend) };
  }

  const min = 0;
  const max = legend.length - 1;
  const { palette } = params;
  let zones;

  for (let i = min, item; i < max; i++) {
    item = legend[i];

    if (!zones) {
      zones = eeImage.gt(item.to);
    } else {
      zones = zones.add(eeImage.gt(item.to));
    }
  }

  return { eeImage: zones, params: { min, max, palette } };
};

function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

const numberPrecision = (d) => {
  if (d === undefined) {
    return (n) => n;
  }
  const m = Math.pow(10, d);
  return (n) => Math.round(n * m) / m;
};

const createLegend = ({ min, max, palette }) => {
  const colors = palette.split(",");
  const step = (max - min) / (colors.length - (min > 0 ? 2 : 1));
  const precision = precisionRound(step, max);
  const valueFormat = numberPrecision(precision);

  let from = min;
  let to = valueFormat(min + step);

  return colors.map((color, index) => {
    const item = { color };

    if (index === 0 && min > 0) {
      // Less than min
      item.from = 0;
      item.to = min;
      item.name = "< " + min;
      to = min;
    } else if (from < max) {
      item.from = from;
      item.to = to;
      item.name = from + " - " + to;
    } else {
      // Higher than max
      item.from = from;
      item.name = "> " + from;
    }

    from = to;
    to = valueFormat(min + step * (index + (min > 0 ? 1 : 2)));

    return item;
  });
};

const getBufferGeometry = ({ geometry }, buffer) =>
  (geometry.type === "Point"
    ? circle(geometry, buffer)
    : polygonBuffer(geometry, buffer)
  ).geometry;

module.exports = {
  hasClasses,
  getInfo,
  combineReducers,
  getHistogramStatistics,
  getFeatureCollectionProperties,
  getClassifiedImage,
  getScale,
  createLegend,
  getBufferGeometry,
};
