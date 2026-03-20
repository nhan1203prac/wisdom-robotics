package org.wisdom.WD01.Config;

/**
 * Class chứa danh sách các URL API được phân quyền truy cập
 * theo từng role trong hệ thống (Anonymous, User, Student, Admin).
 *
 * Phiên bản này giữ nguyên phong cách liệt kê chi tiết từng endpoint giống mẫu gốc,
 * không dùng wildcard /** để đảm bảo chính xác và kiểm soát chặt chẽ.
 */
public class APIURL {

    // ==========================
    // Anonymous: Không cần token (Public)
    // ==========================
    // Các API GET cho người dùng không đăng nhập (public)
    public static final String[] URL_ANONYMOUS_GET = {
            "/api/test/test",
            "/api/danh-muc/all",
            "/api/danh-muc/{id}",
            "/api/danh-muc/danh-sach",
            "/api/danh-muc-dich-vu/all",
            "/api/danh-muc-dich-vu/{id}",
            "/api/danh-muc-dich-vu/getAll",
            "/api/san-pham/all",
            "/api/san-pham/{id}",
            "/api/san-pham/danh-sach",
            "/api/san-pham/sap-xep-like",
            "/api/san-pham/images/{filename:.+}",
            "/api/dich-vu/all",
            "/api/dich-vu/{id}",
            "/api/dich-vu/danh-sach",
            "/api/dich-vu/sap-xep-like",
            "/api/dich-vu/images/{filename:.+}",
            "/api/dich-vu/video/{filename:.+}",
            "/api/dich-vu/filter",
            "/api/dich-vu/getDeletedDichVu",
            "/api/dung-tich/{id}",
            "/api/dung-tich/all",
            "/api/dung-tich/danh-sach",
            "/api/dung-tich/findByCar/{id}",
            "/api/doi-xe/all",
            "/api/doi-xe/danh-sach",
            "/api/doi-xe/getDoiXeByCar/{id}",
            "/api/gia-dich-vu/all",
            "/api/gia-dich-vu/findByDichVu/{id}",
            "/api/xe/hang-xe/all",
            "/api/xe/hang-xe/danh-sach",
            "/api/xe/hang-xe/{id}",
            "/api/xe/hang-xe/findByDichVu/{id}",
            "/api/xe/loai-xe/all",
            "/api/xe/loai-xe/danh-sach",
            "/api/xe/loai-xe/{id}",
            "/api/xe/thong-tin/all",
            "/api/xe/thong-tin/{id}",
            "/api/xe/thong-tin/findByHangXe/{id}",
            "/api/xe/thong-tin/danh-sach",
            "/api/anh-xe/all",
            "/api/anh-xe/{id}",
            "/api/san-pham-cua-xe/by-xe/{id}",
            "/api/dich-vu-cua-xe/by-xe/{id}",
            "/api/danh-muc-video/{id}",
            "/api/danh-muc-video/all",
            "/api/video/{id}",
            "/api/video/all",
            "/api/banner/all/",
            "/api/banner/{id}",
            "/api/banner/getBannerByCategory",
            "/api/cua-hang/all",
            "/api/cua-hang/{id}",
            "/api/cua-hang/danh-sach",
            "/api/blog/all",
            "/api/blog/{id}",
            "/api/blog/getLatest/{id}",
            "/api/binh-luan-tin-tuc/all/{id}",
            "/api/tuyen-dung/all",
            "/api/tuyen-dung/{id}",
            "/api/cv/all",
            "/api/cv/{id}",
            "/api/nop_ho_so/all",
            "/api/nop_ho_so/{id}",
            "/api/bien-lai/findByDatLichId/{id}",
            "/api/bien-lai/findByDatlichShip/{id}",
            // Media public
            "/blog/{filename:.+}",
            "/slider/img/{filename:.+}",
            "/slider/video/{filename:.+}",
            "/uploads/xe/{filename:.+}",
            "/dichvu/img/{filename:.+}",
            "/dichvu/video/{filename:.+}",
            "/api/blog/{filename:.+}",
            "/api/uploads/xe/{filename:.+}",
            "/banner/{filename:.+}",
            "/video/{filename:.+}",
            "/sanpham/{filename:.+}",
            "/tuyen_dung/{filename:.+}",
            "/anh_tuyen_dung/{filename:.+}",
            "/cv/{filename:.+}"
    };

    // Các API POST cho người dùng không đăng nhập (public)
    public static final String[] URL_ANONYMOUS_POST = {
            "/api/account/login",
            "/api/account/register/user",
            "/api/account/register/student",
            "/api/account/forgot_password/**",
            "/api/account/send-reset-token",
            "/api/account/reset-password",
            "/api/san-pham/{id}/like",
            "/api/dich-vu/{id}/like",
            "/api/dat-lich/khach",
            "/api/dat-lich-ship/khach",
            "/api/maps/directions",
            "/api/lienhe"
    };

    // Các API PUT cho người dùng không đăng nhập
    public static final String[] URL_ANONYMOUS_PUT = {
    };

    // Các API DELETE cho người dùng không đăng nhập (hiện không có)
    public static final String[] URL_ANONYMOUS_DELETE = {};

    // ================
    // Role: USER
    // ================
    public static final String[] URL_USER_GET = {
            "/api/dat-lich/me",
            "/api/dat-lich/me/{id}",
            "/api/cv/yourCv",
            "/api/form-cv/yourFormCv",
            "/api/account/auth/me",
            "/api/nop_ho_so/yourUngTuyenList",
            "/cv/{filename:.+}"
    };

    public static final String[] URL_USER_POST = {
            "/api/dat-lich",
            "/api/dat-lich-ship",
            "/api/binh-luan-tin-tuc/create",
            "/api/cv/nop_cv",
            "/api/nop_ho_so/ung_tuyen",
            "/api/form-cv/cv",
            "/api/lienhe"
    };

    public static final String[] URL_USER_PUT = {
            "/api/cv/update/{id}",
            "/api/nop_ho_so/update/{id}",
            "/api/form-cv/update/{id}",
            "/api/account/change-password"  // Di chuyển từ anonymous để an toàn
    };

    public static final String[] URL_USER_DELETE = {};

    // ================
    // Role: STUDENT
    // ================
    public static final String[] URL_STUDENT_GET = {
            "/api/video/getVideoOfStudent",
            "/api/video/findLatestVideo"
    };

    public static final String[] URL_STUDENT_POST = {
            "/api/video/register/{id}",
            "/api/binh-luan-tin-tuc/create"
    };

    public static final String[] URL_STUDENT_PUT = {};

    public static final String[] URL_STUDENT_DELETE = {};

    // ================
    // Role: ADMIN
    // ================
    public static final String[] URL_ADMIN_GET = {
            "/api/form-cv/all",
            "/api/form-cv/{id}",
            "/api/dat-lich/all",
            "/api/dat-lich/{id}",
            "/api/dat-lich/findDatLichApproved",
            "/api/dat-lich-ship/all",
            "/api/dat-lich-ship/findDatLichShipApproved",
            "/api/nop_ho_so/Cv/{id}",
            "/api/nop_ho_so/FormCv/{id}",
            "/api/tuyen-dung/bin",
            "/api/cv/{filename:.+}",
            "/api/cv/**",
            "/api/form-cv",
            "/api/lienhe/**"
    };

    public static final String[] URL_ADMIN_POST = {
            "/api/danh-muc/create",
            "/api/danh-muc-dich-vu/create",
            "/api/san-pham/create",
            "/api/dich-vu/create",
            "/api/danh-muc-video/create",
            "/api/video/create",
            "/api/banner/create",
            "/api/cua-hang/create",
            "/api/xe/hang-xe/create",
            "/api/xe/loai-xe/create",
            "/api/xe/thong-tin/create",
            "/api/anh-xe/create",
            "/api/san-pham-cua-xe/update-list",
            "/api/dich-vu-cua-xe/update-list",
            "/api/blog/create",
            "/api/dung-tich/create",
            "/api/doi-xe/create",
            "/api/gia-dich-vu/create",
            "/api/bien-lai/create",
            "/api/tuyen-dung/luu-bai-viet",
            "/api/tuyen-dung-fakeDelete/{id}",
            "/anhTuyenDung/save",
            "/api/lienhe"
    };

    public static final String[] URL_ADMIN_PUT = {
            "/api/danh-muc/update/{id}",
            "/api/danh-muc-dich-vu/update/{id}",
            "/api/san-pham/update/{id}",
            "/api/dich-vu/update/{id}",
            "/api/danh-muc-video/update/{id}",
            "/api/video/update/{id}",
            "/api/cua-hang/update/{id}",
            "/api/xe/loai-xe/update/{id}",
            "/api/anh-xe/update/{id}",
            "/api/xe/thong-tin/update/{id}",
            "/api/tuyen-dung/update/{id}",
            "/api/tuyen-dung/restore/{id}",
            "/api/san-pham/{id}/status",
            "/api/san-pham/statusAll",
            "/api/dung-tich/update/{id}",
            "/api/doi-xe/update/{id}",
            "/api/banner/sort",
            "/api/dich-vu/softDelete/{id}",
            "/api/dich-vu/restore/{id}",
            "/api/dat-lich/approve/{id}",
            "/api/dat-lich/rejected/{id}",
            "/api/dat-lich-ship/approve/{id}",
            "/api/dat-lich-ship/rejected/{id}",
            "/api/bien-lai/update/{id}",
            "/api/lienhe/**"
    };

    public static final String[] URL_ADMIN_DELETE = {
            "/api/danh-muc/delete/{id}",
            "/api/gia-dich-vu/delete/{id}",
            "/api/san-pham/delete/{id}",
            "/api/dich-vu/delete/{id}",
            "/api/danh-muc-video/delete/{id}",
            "/api/video/delete/{id}",
            "/api/banner/delete/{id}",
            "/api/cua-hang/delete/{id}",
            "/api/xe/loai-xe/delete/{id}",
            "/api/xe/hang-xe/delete/{id}",
            "/api/xe/thong-tin/delete/{id}",
            "/api/anh-xe/delete/{id}",
            "/api/san-pham-cua-xe/delete-all/{id}",
            "/api/san-pham-cua-xe/delete-list/{id}",
            "/api/san-pham-cua-xe/delete/{id}/{id}",
            "/api/dich-vu-cua-xe/delete-all/{id}",
            "/api/dich-vu-cua-xe/delete-list/{id}",
            "/api/lienhe/**"
    };
}