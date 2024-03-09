import {
  Block,
  ScrollView,
  View,
  Image,
  Text,
  Picker,
  type PickerSelectorProps,
  type CommonEventFunction,
} from "@tarojs/components";
import { setNavigationBarTitle } from "@tarojs/taro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFlightStore } from "@/store/flight";
import dayjs from "dayjs";
import Skeleton from "taro-skeleton";
import { ERR_MESSAGE, MAX_DATE, MIN_DATE } from "@/common/constants";
import { weekDayStr } from "@/common/utils/day";
import { hideLoading, showLoading } from "@/common/utils/loading";
import { Flight, getSingleFlights } from "@/api";
import { showToast } from "@/common/utils/toast";
import { navigateTo } from "@/common/utils/router";
import { VirtualList } from "@/components/VirtualList/VirtualList";
import "taro-skeleton/dist/index.css";
import "./list.scss";

export default function FlightList() {
  const departCity = useFlightStore(state => state.departCity);
  const arriveCity = useFlightStore(state => state.arriveCity);
  const departDate = useFlightStore(state => state.departDate);
  const setDepartDate = useFlightStore(state => state.setDepartDate);
  const setSelectFlight = useFlightStore(state => state.setSelectFlight);
  const dateList = useMemo(() => formatDateList(), []);
  const [flights, setFlights] = useState<Flight[]>([]);
  const allFlights = useRef<Flight[]>([]);
  const [flightCompanyList, setFlightCompanyList] = useState<string[]>([]);
  const [selectCompanyIndex, setSelectCompanyIndex] = useState<number>(0);
  const chooseDate = useCallback(
    (date: string) => {
      setDepartDate(date);
    },
    [setDepartDate],
  );

  const getList = useCallback(() => {
    showLoading();
    getSingleFlights({
      departDate,
      departAirport: departCity.airportName,
      arriveAirport: arriveCity.airportName,
      departCity: departCity.name,
      arriveCity: arriveCity.name,
    })
      .then(res => {
        const companyList = Array.from(new Set(res.map(item => item.airCompanyName)));
        companyList.unshift("全部");
        setFlightCompanyList([...companyList]);
        allFlights.current = [...res];
        if (selectCompanyIndex === 0 && companyList[0] === "全部") {
          setFlights([...res]);
        } else {
          setFlights(res.filter(item => item.airCompanyName === companyList[selectCompanyIndex]));
        }
      })
      .catch(err => {
        showToast(err.message || ERR_MESSAGE);
      })
      .finally(() => {
        hideLoading();
      });
  }, [
    arriveCity.airportName,
    arriveCity.name,
    departCity.airportName,
    departCity.name,
    departDate,
    selectCompanyIndex,
  ]);

  const onCompanyChange = useCallback<CommonEventFunction<PickerSelectorProps.ChangeEventDetail>>(
    e => {
      const { value } = e.detail;
      const idx = typeof value === "number" ? value : Number(value) || 0;
      setSelectCompanyIndex(idx);
    },
    [],
  );

  const onFlightClick = useCallback(
    (curFlight: Flight) => {
      setSelectFlight(curFlight);
      navigateTo("/pages/flight/detail/detail", { ...curFlight, departDate });
    },
    [departDate, setSelectFlight],
  );

  const FlightItem = useMemo(
    () =>
      ({ item, index }: { item: Flight; index: number }) => {
        const flight = item;
        const {
          departAirport,
          arriveAirport,
          departTime,
          arriveTime,
          airIcon,
          airCompanyName,
          price,
        } = flight;
        return (
          <Block key={flight.id}>
            {index === 3 && (
              <View className="notice">
                <Image
                  className="notice-logo"
                  src="https://images3.c-ctrip.com/ztrip/xiaochengxu/shangzhang_zx.png"
                ></Image>
                <Text className="notice-text">价格可能会上涨，建议尽快预定</Text>
              </View>
            )}
            <View className="list-item" onClick={() => onFlightClick(flight)}>
              <View className="item-price">
                <View className="flight-row">
                  <View className="depart">
                    <Text className="flight-time">{departTime}</Text>
                    <Text className="airport-name">{departAirport}</Text>
                  </View>
                  <View className="separator">
                    <View className="spt-arr"></View>
                  </View>
                  <View className="arrival">
                    <Text className="flight-time">{arriveTime}</Text>
                    <Text className="airport-name">{arriveAirport}</Text>
                  </View>
                </View>
                <Text className="flight-price">¥ {price}</Text>
              </View>
              <View className="air-info">
                <Image className="logo" src={airIcon} />
                <Text className="company-name">{airCompanyName}</Text>
              </View>
            </View>
          </Block>
        );
      },
    [onFlightClick],
  );

  useEffect(() => {
    setNavigationBarTitle({
      title: `${departCity.name} - ${arriveCity.name}`,
    });
  }, [arriveCity.name, departCity.name]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <View className="list-container">
      <View className="calendar-list">
        <ScrollView
          className="calendar-scroll-list"
          scrollX
          scrollWithAnimation
          scrollIntoView={`date-${departDate}`}
        >
          {dateList.map(date => {
            return (
              <View
                key={date.dateStr}
                className={`item ${date.dateStr === departDate ? "cur bgcolor-primary" : ""}`}
                id={`date-${date.dateStr}`}
                onClick={() => chooseDate(date.dateStr)}
              >
                <View className="date">{date.day}</View>
                <View className="week">{date.week}</View>
              </View>
            );
          })}
        </ScrollView>
        {flights.length > 0 ? (
          <View id="flight-list">
            <VirtualList className="flight-scroll-list" list={flights}>
              {FlightItem}
            </VirtualList>
            {/* <ScrollView className="flight-scroll-list" scrollY>
              {flights?.map((flight, index) => {
                const {
                  departAirport,
                  arriveAirport,
                  departTime,
                  arriveTime,
                  airIcon,
                  airCompanyName,
                  price,
                } = flight;
                return (
                  <Block key={flight.id}>
                    {index === 3 && (
                      <View className="notice">
                        <Image
                          className="notice-logo"
                          src="https://images3.c-ctrip.com/ztrip/xiaochengxu/shangzhang_zx.png"
                        ></Image>
                        <Text className="notice-text">价格可能会上涨，建议尽快预定</Text>
                      </View>
                    )}
                    <View className="list-item" onClick={() => onFlightClick(flight)}>
                      <View className="item-price">
                        <View className="flight-row">
                          <View className="depart">
                            <Text className="flight-time">{departTime}</Text>
                            <Text className="airport-name">{departAirport}</Text>
                          </View>
                          <View className="separator">
                            <View className="spt-arr"></View>
                          </View>
                          <View className="arrival">
                            <Text className="flight-time">{arriveTime}</Text>
                            <Text className="airport-name">{arriveAirport}</Text>
                          </View>
                        </View>
                        <Text className="flight-price">¥ {price}</Text>
                      </View>
                      <View className="air-info">
                        <Image className="logo" src={airIcon} />
                        <Text className="company-name">{airCompanyName}</Text>
                      </View>
                    </View>
                  </Block>
                );
              })}
            </ScrollView> */}
          </View>
        ) : (
          <View>
            {Array(8)
              .fill(0)
              .map((_, index) => {
                return <Skeleton key={index} row={3} action rowHeight={34} />;
              })}
          </View>
        )}
      </View>
      <View className={`filter-btn ${flights?.length ? "" : "hidden"}`}>
        <Picker range={flightCompanyList} value={selectCompanyIndex} onChange={onCompanyChange}>
          筛选
        </Picker>
      </View>
    </View>
  );
}

function formatDateList() {
  let minStr = dayjs(MIN_DATE).valueOf();
  const maxStr = dayjs(MAX_DATE).valueOf();
  const dayStr = 1000 * 60 * 60 * 24; // 一天
  let res: { dateStr: string; day: string; week: string }[] = [];
  for (; minStr <= maxStr; minStr += dayStr) {
    res.push({
      dateStr: dayjs(minStr).format("YYYY-MM-DD"),
      day: dayjs(minStr).format("M-DD"),
      week: weekDayStr(minStr),
    });
  }
  return res;
}
