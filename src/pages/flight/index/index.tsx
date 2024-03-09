import { View, Text, SwiperItem, Swiper, Image, Button } from "@tarojs/components";
import { getLocation, request, navigateTo } from "@tarojs/taro";
import { showToast } from "@/common/utils/toast";
import { useCallback, useEffect, useState } from "react";
import { type AD, getAds, getAirportsByCityName } from "@/api";
import { MAP_KEY, MAP_SECRET_KEY } from "@/common/constants";
import { MD5 } from "crypto-js";
import { useFlightStore } from "@/store/flight";
import dayjs from "dayjs";
import Tab from "@/components/Tab";
import "./index.scss";

const FLIGHT_TABS = [
  {
    label: "单程",
    id: 0,
  },
  {
    label: "往返",
    id: 1,
  },
];

export default function FlightIndex() {
  const setDepartCity = useFlightStore(state => state.setDepartCity);
  const setArriveCity = useFlightStore(state => state.setArriveCity);
  const departCity = useFlightStore(state => state.departCity);
  const arriveCity = useFlightStore(state => state.arriveCity);
  const departDate = useFlightStore(state => state.departDate);
  const setCityType = useFlightStore(state => state.setCityType);
  const [adList, setAdList] = useState<AD[]>([]);

  const [exchanging, setExchanging] = useState(false);

  const handleExchange = useCallback(() => {
    if (exchanging) return;
    setExchanging(true);
    const tempDepartCity = {
      ...departCity,
    };
    setDepartCity({
      ...arriveCity,
    });
    setArriveCity(tempDepartCity);
    setTimeout(() => {
      setExchanging(false);
    }, 500);
  }, [arriveCity, departCity, exchanging, setArriveCity, setDepartCity]);

  const getCity = useCallback(
    async ({ latitude, longitude }) => {
      const host = "https://apis.map.qq.com";
      const factors = `/ws/geocoder/v1/?key=${MAP_KEY}&location=${latitude},${longitude}`;
      const sig = MD5(`${factors}${MAP_SECRET_KEY}`).toString();
      const url = `${host}${factors}&sig=${sig}`;
      try {
        const res = await request({
          url,
        });
        const { data } = res;
        const cityInfo = data?.result?.ad_info || {};
        let cityName = cityInfo.city || "北京";
        if (cityName.length > 2 && cityName.endsWith("市")) {
          cityName = cityName.slice(0, -1);
        }

        const airports = await getAirportsByCityName(cityName);
        if (airports.length === 0) {
          return;
        }

        const airport = airports[0].airportName;
        const cityId = airports[0].cityId;

        setDepartCity({
          name: cityName,
          airportName: airport,
          id: cityId,
        });
      } catch (e) {
        showToast("获取城市信息失败~");
      }
    },
    [setDepartCity],
  );

  const getLocationInfo = useCallback(() => {
    getLocation({
      type: "gcj02",
    })
      .then(res => {
        const { latitude, longitude } = res;
        getCity({ latitude, longitude });
      })
      .catch(() => {
        showToast("获取位置信息失败~");
      });
  }, [getCity]);

  const fetchAds = useCallback(async () => {
    const ads = await getAds();
    setAdList(ads);
  }, []);

  const chooseCity = useCallback(
    (type: "depart" | "arrive") => {
      if (exchanging) return;
      setCityType(type);
      navigateTo({
        url: "/pages/airports/airports",
      });
    },
    [exchanging, setCityType],
  );

  const chooseDate = useCallback(() => {
    navigateTo({
      url: "/pages/calendar/calendar",
    });
  }, []);

  const searchFlight = useCallback(() => {
    navigateTo({
      url: "/pages/flight/list/list",
    });
  }, []);

  useEffect(() => {
    fetchAds();
    getLocationInfo();
  }, [fetchAds, getLocationInfo]);

  return (
    <View className="flight-container">
      <View className="flight-top">
        <Tab tabList={FLIGHT_TABS} className="flight-index-tab">
          <SwiperItem>
            <View className="item station">
              <View
                className={`cell from ${exchanging ? "slide" : ""}`}
                onClick={() => chooseCity("depart")}
              >
                {departCity.name}
              </View>
              <Text
                className={`icon-zhihuan iconfont ${exchanging ? "active" : ""}`}
                onClick={handleExchange}
              ></Text>
              <View
                className={`cell to ${exchanging ? "slide" : ""}`}
                onClick={() => chooseCity("arrive")}
              >
                {arriveCity.name}
              </View>
            </View>
            <View className="item date" onClick={chooseDate}>
              {dayjs(departDate).format("M月D日")}
            </View>
            <Button className="search-btn" onClick={searchFlight}>
              机票查询
            </Button>
          </SwiperItem>
          <SwiperItem>往返</SwiperItem>
          <SwiperItem>多程</SwiperItem>
        </Tab>
      </View>
      <View className="advs-banner-swiper">
        <Swiper className="advs-banner-bd" interval={3000} autoplay circular>
          {adList?.map(item => {
            return (
              <SwiperItem key={item.imgUrl} className="item">
                <Image className="img" src={item.imgUrl}></Image>
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
      <View className="flight-footer"></View>
    </View>
  );
}
