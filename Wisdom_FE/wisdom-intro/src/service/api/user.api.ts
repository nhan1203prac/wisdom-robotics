import api from "./api";

const userApi = {
    getMe: () => {
        return api.get("/user"); 
    }
};

export default userApi;