package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;
import vn.fruit.anna.enums.OrderStatus;

@Getter
@Builder
public class UpdateOrderStatusRequest {
    private OrderStatus newStatus;
}
