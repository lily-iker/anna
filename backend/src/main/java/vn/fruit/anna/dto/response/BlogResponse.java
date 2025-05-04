package vn.fruit.anna.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class BlogResponse {
    private Long id;
    private String title;
    private String sapo;
    private String thumbnailImage;
    private String content;
    private String author;
    private Date createdAt;
    private Long nextBlogId;
    private Long previousBlogId;
}