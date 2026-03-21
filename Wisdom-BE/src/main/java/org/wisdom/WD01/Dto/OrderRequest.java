package org.wisdom.WD01.Dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrderRequest {

    private Long userId;

    private Long statusId;

    private LocalDateTime bookingDate;

    private List<OrderItemRequest> items;
}