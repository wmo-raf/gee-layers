const ee = require("@google/earthengine");

const { getRegion } = require("utils/geo");

class ElevationService {
  static analyze(geojson) {
    var eaElevationImage = ee.Image(
      "users/otenyoerick/projects/eahw/ea_elevation"
    );

    // get region
    let [region] = getRegion(geojson);

    // get image projection
    var projection = eaElevationImage.projection();

    var reducers = ee.Reducer.mean().combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true,
    });

    // get population sum for region
    var stats = eaElevationImage
      .reduceRegion({
        reducer: reducers,
        geometry: region.geometry(),
        bestEffort: false,
        scale: projection.nominalScale(),
        maxPixels: 1e12,
      })
      .getInfo();

    return { results: stats };
  }
}

module.exports = ElevationService;
