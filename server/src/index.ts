import express from "express";
import { router } from "./router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});
router(app);

const port = process.env.PORT || 3456;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
