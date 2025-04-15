package vn.fruit.anna.dto.response;


import lombok.Builder;
import lombok.Getter;
import vn.fruit.anna.enums.OrderStatus;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class OrderResponse {
    private UUID id;
    private Date estimatedDeliveryDate;
    private String note;
    private Double totalPrice;
    private OrderStatus status;
    private String customerName;
    private Date createdAt;
    private List<OrderItemResponse> items;
}