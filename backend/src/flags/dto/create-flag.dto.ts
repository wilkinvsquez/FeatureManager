import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateFlagDto {
    @IsString()
    @IsNotEmpty()
    keyname: string;

    @IsNotEmpty()
    value: any;

    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @IsString()
    @IsOptional()
    description?: string;
}  