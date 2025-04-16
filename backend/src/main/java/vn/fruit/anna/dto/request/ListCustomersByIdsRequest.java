package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class ListCustomersByIdsRequest {
    private List<UUID> customerIds;
}
