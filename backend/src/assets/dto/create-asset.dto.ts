import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAssetDto {
    @IsString()
    @IsNotEmpty()
    key: string;
    @IsObject()
    @IsNotEmpty()
    schema: object;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    @IsNumber()
    @IsOptional()
    version?: number = 1;
}