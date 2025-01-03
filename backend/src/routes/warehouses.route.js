import express from "express";
import warehousesController from "../controllers/warehouses.controller.js";
import warehouseValidateMiddleware from "../middlewares/warehouse-validate.middleware.js";
import warehouseAuthMiddleware from "../middlewares/warehouse-auth.middleware.js";

const warehouseRouter = express.Router();

warehouseRouter.post(
  "/auth/sign-in",
  warehouseValidateMiddleware.validateWarehouseSignInRequest,
  warehousesController.signInWarehouse,
);

warehouseRouter.use(warehouseAuthMiddleware.verifyWarehouseToken);

warehouseRouter.get("/me", warehousesController.getWarehouse);

warehouseRouter.post("/auth/sign-out", warehousesController.signOutWarehouse);

warehouseRouter.post(
  "/departure/:orderStopId",
  warehouseValidateMiddleware.validateOrderDepartureRequest,
  warehousesController.departureOrderStop,
);

warehouseRouter.patch(
  "/verify/:orderStopId",
  warehousesController.verifyOrderStop,
);

warehouseRouter.delete(
  "/delete/:orderStopId",
  warehousesController.deleteOrderStop,
);

export default warehouseRouter;
