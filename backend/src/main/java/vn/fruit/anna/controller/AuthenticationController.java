package vn.fruit.anna.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.fruit.anna.dto.request.CreateBannerRequest;
import vn.fruit.anna.dto.request.SignInRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody SignInRequest request,
                                   @NonNull HttpServletResponse response) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Login success",
                        authenticationService.authenticate(request, response))
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Refresh success",
                        authenticationService.refresh(request, response))
        );
    }
}
