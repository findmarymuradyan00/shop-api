import { IsString,Min, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    title!:string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    price!:number ;

    @IsNumber()
    @Min(1)
    quantity!:number;

}