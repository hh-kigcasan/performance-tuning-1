const Express = require("express");
const Router = Express.Router();
const MerchandiseController = require(`../controllers/merchandise`);

// const middleware = require(`../../system/middleware`);

Router.get("/", MerchandiseController.index);
Router.post("/filter", MerchandiseController.displayItems);

module.exports = Router;