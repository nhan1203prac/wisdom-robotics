package org.wisdom.WD01.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.OrderReponse;
import org.wisdom.WD01.Dto.OrderRequest;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.Order;
import org.wisdom.WD01.Enum.TargetType;
import org.wisdom.WD01.Service.OrderService;
import org.wisdom.WD01.Service.PaymentGateway;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentGateway paymentGateway;

    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(@RequestBody OrderRequest request,
                                                   @RequestParam String method) {

        Order order = orderService.createOrder(request);


        String paymentUrl = paymentGateway.create(
                TargetType.ORDER,
                order.getId(),
                order.getTotalPrice().longValue(),
                method.toUpperCase()
        );


        return ResponseEntity.ok(
                new ApiResponse(true, "Create order successful", paymentUrl)
        );
    }

    @PostMapping("/api/orders/checkout")
    public ResponseEntity<?> createOrderCheckOut(@RequestBody OrderRequest request) {
        // 1. Tạo bản ghi mới vào bảng Orders với status_id = 1 (PENDING)
        // 2. Lưu chi tiết các item vào bảng Order_Items
        // 3. Nếu thanh toán online thành công -> Cập nhật status_id = 2
        // 4. Trả về ID đơn hàng để Frontend chuyển trang
        return ResponseEntity.ok(new MessageResponse("Đặt hàng thành công!"));
    }



}