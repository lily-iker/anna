package vn.fruit.anna.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class OrderItemResponse {
    private UUID id;
    private UUID productId;
    private String productName;
    private String productOrigin;
    private Double productSellingPrice;
    private Double productDiscountPercentage;
    private Integer quantity;
    private Double price;
}
