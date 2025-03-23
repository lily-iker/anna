package vn.fruit.anna.model;

import jakarta.persistence.*;
import lombok.*;
import vn.fruit.anna.enums.RoleName;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();
}
