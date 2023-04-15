const Router = require("koa-router");
const logger = require("logger");

const GeostoreService = require("services/geostore-service");
const LandCoverService = require("services/analysis/landcover-service");

const router = new Router({
  prefix: "/landcover",
});

class LandCoverRouter {
  static async getByGeostore(ctx) {
    ctx.assert(ctx.query.geostore, 400, "geostore required");

    const geostoreId = ctx.query.geostore;

    const geojson = await GeostoreService.get(geostoreId);

    if (!geojson) {
      ctx.throw(404, "GeoStore not found");
      return;
    }

    const results = LandCoverService.analyze(geojson);

    ctx.body = results;
  }
}

router.get("/", LandCoverRouter.getByGeostore);

module.exports = router;
