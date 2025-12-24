import { PartialType } from '@nestjs/mapped-types';
import { CreateFlagDto } from './create-flag.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFlagDto extends PartialType(CreateFlagDto) {
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
