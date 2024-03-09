import { useCallback } from "react";
import { Airport } from "@/api";
import { View, Text } from "@tarojs/components";
import { navigateBack } from "@tarojs/taro";
import { useFlightStore } from "@/store/flight";
import "./AirportsGroup.scss";

export interface AirportsGroupProps {
  list: Airport[];
  label: string;
}

export const AirportsGroup = ({ list, label }: AirportsGroupProps) => {
  const cityType = useFlightStore(state => state.cityType);
  const setDepartCity = useFlightStore(state => state.setDepartCity);
  const setArriveCity = useFlightStore(state => state.setArriveCity);
  const handleAirportClick = useCallback(
    (airport: Airport) => {
      const { cityId, cityName, airportName } = airport;
      if (cityType === "depart") {
        setDepartCity({ id: cityId, name: cityName, airportName });
      } else {
        setArriveCity({ id: cityId, name: cityName, airportName });
      }
      navigateBack();
    },
    [cityType, setArriveCity, setDepartCity],
  );
  return (
    <View className="list-item" id={label}>
      <Text className="label">{label}</Text>
      {list?.map(item => {
        return (
          <View
            key={item.id}
            className="name"
            onClick={() => handleAirportClick(item)}
          >{`${item.cityName}（${item.airportName}）`}</View>
        );
      })}
    </View>
  );
};
