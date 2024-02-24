const express = require("express");
const authentication = require("../middlewares/authentication");

const {
  createService,
  getAllServices,
  getServiceByName,
  updateServiceById,
  getServiceByProviderId,
  deleteServiceById,
  getPendingService,
  getServiceByProvider,
  updateService,

  getAllOrdersOfProvider,


} = require("../controllers/service");

const serviceRouter = express.Router();

serviceRouter.post("/", authentication, createService);


serviceRouter.get("/", getAllServices);

serviceRouter.get("/byName", getServiceByName);
serviceRouter.put("/:service_id", authentication,updateServiceById);

serviceRouter.get("/provider/:id", authentication,getServiceByProviderId)
serviceRouter.delete("/:id", authentication, deleteServiceById)

serviceRouter.get("/byStatus", getPendingService);
serviceRouter.get("/provider", authentication, getServiceByProvider)
serviceRouter.put("/provider/update/:id", authentication, updateService)

serviceRouter.get("/orders/all", authentication, getAllOrdersOfProvider)


module.exports = serviceRouter;
