package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateCategoryRequest;
import vn.fruit.anna.dto.request.UpdateCategoryImageRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCategory(
            @RequestPart("category") @Valid CreateCategoryRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create category success",
                        categoryService.createCategory(request, imageFile))
        );
    }

    @PutMapping(value = "/{categoryId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCategoryImage(
            @PathVariable Integer categoryId,
            @RequestPart("imageFile") MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Category image updated successfully",
                        categoryService.updateCategoryImage(categoryId, imageFile))
        );
    }

    @PutMapping(value = "/update-images-by-ids", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMultipleCategoryImages(
            @RequestPart("requests") List<UpdateCategoryImageRequest> requests,
            @RequestPart("imageFiles") List<MultipartFile> imageFiles
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Category images updated successfully",
                        categoryService.updateMultipleCategoryImages(requests, imageFiles))
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
