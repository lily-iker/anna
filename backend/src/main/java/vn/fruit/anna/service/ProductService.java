package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateProductRequest;
import vn.fruit.anna.dto.request.ListProductsByIdsRequest;
import vn.fruit.anna.dto.filter.ProductFilter;
import vn.fruit.anna.dto.response.ProductResponse;
import vn.fruit.anna.model.Category;
import vn.fruit.anna.model.Product;
import vn.fruit.anna.repository.CategoryRepository;
import vn.fruit.anna.repository.ProductRepository;
import vn.fruit.anna.repository.specification.ProductSpecification;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, MultipartFile imageFile) {

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found!"));

        // Build Product from the request
        Product product = Product.builder()
                .name(request.getName())
                .origin(request.getOrigin())
                .description(request.getDescription())
//                .thumbnailImage(request.getThumbnailImage())
                .originalPrice(request.getOriginalPrice())
                .sellingPrice(request.getSellingPrice())
                .discountPercentage(request.getDiscountPercentage())
                .unit(request.getUnit())
                .stock(request.getStock())
                .minUnitToOrder(request.getMinUnitToOrder())
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            // TODO: Save image to cloud and set image URL/path
            System.out.println("Updating image file: " + imageFile.getOriginalFilename());
            // example: product.setThumbnailImage("https://cdn.com/new-image.jpg");
        }

        // Save product to the database
        productRepository.save(product);

        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, CreateProductRequest request, MultipartFile imageFile) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found!"));

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found!"));

        existing.setName(request.getName());
        existing.setOrigin(request.getOrigin());
        existing.setDescription(request.getDescription());
        existing.setOriginalPrice(request.getOriginalPrice());
        existing.setSellingPrice(request.getSellingPrice());
        existing.setDiscountPercentage(request.getDiscountPercentage());
        existing.setUnit(request.getUnit());
        existing.setStock(request.getStock());
        existing.setMinUnitToOrder(request.getMinUnitToOrder());
        existing.setCategory(category);

        if (imageFile != null && !imageFile.isEmpty()) {
            // TODO: Save image to cloud and set image URL/path
            System.out.println("Updating image file: " + imageFile.getOriginalFilename());
            // example: existing.setThumbnailImage("https://cdn.com/new-image.jpg");
        }

        return toResponse(existing);
    }



    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return toResponse(product);
    }

    public List<?> getAllProduct() {
        return productRepository.findAllByThumbnailImageIsNotNull().stream().map(this::toResponse).toList();
    }

    public List<?> getRandom12Products() {
        return productRepository.findRandom12Products().stream().map(this::toResponse).toList();
    }

    public List<?> get8NewestProducts() {
        return productRepository.find8NewestProducts().stream().map(this::toResponse).toList();
    }

    public List<?> getProductsByIds(ListProductsByIdsRequest request) {
        List<UUID> productIds = request.getProductIds();

        return productRepository.findAllById(productIds).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteProductsByIds(ListProductsByIdsRequest request) {
        List<UUID> productIds = request.getProductIds();

        List<Product> products = productRepository.findAllById(productIds);

        if (!products.isEmpty()) {
            productRepository.deleteAll(products);
        }
    }

    public Page<?> searchProducts(ProductFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = ProductSpecification.applyFilter(filter);
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .origin(product.getOrigin())
                .description(product.getDescription())
                .thumbnailImage(product.getThumbnailImage())
                .originalPrice(product.getOriginalPrice())
                .sellingPrice(product.getSellingPrice())
                .discountPercentage(product.getDiscountPercentage())
                .unit(product.getUnit())
                .stock(product.getStock())
                .minUnitToOrder(product.getMinUnitToOrder())
                .categoryName(product.getCategory().getName())
                .build();
    }


}
