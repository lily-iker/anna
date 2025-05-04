package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateBlogRequest;
import vn.fruit.anna.dto.request.ListBlogsByIdsRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.BlogService;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(@RequestPart("blog") @Valid CreateBlogRequest request,
                                        @RequestPart("imageFile") MultipartFile imageFile) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create blog success",
                        blogService.createBlog(request, imageFile))
        );
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable("id") Long id,
            @RequestPart("blog") @Valid CreateBlogRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Update blog success",
                        blogService.updateBlog(id, request, imageFile))
        );
    }

    @DeleteMapping("/delete-by-ids")
    public ResponseEntity<?> deleteBlogsByIds(@RequestBody ListBlogsByIdsRequest request) {
        blogService.deleteBlogsByIds(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Blogs deleted successfully")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Blog retrieved successfully",
                        blogService.getBlogById(id))
        );
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBlogs(
            @RequestParam(required = false, defaultValue = "") String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(defaultValue = "desc", required = false) String direction
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Blogs searched successfully",
                        blogService.searchBlogs(title, page, size, sortBy, direction))
        );
    }
}
