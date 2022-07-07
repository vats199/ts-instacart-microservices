import express from "express";

import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import * as dotenv from "dotenv";

const app = express();

import * as shopRoutes from "./routes/shopRoutes";

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept"
  );
  next();
});
app.set("view engine", "ejs");
app.set("views", "views");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", shopRoutes.default);

app.listen(7002, (_port: void) => {
  console.log("Server running on port : " + 7002);
});
