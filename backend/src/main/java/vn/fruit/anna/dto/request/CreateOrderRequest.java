package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.List;

@Getter
@Builder
public class CreateOrderRequest {
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private String customerEmail;
    private String note;
    private Date estimatedDeliveryDate;
    private List<OrderItemRequest> orderItemRequests;
}
