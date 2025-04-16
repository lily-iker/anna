package vn.fruit.anna.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.request.CreateFeedbackRequest;
import vn.fruit.anna.dto.request.ListFeedbacksByIdsRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/create")
    public ResponseEntity<?> createFeedback(@RequestBody CreateFeedbackRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Gửi đánh giá thành công",
                        feedbackService.createFeedback(request))
        );
    }

    @DeleteMapping("/delete-by-ids")
    public ResponseEntity<?> deleteFeedbacks(@RequestBody ListFeedbacksByIdsRequest request) {
        feedbackService.deleteFeedbacksByIds(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Xóa đánh giá thành công")
        );
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFeedbacks(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Lấy danh sách đánh giá thành công",
                        feedbackService.searchFeedbacks(name, page, size))
        );
    }
}
