export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/order/order",
    "pages/airports/airports",
    "pages/calendar/calendar",
    "pages/login/login",
  ],
  subPackages: [
    {
      root: "pages/flight",
      pages: ["list/list", "detail/detail"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "远方",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#7F8389",
    selectedColor: "#5495e6",
    borderStyle: "black",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/images/tab-bar/index-unselected.png",
        selectedIconPath: "assets/images/tab-bar/index-selected.png",
      },
      {
        pagePath: "pages/order/order",
        text: "订单",
        iconPath: "assets/images/tab-bar/order-unselected.png",
        selectedIconPath: "assets/images/tab-bar/order-selected.png",
      },
    ],
  },
  permission: {
    "scope.userLocation": {
      desc: "为了更好的服务体验，我们希望获取您的地理位置信息",
    },
  },
  requiredPrivateInfos: ["getLocation"],
});
