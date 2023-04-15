const ee = require("@google/earthengine");

const { getRegion } = require("utils/geo");

var EA_COUNTRIES = ee.List([
  "BDI",
  "DJI",
  "ERI",
  "ETH",
  "KEN",
  "RWA",
  "SOM",
  "SSD",
  "SDN",
  "TZA",
  "UGA",
]);

class WorldPopService {
  static analyze(geojson, buffer = null) {
    var eaPopImage = ee.Image(
      "users/otenyoerick/projects/eahw/ea_worldpop_pop_100m_2020"
    );

    // get region
    let [region, featureCount] = getRegion(geojson);

    if (buffer && featureCount === 1) {
      region = ee.Feature(region.first());
      region = region.buffer(buffer * 10000);
    }
    // get image projection
    var projection = eaPopImage.projection();

    // get population sum for region
    var stats = eaPopImage
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: region.geometry(),
        bestEffort: false,
        scale: projection.nominalScale(),
        maxPixels: 1e20,
      })
      .getInfo();

    return { results: stats };
  }
}

module.exports = WorldPopService;
