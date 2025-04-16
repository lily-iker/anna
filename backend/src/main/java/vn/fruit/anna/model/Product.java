package vn.fruit.anna.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import vn.fruit.anna.enums.Unit;

import java.sql.Types;
import java.util.*;

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

    private String origin;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailImage;

    private Double originalPrice;

    private Double sellingPrice;

    private Double discountPercentage;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    private Integer stock;

    private Integer minUnitToOrder;

    @BatchSize(size = 20)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<ProductImage> productImages = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}
