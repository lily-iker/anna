package vn.fruit.anna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fruit.anna.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
