package vn.fruit.anna.dto.filter;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductFilter {
    private String name;
    private String origin;
    private Double minPrice;
    private Double maxPrice;
    private String categoryName;
}

