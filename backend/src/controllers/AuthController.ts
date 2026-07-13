import {
  JsonController,
  Post,
  Body,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";
import jwt from "jsonwebtoken";

@JsonController("/auth")
export class AuthController {
  @Post("/register")
  async register(@Body() userData: CreateUserDto) {
    const { email, password } = userData;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = (user as any).toObject();
    return userWithoutPassword;
  }

  @Post("/login")
  async login(@Body() userData: CreateUserDto) {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      throw new NotFoundError("no user found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedError("invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "6d" }
    );

    return { token };
  }
}
