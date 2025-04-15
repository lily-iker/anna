package vn.fruit.anna.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Product;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    List<Product> findAllByThumbnailImageIsNotNull();
    @Query(value = "SELECT * FROM product " +
            "ORDER BY RAND() " +
            "LIMIT 12",
            nativeQuery = true)
    List<Product> findRandom12Products();

    @Query(value = "SELECT * FROM product " +
            "ORDER BY created_at DESC " +
            "LIMIT 8",
            nativeQuery = true)
    List<Product> find8NewestProducts();

    @EntityGraph(attributePaths = {"productImages"})
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

}
