package vn.fruit.anna.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import vn.fruit.anna.enums.Unit;

import java.sql.Types;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(Types.VARCHAR)
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailImage;

    private Double originalPrice;

    private Double discountPrice;

    private Double minPrice;

    private Double maxPrice;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    private Integer stock;

    private Integer minUnitToOrder;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> productImages = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}
