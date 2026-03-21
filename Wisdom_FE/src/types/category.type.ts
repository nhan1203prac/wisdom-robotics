export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;   
    enabled: boolean; 
}

export interface CategoryRequest {
    name: string;
    description?: string;
    icon?: string;
}