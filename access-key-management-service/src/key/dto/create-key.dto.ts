import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateKeyDto {
    @IsString()
    readonly userId: string;

    @IsString()
    @IsNotEmpty()
    readonly key: string;

    @IsNumber()
    readonly rateLimit: number;

    @IsNotEmpty()
    readonly expiration: Date;

    @IsBoolean()
    readonly isActive: Boolean;
}