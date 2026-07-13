import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { connectDB } from "./config/db";
import { useExpressServer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { OrderController } from "./controllers/OrderController";
import { AuthController } from "./controllers/AuthController";

const app = express();

connectDB();

useExpressServer(app, {
  controllers: [UserController, OrderController, AuthController],
  validation: true,
  routePrefix: "/api",
});

app.get("/", (req, res) => {
  return res.send("API working successfully!");
});

export { app };
