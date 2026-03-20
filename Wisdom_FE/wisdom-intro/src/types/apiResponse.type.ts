export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  role: string | null;
}