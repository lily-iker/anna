package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateBannerRequest {

    @NotBlank(message = "Name cannot be blank!")
    private String title;

    @NotBlank(message = "Image URL cannot be blank!")
    private String thumbnailImage;
}
