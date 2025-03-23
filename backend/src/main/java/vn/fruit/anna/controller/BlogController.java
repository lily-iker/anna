package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.request.CreateBlogRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.BlogService;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping("/create")
    public ResponseEntity<?> createBlog(@Valid @RequestBody CreateBlogRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(201, "Create blog success", blogService.createBlog(request))
        );
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllBlogs() {
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Get all blogs success", blogService.getAllBlogs())
        );
    }
}
