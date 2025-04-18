package vn.fruit.anna.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import vn.fruit.anna.model.ProductImage;
import vn.fruit.anna.repository.CategoryRepository;
import vn.fruit.anna.repository.ProductRepository;
import vn.fruit.anna.repository.specification.ProductSpecification;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    @PersistenceContext
    private final EntityManager entityManager;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, MultipartFile imageFile) {

        Product existingProduct = productRepository.findByNameIgnoreCase(request.getName())
                .orElseThrow(() -> new IllegalArgumentException("Product already exists!"));

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found!"));

        // Build Product from the request
        Product product = Product.builder()
                .name(request.getName())
                .origin(request.getOrigin())
                .description(request.getDescription())
                .originalPrice(request.getOriginalPrice())
                .sellingPrice(request.getSellingPrice())
                .discountPercentage(request.getDiscountPercentage())
                .unit(request.getUnit())
                .stock(request.getStock())
                .minUnitToOrder(request.getMinUnitToOrder())
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                product.setThumbnailImage(imageUrl);


            } catch (IOException e) {
                throw new RuntimeException("Error uploading image to Cloudinary");
            }
        }

        // Save product to the database
        productRepository.save(product);

        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, CreateProductRequest request, MultipartFile imageFile) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found!"));

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found!"));

        existingProduct.setName(request.getName());
        existingProduct.setOrigin(request.getOrigin());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setOriginalPrice(request.getOriginalPrice());
        existingProduct.setSellingPrice(request.getSellingPrice());
        existingProduct.setDiscountPercentage(request.getDiscountPercentage());
        existingProduct.setUnit(request.getUnit());
        existingProduct.setStock(request.getStock());
        existingProduct.setMinUnitToOrder(request.getMinUnitToOrder());
        existingProduct.setCategory(category);

        String oldUrl = existingProduct.getThumbnailImage();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                existingProduct.setThumbnailImage(imageUrl);

                if (oldUrl != null && !oldUrl.isBlank()) {
                    String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                    cloudinaryService.deleteAsset(publicId);
                }
            } catch (IOException e) {
                throw new IllegalArgumentException("Error uploading image to Cloudinary");
            }
        }

        return toResponse(existingProduct);
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

        if (productIds == null || productIds.isEmpty()) {
            return;
        }

        List<Product> products = productRepository.findAllById(productIds);

        if (products.isEmpty()) {
            return;
        }

        for (Product product : products) {
            String oldUrl = product.getThumbnailImage();

            if (oldUrl != null && !oldUrl.isBlank()) {
                String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                if (publicId != null && !publicId.isBlank()) {
                    try {
                        cloudinaryService.deleteAsset(publicId);
                    }
                    catch (IOException e) {
                        throw new RuntimeException("Error deleting image from Cloudinary");
                    }
                }
            }
        }

        // More type-safe way to delete
        int deletedCount = entityManager.createQuery("DELETE FROM Product p WHERE p.id IN :productIds")
                .setParameter("productIds", productIds)
                .executeUpdate();

//        String inClause = productIds.stream()
//                .map(id -> "'" + id + "'")
//                .collect(Collectors.joining(","));
//        Query query = entityManager.createNativeQuery("DELETE FROM product WHERE id IN (" + inClause + ")");
//        int deletedCount = query.executeUpdate();

        log.info("Deleted {} products in a single operation", deletedCount);
    }


    public Page<?> searchProducts(ProductFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = ProductSpecification.applyFilter(filter);
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private ProductResponse toResponse(Product product) {
        List<String> imageUrls = Optional.ofNullable(product.getProductImages())
                .orElse(Collections.emptySet())
                .stream()
                .map(ProductImage::getImage)
                .toList();

        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;

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
                .categoryName(categoryName)
                .images(imageUrls)
                .build();
    }


}
