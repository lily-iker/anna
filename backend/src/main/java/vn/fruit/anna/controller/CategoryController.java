package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.request.CreateCategoryRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.CategoryService;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create category success",
                        categoryService.createCategory(request))
        );
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCategory() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get all category success",
                        categoryService.getAllCategory())
        );
    }
}
