package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.fruit.anna.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @PostMapping("/create")
    public ResponseEntity<?> createFeedBack() {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create category success")
        );
    }
}
