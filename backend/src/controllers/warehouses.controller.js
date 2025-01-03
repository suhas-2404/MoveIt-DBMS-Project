import Warehouse from "../models/warehouse.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OrderStop from "../models/order-stop.model.js";
import Vehicle from "../models/vehicle.model.js";
import Employee from "../models/employee.model.js";
import mongoose, { get } from "mongoose";

const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.warehouseId).select(
      "-password -__v",
    );

    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse doesn't exist",
      });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
};

const signInWarehouse = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const warehouse = await Warehouse.findOne({ email });

    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse doesn't exist. Please Sign-up",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, warehouse.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    const token = jwt.sign(
      { warehouseId: warehouse._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("warehouse_auth_token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      warehouseId: warehouse._id,
      message: "Signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};

const signOutWarehouse = async (req, res, next) => {
  try {
    res.clearCookie("warehouse_auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const departureOrderStop = async (req, res, next) => {
  try {
    const { orderStopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderStopId)) {
      return res.status(400).json({
        message: "Invalid order stop id",
      });
    }

    const { vehicleId, driverId } = req.body;

    const orderStop = await OrderStop.findById(orderStopId);

    if (!orderStop) {
      return res.status(404).json({
        message: "Order stop not found",
      });
    }

    const [vehicle, employee] = await Promise.all([
      Vehicle.findById(vehicleId),
      Employee.findById(driverId),
    ]);

    if (!vehicle || !employee) {
      return res.status(404).json({
        message: !vehicle ? "Vehicle not found" : "Driver not found",
      });
    }

    if (employee.role !== "driver") {
      return res.status(400).json({
        message: "Employee is not a driver",
      });
    }

    orderStop.departure_datetime = Date.now();
    orderStop.vehicle_id = vehicleId;
    orderStop.driver_id = driverId;
    orderStop.curr_status = "departed";

    await orderStop.save();

    res.status(200).json({
      message: "Order stop departed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOrderStop = async (req, res, next) => {
  try {
    const { orderStopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderStopId)) {
      return res.status(400).json({
        message: "Invalid order stop id",
      });
    }

    const orderStop = await OrderStop.findById(orderStopId);

    if (!orderStop) {
      return res.status(404).json({
        message: "Order stop not found",
      });
    }

    if (orderStop.isVerified) {
      return res.status(400).json({
        message: "Order stop already verified",
      });
    }

    orderStop.isVerified = true;
    await orderStop.save();

    res.status(200).json({
      message: "Order stop verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrderStop = async (req, res, next) => {
  try {
    const { orderStopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderStopId)) {
      return res.status(400).json({
        message: "Invalid order stop id",
      });
    }

    // Can delete the order stop only if it is not verified
    const orderStop = await OrderStop.findById(orderStopId);

    if (!orderStop) {
      return res.status(404).json({
        message: "Order stop not found",
      });
    }

    if (orderStop.isVerified) {
      return res.status(400).json({
        message: "Order stop already verified and cannot be deleted",
      });
    }

    await orderStop.deleteOne();

    res.status(200).json({
      message: "Order stop deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getWarehouse,
  signInWarehouse,
  signOutWarehouse,
  verifyOrderStop,
  departureOrderStop,
  deleteOrderStop,
};
