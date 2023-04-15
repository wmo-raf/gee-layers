const ee = require("@google/earthengine");

const { getRegion } = require("utils/geo");
const { flattenAreaHist } = require("utils/gee-response");
const { landCoverLookup } = require("utils/lookup");

class LandCoverService {
  static analyze(geojson) {
    let landCoverImage = ee.ImageCollection("ESA/WorldCover/v100").first();

    // add extra band for grouping
    landCoverImage = landCoverImage.addBands([ee.Image.pixelArea()]);

    const reducer = ee.Reducer.frequencyHistogram().unweighted().group();
    
    const [region] = getRegion(geojson)

    const reduce_args = {
      reducer: reducer,
      geometry:region ,
      scale: 9.276624232772797,
      bestEffort: false,
      maxPixels: 1e20,
    };

    let areaStats = landCoverImage.reduceRegion(reduce_args).getInfo();

    areaStats = flattenAreaHist(areaStats);

    const results = landCoverLookup(areaStats);

    return { results: results };
  }
}

module.exports = LandCoverService;
