import { isH5 } from "@/common/utils/env";
import { request } from "@/common/utils/request";

const HOST = isH5 ? "/api" : "http://localhost:3456";

export type AD = {
  id: number;
  imgUrl: string;
  linkUrl: string;
};

export type Airport = {
  id: number;
  cityName: string;
  cityId: number;
  firstLetter: string;
  airportName: string;
};

export type Flight = {
  id: number;
  price: number;
  departTime: string;
  arriveTime: string;
  departAirport: string;
  arriveAirport: string;
  airCompanyName: string;
  airIcon: string;
  departDate: string;
  departCity: string;
  arriveCity: string;
};

export type FlightOrder = {
  id: number;
  phone: string;
  departCity: string;
  arriveCity: string;
  departTime: string;
  arriveTime: string;
  departDate: string;
  departAirport: string;
  arriveAirport: string;
  airCompany: string;
  price: number;
};

export const getAds = () => {
  return request<AD[]>({
    url: `${HOST}/ads`,
    method: "GET",
  });
};

export const getAirports = () => {
  return request<Airport[]>({
    url: `${HOST}/airports`,
    method: "GET",
  });
};

export const getAirportsByCityName = (cityName: string) => {
  return request<Airport[]>({
    url: `${HOST}/cities/${cityName}/airports`,
    method: "GET",
  });
};

export const getSingleFlights = (params: {
  departDate: string;
  departAirport: string;
  arriveAirport: string;
  departCity: string;
  arriveCity: string;
}) => {
  return request<Flight[]>({
    url: `${HOST}/flights/single`,
    method: "GET",
    data: {
      ...params,
    },
  });
};

export const login = (params: { phone: string; password: string; name: string }) => {
  return request<{
    name: string;
    phone: string;
  }>({
    url: `${HOST}/login`,
    method: "POST",
    data: {
      ...params,
    },
  });
};

export const orderFlight = (params: { phone: string; orderInfo: Flight }) => {
  return request({
    url: `${HOST}/orders/flights`,
    method: "POST",
    data: {
      phone: params.phone,
      ...params.orderInfo,
    },
  });
};

export const getFlightOrders = (phone: string) => {
  return request<FlightOrder[]>({
    url: `${HOST}/orders/flights`,
    method: "GET",
    data: {
      phone,
    },
  });
};
