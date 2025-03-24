package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import vn.fruit.anna.enums.BannerType;

@Getter
@Builder
public class CreateBannerRequest {

    @NotBlank(message = "Name cannot be blank!")
    private String title;

    @NotBlank(message = "Image URL cannot be blank!")
    private String thumbnailImage;

    @NotBlank(message = "Banner Type cannot be blank!")
    private BannerType bannerType;
}
