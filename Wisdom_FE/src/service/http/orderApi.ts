import axios from "../api/api";
import { OrderRequest } from "../../types/order.type";

export const getOrders = async () => {
  const res = await axios.get("/orders");
  return res.data;
};

export const createOrder = async (order: OrderRequest) => {
  const res = await axios.post("/orders", order);
  return res.data;
};