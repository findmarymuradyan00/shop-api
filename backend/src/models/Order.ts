import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { User } from "./User";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ required: true })
  title!: string;

  @prop()
  description?: string;

  @prop({ required: true, min: 0 })
  price!: number;

  @prop({ required: true })
  quantity!: number;
}

export const OrderModel = getModelForClass(Order);
