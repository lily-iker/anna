package vn.fruit.anna.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Blog;

import java.util.Date;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query(value = """
        SELECT b.id FROM blog b 
        WHERE b.created_at < :createdAt 
        ORDER BY b.created_at DESC 
        LIMIT 1
        """, nativeQuery = true)
    Optional<Long> findNextBlogId(@Param("createdAt") Date createdAt);

    @Query(value = """
        SELECT b.id FROM blog b 
        WHERE b.created_at > :createdAt 
        ORDER BY b.created_at ASC 
        LIMIT 1
        """, nativeQuery = true)
    Optional<Long> findPreviousBlogId(@Param("createdAt") Date createdAt);
}
