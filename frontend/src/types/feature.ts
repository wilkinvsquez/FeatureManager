export interface Feature {
    id?: string;
    key: string;
    description?: string;
    isActive: boolean;
    defaultVariant: string;
    rules?: Record<string, any>[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateFeatureDto {
    key: string;
    description?: string;
    isActive: boolean;
    defaultVariant: string;
    rules?: Record<string, any>[];
}