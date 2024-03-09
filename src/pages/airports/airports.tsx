import { View, ScrollView } from "@tarojs/components";
import { useCallback, useEffect, useState } from "react";
import { Airport, getAirports as getAirportsApi } from "@/api";
import { ERR_MESSAGE } from "@/common/constants";
import { hideLoading, showLoading } from "@/common/utils/loading";
import { showToast } from "@/common/utils/toast";
import { getStorageSyncWithTime, setStorageSyncWithTime } from "@/common/utils/storage";
import { isAliPay } from "@/common/utils/env";
import { AirportsGroup } from "./components/AirportsGroup";

import "./airports.scss";

export default function Airports() {
  const [airports, setAirports] = useState<{
    [key: string]: Airport[];
  }>({});
  const [letterList, setLetterList] = useState<string[]>([]);
  const [currentLetter, setCurrentLetter] = useState<string>("");

  const formatAirports = useCallback((list: Airport[]) => {
    const result: { [key: string]: Airport[] } = {};
    list.forEach(airport => {
      const { firstLetter } = airport;
      if (result[firstLetter]) {
        result[firstLetter].push(airport);
      } else {
        result[firstLetter] = [airport];
      }
    });
    return result;
  }, []);

  const getAirports = useCallback(() => {
    showLoading();
    const storageAirports = getStorageSyncWithTime<{
      [key: string]: Airport[];
    }>("airports");
    if (storageAirports) {
      const letters = Object.keys(storageAirports).sort();
      setAirports(storageAirports);
      setLetterList(letters);
      hideLoading();
      return;
    }
    getAirportsApi()
      .then(res => {
        const formattedAirports = formatAirports(res);
        const letters = Object.keys(formattedAirports).sort();
        setStorageSyncWithTime("airports", formattedAirports);
        setAirports(formattedAirports);
        setLetterList(letters);
      })
      .catch(err => {
        const { message } = err;
        if (message) {
          showToast(message);
        } else {
          showToast(ERR_MESSAGE);
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [formatAirports]);

  const onLetterClick = useCallback((letter: string) => {
    setCurrentLetter(letter);
  }, []);

  useEffect(() => {
    getAirports();
  }, [getAirports]);

  return (
    <View className="airport-list-container">
      <ScrollView
        scrollY
        scrollWithAnimation={isAliPay ? false : true}
        style={{ height: "100vh" }}
        scrollIntoView={currentLetter}
      >
        {letterList?.map(item => {
          const list = airports[item];
          return <AirportsGroup key={item} label={item} list={list} />;
        })}
      </ScrollView>
      <View className="letter-container">
        {letterList?.map(item => {
          return (
            <View key={item} className="letter-item" onClick={() => onLetterClick(item)}>
              {item}
            </View>
          );
        })}
      </View>
    </View>
  );
}
