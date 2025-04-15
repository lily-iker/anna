package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ListBlogsByIdsRequest {
    private List<Long> blogIds;
}