package vn.fruit.anna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
}
