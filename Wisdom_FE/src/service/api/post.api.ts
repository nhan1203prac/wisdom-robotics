import api from "./api";

const postApi = {
    // 1. Lấy danh sách bài viết (có thể truyền params để phân trang)
    getAll: (params?:any) => {
        return api.get("/posts", { params });
    },

    // 2. Lấy chi tiết 1 bài viết
    getById: (id:any) => {
        return api.get(`/posts/${id}`);
    },

    // 3. Tạo bài viết mới
    create: (data:any) => {
        return api.post("/posts", data);
    },

    update: (id: any, data: any) => {
        return api.put(`/posts/${id}`, data);
    },

    delete: (id: any) => {
        return api.delete(`/posts/${id}`);
    },

    // 4. Toggle trạng thái (Nhận về PostStatResponse để FE thay thế data cũ)
    // feature truyền vào: 'POST', 'COMMENT', hoặc 'REACT'
    toggleStatus: (id: number, feature: 'POST' | 'COMMENT' | 'REACT' = 'POST') => {
        return api.patch(`/posts/${id}/toggle`, null, { params: { feature } });
    },

    // 5. Thả cảm xúc Like/Dislike (Nhận về PostStatResponse)
    react: (id:any, type:any) => {
        // type là 'LIKE' hoặc 'DISLIKE' - khớp với RequestParam bên Spring Boot
        return api.post(`/posts/${id}/react`, null, { params: { type } });
    },

    // 6. Đánh giá sao (Nhận về PostStatResponse)
    rate: (id:any, stars:any) => {
        return api.post(`/posts/${id}/rate`, null, { params: { stars } });
    },

    // 7. Lấy danh sách comment gốc của bài viết (Phân trang)
    getComments: (postId: number, page: number = 0, size: number = 10) => {
        // Khớp với @GetMapping("/post/{postId}") trong CommentController
        return api.get(`/comments/post/${postId}`, { params: { page, size } });
    },

    // 8. Gửi comment mới (hoặc reply)
    // Nếu là comment gốc thì parentId để null
    comment: (postId: number, content: string, parentId?: number) => {
        // Khớp với @PostMapping("/{postId}") trong CommentController
        // Vì Backend dùng @RequestBody String content, ta gửi trực tiếp chuỗi content
        return api.post(`/comments/${postId}`, content, {
            params: { parentId },
            headers: { "Content-Type": "text/plain" } // Quan trọng vì BE nhận String thuần
        });
    },

    // 9. Lấy danh sách các câu trả lời của 1 comment cha
    getReplies: (parentId: number, page: number = 0, size: number = 10) => {
        // Khớp với @GetMapping("/{parentId}/replies")
        return api.get(`/comments/${parentId}/replies`, { params: { page, size } });
    },

    // 10. React cho comment (Like/Dislike comment)
    reactToComment: (commentId: number, type: 'LIKE' | 'DISLIKE') => {
        // Khớp với @PostMapping("/{commentId}/react")
        return api.post(`/comments/${commentId}/react`, null, { params: { type } });
    }
};

export default postApi;