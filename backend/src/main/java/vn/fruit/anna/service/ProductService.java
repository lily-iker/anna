package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fruit.anna.dto.request.CreateProductRequest;
import vn.fruit.anna.model.Product;
import vn.fruit.anna.repository.ProductRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    @Transactional
    public Product createProduct(CreateProductRequest request) {

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .thumbnailImage(request.getThumbnailImage())
                .originalPrice(request.getOriginalPrice())
                .discountPrice(request.getDiscountPrice())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .unit(request.getUnit())
                .stock(request.getStock())
                .minUnitToOrder(request.getMinUnitToOrder())
                .build();

        productRepository.save(product);

        return product;
    }

    public List<Product> getAllProduct() {
        return productRepository.findAllByThumbnailImageIsNotNull();
    }


}
