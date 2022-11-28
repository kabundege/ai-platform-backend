import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}