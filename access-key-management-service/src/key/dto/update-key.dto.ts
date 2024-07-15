import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateKeyDto {
    @IsNumber()
    readonly rateLimit?: number;

    @IsNotEmpty()
    readonly expiration?: Date;

    @IsString()
    readonly key?: string;

    @IsBoolean()
    readonly isActive?: Boolean;
}