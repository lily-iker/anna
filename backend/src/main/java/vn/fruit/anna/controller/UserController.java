package vn.fruit.anna.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/my-account")
    public ResponseEntity<?> getMyAccount() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get my account success",
                        userService.getMyAccount()));
    }
}
