package vn.fruit.anna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
}
