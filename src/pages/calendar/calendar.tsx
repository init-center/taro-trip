import { useCallback } from "react";
import { AtCalendar } from "taro-ui";
import { navigateBack } from "@tarojs/taro";
import { View } from "@tarojs/components";
import dayjs from "dayjs";
import { MAX_DATE, MIN_DATE } from "@/common/constants";
import { useFlightStore } from "@/store/flight";
import "./calendar.scss";

type DateArg = string | number | Date;
interface SelectDate {
  end?: DateArg;
  start: DateArg;
}

export default function Calendar() {
  const departDate = useFlightStore(state => state.departDate);
  const setDepartDate = useFlightStore(state => state.setDepartDate);

  const onDateSelect = useCallback(
    (date: { value: SelectDate }) => {
      const dateStr = dayjs(date.value.start).format("YYYY-MM-DD");
      setDepartDate(dateStr);
      navigateBack();
    },
    [setDepartDate],
  );

  return (
    <View className="calendar-page">
      <AtCalendar
        currentDate={departDate}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        onSelectDate={onDateSelect}
      />
    </View>
  );
}
