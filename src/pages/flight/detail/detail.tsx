import { Flight, orderFlight } from "@/api";
import { isWeChat } from "@/common/utils/env";
import { View, Image, Text, Button, Input } from "@tarojs/components";
import { getCurrentInstance, useShareAppMessage, switchTab } from "@tarojs/taro";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useCheckLogin } from "@/common/hooks/useCheckLogin";
import { doLogin } from "@/common/utils/login";
import { hideLoading, showLoading } from "@/common/utils/loading";
import { showToast } from "@/common/utils/toast";
import { ERR_MESSAGE } from "@/common/constants";
import "./detail.scss";

export default function Detail({ tid }: { tid: string }) {
  const [flightData, setFlightData] = useState<Flight>(() => {
    const now = dayjs();
    return {
      id: 0,
      price: 999,
      departTime: now.format("HH:mm"),
      arriveTime: now.add(2, "hour").format("HH:mm"),
      departCity: "北京",
      arriveCity: "上海",
      departAirport: "大兴机场",
      arriveAirport: "虹桥机场",
      airCompanyName: "东方航空",
      airIcon: "",
      departDate: now.format("YYYY-MM-DD"),
    };
  });
  const isLogin = useUserStore(state => !!state.phone);
  const loginName = useUserStore(state => state.name);
  const loginPhone = useUserStore(state => state.phone);

  useCheckLogin();

  useShareAppMessage(() => {
    return {
      title: "我的行程分你一半，快乐同样分你一半～",
      path: tid,
      imageUrl:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180914%2Ff4b0c16e207e4fd0b686bf378a62989c.jpg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633356232&t=99c2f5e1ceb1b611976b1e28608aeee7",
    };
  });

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (!router) {
      return;
    }
    const params = router.params as unknown as Flight;
    const data = {
      id: Number(params.id),
      price: Number(params.price),
      departTime: params.departTime,
      departCity: params.departCity,
      arriveCity: params.arriveCity,
      arriveTime: params.arriveTime,
      departAirport: params.departAirport,
      arriveAirport: params.arriveAirport,
      airCompanyName: params.airCompanyName,
      airIcon: params.airIcon,
      departDate: params.departDate,
    };

    console.log(data);

    setFlightData({
      ...data,
    } as unknown as Flight);
  }, []);

  const onOrder = useCallback(async () => {
    doLogin(() => {
      showLoading();
      orderFlight({
        phone: loginPhone,
        orderInfo: flightData,
      })
        .then(() => {
          showToast({
            title: "预定成功...",
            icon: "loading",
            duration: 2000,
          }).then(() => {
            switchTab({
              url: "/pages/order/order",
            });
          });
        })
        .catch(err => {
          showToast(err?.data?.message || ERR_MESSAGE);
        })
        .finally(() => {
          hideLoading();
        });
    });
  }, [flightData, loginPhone]);

  const {
    airCompanyName,
    airIcon,
    departTime,
    arriveTime,
    departAirport,
    arriveAirport,
    price,
    departDate,
  } = flightData;

  return (
    <View className="detail-container">
      <View className="flight-segment">
        <View className="info-head">
          <View className="tag">直飞</View>
          <View className="company-info">
            <Image src={airIcon} className="logo"></Image>
            {`${airCompanyName} ${dayjs(departDate).format("M月D日")}`}
          </View>
        </View>
        <View className="info-detail">
          <View className="from">
            <View className="time">{departTime}</View>
            <View className="station">{departAirport}</View>
          </View>
          <Image
            className="mid"
            src="https://pic.c-ctrip.com/train/zt/flight/bookx/icon-fromto.png"
          ></Image>
          <View className="to">
            <View className="time">{arriveTime}</View>
            <View className="station">{arriveAirport}</View>
          </View>
        </View>
      </View>
      <View className="passenger-box module-box">
        <Text className="title">乘机人</Text>
        {isLogin ? (
          <View className="name">{loginName}</View>
        ) : (
          <Button className="add-btn name" onClick={() => doLogin}>
            新增
          </Button>
        )}
      </View>
      <View className="passenger-box module-box">
        <Text className="title">联系手机</Text>
        <View className="phone-box">
          <Text className="num-pre">+86 </Text>
          <Input disabled placeholder="请输入乘机人手机号" value={loginPhone}></Input>
        </View>
      </View>

      <View className="price-item">
        <View className="color-red">
          ¥ <Text className="price color-red">{price}</Text>
        </View>
        <View className="order-btn" onClick={onOrder}>
          订
        </View>
      </View>
      {isWeChat && (
        <Button className="share-btn" openType="share">
          快将行程分享给好友吧
        </Button>
      )}
      {/*  机票底部  */}
      <View className="flight-info"></View>
    </View>
  );
}
