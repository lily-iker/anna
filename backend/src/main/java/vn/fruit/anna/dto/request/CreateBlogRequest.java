package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateBlogRequest {

    @NotBlank(message = "Title cannot be blank!")
    private String title;

    @NotBlank(message = "Sapo cannot be blank!")
    private String sapo;

    @NotBlank(message = "Content cannot be blank!")
    private String content;

    @NotBlank(message = "Author cannot be blank!")
    private String author;
}
