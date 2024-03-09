import { useCallback, useState } from "react";
import { navigateBack } from "@tarojs/taro";
import { View, Input, Button, CommonEventFunction, InputProps } from "@tarojs/components";
import { debounce } from "@/common/utils/debounce";
import { showToast } from "@/common/utils/toast";
import { hideLoading, showLoading } from "@/common/utils/loading";
import { login } from "@/api";
import { useUserStore } from "@/store/user";
import { setStorageSyncWithTime } from "@/common/utils/storage";

import "./login.scss";

export default function Login() {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phone: string;
    password: string;
  }>({
    name: "",
    phone: "",
    password: "",
  });

  const setStoreUserInfo = useUserStore(state => state.setUserInfo);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onNameInput = useCallback(
    debounce<CommonEventFunction<InputProps.inputEventDetail>>(e => {
      setUserInfo(prev => ({ ...prev, name: e.detail.value }));
    }, 300),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPhoneInput = useCallback(
    debounce<CommonEventFunction<InputProps.inputEventDetail>>(e => {
      setUserInfo(prev => ({ ...prev, phone: e.detail.value }));
    }, 300),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPasswordInput = useCallback(
    debounce<CommonEventFunction<InputProps.inputEventDetail>>(e => {
      setUserInfo(prev => ({ ...prev, password: e.detail.value }));
    }, 300),
    [],
  );

  const onLogin = useCallback(async () => {
    const { name, phone, password } = userInfo;
    if (!name || !phone || !password) {
      showToast("所有信息必须填写完毕~");
      return;
    }
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(phone)) {
      return showToast("请填写正确手机号~");
    }
    showLoading();
    try {
      const user = await login({ name, phone, password });
      setStorageSyncWithTime("userInfo", user);
      setStoreUserInfo(user);
      navigateBack();
    } catch (e) {
      const { message } = e.data || {};
      if (message) {
        showToast(message);
      } else {
        showToast("登录失败，请稍后重试~");
      }
    } finally {
      hideLoading();
    }
  }, [setStoreUserInfo, userInfo]);

  return (
    <View className="login-container">
      <View className="login-top">
        <View>你好，</View>
        <View>欢迎登录</View>
      </View>
      <View className="login-box">
        <Input
          type="text"
          className="nick-name input"
          placeholder="请输入昵称"
          placeholderClass="placeholder-class"
          onInput={onNameInput}
        ></Input>
        <Input
          type="text"
          className="phone input"
          placeholder="请输入手机号"
          placeholderClass="placeholder-class"
          onInput={onPhoneInput}
        ></Input>
        <Input
          type="safe-password"
          className="password input"
          placeholder="请输入密码"
          placeholderClass="placeholder-class"
          onInput={onPasswordInput}
        ></Input>
      </View>
      <Button className="login-btn" onClick={onLogin}>
        登录
      </Button>
    </View>
  );
}
