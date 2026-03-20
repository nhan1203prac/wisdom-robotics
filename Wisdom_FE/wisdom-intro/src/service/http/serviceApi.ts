import axios from "axios";
import { Service } from "../../types/service.type";
import { ApiResponse } from "../../types/apiResponse.type";

const API = "http://localhost:8080/api/services";

export const getServices = async (): Promise<Service[]> => {
  const res = await axios.get<ApiResponse<Service[]>>(API);
  return res.data.data;
};

// CREATE
export const createService = async (formData: FormData) => {

  const response = await axios.post(
    "http://localhost:8080/api/services",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// UPDATE
export const updateService = (id: number, formData: FormData) => {
  return axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
export const deleteService = async (id: number): Promise<void> => {
  await axios.delete(`${API}/${id}`);
};
export const searchService = async (keyword: string): Promise<Service[]> => {
  const res = await axios.get<ApiResponse<Service[]>>(`${API}/search?keyword=${keyword}`);
  return res.data.data;
};