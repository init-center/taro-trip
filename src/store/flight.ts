import { type Flight } from "@/api";
import dayjs from "dayjs";
import { create } from "zustand";

export interface City {
  name: string;
  airportName: string;
  id: number;
}

interface FlightStore {
  departCity: City;
  arriveCity: City;
  departDate: string;
  cityType: "depart" | "arrive";
  selectFlight: Flight | null;
  setDepartCity: (city: City) => void;
  setArriveCity: (city: City) => void;
  setDepartDate: (date: string) => void;
  setCityType: (type: "depart" | "arrive") => void;
  setSelectFlight: (flight: Flight | null) => void;
}

export const useFlightStore = create<FlightStore>(set => ({
  departCity: {
    name: "北京",
    airportName: "首都国际机场",
    id: 1,
  },
  departDate: dayjs().format("YYYY-MM-DD"),
  arriveCity: {
    name: "上海",
    airportName: "虹桥国际机场",
    id: 2,
  },
  cityType: "depart",
  selectFlight: null,
  setDepartCity: (city: City) => set({ departCity: city }),
  setArriveCity: (city: City) => set({ arriveCity: city }),
  setCityType: (type: "depart" | "arrive") => set({ cityType: type }),
  setDepartDate: (date: string) => set({ departDate: date }),
  setSelectFlight: (flight: Flight | null) => set({ selectFlight: flight }),
}));
