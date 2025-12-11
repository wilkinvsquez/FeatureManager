import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    @IsNotEmpty()
    defaultVariant: string;

    @IsArray()
    @IsNotEmpty()
    rules?: Record<string, any>[];
}
