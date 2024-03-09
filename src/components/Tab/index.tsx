import { View, Swiper, type SwiperProps, type CommonEventFunction } from "@tarojs/components";
import { useCallback, useMemo, useState } from "react";
import "./index.scss";

interface TabProps {
  tabList: Array<{
    id: number;
    label: string;
  }>;
  children: React.ReactNode;
  onChange?: (e: any) => void;
  className?: string;
  initTab?: number;
}

export default function Tab({ tabList, children, onChange, className, initTab = 0 }: TabProps) {
  const [currentId, setCurrentId] = useState(initTab ?? tabList?.[0]["id"]);
  const sliderStyles = useMemo(
    () => ({
      width: `${100 / tabList?.length}%`,
      transform: `translateX(${currentId * 100}%)`,
    }),
    [currentId, tabList],
  );

  const handleTabClick = useCallback((id: number) => {
    setCurrentId(id);
  }, []);

  const handleSwitchChange = useCallback<CommonEventFunction<SwiperProps.onChangeEventDetail>>(
    e => {
      setCurrentId(e.detail.current);
      onChange?.(e);
    },
    [onChange],
  );

  return (
    <View className={`tab-container ${className}`}>
      <View className="tab-bar">
        {tabList?.map(item => {
          return (
            <View
              className={`tab-item ${currentId === item["id"] ? "active" : ""}`}
              key={item["id"]}
              onClick={() => handleTabClick(item["id"])}
            >
              {item.label}
            </View>
          );
        })}
        <View className="tab-slider" style={sliderStyles}></View>
      </View>
      <Swiper current={currentId} className="tab-content" onChange={handleSwitchChange}>
        {children}
      </Swiper>
    </View>
  );
}
