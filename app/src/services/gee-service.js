const ee = require("@google/earthengine");

const {
  getClassifiedImage,
  getScale,
  createLegend,
  getInfo,
  getBufferGeometry,
  getFeatureCollectionProperties,
  hasClasses,
  combineReducers,
} = require("utils/ee");

const FEATURE_STYLE = { color: "FFA500", strokeWidth: 2 };
const DEFAULT_TILE_SCALE = 1;

// Translate geojson features to an EE feature collection
const getFeatureCollection = (geojson, buffer) => {
  let eeFeatureCollection;
  if (geojson && geojson.features && Array.isArray(geojson.features)) {
    eeFeatureCollection = ee.FeatureCollection(
      geojson.features.map((feature) => ({
        ...feature,
        geometry:
          buffer && feature.geometry.type === "Point"
            ? getBufferGeometry(feature, buffer / 1000)
            : feature.geometry,
      }))
    );
  }

  return eeFeatureCollection;
};

// Returns a single image that can styled as raster tiles
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

  return [eeImage, eeScale, eeImageBands];
};

class GeeService {
  // Returns raster tile url for a classified image
  static getTileUrl(config) {
    const { format, datasetId } = config;

    const { geojson, buffer } = config;

    let featurecollection = getFeatureCollection(geojson, buffer);

    return new Promise((resolve) => {
      if (format === "FeatureCollection") {
        let dataset = ee.FeatureCollection(datasetId).draw(FEATURE_STYLE);

        if (featurecollection) {
          dataset = dataset.clipToCollection(featurecollection);
        }

        dataset.getMap(null, (response) => resolve(response.urlFormat));
      } else {
        const legend = createLegend(config.params);
        config.legend = legend;

        const [image] = getImage(config);

        let { eeImage, params } = getClassifiedImage(image, config);

        if (featurecollection) {
          eeImage = eeImage.clipToCollection(featurecollection);
        }

        eeImage.visualize(params).getMap(null, (response) => {
          return resolve(response.urlFormat);
        });
      }
    });
  }

  // Returns available periods for an image collection
  static getPeriods(eeId, startDate, endDate, asFeatureCollection = true) {
    let imageCollection;

    if (startDate && endDate) {
      imageCollection = ee
        .ImageCollection(eeId)
        .filter(ee.Filter.date(startDate, endDate))
        .distinct("system:time_start")
        .sort("system:time_start", false);
    } else {
      imageCollection = ee
        .ImageCollection(eeId)
        .distinct("system:time_start")
        .sort("system:time_start", false);
    }

    if (asFeatureCollection) {
      const featureCollection = ee
        .FeatureCollection(imageCollection)
        .select(["system:time_start", "system:time_end"], null, false);

      return getInfo(featureCollection);
    }

    const distinctDates = imageCollection.aggregate_array("system:time_start");

    return getInfo(distinctDates);
  }

  // Returns aggregated values for geojson features
  static async getAggregations(config) {
    const {
      datasetId,
      format,
      aggregationType,
      band,
      legend,
      tileScale = DEFAULT_TILE_SCALE,
      geojson,
      buffer,
    } = config;

    const singleAggregation = !Array.isArray(aggregationType);
    const useHistogram =
      singleAggregation && hasClasses(aggregationType) && legend;

    const [image, scale, eeImageBands] = getImage(config);
    const collection = getFeatureCollection(geojson, buffer);

    if (collection) {
      if (format === "FeatureCollection") {
        const dataset = ee.FeatureCollection(datasetId);

        const aggFeatures = collection
          .map((feature) => {
            feature = ee.Feature(feature);
            const count = dataset.filterBounds(feature.geometry()).size();

            return feature.set("count", count);
          })
          .select(["count"], null, false);

        return getInfo(aggFeatures).then(getFeatureCollectionProperties);
      } else if (useHistogram) {
        // Used for landcover
        const reducer = ee.Reducer.frequencyHistogram();
        const scaleValue = await getInfo(scale);

        return getInfo(
          image
            .reduceRegions({
              collection,
              reducer,
              scale,
              tileScale,
            })
            .select(["histogram"], null, false)
        ).then((data) =>
          getHistogramStatistics({
            data,
            scale: scaleValue,
            aggregationType,
            legend,
          })
        );
      } else if (!singleAggregation && aggregationType.length) {
        const reducer = combineReducers(ee)(aggregationType);
        const props = [...aggregationType];

        let aggFeatures = image.reduceRegions({
          collection,
          reducer,
          scale,
          tileScale,
        });

        if (eeImageBands) {
          aggFeatures = eeImageBands.reduceRegions({
            collection: aggFeatures,
            reducer,
            scale,
            tileScale,
          });

          band.forEach((band) =>
            aggregationType.forEach((type) =>
              props.push(
                aggregationType.length === 1 ? band : `${band}_${type}`
              )
            )
          );
        }

        aggFeatures = aggFeatures.select(props, null, false);

        return getInfo(aggFeatures).then(getFeatureCollectionProperties);
      } else throw new Error("Aggregation type is not valid");
    } else throw new Error("Missing geojson features");
  }

  // Returns the data value at a position
  static async getValue(lnglat, config) {
    const { lng, lat } = lnglat;
    const eeImage = getImage(config);
    const point = ee.Geometry.Point(lng, lat);
    const reducer = ee.Reducer.mean();
    return getInfo(eeImage.reduceRegion(reducer, point, 1));
  }
}

module.exports = GeeService;
