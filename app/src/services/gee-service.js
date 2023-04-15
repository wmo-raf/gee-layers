const ee = require("@google/earthengine");

const { getRegion } = require("utils/geo");
const { getClassifiedImage, getScale, createLegend } = require("utils/ee");

const FEATURE_STYLE = { color: "FFA500", strokeWidth: 2 };
const DEFAULT_TILE_SCALE = 1;

const getImage = (config) => {
  const { datasetId, filter, mosaic, band, bandReducer, mask, methods } =
    config;

  let eeImage;
  let eeScale;
  let eeImageBands;

  if (!filter) {
    // Single image
    eeImage = ee.Image(datasetId);
    eeScale = getScale(eeImage);
  } else {
    // Image collection
    let collection = ee.ImageCollection(datasetId);

    // Scale is lost when creating a mosaic below
    eeScale = getScale(collection.first());

    // Apply array of filters (e.g. period)
    filter.forEach((f) => {
      collection = collection.filter(
        ee.Filter[f.type].apply(this, f.arguments)
      );
    });

    eeImage = mosaic
      ? collection.mosaic() // Composite all images inn a collection (e.g. per country)
      : ee.Image(collection.first()); // There should only be one image after applying the filters
  }

  // // Select band (e.g. age group)
  if (band) {
    eeImage = eeImage.select(band);

    if (Array.isArray(band) && bandReducer) {
      // Keep image bands for aggregations
      eeImageBands = eeImage;

      // Combine multiple bands (e.g. age groups)
      eeImage = eeImage.reduce(ee.Reducer[bandReducer]());
    }
  }

  // Mask out 0-values
  if (mask) {
    eeImage = eeImage.updateMask(eeImage.gt(0));
  }

  // Run methods on image
  if (methods) {
    Object.keys(methods).forEach((method) => {
      if (eeImage[method]) {
        eeImage = eeImage[method].apply(eeImage, methods[method]);
      }
    });
  }

  eeImage = eeImage;

  return eeImage;
};

class GeeService {
  static getTileUrl(config) {
    const { geojson, format, datasetId } = config;

    // get region
    let [region] = getRegion(geojson);

    return new Promise((resolve) => {
      if (format === "FeatureCollection") {
        let dataset = ee.FeatureCollection(datasetId).draw(FEATURE_STYLE);

        if (region) {
          dataset = dataset.clipToCollection(region);
        }

        dataset.getMap(null, (response) => resolve(response.urlFormat));
      } else {
        const legend = createLegend(config.params);
        config.legend = legend;

        let { eeImage, params } = getClassifiedImage(getImage(config), config);

        if (region) {
          eeImage = eeImage.clipToCollection(region);
        }

        eeImage.visualize(params).getMap(null, (response) => {
          return resolve(response.urlFormat);
        });
      }
    });
  }
}

module.exports = GeeService;
