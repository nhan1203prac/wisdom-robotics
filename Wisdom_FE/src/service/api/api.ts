import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // ĐÃ CÓ – giữ nguyên
  headers: {
<<<<<<< HEAD:Wisdom_FE/src/service/api/api.ts
    "Content-Type": "application/json",
  },
});
=======
    "Content-Type": "application/json"
  },
  withCredentials: true
});



>>>>>>> 647c875 (complete module posting):Wisdom_FE/wisdom-intro/src/service/api/api.ts
export default api;