package vn.fruit.anna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Product;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findAllByThumbnailImageIsNotNull();
    @Query(value = "SELECT * FROM product " +
            "WHERE thumbnail_image IS NOT NULL " +
            "ORDER BY RAND() " +
            "LIMIT 12",
            nativeQuery = true)
    List<Product> findRandom12Products();

    @Query(value = "SELECT * FROM product " +
            "WHERE thumbnail_image IS NOT NULL " +
            "ORDER BY created_at DESC " +
            "LIMIT 8",
            nativeQuery = true)
    List<Product> find8NewestProducts();
}
