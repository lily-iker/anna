package vn.fruit.anna.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Builder
@Getter
public class CustomerResponse {
    private UUID id;
    private String name;
    private String phoneNumber;
    private String address;
    private String email;
    private Integer totalOrders;
}
