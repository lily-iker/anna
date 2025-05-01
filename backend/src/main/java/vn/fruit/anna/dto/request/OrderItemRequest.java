package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class OrderItemRequest {
    private UUID productId;
    private Integer quantity;
}
