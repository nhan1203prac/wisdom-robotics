package org.wisdom.WD01.Dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderReponse {

    private Long orderId;

    private Long userId;

    private String status;

    private BigDecimal totalPrice;

    private List<OrderItemResponse> items;

}
