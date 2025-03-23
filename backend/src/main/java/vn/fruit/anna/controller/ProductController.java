package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.request.CreateProductRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.ProductService;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create product success",
                        productService.createProduct(request)));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProduct() {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Get all product success",
                        productService.getAllProduct()));
    }
}
