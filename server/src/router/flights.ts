import db from "@/db";
import { fail, success } from "@/utils/response";
import { Router } from "express";
import dayjs from "dayjs";

const flightsRouter = Router();

const randomPrice = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
};

flightsRouter.get("/single", async (req, res) => {
  const { departDate, departAirport, arriveAirport, departCity, arriveCity } = req.query;
  try {
    const result = await db.query.flights.findMany();
    const list = result.map(item => {
      return {
        ...item,
        departCity: departCity,
        arriveCity: arriveCity,
        departAirport: departAirport,
        arriveAirport: arriveAirport,
        price: randomPrice(300, 1000),
        departDate: departDate || dayjs().format("YYYY-MM-DD"),
      };
    });
    success(res, list);
  } catch (e) {
    fail(res, e.message);
  }
});

export default flightsRouter;
