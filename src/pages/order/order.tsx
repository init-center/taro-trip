import { View, Text, SwiperItem, Button, ScrollView } from "@tarojs/components";
import { useCheckLogin } from "@/common/hooks/useCheckLogin";
import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "@/store/user";
import { type FlightOrder, getFlightOrders as getFlightOrdersApi } from "@/api";
import { hideLoading, showLoading } from "@/common/utils/loading";
import { showToast } from "@/common/utils/toast";
import { ERR_MESSAGE } from "@/common/constants";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";
import { removeStorageSync, useDidShow } from "@tarojs/taro";
import dayjs from "dayjs";
import { navigateTo } from "@/common/utils/router";
import "./order.scss";

const TAB_LIST = [
  {
    label: "机票",
    id: 0,
  },
  {
    label: "火车票",
    id: 1,
  },
  {
    label: "酒店",
    id: 2,
  },
  {
    label: "汽车票",
    id: 3,
  },
];

export default function Order() {
  const [flightOrders, setFlightOrders] = useState<FlightOrder[]>([]);
  const [isFlightsRefreshing, setIsFlightsRefreshing] = useState<boolean>(false);
  const user = useUserStore(state => ({
    name: state.name,
    phone: state.phone,
  }));
  const setUserInfo = useUserStore(state => state.setUserInfo);

  useCheckLogin();

  useDidShow(() => {
    if (user.phone) {
      getFlightOrders();
    }
  });

  const getFlightOrders = useCallback(async () => {
    showLoading();
    try {
      const orders = await getFlightOrdersApi(user.phone);
      setFlightOrders(orders);
    } catch (error) {
      showToast(error.message || ERR_MESSAGE);
    } finally {
      hideLoading();
      setIsFlightsRefreshing(false);
    }
  }, [user.phone]);

  const onPullDownRefresh = useCallback(() => {
    setIsFlightsRefreshing(true);
    getFlightOrders();
  }, [getFlightOrders]);

  const onLoginOut = useCallback(() => {
    try {
      removeStorageSync("userInfo");
      showToast({
        title: "操作成功~",
        icon: "success",
        duration: 1000,
      });
      setUserInfo({ name: "", phone: "" });
    } catch (error) {
      showToast("操作失败~");
    }
  }, [setUserInfo]);

  const toLogin = useCallback(() => {
    navigateTo("/pages/login/login");
  }, []);

  const FlightListItem = useMemo(() => {
    return flightOrders.length ? (
      <ScrollView
        scrollY
        style={{ height: "100%" }}
        className="order-list-box"
        refresherEnabled
        refresherTriggered={isFlightsRefreshing}
        onRefresherRefresh={onPullDownRefresh}
      >
        {flightOrders.map(item => {
          const { departCity, arriveCity, departDate, departTime, price } = item;
          return (
            <View key={item.id} className="item">
              <View className="left">
                <View className="line">
                  <Text className="city-name">{departCity}</Text> -
                  <Text className="city-name">{arriveCity}</Text>
                  <View className="time">{`${dayjs(departDate).format(
                    "YYYY-MM-DD",
                  )} ${departTime}`}</View>
                </View>
              </View>
              <View className="right">¥ {price}</View>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <NoExploit content="暂无数据" />
    );
  }, [flightOrders, isFlightsRefreshing, onPullDownRefresh]);

  return user.phone ? (
    <View className="home-container">
      <View className="user-box">
        <Text className="user-name">欢迎，{user.name || "--"}</Text>
        <Text className="login-out-btn" onClick={onLoginOut}>
          退出
        </Text>
      </View>
      <Tab tabList={TAB_LIST} className="tab">
        {TAB_LIST.map(tab => {
          return (
            <SwiperItem key={tab.id}>
              {tab.id === 0 ? FlightListItem : <NoExploit content="暂无数据" />}
            </SwiperItem>
          );
        })}
      </Tab>
    </View>
  ) : (
    <View className="no-login-container">
      <Text className="txt">登录查看订单</Text>
      <Button className="login-btn" onClick={toLogin}>
        立即登录
      </Button>
    </View>
  );
}
