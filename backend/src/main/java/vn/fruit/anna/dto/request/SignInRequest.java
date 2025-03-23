package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Getter
@Builder
public class SignInRequest implements Serializable {
    @Size(min = 8, message = "Username must be at least 8 characters")
    private String username;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}