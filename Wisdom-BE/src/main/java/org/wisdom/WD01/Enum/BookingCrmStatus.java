package org.wisdom.WD01.Enum;

import lombok.Getter;

@Getter
public enum BookingCrmStatus {
    NEW_LEAD("Khách hàng mới"),
    CONTACTED("Đã liên hệ tư vấn"),
    PROPOSAL_SENT("Đã gửi báo giá"),
    DEAL_WON("Chốt hợp đồng thành công"),
    DEAL_LOST("Thất bại/Hủy bỏ");

    private final String description;

    BookingCrmStatus(String description) {
        this.description = description;
    }
}