import db from "@/db";
import { flightOrders } from "@/db/schemas/flight_orders";
import { fail, success } from "@/utils/response";
import { desc } from "drizzle-orm";
import { Router } from "express";

const ordersRouter = Router();

ordersRouter.post("/flights", async (req, res) => {
  const {
    phone,
    departCity,
    arriveCity,
    departTime,
    arriveTime,
    departDate,
    departAirport,
    arriveAirport,
    airCompanyName,
    price,
  } = req.body;

  const newOrder = {
    phone,
    departCity,
    arriveCity,
    departTime,
    arriveTime,
    departDate,
    departAirport,
    arriveAirport,
    airCompany: airCompanyName,
    price,
  };
  try {
    await db.insert(flightOrders).values({
      ...newOrder,
    });

    success(res, newOrder, "预定成功~");
  } catch (e) {
    fail(res, e.message);
  }
});

ordersRouter.get("/flights", async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    fail(res, "缺少参数");
    return;
  }
  try {
    const orders = await db.query.flightOrders.findMany({
      where: (order, { eq }) => eq(order.phone, phone as string),
      orderBy: desc(flightOrders.id),
    });
    success(res, orders);
  } catch (e) {
    fail(res, e.message);
  }
});

export default ordersRouter;
