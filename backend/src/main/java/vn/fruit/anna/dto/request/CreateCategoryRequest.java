package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCategoryRequest {

    @NotBlank(message = "Category name cannot be blank!")
    private String name;

    private String thumbnailImage;
}