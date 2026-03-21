package org.wisdom.WD01.Dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class OrderItemRequest {

    private Long serviceId;

    private int quantity;
}