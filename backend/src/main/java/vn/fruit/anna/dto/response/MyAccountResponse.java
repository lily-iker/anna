package vn.fruit.anna.dto.response;

import lombok.*;
import vn.fruit.anna.enums.RoleName;

import java.util.UUID;

@Getter
@Builder
public class MyAccountResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String username;
    private RoleName role;
}
