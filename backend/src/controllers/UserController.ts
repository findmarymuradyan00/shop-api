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
} from "routing-controllers";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { AuthMiddleware, type JwtPayload } from "../middlewares/auth";

@JsonController("/users")
@UseBefore(AuthMiddleware)
export class UserController {
  @Get("/")
  async getAll() {
    return UserModel.find();
  }

  @Get("/:id")
  async getOne(@Param("id") _id: string) {
    const user = await UserModel.findById(_id);

    if (!user) {
      throw new NotFoundError("no user found");
    }

    return user;
  }

  @Delete("/:id")
  async deleteOne(@Param("id") _id: string, @Req() req: any) {
    const auth = req.user as JwtPayload;
    if (auth.userId !== _id) {
      throw new ForbiddenError("you can only delete your own account");
    }

    const deletedUser = await UserModel.findByIdAndDelete(_id);
    if (!deletedUser) {
      throw new NotFoundError("delete failed. No user found");
    }
    return deletedUser;
  }

  @Patch("/:id")
  async updateOne(
    @Param("id") _id: string,
    @Body() userData: Partial<CreateUserDto>,
    @Req() req: any
  ) {
    const auth = req.user as JwtPayload;
    if (auth.userId !== _id) {
      throw new ForbiddenError("you can only update your own account");
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(_id, userData, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundError("No user found");
    }

    return updatedUser;
  }
}
