/**
 * UI Component Style
 */
export interface UIComponentStyle {
    layout?: {
        type?: 'row' | 'column' | 'grid';
        columns?: number;
        justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
        gap?: string;
    };
    [key: string]: any;
}

/**
 * UI Component
 */
export interface UIComponent {
    type: string;
    title?: string;
    description?: string;

    // Generic properties
    props?: Record<string, any>;
    metadata?: Record<string, any>;

    // Styles
    style?: UIComponentStyle;

    // Recursive properties
    components?: UIComponent[];
    children?: UIComponent[];

    // Simple content
    text?: string;

    // Specific properties
    keyname?: string;
    options?: any[];
    value?: any;
}

/**
 * UI Component Schema
 */
export interface UIComponentSchema {
    id?: string;
    key: string;
    name: string;
    schema: UIComponent;
    version?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
