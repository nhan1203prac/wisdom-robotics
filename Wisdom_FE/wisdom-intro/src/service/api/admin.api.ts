import api from "./api";

/* GET EMPLOYEES */

export const getEmployees = () => {
  return api.get("/admin/employees");
};

/* GET EMPLOYEE BY ID */

export const getEmployeeById = (id:number) => {
  return api.get(`/admin/employees/${id}`);
};

/* CREATE EMPLOYEE */

export const createEmployee = (data:unknown) => {
  return api.post("/admin/create-employee", data);
};

/* UPDATE EMPLOYEE */

export const updateEmployee = (id:number,data:unknown) => {
  return api.put(`/admin/employees/update/${id}`, data);
};

/* DELETE EMPLOYEE */

export const deleteEmployee = (id:number) => {
  return api.delete(`/admin/employees/delete/${id}`);
};