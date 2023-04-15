const ee = require("@google/earthengine");

const getRegion = (geojson) => {
  polygons = [];

  geojson.features.forEach((feature) => {
    featureType = feature.geometry.type;
    coordinates = feature.geometry.coordinates;

    if (featureType === "MultiPolygon") {
      polygons.push(ee.Geometry.MultiPolygon(coordinates));
    }

    if (featureType === "Polygon") {
      polygons.push(ee.Geometry.Polygon(coordinates));
    }
  });

  return [ee.FeatureCollection(polygons), polygons.length];
};

module.exports = { getRegion };
