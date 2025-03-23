package vn.fruit.anna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
