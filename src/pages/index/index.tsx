import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { useCallback, useMemo, useState } from "react";
import FlightIndex from "@/pages/flight/index";
import NoExploit from "@/components/NoExploit";
import "./index.scss";

const DEFAULT_TAB_LIST = [
  {
    title: "机票",
    tab: "flight",
    index: 0,
  },
  {
    title: "火车票",
    tab: "train",
    index: 1,
  },
  {
    title: "酒店",
    tab: "hotel",
    index: 2,
  },
  {
    title: "汽车票",
    tab: "bus",
    index: 3,
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState(0);

  const sliderStyles = useMemo(() => {
    return {
      width: `${100 / DEFAULT_TAB_LIST.length}%`,
      transform: `translateX(${activeTab * 100}%)`,
    };
  }, [activeTab]);

  const switchTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index-container">
      <View className="index-top">
        <View className="index-tab">
          {DEFAULT_TAB_LIST.map(tab => (
            <View
              key={tab.tab}
              className={`index-tab-item ${tab.tab} ${tab.index === activeTab ? "active" : ""}`}
              onClick={() => switchTab(tab.index)}
            >
              {tab.title}
            </View>
          ))}
        </View>
        <View className="index-slider" style={sliderStyles}></View>
      </View>
      {activeTab === 0 ? <FlightIndex /> : <NoExploit className="index-no-exploit" />}
    </View>
  );
}
