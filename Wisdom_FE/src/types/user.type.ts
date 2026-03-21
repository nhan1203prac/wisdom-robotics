
export interface Role {
  id?: number;
  roleName: string
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string; 
  role: Role;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'; 
  createdAt: string;
}