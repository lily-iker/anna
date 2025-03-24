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
                new ApiResponse<>(200,
                        "Get all product success",
                        productService.getAllProduct()));
    }

    @GetMapping("/random-12")
    public ResponseEntity<?> getRandom12Products() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get random 12 products success",
                        productService.getRandom12Products()));
    }

    @GetMapping("/newest-8")
    public ResponseEntity<?> get8NewestProducts() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get 8 newest products success",
                        productService.get8NewestProducts()));
    }
}
