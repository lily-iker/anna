package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateCategoryImageRequest {
    private Integer categoryId;
}
