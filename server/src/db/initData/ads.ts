import db from "..";
import { ads } from "../schemas";

const AD_LIST = [
  {
    imgUrl: "https://dimg04.c-ctrip.com/images/0AM6k12000eiet3soD2FA.webp",
    linkUrl:
      "https://m.ctrip.com/tangram/OTUwNDc=?ctm_ref=vactang_page_95047&isHideNavBar=YES&apppgid=10650099192&statusBarStyle=1",
  },
  {
    imgUrl: "https://dimg04.c-ctrip.com/images/0zg3x12000awurd1r46DF.webp",
    linkUrl: "https://m.ctrip.com/tangram/MzE2MzI=?ctm_ref=vactang_page_31632&isHideNavBar=YES",
  },
];

await db.insert(ads).values(AD_LIST);
console.log("Insert ads success");
process.exit(0);
