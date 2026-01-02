import type { UIComponent } from "./ui-component";

export interface Asset {
    id: string;
    key: string;
    schema: UIComponent;
    isActive: boolean;
    version: number;
}