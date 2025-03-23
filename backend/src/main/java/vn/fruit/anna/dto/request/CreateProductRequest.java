package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import vn.fruit.anna.enums.Unit;

import java.util.Set;

@Getter
@Builder
public class CreateProductRequest {
    @NotBlank(message = "Product's name cannot be blank!")
    private String name;

    @NotBlank(message = "Product's description cannot be blank!")
    private String description;

    private String thumbnailImage;

    @Min(value = 1, message = "Original price must be at least 1!")
    private Double originalPrice;

    @Min(value = 0, message = "Discount price cannot be negative!")
    private Double discountPrice;

    @Min(value = 1, message = "Minimum price must be at least 1!")
    private Double minPrice;

    @Min(value = 1, message = "Maximum price must be at least 1!")
    private Double maxPrice;

    @NotNull(message = "Product's unit cannot be null!")
    private Unit unit;

    @Min(value = 0, message = "Stock cannot be negative!")
    private Integer stock;

    @Min(value = 1, message = "Minimum units to order must be at least 1!")
    private Integer minUnitToOrder;

//    @NotEmpty(message = "Product images must include at least 1 image ID!")
//    private Set<Long> productImageIds;
//
//    @NotNull(message = "Category ID cannot be null!")
//    private Long categoryId;
}
