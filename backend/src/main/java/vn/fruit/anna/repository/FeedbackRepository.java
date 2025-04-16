package vn.fruit.anna.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Page<Feedback> findByProductNameContainingIgnoreCase(String name, Pageable pageable);
}
