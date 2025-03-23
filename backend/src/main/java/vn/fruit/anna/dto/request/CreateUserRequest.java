package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import vn.fruit.anna.enums.RoleName;

@Getter
@Builder
public class CreateUserRequest {

    @NotBlank(message = "Full name cannot be blank!")
    private String fullName;

    @NotBlank(message = "Email cannot be blank!")
    @Email(message = "Invalid email format!")
    private String email;

    @NotBlank(message = "Username cannot be blank!")
    @Size(min = 5, max = 15, message = "Username must be between 5 and 15 characters!")
    private String username;

    @NotBlank(message = "Password cannot be blank!")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters!")
    private String password;

    @NotBlank(message = "Role cannot be blank!")
    private RoleName role;
}
