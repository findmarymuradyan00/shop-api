import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { timestamps: true } }) 

export class User {
    @prop({required:true})
    email!:string;

    @prop({required:true, minlength:6})
    password!:string;
}


export const UserModel = getModelForClass(User);