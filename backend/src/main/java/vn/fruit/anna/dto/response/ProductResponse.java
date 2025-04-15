package vn.fruit.anna.dto.response;

import lombok.*;
import vn.fruit.anna.enums.Unit;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String origin;
    private String description;
    private String thumbnailImage;
    private Double originalPrice;
    private Double sellingPrice;
    private Double discountPercentage;
    private Unit unit;
    private Integer stock;
    private Integer minUnitToOrder;
    private String categoryName;
}
