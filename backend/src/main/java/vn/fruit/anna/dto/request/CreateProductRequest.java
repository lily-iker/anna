package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import vn.fruit.anna.enums.Unit;

@Getter
@Builder
public class CreateProductRequest {
    @NotBlank(message = "Product's name cannot be blank!")
    private String name;

    @NotBlank(message = "Product's origin cannot be blank!")
    private String origin;

    @NotBlank(message = "Product's description cannot be blank!")
    private String description;

    @Min(value = 1, message = "Original price must be at least 1!")
    private Double originalPrice;

    @Min(value = 0, message = "Selling price cannot be negative!")
    private Double sellingPrice;

    @Min(value = 0, message = "Discount percentage cannot be negative!")
    private Double discountPercentage;

    @NotNull(message = "Product's unit cannot be null!")
    private Unit unit;

    @Min(value = 0, message = "Stock cannot be negative!")
    private Integer stock;

    @Min(value = 1, message = "Minimum units to order must be at least 1!")
    private Integer minUnitToOrder;

    @NotBlank(message = "Product's category cannot be blank!")
    private String categoryName;
}
