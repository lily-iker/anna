package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateProductRequest;
import vn.fruit.anna.dto.filter.ProductFilter;
import vn.fruit.anna.dto.request.ListProductsByIdsRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.ProductService;

import java.util.UUID;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") @Valid CreateProductRequest request,
            @RequestPart("imageFile") MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create product success",
                        productService.createProduct(request, imageFile)));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable("id") UUID id,
            @RequestPart("product") @Valid CreateProductRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Update product success",
                        productService.updateProduct(id, request, imageFile)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Get product by ID success",
                        productService.getProductById(id)
                )
        );
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

    @PostMapping("/get-by-ids")
    public ResponseEntity<?> getProductsByIds(@RequestBody ListProductsByIdsRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Products fetched successfully",
                        productService.getProductsByIds(request)));
    }

    @DeleteMapping("/delete-by-ids")
    public ResponseEntity<?> deleteProductsByIds(@RequestBody ListProductsByIdsRequest request) {
        productService.deleteProductsByIds(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Products deleted successfully")
        );
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String categoryName,
            @RequestParam(defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(defaultValue = "desc", required = false) String direction
    ) {
        ProductFilter filter = new ProductFilter();
        filter.setName(name);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setCategoryName(categoryName);

        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Products searched successfully",
                        productService.searchProducts(filter, page, size, sortBy, direction)));
    }

}
