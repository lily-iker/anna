package vn.fruit.anna.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateProductRequest;
import vn.fruit.anna.dto.request.ListProductsByIdsRequest;
import vn.fruit.anna.dto.filter.ProductFilter;
import vn.fruit.anna.dto.response.ProductResponse;
import vn.fruit.anna.exception.ResourceNotFoundException;
import vn.fruit.anna.model.Category;
import vn.fruit.anna.model.OrderItem;
import vn.fruit.anna.model.Product;
import vn.fruit.anna.model.ProductImage;
import vn.fruit.anna.repository.CategoryRepository;
import vn.fruit.anna.repository.ProductRepository;
import vn.fruit.anna.repository.specification.ProductSpecification;

import java.io.IOException;
import java.util.*;
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
    public ProductResponse createProduct(CreateProductRequest request,
                                         MultipartFile thumbnailImageFile,
                                         List<MultipartFile> imageFiles) {

        Optional<Product> existingProduct = productRepository.findByNameExactIgnoreCase(request.getName());
        if (existingProduct.isPresent()) {
            throw new IllegalArgumentException("Product with this name already exists!");
        }

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found!"));

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

        if (thumbnailImageFile != null && !thumbnailImageFile.isEmpty()) {
            try {
                String thumbnailImageUrl = cloudinaryService.uploadImage(thumbnailImageFile);
                product.setThumbnailImage(thumbnailImageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error uploading thumbnail image to Cloudinary", e);
            }
        }

        List<ProductImage> productImages = new ArrayList<>();
        if (imageFiles != null && !imageFiles.isEmpty()) {
            try {
                for (MultipartFile imageFile : imageFiles) {
                    String imageUrl = cloudinaryService.uploadImage(imageFile);
                    ProductImage productImage = ProductImage.builder()
                            .image(imageUrl)
                            .product(product)
                            .build();
                    productImages.add(productImage);
                }
            } catch (IOException e) {
                throw new RuntimeException("Error uploading product images to Cloudinary", e);
            }
        }

        product.setProductImages(productImages);

        productRepository.save(product);

        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id,
                                         CreateProductRequest request,
                                         MultipartFile thumbnailImageFile,
                                         List<MultipartFile> imageFiles) {
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

        String oldThumbnailUrl = existingProduct.getThumbnailImage();

        if (thumbnailImageFile != null && !thumbnailImageFile.isEmpty()) {
            try {
                // Upload the new thumbnail image
                String newThumbnailImageUrl = cloudinaryService.uploadImage(thumbnailImageFile);
                existingProduct.setThumbnailImage(newThumbnailImageUrl);

                // Delete the old thumbnail image from Cloudinary
                if (oldThumbnailUrl != null && !oldThumbnailUrl.isBlank()) {
                    String publicId = cloudinaryService.getPublicIdFromUrl(oldThumbnailUrl);
                    cloudinaryService.deleteAsset(publicId);
                }
            } catch (IOException e) {
                throw new IllegalArgumentException("Error uploading new thumbnail image to Cloudinary", e);
            }
        }

        // Handle product images - first detach all existing images to avoid orphan deletion issues
        List<ProductImage> existingImages = new ArrayList<>(existingProduct.getProductImages());

        // Get the list of remaining image IDs from the request
        List<String> removedImageUrls = request.getRemovedImageUrls();

        // Remove images that are marked for deletion
        if (removedImageUrls != null && !removedImageUrls.isEmpty()) {
            for (ProductImage image : existingImages) {
                if (removedImageUrls.contains(image.getImage())) {
                    existingProduct.getProductImages().remove(image);

                    // Delete images that are no longer needed
                    try {
                        String publicId = cloudinaryService.getPublicIdFromUrl(image.getImage());
                        cloudinaryService.deleteAsset(publicId);
                    }
                    catch (Exception e) {
                        log.error("Error deleting image from Cloudinary: {}", e.getMessage());
                    }
                }
            }
        }

        // Add new images if any
        if (imageFiles != null && !imageFiles.isEmpty()) {
            try {
                for (MultipartFile imageFile : imageFiles) {
                    if (!imageFile.isEmpty()) {
                        String imageUrl = cloudinaryService.uploadImage(imageFile);
                        ProductImage productImage = ProductImage.builder()
                                .image(imageUrl)
                                .product(existingProduct)
                                .build();
                        existingProduct.getProductImages().add(productImage);
                    }
                }
            } catch (IOException e) {
                throw new IllegalArgumentException("Error uploading product images to Cloudinary", e);
            }
        }

        Product savedProduct = productRepository.save(existingProduct);

        return toResponse(savedProduct);
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


    public Page<?> searchProducts(ProductFilter filter, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        List<String> allowedSortFields = List.of("categoryName", "unit");
        if (!allowedSortFields.contains(sortBy)) {
            sortBy = "createdAt"; // fallback
        }
        Sort sort = Sort.by(sortDirection, sortBy);

        if (sortBy.equals("categoryName")) {
            sort = Sort.by(sortDirection, "category.name");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Product> spec = ProductSpecification.applyFilter(filter);
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private ProductResponse toResponse(Product product) {
        List<String> imageUrls = Optional.ofNullable(product.getProductImages())
                .orElse(Collections.emptyList())
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

    @Transactional
    public void updateStockBulk(List<OrderItem> orderItems) {
        for (OrderItem item : orderItems) {
            updateStock(item.getProductId(), item.getQuantity());
        }
    }

    public void updateStock(UUID productId, int quantityToReduce) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        int currentStock = Optional.ofNullable(product.getStock()).orElse(0);

        if (currentStock < quantityToReduce) {
            throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
        }

        product.setStock(currentStock - quantityToReduce);
    }

}
