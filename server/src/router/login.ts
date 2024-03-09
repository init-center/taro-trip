import db from "@/db";
import { users } from "@/db/schemas/users";
import { hashPassword, SECRET_KEY, verifyPassword } from "@/utils/crypto";
import { fail, success } from "@/utils/response";
import { Router } from "express";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const { phone, password, name } = req.body;
  try {
    const existUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.phone, phone),
    });
    if (existUser) {
      // login
      const pass = await verifyPassword(existUser.password, SECRET_KEY, password);
      if (!pass) {
        fail(res, "密码错误");
        return;
      }

      if (existUser.name !== name) {
        await db.update(users).set({ name });
      }
      success(res, {
        id: existUser.id,
        name: name,
        phone: existUser.phone,
      });
    } else {
      // register
      const hashedPassword = await hashPassword(password, SECRET_KEY);
      console.log(hashedPassword.length);
      await db.insert(users).values({
        phone,
        password: hashedPassword,
        name,
      });
      success(res, {
        name,
        phone,
      });
    }
  } catch (e) {
    fail(res, e.message);
  }
});

export default loginRouter;
