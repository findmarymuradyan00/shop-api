import {
  JsonController,
  Get,
  Delete,
  Param,
  Body,
  NotFoundError,
  Patch,
  UseBefore,
  Req,
  ForbiddenError,
  Post,
} from "routing-controllers";
import { Types } from "mongoose";
import { OrderModel } from "../models/Order";
import { CreateOrderDto } from "../dtos/CreateOrderDto";
import { AuthMiddleware, type JwtPayload } from "../middlewares/auth";

@JsonController("/orders")
export class OrderController {
  @Get("/")
  async getAll() {
    return OrderModel.find();
  }

  @Post("/")
  @UseBefore(AuthMiddleware)
  async create(@Body() orderData: CreateOrderDto, @Req() req: any) {
    const auth = req.user as JwtPayload;
    const order = await OrderModel.create({
      ...orderData,
      userId: new Types.ObjectId(auth.userId),
    });
    return order;
  }

  @Get("/:id")
  async getOne(@Param("id") _id: string) {
    const order = await OrderModel.findById(_id);

    if (!order) {
      throw new NotFoundError("no order found");
    }

    return order;
  }

  @Delete("/:id")
  @UseBefore(AuthMiddleware)
  async deleteOne(@Param("id") _id: string, @Req() req: any) {
    const order = await OrderModel.findById(_id);

    if (!order) {
      throw new NotFoundError("No order found");
    }

    const auth = req.user as JwtPayload;
    if (order.userId.toString() !== auth.userId) {
      throw new ForbiddenError("unauthorized access");
    }

    const deletedOrder = await OrderModel.findByIdAndDelete(_id);
    return deletedOrder;
  }

  @Patch("/:id")
  @UseBefore(AuthMiddleware)
  async updateOne(
    @Param("id") _id: string,
    @Body() userData: Partial<CreateOrderDto>,
    @Req() req: any
  ) {
    const order = await OrderModel.findById(_id);

    if (!order) {
      throw new NotFoundError("no order found");
    }

    const auth = req.user as JwtPayload;
    if (order.userId.toString() !== auth.userId) {
      throw new ForbiddenError("unauthorized access");
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(_id, userData, {
      new: true,
    });

    if (!updatedOrder) {
      throw new NotFoundError("No order found");
    }

    return updatedOrder;
  }
}
