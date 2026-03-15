import api from "./api";

const categoryApi = {
    // 1. Lấy tất cả danh mục active
    getAll: () => {
        return api.get("/categories");
    },

    // 2. Lấy chi tiết 1 danh mục
    getById: (id: any) => {
        return api.get(`/categories/${id}`);
    },

    // 3. Tạo danh mục mới (Yêu cầu quyền ADMIN trong Token)
    create: (data: any) => {
        return api.post("/categories", data);
    },

    // 4. Cập nhật danh mục (Yêu cầu quyền ADMIN)
    update: (id: any, data: any) => {
        return api.put(`/categories/${id}`, data);
    },

    // 5. Xóa mềm danh mục (Yêu cầu quyền ADMIN)
    delete: (id: any) => {
        return api.delete(`/categories/${id}`);
    }
};

export default categoryApi;