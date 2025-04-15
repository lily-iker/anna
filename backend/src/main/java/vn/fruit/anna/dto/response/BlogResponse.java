package vn.fruit.anna.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class BlogResponse {
    private Long id;
    private String title;
    private String thumbnailImage;
    private String sapo;
    private String content;
    private String author;
    private Date createdAt;
}