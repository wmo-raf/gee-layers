const Router = require("koa-router");
const logger = require("logger");

const GeostoreService = require("services/geostore-service");
const ElevationService = require("services/analysis/elevation-service");

const router = new Router({
  prefix: "/elevation",
});

class ElevationRouter {
  static async getByGeostore(ctx) {
    ctx.assert(ctx.query.geostore, 400, "geostore required");

    const geostoreId = ctx.query.geostore;

    const geojson = await GeostoreService.get(geostoreId);

    if (!geojson) {
      ctx.throw(404, "GeoStore not found");
      return;
    }

    const results = ElevationService.analyze(geojson);

    ctx.body = results;
  }
}

router.get("/", ElevationRouter.getByGeostore);

module.exports = router;
