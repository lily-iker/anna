package vn.fruit.anna.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Getter
@Builder
public class SignInRequest implements Serializable {
    @Size(min = 8, message = "Email must be at least 8 characters")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}